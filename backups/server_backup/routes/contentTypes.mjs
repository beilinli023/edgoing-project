import express from 'express';
import db from '../db/index.mjs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 初始内容类型 - 仅在数据库中没有内容类型时使用
const initialContentType = {
  id: uuidv4(),
  name: "blog",
  schema: {
    fields: [
      {
        name: "title",
        type: "string",
        required: true,
        label: "标题"
      },
      {
        name: "content",
        type: "richtext",
        required: true,
        label: "内容"
      },
      {
        name: "excerpt",
        type: "text",
        required: false,
        label: "摘要"
      },
      {
        name: "featuredImage",
        type: "image",
        required: false,
        label: "特色图片"
      }
    ]
  }
};

// 确保表中有初始数据
(async () => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM content_types');
    if (parseInt(result.rows[0].count) === 0) {
      await db.query(
        'INSERT INTO content_types (id, name, schema) VALUES ($1, $2, $3)',
        [initialContentType.id, initialContentType.name, initialContentType.schema]
      );
      console.log('初始内容类型已创建');
    }
  } catch (error) {
    console.error('初始化内容类型失败:', error);
  }
})();

// 获取所有内容类型
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM content_types ORDER BY created_at DESC');
    
    // 将数据库字段名转换为驼峰式命名以保持API一致性
    const data = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      schema: row.schema,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    res.json({
      data,
      success: true
    });
  } catch (error) {
    console.error('获取内容类型失败:', error);
    res.status(500).json({
      message: '获取内容类型失败',
      success: false,
      error: error.message
    });
  }
});

// 获取单个内容类型
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT * FROM content_types WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '内容类型不存在',
        success: false
      });
    }
    
    const row = result.rows[0];
    const contentType = {
      id: row.id,
      name: row.name,
      schema: row.schema,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    res.json({
      data: contentType,
      success: true
    });
  } catch (error) {
    console.error('获取内容类型失败:', error);
    res.status(500).json({
      message: '获取内容类型失败',
      success: false,
      error: error.message
    });
  }
});

// 创建内容类型
router.post('/', async (req, res) => {
  const { name, schema } = req.body;
  
  // 输入验证
  if (!name || !schema) {
    return res.status(400).json({
      message: '名称和架构是必需的',
      success: false
    });
  }

  try {
    // 检查名称是否已存在
    const existingType = await db.query('SELECT * FROM content_types WHERE name = $1', [name]);
    if (existingType.rows.length > 0) {
      return res.status(409).json({
        message: '同名内容类型已存在',
        success: false
      });
    }
    
    // 验证架构
    if (!schema.fields || !Array.isArray(schema.fields) || schema.fields.length === 0) {
      return res.status(400).json({
        message: '架构必须包含至少一个字段',
        success: false
      });
    }
    
    // 创建新内容类型
    const id = uuidv4();
    const result = await db.query(
      'INSERT INTO content_types (id, name, schema) VALUES ($1, $2, $3) RETURNING *',
      [id, name, schema]
    );
    
    const row = result.rows[0];
    const newContentType = {
      id: row.id,
      name: row.name,
      schema: row.schema,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    res.status(201).json({
      data: newContentType,
      success: true
    });
  } catch (error) {
    console.error('创建内容类型失败:', error);
    res.status(500).json({
      message: '创建内容类型失败',
      success: false,
      error: error.message
    });
  }
});

// 更新内容类型
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, schema } = req.body;
  
  // 输入验证
  if (!name || !schema) {
    return res.status(400).json({
      message: '名称和架构是必需的',
      success: false
    });
  }
  
  try {
    // 查找要更新的内容类型
    const contentType = await db.query('SELECT * FROM content_types WHERE id = $1', [id]);
    if (contentType.rows.length === 0) {
      return res.status(404).json({
        message: '内容类型不存在',
        success: false
      });
    }
    
    // 检查名称是否与其他类型冲突
    const nameCheck = await db.query('SELECT * FROM content_types WHERE name = $1 AND id != $2', [name, id]);
    if (nameCheck.rows.length > 0) {
      return res.status(409).json({
        message: '同名内容类型已存在',
        success: false
      });
    }
    
    // 验证架构
    if (!schema.fields || !Array.isArray(schema.fields) || schema.fields.length === 0) {
      return res.status(400).json({
        message: '架构必须包含至少一个字段',
        success: false
      });
    }
    
    // 更新内容类型
    const result = await db.query(
      'UPDATE content_types SET name = $1, schema = $2 WHERE id = $3 RETURNING *',
      [name, schema, id]
    );
    
    const row = result.rows[0];
    const updatedContentType = {
      id: row.id,
      name: row.name,
      schema: row.schema,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    res.json({
      data: updatedContentType,
      success: true
    });
  } catch (error) {
    console.error('更新内容类型失败:', error);
    res.status(500).json({
      message: '更新内容类型失败',
      success: false,
      error: error.message
    });
  }
});

// 删除内容类型
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // 查找要删除的内容类型
    const contentType = await db.query('SELECT * FROM content_types WHERE id = $1', [id]);
    if (contentType.rows.length === 0) {
      return res.status(404).json({
        message: '内容类型不存在',
        success: false
      });
    }
    
    // 检查是否有内容项使用此类型
    const contentsUsingType = await db.query('SELECT COUNT(*) FROM contents WHERE type_id = $1', [id]);
    if (parseInt(contentsUsingType.rows[0].count) > 0) {
      return res.status(400).json({
        message: '无法删除此内容类型，因为有内容项正在使用它',
        success: false
      });
    }
    
    // 执行删除
    await db.query('DELETE FROM content_types WHERE id = $1', [id]);
    
    res.json({
      message: '内容类型已成功删除',
      success: true
    });
  } catch (error) {
    console.error('删除内容类型失败:', error);
    res.status(500).json({
      message: '删除内容类型失败',
      success: false,
      error: error.message
    });
  }
});

// 内容类型字段验证
router.post('/:id/validate', async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  
  try {
    // 查找内容类型
    const result = await db.query('SELECT * FROM content_types WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '内容类型不存在',
        success: false
      });
    }
    
    const contentType = result.rows[0];
    
    if (!data) {
      return res.status(400).json({
        message: '需要提供数据进行验证',
        success: false
      });
    }
    
    // 验证每个字段
    const errors = [];
    
    contentType.schema.fields.forEach(field => {
      // 必填字段验证
      if (field.required && (data[field.name] === undefined || data[field.name] === null || data[field.name] === '')) {
        errors.push({
          field: field.name,
          message: `${field.label || field.name}是必填项`
        });
        return;
      }
      
      // 如果字段存在值，则验证类型
      if (data[field.name] !== undefined && data[field.name] !== null) {
        switch (field.type) {
          case 'number':
            if (isNaN(Number(data[field.name]))) {
              errors.push({
                field: field.name,
                message: `${field.label || field.name}必须是数字`
              });
            }
            break;
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data[field.name])) {
              errors.push({
                field: field.name,
                message: `${field.label || field.name}必须是有效的电子邮件地址`
              });
            }
            break;
          // 更多类型验证可在此添加
        }
      }
    });
    
    // 如果有错误，返回错误信息
    if (errors.length > 0) {
      return res.status(400).json({
        message: '数据验证失败',
        errors,
        success: false
      });
    }
    
    // 验证通过
    res.json({
      message: '数据验证通过',
      success: true
    });
  } catch (error) {
    console.error('验证内容数据失败:', error);
    res.status(500).json({
      message: '验证内容数据失败',
      success: false,
      error: error.message
    });
  }
});

export default router;
