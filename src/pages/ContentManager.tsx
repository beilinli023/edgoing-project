
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigationManager from "@/components/content/NavigationManager";
import FooterManager from "@/components/content/FooterManager";
import SocialMediaManager from "@/components/content/SocialMediaManager";
import ContactInfoManager from "@/components/content/contact/ContactInfoManager";
import { PageHeader } from "@/components/common/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState("navigation");

  // 获取一些初始数据来验证API连接
  const { isLoading, error, isError } = useQuery({
    queryKey: ['contentManagerInit'],
    queryFn: async () => {
      try {
        // 模拟成功响应，稍后可替换为真实API调用
        console.log("Initializing content manager, checking API connection...");
        
        // 由于API可能尚未实现，返回模拟数据避免错误
        return {
          success: true,
          data: {
            totalContents: 25,
            lastUpdated: new Date().toISOString()
          }
        };
      } catch (err) {
        console.error("Error fetching content management data:", err);
        throw err;
      }
    },
    retry: 1, // 只重试一次
    retryDelay: 1000, // 重试延迟1秒
  });

  // 即使有API错误也显示内容管理界面，只是显示一个错误提示
  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="通用内容管理" 
        description="管理网站的导航菜单、页脚信息、社交媒体链接和联系信息"
        backUrl="/admin"
      />
      
      {isLoading ? (
        // 加载状态
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ) : (
        // 内容管理界面
        <>
          {isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API连接提示</AlertTitle>
              <AlertDescription>
                无法连接到API服务。目前使用的是模拟数据，部分功能可能无法正常工作。
                <div className="mt-2">
                  <p className="text-sm">技术详情: {error ? (error as Error).message : "未知错误"}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="navigation">导航菜单</TabsTrigger>
              <TabsTrigger value="footer">页脚信息</TabsTrigger>
              <TabsTrigger value="social">社交媒体</TabsTrigger>
              <TabsTrigger value="contact">联系信息</TabsTrigger>
            </TabsList>
            
            <TabsContent value="navigation">
              <NavigationManager />
            </TabsContent>
            
            <TabsContent value="footer">
              <FooterManager />
            </TabsContent>
            
            <TabsContent value="social">
              <SocialMediaManager />
            </TabsContent>
            
            <TabsContent value="contact">
              <ContactInfoManager />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ContentManager;
