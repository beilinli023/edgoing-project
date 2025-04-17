import express from 'express';
import { query } from '../db/index.mjs';

const router = express.Router();

// 内存中临时存储内容数据(实际项目中应使用数据库)
// let contents = [
//   {
//     id: "1",
//     typeId: "1", // 关联到blog内容类型
//     title: "第一篇博客文章",
//     slug: "first-blog-post",
//     content: "这是第一篇博客文章的详细内容...",
//     excerpt: "这是摘要",
//     featuredImage: "/images/blog/post1.jpg",
//     status: "published",
//     categoryIds: ["1"],
//     tagIds: ["1", "2"],
//     metadata: {
//       seo: {
//         title: "第一篇博客 | 我的网站",
//         description: "这是第一篇博客文章的SEO描述"
//       }
//     },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     publishedAt: new Date().toISOString()
//   }
// ];

// 内容搜索 - 使用特定路径确保不会被其他路由拦截
router.get('/api-search', async (req, res) => {
  const { query: searchQuery, typeId } = req.query;
  
  if (!searchQuery) {
    return res.status(400).json({
      message: '搜索查询是必需的',
      success: false
    });
  }
  
  const searchTerms = searchQuery.toLowerCase().split(' ');
  
  try {
    let sql = 'SELECT * FROM contents WHERE 1=1';
    const params = [];
    
    if (typeId) {
      sql += ' AND type_id = $' + (params.length + 1);
      params.push(typeId);
    }
    
    const searchConditions = searchTerms.map((term, index) => {
      const paramIndex = params.length + index + 1;
      params.push(`%${term}%`);
      return `LOWER(title) LIKE $${paramIndex} OR LOWER(content) LIKE $${paramIndex} OR LOWER(excerpt) LIKE $${paramIndex}`;
    });
    
    sql += ` AND (${searchConditions.join(' OR ')})`;
    
    const result = await query(sql, params);
    
    // 即使没有找到结果，也返回成功状态和空数组
    res.json({
      data: result.rows,
      meta: {
        total: result.rowCount,
        query: searchQuery
      },
      success: true
    });
  } catch (error) {
    console.error('搜索内容失败:', error);
    res.status(500).json({
      message: '搜索内容失败',
      success: false,
      error: error.message
    });
  }
});

