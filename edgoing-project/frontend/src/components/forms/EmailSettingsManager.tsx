
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEmailSettings, availableVariables } from "@/hooks/useEmailSettings";
import { EmailVariable } from "@/types/emailTypes";
import CompanyEmailsManager from "./email/CompanyEmailsManager";
import CompanyNotificationTemplate from "./email/CompanyNotificationTemplate";
import UserAutoReplyTemplate from "./email/UserAutoReplyTemplate";
import VariableBadges from "./email/VariableBadges";

const EmailSettingsManager = () => {
  const {
    settings,
    activeTab,
    setActiveTab,
    handleCompanyEmailsChange,
    handleCompanyNotificationChange,
    handleUserAutoReplyChange,
    handleSaveSettings,
    handleSendTestEmail
  } = useEmailSettings();

  const isLoading = false;
  const error = null;

  if (isLoading) {
    return <div className="text-center py-8">Loading email settings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading email settings: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>邮件通知设置</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* 公司接收邮箱 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">公司接收邮箱</h3>
            <p className="text-sm text-muted-foreground">设置接收表单提交通知的公司邮箱地址（可添加多个）</p>
            
            <CompanyEmailsManager 
              companyEmails={settings.companyEmails}
              onEmailsChange={handleCompanyEmailsChange}
            />
          </div>

          <Separator />

          {/* 通知模板 */}
          <Tabs defaultValue="company" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="company">公司通知邮件</TabsTrigger>
              <TabsTrigger value="user">用户自动回复</TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">公司内部通知模板</h3>
              <p className="text-sm text-muted-foreground">当用户提交表单时，系统会向公司邮箱发送此邮件</p>
              
              <div className="mt-2">
                <Badge variant="outline" className="mb-2">可用变量</Badge>
                <VariableBadges 
                  emailVariables={availableVariables}
                />
              </div>
              
              <CompanyNotificationTemplate 
                notificationTemplate={settings.companyNotification}
                onNotificationChange={handleCompanyNotificationChange}
              />
            </TabsContent>

            <TabsContent value="user" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">用户自动回复模板</h3>
              <p className="text-sm text-muted-foreground">用户提交表单后自动收到的确认邮件</p>
              
              <div className="mt-2">
                <Badge variant="outline" className="mb-2">可用变量</Badge>
                <VariableBadges 
                  emailVariables={availableVariables}
                />
              </div>
              
              <Tabs defaultValue="en" className="mt-4">
                <TabsList className="w-40">
                  <TabsTrigger value="en">英文模板</TabsTrigger>
                  <TabsTrigger value="zh">中文模板</TabsTrigger>
                </TabsList>
                
                <TabsContent value="en" className="pt-4">
                  <UserAutoReplyTemplate 
                    replyTemplate={settings.userAutoReply.en}
                    language="en"
                    onReplyChange={(field, value) => handleUserAutoReplyChange("en", field, value)}
                  />
                </TabsContent>
                
                <TabsContent value="zh" className="pt-4">
                  <UserAutoReplyTemplate 
                    replyTemplate={settings.userAutoReply.zh}
                    language="zh"
                    onReplyChange={(field, value) => handleUserAutoReplyChange("zh", field, value)}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSettingsManager;
