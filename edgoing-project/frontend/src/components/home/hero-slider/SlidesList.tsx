
import React from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react";
import { SlideItem } from "@/hooks/useHeroSlider";

interface SlidesListProps {
  slides: SlideItem[];
  moveSlide: (id: number, direction: 'up' | 'down') => void;
  removeSlide: (id: number) => void;
  editSlide?: (slide: SlideItem) => void;
}

const SlidesList: React.FC<SlidesListProps> = ({ 
  slides, 
  moveSlide, 
  removeSlide,
  editSlide 
}) => {
  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-6 gap-2 bg-muted p-3 rounded-t-md">
        <div className="col-span-1">预览</div>
        <div className="col-span-2">标题</div>
        <div className="col-span-2">副标题</div>
        <div className="col-span-1">操作</div>
      </div>
      <div className="divide-y">
        {slides.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            暂无轮播图片，请点击"添加轮播图片"按钮添加
          </div>
        ) : (
          slides.map(slide => (
            <div key={slide.id} className="grid grid-cols-6 gap-2 p-3 items-center">
              <div className="col-span-1">
                <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden">
                  {slide.image ? (
                    <img src={slide.image} alt={slide.title_en} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xs">无图片</div>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm font-medium">{slide.title_en}</div>
                <div className="text-xs text-muted-foreground">{slide.title_zh}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs line-clamp-1">{slide.subtitle_en}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{slide.subtitle_zh}</div>
              </div>
              <div className="col-span-1 flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => moveSlide(slide.id, 'up')}
                  disabled={slide.order === 1}
                  title="上移"
                >
                  <ArrowUp size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => moveSlide(slide.id, 'down')}
                  disabled={slide.order === slides.length}
                  title="下移"
                >
                  <ArrowDown size={16} />
                </Button>
                {editSlide && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => editSlide(slide)}
                    title="编辑"
                  >
                    <Edit size={16} />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeSlide(slide.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="删除"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SlidesList;
