import { query } from '../../db/index.mjs';

/**
 * 搜索内容
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export async function searchContents(req, res) {
  const { query: searchQuery, typeId } = req.query;
  
  if (!searchQuery) {
    return res.status(400).json({
      message: '搜索查询是必需的',
      success: false
    });
  }
  
  try {
    // 使用PostgreSQL的全文搜索功能
    let sql = `
      SELECT * FROM contents 
      WHERE (
        to_tsvector('simple', title) @@ plainto_tsquery('simple', $1) OR
        to_tsvector('simple', COALESCE(content, '')) @@ plainto_tsquery('simple', $1) OR
        to_tsvector('simple', COALESCE(excerpt, '')) @@ plainto_tsquery('simple', $1)
      )
    `;
    
    const params = [searchQuery];
    
    if (typeId) {
      sql += ' AND type_id = $' + (params.length + 1);
      params.push(typeId);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await query(sql, params);
    
    res.json({
      data: result.rows,
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
}
