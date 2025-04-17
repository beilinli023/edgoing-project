
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import LearnHowHeroManager from "./LearnHowHeroManager";
import LearnHowContactManager from "./LearnHowContactManager";
import { LearnHowPage } from "@/types/learnHowTypes";
import { getLearnHowPageContent, updateLearnHowPageContent } from "@/services/learnHowService";
import { useToast } from "@/components/ui/use-toast";

const LearnHowPageManager: React.FC = () => {
  const [pageContent, setPageContent] = useState<LearnHowPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        setLoading(true);
        const content = await getLearnHowPageContent();
        setPageContent(content);
      } catch (error) {
        console.error("加载Learn How页面内容失败:", error);
        toast({
          title: "加载失败",
          description: "无法加载页面内容，请稍后重试",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPageContent();
  }, [toast]);

  const handleSaveContent = async (updatedContent: LearnHowPage) => {
    try {
      setSaving(true);
      await updateLearnHowPageContent(updatedContent);
      setPageContent(updatedContent);
      toast({
        title: "保存成功",
        description: "页面内容已成功更新",
      });
    } catch (error) {
      console.error("保存页面内容失败:", error);
      toast({
        title: "保存失败",
        description: "无法保存页面内容，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpdate = (hero: LearnHowPage["hero"]) => {
    if (pageContent) {
      const updatedContent = { ...pageContent, hero };
      handleSaveContent(updatedContent);
    }
  };

  const handleContactUpdate = (contact_section: LearnHowPage["contact_section"]) => {
    if (pageContent) {
      const updatedContent = { ...pageContent, contact_section };
      handleSaveContent(updatedContent);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <PageHeader title="学习指南页面管理" description="管理学习指南页面内容" />
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-60 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">加载页面内容...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className="container mx-auto p-6">
        <PageHeader title="学习指南页面管理" description="管理学习指南页面内容" />
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-60 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500">无法加载页面内容</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                    onClick={() => window.location.reload()}
                  >
                    重试
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="学习指南页面管理" description="管理学习指南页面内容" />
      
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="hero">页面头部</TabsTrigger>
          <TabsTrigger value="contact">联系部分</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hero">
          <LearnHowHeroManager 
            heroContent={pageContent.hero} 
            onUpdate={handleHeroUpdate}
            isSaving={saving}
          />
        </TabsContent>
        
        <TabsContent value="contact">
          <LearnHowContactManager 
            contactContent={pageContent.contact_section}
            onUpdate={handleContactUpdate}
            isSaving={saving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearnHowPageManager;
