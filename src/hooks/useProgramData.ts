import { useState, useEffect } from 'react';
import { Program } from '@/types/programTypes';
import { fetchAndFilterPrograms } from '@/services/programs';
import { toast } from 'sonner';
import { ConnectionStatus } from './useSupabaseConnection';
import { FilterState } from './useProgramFilters';
import { loadFilteredPrograms } from '@/services/programs/programFileService';

export const useProgramData = (
  selectedFilters: FilterState,
  currentPage: number,
  itemsPerPage: number, 
  connectionStatus: ConnectionStatus
) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadPrograms = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Loading programs with filters:', selectedFilters);
        
        // 当Supabase连接成功时，尝试从API获取数据
        if (connectionStatus === 'success') {
          try {
            const { filteredPrograms, totalCount } = await fetchAndFilterPrograms({
              category: selectedFilters.category.length > 0 ? selectedFilters.category[0] : '',
              country: selectedFilters.country.length > 0 ? selectedFilters.country[0] : '',
              gradeLevel: selectedFilters.gradeLevel.length > 0 ? selectedFilters.gradeLevel[0] : '',
              page: currentPage,
              limit: itemsPerPage
            });
            
            console.log('Received programs from API:', filteredPrograms);
            
            if (!Array.isArray(filteredPrograms)) {
              throw new Error('Invalid data format received from API');
            }
            
            setPrograms(filteredPrograms);
            setTotalCount(totalCount);
            return;
          } catch (apiError) {
            console.error('Error loading programs from API:', apiError);
            // API请求失败，继续尝试本地数据
          }
        }
        
        // 当Supabase连接失败或API请求失败时，从本地文件加载数据
        console.log('Loading programs from local files');
        const result = await loadFilteredPrograms({
          category: selectedFilters.category.length > 0 ? selectedFilters.category[0] : '',
          country: selectedFilters.country.length > 0 ? selectedFilters.country[0] : '',
          gradeLevel: selectedFilters.gradeLevel.length > 0 ? selectedFilters.gradeLevel[0] : '',
          page: currentPage,
          limit: itemsPerPage
        });
        
        console.log('Received programs from local files:', result.data);
        
        setPrograms(result.data);
        setTotalCount(result.total);
        
        if (connectionStatus !== 'success') {
          toast.info('使用本地项目数据（数据库连接不可用）');
        }
        
      } catch (error) {
        console.error('Error loading programs:', error);
        setError('Failed to load programs. Please try again later.');
        toast.error('加载项目失败，请稍后再试');
        setPrograms([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrograms();
  }, [selectedFilters, currentPage, itemsPerPage, connectionStatus]);

  return {
    programs,
    totalCount,
    isLoading,
    error
  };
};
