-- 插入内容数据
INSERT INTO contents (title, content, slug, status) VALUES
(
    '关于我们',
    '{"sections": [{"type": "text", "content": "引里信息咨询是一家专注于教育科技的创新公司"}]}',
    'about-us',
    'published'
),
(
    '联系方式',
    '{"address": "上海市黄埔区黄陂南路838号", "phone": "021-12345678", "email": "contact@edgoing.com"}',
    'contact',
    'published'
),
(
    '最新动态',
    '{"title": "2025年春季课程更新", "content": "我们推出了全新的在线课程体系"}',
    'news',
    'published'
),
(
    '课程预告',
    '{"courses": [{"name": "人工智能基础", "startDate": "2025-04-01"}, {"name": "数据分析入门", "startDate": "2025-04-15"}]}',
    'upcoming-courses',
    'draft'
);

-- 插入媒体资源数据
INSERT INTO media (url, type, filename, content_id) VALUES
(
    'https://example.com/images/about-us-banner.jpg',
    'image',
    'about-us-banner.jpg',
    (SELECT id FROM contents WHERE slug = 'about-us')
),
(
    'https://example.com/images/course-preview.jpg',
    'image',
    'course-preview.jpg',
    (SELECT id FROM contents WHERE slug = 'upcoming-courses')
),
(
    'https://example.com/documents/course-catalog-2025.pdf',
    'document',
    'course-catalog-2025.pdf',
    (SELECT id FROM contents WHERE slug = 'upcoming-courses')
);
