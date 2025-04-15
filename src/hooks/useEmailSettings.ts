
import { useState } from "react";
import { EmailSettings, EmailVariable } from "@/types/emailTypes";
import { toast } from "@/components/ui/use-toast";

// Initial data for email settings
const initialEmailSettings: EmailSettings = {
  companyEmails: ["contact@younikco.com", "admin@younikco.com"],
  userAutoReply: {
    en: {
      subject: "Thank you for your inquiry to YouNiKco",
      content: `Dear {{name}},

Thank you for submitting your inquiry to YouNiKco Educational Programs. We have received your request and our team will review it shortly.

We aim to respond to all inquiries within 2 business days. If your matter is urgent, please contact us directly at contact@younikco.com.

Your submitted information:
- Program Type: {{programType}}
- Destination: {{destination}}
- Grade Level: {{grade}}

Best regards,
YouNiKco Team`,
      enabled: true
    },
    zh: {
      subject: "感谢您向YouNiKco提交咨询",
      content: `尊敬的 {{name}}，

感谢您向YouNiKco教育项目提交咨询。我们已收到您的请求，我们的团队将尽快审核。

我们的目标是在2个工作日内回复所有咨询。如果您的事项紧急，请直接联系我们：contact@younikco.com。

您提交的信息：
- 项目类型：{{programType}}
- 目的地：{{destination}}
- 年级水平：{{grade}}

祝好，
YouNiKco团队`,
      enabled: true
    }
  },
  companyNotification: {
    subject: "新的表单提交通知 - {{name}}",
    content: `已收到新的表单提交：

提交人：{{name}}
电子邮箱：{{email}}
角色：{{role}}
项目类型：{{programType}}
目的地：{{destination}}
年级：{{grade}}
兴趣：{{interests}}

留言内容：
{{message}}

提交时间：{{submittedAt}}`,
    enabled: true
  }
};

// Available variables for templates
export const availableVariables: EmailVariable[] = [
  { key: "name", description: "提交人姓名" },
  { key: "email", description: "提交人邮箱" },
  { key: "role", description: "用户角色" },
  { key: "programType", description: "项目类型" },
  { key: "destination", description: "目的地" },
  { key: "grade", description: "年级" },
  { key: "interests", description: "学习兴趣" },
  { key: "message", description: "留言内容" },
  { key: "submittedAt", description: "提交时间" }
];

export function useEmailSettings() {
  const [settings, setSettings] = useState<EmailSettings>(initialEmailSettings);
  const [activeTab, setActiveTab] = useState("company");

  const handleCompanyEmailsChange = (emails: string[]) => {
    setSettings({
      ...settings,
      companyEmails: emails
    });
  };

  const handleCompanyNotificationChange = (
    field: "subject" | "content" | "enabled",
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      companyNotification: {
        ...settings.companyNotification,
        [field]: value
      }
    });
  };

  const handleUserAutoReplyChange = (
    lang: "en" | "zh",
    field: "subject" | "content" | "enabled",
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      userAutoReply: {
        ...settings.userAutoReply,
        [lang]: {
          ...settings.userAutoReply[lang],
          [field]: value
        }
      }
    });
  };

  const handleSaveSettings = () => {
    // This should call an API to save email settings
    toast({
      title: "保存成功",
      description: "邮件通知设置已更新"
    });
  };

  const handleSendTestEmail = () => {
    toast({
      title: "测试邮件已发送",
      description: "测试邮件已发送到配置的邮箱地址"
    });
  };

  return {
    settings,
    activeTab,
    setActiveTab,
    handleCompanyEmailsChange,
    handleCompanyNotificationChange,
    handleUserAutoReplyChange,
    handleSaveSettings,
    handleSendTestEmail
  };
}
