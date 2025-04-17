
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Plus,
  PenLine,
  Trash2,
  Mail,
  FileText,
  Send,
  Copy,
  Eye,
  Save,
  Languages
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// 邮件模板接口
interface EmailTemplate {
  id: number;
  name: string;
  type: "newsletter" | "promotion" | "announcement" | "notification";
  subject: {
    en: string;
    zh: string;
  };
  content: {
    en: string;
    zh: string;
  };
  createdAt: string;
  updatedAt: string;
  lastSentAt: string | null;
}

// 模拟数据
const mockTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "月度项目更新",
    type: "newsletter",
    subject: {
      en: "Monthly Program Updates from YouNiKco",
      zh: "YouNiKco每月项目更新"
    },
    content: {
      en: "Dear {{name}},\n\nHere are our latest program updates for this month:\n\n- New Summer Programs\n- Application Deadlines\n- Featured Student Stories\n\nCheck out all the details on our website.\n\nBest regards,\nYouNiKco Team",
      zh: "尊敬的 {{name}}，\n\n以下是我们本月的最新项目更新：\n\n- 新的夏季项目\n- 申请截止日期\n- 精选学生故事\n\n请访问我们的网站查看所有详情。\n\n此致，\nYouNiKco团队"
    },
    createdAt: "2023-09-15T10:30:00Z",
    updatedAt: "2023-10-20T14:15:00Z",
    lastSentAt: "2023-11-01T09:00:00Z"
  },
  {
    id: 2,
    name: "新项目公告",
    type: "announcement",
    subject: {
      en: "Exciting New Programs at YouNiKco",
      zh: "YouNiKco令人兴奋的新项目"
    },
    content: {
      en: "Hello {{name}},\n\nWe're thrilled to announce our new international education programs for the upcoming season.\n\nHighlights include:\n- Art & Design in Paris\n- STEM Research in Boston\n- Cultural Exchange in Tokyo\n\nEarly applications open next week!\n\nBest regards,\nYouNiKco Team",
      zh: "您好，{{name}}，\n\n我们很高兴地宣布我们为即将到来的季节推出的新国际教育项目。\n\n亮点包括：\n- 巴黎艺术与设计\n- 波士顿STEM研究\n- 东京文化交流\n\n提前申请将于下周开放！\n\n此致，\nYouNiKco团队"
    },
    createdAt: "2023-10-05T08:45:00Z",
    updatedAt: "2023-10-05T08:45:00Z",
    lastSentAt: null
  },
  {
    id: 3,
    name: "假期特别优惠",
    type: "promotion",
    subject: {
      en: "Holiday Special Offers - Limited Time",
      zh: "假期特别优惠 - 限时"
    },
    content: {
      en: "Dear {{name}},\n\nThis holiday season, we're offering special discounts on selected educational programs.\n\nBook before December 31st to receive:\n- 15% off on Summer Programs\n- Free application fee waiver\n- Exclusive webinar access\n\nVisit our website for more details!\n\nHappy Holidays,\nYouNiKco Team",
      zh: "亲爱的 {{name}}，\n\n这个假期，我们为精选教育项目提供特别折扣。\n\n在12月31日前预订，即可获得：\n- 夏季项目15%的折扣\n- 免申请费\n- 专属网络研讨会访问权限\n\n请访问我们的网站了解更多详情！\n\n节日快乐，\nYouNiKco团队"
    },
    createdAt: "2023-11-10T13:20:00Z",
    updatedAt: "2023-11-10T13:20:00Z",
    lastSentAt: null
  }
];

// 可用变量
const availableVariables = [
  { key: "name", description: "订阅者姓名" },
  { key: "email", description: "订阅者邮箱" },
  { key: "date", description: "当前日期" },
  { key: "unsubscribe_link", description: "退订链接" }
];

const SubscriptionTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [editMode, setEditMode] = useState<"new" | "edit">("new");
  const [languageTab, setLanguageTab] = useState<"en" | "zh">("en");
  
  // 编辑表单状态
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState<string>("newsletter");
  const [subjectEn, setSubjectEn] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [subjectZh, setSubjectZh] = useState("");
  const [contentZh, setContentZh] = useState("");

  // 初始化新模板
  const initNewTemplate = () => {
    setEditMode("new");
    setTemplateName("");
    setTemplateType("newsletter");
    setSubjectEn("");
    setContentEn("");
    setSubjectZh("");
    setContentZh("");
    setLanguageTab("en");
    setCurrentTemplate(null);
    setIsDialogOpen(true);
  };

  // 编辑现有模板
  const handleEditTemplate = (template: EmailTemplate) => {
    setEditMode("edit");
    setTemplateName(template.name);
    setTemplateType(template.type);
    setSubjectEn(template.subject.en);
    setContentEn(template.content.en);
    setSubjectZh(template.subject.zh);
    setContentZh(template.content.zh);
    setLanguageTab("en");
    setCurrentTemplate(template);
    setIsDialogOpen(true);
  };

  // 复制模板
  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Math.max(...templates.map(t => t.id)) + 1,
      name: `${template.name} (副本)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSentAt: null
    };
    
    setTemplates([...templates, newTemplate]);
    
    toast({
      title: "模板已复制",
      description: `已创建 "${template.name}" 的副本`
    });
  };

  // 删除模板
  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter(template => template.id !== id));
    
    toast({
      title: "模板已删除",
      description: "邮件模板已成功删除"
    });
  };

  // 保存模板
  const handleSaveTemplate = () => {
    if (!templateName) {
      toast({
        title: "无法保存",
        description: "请输入模板名称",
        variant: "destructive"
      });
      return;
    }

    if (!subjectEn || !contentEn || !subjectZh || !contentZh) {
      toast({
        title: "无法保存",
        description: "请确保中英文的主题和内容都已填写",
        variant: "destructive"
      });
      return;
    }

    if (editMode === "new") {
      // 创建新模板
      const newTemplate: EmailTemplate = {
        id: templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1,
        name: templateName,
        type: templateType as any,
        subject: {
          en: subjectEn,
          zh: subjectZh
        },
        content: {
          en: contentEn,
          zh: contentZh
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastSentAt: null
      };
      
      setTemplates([...templates, newTemplate]);
      
      toast({
        title: "模板已创建",
        description: "新邮件模板已成功创建"
      });
    } else {
      // 更新现有模板
      if (!currentTemplate) return;
      
      const updatedTemplates = templates.map(template => 
        template.id === currentTemplate.id
          ? {
              ...template,
              name: templateName,
              type: templateType as any,
              subject: {
                en: subjectEn,
                zh: subjectZh
              },
              content: {
                en: contentEn,
                zh: contentZh
              },
              updatedAt: new Date().toISOString()
            }
          : template
      );
      
      setTemplates(updatedTemplates);
      
      toast({
        title: "模板已更新",
        description: "邮件模板已成功更新"
      });
    }
    
    setIsDialogOpen(false);
  };

  // 渲染模板类型标签
  const renderTypeLabel = (type: string) => {
    switch (type) {
      case "newsletter":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">通讯</Badge>;
      case "promotion":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">推广</Badge>;
      case "announcement":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">公告</Badge>;
      case "notification":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">通知</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 插入变量到当前焦点位置
  const insertVariable = (variable: string) => {
    const textAreaId = languageTab === "en" ? "content-en" : "content-zh";
    const textArea = document.getElementById(textAreaId) as HTMLTextAreaElement;
    
    if (textArea) {
      const startPos = textArea.selectionStart;
      const endPos = textArea.selectionEnd;
      const text = languageTab === "en" ? contentEn : contentZh;
      const before = text.substring(0, startPos);
      const after = text.substring(endPos);
      const newText = before + `{{${variable}}}` + after;
      
      if (languageTab === "en") {
        setContentEn(newText);
      } else {
        setContentZh(newText);
      }
      
      // 聚焦并设置光标位置
      setTimeout(() => {
        textArea.focus();
        const newCursorPos = startPos + variable.length + 4; // +4 for {{}}
        textArea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          邮件模板
        </h2>
        <Button onClick={initNewTemplate}>
          <Plus className="mr-2 h-4 w-4" />
          创建新模板
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Mail className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">没有邮件模板</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              创建你的第一个邮件模板用于向订阅者发送通讯、公告或推广信息
            </p>
            <Button onClick={initNewTemplate}>
              <Plus className="mr-2 h-4 w-4" />
              创建新模板
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {renderTypeLabel(template.type)}
                      <span className="text-xs text-muted-foreground">
                        更新于 {formatDate(template.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            你确定要删除 "{template.name}" 模板吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">EN</span>
                      主题
                    </h4>
                    <p className="text-sm text-muted-foreground overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {template.subject.en}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">ZH</span>
                      主题
                    </h4>
                    <p className="text-sm text-muted-foreground overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {template.subject.zh}
                    </p>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {template.lastSentAt 
                          ? `上次发送: ${formatDate(template.lastSentAt)}`
                          : "尚未发送"}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        查看内容
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 模板编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editMode === "new" ? "创建新模板" : "编辑模板"}</DialogTitle>
            <DialogDescription>
              创建或编辑邮件模板，支持中英文双语版本
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="template-name">模板名称</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="输入模板名称"
                />
              </div>
              <div>
                <Label htmlFor="template-type">模板类型</Label>
                <Select
                  value={templateType}
                  onValueChange={setTemplateType}
                >
                  <SelectTrigger id="template-type">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">通讯</SelectItem>
                    <SelectItem value="promotion">推广</SelectItem>
                    <SelectItem value="announcement">公告</SelectItem>
                    <SelectItem value="notification">通知</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">模板内容</h3>
                <div className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-normal text-muted-foreground">必须提供中英文版本</span>
                </div>
              </div>
              
              <Tabs value={languageTab} onValueChange={(value) => setLanguageTab(value as "en" | "zh")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="en">英文模板</TabsTrigger>
                  <TabsTrigger value="zh">中文模板</TabsTrigger>
                </TabsList>
                
                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label htmlFor="subject-en">Email Subject</Label>
                    <Input
                      id="subject-en"
                      value={subjectEn}
                      onChange={(e) => setSubjectEn(e.target.value)}
                      placeholder="Enter email subject line"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="content-en">Email Content</Label>
                      <div className="flex flex-wrap gap-1">
                        {availableVariables.map((variable) => (
                          <Badge
                            key={variable.key}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => insertVariable(variable.key)}
                          >
                            {`{{${variable.key}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      id="content-en"
                      value={contentEn}
                      onChange={(e) => setContentEn(e.target.value)}
                      placeholder="Enter email content"
                      rows={12}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="zh" className="space-y-4">
                  <div>
                    <Label htmlFor="subject-zh">邮件主题</Label>
                    <Input
                      id="subject-zh"
                      value={subjectZh}
                      onChange={(e) => setSubjectZh(e.target.value)}
                      placeholder="输入邮件主题行"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="content-zh">邮件内容</Label>
                      <div className="flex flex-wrap gap-1">
                        {availableVariables.map((variable) => (
                          <Badge
                            key={variable.key}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => insertVariable(variable.key)}
                          >
                            {`{{${variable.key}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      id="content-zh"
                      value={contentZh}
                      onChange={(e) => setContentZh(e.target.value)}
                      placeholder="输入邮件内容"
                      rows={12}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Save className="mr-2 h-4 w-4" />
              保存模板
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionTemplates;
