
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProgramData, ProgramFormData } from '@/types/programTypes';

// 获取单个项目
export const getProjectById = async (id: string): Promise<ProgramData | null> => {
  try {
    // Mock implementation - return a sample program
    const mockProgram: ProgramData = {
      id: id,
      program_id: `program-${id}`,
      title_en: "Sample Program",
      title_zh: "示例项目",
      thumbnail: "/placeholder.svg",
      category_id: "1",
      summary_en: "Sample summary",
      summary_zh: "示例摘要",
      duration_en: "2 weeks",
      duration_zh: "2周",
      description_en: "Description in English",
      description_zh: "中文描述",
      learning_outcomes_en: "Learning outcomes",
      learning_outcomes_zh: "学习成果",
      requirements_en: "Requirements in English",
      requirements_zh: "中文要求",
      instructor_en: "John Doe",
      instructor_zh: "约翰·多伊",
      price_original: 1999,
      price_discounted: 1499,
      gallery: ["/placeholder.svg"],
      is_featured: true,
      is_popular: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_index: 1
    };
    
    console.log("Fetched project data:", mockProgram);
    return mockProgram;
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
};

// 创建新项目
export const createProject = async (formData: ProgramFormData): Promise<ProgramData | null> => {
  try {
    console.log('Creating new project with form data:', formData);
    
    // Mock implementation - create a new program with the form data
    const newProgram: ProgramData = {
      id: Math.random().toString(36).substring(2, 11),
      program_id: formData.id || Math.random().toString(36).substring(2, 11),
      title_en: formData.titleEn,
      title_zh: formData.title,
      thumbnail: formData.thumbnail,
      category_id: formData.category,
      summary_en: formData.location,
      summary_zh: formData.location,
      duration_en: formData.duration,
      duration_zh: formData.duration,
      description_en: formData.descriptionEn,
      description_zh: formData.description,
      learning_outcomes_en: formData.highlightsEn,
      learning_outcomes_zh: formData.highlights,
      requirements_en: formData.itineraryEn,
      requirements_zh: formData.itinerary,
      instructor_en: formData.featuresEn,
      instructor_zh: formData.features,
      price_original: formData.price ? Number(formData.price) : null,
      price_discounted: null,
      gallery: formData.images || [],
      is_featured: false,
      is_popular: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_index: 999
    };

    console.log('Project created successfully:', newProgram);
    return newProgram;
  } catch (error) {
    console.error('Failed to create project:', error);
    toast.error('项目创建失败，请重试');
    throw error;
  }
};

// 更新项目
export const updateProject = async (id: string, formData: ProgramFormData): Promise<ProgramData | null> => {
  try {
    console.log('Updating project:', id, formData);
    
    // Mock implementation - update an existing program
    const updatedProgram: ProgramData = {
      id: id,
      program_id: formData.id || id,
      title_en: formData.titleEn,
      title_zh: formData.title,
      thumbnail: formData.thumbnail,
      category_id: formData.category,
      summary_en: formData.location,
      summary_zh: formData.location,
      duration_en: formData.duration,
      duration_zh: formData.duration,
      description_en: formData.descriptionEn,
      description_zh: formData.description,
      learning_outcomes_en: formData.highlightsEn,
      learning_outcomes_zh: formData.highlights,
      requirements_en: formData.itineraryEn,
      requirements_zh: formData.itinerary,
      instructor_en: formData.featuresEn,
      instructor_zh: formData.features,
      price_original: formData.price ? Number(formData.price) : null,
      price_discounted: null,
      gallery: formData.images || [],
      is_featured: false,
      is_popular: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_index: 1
    };

    console.log('Project updated successfully:', updatedProgram);
    return updatedProgram;
  } catch (error) {
    console.error('Failed to update project:', error);
    toast.error('项目更新失败，请重试');
    throw error;
  }
};

// 删除项目
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    // Mock implementation
    console.log(`Deleting project with ID: ${id}`);
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    toast.error('项目删除失败，请重试');
    throw error;
  }
};

// 获取项目分类
export const getProjectCategories = async () => {
  try {
    // Mock implementation
    const mockCategories = [
      { id: "1", name_en: "Academic", name_zh: "学术", order_index: 0 },
      { id: "2", name_en: "Cultural", name_zh: "文化", order_index: 1 },
      { id: "3", name_en: "Language", name_zh: "语言", order_index: 2 },
    ];
    
    return mockCategories;
  } catch (error) {
    console.error('Failed to fetch project categories:', error);
    return [];
  }
};

// 获取项目标签
export const getProjectTags = async () => {
  try {
    // Mock implementation
    const mockTags = [
      { id: '1', name_en: 'Academic', name_zh: '学术' },
      { id: '2', name_en: 'Cultural', name_zh: '文化' },
      { id: '3', name_en: 'Language', name_zh: '语言' }
    ];
    
    return mockTags;
  } catch (error) {
    console.error('Failed to fetch project tags:', error);
    return [];
  }
};

export default {
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectCategories,
  getProjectTags
};
