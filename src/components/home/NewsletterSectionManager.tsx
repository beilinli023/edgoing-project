
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNewsletterContent } from "@/hooks/useNewsletterContent";
import NewsletterContentForm from "./newsletter/NewsletterContentForm";
import { Mail } from "lucide-react";

const NewsletterSectionManager = () => {
  const { newsletterContent, isSaving, handleChange, handleSave } = useNewsletterContent();

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            邮件订阅区设置
          </CardTitle>
          <CardDescription>管理首页邮件订阅区块的标题、描述和按钮文本</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <NewsletterContentForm 
              newsletterContent={newsletterContent}
              handleChange={handleChange}
            />

            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存更改'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterSectionManager;
