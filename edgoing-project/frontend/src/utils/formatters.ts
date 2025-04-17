/**
 * 格式化程序类型，处理字符串或字符串数组
 * 该函数可以安全地处理不同格式的program_type数据
 */
export const formatProgramType = (type: string | string[] | undefined): string => {
  if (!type) return '';
  if (Array.isArray(type)) {
    return type.join(', ');
  }
  return type;
};
