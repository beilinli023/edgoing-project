
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { z } from 'zod';
import apiService, { ApiError, ApiErrorType } from '@/services/api/apiService';
import { useLanguage } from '@/context/LanguageContext';

/**
 * 用于API获取的自定义Hook
 */
export function useApiQuery<T>(
  key: QueryKey,
  url: string,
  schema?: z.ZodType<T>,
  options?: {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchInterval?: number | false;
    retry?: number | boolean;
    initialData?: T;
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
  }
) {
  const { currentLanguage } = useLanguage();
  
  // 设置API服务的语言
  apiService.setLanguage(currentLanguage);
  
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        return await apiService.get<T>(url, undefined, schema);
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        
        throw new ApiError(
          'Failed to fetch data',
          ApiErrorType.UNKNOWN
        );
      }
    },
    ...options
  });
}

/**
 * 用于API提交的自定义Hook
 */
export function useApiMutation<TData, TVariables>(
  url: string,
  method: 'post' | 'put' | 'delete' = 'post',
  schema?: z.ZodType<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: ApiError, variables: TVariables) => void;
    onSettled?: (data: TData | undefined, error: ApiError | null, variables: TVariables) => void;
    invalidateQueries?: QueryKey[];
  }
) {
  const { currentLanguage } = useLanguage();
  const queryClient = useQueryClient();
  
  // 设置API服务的语言
  apiService.setLanguage(currentLanguage);
  
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      try {
        let response;
        
        switch (method) {
          case 'post':
            response = await apiService.post<TData>(url, variables, undefined, schema);
            break;
          case 'put':
            response = await apiService.put<TData>(url, variables, undefined, schema);
            break;
          case 'delete':
            response = await apiService.delete<TData>(`${url}${variables ? `/${variables}` : ''}`, undefined, schema);
            break;
          default:
            response = await apiService.post<TData>(url, variables, undefined, schema);
        }
        
        return response;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        
        throw new ApiError(
          'Failed to process request',
          ApiErrorType.UNKNOWN
        );
      }
    },
    onSuccess: (data, variables) => {
      // 如果指定了需要失效的查询，则使其失效
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      
      // 调用成功回调
      if (options?.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      // 调用错误回调
      if (options?.onError && error instanceof ApiError) {
        options.onError(error, variables);
      }
    },
    onSettled: (data, error, variables) => {
      // 调用完成回调
      if (options?.onSettled) {
        options.onSettled(
          data,
          error instanceof ApiError ? error : null,
          variables as TVariables
        );
      }
    }
  });
}

/**
 * 低级API Hook，适用于非React Query场景
 */
export function useApiCall() {
  const { currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  // 设置API服务的语言
  useEffect(() => {
    apiService.setLanguage(currentLanguage);
  }, [currentLanguage]);
  
  /**
   * 执行API调用
   */
  const callApi = async <T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    schema?: z.ZodType<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (method) {
        case 'get':
          response = await apiService.get<T>(url, undefined, schema);
          break;
        case 'post':
          response = await apiService.post<T>(url, data, undefined, schema);
          break;
        case 'put':
          response = await apiService.put<T>(url, data, undefined, schema);
          break;
        case 'delete':
          response = await apiService.delete<T>(url, undefined, schema);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error);
      } else {
        setError(new ApiError(
          'An unexpected error occurred',
          ApiErrorType.UNKNOWN
        ));
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    callApi,
    clearError: () => setError(null)
  };
}
