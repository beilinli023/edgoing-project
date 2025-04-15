
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

interface BackgroundImageSectionProps {
  backgroundImage: string;
  onImageUpload: () => void;
}

const BackgroundImageSection: React.FC<BackgroundImageSectionProps> = ({ 
  backgroundImage, 
  onImageUpload 
}) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">背景图片</label>
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="w-full md:w-1/3 h-40 bg-gray-200 rounded-md overflow-hidden">
          {backgroundImage ? (
            <img 
              src={backgroundImage} 
              alt="Hero background" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image size={24} className="text-gray-500" />
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <Button variant="outline" onClick={onImageUpload}>
            <Upload size={16} className="mr-2" />
            上传新背景图片
          </Button>
          <p className="text-xs text-muted-foreground">
            建议使用分辨率至少为1920x600像素的图片，支持JPG、PNG或WebP格式。图片将添加半透明暗色蒙版以增强文字可读性。
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackgroundImageSection;
