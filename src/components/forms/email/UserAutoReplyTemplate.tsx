
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface UserAutoReplyTemplateProps {
  replyTemplate: {
    subject: string;
    content: string;
    enabled: boolean;
  };
  language: string;
  onReplyChange: (field: "enabled" | "content" | "subject", value: string | boolean) => void;
}

const UserAutoReplyTemplate: React.FC<UserAutoReplyTemplateProps> = ({
  replyTemplate,
  language,
  onReplyChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`auto-reply-enabled-${language}`} className="text-base">
              {language === 'en' ? 'Enable English Auto-Reply' : '启用中文自动回复'}
            </Label>
            <Switch
              id={`auto-reply-enabled-${language}`}
              checked={replyTemplate.enabled}
              onCheckedChange={(checked) => onReplyChange("enabled", checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`auto-reply-subject-${language}`}>
              {language === 'en' ? 'Email Subject' : '邮件主题'}
            </Label>
            <Input
              id={`auto-reply-subject-${language}`}
              value={replyTemplate.subject}
              onChange={(e) => onReplyChange("subject", e.target.value)}
              placeholder={language === 'en' ? 'Enter email subject' : '输入邮件主题'}
              disabled={!replyTemplate.enabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`auto-reply-content-${language}`}>
              {language === 'en' ? 'Email Content' : '邮件内容'}
            </Label>
            <Textarea
              id={`auto-reply-content-${language}`}
              value={replyTemplate.content}
              onChange={(e) => onReplyChange("content", e.target.value)}
              placeholder={
                language === 'en' 
                  ? 'Enter email content. You can use variables like {{name}} to insert dynamic content'
                  : '输入邮件内容，可使用变量如 {{name}} 插入动态内容'
              }
              rows={10}
              disabled={!replyTemplate.enabled}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {language === 'en' 
                ? 'Variables: Surround variable names with double curly braces, e.g. {{variable_name}}'
                : '支持变量: 用双大括号包围变量名，如 {{variable_name}}'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAutoReplyTemplate;
