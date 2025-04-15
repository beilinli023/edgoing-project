
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RichTextEditor from "../wysiwyg/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { BlogPostFormData } from "@/types/blogTypes";

interface PostContentEditorProps {
  formData: BlogPostFormData;
  onInputChange: (field: string, value: any) => void;
  language: "en" | "zh";
  onInsertImage?: () => void;
}

const PostContentEditor: React.FC<PostContentEditorProps> = ({ 
  formData, 
  onInputChange, 
  language,
  onInsertImage
}) => {
  const contentField = language === "zh" ? "content_zh" : "content_en";
  const titleText = language === "zh" ? "中文内容" : "英文内容";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titleText}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex justify-end gap-2">
          {onInsertImage && (
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={onInsertImage}
            >
              <Image className="h-4 w-4 mr-2" />
              插入图片
            </Button>
          )}
        </div>
        <RichTextEditor 
          content={formData[contentField]} 
          onChange={(html) => onInputChange(contentField, html)}
          placeholder={language === "zh" ? "输入文章中文内容..." : "Enter article content in English..."}
        />
        <p className="text-xs text-gray-500 mt-2">
          {language === "zh" ? "提示：使用上方工具栏格式化您的内容" : "Tip: Use the toolbar above to format your content"}
        </p>
      </CardContent>
    </Card>
  );
};

export default PostContentEditor;
