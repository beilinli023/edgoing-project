
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import VideoLibrary from "@/components/media/VideoLibrary";
import ExternalVideoLibrary from "@/components/media/ExternalVideoLibrary";

const MediaManager = () => {
  const [activeTab, setActiveTab] = useState("uploaded");

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="媒体库管理" 
        description="管理网站的视频资源，包括上传视频和外部视频链接"
        backUrl="/admin"
      />

      <Tabs defaultValue="uploaded" className="mt-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="uploaded">上传视频</TabsTrigger>
          <TabsTrigger value="external">外部视频链接</TabsTrigger>
        </TabsList>
        
        <TabsContent value="uploaded" className="mt-6">
          <VideoLibrary />
        </TabsContent>
        
        <TabsContent value="external" className="mt-6">
          <ExternalVideoLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaManager;
