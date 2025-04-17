
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GettingStartedCard = () => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
        <CardTitle className="text-xl text-primary">开始使用</CardTitle>
        <CardDescription>快速上手指南</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <p>您现在正在使用 EdGoing 国际教育项目网站管理系统。此系统专为非开发人员设计，可轻松管理网站内容。</p>
          <p>从左侧导航栏选择您要管理的内容类型，如项目、博客、FAQ等。每个部分都提供了简单直观的编辑界面。</p>
          <p>如需帮助，请点击各页面上的提示图标或参考系统设置中的使用指南。</p>
          
          <div className="flex gap-3 pt-2">
            <Button className="bg-blue-600 hover:bg-blue-700">查看使用指南</Button>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50">了解更多</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GettingStartedCard;
