import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Save,
  RefreshCw,
  Info,
  MailQuestion,
  Link,
  Code,
  Mail
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriptionSettingsData {
  general: {
    subscriptionEnabled: boolean;
    doubleOptIn: boolean;
    welcomeEmailEnabled: boolean;
    defaultFromName: string;
    defaultFromEmail: string;
    replyToEmail: string;
  };
  form: {
    buttonText: string;
    successMessage: string;
    placeholderEmail: string;
    requireName: boolean;
    nameFieldLabel: string;
    placeholderName: string;
    privacyText: string;
  };
  advanced: {
    subscriptionEndpoint: string;
    captchaEnabled: boolean;
    throttleLimit: number;
    embedCode: string;
  };
}

// 模拟数据
const initialSettings: SubscriptionSettingsData = {
  general: {
    subscriptionEnabled: true,
    doubleOptIn: true,
    welcomeEmailEnabled: true,
    defaultFromName: "YouNiKco 教育",
    defaultFromEmail: "newsletter@younikco.com",
    replyToEmail: "contact@younikco.com"
  },
  form: {
    buttonText: "订阅",
    successMessage: "感谢订阅！请查看您的邮箱确认订阅。",
    placeholderEmail: "输入您的邮箱地址",
    requireName: false,
    nameFieldLabel: "姓名",
    placeholderName: "输入您的姓名",
    privacyText: "订阅即表示您同意接收我们的最新活动和项目信息。您可以随时取消订阅。"
  },
  advanced: {
    subscriptionEndpoint: "/api/subscribe",
    captchaEnabled: true,
    throttleLimit: 5,
    embedCode: '<div id="younikco-subscribe"></div>\n<script src="https://younikco.com/subscribe-widget.js"></script>'
  }
};

