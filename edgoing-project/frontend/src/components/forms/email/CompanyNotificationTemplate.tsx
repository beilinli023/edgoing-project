
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface CompanyNotificationTemplateProps {
  notificationTemplate: {
    subject: string;
    content: string;
    enabled: boolean;
  };
  onNotificationChange: (field: "enabled" | "content" | "subject", value: string | boolean) => void;
}

const CompanyNotificationTemplate: React.FC<CompanyNotificationTemplateProps> = ({
  notificationTemplate,
  onNotificationChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notification-enabled" className="text-base">启用公司通知邮件</Label>
            <Switch
              id="notification-enabled"
              checked={notificationTemplate.enabled}
              onCheckedChange={(checked) => onNotificationChange("enabled", checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-subject">邮件主题</Label>
            <Input
              id="notification-subject"
              value={notificationTemplate.subject}
              onChange={(e) => onNotificationChange("subject", e.target.value)}
              placeholder="输入邮件主题"
              disabled={!notificationTemplate.enabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-content">邮件内容</Label>
            <Textarea
              id="notification-content"
              value={notificationTemplate.content}
              onChange={(e) => onNotificationChange("content", e.target.value)}
              placeholder="输入邮件内容，可使用变量如 {{name}} 插入动态内容"
              rows={10}
              disabled={!notificationTemplate.enabled}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              支持变量: 用双大括号包围变量名，如 {'{{变量名}}'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyNotificationTemplate;
