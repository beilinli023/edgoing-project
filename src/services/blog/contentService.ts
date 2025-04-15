/**
 * u535au5ba2u5185u5bb9u670du52a1 - u7b80u5316u7248
 * u6ce8u610fuff1au8fd9u4e2au6587u4ef6u53eau5305u542bu540eu53f0u7ba1u7406u535au5ba2u65f6u9700u8981u7684u6700u5c0fu529fu80fd
 */
import { BlogContent } from '@/types/blogTypes';
import localBlogService from './localBlogService';

/**
 * u83b7u53d6u535au5ba2u5185u5bb9
 */
export const getBlogContent = async (locale: string = 'en'): Promise<BlogContent | null> => {
  return localBlogService.getLocalBlogPageSettings();
};
