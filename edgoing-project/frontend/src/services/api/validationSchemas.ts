
import { z } from 'zod';
import { Program, ProgramTag } from '@/types/programTypes';

// 基础API响应模式
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
    errors: z.record(z.array(z.string())).optional()
  });
};

// 分页响应模式
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    totalPages: z.number().or(z.number().transform(String)).optional(),
    per_page: z.number().optional()
  });
};

// 项目标签模式
export const programTagSchema = z.object({
  name_en: z.string(),
  name_zh: z.string()
});

// 项目模式
export const programSchema = z.object({
  id: z.number(),
  title_en: z.string(),
  title_zh: z.string(),
  program_id: z.string(),
  image: z.string(),
  location_en: z.string(),
  location_zh: z.string(),
  duration: z.string(),
  country: z.string(),
  tags: z.array(programTagSchema),
  grade_levels: z.array(z.string()),
  description_en: z.string().optional(),
  description_zh: z.string().optional(),
  highlights_en: z.string().optional(),
  highlights_zh: z.string().optional(),
  itinerary_en: z.string().optional(),
  itinerary_zh: z.string().optional(),
  features_en: z.string().optional(),
  features_zh: z.string().optional(),
  information_en: z.string().optional(),
  information_zh: z.string().optional(),
  price: z.string().optional()
});

// 项目过滤选项模式
export const filterOptionSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_zh: z.string()
});

// 过滤器响应模式
export const filtersResponseSchema = z.object({
  categories: z.array(filterOptionSchema),
  regions: z.array(filterOptionSchema),
  countries: z.array(filterOptionSchema),
  gradeLevels: z.array(filterOptionSchema)
});

// 表单提交模式
export const planningFormSchema = z.object({
  role: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  schoolName: z.string(),
  gradeLevel: z.string(),
  province: z.string(),
  city: z.string(),
  programTypes: z.array(z.string()),
  destinations: z.array(z.string()),
  interests: z.array(z.string()),
  questions: z.string(),
  agreeToReceiveInfo: z.boolean()
});

// 创建并导出更多特定的验证模式...
