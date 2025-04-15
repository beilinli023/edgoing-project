import { query } from '../../db/index.mjs';

/**
 * 获取所有内容
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export async function getAllContents(req, res) {
  try {
    const { typeId, status, page = 1, limit = 10, language } = req.query;
    
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
    
    // 添加分页
    const offset = (page - 1) * limit;
    sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(sql, params);
    
    // 获取总数
    let countSql = 'SELECT COUNT(*) FROM contents WHERE 1=1';
    const countParams = [];
    
    if (typeId) {
      countSql += ' AND type_id = $' + (countParams.length + 1);
      countParams.push(typeId);
    }
    
    if (status) {
      countSql += ' AND status = $' + (countParams.length + 1);
      countParams.push(status);
    }
    
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    // 处理内容数据，确保中英文字段正确返回
    const processedData = result.rows.map(item => {
      // 如果content是JSONB，提取所有字段
      if (item.content) {
        // 将JSONB中的所有字段合并到顶层
        const contentData = typeof item.content === 'string' 
          ? JSON.parse(item.content) 
          : item.content;
        
        // 根据请求的语言过滤字段（如果指定了语言）
        if (language === 'en' || language === 'zh') {
          const filteredData = { ...item };
          delete filteredData.content;
          
          // 遍历content中的所有字段
          Object.keys(contentData).forEach(key => {
            // 如果字段名包含语言后缀
            if (key.endsWith('_en') || key.endsWith('_zh')) {
              // 只保留请求的语言版本
              if (key.endsWith(`_${language}`)) {
                // 去掉语言后缀，提取基本字段名
                const baseKey = key.substring(0, key.length - 3);
                filteredData[baseKey] = contentData[key];
              }
            } else {
              // 非语言相关字段直接保留
              filteredData[key] = contentData[key];
            }
          });
          
          return filteredData;
        }
        
        // 如果没有指定语言，返回所有字段
        return { ...item, ...contentData };
      }
      
      return item;
    });
    
    res.json({
      data: processedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      success: true
    });
  } catch (error) {
    console.error('获取内容列表失败:', error);
    res.status(500).json({
      message: '获取内容列表失败',
      success: false,
      error: error.message
    });
  }
}

/**
 * 获取单个内容
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export async function getContentById(req, res) {
  const { id } = req.params;
  const { language } = req.query;
  
  try {
    const result = await query('SELECT * FROM contents WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '内容不存在',
        success: false
      });
    }
    
    // 处理内容数据，确保中英文字段正确返回
    let processedData = result.rows[0];
    
    // 如果content是JSONB，提取所有字段
    if (processedData.content) {
      // 将JSONB中的所有字段合并到顶层
      const contentData = typeof processedData.content === 'string' 
        ? JSON.parse(processedData.content) 
        : processedData.content;
      
      // 根据请求的语言过滤字段（如果指定了语言）
      if (language === 'en' || language === 'zh') {
        const filteredData = { ...processedData };
        delete filteredData.content;
        
        // 遍历content中的所有字段
        Object.keys(contentData).forEach(key => {
          // 如果字段名包含语言后缀
          if (key.endsWith('_en') || key.endsWith('_zh')) {
            // 只保留请求的语言版本
            if (key.endsWith(`_${language}`)) {
              // 去掉语言后缀，提取基本字段名
              const baseKey = key.substring(0, key.length - 3);
              filteredData[baseKey] = contentData[key];
            }
          } else {
            // 非语言相关字段直接保留
            filteredData[key] = contentData[key];
          }
        });
        
        processedData = filteredData;
      } else {
        // 如果没有指定语言，返回所有字段
        processedData = { ...processedData, ...contentData };
      }
    }
    
    res.json({
      data: processedData,
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
}

/**
 * 根据slug获取内容
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export async function getContentBySlug(req, res) {
  const { slug } = req.params;
  const { language } = req.query;
  
  try {
    const result = await query('SELECT * FROM contents WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: '内容不存在',
        success: false
      });
    }
    
    // 处理内容数据，确保中英文字段正确返回
    let processedData = result.rows[0];
    
    // 如果content是JSONB，提取所有字段
    if (processedData.content) {
      // 将JSONB中的所有字段合并到顶层
      const contentData = typeof processedData.content === 'string' 
        ? JSON.parse(processedData.content) 
        : processedData.content;
      
      // 根据请求的语言过滤字段（如果指定了语言）
      if (language === 'en' || language === 'zh') {
        const filteredData = { ...processedData };
        delete filteredData.content;
        
        // 遍历content中的所有字段
        Object.keys(contentData).forEach(key => {
          // 如果字段名包含语言后缀
          if (key.endsWith('_en') || key.endsWith('_zh')) {
            // 只保留请求的语言版本
            if (key.endsWith(`_${language}`)) {
              // 去掉语言后缀，提取基本字段名
              const baseKey = key.substring(0, key.length - 3);
              filteredData[baseKey] = contentData[key];
            }
          } else {
            // 非语言相关字段直接保留
            filteredData[key] = contentData[key];
          }
        });
        
        processedData = filteredData;
      } else {
        // 如果没有指定语言，返回所有字段
        processedData = { ...processedData, ...contentData };
      }
    }
    
    res.json({
      data: processedData,
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
}
