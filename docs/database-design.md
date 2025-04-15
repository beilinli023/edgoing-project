# CMS 系统数据库设计文档

## 数据库命名规范

- 表名：小写字母，下划线分隔，复数形式（例如：contents, content_types）
- 字段名：小写字母，下划线分隔（例如：created_at, updated_at）
- 索引名：以 idx_ 开头，后跟表名和字段名（例如：idx_contents_slug）

## 数据库表结构

### 1. 内容管理相关表

#### contents（基础内容表）
```sql
CREATE TABLE IF NOT EXISTS contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title_zh VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    content_zh TEXT,
    content_en TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contents_slug ON contents(slug);
CREATE INDEX idx_contents_status ON contents(status);
```

#### categories（分类表）
```sql
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_zh VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description_zh TEXT,
    description_en TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### content_categories（内容分类关联表）
```sql
CREATE TABLE IF NOT EXISTS content_categories (
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (content_id, category_id)
);
```

#### tags（标签表）
```sql
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_zh VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### content_tags（内容标签关联表）
```sql
CREATE TABLE IF NOT EXISTS content_tags (
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, tag_id)
);
```

### 2. 媒体资源相关表

#### media（媒体资源表）
```sql
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### content_media（内容媒体关联表）
```sql
CREATE TABLE IF NOT EXISTS content_media (
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    PRIMARY KEY (content_id, media_id)
);
```

### 3. 表单相关表

#### forms（表单定义表）
```sql
CREATE TABLE IF NOT EXISTS forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    fields JSONB NOT NULL,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### form_submissions（表单提交记录表）
```sql
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. 邮件订阅相关表

#### newsletter_subscribers（订阅者表）
```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_subscribers_status ON newsletter_subscribers(status);
```

## 数据库优化建议

1. **索引优化**
   - 对常用查询字段添加索引
   - 对大文本字段使用全文搜索索引
   - 定期维护和更新索引统计信息

2. **查询优化**
   - 使用适当的字段类型和长度
   - 避免过度使用JOIN操作
   - 合理使用分页和限制结果集大小

3. **性能优化**
   - 使用连接池管理数据库连接
   - 实施适当的缓存策略
   - 定期清理过期数据

4. **安全性建议**
   - 实施适当的访问控制
   - 对敏感数据进行加密
   - 定期备份数据

### 5. 项目管理相关表

#### programs（项目表）
```sql
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    program_id VARCHAR(50) UNIQUE NOT NULL,
    location_en VARCHAR(100),
    location_zh VARCHAR(100),
    duration VARCHAR(50),
    country VARCHAR(50),
    program_type_en VARCHAR(100),
    program_type_zh VARCHAR(100),
    destination_en VARCHAR(100),
    destination_zh VARCHAR(100),
    grade_level_en VARCHAR(100),
    grade_level_zh VARCHAR(100),
    duration_weeks INTEGER,
    price DECIMAL(10, 2),
    gallery_images JSONB,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6. 留学相关表

#### study_abroad_benefits（留学优势表）
```sql
CREATE TABLE IF NOT EXISTS study_abroad_benefits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en VARCHAR(200) NOT NULL,
    title_zh VARCHAR(200) NOT NULL,
    description_en TEXT,
    description_zh TEXT,
    icon VARCHAR(100),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### partner_universities（合作大学表）
```sql
CREATE TABLE IF NOT EXISTS partner_universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(200) NOT NULL,
    name_zh VARCHAR(200) NOT NULL,
    logo VARCHAR(200),
    location_en VARCHAR(200),
    location_zh VARCHAR(200),
    description_en TEXT,
    description_zh TEXT,
    website_url VARCHAR(200),
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7. FAQ相关表

#### faq_categories（FAQ分类表）
```sql
CREATE TABLE IF NOT EXISTS faq_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(100) NOT NULL,
    name_zh VARCHAR(100) NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### faqs（FAQ表）
```sql
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES faq_categories(id) ON DELETE SET NULL,
    question_en TEXT NOT NULL,
    question_zh TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    answer_zh TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 8. 表单管理相关表

#### form_types（表单类型表）
```sql
CREATE TABLE IF NOT EXISTS form_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### form_fields（表单字段表）
```sql
CREATE TABLE IF NOT EXISTS form_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_type_id UUID REFERENCES form_types(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    label_en VARCHAR(100) NOT NULL,
    label_zh VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'text', 'select', 'checkbox', etc.
    required BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL,
    options JSONB, -- For select, checkbox, radio fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 9. 索引和约束

```sql
-- 为各个表添加索引以提高查询性能

-- contents 表索引
CREATE INDEX IF NOT EXISTS idx_contents_type_id ON contents(type_id);
CREATE INDEX IF NOT EXISTS idx_contents_slug ON contents(slug);

-- categories 表索引
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- tags 表索引
CREATE INDEX IF NOT EXISTS idx_tags_type ON tags(type);

-- programs 表索引
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_country ON programs(country);
```

## 参考文献

1. PostgreSQL Documentation: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
2. Database Indexing Strategies: [https://use-the-index-luke.com/](https://use-the-index-luke.com/)
3. TypeORM Documentation: [https://typeorm.io/](https://typeorm.io/)
