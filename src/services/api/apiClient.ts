// 导入我们的新API服务
import apiService from './apiService';

// 为了保持向后兼容性，我们简单地导出apiService
export default apiService;

// 添加统一的类型断言辅助函数
// 这个函数帮助我们在使用apiClient时安全地处理返回数据
export const extractData = <T>(response: any): T => {
  // 增加调试日志
  console.log('%c原始API响应数据结构:', 'color: blue; font-weight: bold', {
    type: typeof response,
    isNull: response === null,
    isUndefined: response === undefined,
    keys: response && typeof response === 'object' ? Object.keys(response) : 'N/A',
    isArray: Array.isArray(response),
    hasData: response && typeof response === 'object' && 'data' in response,
    hasSuccess: response && typeof response === 'object' && 'success' in response,
    fullResponse: response
  });

  // 如果响应直接是数组，直接返回
  if (Array.isArray(response)) {
    console.log('%c响应是数组，直接返回数组', 'color: green; font-weight: bold');
    return response as T;
  }

  // 检查是否为axios响应对象
  if (response && typeof response === 'object' && 'status' in response && 'data' in response) {
    console.log('%c检测到axios响应对象，从response.data中提取数据', 'color: green; font-weight: bold');
    return extractData(response.data);
  }

  // 检查response是否为对象且含有data属性
  if (response && typeof response === 'object') {
    // 如果有success属性且为true，并且有data属性
    if (response.success === true && 'data' in response) {
      console.log('%c从Strapi格式响应中提取数据: response.data', 'color: green; font-weight: bold');
      return response.data as T;
    }

    // 如果有data属性
    if ('data' in response) {
      console.log('%c从response.data中提取数据', 'color: green; font-weight: bold');
      console.log('%c提取的data内容:', 'color: blue; font-weight: bold', response.data);
      return response.data as T;
    }
  }

  // 如果没有data属性，则假设整个response就是数据
  console.log('%c使用整个response作为数据', 'color: green; font-weight: bold');
  return response as T;
};
