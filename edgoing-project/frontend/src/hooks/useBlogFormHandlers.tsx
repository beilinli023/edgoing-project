
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { BlogPostFormData } from "@/types/blogTypes";
import { blogService } from "@/services/blog";

export const useBlogFormHandlers = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (
    formData: BlogPostFormData, 
    isEdit: boolean, 
    postId?: string
  ) => {
    setIsSubmitting(true);
    
    try {
      if (isEdit && postId) {
        // 更新现有博文
        await blogService.postService.updateBlogPost(postId, formData);
        toast({
          title: "更新成功",
          description: "博文已成功更新",
        });
      } else {
        // 创建新博文
        await blogService.postService.createBlogPost(formData);
        toast({
          title: "创建成功",
          description: "新博文已成功创建",
        });
      }
      
      // 操作完成后返回列表页
      navigate("/admin/blog/posts");
    } catch (error) {
      console.error("Error submitting blog post:", error);
      toast({
        title: "提交失败",
        description: "无法保存博文，请稍后再试",
        variant: "destructive"
      });
      throw error; // 重新抛出错误以便调用者处理
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    handleSubmit,
    isSubmitting
  };
};
