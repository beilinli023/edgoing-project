
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostTitleSection from "./PostTitleSection";
import PostContentEditor from "./PostContentEditor";
import PostSidebarInfo from "./PostSidebarInfo";
import ImageGallery from "./ImageGallery";
import { useBlogPostEditor } from "@/hooks/useBlogPostEditor";
import { ImageData } from "@/types/blogTypes";

interface BlogPostEditorProps {
  postId?: string;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ postId }) => {
  const {
    formData,
    isLoading,
    isPending,
    isEditMode,
    isImageGalleryOpen,
    currentImageField,
    handleInputChange,
    handleContentChange,
    handleImageSelect,
    openImageGallery,
    closeImageGallery,
    handleSubmit
  } = useBlogPostEditor(postId);

  // 处理特色图片按钮点击，打开图片库
  const handleFeaturedImageButtonClick = () => {
    openImageGallery("featured_image");
  };

  // 处理内容编辑器中的图片插入按钮点击
  const handleContentImageButtonClick = (fieldName: string) => {
    openImageGallery(fieldName);
  };

  // 处理标签切换
  const handleTagToggle = (tagId: string) => {
    const updatedTags = formData.tags.includes(tagId)
      ? formData.tags.filter(id => id !== tagId)
      : [...formData.tags, tagId];
    
    handleInputChange("tags", updatedTags);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 标题和SEO信息 */}
      <PostTitleSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      {/* 内容编辑器（中英文标签页） */}
      <Tabs defaultValue="english" className="w-full">
        <TabsList className="grid grid-cols-2 w-[200px]">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="chinese">中文</TabsTrigger>
        </TabsList>

        <TabsContent value="english">
          <PostContentEditor
            formData={formData}
            onInputChange={handleInputChange}
            language="en"
            onInsertImage={() => handleContentImageButtonClick("content_en")}
          />
        </TabsContent>

        <TabsContent value="chinese">
          <PostContentEditor
            formData={formData}
            onInputChange={handleInputChange}
            language="zh"
            onInsertImage={() => handleContentImageButtonClick("content_zh")}
          />
        </TabsContent>
      </Tabs>

      {/* 侧边栏信息（分类、标签、发布状态等） */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* 提交按钮 */}
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "更新文章" : "发布文章"}
          </Button>
        </div>

        <div className="md:col-span-1">
          <PostSidebarInfo
            formData={formData}
            onInputChange={handleInputChange}
            handleTagToggle={handleTagToggle}
            openImageGallery={handleFeaturedImageButtonClick}
          />
        </div>
      </div>

      {/* Image Gallery Component */}
      {isImageGalleryOpen && (
        <ImageGallery
          isVisible={isImageGalleryOpen}
          onClose={closeImageGallery}
          onSelect={handleImageSelect}
        />
      )}
    </form>
  );
};

export default BlogPostEditor;
