
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BlogPostFormData } from "@/types/blogTypes";

interface PostTitleSectionProps {
  formData: BlogPostFormData;
  onInputChange: (field: string, value: any) => void;
}

const PostTitleSection: React.FC<PostTitleSectionProps> = ({ formData, onInputChange }) => {
  // Handle slug generation from title
  const handleTitleChange = (field: string, value: string) => {
    onInputChange(field, value);
    
    // If it's the English title and slug is empty, auto-generate it
    if (field === "title_en" && (!formData.slug || formData.slug === "")) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
        .replace(/\s+/g, "-"); // Replace spaces with hyphens
      
      onInputChange("slug", slug);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>文章标题</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">英文标题</label>
          <Input 
            value={formData.title_en}
            onChange={(e) => handleTitleChange("title_en", e.target.value)}
            placeholder="Enter title in English"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">中文标题</label>
          <Input 
            value={formData.title_zh}
            onChange={(e) => handleTitleChange("title_zh", e.target.value)}
            placeholder="输入中文标题"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL 别名</label>
          <Input 
            value={formData.slug}
            onChange={(e) => onInputChange("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            placeholder="article-url-slug"
            className="font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            此字段将用于生成文章URL，只能包含小写字母、数字和连字符
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostTitleSection;
