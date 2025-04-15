/**
 * 数据库集成测试脚本
 * 
 * 这个脚本用于测试API路由与数据库的集成功能，包括：
 * 1. 测试数据库连接
 * 2. 测试内容类型API
 * 3. 测试分类API
 * 4. 测试标签API
 */

import fetch from 'node-fetch';
import pg from 'pg';
import { query } from '../server/db/index.mjs';

// API基础URL
const API_BASE_URL = 'http://localhost:3001';

// 数据库配置
const dbConfig = {
  host: 'localhost',
  port: 5432,
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: 'postgres' // 首先连接到postgres默认数据库
};

// 创建数据库
async function createDatabaseIfNotExists() {
  console.log('检查并创建数据库...');
  const client = new pg.Client(dbConfig);
  
  try {
    await client.connect();
    
    // 检查cms_db数据库是否存在
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'cms_db'"
    );
    
    if (checkResult.rows.length === 0) {
      console.log('数据库cms_db不存在，正在创建...');
      // 创建数据库
      await client.query('CREATE DATABASE cms_db');
      console.log('✅ 数据库cms_db创建成功');
      
      // 创建数据库后需要创建表
      return true;
    } else {
      console.log('数据库cms_db已存在');
      return true;
    }
  } catch (error) {
    console.error('创建数据库失败:', error.message);
    return false;
  } finally {
    await client.end();
  }
}

