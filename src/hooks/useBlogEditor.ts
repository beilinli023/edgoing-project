
import { useState } from 'react';
import { BlogPostFormData, ImageData } from '@/types/blogTypes';
import { MediaImageData, convertToBlogImageData } from '@/services/blog/mediaService';

export const useBlogEditor = (initialData?: Partial<BlogPostFormData>) => {
  const [formData, setFormData] = useState<BlogPostFormData>({
    title_en: initialData?.title_en || '',
    title_zh: initialData?.title_zh || '',
    content_en: initialData?.content_en || '',
    content_zh: initialData?.content_zh || '',
    excerpt_en: initialData?.excerpt_en || '',
    excerpt_zh: initialData?.excerpt_zh || '',
    slug: initialData?.slug || '',
    featured_image: initialData?.featured_image || '',
    status: initialData?.status || 'draft',
    published_at: initialData?.published_at || new Date().toISOString(),
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    author: initialData?.author || '',
    summary_en: initialData?.summary_en || '',
    summary_zh: initialData?.summary_zh || '',
    date: initialData?.date || new Date().toISOString(),
    category_id: initialData?.category_id || '',
    seo_title_en: initialData?.seo_title_en || '',
    seo_title_zh: initialData?.seo_title_zh || '',
    seo_description_en: initialData?.seo_description_en || '',
    seo_description_zh: initialData?.seo_description_zh || ''
  });

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentField, setCurrentField] = useState<string>('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openGallery = (field: string) => {
    setCurrentField(field);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const handleImageSelect = (image: ImageData) => {
    const imageUrl = typeof image === 'string' ? image : image.url;
    
    setFormData(prev => ({
      ...prev,
      [currentField]: imageUrl
    }));
    
    closeGallery();
  };

  // Handle media image selection
  const handleMediaImageSelect = (mediaImage: MediaImageData) => {
    const blogImage = convertToBlogImageData(mediaImage);
    handleImageSelect(blogImage);
  };

  return {
    formData,
    isGalleryOpen,
    currentField,
    handleInputChange,
    openGallery,
    closeGallery,
    handleImageSelect,
    handleMediaImageSelect
  };
};

export default useBlogEditor;
