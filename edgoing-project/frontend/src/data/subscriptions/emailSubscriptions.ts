// 使用浏览器兼容的存储方式实现邮件订阅存储

// 邮件订阅记录接口
export interface EmailSubscription {
  id: string;
  email: string;
  subscribeDate: string;
  source: string;
  status: 'active' | 'unsubscribed';
}

// localStorage的键名
const STORAGE_KEY = 'edgoing_email_subscriptions';

// 确保存储初始化
const ensureStorageInitialized = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// 读取所有订阅信息
export const getAllSubscriptions = (): EmailSubscription[] => {
  try {
    ensureStorageInitialized();
    const subscriptions = localStorage.getItem(STORAGE_KEY);
    return subscriptions ? JSON.parse(subscriptions) as EmailSubscription[] : [];
  } catch (error) {
    console.error('读取订阅信息失败:', error);
    return [];
  }
};

// 保存新的订阅信息
export const saveSubscription = (email: string, source: string = 'website'): EmailSubscription => {
  try {
    ensureStorageInitialized();
    
    const subscriptions = getAllSubscriptions();
    
    // 检查邮箱是否已存在
    const existingIndex = subscriptions.findIndex(sub => sub.email === email);
    
    if (existingIndex !== -1) {
      // 如果邮箱已存在但状态为非活跃，则更新状态
      if (subscriptions[existingIndex].status !== 'active') {
        subscriptions[existingIndex].status = 'active';
        subscriptions[existingIndex].subscribeDate = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
      }
      return subscriptions[existingIndex];
    }
    
    // 创建新订阅
    const newSubscription: EmailSubscription = {
      id: `sub_${Date.now()}`,
      email,
      subscribeDate: new Date().toISOString(),
      source,
      status: 'active'
    };
    
    subscriptions.push(newSubscription);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    
    // 同时尝试使用console.table展示表格数据
    console.table(subscriptions);
    
    return newSubscription;
  } catch (error) {
    console.error('保存订阅信息失败:', error);
    throw new Error('保存订阅信息失败');
  }
};

// 取消订阅
export const unsubscribe = (email: string): boolean => {
  try {
    const subscriptions = getAllSubscriptions();
    const subIndex = subscriptions.findIndex(sub => sub.email === email);
    
    if (subIndex === -1) {
      return false;
    }
    
    subscriptions[subIndex].status = 'unsubscribed';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    
    return true;
  } catch (error) {
    console.error('取消订阅失败:', error);
    return false;
  }
};

// 导出为CSV格式文本
export const exportToCSV = (): string => {
  const subscriptions = getAllSubscriptions();
  const header = 'ID,Email,Subscribe Date,Source,Status\n';
  const rows = subscriptions.map(sub => 
    `${sub.id},${sub.email},${sub.subscribeDate},${sub.source},${sub.status}`
  ).join('\n');
  
  return header + rows;
};

// 导出所有功能
export default {
  getAllSubscriptions,
  saveSubscription,
  unsubscribe,
  exportToCSV
};
