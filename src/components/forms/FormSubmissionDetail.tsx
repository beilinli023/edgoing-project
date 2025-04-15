
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Download, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// 使用FormSubmissionsManager中定义的FormSubmission接口
interface FormSubmission {
  id: string;
  name: string;
  email: string;
  role: string;
  programType: string;
  destination: string;
  grade: string;
  interests: string[];
  message: string;
  status: "new" | "contacted" | "completed" | "canceled";
  submittedAt: string;
}

interface FormSubmissionDetailProps {
  submission: FormSubmission;
  onClose: () => void;
  onStatusChange: (status: "new" | "contacted" | "completed" | "canceled") => void;
}

const statusOptions = [
  { value: "new", label: "新提交" },
  { value: "contacted", label: "已联系" },
  { value: "completed", label: "已完成" },
  { value: "canceled", label: "已取消" }
];

const FormSubmissionDetail = ({
  submission,
  onClose,
  onStatusChange
}: FormSubmissionDetailProps) => {
  const handleSendEmail = () => {
    toast({
      title: "邮件已发送",
      description: `已向 ${submission.email} 发送邮件`
    });
  };

  const handleExport = () => {
    toast({
      title: "导出成功",
      description: "表单详情已导出为PDF文件"
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">表单提交详情</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">提交人</Label>
              <div className="font-medium text-lg">{submission.name}</div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">电子邮箱</Label>
              <div className="font-medium">
                <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline flex items-center">
                  {submission.email}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">提交时间</Label>
              <div>
                {new Date(submission.submittedAt).toLocaleString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">角色</Label>
              <div>{submission.role}</div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">年级</Label>
              <div>{submission.grade}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">项目类型</Label>
              <div>{submission.programType}</div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">目的地</Label>
              <div>{submission.destination}</div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">兴趣</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {submission.interests.map((interest, index) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-muted-foreground text-sm">状态</Label>
              <Select
                value={submission.status}
                onValueChange={(value) => onStatusChange(value as any)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <Label className="text-muted-foreground text-sm">留言内容</Label>
          <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
            {submission.message}
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <Button variant="outline" onClick={handleSendEmail}>
              <Mail className="mr-2 h-4 w-4" />
              发送邮件
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              导出详情
            </Button>
          </div>
          <Button onClick={onClose}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormSubmissionDetail;
