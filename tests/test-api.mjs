import axios from 'axios';

async function testApi() {
  try {
    console.log('开始测试API...');
    
    // 测试前端代理路径
    try {
      console.log('测试前端代理路径: /proxy/blog/blogpost-2');
      const proxyResponse = await axios.get('http://localhost:8083/proxy/blog/blogpost-2', {
        params: { locale: 'zh', includeRelated: true }
      });
      console.log('前端代理路径响应状态码:', proxyResponse.status);
      console.log('前端代理路径响应数据类型:', typeof proxyResponse.data);
      console.log('前端代理路径响应数据:', proxyResponse.data);
    } catch (proxyError) {
      console.error('前端代理路径请求失败:', proxyError.message);
      if (proxyError.response) {
        console.error('状态码:', proxyError.response.status);
        console.error('响应头:', proxyError.response.headers);
      }
    }
    
    // 测试后端API路径
    try {
      console.log('\n测试后端API路径: /api/blog/blogpost-2');
      const apiResponse = await axios.get('http://localhost:8083/api/blog/blogpost-2', {
        params: { locale: 'zh', includeRelated: true }
      });
      console.log('后端API路径响应状态码:', apiResponse.status);
      console.log('后端API路径响应数据类型:', typeof apiResponse.data);
      console.log('后端API路径响应数据:', apiResponse.data);
    } catch (apiError) {
      console.error('后端API路径请求失败:', apiError.message);
      if (apiError.response) {
        console.error('状态码:', apiError.response.status);
        console.error('响应头:', apiError.response.headers);
      }
    }
    
    // 测试直接访问后端服务器
    try {
      console.log('\n测试直接访问后端服务器: http://localhost:3001/api/blog/blogpost-2');
      const directResponse = await axios.get('http://localhost:3001/api/blog/blogpost-2', {
        params: { locale: 'zh', includeRelated: true }
      });
      console.log('直接访问响应状态码:', directResponse.status);
      console.log('直接访问响应数据类型:', typeof directResponse.data);
      console.log('直接访问响应数据:', directResponse.data);
    } catch (directError) {
      console.error('直接访问请求失败:', directError.message);
      if (directError.response) {
        console.error('状态码:', directError.response.status);
        console.error('响应头:', directError.response.headers);
      }
    }
    
    console.log('API测试完成');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

testApi();
