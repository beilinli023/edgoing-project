
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const CallToActionManager = () => {
  const [ctaContent, setCtaContent] = React.useState({
    title_en: "Ready to Start Your Journey?",
    title_zh: "准备好开始您的旅程了吗？",
    description_en: "Take the first step towards your international education adventure. Our team is here to help you find the perfect program.",
    description_zh: "迈出国际教育冒险的第一步。我们的团队将帮助您找到完美的项目。",
    button_text_en: "Let's Plan",
    button_text_zh: "开始规划",
    button_link: "/start-planning"
  });

  const handleSave = () => {
    console.log("保存CTA内容:", ctaContent);
    // 在这里实现保存到API的逻辑
    toast.success("保存成功", {
      description: "行动召唤区域内容已更新"
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>行动召唤区域管理</CardTitle>
        <CardDescription>编辑首页底部行动召唤区域的内容</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
              <Input
                value={ctaContent.title_en}
                onChange={e => setCtaContent({ ...ctaContent, title_en: e.target.value })}
                placeholder="Ready to Start Your Journey?"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
              <Input
                value={ctaContent.title_zh}
                onChange={e => setCtaContent({ ...ctaContent, title_zh: e.target.value })}
                placeholder="准备好开始您的旅程了吗？"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">描述 (英文)</label>
              <Textarea
                value={ctaContent.description_en}
                onChange={e => setCtaContent({ ...ctaContent, description_en: e.target.value })}
                placeholder="Take the first step towards..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">描述 (中文)</label>
              <Textarea
                value={ctaContent.description_zh}
                onChange={e => setCtaContent({ ...ctaContent, description_zh: e.target.value })}
                placeholder="迈出第一步，与YouNiKco一起..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">按钮文本 (英文)</label>
              <Input
                value={ctaContent.button_text_en}
                onChange={e => setCtaContent({ ...ctaContent, button_text_en: e.target.value })}
                placeholder="Let's Plan"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">按钮文本 (中文)</label>
              <Input
                value={ctaContent.button_text_zh}
                onChange={e => setCtaContent({ ...ctaContent, button_text_zh: e.target.value })}
                placeholder="开始规划"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">按钮链接</label>
              <Input
                value={ctaContent.button_link}
                onChange={e => setCtaContent({ ...ctaContent, button_link: e.target.value })}
                placeholder="/start-planning"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>保存更改</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallToActionManager;
