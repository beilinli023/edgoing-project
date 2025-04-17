import React from 'react';
import { useProgramList } from '@/hooks/program/useProgramList';
import { ProgramCard } from '@/components/ProgramCard';
import { useLanguage } from '@/context/LanguageContext';

const ProgramListPage: React.FC = () => {
  const { programs, loading, error } = useProgramList();
  const { currentLanguage } = useLanguage();
  const isEnglish = currentLanguage === 'en';

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{isEnglish ? 'Programs' : '项目列表'}</h1>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold mr-1">{isEnglish ? 'Error:' : '错误：'}</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {!loading && programs.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">{isEnglish ? 'No programs found' : '没有找到项目'}</p>
        </div>
      )}
      
      {!loading && programs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="h-full">
              <ProgramCard program={program} />
            </div>
          ))}
        </div>
      )}
      
      {!loading && programs.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">{isEnglish ? 'Debug Information' : '调试信息'}</h2>
          <p>Total Programs: {programs.length}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-500">Show Raw Data</summary>
            <pre className="mt-2 bg-gray-800 text-white p-4 rounded-md overflow-auto text-xs max-h-96">
              {JSON.stringify(programs, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ProgramListPage; 