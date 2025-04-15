import { useState, useEffect } from 'react';
import { Program } from '@/types/programTypes';
import { useLanguage } from '@/context/LanguageContext';
import { fetchFrontendPrograms } from '@/services/frontendProgramService';

/**
 * 获取项目列表的自定义Hook
 * 从JSON文件中获取项目数据
 */
export function useProgramList() {
  const { currentLanguage } = useLanguage();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 使用服务获取项目列表
        console.log('开始获取项目列表...');
        const response = await fetchFrontendPrograms();
        console.log('获取到的项目列表数据:', response);
        
        // 确保程序列表存在
        if (!response || !response.programs) {
          throw new Error('无法获取项目列表数据');
        }
        
        console.log('项目数量:', response.programs.length);
        
        // 更详细地记录每个项目的信息
        console.log('项目列表详细信息:');
        response.programs.forEach(p => {
          console.log(`Program ID: ${p.id}, 标题: ${p.title_zh || p.title_en}, 状态: ${p.status || '未知'}`);
        });
        console.log('项目ID列表:', response.programs.map(p => p.id));
        
        // 检查是否存在空 ID 或重复 ID的项目
        const idMap = new Map();
        response.programs.forEach(program => {
          if (program.id) {
            idMap.set(program.id, program);
          }
        });
        
        console.log('加载到的所有项目 ID:', Array.from(idMap.keys()));
        
        setPrograms(response.programs);
      } catch (error: unknown) {
        console.error('Error fetching programs:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : '未知错误';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrograms();
  }, [currentLanguage]);
  
  return { programs, loading, error };
}
