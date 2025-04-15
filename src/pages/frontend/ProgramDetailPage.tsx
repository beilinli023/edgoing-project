import React from 'react';
import FrontendLayout from '@/components/frontend/FrontendLayout';
import { useProgramDetail } from '@/hooks/program/useProgramDetail';
import ProgramDetailHero from '@/components/frontend/programs/detail/ProgramDetailHero';
import ProgramContentTabs from '@/components/frontend/programs/detail/ProgramContentTabs';
// 移除不需要的import
import ProgramDetailLoading from '@/components/frontend/programs/detail/ProgramDetailLoading';
import ProgramDetailError from '@/components/frontend/programs/detail/ProgramDetailError';

const ProgramDetailPage = () => {
  const { id, program, loading, error } = useProgramDetail();
  
  // 添加调试信息，仅在开发环境中显示
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ProgramDetailPage - ID:', id);
      console.log('ProgramDetailPage - Program:', program);
      console.log('ProgramDetailPage - Loading:', loading);
      console.log('ProgramDetailPage - Error:', error);
    }
  }, [id, program, loading, error]);
  
  // 在开发环境中添加更详细的错误显示
  const renderDebugInfo = () => {
    // 确保只在开发环境中显示，强制检查NODE_ENV
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="bg-yellow-100 p-4 mb-4 rounded border border-yellow-300">
        <h2 className="text-xl font-bold mb-2 text-yellow-800">调试信息</h2>
        <div className="mb-2">
          <strong>程序ID:</strong> {id}
        </div>
        <div className="mb-2">
          <strong>加载状态:</strong> {loading ? '加载中...' : '加载完成'}
        </div>
        {error && (
          <div className="mb-2">
            <strong>错误信息:</strong> <span className="text-red-600">{error}</span>
          </div>
        )}
        <div className="mb-2">
          <strong>程序数据:</strong> {program ? '已加载' : '未加载'}
        </div>
        {program && (
          <div className="mt-2 overflow-auto max-h-40 bg-white p-2 rounded">
            <pre className="text-xs">{JSON.stringify(program, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <FrontendLayout>
        <ProgramDetailLoading />
      </FrontendLayout>
    );
  }
  
  if (error || !program) {
    return (
      <FrontendLayout>
        <ProgramDetailError error={error} />
        <div className="container mx-auto p-4">
          <div className="bg-red-100 p-4 rounded border border-red-300 text-red-800">
            <h2 className="text-xl font-bold mb-2">无法加载程序详情</h2>
            <p>非常抱歉，无法加载该程序的详细信息。请稍后再试。</p>
            {error && (
              <div className="mt-2 bg-white p-2 rounded">
                <p className="font-bold">错误详情:</p>
                <p className="font-mono text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      {/* Hero section */}
      <ProgramDetailHero program={program} />
      
      {/* Content section */}
      <div className="container mx-auto py-8 px-8 max-w-6xl">
        <div className="flex flex-col">
          <div className="w-full">
            <ProgramContentTabs program={program} />
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default ProgramDetailPage;
