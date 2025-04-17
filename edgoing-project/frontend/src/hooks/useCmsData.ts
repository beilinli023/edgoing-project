
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse, PaginatedResponse } from '@/types/cmsTypes';

/**
 * 通用CMS数据钩子，用于获取和管理CMS内容
 * @param queryKey 查询键，用于缓存标识
 * @param fetchFn 获取数据的函数
 * @param options 额外选项
 */
export function useCmsData<T, P = any>(
  queryKey: string[],
  fetchFn: (params?: P) => Promise<ApiResponse<T> | PaginatedResponse<T>>,
  options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    enabled?: boolean;
    params?: P;
    defaultToastMessages?: {
      loadError?: string;
    };
  }
) {
  const {
    onSuccess,
    onError,
    enabled = true,
    params,
    defaultToastMessages = {
      loadError: '加载数据失败，请稍后重试'
    }
  } = options || {};

  const [data, setData] = useState<T | T[] | null>(null);
  const queryClient = useQueryClient();

  // 查询数据
  const query = useQuery({
    queryKey: params ? [...queryKey, params] : queryKey,
    queryFn: () => fetchFn(params),
    enabled,
    meta: {
      onSuccess: (responseData: any) => {
        // 处理 ApiResponse 或 PaginatedResponse
        const actualData = 'data' in responseData ? responseData.data : responseData;
        setData(actualData);
        if (onSuccess) onSuccess(actualData);
      },
      onError: (error: Error) => {
        toast({
          title: '错误',
          description: defaultToastMessages.loadError,
          variant: 'destructive'
        });
        if (onError) onError(error);
      }
    }
  });

  return {
    data,
    setData,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    queryClient
  };
}

/**
 * 通用CMS变更钩子，用于创建、更新或删除CMS内容
 * @param queryKey 查询键，用于缓存标识
 * @param mutateFn 变更数据的函数
 * @param options 额外选项
 */
export function useCmsMutation<T, V>(
  queryKey: string[],
  mutateFn: (variables: V) => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    defaultToastMessages?: {
      success?: string;
      error?: string;
    };
  }
) {
  const {
    onSuccess,
    onError,
    defaultToastMessages = {
      success: '操作成功',
      error: '操作失败，请稍后重试'
    }
  } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mutateFn,
    onSuccess: (response) => {
      // 使响应的数据格式一致
      const data = 'data' in response ? response.data : response;
      
      // 刷新缓存
      queryClient.invalidateQueries({ queryKey });
      
      // 显示成功消息
      toast({
        title: '成功',
        description: defaultToastMessages.success,
      });
      
      // 调用自定义成功回调
      if (onSuccess) onSuccess(data as T);
    },
    onError: (error) => {
      // 显示错误消息
      toast({
        title: '错误',
        description: defaultToastMessages.error,
        variant: 'destructive'
      });
      
      // 调用自定义错误回调
      if (onError) onError(error as Error);
    }
  });

  return mutation;
}
