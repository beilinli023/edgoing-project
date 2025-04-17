
import { useState, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { ImageData, BlogPost, BlogPostFormData } from "@/types/blogTypes";
import { blogService } from "@/services/blog";
import { toast } from "@/components/ui/use-toast";

// Default form data structure
const defaultFormData: BlogPostFormData = {
  title_en: "",
  title_zh: "",
  content_en: "",
  content_zh: "",
  excerpt_en: "",
  excerpt_zh: "",
  slug: "",
  featured_image: "",
  status: "draft",
  published_at: new Date().toISOString(),
  category: "",
  tags: [],
  author: "",
  summary_en: "",
  summary_zh: "",
  date: new Date().toISOString(),
  category_id: "",
  seo_title_en: "",
  seo_title_zh: "",
  seo_description_en: "",
  seo_description_zh: ""
};

export const useBlogPostEditor = (postId?: string) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<BlogPostFormData>(defaultFormData);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string>("");
  
  // 获取文章数据
  const { isLoading } = useQuery({
    queryKey: ['blogPost', postId],
    queryFn: async () => {
      if (!postId) return null;
      const result = await blogService.postService.getBlogPostById(postId);
      
      // Move the state setting logic here instead of using onSuccess
      if (result) {
        setFormData({
          title_en: result.title_en || "",
          title_zh: result.title_zh || "",
          content_en: result.content_en || "",
          content_zh: result.content_zh || "",
          excerpt_en: result.excerpt_en || "",
          excerpt_zh: result.excerpt_zh || "",
          slug: result.slug || "",
          featured_image: typeof result.featured_image === 'string' 
            ? result.featured_image 
            : result.featured_image?.url || "",
          status: result.status || "draft",
          published_at: result.published_at || new Date().toISOString(),
          category: typeof result.category === 'object' 
            ? result.category.id.toString() 
            : result.category?.toString() || "",
          tags: Array.isArray(result.tags) 
            ? result.tags.map(tag => typeof tag === 'object' ? tag.id.toString() : tag.toString()) 
            : [],
          author: result.author || "",
          summary_en: "", // Add missing fields required by BlogPostFormData
          summary_zh: "",
          date: result.date || new Date().toISOString(),
          category_id: typeof result.category === 'object' 
            ? result.category.id.toString() 
            : result.category?.toString() || "",
          seo_title_en: "",
          seo_title_zh: "",
          seo_description_en: "",
          seo_description_zh: ""
        });
      }
      
      return result;
    },
    enabled: !!postId
  });

  // 创建或更新文章
  const mutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      if (postId) {
        return await blogService.postService.updateBlogPost(postId, data);
      } else {
        return await blogService.postService.createBlogPost(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: postId ? "文章已更新" : "文章已创建",
        description: "博客文章已成功保存",
      });
    },
    onError: (error) => {
      console.error("保存文章失败", error);
      toast({
        title: "保存失败",
        description: "无法保存博客文章，请稍后重试",
        variant: "destructive"
      });
    }
  });

  // 处理表单输入变化
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理内容编辑器变化
  const handleContentChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // 图片库相关处理
  const openImageGallery = (fieldName: string) => {
    setCurrentImageField(fieldName);
    setIsImageGalleryOpen(true);
  };

  const closeImageGallery = () => {
    setIsImageGalleryOpen(false);
  };

  const handleImageSelect = (image: ImageData) => {
    const imageUrl = typeof image === 'string' ? image : image.url;
    
    setFormData(prev => ({
      ...prev,
      [currentImageField]: imageUrl
    }));
    
    closeImageGallery();
  };

  return {
    formData,
    isLoading,
    isPending: mutation.isPending,
    isEditMode: !!postId,
    isImageGalleryOpen,
    currentImageField,
    handleInputChange,
    handleContentChange,
    handleSubmit,
    handleImageSelect,
    openImageGallery,
    closeImageGallery
  };
};
