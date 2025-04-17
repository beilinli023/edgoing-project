/**
 * u535au5ba2u5206u7c7bu548cu6807u7b7eu670du52a1 - u7b80u5316u7248
 * u6ce8u610fuff1au8fd9u4e2au6587u4ef6u53eau5305u542bu540eu53f0u7ba1u7406u535au5ba2u65f6u9700u8981u7684u6700u5c0fu529fu80fd
 */
import { BlogCategory, BlogTag } from '@/types/blogTypes';
import { getMockCategories, getMockTags } from './mockData';

/**
 * u83b7u53d6u535au5ba2u5206u7c7b
 */
export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  return getMockCategories();
};

/**
 * u83b7u53d6u535au5ba2u6807u7b7e
 */
export const getBlogTags = async (): Promise<BlogTag[]> => {
  return getMockTags();
};
