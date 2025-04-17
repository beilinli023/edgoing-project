/**
 * u535au5ba2u5a92u4f53u670du52a1 - u7b80u5316u7248
 * u6ce8u610fuff1au8fd9u4e2au6587u4ef6u53eau5305u542bu540eu53f0u7ba1u7406u535au5ba2u65f6u9700u8981u7684u6700u5c0fu529fu80fd
 */
import { ImageListItem } from '@/types/mediaTypes';

/**
 * u83b7u53d6u53efu7528u7684u56feu7247u5217u8868
 */
export const getAvailableImages = async (): Promise<ImageListItem[]> => {
  return [
    { id: '1', url: '/placeholder.svg', alt: 'Placeholder 1', name: 'placeholder1.svg' },
    { id: '2', url: '/placeholder.svg', alt: 'Placeholder 2', name: 'placeholder2.svg' },
    { id: '3', url: '/placeholder.svg', alt: 'Placeholder 3', name: 'placeholder3.svg' }
  ];
};

/**
 * u83b7u53d6u56feu7247u5217u8868
 */
export const getImageList = async (): Promise<ImageListItem[]> => {
  return getAvailableImages();
};

/**
 * u4e0au4f20u535au5ba2u56feu7247
 */
export const uploadBlogImage = async (file: File): Promise<{url: string} | null> => {
  console.log('u6a21u62dfu4e0au4f20u535au5ba2u56feu7247uff1a', file.name);
  return { url: '/placeholder.svg' };
};
