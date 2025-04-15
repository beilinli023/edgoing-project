
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProgramListManager from "@/components/programs/ProgramListManager";
import ProgramCategoryManager from "@/components/programs/ProgramCategoryManager";
import ProgramLocationManager from "@/components/programs/ProgramLocationManager";
import ProgramGradeLevelManager from "@/components/programs/ProgramGradeLevelManager";
import { PageHeader } from "@/components/common/PageHeader";

const ProgramManager = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="项目管理" 
        description="管理所有国际教育项目及其相关设置"
        backUrl="/admin"
      />
      
      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="programs">项目列表</TabsTrigger>
          <TabsTrigger value="categories">项目分类</TabsTrigger>
          <TabsTrigger value="locations">地区和国家</TabsTrigger>
          <TabsTrigger value="grades">年级级别</TabsTrigger>
        </TabsList>
        
        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>项目列表管理</CardTitle>
              <CardDescription>
                管理所有国际教育项目，包括项目详情、图片、标签等信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgramListManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>项目分类管理</CardTitle>
              <CardDescription>
                管理项目类别，如学术研究、文化体验等
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgramCategoryManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>地区和国家管理</CardTitle>
              <CardDescription>
                管理项目的目的地信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgramLocationManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>年级级别管理</CardTitle>
              <CardDescription>
                管理项目适用的年级范围
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgramGradeLevelManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgramManager;
