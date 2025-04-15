
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { validateImage, uploadImage, MAX_FILE_SIZE } from "@/utils/imageUpload";

interface ImagesTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

// 最大允许的图片数量，增加到 15
const MAX_IMAGES = 15;

const ImagesTab = ({ formData, handleInputChange }: ImagesTabProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 检查是否已达到最大图片数量
    if (formData.images.length >= MAX_IMAGES) {
      toast({
        title: "上传失败",
        description: `最多只能上传${MAX_IMAGES}张图片`,
        variant: "destructive",
      });
      // 重置文件输入框
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

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
      
      // 更新formData中的images数组
      const newImages = [...formData.images, imageUrl];
      handleInputChange("images", newImages);
      
      toast({
        title: "上传成功",
        description: "图片已成功添加到项目中",
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
    
    // 检查是否已达到最大图片数量
    if (formData.images.length >= MAX_IMAGES) {
      toast({
        title: "上传失败",
        description: `最多只能上传${MAX_IMAGES}张图片`,
        variant: "destructive",
      });
      return;
    }
    
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

  // 渲染图片顺序指示器
  const renderImageIndex = (index: number) => (
    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
      {index + 1}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>项目图片管理 ({formData.images.length}/{MAX_IMAGES})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {formData.images.map((image: string, index: number) => (
            <div key={index} className="relative border rounded-md overflow-hidden group">
              <img 
                src={image} 
                alt={`Project image ${index + 1}`} 
                className="w-full h-40 object-cover"
              />
              {renderImageIndex(index)}
              <div className="absolute top-2 right-2 flex gap-2">
                <button 
                  className="bg-white rounded-full p-1 shadow"
                  onClick={() => {
                    const newImages = [...formData.images];
                    newImages.splice(index, 1);
                    handleInputChange("images", newImages);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {formData.images.length < MAX_IMAGES && (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-40 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm text-gray-500">上传中...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">上传项目图片</p>
                  <p className="text-xs text-gray-400">点击上传或拖放图片 (最大3MB)</p>
                  <p className="text-xs text-gray-400 mt-1">最多可上传{MAX_IMAGES}张图片</p>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">图片管理提示</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
            <li>第一张图片将作为项目的主图</li>
            <li>图片显示顺序与上传顺序一致，按照编号顺序排列</li>
            <li>图片大小最好保持一致，推荐比例16:9或4:3</li>
            <li>确保图片质量清晰，代表项目特色和亮点</li>
            <li>可以上传多达{MAX_IMAGES}张图片来丰富项目展示效果</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagesTab;
