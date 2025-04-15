import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

// 多语言文本配置
const TEXT = {
  en: {
    title: 'Program Not Found',
    message: 'The program you are looking for does not exist or has been removed.',
    errorDetails: 'Error details:',
    backButton: 'Back to Programs',
    refreshButton: 'Refresh Page',
    tryAgain: 'Try Again',
    diagnosticInfo: 'Diagnostic Information:'
  },
  zh: {
    title: '未找到项目',
    message: '您查找的项目不存在或已被移除。',
    errorDetails: '错误详情:',
    backButton: '返回项目列表',
    refreshButton: '刷新页面',
    tryAgain: '重试',
    diagnosticInfo: '诊断信息:'
  }
};

interface ProgramDetailErrorProps {
  error?: string;
}

const ProgramDetailError: React.FC<ProgramDetailErrorProps> = ({ error }) => {
  const { currentLanguage } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const t = TEXT[currentLanguage as keyof typeof TEXT];
  
  // 处理刷新页面
  const handleRefresh = () => {
    window.location.reload();
  };
  
  // 处理重新加载
  const handleTryAgain = () => {
    // 强制清除缓存重新加载页面
    window.location.href = `/programs/${id}?t=${new Date().getTime()}`;
  };
  
  return (
    <div className="container mx-auto py-20 text-center">
      <div className="flex flex-col items-center mb-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{t.title}</h1>
      </div>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{t.message}</p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8 max-w-lg mx-auto">
          <p className="text-red-700 text-sm font-medium mb-1">{t.errorDetails}</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {/* 诊断信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8 max-w-lg mx-auto text-left">
        <p className="text-blue-700 text-sm font-medium mb-1">{t.diagnosticInfo}</p>
        <ul className="text-blue-600 text-sm space-y-1">
          <li>ID: {id}</li>
          <li>URL: {window.location.href}</li>
          <li>Time: {new Date().toLocaleString()}</li>
        </ul>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link to="/programs">
          <Button variant="outline" className="px-6">{t.backButton}</Button>
        </Link>
        
        <Button onClick={handleRefresh} className="px-6 flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          {t.refreshButton}
        </Button>
        
        <Button onClick={handleTryAgain} variant="default" className="px-6">
          {t.tryAgain}
        </Button>
      </div>
    </div>
  );
};

export default ProgramDetailError;
