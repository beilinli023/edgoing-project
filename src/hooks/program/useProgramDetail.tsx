import { useParams } from 'react-router-dom';
import { Program } from '@/types/programTypes';
import { useLanguage } from '@/context/LanguageContext';
import { useProgram } from '@/hooks/useProgram';

// 删除所有静态数据

export function useProgramDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const { currentLanguage } = useLanguage();

  // 使用 React Query 的 useProgram 钩子
  const { data: program, isLoading: loading, error: queryError } = useProgram(id);

  // 添加调试信息
  console.log(`useProgramDetail - 使用 React Query 获取项目，ID: ${id}`);
  console.log(`useProgramDetail - 当前页面URL: ${window.location.href}`);
  console.log(`useProgramDetail - 项目数据:`, program);

  // 格式化错误信息
  const error = queryError
    ? (queryError instanceof Error
        ? queryError.message
        : currentLanguage === 'en' ? 'Failed to load program' : '加载项目失败')
    : null;

  return {
    id,
    program: program as Program | null,
    loading,
    error
  };
}
