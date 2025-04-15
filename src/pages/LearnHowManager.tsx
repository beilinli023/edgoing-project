
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import LearnHowPageManager from "@/components/learnhow/LearnHowPageManager";
import FaqManager from "@/pages/FaqManager"; // 重用现有的FAQ管理器

const LearnHowManager: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="了解更多管理" 
        description="管理了解更多页面内容和常见问题" 
        backUrl="/admin"
      />
      
      <Tabs defaultValue="page" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="page">页面内容</TabsTrigger>
          <TabsTrigger value="faqs">常见问题</TabsTrigger>
        </TabsList>
        
        <TabsContent value="page">
          <LearnHowPageManager />
        </TabsContent>
        
        <TabsContent value="faqs">
          <FaqManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearnHowManager;
