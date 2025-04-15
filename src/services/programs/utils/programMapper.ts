
import { Program, ProgramTag } from '@/types/programTypes';

/**
 * 映射工具：将数据库记录转换为领域模型
 */
export const programMapper = {
  /**
   * 将Supabase返回的原始数据转换为Program领域模型
   */
  toProgram(item: any): Program {
    // Handle tags - this is a safe approach that checks for the existence
    // of program_tags property before attempting to filter/map
    let tags: ProgramTag[] = [];
    
    // Check if item has program_tags property and it's an array
    if (item.program_tags && Array.isArray(item.program_tags)) {
      tags = item.program_tags
        .filter((pt: any) => pt && pt.program_tags)
        .map((pt: any) => {
          if (typeof pt.program_tags === 'object') {
            return pt.program_tags as ProgramTag;
          }
          return null;
        })
        .filter(Boolean);
    } 
    // Handle case where program_tags is a single object
    else if (item.program_tags && typeof item.program_tags === 'object' && !Array.isArray(item.program_tags)) {
      if (item.program_tags.name_en || item.program_tags.name_zh) {
        tags = [item.program_tags as ProgramTag];
      }
    }
    
    // If there are no tags from the database, use an empty array
    if (!tags || tags.length === 0) {
      tags = [];
    }
    
    return {
      id: item.id,
      program_id: item.program_id || "",
      title_en: item.title_en || "",
      title_zh: item.title_zh || "",
      image: item.thumbnail || "/placeholder.svg",
      location_en: item.summary_en || "",
      location_zh: item.summary_zh || "",
      duration: item.duration_en || item.duration_zh || "",
      country: item.summary_en || "",
      tags: tags,
      grade_levels: ["High School", "University"], // 默认值
      price: item.price_original ? `$${item.price_original}` : ""
    };
  }
};
