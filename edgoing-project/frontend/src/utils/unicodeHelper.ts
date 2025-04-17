/**
 * 将Unicode编码的字符串解码为正常字符
 * 例如: "u5c0fu5b66" => "小学"
 */
export const decodeUnicodeString = (str: string | string[] | undefined): string => {
  if (!str) return '';
  
  // 处理字符串数组情况
  if (Array.isArray(str)) {
    return str.map(item => decodeUnicodeSingle(item)).join(',');
  }
  
  // 处理单个字符串情况
  return decodeUnicodeSingle(str);
};

/**
 * 解码单个Unicode编码字符串
 */
const decodeUnicodeSingle = (str: string): string => {
  // 检查字符串是否包含Unicode编码模式 (u后面跟着4-6个十六进制字符)
  if (!str || !str.includes('u')) {
    return str;
  }
  
  try {
    // 分割字符串，处理可能的逗号分隔列表
    return str.split(',').map(item => {
      return item.trim().replace(/u([0-9a-fA-F]{4,6})/g, (match, codePoint) => {
        return String.fromCharCode(parseInt(codePoint, 16));
      });
    }).join(',');
  } catch (error) {
    console.error('Unicode解码失败:', error);
    return str; // 如果解码失败，返回原始字符串
  }
};
