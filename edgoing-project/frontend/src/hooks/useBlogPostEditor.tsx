
import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { blogService } from '@/services/blog';
import { BlogPost, BlogPostFormData, BlogTag, BlogCategory, ImageData } from '@/types/blogTypes';
import { MediaImageData } from '@/services/blog/mediaService';
import { stringToImageData, imageDataToString } from '@/utils/blogUtils';

interface UseBlogPostEditorProps {
  postId?: string;
  initialFormData?: Partial<BlogPostFormData>;
}

// 创建默认表单数据
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
  summary_en: '',
  summary_zh: '',
  date: new Date().toISOString().split('T')[0],
  category_id: '',
  seo_title_en: '',
  seo_title_zh: '',
  seo_description_en: '',
  seo_description_zh: ''
};

export const useBlogPostEditor = ({ postId, initialFormData = {} }: UseBlogPostEditorProps = {}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'zh' | 'split'>('split');
  const [formData, setFormData] = useState<BlogPostFormData>({
    ...defaultFormData,
    ...initialFormData
  });
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [activeImageField, setActiveImageField] = useState('');

  // 加载文章数据
  const {
    data: postData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['blogPost', postId],
    queryFn: () => postId ? blogService.getBlogPostById(postId) : null,
    enabled: !!postId,
    onSuccess: (data) => {
      if (data) {
        // 将数据映射到表单
        setFormData({
          title_en: data.title_en || '',
          title_zh: data.title_zh || '',
          slug: data.slug || '',
          content_en: data.content_en || '',
          content_zh: data.content_zh || '',
          excerpt_en: data.excerpt_en || '',
          excerpt_zh: data.excerpt_zh || '',
          featured_image: typeof data.featured_image === 'string' 
            ? data.featured_image 
            : data.featured_image?.url || '',
          status: data.status || 'draft',
          published_at: data.published_at || null,
          author: data.author || '',
          category: typeof data.category === 'string' 
            ? data.category 
            : typeof data.category === 'object' && data.category !== null
              ? data.category.name_en || ''
              : '',
          tags: Array.isArray(data.tags) 
            ? data.tags.map(tag => typeof tag === 'string' ? tag : tag.name_en || '') 
            : [],
          summary_en: data.excerpt_en || '',
          summary_zh: data.excerpt_zh || '',
          date: data.date || new Date().toISOString().split('T')[0],
          category_id: typeof data.category === 'object' && data.category !== null 
            ? data.category.id.toString() 
            : typeof data.category === 'number'
              ? data.category.toString()
              : '',
          seo_title_en: data.seo_title_en || data.title_en || '',
          seo_title_zh: data.seo_title_zh || data.title_zh || '',
          seo_description_en: data.seo_description_en || data.excerpt_en || '',
          seo_description_zh: data.seo_description_zh || data.excerpt_zh || ''
        });
      }
    }
  });

  // 获取可用图片列表
  const { data: availableImages = [] } = useQuery({
    queryKey: ['blogImages'],
    queryFn: blogService.mediaService.getAvailableImages
  });

  // 处理图片库打开
  const openImageGallery = useCallback((fieldName: string) => {
    setActiveImageField(fieldName);
    setIsImageGalleryOpen(true);
  }, []);

  // 处理图片库关闭
  const closeImageGallery = useCallback(() => {
    setIsImageGalleryOpen(false);
  }, []);

  // 处理表单字段变更
  const handleInputChange = useCallback((field: keyof BlogPostFormData, value: string | string[] | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 处理标签切换
  const handleTagToggle = useCallback((tag: string) => {
    setFormData(prev => {
      const currentTags = [...prev.tags];
      const tagIndex = currentTags.indexOf(tag);
      
      if (tagIndex >= 0) {
        // 删除标签
        currentTags.splice(tagIndex, 1);
      } else {
        // 添加标签
        currentTags.push(tag);
      }
      
      return {
        ...prev,
        tags: currentTags
      };
    });
  }, []);

  // 处理图片选择
  const handleSelectImage = useCallback((image: ImageData) => {
    if (activeImageField === 'featured_image') {
      setFormData(prev => ({
        ...prev,
        featured_image: image.url
      }));
    } else if (activeImageField === 'content_en' || activeImageField === 'content_zh') {
      handleInsertImage(image.url, activeImageField);
    }
    closeImageGallery();
  }, [activeImageField, closeImageGallery]);

  // 处理图片上传
  const handleUploadImage = useCallback(async (file: File): Promise<MediaImageData> => {
    try {
      const uploadedImage = await blogService.mediaService.uploadBlogImage(file);
      toast({
        title: "上传成功",
        description: "图片已成功上传到媒体库"
      });
      return uploadedImage;
    } catch (error) {
      toast({
        title: "上传失败",
        description: "无法上传图片，请稍后再试",
        variant: "destructive"
      });
      throw error;
    }
  }, []);

  // 处理设置特色图片
  const handleSetFeaturedImage = useCallback((image: ImageData) => {
    setFormData(prev => ({
      ...prev,
      featured_image: image.url
    }));
    closeImageGallery();
  }, [closeImageGallery]);

  // 插入图片到内容编辑器
  const handleInsertImage = useCallback((url: string, field: string) => {
    // 这里只是保存图片URL，实际插入逻辑由编辑器组件处理
    console.log('插入图片URL:', url, '到字段:', field);
    // 实际编辑器的图片插入逻辑应该在编辑器组件中进行
  }, []);

  // 保存文章
  const saveMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      if (postId) {
        return blogService.updateBlogPost(postId, data);
      } else {
        return blogService.createBlogPost(data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: postId ? "更新成功" : "创建成功",
        description: postId ? "文章已成功更新" : "文章已成功创建"
      });
      navigate('/admin/blog');
    },
    onError: (error) => {
      toast({
        title: "保存失败",
        description: "无法保存文章，请稍后再试",
        variant: "destructive"
      });
      console.error('保存文章错误:', error);
    }
  });

  // 删除文章
  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "删除成功",
        description: "文章已成功删除"
      });
      navigate('/admin/blog');
    },
    onError: (error) => {
      toast({
        title: "删除失败",
        description: "无法删除文章，请稍后再试",
        variant: "destructive"
      });
      console.error('删除文章错误:', error);
    }
  });

  // 处理保存
  const handleSave = useCallback(() => {
    saveMutation.mutate(formData);
  }, [formData, saveMutation]);

  // 处理删除
  const handleDelete = useCallback(() => {
    if (!postId) return;
    
    if (window.confirm('确定要删除这篇文章吗？此操作无法撤销。')) {
      deleteMutation.mutate(postId);
    }
  }, [postId, deleteMutation]);

  // 将字符串转换为ImageData对象
  const mediaToImageData = useCallback((media: MediaImageData): ImageData => {
    return {
      id: media.id,
      url: media.url,
      alt: media.alt || '',
      width: media.width,
      height: media.height
    };
  }, []);
  
  return {
    activeTab,
    setActiveTab,
    formData,
    handleInputChange,
    isSubmitting: saveMutation.isPending,
    isLoading,
    isError,
    handleTagToggle,
    handleSave,
    handleDelete,
    previewLanguage,
    availableImages,
    handleSelectImage,
    handleUploadImage,
    handleSetFeaturedImage,
    handleInsertImage,
    isImageGalleryOpen,
    activeImageField,
    openImageGallery,
    closeImageGallery,
    stringToImageData,
    imageDataToString,
    mediaToImageData
  };
};

export default useBlogPostEditor;