// 获取所有内容项（支持分页、筛选和排序）
router.get('/', async (req, res) => {
  const { 
    typeId, 
    status, 
    categoryId, 
    tagId, 
    page = 1, 
    limit = 10, 
    sort = 'created_at', 
    order = 'desc' 
  } = req.query;
  
  try {
    let sql = 'SELECT * FROM contents WHERE 1=1';
    const params = [];
    
    if (typeId) {
      sql += ' AND type_id = $' + (params.length + 1);
      params.push(typeId);
    }
    
    if (status) {
      sql += ' AND status = $' + (params.length + 1);
      params.push(status);
    }
    
    if (categoryId) {
      sql += ' AND $' + (params.length + 1) + ' = ANY(category_ids)';
      params.push(categoryId);
    }
    
    if (tagId) {
      sql += ' AND $' + (params.length + 1) + ' = ANY(tag_ids)';
      params.push(tagId);
    }
    
    sql += ` ORDER BY ${sort} ${order} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, (page - 1) * limit);
    
    const result = await query(sql, params);
    
    res.json({
      data: result.rows,
      meta: {
        total: result.rowCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.rowCount / limit)
      },
      success: true
    });
  } catch (error) {
    console.error('获取内容项失败:', error);
    res.status(500).json({
      message: '获取内容项失败',
      success: false,
      error: error.message
    });
  }
});

// 按slug获取内容项
router.get('/by-slug/:slug', async (req, res) => {
  const { slug } = req.params;
  
  try {
    const result = await query('SELECT * FROM contents WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '内容不存在',
        success: false
      });
    }
    
    res.json({
      data: result.rows[0],
      success: true
    });
  } catch (error) {
    console.error('获取内容详情失败:', error);
    res.status(500).json({
      message: '获取内容详情失败',
      success: false,
      error: error.message
    });
  }
});

// 获取单个内容项
router.get('/:id([0-9]+)', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await query('SELECT * FROM contents WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '内容不存在',
        success: false
      });
    }
    
    res.json({
      data: result.rows[0],
      success: true
    });
  } catch (error) {
    console.error('获取内容详情失败:', error);
    res.status(500).json({
      message: '获取内容详情失败',
      success: false,
      error: error.message
    });
  }
});

// 创建内容项 - 使用事务处理
router.post('/', async (req, res) => {
  const { 
    typeId, 
    title, 
    slug, 
    content, 
    excerpt,
    featuredImage,
    status = 'draft',
    categoryIds = [],
    tagIds = [],
    metadata = {}
  } = req.body;
  
  if (!typeId || !title || !slug) {
    return res.status(400).json({
      message: '内容类型ID、标题和slug是必填字段',
      success: false
    });
  }
  
    try {
    // 直接使用标准查询，不使用事务
    // 确保列名与数据库表结构完全匹配
    const contentResult = await query(
      'INSERT INTO contents (type_id, title, slug, content, excerpt, featured_image, status, metadata, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *',
      [typeId, title, slug, content, excerpt, featuredImage, status, metadata]
    );
    
    // 返回创建的内容对象
    res.status(201).json({
      data: contentResult.rows[0],
      success: true
    });
  } catch (error) {
    console.error('创建内容失败:', error);
    res.status(500).json({
      message: '创建内容失败',
      success: false,
      error: error.message
    });
  }
});

// 更新内容项
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    typeId, 
    title, 
    slug, 
    content, 
    excerpt,
    featuredImage,
    status,
    categoryIds,
    tagIds,
    metadata
  } = req.body;
  
  if (!title || !slug) {
    return res.status(400).json({
      message: '标题和slug是必填字段',
      success: false
    });
  }
  
  try {
    const result = await query('SELECT * FROM contents WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '内容不存在',
        success: false
      });
    }
    
    const currentContent = result.rows[0];
    const updatedContent = {
      ...currentContent,
      type_id: typeId || currentContent.type_id,
      title,
      slug,
      content: content !== undefined ? content : currentContent.content,
      excerpt: excerpt !== undefined ? excerpt : currentContent.excerpt,
      featured_image: featuredImage !== undefined ? featuredImage : currentContent.featured_image,
      status: status || currentContent.status,
      category_ids: categoryIds || currentContent.category_ids,
      tag_ids: tagIds || currentContent.tag_ids,
      metadata: metadata ? { ...currentContent.metadata, ...metadata } : currentContent.metadata,
      updated_at: new Date().toISOString(),
      published_at: currentContent.status !== 'published' && status === 'published' ? new Date().toISOString() : currentContent.published_at
    };
    
    const updateResult = await query(
      'UPDATE contents SET type_id = $1, title = $2, slug = $3, content = $4, excerpt = $5, featured_image = $6, status = $7, category_ids = $8, tag_ids = $9, metadata = $10, updated_at = NOW(), published_at = $11 WHERE id = $12 RETURNING *',
      [updatedContent.type_id, updatedContent.title, updatedContent.slug, updatedContent.content, updatedContent.excerpt, updatedContent.featured_image, updatedContent.status, updatedContent.category_ids, updatedContent.tag_ids, updatedContent.metadata, updatedContent.published_at, id]
    );
    
    res.json({
      data: updateResult.rows[0],
      success: true
    });
  } catch (error) {
    console.error('更新内容失败:', error);
    res.status(500).json({
      message: '更新内容失败',
      success: false,
      error: error.message
    });
  }
});

// 删除内容项
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await query('DELETE FROM contents WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '内容不存在',
        success: false
      });
    }
    
    res.json({
      message: '内容已成功删除',
      success: true
    });
  } catch (error) {
    console.error('删除内容失败:', error);
    res.status(500).json({
      message: '删除内容失败',
      success: false,
      error: error.message
    });
  }
});

// 更新内容状态（发布/草稿/存档）
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status || !['published', 'draft', 'archived'].includes(status)) {
    return res.status(400).json({
      message: '状态必须是 published, draft 或 archived',
      success: false
    });
  }
  
  try {
    const result = await query('SELECT * FROM contents WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '内容不存在',
        success: false
      });
    }
    
    const currentContent = result.rows[0];
    const updatedContent = {
      ...currentContent,
      status,
      updated_at: new Date().toISOString(),
      published_at: currentContent.status !== 'published' && status === 'published' ? new Date().toISOString() : currentContent.published_at
    };
    
    const updateResult = await query(
      'UPDATE contents SET status = $1, updated_at = NOW(), published_at = $2 WHERE id = $3 RETURNING *',
      [updatedContent.status, updatedContent.published_at, id]
    );
    
    res.json({
      data: updateResult.rows[0],
      success: true
    });
  } catch (error) {
    console.error('更新内容状态失败:', error);
    res.status(500).json({
      message: '更新内容状态失败',
      success: false,
      error: error.message
    });
  }
});

export default router;
