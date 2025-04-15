
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPostFormData, BlogCategory, BlogTag } from "@/types/blogTypes";
import { blogService } from "@/services/blog";
import { toast } from "@/components/ui/use-toast";

export const useBlogPostData = (postId: string | null) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<BlogPostFormData>({
    title_en: "",
    title_zh: "",
    slug: "",
    content_en: "",
    content_zh: "",
    excerpt_en: "",
    excerpt_zh: "",
    featured_image: "",
    status: "draft",
    published_at: null,
    author: "",
    category: "",
    tags: [],
    summary_en: "",
    summary_zh: "",
    date: "",
    category_id: ""
  });
  
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  
  // Fetch blog categories
  const { isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: () => blogService.getAllCategories(),
    meta: {
      onSuccess: (data: BlogCategory[]) => {
        setCategories(data);
      }
    }
  });
  
  // Fetch blog tags
  const { isLoading: isTagsLoading } = useQuery({
    queryKey: ['blogTags'],
    queryFn: () => blogService.getAllTags(),
    meta: {
      onSuccess: (data: BlogTag[]) => {
        setTags(data);
      }
    }
  });
  
  // Fetch existing post if editing
  const { isLoading: isPostLoading } = useQuery({
    queryKey: ['blogPost', postId],
    queryFn: () => blogService.getBlogPostById(postId || ""),
    enabled: !!postId,
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          // Convert tag objects to tag IDs if needed
          const tagIds = Array.isArray(data.tags) 
            ? data.tags.map((tag: any) => {
                if (typeof tag === 'string') return tag;
                if (typeof tag === 'object' && tag !== null) return tag.id || '';
                return '';
              })
            : [];
            
          setFormData({
            ...data,
            tags: tagIds,
            // Add any missing fields with defaults
            summary_en: data.summary_en || "",
            summary_zh: data.summary_zh || "",
            date: data.date || new Date().toISOString(),
            category_id: data.category_id || data.category || ""
          });
        }
      }
    }
  });
  
  // Create new post
  const createMutation = useMutation({
    mutationFn: (formData: BlogPostFormData) => blogService.createBlogPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: "文章已创建",
        description: "博客文章已成功创建。",
      });
      navigate("/admin/blog");
    },
    onError: (error) => {
      toast({
        title: "创建失败",
        description: "无法创建博客文章。请稍后再试。",
        variant: "destructive",
      });
      console.error("Failed to create blog post:", error);
    }
  });
  
  // Update existing post
  const updateMutation = useMutation({
    mutationFn: (formData: BlogPostFormData) => 
      blogService.updateBlogPost(postId || "", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', postId] });
      toast({
        title: "文章已更新",
        description: "博客文章已成功更新。",
      });
      navigate("/admin/blog");
    },
    onError: (error) => {
      toast({
        title: "更新失败",
        description: "无法更新博客文章。请稍后再试。",
        variant: "destructive",
      });
      console.error("Failed to update blog post:", error);
    }
  });
  
  const isLoading = isCategoriesLoading || isTagsLoading || (!!postId && isPostLoading);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  
  const handleSave = (status: 'draft' | 'published' = 'draft') => {
    const updatedFormData = {
      ...formData,
      status,
      published_at: status === 'published' 
        ? new Date().toISOString() 
        : formData.published_at,
    };
    
    if (postId) {
      updateMutation.mutate(updatedFormData);
    } else {
      createMutation.mutate(updatedFormData);
    }
  };
  
  const handleDelete = async () => {
    if (!postId) return;
    
    if (window.confirm("确定要删除这篇文章吗？")) {
      try {
        await blogService.deleteBlogPost(postId);
        queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
        toast({
          title: "文章已删除",
          description: "博客文章已成功删除。",
        });
        navigate("/admin/blog");
      } catch (error) {
        toast({
          title: "删除失败",
          description: "无法删除博客文章。请稍后再试。",
          variant: "destructive",
        });
        console.error("Failed to delete blog post:", error);
      }
    }
  };
  
  return {
    formData,
    setFormData,
    categories,
    tags,
    isLoading,
    isSubmitting,
    handleSave,
    handleDelete
  };
};
