
import React, { useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { validateImage, uploadImage } from "@/utils/imageUpload";

export interface TaglineContent {
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  background_image: string;
}

export const useTaglineSection = () => {
  const [taglineContent, setTaglineContent] = useState<TaglineContent>({
    title_en: "Explore. Learn. Grow.",
    title_zh: "探索. 学习. 成长.",
    description_en: "At YouNiKco, we believe in providing transformative educational experiences that broaden horizons and create lifelong learners.",
    description_zh: "在YouNiKco，我们致力于提供拓展视野、培养终身学习者的变革性教育体验。",
    background_image: "/placeholder.svg"
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    console.log("保存Tagline内容:", taglineContent);
    toast({
      title: "保存成功",
      description: "Tagline内容已成功保存",
    });
    // 在这里实现保存到API的逻辑
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateImage(file);

    if (!validation.valid) {
      toast({
        title: "上传失败",
        description: validation.error,
        variant: "destructive",
      });
      // 重置文件输入框
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setTaglineContent({
        ...taglineContent,
        background_image: imageUrl
      });
      
      toast({
        title: "上传成功",
        description: "背景图片已成功上传",
      });
    } catch (error) {
      toast({
        title: "上传失败",
        description: "上传图片时发生错误，请重试",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // 重置文件输入框
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return {
    taglineContent,
    setTaglineContent,
    uploading,
    fileInputRef,
    handleSave,
    handleFileSelect
  };
};
