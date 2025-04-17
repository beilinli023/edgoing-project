import express from 'express';
import { query, transaction } from '../db/index.mjs';

const router = express.Router();

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    // 支持按类型过滤
    const { type } = req.query;
    
    let sql = 'SELECT * FROM categories';
    const params = [];
    
    if (type) {
      sql += ' WHERE type = $1';
      params.push(type);
    }
    
    sql += ' ORDER BY name_en';
    
    const result = await query(sql, params);
    
    res.json({
      data: result.rows,
      success: true
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      message: '获取分类列表失败',
      success: false,
      error: error.message
    });
  }
});

// 获取单个分类
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '分类不存在',
        success: false
      });
    }
    
    res.json({
      data: result.rows[0],
      success: true
    });
  } catch (error) {
    console.error('获取分类详情失败:', error);
    res.status(500).json({
      message: '获取分类详情失败',
      success: false,
      error: error.message
    });
  }
});

// 按slug获取分类
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await query('SELECT * FROM categories WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '分类不存在',
        success: false
      });
    }
    
    res.json({
      data: result.rows[0],
      success: true
    });
  } catch (error) {
    console.error('通过slug获取分类失败:', error);
    res.status(500).json({
      message: '通过slug获取分类失败',
      success: false,
      error: error.message
    });
  }
});

// 创建分类
router.post('/', async (req, res) => {
  try {
    const { name_en, name_zh, slug, description_en, description_zh, parent_id, type } = req.body;
    
    // 输入验证
    if (!name_en || !name_zh || !slug || !type) {
      return res.status(400).json({
        message: '名称（英文和中文）、slug和类型是必需的',
        success: false
      });
    }

    // 检查slug是否已存在
    const slugCheck = await query('SELECT id FROM categories WHERE slug = $1', [slug]);
    if (slugCheck.rows.length > 0) {
      return res.status(409).json({
        message: '同名slug已存在',
        success: false
      });
    }
    
    // 如果指定了父类别，检查它是否存在
    if (parent_id) {
      const parentCheck = await query('SELECT id FROM categories WHERE id = $1', [parent_id]);
      if (parentCheck.rows.length === 0) {
        return res.status(400).json({
          message: '父分类不存在',
          success: false
        });
      }
    }
    
    // 创建新分类
    const now = new Date();
    const sql = `
      INSERT INTO categories (
        name_en, name_zh, slug, description_en, description_zh, parent_id, type, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `;
    
    const values = [
      name_en,
      name_zh,
      slug,
      description_en || '',
      description_zh || '',
      parent_id || null,
      type,
      now,
      now
    ];
    
    const result = await query(sql, values);
    const newCategory = result.rows[0];
    
    res.status(201).json({
      data: newCategory,
      success: true
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({
      message: '创建分类失败',
      success: false,
      error: error.message
    });
  }
});

// 更新分类
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name_en, name_zh, slug, description_en, description_zh, parent_id, type } = req.body;
    
    // 输入验证
    if (!name_en || !name_zh || !slug || !type) {
      return res.status(400).json({
        message: '名称（英文和中文）、slug和类型是必需的',
        success: false
      });
    }
    
    // 检查分类是否存在
    const categoryCheck = await query('SELECT * FROM categories WHERE id = $1', [id]);
    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({
        message: '分类不存在',
        success: false
      });
    }
    
    // 检查slug是否与其他分类冲突
    const slugCheck = await query('SELECT id FROM categories WHERE slug = $1 AND id != $2', [slug, id]);
    if (slugCheck.rows.length > 0) {
      return res.status(409).json({
        message: '同名slug已存在',
        success: false
      });
    }
    
    // 如果指定了父类别，检查它是否存在
    if (parent_id) {
      const parentCheck = await query('SELECT id FROM categories WHERE id = $1', [parent_id]);
      if (parentCheck.rows.length === 0) {
        return res.status(400).json({
          message: '父分类不存在',
          success: false
        });
      }
    }
    
    // 更新分类
    const now = new Date();
    const sql = `
      UPDATE categories SET 
        name_en = $1, 
        name_zh = $2, 
        slug = $3, 
        description_en = $4, 
        description_zh = $5, 
        parent_id = $6, 
        type = $7, 
        updated_at = $8
      WHERE id = $9
      RETURNING *
    `;
    
    const values = [
      name_en,
      name_zh,
      slug,
      description_en || '',
      description_zh || '',
      parent_id || null,
      type,
      now,
      id
    ];
    
    const result = await query(sql, values);
    const updatedCategory = result.rows[0];
    
    res.json({
      data: updatedCategory,
      success: true
    });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({
      message: '更新分类失败',
      success: false,
      error: error.message
    });
  }
});

// 删除分类
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查分类是否存在
    const categoryCheck = await query('SELECT * FROM categories WHERE id = $1', [id]);
    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({
        message: '分类不存在',
        success: false
      });
    }
    
    // 检查是否有子分类引用这个分类
    const childCheck = await query('SELECT id FROM categories WHERE parent_id = $1', [id]);
    if (childCheck.rows.length > 0) {
      return res.status(400).json({
        message: '无法删除具有子分类的分类',
        success: false
      });
    }
    
    // 检查是否有内容引用这个分类
    const contentCheck = await query('SELECT content_id FROM content_categories WHERE category_id = $1 LIMIT 1', [id]);
    if (contentCheck.rows.length > 0) {
      return res.status(400).json({
        message: '无法删除被内容使用的分类',
        success: false
      });
    }
    
    // 执行删除
    await query('DELETE FROM categories WHERE id = $1', [id]);
    
    res.json({
      message: '分类已成功删除',
      success: true
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({
      message: '删除分类失败',
      success: false,
      error: error.message
    });
  }
});

// 获取分类树结构
router.get('/tree/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    // 从数据库获取符合类型的分类
    let sql = 'SELECT * FROM categories';
    const params = [];
    
    if (type && type !== 'all') {
      sql += ' WHERE type = $1';
      params.push(type);
    }
    
    sql += ' ORDER BY name_en';
    
    const result = await query(sql, params);
    const categories = result.rows;
    
    // 构建树结构
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => {
          if (parentId === null) {
            return item.parent_id === null;
          }
          return item.parent_id === parentId;
        })
        .map(item => ({
          ...item,
          children: buildTree(items, item.id)
        }));
    };
    
    const tree = buildTree(categories);
    
    res.json({
      data: tree,
      success: true
    });
  } catch (error) {
    console.error('获取分类树结构失败:', error);
    res.status(500).json({
      message: '获取分类树结构失败',
      success: false,
      error: error.message
    });
  }
});

export default router;
