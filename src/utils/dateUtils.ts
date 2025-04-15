/**
 * 日期格式化工具
 */

/**
 * 格式化日期为本地化字符串
 * @param date 要格式化的日期对象或字符串
 * @param locale 区域设置 (如 'en-US', 'zh-CN')
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string | null, locale: string = 'en-US'): string => {
  if (!date) return "—";
  
  try {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    // 备用格式化方法
    return typeof date === 'string' ? date.split('T')[0] : "—";
  }
};

/**
 * 格式化日期和时间为本地化字符串
 * @param date 要格式化的日期对象
 * @param locale 区域设置 (如 'en-US', 'zh-CN')
 * @returns 格式化后的日期和时间字符串
 */
export const formatDateTime = (date: Date, locale: string = 'en-US'): string => {
  try {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('DateTime formatting error:', error);
    // 备用格式化方法
    return new Date(date).toISOString().replace('T', ' ').substring(0, 16);
  }
};

/**
 * 计算相对时间（如"3天前"）
 * @param date 要计算的日期对象
 * @param locale 区域设置，影响返回的文字语言 ('en', 'zh')
 * @returns 相对时间字符串
 */
export const getRelativeTime = (date: Date, locale: string = 'en'): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const translations = {
    en: {
      justNow: 'just now',
      minutesAgo: (m: number) => `${m} minute${m === 1 ? '' : 's'} ago`,
      hoursAgo: (h: number) => `${h} hour${h === 1 ? '' : 's'} ago`,
      daysAgo: (d: number) => `${d} day${d === 1 ? '' : 's'} ago`,
      weeksAgo: (w: number) => `${w} week${w === 1 ? '' : 's'} ago`,
      monthsAgo: (m: number) => `${m} month${m === 1 ? '' : 's'} ago`,
      yearsAgo: (y: number) => `${y} year${y === 1 ? '' : 's'} ago`,
    },
    zh: {
      justNow: '刚刚',
      minutesAgo: (m: number) => `${m}分钟前`,
      hoursAgo: (h: number) => `${h}小时前`,
      daysAgo: (d: number) => `${d}天前`,
      weeksAgo: (w: number) => `${w}周前`,
      monthsAgo: (m: number) => `${m}个月前`,
      yearsAgo: (y: number) => `${y}年前`,
    }
  };
  
  // 使用英文作为默认备用选项
  const t = translations[locale as 'en' | 'zh'] || translations.en;
  
  if (diffInSeconds < 60) {
    return t.justNow;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return t.minutesAgo(minutes);
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return t.hoursAgo(hours);
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return t.daysAgo(days);
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return t.weeksAgo(weeks);
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return t.monthsAgo(months);
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return t.yearsAgo(years);
  }
};
