
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { FaqData } from "@/components/faq/types";

interface UseFaqFormProps {
  initialData?: FaqData;
  isEditing: boolean;
}

export const useFaqForm = ({ initialData, isEditing }: UseFaqFormProps) => {
  const navigate = useNavigate();
  
  // 状态管理
  const [faq, setFaq] = useState<FaqData>(initialData || {
    questionZh: "",
    questionEn: "",
    answerZh: "",
    answerEn: "",
    order: 1,
    status: "草稿",
    isHot: false
  });
  
  const [activeTab, setActiveTab] = useState("chinese");

  const handleSave = () => {
    // 这里应该调用API保存FAQ
    toast({
      title: isEditing ? "保存成功" : "创建成功",
      description: isEditing 
        ? "FAQ已成功更新" 
        : "新的FAQ已成功创建",
    });
    navigate("/admin/faq");
  };

  const handleQuestionChange = (lang: string, value: string) => {
    if (lang === "zh") {
      setFaq(prev => ({ ...prev, questionZh: value }));
    } else {
      setFaq(prev => ({ ...prev, questionEn: value }));
    }
  };

  const handleAnswerChange = (lang: string, value: string) => {
    if (lang === "zh") {
      setFaq(prev => ({ ...prev, answerZh: value }));
    } else {
      setFaq(prev => ({ ...prev, answerEn: value }));
    }
  };

  const handleSettingsChange = (key: string, value: any) => {
    setFaq(prev => ({ ...prev, [key]: value }));
  };

  return {
    faq,
    activeTab,
    setActiveTab,
    handleQuestionChange,
    handleAnswerChange,
    handleSettingsChange,
    handleSave
  };
};
