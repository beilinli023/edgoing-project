
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { validateImage, uploadImage } from "@/utils/imageUpload";

interface BasicInfoTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  newTag: string;
  setNewTag: (value: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  categories: any[];
  locations: any[];
  gradeLevels: any[];
}

const BasicInfoTab = ({
  formData,
  handleInputChange,
  newTag,
  setNewTag,
  handleAddTag,
  handleRemoveTag,
  categories,
  locations,
  gradeLevels,
}: BasicInfoTabProps) => {
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
      handleInputChange("thumbnail", imageUrl);
      
      toast({
        title: "上传成功",
        description: "缩略图已成功上传",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>项目基本信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">中文标题</label>
            <Input 
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="请输入项目中文标题"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">英文标题</label>
            <Input 
              value={formData.titleEn}
              onChange={(e) => handleInputChange("titleEn", e.target.value)}
              placeholder="Please enter program title in English"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">内部项目ID（仅管理用）</label>
          <Input 
            value={formData.id}
            onChange={(e) => handleInputChange("id", e.target.value)}
            placeholder="如: USART-2023-001 (国家/类型-年份-序号)"
            className="text-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">格式建议: 国家/类型-年份-序号，如 USART-2023-001 (仅供内部管理使用，不会显示给用户)</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">项目分类</label>
            <select 
              className="w-full h-10 border border-gray-300 rounded-md px-3"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              <option value="">选择分类...</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.nameEn}>
                  {category.nameCn} ({category.nameEn})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">地区/国家</label>
            <select 
              className="w-full h-10 border border-gray-300 rounded-md px-3"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            >
              <option value="">选择地区/国家...</option>
              {locations.map((location: any) => (
                <option key={location.id} value={location.nameEn}>
                  {location.nameCn} ({location.nameEn})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">适用年级</label>
            <select 
              className="w-full h-10 border border-gray-300 rounded-md px-3"
              value={formData.gradeLevel}
              onChange={(e) => handleInputChange("gradeLevel", e.target.value)}
            >
              <option value="">选择适用年级...</option>
              {gradeLevels.map((grade: any) => (
                <option key={grade.id} value={grade.nameEn}>
                  {grade.nameCn} ({grade.nameEn})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">项目时长</label>
          <Input 
            value={formData.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            placeholder="如: 2 weeks, 10 days"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">价格</label>
          <Input 
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="如: $3,500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">项目标签</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag: string, index: number) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {tag}
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <Input 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="添加新标签"
              className="mr-2"
            />
            <Button onClick={handleAddTag} disabled={!newTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">项目缩略图</label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {formData.thumbnail ? (
              <div className="relative inline-block">
                <img 
                  src={formData.thumbnail} 
                  alt="Thumbnail" 
                  className="max-h-40 mx-auto"
                />
                <button 
                  className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                  onClick={() => handleInputChange("thumbnail", "")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : uploading ? (
              <div className="flex flex-col items-center">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm text-gray-500">上传中...</p>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 mt-1">点击上传或拖放图片 (最大3MB)</p>
              </div>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
