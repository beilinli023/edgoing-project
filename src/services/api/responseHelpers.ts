/**
 * 安全地从API响应中提取数据
 * 
 * 解决TypeScript中"Property 'data' does not exist on type 'unknown'"的错误
 */
export function extractData<T>(response: any): T {
  // 检查是否为axios响应对象
  if (response && typeof response === 'object' && 'status' in response && 'data' in response) {
    console.log('检测到axios响应对象，从response.data中提取数据');
    return extractData(response.data);
  }
  
  // 检查是否为标准JSON响应
  if (response && typeof response === 'object' && 'data' in response) {
    console.log('从response.data中提取标准JSON数据');
    return response.data as T;
  }
  
  // 返回原始响应
  console.log('使用原始响应作为数据');
  return response as T;
}

/**
 * 安全地从API响应中提取分页数据
 */
export function extractPaginatedData<T>(response: any): { data: T[], pagination: any } {
  if (response && typeof response === 'object') {
    const data = 'data' in response ? response.data : [];
    const pagination = response.pagination || {
      current: 1,
      total: data.length,
      pages: 1
    };
    
    return { 
      data: data as T[],
      pagination
    };
  }
  
  return { data: [] as T[], pagination: { current: 1, total: 0, pages: 1 } };
}

/**
 * 验证API数据是否符合预期格式
 */
export function validateApiData<T>(
  data: any, 
  validator: (data: any) => boolean, 
  defaultValue: T
): T {
  if (data && typeof data === 'object' && validator(data)) {
    return data as T;
  }
  return defaultValue;
}

/**
 * 安全地处理仪表盘统计数据
 */
export function processDashboardStats(response: any): {
  programCount: number;
  blogPostCount: number;
  faqCount: number;
  mediaCount: number;
  newSubmissions: number;
  completedSubmissions: number;
  totalSubmissions: number;
  quickActions?: Array<{
    label: string;
    icon: string;
    path: string;
  }>;
} {
  const defaultStats = {
    programCount: 0,
    blogPostCount: 0,
    faqCount: 0,
    mediaCount: 0,
    newSubmissions: 0,
    completedSubmissions: 0,
    totalSubmissions: 0
  };
  
  if (!response || typeof response !== 'object') {
    return defaultStats;
  }
  
  // 提取data字段如果存在
  const data = 'data' in response ? response.data : response;
  
  return {
    programCount: typeof data.programCount === 'number' ? data.programCount : 0,
    blogPostCount: typeof data.blogPostCount === 'number' ? data.blogPostCount : 0,
    faqCount: typeof data.faqCount === 'number' ? data.faqCount : 0,
    mediaCount: typeof data.mediaCount === 'number' ? data.mediaCount : 0,
    newSubmissions: typeof data.newSubmissions === 'number' ? data.newSubmissions : 0,
    completedSubmissions: typeof data.completedSubmissions === 'number' ? data.completedSubmissions : 0,
    totalSubmissions: typeof data.totalSubmissions === 'number' ? data.totalSubmissions : 0,
    quickActions: Array.isArray(data.quickActions) ? data.quickActions : undefined
  };
}

/**
 * 处理导航菜单数据
 */
export function processNavigationData(response: any): Array<{
  id: number;
  title_en: string;
  title_zh: string;
  url: string;
  order: number;
  parent_id: number | null;
  is_visible: boolean;
}> {
  if (!response || !response.data || !Array.isArray(response.data)) {
    return [];
  }
  
  return response.data.map((item: any) => ({
    id: item.id || 0,
    title_en: item.title_en || '',
    title_zh: item.title_zh || '',
    url: item.url || '',
    order: item.order || 0,
    parent_id: item.parent_id || null,
    is_visible: item.is_visible !== false
  }));
}

/**
 * 处理联系信息数据
 */
export function processContactInfo(response: any): {
  id: number;
  phone_en: string;
  phone_zh: string;
  email: string;
  address_en: string;
  address_zh: string;
  hours_en: string;
  hours_zh: string;
} {
  const defaultContact = {
    id: 0,
    phone_en: '',
    phone_zh: '',
    email: '',
    address_en: '',
    address_zh: '',
    hours_en: '',
    hours_zh: ''
  };
  
  if (!response || !response.data) {
    return defaultContact;
  }
  
  const data = response.data;
  
  return {
    id: data.id || 0,
    phone_en: data.phone_en || '',
    phone_zh: data.phone_zh || '',
    email: data.email || '',
    address_en: data.address_en || '',
    address_zh: data.address_zh || '',
    hours_en: data.hours_en || '',
    hours_zh: data.hours_zh || ''
  };
}

/**
 * 处理社交媒体数据
 */
export function processSocialMedia(response: any): Array<{
  id: number;
  platform: string;
  url: string;
  icon: string;
  order: number;
}> {
  if (!response || !response.data || !Array.isArray(response.data)) {
    return [];
  }
  
  return response.data.map((item: any) => ({
    id: item.id || 0,
    platform: item.platform || '',
    url: item.url || '',
    icon: item.icon || '',
    order: item.order || 0
  }));
}

/**
 * 处理快速链接数据
 */
export function processQuickLinks(response: any): Array<{
  id: number;
  text_en: string;
  text_zh: string;
  url: string;
  order: number;
}> {
  if (!response || !response.data || !Array.isArray(response.data)) {
    return [];
  }
  
  return response.data.map((item: any) => ({
    id: item.id || 0,
    text_en: item.text_en || '',
    text_zh: item.text_zh || '',
    url: item.url || '',
    order: item.order || 0
  }));
}

/**
 * 处理API错误响应
 */
export function handleApiError(error: any): { 
  message: string, 
  statusCode?: number 
} {
  // 检查错误响应
  if (error.response) {
    return {
      message: error.response.data?.message || '服务器错误',
      statusCode: error.response.status
    };
  }
  
  // 检查请求错误
  if (error.request) {
    return {
      message: '无法连接到服务器，请检查网络连接'
    };
  }
  
  // 其他错误
  return {
    message: error.message || '发生未知错误'
  };
}
