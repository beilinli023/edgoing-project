import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

/**
 * 标准化API响应格式
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * API错误类型
 */
export enum ApiErrorType {
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'authentication_error',
  AUTHORIZATION = 'authorization_error',
  NOT_FOUND = 'not_found',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error',
  UNKNOWN = 'unknown_error'
}

/**
 * 自定义API错误类
 */
export class ApiError extends Error {
  type: ApiErrorType;
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(message: string, type: ApiErrorType, statusCode?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * 统一的API服务类
 */
export class ApiService {
  private client: AxiosInstance;
  private language: string = 'en';

  /**
   * 构造函数
   * @param baseURL API的基础URL，默认为'/api'
   * @param requestTimeout 请求超时时间，默认为10000毫秒
   */
  constructor(baseURL = '/api', requestTimeout = 10000) {
    console.log(`初始化ApiService，baseURL: ${baseURL}`);

    // 创建axios实例
    this.client = axios.create({
      baseURL,
      timeout: requestTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    this.setupInterceptors();
  }

  /**
   * 设置当前语言（用于错误消息本地化）
   */
  setLanguage(lang: string): void {
    this.language = lang;
  }

  /**
   * 获取本地化的错误消息
   */
  private getLocalizedErrorMessage(error: ApiError): string {
    if (this.language === 'zh') {
      switch (error.type) {
        case ApiErrorType.VALIDATION:
          return '表单验证失败，请检查您的输入';
        case ApiErrorType.AUTHENTICATION:
          return '身份验证失败，请重新登录';
        case ApiErrorType.AUTHORIZATION:
          return '您没有权限执行此操作';
        case ApiErrorType.NOT_FOUND:
          return '请求的资源不存在';
        case ApiErrorType.SERVER_ERROR:
          return '服务器错误，请稍后再试';
        case ApiErrorType.NETWORK_ERROR:
          return '网络错误，请检查您的连接';
        default:
          return error.message || '发生未知错误';
      }
    } else {
      switch (error.type) {
        case ApiErrorType.VALIDATION:
          return 'Validation failed, please check your input';
        case ApiErrorType.AUTHENTICATION:
          return 'Authentication failed, please log in again';
        case ApiErrorType.AUTHORIZATION:
          return 'You are not authorized to perform this action';
        case ApiErrorType.NOT_FOUND:
          return 'The requested resource was not found';
        case ApiErrorType.SERVER_ERROR:
          return 'Server error, please try again later';
        case ApiErrorType.NETWORK_ERROR:
          return 'Network error, please check your connection';
        default:
          return error.message || 'An unknown error occurred';
      }
    }
  }

  /**
   * 设置请求/响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 从localStorage获取令牌
        const token = localStorage.getItem('auth_token');

        // 如果存在令牌，添加到请求头
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        // --- 添加拦截器调试日志 ---
        console.log('[DEBUG][Interceptor] Intercepting successful response. Status:', response.status);
        console.log('[DEBUG][Interceptor] Raw response headers:', response.headers);
        console.log('[DEBUG][Interceptor] Raw response data BEFORE Axios default transform:', response.request?.responseText || '(Could not access raw responseText)'); // 尝试获取原始文本
        console.log('[DEBUG][Interceptor] response.data AFTER Axios default transform:', response.data);
        // --- 结束调试日志 ---

        // --- 修复：返回 response.data ---
        return response.data;
      },
      (error) => {
        const apiError = this.handleError(error);

        // 检查是否是来自静态数据回退的请求
        const isStaticFallbackRequest = error.config?.headers?.['X-Static-Fallback'] === 'true';

        // 仅当不是静态数据回退请求时才显示错误
        if (!isStaticFallbackRequest) {
          // 显示错误提示
          const errorMessage = this.getLocalizedErrorMessage(apiError);
          toast.error(errorMessage);

          // 处理特定类型的错误
          if (apiError.type === ApiErrorType.AUTHENTICATION) {
            localStorage.removeItem('auth_token');
            // 如果在管理后台页面，重定向到登录页
            if (window.location.pathname.startsWith('/admin') ||
                window.location.pathname.startsWith('/content') ||
                window.location.pathname === '/login') {
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * 处理API错误，转换为统一格式
   */
  private handleError(error: AxiosError | Error): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<unknown>;

      if (axiosError.response) {
        const statusCode = axiosError.response.status;
        const responseData = axiosError.response.data; // Type is unknown

        // --- Safely access properties on unknown responseData ---
        const message = (responseData && typeof responseData === 'object' && 'message' in responseData && typeof (responseData as any).message === 'string')
                        ? (responseData as any).message
                        : axiosError.message; // Fallback to Axios error message
        const errors = (responseData && typeof responseData === 'object' && 'errors' in responseData && typeof (responseData as any).errors === 'object')
                       ? (responseData as any).errors as Record<string, string[]>
                       : undefined;
        // --- End safe access ---

        switch (statusCode) {
          case 400:
            return new ApiError(message || 'Bad Request', ApiErrorType.VALIDATION, statusCode, errors); // Use safe 'message' and 'errors'
          case 401:
            return new ApiError(message || 'Unauthorized', ApiErrorType.AUTHENTICATION, statusCode);
          case 403:
            return new ApiError(message || 'Forbidden', ApiErrorType.AUTHORIZATION, statusCode);
          case 404:
            return new ApiError(message || 'Not Found', ApiErrorType.NOT_FOUND, statusCode);
          case 422: // Unprocessable Entity (often used for validation errors)
             return new ApiError(message || 'Validation Error', ApiErrorType.VALIDATION, statusCode, errors); // Use safe 'message' and 'errors'
          default:
            if (statusCode >= 500) {
              return new ApiError(message || 'Server Error', ApiErrorType.SERVER_ERROR, statusCode);
            }
            return new ApiError(message || 'Unknown Response Error', ApiErrorType.UNKNOWN, statusCode);
        }
      } else if (axiosError.request) {
        // Network error (no response received)
        return new ApiError(axiosError.message || 'Network Error', ApiErrorType.NETWORK_ERROR);
      } else {
        // Axios setup error
        return new ApiError(axiosError.message || 'Axios setup error', ApiErrorType.UNKNOWN);
      }
    }
    // Handle non-Axios errors (like network errors or programming errors)
    if (error instanceof Error) {
      return new ApiError(error.message || 'Unknown Error', ApiErrorType.UNKNOWN);
    }
    // Fallback for truly unknown errors
    return new ApiError('An unexpected error occurred', ApiErrorType.UNKNOWN);
  }

  /**
   * 使用Zod验证API响应数据
   */
  private validateResponse<T>(data: unknown, schema: z.ZodType<T>): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = this.formatZodErrors(error);
        console.error('API响应验证失败:', formattedErrors);
        throw new ApiError('API response validation failed', ApiErrorType.VALIDATION, undefined, formattedErrors);
      }
      console.error('发生意外的验证错误:', error);
      throw new ApiError('An unexpected validation error occurred', ApiErrorType.UNKNOWN);
    }
  }

  /**
   * 格式化Zod错误为统一格式
   */
  private formatZodErrors(error: z.ZodError): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    error.errors.forEach(err => {
      const path = err.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(err.message);
    });

    return errors;
  }

  /**
   * 发送GET请求
   */
  async get<T>(url: string, config?: AxiosRequestConfig, schema?: z.ZodType<T>): Promise<T> {
    console.log(`[DEBUG][ApiService.get] Making GET request to: ${url}`);
    try {
      // Axios call now returns data directly due to interceptor
      const responseData = await this.client.get<T>(url, config);
      console.log(`[DEBUG][ApiService.get] Response received. Status: 200 (assumed after interceptor)`); // Status not available directly here
      console.log(`[DEBUG][ApiService.get] responseData BEFORE potential schema validation:`, responseData);

      if (schema) {
        const validatedData = this.validateResponse(responseData, schema);
        console.log(`[DEBUG][ApiService.get] Schema validation successful.`);
        return validatedData;
      }

      console.log(`[DEBUG][ApiService.get] No schema, returning responseData directly:`, responseData);
      return responseData;
    } catch (error) {
      // Error should already be ApiError type from interceptor/handleError
      console.log(`[DEBUG][ApiService.get] Error caught in get method:`, error);
      if (error instanceof ApiError) {
        console.log(`[DEBUG][ApiService.get] Re-throwing ApiError:`, error);
        throw error;
      } else {
        // If it's not an ApiError, wrap it
        console.log(`[DEBUG][ApiService.get] Wrapping non-ApiError:`, error);
        throw this.handleError(error as Error); // Wrap unexpected errors
      }
    }
  }

  /**
   * 发送POST请求
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig, schema?: z.ZodType<T>): Promise<T> {
    try {
      const responseData = await this.client.post<T>(url, data, config);
      if (schema) {
        return this.validateResponse(responseData, schema);
      }
      return responseData;
    } catch (error) {
      throw this.handleError(error as Error);
    }
  }

  /**
   * 发送PUT请求
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig, schema?: z.ZodType<T>): Promise<T> {
    try {
      const responseData = await this.client.put<T>(url, data, config);
      if (schema) {
        return this.validateResponse(responseData, schema);
      }
      return responseData;
    } catch (error) {
      throw this.handleError(error as Error);
    }
  }

  /**
   * 发送DELETE请求
   */
  async delete<T>(url: string, config?: AxiosRequestConfig, schema?: z.ZodType<T>): Promise<T> {
    try {
      const responseData = await this.client.delete<T>(url, config);
      if (schema) {
        return this.validateResponse(responseData, schema);
      }
      return responseData;
    } catch (error) {
      throw this.handleError(error as Error);
    }
  }
}

// 创建并导出默认的API服务实例
// 修正：将 baseURL 设置为默认值 '/api'
const apiService = new ApiService('/api');

// 添加调试日志
console.log('%c✅ API服务初始化完成，baseURL为/api', 'color: green; font-weight: bold');

export default apiService;