// 创建必要的数据库表
async function createTablesIfNotExist() {
  console.log('创建必要的数据库表...');
  
  try {
    // 创建内容类型表
    await query(`
      CREATE TABLE IF NOT EXISTS content_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        fields JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建分类表
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(100) NOT NULL,
        name_zh VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建标签表
    await query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(100) NOT NULL,
        name_zh VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建内容表
    await query(`
      CREATE TABLE IF NOT EXISTS contents (
        id SERIAL PRIMARY KEY,
        type_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT,
        excerpt TEXT,
        featured_image VARCHAR(255),
        status VARCHAR(20) DEFAULT 'draft',
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建内容-分类关联表
    await query(`
      CREATE TABLE IF NOT EXISTS content_categories (
        content_id INTEGER REFERENCES contents(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, category_id)
      )
    `);
    
    // 创建内容-标签关联表
    await query(`
      CREATE TABLE IF NOT EXISTS content_tags (
        content_id INTEGER REFERENCES contents(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, tag_id)
      )
    `);
    
    // 插入测试内容类型数据
    const contentTypeResult = await query("SELECT id FROM content_types WHERE slug = 'blog' LIMIT 1");
    if (contentTypeResult.rows.length === 0) {
      await query(`
        INSERT INTO content_types (name, slug, description, fields) 
        VALUES ('blog', 'blog', 'Blog content type', '{"title": {"type": "text", "required": true}, "content": {"type": "richtext", "required": true}}')
      `);
      console.log('✅ 创建测试内容类型成功');
    }
    
    console.log('✅ 所有数据库表创建成功');
    return true;
  } catch (error) {
    console.error('创建数据库表失败:', error.message);
    return false;
  }
}

// 测试数据库连接
async function testDBConnection() {
  console.log('测试数据库连接...');
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ 数据库连接成功!', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

// 测试内容类型API
async function testContentTypesAPI() {
  console.log('\n测试内容类型API...');
  
  try {
    // 获取所有内容类型
    console.log('获取所有内容类型...');
    const response = await fetch(`${API_BASE_URL}/content-types`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ 成功获取内容类型列表，共${data.data.length}个`);
      
      // 如果有内容类型，测试获取单个内容类型
      if (data.data.length > 0) {
        const contentTypeId = data.data[0].id;
        console.log(`获取单个内容类型(ID: ${contentTypeId})...`);
        
        const detailResponse = await fetch(`${API_BASE_URL}/content-types/${contentTypeId}`);
        const detailData = await detailResponse.json();
        
        if (detailData.success) {
          console.log('✅ 成功获取单个内容类型:', detailData.data.name);
        } else {
          console.error('❌ 获取单个内容类型失败:', detailData.message);
        }
      }
      
      return true;
    } else {
      console.error('❌ 获取内容类型列表失败:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ 测试内容类型API失败:', error.message);
    return false;
  }
}

// 测试分类API
async function testCategoriesAPI() {
  console.log('\n测试分类API...');
  
  try {
    // 获取所有分类
    console.log('获取所有分类...');
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ 成功获取分类列表，共${data.data.length}个`);
      
      // 如果有分类，测试获取单个分类
      if (data.data.length > 0) {
        const categoryId = data.data[0].id;
        console.log(`获取单个分类(ID: ${categoryId})...`);
        
        const detailResponse = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
        const detailData = await detailResponse.json();
        
        if (detailData.success) {
          console.log('✅ 成功获取单个分类:', detailData.data.name_en);
        } else {
          console.error('❌ 获取单个分类失败:', detailData.message);
        }
      }
      
      // 测试分类树结构
      console.log('获取分类树结构(类型: blog)...');
      const treeResponse = await fetch(`${API_BASE_URL}/categories/tree/blog`);
      const treeData = await treeResponse.json();
      
      if (treeData.success) {
        console.log('✅ 成功获取分类树结构');
      } else {
        console.error('❌ 获取分类树结构失败:', treeData.message);
      }
      
      return true;
    } else {
      console.error('❌ 获取分类列表失败:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ 测试分类API失败:', error.message);
    return false;
  }
}

// 测试标签API
async function testTagsAPI() {
  console.log('\n测试标签API...');
  
  try {
    // 获取所有标签
    console.log('获取所有标签...');
    const response = await fetch(`${API_BASE_URL}/tags`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ 成功获取标签列表，共${data.data.length}个`);
      
      // 如果有标签，测试获取单个标签
      if (data.data.length > 0) {
        const tagId = data.data[0].id;
        console.log(`获取单个标签(ID: ${tagId})...`);
        
        const detailResponse = await fetch(`${API_BASE_URL}/tags/${tagId}`);
        const detailData = await detailResponse.json();
        
        if (detailData.success) {
          console.log('✅ 成功获取单个标签:', detailData.data.name_en);
        } else {
          console.error('❌ 获取单个标签失败:', detailData.message);
        }
      }
      
      return true;
    } else {
      console.error('❌ 获取标签列表失败:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ 测试标签API失败:', error.message);
    return false;
  }
}

// 测试内容API
async function testContentsAPI() {
  console.log('\n测试内容API...');
  
  try {
    // 先获取内容类型的ID
    console.log('获取内容类型信息...');
    const contentTypesResponse = await fetch(`${API_BASE_URL}/content-types`);
    const contentTypesData = await contentTypesResponse.json();
    
    if (!contentTypesData.success || contentTypesData.data.length === 0) {
      console.error('✖ 获取内容类型失败，无法继续测试内容API');
      return false;
    }
    
    // 使用第一个可用的内容类型
    const contentType = contentTypesData.data[0];
    if (!contentType) {
      console.error('✖ 未找到可用的内容类型，无法继续测试内容API');
      return false;
    }
    
    console.log(`使用内容类型: ${contentType.name} (ID: ${contentType.id})`);
    
    // 1. 创建内容
    console.log('\n1. 测试创建内容:');
    const newContent = {
      typeId: contentType.id,
      title: "测试内容",
      slug: "test-content-" + Date.now(),
      content: "这是测试内容的详细内容...",
      excerpt: "测试内容摘要",
      featuredImage: "/images/test.jpg",
      status: "draft",
      categoryIds: [],
      tagIds: [],
      metadata: {
        seo: {
          title: "测试SEO标题",
          description: "测试SEO描述"
        }
      }
    };
    
    const createResponse = await fetch(`${API_BASE_URL}/contents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent)
    });
    
    const createdContent = await createResponse.json();
    if (createdContent.success) {
      console.log('✅ 成功创建内容:', createdContent.data.title);
      
      // 共享创建的内容ID用于后续测试
      const contentId = createdContent.data.id;
      
      // 2. 获取内容列表
      console.log('\n2. 测试获取内容列表:');
      const allContentsResponse = await fetch(`${API_BASE_URL}/contents?page=1&limit=10`);
      const allContents = await allContentsResponse.json();
      
      if (allContents.success) {
        console.log(`✅ 成功获取内容列表，共${allContents.data.length}个`);
        console.log('分页信息:', allContents.meta);
        
        // 3. 获取单个内容
        console.log(`\n3. 测试获取单个内容 (ID: ${contentId}):`);
        const singleContentResponse = await fetch(`${API_BASE_URL}/contents/${contentId}`);
        const singleContent = await singleContentResponse.json();
        
        if (singleContent.success) {
          console.log('✅ 成功获取单个内容:', singleContent.data.title);
          
          // 4. 更新内容
          console.log('\n4. 测试更新内容:');
          const updateData = {
            title: "更新测试内容",
            slug: newContent.slug,
            content: "这是更新后的内容..."
          };
          
          const updateResponse = await fetch(`${API_BASE_URL}/contents/${contentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
          });
          
          const updatedContent = await updateResponse.json();
          if (updatedContent.success) {
            console.log('✅ 成功更新内容:', updatedContent.data.title);
            
            // 5. 更新内容状态
            console.log('\n5. 测试更新内容状态:');
            const statusUpdateResponse = await fetch(`${API_BASE_URL}/contents/${contentId}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'published' })
            });
            
            const statusUpdateResult = await statusUpdateResponse.json();
            if (statusUpdateResult.success) {
              console.log('✅ 成功更新内容状态:', statusUpdateResult.data.status);
              
              // 6. 搜索内容
              console.log('\n6. 测试内容搜索:');
              // 添加时间戳确保测试查询参数不被缓存
              // 使用我们在内容API中定义的搜索路径
              const searchResponse = await fetch(`${API_BASE_URL}/contents/api-search?query=更新测试&t=${Date.now()}`);
              const searchResult = await searchResponse.json();
              
              // 输出搜索结果的详细信息以便调试
              console.log('搜索响应:', JSON.stringify(searchResult, null, 2));
              
              // 如果搜索失败，尝试使用不同的请求方式访问搜索API
              if (!searchResult.success) {
                console.log('尝试使用不同的请求方式访问搜索API...');
                try {
                  // 使用正确的路径
                  const directSearchResponse = await fetch(`http://localhost:3001/contents/api-search?query=更新测试&t=${Date.now()}`, {
                    headers: { 'Accept': 'application/json' }
                  });
                  
                  // 检查响应状态
                  console.log('搜索响应状态:', directSearchResponse.status);
                  
                  // 获取响应内容
                  const responseText = await directSearchResponse.text();
                  console.log('响应内容:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
                  
                  // 尝试解析JSON
                  try {
                    const directSearchResult = JSON.parse(responseText);
                    console.log('直接搜索响应:', JSON.stringify(directSearchResult, null, 2));
                  } catch (parseError) {
                    console.error('无法解析响应为JSON:', parseError.message);
                  }
                } catch (error) {
                  console.error('直接访问搜索API失败:', error.message);
                }
              }
              
              if (searchResult.success) {
                console.log(`✅ 成功搜索内容，找到${searchResult.data.length}个结果`);
                
                // 7. 删除内容
                console.log(`\n7. 测试删除内容 (ID: ${contentId}):`);
                const deleteResponse = await fetch(`${API_BASE_URL}/contents/${contentId}`, {
                  method: 'DELETE'
                });
                
                const deleteResult = await deleteResponse.json();
                if (deleteResult.success) {
                  console.log('✅ 成功删除内容');
                  return true;
                } else {
                  console.error('❌ 删除内容失败:', deleteResult.message);
                }
              } else {
                console.error('❌ 搜索内容失败:', searchResult.message);
              }
            } else {
              console.error('❌ 更新内容状态失败:', statusUpdateResult.message);
            }
          } else {
            console.error('❌ 更新内容失败:', updatedContent.message);
          }
        } else {
          console.error('❌ 获取单个内容失败:', singleContent.message);
        }
      } else {
        console.error('❌ 获取内容列表失败:', allContents.message);
      }
    } else {
      console.error('❌ 创建内容失败:', createdContent.message);
    }
    
    return false;
  } catch (error) {
    console.error('❌ 测试内容API失败:', error.message);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('开始运行集成测试...');
  
  // 首先创建数据库（如果不存在）
  const dbCreated = await createDatabaseIfNotExists();
  if (!dbCreated) {
    console.error('数据库初始化失败，中止后续测试');
    return;
  }
  
  // 测试数据库连接
  const dbConnected = await testDBConnection();
  if (!dbConnected) {
    console.error('数据库连接失败，中止后续测试');
    return;
  }
  
  // 创建必要的数据库表
  const tablesCreated = await createTablesIfNotExist();
  if (!tablesCreated) {
    console.error('创建数据库表失败，中止后续测试');
    return;
  }
  
  // 测试API端点
  console.log('\n开始测试API端点...');
  try {
    await testContentTypesAPI();
    await testCategoriesAPI();
    await testTagsAPI();
    await testContentsAPI();
    
    console.log('\n✅ 集成测试全部完成');
  } catch (error) {
    console.error('\n❌ 测试过程中发生错误:', error.message);
  }
}

// 执行测试
runAllTests().catch(error => {
  console.error('测试过程中出现错误:', error);
});
