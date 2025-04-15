
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { validateImage, uploadImage } from "@/utils/imageUpload";

interface ImageUploaderProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  className?: string;
  showPreview?: boolean;
  previewSize?: "sm" | "md" | "lg";
  buttonText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageUpload,
  className = "",
  showPreview = true,
  previewSize = "md",
  buttonText = "上传图片"
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onImageUpload(imageUrl);
      
      toast({
        title: "上传成功",
        description: "图片已成功上传",
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // 创建一个类似于文件输入的事件对象
    const file = files[0];
    const fileInput = fileInputRef.current;
    
    if (fileInput) {
      // 创建一个新的文件列表
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      
      // 手动触发onChange事件
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
    }
  };

  // 根据 previewSize 确定预览图尺寸
  const previewSizeClasses = {
    sm: "w-20 h-16",
    md: "w-40 h-24",
    lg: "w-60 h-40"
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {showPreview && (
        <div 
          className={`${previewSizeClasses[previewSize]} bg-gray-200 rounded-md flex items-center justify-center overflow-hidden mb-2`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Image className="text-gray-500" size={previewSize === "sm" ? 16 : previewSize === "md" ? 24 : 32} />
          )}
        </div>
      )}
      
      <Button 
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <div className="h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            上传中...
          </>
        ) : (
          <>
            <Upload size={16} className="mr-2" />
            {buttonText} (最大3MB)
          </>
        )}
      </Button>
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default ImageUploader;
