
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SocialMediaList from "./social/SocialMediaList";
import SocialMediaForm from "./social/SocialMediaForm";
import { useSocialMediaManager } from "@/hooks/useSocialMediaManager";

const SocialMediaManager = () => {
  const {
    socialLinks,
    newLink,
    setNewLink,
    addSocialLink,
    removeSocialLink,
    isLoading,
    error,
    isPending
  } = useSocialMediaManager();

  // 错误处理
  if (error) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>社交媒体管理</CardTitle>
          <CardDescription>管理网站的社交媒体链接</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
            加载社交媒体数据失败。请刷新页面重试。
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>社交媒体管理</CardTitle>
        <CardDescription>管理网站的社交媒体链接</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SocialMediaForm
            newLink={newLink}
            setNewLink={setNewLink}
            addSocialLink={addSocialLink}
            isPending={isPending}
          />
          
          <SocialMediaList
            socialLinks={socialLinks}
            removeSocialLink={removeSocialLink}
            isLoading={isLoading}
            isPending={isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaManager;
