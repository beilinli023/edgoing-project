
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// 创建一个axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 15000, // 增加超时时间到15秒
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 如果有认证令牌，可以在这里添加
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    let message = '操作失败，请稍后再试';
    
    if (error.code === 'ECONNABORTED') {
      message = '请求超时，请检查网络连接';
    } else if (error.response) {
      message = error.response.data?.message || message;
    }

    toast({
      title: '错误',
      description: message,
      variant: 'destructive',
    });
    
    return Promise.reject(error);
  }
);

export default api;
