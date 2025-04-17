
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTaglineSection } from "@/hooks/useTaglineSection";
import TaglineContentForm from "./tagline/TaglineContentForm";
import BackgroundImageUploader from "./tagline/BackgroundImageUploader";

const TaglineSectionManager = () => {
  const {
    taglineContent,
    setTaglineContent,
    uploading,
    fileInputRef,
    handleSave,
    handleFileSelect
  } = useTaglineSection();

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>"Explore. Learn. Grow."部分管理</CardTitle>
        <CardDescription>编辑首页标语部分的内容和背景图片</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <TaglineContentForm 
            taglineContent={taglineContent}
            onChange={setTaglineContent}
          />
          
          <BackgroundImageUploader 
            backgroundImage={taglineContent.background_image}
            uploading={uploading}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
          />
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>保存更改</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaglineSectionManager;
