
import { useParams, useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import FaqForm from "@/components/faq/FaqForm";
import { toast } from "@/components/ui/use-toast";

// 模拟FAQ详情数据
const faqDetail = {
  id: "1",
  questionZh: "如何申请国际学校项目？",
  questionEn: "How to apply for international school programs?",
  answerZh: "<p>申请国际学校项目首先需要填写在线申请表格，然后提交必要的文件，包括成绩单、推荐信和个人陈述等。提交完成后，我们的团队将审核您的申请并在两周内给予回复。</p>",
  answerEn: "<p>To apply for international school programs, you first need to complete an online application form and submit necessary documents including transcripts, recommendation letters, and personal statements. After submission, our team will review your application and respond within two weeks.</p>",
  order: 1,
  status: "已发布",
  isHot: true
};

const FaqEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const handleSave = () => {
    // In a real application, this would save to the backend
    toast({
      title: isEditing ? "FAQ更新成功" : "FAQ创建成功",
      description: isEditing 
        ? "常见问题已成功更新" 
        : "新的常见问题已成功创建",
    });
    navigate("/admin/faq");
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader 
        title={isEditing ? "编辑FAQ" : "添加FAQ"} 
        description={isEditing ? "更新常见问题与解答" : "创建新的常见问题与解答"}
        backUrl="/admin/faq"
        actions={
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        }
      />

      <FaqForm 
        initialData={isEditing ? faqDetail : undefined}
        isEditing={isEditing}
      />
    </div>
  );
};

export default FaqEdit;
