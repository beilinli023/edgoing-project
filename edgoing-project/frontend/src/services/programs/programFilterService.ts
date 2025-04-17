import { Program, ProgramFilterParams } from '@/types/programTypes';
import { supabase } from '@/integrations/supabase/client';
import { getLocalProgramData } from '../mockData/programs/mockPrograms';
import { toast } from 'sonner';
import { loadProgramsFromFiles } from './programFileService';

/**
 * 获取和过滤项目数据
 */
export const fetchAndFilterPrograms = async (
  filters: ProgramFilterParams
): Promise<{ filteredPrograms: Program[]; totalCount: number }> => {
  try {
    console.log('开始从本地文件加载项目数据...');
    
    // 直接从文件系统加载数据，而不是尝试API
    let programs: Program[] = [];
    
    try {
      // 首先尝试使用文件服务加载
      programs = await loadProgramsFromFiles();
    } catch (fileError) {
      console.error('使用programFileService加载失败，尝试备用方法:', fileError);
      
      // 备用方法：使用getLocalProgramData
      const localData = await getLocalProgramData();
      programs = localData as Program[];
    }
    
    if (!programs || programs.length === 0) {
      throw new Error('未能加载任何程序数据');
    }
    
    console.log(`成功加载 ${programs.length} 个项目`);

    // 应用过滤条件
    let filteredPrograms = [...programs];
    
    // 按分类过滤
    if (filters.category && filters.category.length > 0) {
      filteredPrograms = filteredPrograms.filter(program => {
        const programTypes = program.program_type_zh || [];
        return programTypes.some(type => type.includes(filters.category[0]));
      });
    }
    
    // 按国家/地区过滤
    if (filters.country && filters.country.length > 0) {
      filteredPrograms = filteredPrograms.filter(program => 
        program.country_zh === filters.country[0] || program.country_en === filters.country[0]
      );
    }
    
    // 按年级过滤
    if (filters.gradeLevel && filters.gradeLevel.length > 0) {
      filteredPrograms = filteredPrograms.filter(program => 
        program.grade_level_zh === filters.gradeLevel[0] || program.grade_level_en === filters.gradeLevel[0]
      );
    }
    
    // 分页处理
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedPrograms = filteredPrograms.slice(startIndex, startIndex + limit);
    
    console.log(`过滤后共 ${filteredPrograms.length} 个项目，当前页显示 ${paginatedPrograms.length} 个`);
    
    return {
      filteredPrograms: paginatedPrograms,
      totalCount: filteredPrograms.length
    };
  } catch (error) {
    console.error('过滤项目数据失败:', error);
    toast.error('获取项目数据失败');
    
    // 失败时返回空数据
    return {
      filteredPrograms: [],
      totalCount: 0
    };
  }
};
