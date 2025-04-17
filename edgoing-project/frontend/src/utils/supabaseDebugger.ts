
import { supabase } from '@/integrations/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    // 测试简单查询
    const { data, error } = await supabase
      .from('programs')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
    
    console.log('Supabase connection test succeeded:', data);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Unexpected error during Supabase connection test:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
};

export const logSupabaseConfig = () => {
  // 安全地记录Supabase配置（不包含敏感信息）
  console.log('Supabase client initialized:', !!supabase);
  console.log('Supabase URL is configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL || !!process.env.VITE_SUPABASE_URL);
};

// 运行一个测试连接并记录结果
export const runConnectionTest = async () => {
  console.log('Testing Supabase connection...');
  const result = await testSupabaseConnection();
  console.log('Connection test result:', result);
  return result;
};
