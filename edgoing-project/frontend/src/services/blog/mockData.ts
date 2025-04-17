/**
 * u535au5ba2u6a21u62dfu6570u636e
 * u6ce8u610fuff1au8fd9u4e2au6587u4ef6u53eau5305u542bu540eu53f0u7f16u8f91u535au5ba2u65f6u9700u8981u7684u6700u5c0fu6a21u62dfu6570u636e
 * u4ec5u4e3au4e86u652fu6301BlogPostFormu7ec4u4ef6u7684u6b63u5e38u5de5u4f5c
 */
import { BlogCategory, BlogTag } from '@/types/blogTypes';

/**
 * u83b7u53d6u6a21u62dfu535au5ba2u5206u7c7b
 */
export const getMockCategories = async (): Promise<BlogCategory[]> => {
  return [
    { id: '1', name_en: 'News', name_zh: 'u65b0u95fb', slug: 'news' },
    { id: '2', name_en: 'Events', name_zh: 'u6d3bu52a8', slug: 'events' },
    { id: '3', name_en: 'Tutorials', name_zh: 'u6559u7a0b', slug: 'tutorials' },
    { id: '4', name_en: 'Case Studies', name_zh: 'u6848u4f8bu7814u7a76', slug: 'case-studies' }
  ];
};

/**
 * u83b7u53d6u6a21u62dfu535au5ba2u6807u7b7e
 */
export const getMockTags = async (): Promise<BlogTag[]> => {
  return [
    { id: '1', name_en: 'Technology', name_zh: 'u6280u672f', slug: 'technology' },
    { id: '2', name_en: 'Education', name_zh: 'u6559u80b2', slug: 'education' },
    { id: '3', name_en: 'Design', name_zh: 'u8bbeu8ba1', slug: 'design' },
    { id: '4', name_en: 'Marketing', name_zh: 'u5e02u573au8425u9500', slug: 'marketing' },
    { id: '5', name_en: 'Business', name_zh: 'u5546u4e1a', slug: 'business' }
  ];
};
