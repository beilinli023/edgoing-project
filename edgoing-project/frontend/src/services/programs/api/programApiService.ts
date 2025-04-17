
import { toast } from 'sonner';

/**
 * Base API service for program-related Supabase queries
 */
export const programApiService = {
  /**
   * 执行基础程序查询，添加通用选择和排序
   */
  baseQuery() {
    // Return mock data instead of using Supabase query
    return {
      select: () => {
        return {
          order: () => {
            return {
              data: [],
              error: null
            };
          }
        };
      }
    };
  },

  /**
   * 获取项目分类数据
   */
  async getCategories() {
    try {
      // Mock implementation
      const mockCategories = [
        { id: "1", name_en: "Academic", name_zh: "学术", order_index: 0 },
        { id: "2", name_en: "Cultural", name_zh: "文化", order_index: 1 },
        { id: "3", name_en: "Language", name_zh: "语言", order_index: 2 },
      ];
      
      return mockCategories;
    } catch (error) {
      console.error('Error fetching program categories:', error);
      return [];
    }
  },

  /**
   * 获取项目地区/国家数据
   */
  async getCountries() {
    try {
      // Mock implementation
      const mockCountries = [
        { id: "us", name_en: "United States", name_zh: "美国" },
        { id: "uk", name_en: "United Kingdom", name_zh: "英国" },
        { id: "jp", name_en: "Japan", name_zh: "日本" },
      ];
      
      return mockCountries;
    } catch (error) {
      console.error('Error fetching program countries:', error);
      return [];
    }
  },

  /**
   * 更新项目排序
   */
  async updateOrder(programOrders: {id: string, order_index: number, program_id: string, title_en: string, title_zh: string}[]) {
    try {
      // Mock implementation - just log the update and return success
      console.log('Updating program order:', programOrders);
      return true;
    } catch (error) {
      console.error('Error updating program order:', error);
      return false;
    }
  }
};
