import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Inbox,
  Search,
  Eye,
  CheckCircle,
  DownloadCloud,
  Mail,
  Filter,
  XCircle,
  Trash2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import FormSubmissionDetail from "./FormSubmissionDetail";
import AdminPasswordDialog from "@/components/common/AdminPasswordDialog";

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

const mockSubmissions: FormSubmission[] = [
  {
    id: "s1",
    name: "张三",
    email: "zhangsan@example.com",
    role: "家长",
    programType: "学术研究",
    destination: "美国",
    grade: "高中",
    interests: ["科学与技术", "商业与经济"],
    message: "我想了解更多关于美国高中交换项目的信息。",
    status: "new",
    submittedAt: "2023-10-25T08:30:00Z"
  },
  {
    id: "s2",
    name: "李四",
    email: "lisi@example.com",
    role: "学生",
    programType: "文化体验",
    destination: "英国",
    grade: "初中",
    interests: ["艺术与设计"],
    message: "希望能在暑假参加英国的文化体验项目。",
    status: "contacted",
    submittedAt: "2023-10-20T15:45:00Z"
  },
  {
    id: "s3",
    name: "王五",
    email: "wangwu@example.com",
    role: "教师",
    programType: "语言学习",
    destination: "加拿大",
    grade: "小学4-6年级",
    interests: ["语言学习", "文化体验"],
    message: "我们学校想组织一个暑期语言学习项目，希望了解更多信息。",
    status: "completed",
    submittedAt: "2023-10-15T10:15:00Z"
  },
];

const statusColors = {
  new: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  contacted: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  canceled: "bg-red-100 text-red-800 hover:bg-red-100"
};

const statusLabels = {
  new: "新提交",
  contacted: "已联系",
  completed: "已完成",
  canceled: "已取消"
};

const FormSubmissionsManager = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>(mockSubmissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewSubmission = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setShowDetail(true);
  };

  const handleUpdateStatus = (id: string, status: "new" | "contacted" | "completed" | "canceled") => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status } : sub
    ));
    
    toast({
      title: "状态已更新",
      description: `表单状态已更新为: ${statusLabels[status]}`
    });
  };

  const promptPasswordForDelete = (id: string) => {
    setSubmissionToDelete(id);
    setIsPasswordDialogOpen(true);
  };

  const confirmDelete = () => {
    if (submissionToDelete) {
      handleDeleteSubmission(submissionToDelete);
    }
  };

  const handleDeleteSubmission = (id: string) => {
    const submission = submissions.find(s => s.id === id);
    setSubmissions(submissions.filter(s => s.id !== id));
    
    toast({
      title: "删除成功",
      description: `已删除 ${submission?.name} 的表单提交`
    });
    
    setSubmissionToDelete(null);
    
    if (selectedSubmission?.id === id) {
      setShowDetail(false);
      setSelectedSubmission(null);
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  const handleExportData = () => {
    toast({
      title: "导出成功",
      description: "表单数据已导出为CSV文件"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center flex-grow">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索名称、邮箱或内容..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-[140px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="new">新提交</SelectItem>
                <SelectItem value="contacted">已联系</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="canceled">已取消</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={handleExportData}>
          <DownloadCloud className="mr-2 h-4 w-4" />
          导出数据
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>提交人</TableHead>
              <TableHead className="hidden md:table-cell">提交时间</TableHead>
              <TableHead className="hidden md:table-cell">角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Inbox className="h-8 w-8 mb-2" />
                    <h3 className="font-medium">没有找到表单提交记录</h3>
                    <p className="text-sm">尝试使用其他搜索条件或清除筛选器</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="font-medium">{submission.name}</div>
                    <div className="text-sm text-muted-foreground">{submission.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(submission.submittedAt).toLocaleString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{submission.role}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={statusColors[submission.status]}
                    >
                      {statusLabels[submission.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast({ title: "邮件已发送", description: `已向 ${submission.email} 发送邮件` })}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      {submission.status !== "completed" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateStatus(submission.id, "completed")}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {submission.status !== "canceled" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateStatus(submission.id, "canceled")}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => promptPasswordForDelete(submission.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showDetail && selectedSubmission && (
        <FormSubmissionDetail
          submission={selectedSubmission}
          onClose={handleCloseDetail}
          onStatusChange={(status) => {
            handleUpdateStatus(selectedSubmission.id, status);
            setSelectedSubmission({ ...selectedSubmission, status });
          }}
        />
      )}

      <AdminPasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        onConfirm={confirmDelete}
        title="验证删除权限"
        description="删除表单记录需要超级管理员权限，请输入密码继续"
        confirmLabel="确认删除"
      />
    </div>
  );
};

export default FormSubmissionsManager;
