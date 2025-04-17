
import { useState } from "react";
import { toast } from "sonner";

export interface NewsletterContent {
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  button_text_en: string;
  button_text_zh: string;
  placeholder_en: string;
  placeholder_zh: string;
}

export const useNewsletterContent = () => {
  const [newsletterContent, setNewsletterContent] = useState<NewsletterContent>({
    title_en: 'Subscribe to Our Newsletter',
    title_zh: '订阅我们的最新消息',
    description_en: 'Subscribe to our newsletter to stay updated with the latest programs, travel opportunities, and educational insights.',
    description_zh: '订阅我们的电子邮件，及时了解最新的项目、旅行机会和教育资讯。',
    button_text_en: 'Subscribe',
    button_text_zh: '订阅',
    placeholder_en: 'Enter your email',
    placeholder_zh: '输入您的电子邮箱'
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof NewsletterContent, value: string) => {
    setNewsletterContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 模拟API保存操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Newsletter section content saved successfully");
    } catch (error) {
      console.error("Error saving newsletter content:", error);
      toast.error("Failed to save newsletter content");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    newsletterContent,
    isSaving,
    handleChange,
    handleSave
  };
};
