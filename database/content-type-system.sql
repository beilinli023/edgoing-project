-- 内容类型系统数据库结构
-- 应在init.sql之后执行

-- 创建内容类型表
CREATE TABLE IF NOT EXISTS content_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  schema JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建内容类型更新时间触发器
CREATE TRIGGER update_content_types_updated_at
  BEFORE UPDATE ON content_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 修改contents表，添加type_id字段
ALTER TABLE contents 
ADD COLUMN IF NOT EXISTS type_id UUID REFERENCES content_types(id);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  parent_id UUID REFERENCES categories(id),
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建分类更新时间触发器
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(50) NOT NULL,
  name_zh VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(20),
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建标签更新时间触发器
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建内容与分类的关联表
CREATE TABLE IF NOT EXISTS content_categories (
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);

-- 创建内容与标签的关联表
CREATE TABLE IF NOT EXISTS content_tags (
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- 创建索引
CREATE INDEX idx_contents_type_id ON contents(type_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_tags_type ON tags(type);
CREATE INDEX idx_content_categories_content_id ON content_categories(content_id);
CREATE INDEX idx_content_categories_category_id ON content_categories(category_id);
CREATE INDEX idx_content_tags_content_id ON content_tags(content_id);
CREATE INDEX idx_content_tags_tag_id ON content_tags(tag_id);
