-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 内容表
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content JSONB,
    slug VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contents_updated_at
    BEFORE UPDATE ON contents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 媒体资源表
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    filename VARCHAR(255),
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 创建索引
CREATE INDEX idx_contents_slug ON contents(slug);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_media_content_id ON media(content_id);

-- 添加搜索支持
ALTER TABLE contents ADD COLUMN search_vector tsvector;

-- 创建搜索索引
CREATE INDEX idx_contents_search ON contents USING GIN(search_vector);

-- 创建搜索更新函数
CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('simple', COALESCE(NEW.content::text, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建搜索更新触发器
CREATE TRIGGER update_contents_search_vector
    BEFORE INSERT OR UPDATE ON contents
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- 创建高级搜索函数
CREATE OR REPLACE FUNCTION search_contents(
    search_query TEXT DEFAULT NULL,
    content_status TEXT DEFAULT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    tag_name TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
) RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    content JSONB,
    slug VARCHAR(255),
    status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    rank FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_contents AS (
        SELECT 
            c.*,
            CASE 
                WHEN search_query IS NULL THEN 0
                ELSE 
                    ts_rank(c.search_vector, to_tsquery('simple', COALESCE(search_query, ''))) +
                    CASE 
                        WHEN c.title ILIKE '%' || COALESCE(search_query, '') || '%' THEN 2
                        ELSE 0
                    END +
                    CASE 
                        WHEN c.content::text ILIKE '%' || COALESCE(search_query, '') || '%' THEN 1
                        ELSE 0
                    END
            END as rank
        FROM contents c
        WHERE 
            -- 状态过滤
            (content_status IS NULL OR c.status = content_status)
            -- 时间范围过滤
            AND (start_date IS NULL OR c.created_at >= start_date)
            AND (end_date IS NULL OR c.created_at <= end_date)
            -- 搜索词过滤
            AND (search_query IS NULL 
                OR c.title ILIKE '%' || search_query || '%'
                OR c.content::text ILIKE '%' || search_query || '%')
    )
    SELECT 
        fc.id,
        fc.title,
        fc.content,
        fc.slug,
        fc.status,
        fc.created_at,
        fc.updated_at,
        fc.rank
    FROM filtered_contents fc
    ORDER BY 
        fc.rank DESC,
        fc.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
