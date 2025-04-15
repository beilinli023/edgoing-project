
import { supabase } from '@/integrations/supabase/client';
import { programApiService } from './api/programApiService';
import { toast } from 'sonner';

export interface GradeLevel {
  id: string;
  name_en: string;
  name_zh: string;
}

/**
 * 获取项目分类数据
 */
export const fetchProgramCategories = async () => {
  return programApiService.getCategories();
};

/**
 * 获取项目地区/国家数据
 */
export const fetchProgramCountries = async () => {
  return programApiService.getCountries();
};

/**
 * 获取年级级别数据
 */
export const fetchProgramGradeLevels = async (): Promise<GradeLevel[]> => {
  try {
    console.log('Fetching grade levels from Supabase');
    
    // 获取所有年级级别，按照order_index排序
    const { data, error } = await supabase
      .from('grade_levels')
      .select('id, name_en, name_zh')
      .order('order_index');
      
    console.log('Supabase grade levels response:', { data, error });
    
    if (error) {
      console.error('Error fetching grade levels:', error);
      toast.error('无法加载年级级别数据');
      return [];
    }
    
    // 如果没有数据，则返回空数组
    if (!data || data.length === 0) {
      console.log('No grade levels found in database');
      return [];
    }
    
    console.log('Successfully fetched grade levels:', data);
    return data;
  } catch (error) {
    console.error('Exception in fetchProgramGradeLevels:', error);
    toast.error('加载年级级别失败');
    return [];
  }
};

/**
 * 开启实时订阅年级级别数据变化
 */
export const subscribeToGradeLevels = (callback: (gradeLevels: GradeLevel[]) => void) => {
  console.log('Setting up realtime subscription for grade levels');
  
  // 创建实时订阅通道
  const channel = supabase
    .channel('grade-levels-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // 监听所有事件：INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'grade_levels'
      },
      (payload) => {
        console.log('Grade levels change detected:', payload);
        // 当数据变化时，重新获取最新数据
        fetchProgramGradeLevels().then(gradeLevels => {
          console.log('Fetched updated grade levels after change:', gradeLevels);
          callback(gradeLevels);
        });
      }
    )
    .subscribe((status) => {
      console.log('Grade levels subscription status:', status);
    });

  // 返回取消订阅的函数
  return () => {
    console.log('Cleaning up grade levels subscription');
    supabase.removeChannel(channel);
  };
};
