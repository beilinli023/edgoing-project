/**
 * API服务适配器
 * 无侵入式集成静态数据回退机制到现有API服务
 */
import apiService from './apiService';
import { interceptApiRequest } from '@/utils/api-fallback';
import { toast } from 'sonner';
import { AxiosRequestConfig } from 'axios';
import { ZodType, ZodTypeDef } from 'zod';
import { ApiResponse } from './apiService';

// 保存原始方法引用
const originalGet = apiService.get.bind(apiService);
const originalPost = apiService.post.bind(apiService);
const originalPut = apiService.put.bind(apiService);
const originalDelete = apiService.delete.bind(apiService);

// 静态模式禁用，使用真实API数据
const isStaticModeEnabled = false;

// 强制禁用静态模式，即使发生错误也不会回退到静态数据
const FORCE_DISABLE_STATIC = true;

// 增强API服务 - 静态数据回退总是启用
if (isStaticModeEnabled) {
  // 增强GET方法
  apiService.get = function<T>(
    url: string,
    config?: AxiosRequestConfig,
    schema?: ZodType<T, ZodTypeDef, T>
  ): Promise<T> {
    return interceptApiRequest(url, () => originalGet(url, config, schema));
  };

  // 增强POST方法 (只读操作可以考虑回退，写操作应该正常失败)
  apiService.post = function<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    schema?: ZodType<T, ZodTypeDef, T>
  ): Promise<T> {
    return originalPost(url, data, config, schema)
      .catch(error => {
        toast.error('操作暂时不可用，请稍后再试');
        throw error; // 仍然抛出错误，因为写操作不应该假装成功
      });
  };

  // 增强PUT方法
  apiService.put = function<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    schema?: ZodType<T, ZodTypeDef, T>
  ): Promise<T> {
    return originalPut(url, data, config, schema)
      .catch(error => {
        toast.error('操作暂时不可用，请稍后再试');
        throw error;
      });
  };

  // 增强DELETE方法
  apiService.delete = function<T>(
    url: string,
    config?: AxiosRequestConfig,
    schema?: ZodType<T, ZodTypeDef, T>
  ): Promise<T> {
    return originalDelete(url, config, schema)
      .catch(error => {
        toast.error('操作暂时不可用，请稍后再试');
        throw error;
      });
  };

  console.log('[API增强] 静态数据回退机制已启用');
}

export default apiService;
