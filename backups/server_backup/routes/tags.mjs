import express from 'express';
import { query, transaction } from '../db/index.mjs';

const router = express.Router();

// 获取所有标签
router.get('/', async (req, res) => {
  try {
    // 支持按类型过滤
    const { type } = req.query;
    
    let sql = 'SELECT * FROM tags';
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
    console.error('获取标签列表失败:', error);
    res.status(500).json({
      message: '获取标签列表失败',
      success: false,
      error: error.message
    });
  }
});

// 注意：特殊路由（如/slug/:slug）必须放在参数路由（如/:id）之前
// 按slug获取标签
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await query('SELECT * FROM tags WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '标签不存在',
        success: false
      });
    }
    
    res.json({
      data: result.rows[0],
      success: true
    });
  } catch (error) {
    console.error('通过slug获取标签失败:', error);
    res.status(500).json({
      message: '通过slug获取标签失败',
      success: false,
      error: error.message
    });
  }
});

// 获取单个标签
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('SELECT * FROM tags WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '标签不存在',
        success: false
      });
    }
    
    res.json({
      data: result.rows[0],
      success: true
    });
  } catch (error) {
    console.error('获取标签详情失败:', error);
    res.status(500).json({
      message: '获取标签详情失败',
      success: false,
      error: error.message
    });
  }
});

// 创建标签
router.post('/', async (req, res) => {
  try {
    const { name_en, name_zh, slug, type } = req.body;
    
    // 输入验证
    if (!name_en || !name_zh || !slug || !type) {
      return res.status(400).json({
        message: '名称（英文和中文）、slug和类型是必需的',
        success: false
      });
    }

    // 检查slug是否已存在
    const slugCheck = await query('SELECT id FROM tags WHERE slug = $1', [slug]);
    if (slugCheck.rows.length > 0) {
      return res.status(409).json({
        message: '同名slug已存在',
        success: false
      });
    }
    
    // 创建新标签
    const now = new Date();
    const sql = `
      INSERT INTO tags (
        name_en, name_zh, slug, type, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    
    const values = [
      name_en,
      name_zh,
      slug,
      type,
      now,
      now
    ];
    
    const result = await query(sql, values);
    const newTag = result.rows[0];
    
    res.status(201).json({
      data: newTag,
      success: true
    });
  } catch (error) {
    console.error('创建标签失败:', error);
    res.status(500).json({
      message: '创建标签失败',
      success: false,
      error: error.message
    });
  }
});

// 更新标签
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name_en, name_zh, slug, type } = req.body;
    
    // 输入验证
    if (!name_en || !name_zh || !slug || !type) {
      return res.status(400).json({
        message: '名称（英文和中文）、slug和类型是必需的',
        success: false
      });
    }
    
    // 检查标签是否存在
    const tagCheck = await query('SELECT * FROM tags WHERE id = $1', [id]);
    if (tagCheck.rows.length === 0) {
      return res.status(404).json({
        message: '标签不存在',
        success: false
      });
    }
    
    // 检查slug是否与其他标签冲突
    const slugCheck = await query('SELECT id FROM tags WHERE slug = $1 AND id != $2', [slug, id]);
    if (slugCheck.rows.length > 0) {
      return res.status(409).json({
        message: '同名slug已存在',
        success: false
      });
    }
    
    // 更新标签
    const now = new Date();
    const sql = `
      UPDATE tags SET 
        name_en = $1, 
        name_zh = $2, 
        slug = $3, 
        type = $4, 
        updated_at = $5
      WHERE id = $6
      RETURNING *
    `;
    
    const values = [
      name_en,
      name_zh,
      slug,
      type,
      now,
      id
    ];
    
    const result = await query(sql, values);
    const updatedTag = result.rows[0];
    
    res.json({
      data: updatedTag,
      success: true
    });
  } catch (error) {
    console.error('更新标签失败:', error);
    res.status(500).json({
      message: '更新标签失败',
      success: false,
      error: error.message
    });
  }
});

// 删除标签
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查标签是否存在
    const tagCheck = await query('SELECT * FROM tags WHERE id = $1', [id]);
    if (tagCheck.rows.length === 0) {
      return res.status(404).json({
        message: '标签不存在',
        success: false
      });
    }
    
    // 检查是否有内容引用这个标签
    const contentCheck = await query('SELECT content_id FROM content_tags WHERE tag_id = $1 LIMIT 1', [id]);
    if (contentCheck.rows.length > 0) {
      return res.status(400).json({
        message: '无法删除被内容使用的标签',
        success: false
      });
    }
    
    // 执行删除
    await query('DELETE FROM tags WHERE id = $1', [id]);
    
    res.json({
      message: '标签已成功删除',
      success: true
    });
  } catch (error) {
    console.error('删除标签失败:', error);
    res.status(500).json({
      message: '删除标签失败',
      success: false,
      error: error.message
    });
  }
});

// 批量创建标签
router.post('/batch', async (req, res) => {
  try {
    const { tags: newTags, type } = req.body;
    
    if (!Array.isArray(newTags) || !type) {
      return res.status(400).json({
        message: '需要标签数组和类型',
        success: false
      });
    }
    
    const createdTags = [];
    const errors = [];
    
    // 使用事务确保批量插入的原子性
    const client = await transaction();
    
    try {
      for (let i = 0; i < newTags.length; i++) {
        const tagData = newTags[i];
        
        // 简单验证
        if (!tagData.name_en || !tagData.name_zh) {
          errors.push({
            index: i,
            message: '标签必须包含英文和中文名称'
          });
          continue;
        }
        
        // 生成slug（如果没有提供）
        const slug = tagData.slug || tagData.name_en.toLowerCase().replace(/\s+/g, '-');
        
        // 检查slug是否已存在
        const slugCheck = await client.query('SELECT id FROM tags WHERE slug = $1', [slug]);
        if (slugCheck.rows.length > 0) {
          errors.push({
            index: i,
            message: `标签slug '${slug}' 已存在`
          });
          continue;
        }
        
        // 创建新标签
        const now = new Date();
        const sql = `
          INSERT INTO tags (
            name_en, name_zh, slug, type, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6) 
          RETURNING *
        `;
        
        const values = [
          tagData.name_en,
          tagData.name_zh,
          slug,
          type,
          now,
          now
        ];
        
        const result = await client.query(sql, values);
        createdTags.push(result.rows[0]);
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
    res.status(201).json({
      data: {
        created: createdTags,
        errors
      },
      success: errors.length === 0
    });
  } catch (error) {
    console.error('批量创建标签失败:', error);
    res.status(500).json({
      message: '批量创建标签失败',
      success: false,
      error: error.message
    });
  }
});

export default router;
