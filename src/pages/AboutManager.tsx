
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

import AboutHeroManager from "@/components/about/AboutHeroManager";
import MissionManager from "@/components/about/MissionManager";
import ValuesManager from "@/components/about/ValuesManager";
import TeamMemberManager from "@/components/about/TeamMemberManager";
import { PageHeader } from "@/components/common/PageHeader";
import { AboutContent } from "@/types/aboutTypes";
import { getAboutContent, saveAboutContent } from "@/services/aboutService";

const AboutManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);

  React.useEffect(() => {
    const loadAboutData = async () => {
      setIsLoading(true);
      try {
        const data = await getAboutContent();
        setAboutData(data);
      } catch (error) {
        console.error("Failed to load about data:", error);
        toast({
          title: "加载失败",
          description: "无法加载关于我们页面数据",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAboutData();
  }, []);

  const handleSave = async () => {
    if (!aboutData) return;
    
    setIsLoading(true);
    try {
      await saveAboutContent(aboutData);
      toast({
        title: "保存成功",
        description: "关于我们页面内容已更新",
      });
    } catch (error) {
      console.error("Failed to save about data:", error);
      toast({
        title: "保存失败",
        description: "无法保存关于我们页面数据",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateHeroData = (heroData) => {
    if (!aboutData) return;
    setAboutData({
      ...aboutData,
      hero: heroData
    });
  };

  const updateMissionData = (missionData) => {
    if (!aboutData) return;
    setAboutData({
      ...aboutData,
      mission: missionData
    });
  };

  const updateValuesData = (valuesData) => {
    if (!aboutData) return;
    setAboutData({
      ...aboutData,
      values: valuesData
    });
  };

  if (isLoading && !aboutData) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader
        title="关于我们页面管理"
        description="管理'关于我们'页面的内容，包括头图、使命宣言、价值观和团队成员等信息"
        backUrl="/admin"
        actions={
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            保存所有更改
            {isLoading && (
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-transparent"></span>
            )}
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            在此页面上，您可以管理与公司相关的所有内容。请在下方标签页中选择要编辑的内容类型。
            对于每个部分，您都可以输入中英文内容，确保双语用户都能获得良好的体验。所有更改将在保存后同步更新到前台页面。
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-2">
          <TabsTrigger value="hero">页面头图</TabsTrigger>
          <TabsTrigger value="mission">使命宣言</TabsTrigger>
          <TabsTrigger value="values">公司价值观</TabsTrigger>
          <TabsTrigger value="team">团队成员</TabsTrigger>
        </TabsList>
        <TabsContent value="hero">
          <AboutHeroManager 
            heroData={aboutData?.hero} 
            onUpdate={updateHeroData} 
          />
        </TabsContent>
        <TabsContent value="mission">
          <MissionManager 
            missionData={aboutData?.mission}
            onUpdate={updateMissionData}
          />
        </TabsContent>
        <TabsContent value="values">
          <ValuesManager 
            valuesData={aboutData?.values}
            onUpdate={updateValuesData}
          />
        </TabsContent>
        <TabsContent value="team">
          <TeamMemberManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutManager;
