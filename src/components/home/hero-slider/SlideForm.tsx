
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewSlideItem } from "@/hooks/useHeroSlider";
import ImageUploader from "@/components/common/ImageUploader";

interface SlideFormProps {
  newSlide: NewSlideItem;
  setNewSlide: (slide: NewSlideItem) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const SlideForm: React.FC<SlideFormProps> = ({ 
  newSlide, 
  setNewSlide, 
  onSubmit,
  isSubmitting = false
}) => {
  const handleImageUpload = (imageUrl: string) => {
    setNewSlide({ ...newSlide, image: imageUrl });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-slate-50">
      <div className="flex flex-col items-center">
        <ImageUploader
          currentImage={newSlide.image}
          onImageUpload={handleImageUpload}
          previewSize="lg"
          buttonText="上传轮播图片"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-2">
          建议图片尺寸：1920x600像素，格式：JPG、PNG、WebP
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
            <Input
              value={newSlide.title_en}
              onChange={e => setNewSlide({ ...newSlide, title_en: e.target.value })}
              placeholder="例如: Discover Your Educational Journey"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
            <Input
              value={newSlide.title_zh}
              onChange={e => setNewSlide({ ...newSlide, title_zh: e.target.value })}
              placeholder="例如: 探索您的教育之旅"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">副标题 (英文)</label>
            <Input
              value={newSlide.subtitle_en}
              onChange={e => setNewSlide({ ...newSlide, subtitle_en: e.target.value })}
              placeholder="International academic programs..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">副标题 (中文)</label>
            <Input
              value={newSlide.subtitle_zh}
              onChange={e => setNewSlide({ ...newSlide, subtitle_zh: e.target.value })}
              placeholder="适合各年龄段学生的国际学术项目"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">按钮文本 (英文)</label>
            <Input
              value={newSlide.button_text_en}
              onChange={e => setNewSlide({ ...newSlide, button_text_en: e.target.value })}
              placeholder="例如: Explore Programs"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">按钮文本 (中文)</label>
            <Input
              value={newSlide.button_text_zh}
              onChange={e => setNewSlide({ ...newSlide, button_text_zh: e.target.value })}
              placeholder="例如: 探索项目"
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">按钮链接</label>
          <Input
            value={newSlide.button_link}
            onChange={e => setNewSlide({ ...newSlide, button_link: e.target.value })}
            placeholder="例如: /programs"
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting || !newSlide.title_en || !newSlide.title_zh || !newSlide.image}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                添加中...
              </>
            ) : '添加轮播图片'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideForm;
