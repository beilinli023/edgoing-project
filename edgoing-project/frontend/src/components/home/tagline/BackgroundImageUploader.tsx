
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

interface BackgroundImageUploaderProps {
  backgroundImage: string;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BackgroundImageUploader: React.FC<BackgroundImageUploaderProps> = ({
  backgroundImage,
  uploading,
  fileInputRef,
  onFileSelect
}) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">背景图片</label>
      <div className="flex items-start gap-4">
        <div className="w-40 h-24 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
          {backgroundImage ? (
            <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
          ) : (
            <Image size={24} className="text-gray-500" />
          )}
        </div>
        
        <Button 
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              上传中...
            </>
          ) : (
            <>
              <Upload size={16} className="mr-2" />
              上传新背景图片 (最大3MB)
            </>
          )}
        </Button>
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={onFileSelect}
        />
      </div>
    </div>
  );
};

export default BackgroundImageUploader;
