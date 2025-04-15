
import { toast } from 'sonner';

export interface FeaturedProgramsContent {
  id?: string;
  subtitle_en: string;
  subtitle_zh: string;
  title_en: string;
  title_zh: string;
  link_text_en: string;
  link_text_zh: string;
  link_url: string;
}

export interface FeaturedProgram {
  id?: string;
  image: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  location_en: string;
  location_zh: string;
  duration: string;
  order_index: number;
  program_id?: string; // Added for compatibility
}

// Mock data
const mockFeaturedProgramsContent: FeaturedProgramsContent = {
  id: "1",
  subtitle_en: "Featured Educational Programs",
  subtitle_zh: "精选教育项目",
  title_en: "Explore Our Featured Programs",
  title_zh: "探索我们的精选项目",
  link_text_en: "View All Programs",
  link_text_zh: "查看所有项目",
  link_url: "/programs"
};

const mockFeaturedPrograms: FeaturedProgram[] = [
  {
    id: "1",
    image: "/placeholder.svg",
    title_en: "Academic Excellence Program",
    title_zh: "学术卓越项目",
    description_en: "Enhance your academic skills with renowned educators",
    description_zh: "与知名教育者一起提升您的学术技能",
    location_en: "United States",
    location_zh: "美国",
    duration: "2 weeks",
    order_index: 0,
    program_id: "prog-1"
  },
  {
    id: "2",
    image: "/placeholder.svg",
    title_en: "Cultural Exchange Program",
    title_zh: "文化交流项目",
    description_en: "Immerse yourself in diverse cultural experiences",
    description_zh: "沉浸在多元文化体验中",
    location_en: "Japan",
    location_zh: "日本",
    duration: "3 weeks",
    order_index: 1,
    program_id: "prog-2"
  },
  {
    id: "3",
    image: "/placeholder.svg",
    title_en: "Language Immersion Program",
    title_zh: "语言沉浸项目",
    description_en: "Master a new language through total immersion",
    description_zh: "通过完全沉浸掌握新语言",
    location_en: "United Kingdom",
    location_zh: "英国",
    duration: "4 weeks",
    order_index: 2,
    program_id: "prog-3"
  }
];

// Fetch featured programs content (intro text)
export const getFeaturedProgramsContent = async (): Promise<FeaturedProgramsContent | null> => {
  try {
    // Return mock data
    return Promise.resolve(mockFeaturedProgramsContent);
  } catch (error) {
    console.error('Error fetching featured programs content:', error);
    return null;
  }
};

// Fetch featured programs
export const getFeaturedPrograms = async (): Promise<FeaturedProgram[]> => {
  try {
    // Return mock data
    return Promise.resolve([...mockFeaturedPrograms]);
  } catch (error) {
    console.error('Error fetching featured programs:', error);
    return [];
  }
};

// Update featured programs content
export const updateFeaturedProgramsContent = async (content: FeaturedProgramsContent): Promise<boolean> => {
  try {
    // Mock update - just log the data
    console.log('Updated featured programs content:', content);
    toast.success('精选项目简介已更新');
    return true;
  } catch (error) {
    console.error('Error updating featured programs content:', error);
    toast.error('更新失败，请重试');
    return false;
  }
};

// Add a new featured program
export const addFeaturedProgram = async (program: Omit<FeaturedProgram, 'id'>): Promise<FeaturedProgram | null> => {
  try {
    // Mock adding a new program
    const newProgram = {
      ...program,
      id: Math.random().toString(36).substring(2, 11),
      program_id: `prog-${Math.random().toString(36).substring(2, 7)}`
    };
    console.log('Added new featured program:', newProgram);
    toast.success('精选项目已添加');
    return newProgram;
  } catch (error) {
    console.error('Error adding featured program:', error);
    toast.error('添加失败，请重试');
    return null;
  }
};

// Update a featured program
export const updateFeaturedProgram = async (program: FeaturedProgram): Promise<boolean> => {
  try {
    // Mock updating a program
    console.log('Updated featured program:', program);
    toast.success('精选项目已更新');
    return true;
  } catch (error) {
    console.error('Error updating featured program:', error);
    toast.error('更新失败，请重试');
    return false;
  }
};

// Remove a featured program
export const removeFeaturedProgram = async (id: string): Promise<boolean> => {
  try {
    // Mock removing a program
    console.log('Removed featured program with ID:', id);
    toast.success('精选项目已删除');
    return true;
  } catch (error) {
    console.error('Error removing featured program:', error);
    toast.error('删除失败，请重试');
    return false;
  }
};

// Update the order of multiple programs at once
export const updateProgramsOrder = async (programs: FeaturedProgram[]): Promise<boolean> => {
  try {
    // Mock updating program order
    console.log('Updated program order:', programs);
    toast.success('排序已更新');
    return true;
  } catch (error) {
    console.error('Error updating programs order:', error);
    toast.error('更新排序失败，请重试');
    return false;
  }
};