const SubscriptionSettings = () => {
  const [settings, setSettings] = useState<SubscriptionSettingsData>(initialSettings);
  const [activeSection, setActiveSection] = useState<string>("general");

  // 通用设置更新
  const handleGeneralChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [field]: value
      }
    });
  };

  // 表单设置更新
  const handleFormChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      form: {
        ...settings.form,
        [field]: value
      }
    });
  };

  // 高级设置更新
  const handleAdvancedChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      advanced: {
        ...settings.advanced,
        [field]: value
      }
    });
  };

  // 保存设置
  const handleSaveSettings = () => {
    // 这里应该调用API保存设置
    toast({
      title: "设置已保存",
      description: "订阅邮件系统设置已更新"
    });
  };

  // 复制嵌入代码
  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(settings.advanced.embedCode);
    toast({
      title: "代码已复制",
      description: "嵌入代码已复制到剪贴板"
    });
  };

  // 测试订阅API
  const handleTestAPI = () => {
    toast({
      title: "API测试成功",
      description: "订阅API正常工作"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Settings className="mr-2 h-6 w-6 text-primary" />
          订阅设置
        </h2>
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          保存设置
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>订阅系统设置</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="single"
              collapsible
              defaultValue="general"
              onValueChange={(value) => setActiveSection(value)}
            >
              {/* 通用设置区域 */}
              <AccordionItem value="general">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>基本设置</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="subscription-enabled">启用订阅功能</Label>
                        <p className="text-sm text-muted-foreground">
                          在网站上启用邮件订阅系统
                        </p>
                      </div>
                      <Switch
                        id="subscription-enabled"
                        checked={settings.general.subscriptionEnabled}
                        onCheckedChange={(checked) => 
                          handleGeneralChange("subscriptionEnabled", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="double-opt-in">双重确认订阅</Label>
                        <p className="text-sm text-muted-foreground">
                          用户需要点击确认邮件中的链接才能完成订阅
                        </p>
                      </div>
                      <Switch
                        id="double-opt-in"
                        checked={settings.general.doubleOptIn}
                        onCheckedChange={(checked) => 
                          handleGeneralChange("doubleOptIn", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="welcome-email-enabled">发送欢迎邮件</Label>
                        <p className="text-sm text-muted-foreground">
                          在用户成功订阅后发送欢迎邮件
                        </p>
                      </div>
                      <Switch
                        id="welcome-email-enabled"
                        checked={settings.general.welcomeEmailEnabled}
                        onCheckedChange={(checked) => 
                          handleGeneralChange("welcomeEmailEnabled", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-4 pt-2">
                      <div className="grid gap-2">
                        <Label htmlFor="default-from-name">默认发件人名称</Label>
                        <Input
                          id="default-from-name"
                          value={settings.general.defaultFromName}
                          onChange={(e) => handleGeneralChange("defaultFromName", e.target.value)}
                          placeholder="YouNiKco 教育"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="default-from-email">默认发件人邮箱</Label>
                        <Input
                          id="default-from-email"
                          value={settings.general.defaultFromEmail}
                          onChange={(e) => handleGeneralChange("defaultFromEmail", e.target.value)}
                          placeholder="newsletter@younikco.com"
                          type="email"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="reply-to-email">回复邮箱地址</Label>
                        <Input
                          id="reply-to-email"
                          value={settings.general.replyToEmail}
                          onChange={(e) => handleGeneralChange("replyToEmail", e.target.value)}
                          placeholder="contact@younikco.com"
                          type="email"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* 表单设置区域 */}
              <AccordionItem value="form">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <MailQuestion className="h-5 w-5 text-primary" />
                    <span>订阅表单设置</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="button-text">订阅按钮文本</Label>
                        <Input
                          id="button-text"
                          value={settings.form.buttonText}
                          onChange={(e) => handleFormChange("buttonText", e.target.value)}
                          placeholder="订阅"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="success-message">成功提交消息</Label>
                        <Input
                          id="success-message"
                          value={settings.form.successMessage}
                          onChange={(e) => handleFormChange("successMessage", e.target.value)}
                          placeholder="感谢订阅！请查看您的邮箱确认订阅。"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="placeholder-email">邮箱输入框占位文本</Label>
                        <Input
                          id="placeholder-email"
                          value={settings.form.placeholderEmail}
                          onChange={(e) => handleFormChange("placeholderEmail", e.target.value)}
                          placeholder="输入您的邮箱地址"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="require-name">要求输入姓名</Label>
                        <p className="text-sm text-muted-foreground">
                          订阅表单中包含姓名输入字段
                        </p>
                      </div>
                      <Switch
                        id="require-name"
                        checked={settings.form.requireName}
                        onCheckedChange={(checked) => 
                          handleFormChange("requireName", checked)
                        }
                      />
                    </div>
                    
                    {settings.form.requireName && (
                      <div className="space-y-4 pt-2">
                        <div className="grid gap-2">
                          <Label htmlFor="name-field-label">姓名字段标签</Label>
                          <Input
                            id="name-field-label"
                            value={settings.form.nameFieldLabel}
                            onChange={(e) => handleFormChange("nameFieldLabel", e.target.value)}
                            placeholder="姓名"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="placeholder-name">姓名输入框占位文本</Label>
                          <Input
                            id="placeholder-name"
                            value={settings.form.placeholderName}
                            onChange={(e) => handleFormChange("placeholderName", e.target.value)}
                            placeholder="输入您的姓名"
                          />
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="grid gap-2">
                      <Label htmlFor="privacy-text">隐私声明文本</Label>
                      <Textarea
                        id="privacy-text"
                        value={settings.form.privacyText}
                        onChange={(e) => handleFormChange("privacyText", e.target.value)}
                        placeholder="订阅即表示您同意接收我们的最新活动和项目信息。您可以随时取消订阅。"
                        rows={3}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* 高级设置区域 */}
              <AccordionItem value="advanced">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <span>高级设置</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <Label htmlFor="subscription-endpoint">订阅API端点</Label>
                      <div className="flex gap-2">
                        <Input
                          id="subscription-endpoint"
                          value={settings.advanced.subscriptionEndpoint}
                          onChange={(e) => handleAdvancedChange("subscriptionEndpoint", e.target.value)}
                          placeholder="/api/subscribe"
                        />
                        <Button 
                          variant="outline" 
                          className="shrink-0"
                          onClick={handleTestAPI}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          测试
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="captcha-enabled">启用验证码</Label>
                        <p className="text-sm text-muted-foreground">
                          在订阅表单中使用验证码防止自动提交
                        </p>
                      </div>
                      <Switch
                        id="captcha-enabled"
                        checked={settings.advanced.captchaEnabled}
                        onCheckedChange={(checked) => 
                          handleAdvancedChange("captchaEnabled", checked)
                        }
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="throttle-limit">请求限制</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">每IP每小时最多</span>
                        <Select
                          value={settings.advanced.throttleLimit.toString()}
                          onValueChange={(value) => handleAdvancedChange("throttleLimit", parseInt(value))}
                        >
                          <SelectTrigger id="throttle-limit" className="w-20">
                            <SelectValue placeholder="5" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">次订阅请求</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="embed-code">嵌入代码</Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7"
                          onClick={handleCopyEmbedCode}
                        >
                          复制代码
                        </Button>
                      </div>
                      <Textarea
                        id="embed-code"
                        value={settings.advanced.embedCode}
                        onChange={(e) => handleAdvancedChange("embedCode", e.target.value)}
                        rows={4}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        将此代码添加到您网站上需要显示订阅表单的位置
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 mt-2">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">开发者注意事项</p>
                        <p className="mt-1">高级设置可能需要技术支持。如果您不确定如何配置这些选项，请联系您的Web开发人员获取帮助。</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          保存设置
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionSettings;
