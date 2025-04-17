
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogPostHeaderProps {
  isEditing: boolean;
  isLoading: boolean;
  onBack: () => void;
  onPreview: () => void;
  onDelete: () => void;
  onSave: () => void;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({
  isEditing,
  isLoading,
  onBack,
  onPreview,
  onDelete,
  onSave
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="pl-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? "编辑文章" : "创建新文章"}</h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onPreview}
        >
          <Eye className="h-4 w-4 mr-2" />
          预览
        </Button>
        {isEditing && (
          <Button variant="destructive" onClick={onDelete} disabled={isLoading}>
            <Trash className="h-4 w-4 mr-2" />
            删除文章
          </Button>
        )}
        <Button onClick={onSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "保存中..." : "保存文章"}
        </Button>
      </div>
    </div>
  );
};

export default BlogPostHeader;
