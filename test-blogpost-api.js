import axios from 'axios';

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = '4676dbc8a5b9f4e5cc9c0c3460479b958bb0a61185171d91221439840189afb2466badc14e0f938cf94a7802ad566a211529b292163c3d24875f919687576ccbd06a773c158c84cacdf7be274bca8dbbb30454e865d4a4ffdd9bdf9a33ea05dcbf5e59f0662128b96c1bb8714deb4fcf200a78e39fd770d218b96a80e7b718e7';

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

async function createBlogPost() {
  try {
    // 创建英文博客文章
    const enResponse = await axios.post(`${STRAPI_URL}/api/blogposts`, {
      data: {
        title: 'Hello World',
        content: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', text: 'This is a test blog post in English' }
            ]
          }
        ],
        author: 'Test Author',
        Date: new Date().toISOString().split('T')[0],
        locale: 'en',
        publishedAt: new Date().toISOString()
      }
    }, { headers });

    console.log('Created English post:', enResponse.data);

    // 为英文文章创建中文本地化版本
    const zhResponse = await axios.post(
      `${STRAPI_URL}/api/blogposts/${enResponse.data.data.id}/localizations`, 
      {
        data: {
          title: '你好世界',
          content: [
            {
              type: 'paragraph',
              children: [
                { type: 'text', text: '这是一篇中文测试博客文章' }
              ]
            }
          ],
          author: '测试作者',
          locale: 'zh-Hans'
        }
      },
      { headers }
    );

    console.log('Created Chinese localization:', zhResponse.data);

    return enResponse.data.data.id;
  } catch (error) {
    console.error('Error creating blog post:', error.response?.data || error.message);
  }
}

async function getBlogPost(id) {
  try {
    // 获取包含所有本地化版本的博客文章
    const response = await axios.get(`${STRAPI_URL}/api/blogposts/${id}?populate=localizations`, 
      { headers }
    );

    console.log('Blog post with localizations:', response.data);
  } catch (error) {
    console.error('Error fetching blog post:', error.response?.data || error.message);
  }
}

// 执行测试
async function runTest() {
  const postId = await createBlogPost();
  if (postId) {
    await getBlogPost(postId);
  }
}

runTest(); 