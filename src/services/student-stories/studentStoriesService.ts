
import { toast } from 'sonner';

export interface StudentStory {
  id: string;
  image: string;
  name_en: string;
  name_zh: string;
  background_en: string;
  background_zh: string;
  testimonial_en: string;
  testimonial_zh: string;
  rating: number;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

// Mock data
const mockStudentStories: StudentStory[] = [
  {
    id: "1",
    image: "/placeholder.svg",
    name_en: "John Smith",
    name_zh: "约翰·史密斯",
    background_en: "High School Student, USA",
    background_zh: "美国高中学生",
    testimonial_en: "This program changed my perspective on global education.",
    testimonial_zh: "这个项目改变了我对全球教育的看法。",
    rating: 5,
    order_index: 0,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    image: "/placeholder.svg",
    name_en: "Emma Johnson",
    name_zh: "艾玛·约翰逊",
    background_en: "Middle School Student, Canada",
    background_zh: "加拿大初中学生",
    testimonial_en: "I learned so much about different cultures and made lasting friendships.",
    testimonial_zh: "我学到了很多关于不同文化的知识，并建立了持久的友谊。",
    rating: 4,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    image: "/placeholder.svg",
    name_en: "Michael Chen",
    name_zh: "陈明",
    background_en: "Elementary School Student, China",
    background_zh: "中国小学生",
    testimonial_en: "The program was both educational and fun. I would definitely recommend it!",
    testimonial_zh: "这个项目既有教育意义又很有趣。我绝对会推荐它！",
    rating: 5,
    order_index: 2,
    created_at: new Date().toISOString()
  }
];

// Export functions to match the ones being imported in useStudentStories.ts

// Fetch all student stories (renamed from fetchStudentStories to getStudentStories)
export const getStudentStories = async (): Promise<StudentStory[]> => {
  try {
    // Return mock data
    return Promise.resolve([...mockStudentStories]);
  } catch (error) {
    console.error('Error fetching student stories:', error);
    return [];
  }
};

// Fetch a single student story by ID
export const fetchStudentStoryById = async (id: string): Promise<StudentStory | null> => {
  try {
    const story = mockStudentStories.find(s => s.id === id);
    return story || null;
  } catch (error) {
    console.error('Error fetching student story:', error);
    return null;
  }
};

// Create a new student story (renamed from createStudentStory to addStudentStory)
export const addStudentStory = async (story: Omit<StudentStory, 'id' | 'created_at'>): Promise<StudentStory> => {
  try {
    const newStory: StudentStory = {
      ...story,
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString()
    };
    
    console.log('Created new student story:', newStory);
    toast.success('学生故事已添加');
    return newStory;
  } catch (error) {
    console.error('Error creating student story:', error);
    toast.error('添加失败，请重试');
    throw error;
  }
};

// Update an existing student story
export const updateStudentStory = async (id: string, story: Partial<StudentStory>): Promise<StudentStory> => {
  try {
    const existingStory = mockStudentStories.find(s => s.id === id);
    if (!existingStory) {
      throw new Error('Student story not found');
    }
    
    const updatedStory = {
      ...existingStory,
      ...story,
      updated_at: new Date().toISOString()
    };
    
    console.log('Updated student story:', updatedStory);
    toast.success('学生故事已更新');
    return updatedStory;
  } catch (error) {
    console.error('Error updating student story:', error);
    toast.error('更新失败，请重试');
    throw error;
  }
};

// Delete a student story (renamed from deleteStudentStory to removeStudentStory)
export const removeStudentStory = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleted student story with ID:', id);
    toast.success('学生故事已删除');
    return true;
  } catch (error) {
    console.error('Error deleting student story:', error);
    toast.error('删除失败，请重试');
    throw error;
  }
};

// Update the order of student stories
export const updateStoriesOrder = async (stories: Pick<StudentStory, 'id' | 'order_index'>[]): Promise<boolean> => {
  try {
    console.log('Updated student stories order:', stories);
    toast.success('排序已更新');
    return true;
  } catch (error) {
    console.error('Error updating student stories order:', error);
    toast.error('更新排序失败，请重试');
    throw error;
  }
};

