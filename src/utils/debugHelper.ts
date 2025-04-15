/**
 * 调试辅助工具
 * 用于在控制台中输出详细的调试信息，帮助排查问题
 */

// 是否启用详细调试日志
const DEBUG_ENABLED = true;

/**
 * 输出详细的调试日志
 * @param context 日志上下文（通常是组件或服务名称）
 * @param message 日志消息
 * @param data 相关数据（可选）
 */
export const debugLog = (context: string, message: string, data?: unknown) => {
  if (!DEBUG_ENABLED) return;
  
  console.group(`🔍 [DEBUG] ${context}`);
  console.log(`📝 ${message}`);
  if (data !== undefined) {
    console.log('📊 数据:', data);
  }
  console.groupEnd();
};

/**
 * 输出错误日志
 * @param context 日志上下文（通常是组件或服务名称）
 * @param message 错误消息
 * @param error 错误对象（可选）
 */
export const errorLog = (context: string, message: string, error?: unknown) => {
  console.group(`❌ [ERROR] ${context}`);
  console.error(`⚠️ ${message}`);
  if (error) {
    console.error('🔥 错误详情:', error);
    if (error instanceof Error) {
      console.error('📋 堆栈:', error.stack);
    }
  }
  console.groupEnd();
};

/**
 * 跟踪数据加载过程
 * @param context 日志上下文
 * @param action 当前动作
 * @param data 相关数据
 */
export const traceDataLoading = (context: string, action: string, data?: unknown) => {
  if (!DEBUG_ENABLED) return;
  
  console.group(`📊 [DATA] ${context}`);
  console.log(`🔄 ${action}`);
  if (data !== undefined) {
    console.log('📦 数据:', data);
  }
  console.groupEnd();
};

/**
 * 跟踪HTTP请求和响应
 * @param context 日志上下文
 * @param url 请求的URL
 * @param response 响应对象
 */
export const traceApiRequest = async (context: string, url: string, response: Response) => {
  if (!DEBUG_ENABLED) return;
  
  let responseText = '';
  let responseJson = null;
  
  try {
    // 克隆响应以便可以多次读取
    const clonedResponse = response.clone();
    responseText = await clonedResponse.text();
    
    try {
      responseJson = JSON.parse(responseText);
    } catch (e) {
      // 非JSON响应
    }
  } catch (e) {
    responseText = `[无法读取响应内容: ${e}]`;
  }
  
  console.group(`🌐 [API] ${context}`);
  console.log(`🔗 URL: ${url}`);
  console.log(`📊 状态: ${response.status} ${response.statusText}`);
  console.log(`📋 响应头:`, Object.fromEntries([...response.headers.entries()]));
  console.log(`📄 响应内容: ${responseText.substring(0, 500)}${responseText.length > 500 ? '...' : ''}`);
  if (responseJson) {
    console.log(`🔄 解析后的JSON:`, responseJson);
  }
  console.groupEnd();
};

export default {
  debugLog,
  errorLog,
  traceDataLoading,
  traceApiRequest
};
