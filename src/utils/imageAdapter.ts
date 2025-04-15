
import { ImageData as BlogImageData } from "@/types/blogTypes";
import { ImageData as MockImageData } from "@/components/blog/mockData";

/**
 * 将BlogImageData转换为MockImageData
 */
export const convertToMockImageData = (blogImage: BlogImageData): MockImageData => {
  return {
    id: typeof blogImage.id === 'string' ? parseInt(blogImage.id) : blogImage.id,
    url: blogImage.url,
    alt: blogImage.alt,
    width: blogImage.width,
    height: blogImage.height,
    created_at: blogImage.created_at
  };
};

/**
 * 将MockImageData转换为BlogImageData
 */
export const convertToBlogImageData = (mockImage: MockImageData): BlogImageData => {
  return {
    id: mockImage.id,
    url: mockImage.url,
    alt: mockImage.alt,
    width: mockImage.width,
    height: mockImage.height,
    created_at: mockImage.created_at
  };
};

/**
 * 将图片URL转换为MockImageData
 */
export const imageUrlToMockImageData = (url: string): MockImageData => {
  return {
    id: Math.floor(Math.random() * 10000),
    url: url,
    alt: "Image from URL",
    width: 800,
    height: 600
  };
};

/**
 * 将图片URL转换为BlogImageData
 */
export const imageUrlToBlogImageData = (url: string): BlogImageData => {
  return {
    id: Math.floor(Math.random() * 10000),
    url: url,
    alt: "Image from URL",
    width: 800,
    height: 600
  };
};
