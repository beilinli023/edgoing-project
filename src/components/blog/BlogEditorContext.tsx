
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BlogPostFormData } from '@/types/blogTypes';

interface BlogEditorContextType {
  formData: BlogPostFormData;
  setFormData: React.Dispatch<React.SetStateAction<BlogPostFormData>>;
  isImageGalleryOpen: boolean;
  openImageGallery: (field: string) => void;
  closeImageGallery: () => void;
  currentImageField: string;
  setCurrentImageField: React.Dispatch<React.SetStateAction<string>>;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

// 默认表单数据
const defaultFormData: BlogPostFormData = {
  title_en: '',
  title_zh: '',
  slug: '',
  content_en: '',
  content_zh: '',
  excerpt_en: '',
  excerpt_zh: '',
  featured_image: '',
  status: 'draft',
  published_at: null,
  author: '',
  category: '',
  tags: [],
  category_id: '',
  summary_en: '',
  summary_zh: '',
  date: new Date().toISOString(),
  seo_title_en: '',
  seo_title_zh: '',
  seo_description_en: '',
  seo_description_zh: ''
};

const BlogEditorContext = createContext<BlogEditorContextType | undefined>(undefined);

export const BlogEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<BlogPostFormData>(defaultFormData);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openImageGallery = (field: string) => {
    setCurrentImageField(field);
    setIsImageGalleryOpen(true);
  };

  const closeImageGallery = () => {
    setIsImageGalleryOpen(false);
  };

  return (
    <BlogEditorContext.Provider
      value={{
        formData,
        setFormData,
        isImageGalleryOpen,
        openImageGallery,
        closeImageGallery,
        currentImageField,
        setCurrentImageField,
        isDirty,
        setIsDirty,
        isSubmitting,
        setIsSubmitting
      }}
    >
      {children}
    </BlogEditorContext.Provider>
  );
};

export const useBlogEditor = (): BlogEditorContextType => {
  const context = useContext(BlogEditorContext);
  if (!context) {
    throw new Error('useBlogEditor must be used within a BlogEditorProvider');
  }
  return context;
};
