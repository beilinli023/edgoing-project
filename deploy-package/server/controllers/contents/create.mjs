import { query } from '../../db/index.mjs';

/**
 * 创建新内容
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
export async function createContent(req, res) {
  const {
    typeId,
    title_en,
    title_zh,
    slug,
    content_en,
    content_zh,
    excerpt_en,
    excerpt_zh,
    featuredImage,
    status = 'draft',
    categoryIds = [],
    tagIds = [],
    metadata = {},
    // 其他可能的双语字段
    description_en,
    description_zh,
    highlights_en,
    highlights_zh,
    // 程序特有字段
    program_id,
    location_en,
    location_zh,
    duration,
    country,
    program_type_en,
    program_type_zh,
    destination_en,
    destination_zh,
    grade_level_en,
    grade_level_zh,
    duration_weeks,
    itinerary_en,
    itinerary_zh,
    features_en,
    features_zh,
    information_en,
    information_zh,
    school_info_en,
    school_info_zh,
    price,
    gallery_images,
    grade_levels,
    published_at
  } = req.body;

  // 验证必填字段 - 根据内容类型可能有不同的必填字段
  if (!typeId || !slug) {
    return res.status(400).json({
      message: '类型ID和slug是必填项',
      success: false
    });
  }
  
  // 根据内容类型验证特定的必填字段
  // 例如，对于Program类型，可能需要验证program_id等
  
  // 构建内容对象，使用JSONB存储所有字段
  const contentData = {
    // 基本字段
    title_en,
    title_zh,
    content_en,
    content_zh,
    excerpt_en,
    excerpt_zh,
    // 其他双语字段
    description_en,
    description_zh,
    highlights_en,
    highlights_zh,
    // 程序特有字段
    program_id,
    location_en,
    location_zh,
    duration,
    country,
    program_type_en,
    program_type_zh,
    destination_en,
    destination_zh,
    grade_level_en,
    grade_level_zh,
    duration_weeks,
    itinerary_en,
    itinerary_zh,
    features_en,
    features_zh,
    information_en,
    information_zh,
    school_info_en,
    school_info_zh,
    price,
    gallery_images,
    grade_levels,
    published_at
  };
  
  // 过滤掉undefined值
  Object.keys(contentData).forEach(key => {
    if (contentData[key] === undefined) {
      delete contentData[key];
    }
  });

  try {
    // 使用title_zh作为主标题（如果存在），否则使用title_en
    const title = title_zh || title_en || '';
    
    // 直接使用标准查询，不使用事务
    // 将所有字段存储在content JSONB字段中
    const contentResult = await query(
      'INSERT INTO contents (type_id, title, slug, content, featured_image, status, metadata, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
      [typeId, title, slug, contentData, featuredImage, status, metadata]
    );
    
    // 如果有分类和标签，添加关联
    if (categoryIds.length > 0) {
      const categoryValues = categoryIds.map((categoryId, index) => 
        `($1, $${index + 2})`
      ).join(', ');
      
      await query(
        `INSERT INTO content_categories (content_id, category_id) VALUES ${categoryValues}`,
        [contentResult.rows[0].id, ...categoryIds]
      );
    }
    
    if (tagIds.length > 0) {
      const tagValues = tagIds.map((tagId, index) => 
        `($1, $${index + 2})`
      ).join(', ');
      
      await query(
        `INSERT INTO content_tags (content_id, tag_id) VALUES ${tagValues}`,
        [contentResult.rows[0].id, ...tagIds]
      );
    }
    
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
}
