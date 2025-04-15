
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeroSliderManager from "@/components/home/HeroSliderManager";
import TaglineSectionManager from "@/components/home/TaglineSectionManager";
import FeaturedProgramsManager from "@/components/home/FeaturedProgramsManager";
import StudentStoriesManager from "@/components/home/StudentStoriesManager";
import NewsletterSectionManager from "@/components/home/NewsletterSectionManager";
import PartnerLogosManager from "@/components/home/PartnerLogosManager";
import { PageHeader } from "@/components/common/PageHeader";

const HomeManager = () => {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="首页内容管理"
        description="管理网站首页的各个内容版块"
        backUrl="/admin"
      />

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="hero">轮播横幅</TabsTrigger>
          <TabsTrigger value="tagline">标语部分</TabsTrigger>
          <TabsTrigger value="featured">精选项目</TabsTrigger>
          <TabsTrigger value="partners">合作伙伴</TabsTrigger>
          <TabsTrigger value="stories">学生故事</TabsTrigger>
          <TabsTrigger value="newsletter">邮件订阅</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <HeroSliderManager />
        </TabsContent>

        <TabsContent value="tagline">
          <TaglineSectionManager />
        </TabsContent>

        <TabsContent value="featured">
          <FeaturedProgramsManager />
        </TabsContent>

        <TabsContent value="partners">
          <PartnerLogosManager />
        </TabsContent>

        <TabsContent value="stories">
          <StudentStoriesManager />
        </TabsContent>

        <TabsContent value="newsletter">
          <NewsletterSectionManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeManager;
