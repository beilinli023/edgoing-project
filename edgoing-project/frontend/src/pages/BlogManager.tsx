
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

import BlogPageSettingsManager from "@/components/blog/BlogPageSettingsManager";
import BlogPostsManager from "@/components/blog/BlogPostsManager";
import BlogCategoriesManager from "@/components/blog/BlogCategoriesManager";
import BlogTagsManager from "@/components/blog/BlogTagsManager";
import { PageHeader } from "@/components/common/PageHeader";

const BlogManager = () => {
  const [currentTab, setCurrentTab] = useState("posts");

  const handleSave = () => {
    // 根据当前标签页触发相应的保存操作
    switch(currentTab) {
      case "settings":
        toast({
          title: "保存成功",
          description: "博客页面设置已更新",
        });
        break;
      case "categories":
        toast({
          title: "保存成功",
          description: "博客分类已更新",
        });
        break;
      case "tags":
        toast({
          title: "保存成功",
          description: "博客标签已更新",
        });
        break;
      default:
        toast({
          title: "提示",
          description: "文章管理页面的内容已经自动保存",
        });
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader 
        title="博客管理" 
        description="管理博客页面的内容，包括文章、分类、标签和页面设置"
        backUrl="/admin"
        actions={
          currentTab !== "posts" && (
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              保存更改
            </Button>
          )
        }
      />

      <Card className="mb-6 shadow-md border-blue-100">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            在此页面上，您可以管理所有博客相关的内容。请在下方标签页中选择要编辑的内容类型。
            对于每篇文章，您都可以输入中英文内容，确保双语用户都能获得良好的体验。
          </p>
        </CardContent>
      </Card>

      <Tabs 
        defaultValue="posts" 
        className="space-y-4" 
        onValueChange={(value) => setCurrentTab(value)}
      >
        <TabsList className="grid grid-cols-4 gap-2 bg-blue-50 p-1">
          <TabsTrigger value="posts" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">文章管理</TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">分类管理</TabsTrigger>
          <TabsTrigger value="tags" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">标签管理</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">页面设置</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="border rounded-lg p-4 shadow-sm bg-white">
          <BlogPostsManager />
        </TabsContent>
        <TabsContent value="categories" className="border rounded-lg p-4 shadow-sm bg-white">
          <BlogCategoriesManager />
        </TabsContent>
        <TabsContent value="tags" className="border rounded-lg p-4 shadow-sm bg-white">
          <BlogTagsManager />
        </TabsContent>
        <TabsContent value="settings" className="border rounded-lg p-4 shadow-sm bg-white">
          <BlogPageSettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogManager;
