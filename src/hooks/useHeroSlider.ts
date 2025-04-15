
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface SlideItem {
  id: number;
  image: string;
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  button_text_en: string;
  button_text_zh: string;
  button_link: string;
  order: number;
}

export interface NewSlideItem {
  image: string;
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  button_text_en: string;
  button_text_zh: string;
  button_link: string;
}

export const useHeroSlider = () => {
  const [slides, setSlides] = useState<SlideItem[]>([
    {
      id: 1,
      image: "/placeholder.svg",
      title_en: "Discover Your Educational Journey",
      title_zh: "探索您的教育之旅",
      subtitle_en: "International academic programs for students of all ages",
      subtitle_zh: "适合各年龄段学生的国际学术项目",
      button_text_en: "Educational Travel Programs",
      button_text_zh: "游学项目",
      button_link: "/programs",
      order: 1
    },
    {
      id: 2,
      image: "/placeholder.svg",
      title_en: "Experience Global Education",
      title_zh: "体验全球教育",
      subtitle_en: "Cultural exchange programs worldwide",
      subtitle_zh: "全球文化交流项目",
      button_text_en: "Learn More",
      button_text_zh: "了解更多",
      button_link: "/about",
      order: 2
    },
  ]);

  const [newSlide, setNewSlide] = useState<NewSlideItem>({
    image: "/placeholder.svg",
    title_en: "",
    title_zh: "",
    subtitle_en: "",
    subtitle_zh: "",
    button_text_en: "",
    button_text_zh: "",
    button_link: "",
  });

  const addSlide = async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        // 检查是否达到最大数量
        if (slides.length >= 5) {
          toast({
            title: "已达上限",
            description: "最多只能添加5张轮播图片",
            variant: "destructive",
          });
          reject(new Error("Maximum slides reached"));
          return;
        }

        // 验证必填字段
        if (!newSlide.title_en || !newSlide.title_zh) {
          toast({
            title: "表单验证失败",
            description: "请至少填写英文和中文标题",
            variant: "destructive",
          });
          reject(new Error("Validation failed"));
          return;
        }

        // 模拟API调用延迟
        setTimeout(() => {
          const newId = slides.length > 0 ? Math.max(...slides.map(slide => slide.id)) + 1 : 1;
          setSlides([
            ...slides,
            {
              id: newId,
              image: newSlide.image,
              title_en: newSlide.title_en,
              title_zh: newSlide.title_zh,
              subtitle_en: newSlide.subtitle_en,
              subtitle_zh: newSlide.subtitle_zh,
              button_text_en: newSlide.button_text_en || "Learn More",
              button_text_zh: newSlide.button_text_zh || "了解更多",
              button_link: newSlide.button_link || "/programs",
              order: slides.length + 1,
            },
          ]);

          // 重置表单
          setNewSlide({
            image: "/placeholder.svg",
            title_en: "",
            title_zh: "",
            subtitle_en: "",
            subtitle_zh: "",
            button_text_en: "",
            button_text_zh: "",
            button_link: "",
          });

          resolve();
        }, 800); // 模拟网络延迟
      } catch (error) {
        reject(error);
      }
    });
  };

  const removeSlide = (id: number) => {
    const updatedSlides = slides.filter(slide => slide.id !== id);

    // 更新排序
    updatedSlides.forEach((slide, index) => {
      slide.order = index + 1;
    });

    setSlides(updatedSlides);
  };

  const moveSlide = (id: number, direction: 'up' | 'down') => {
    const index = slides.findIndex(slide => slide.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // 交换位置
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

    // 更新排序
    newSlides.forEach((slide, idx) => {
      slide.order = idx + 1;
    });

    setSlides(newSlides);
  };

  return {
    slides,
    newSlide,
    setNewSlide,
    addSlide,
    removeSlide,
    moveSlide
  };
};
