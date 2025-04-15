
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import FaqChineseContent from "./FaqChineseContent";
import FaqEnglishContent from "./FaqEnglishContent";
import FaqSettings from "./FaqSettings";
import { useFaqForm } from "@/hooks/useFaqForm";
import { FaqData } from "./types";

interface FaqFormProps {
  initialData?: FaqData;
  isEditing: boolean;
}

const FaqForm = ({ initialData, isEditing }: FaqFormProps) => {
  const {
    faq,
    activeTab,
    setActiveTab,
    handleQuestionChange,
    handleAnswerChange,
    handleSettingsChange,
    handleSave
  } = useFaqForm({ initialData, isEditing });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "保存更改" : "创建FAQ"}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="chinese">中文内容</TabsTrigger>
          <TabsTrigger value="english">英文内容</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        <TabsContent value="chinese" className="space-y-4">
          <FaqChineseContent 
            questionZh={faq.questionZh}
            answerZh={faq.answerZh}
            onQuestionChange={(value) => handleQuestionChange("zh", value)}
            onAnswerChange={(value) => handleAnswerChange("zh", value)}
          />
        </TabsContent>

        <TabsContent value="english" className="space-y-4">
          <FaqEnglishContent 
            questionEn={faq.questionEn}
            answerEn={faq.answerEn}
            onQuestionChange={(value) => handleQuestionChange("en", value)}
            onAnswerChange={(value) => handleAnswerChange("en", value)}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <FaqSettings 
            order={faq.order}
            status={faq.status}
            isHot={faq.isHot}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FaqForm;
