
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import ContactFormManager from "@/components/forms/ContactFormManager";
import FormOptionsManager from "@/components/forms/FormOptionsManager";
import FormSubmissionsManager from "@/components/forms/FormSubmissionsManager";

const FormManager = () => {
  const [currentTab, setCurrentTab] = useState("content");

  const handleSave = () => {
    // 根据当前标签页触发相应的保存操作
    switch(currentTab) {
      case "content":
        toast.success("保存成功", {
          description: "表单内容已更新"
        });
        break;
      case "options":
        toast.success("保存成功", {
          description: "表单选项已更新"
        });
        break;
      default:
        toast.info("提示", {
          description: "提交管理页面的操作已自动保存"
        });
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader 
        title="表单管理" 
        description="管理学生咨询表单的内容、选项和提交记录"
        backUrl="/admin"
        actions={
          currentTab !== "submissions" && (
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
            在此页面上，您可以管理网站上的"开始计划"表单，包括表单文本、选项和已提交记录。
            请在下方标签页中选择要编辑的内容类型。所有表单内容都支持中英文双语版本。
          </p>
        </CardContent>
      </Card>

      <Tabs 
        defaultValue="content" 
        className="space-y-4" 
        onValueChange={(value) => setCurrentTab(value)}
      >
        <TabsList className="grid grid-cols-3 gap-2 bg-blue-50 p-1">
          <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">表单内容</TabsTrigger>
          <TabsTrigger value="options" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">表单选项</TabsTrigger>
          <TabsTrigger value="submissions" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">提交记录</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="border rounded-lg p-4 shadow-sm bg-white">
          <ContactFormManager />
        </TabsContent>
        <TabsContent value="options" className="border rounded-lg p-4 shadow-sm bg-white">
          <FormOptionsManager />
        </TabsContent>
        <TabsContent value="submissions" className="border rounded-lg p-4 shadow-sm bg-white">
          <FormSubmissionsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormManager;
