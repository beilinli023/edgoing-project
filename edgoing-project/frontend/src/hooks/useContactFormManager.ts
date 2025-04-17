
import { useState } from "react";
import { FormOption, FormIntroText, FormResponseTime } from "@/types/contactFormTypes";
import { toast } from "sonner";

// Mock data for options
const mockProgramTypes: FormOption[] = [
  { id: "short-term", text_en: "Short-term Study", text_zh: "短期学习", enabled: true, order: 1 },
  { id: "semester", text_en: "Semester Exchange", text_zh: "学期交换", enabled: true, order: 2 },
  { id: "degree", text_en: "Degree Program", text_zh: "学位课程", enabled: true, order: 3 },
  { id: "summer-camp", text_en: "Summer Camp", text_zh: "夏令营", enabled: true, order: 4 },
  { id: "winter-camp", text_en: "Winter Camp", text_zh: "冬令营", enabled: true, order: 5 },
  { id: "language", text_en: "Language Course", text_zh: "语言课程", enabled: true, order: 6 },
  { id: "other-program", text_en: "Other", text_zh: "其他", enabled: true, order: 7 },
];

const mockDestinations: FormOption[] = [
  { id: "usa", text_en: "USA", text_zh: "美国", enabled: true, order: 1 },
  { id: "uk", text_en: "UK", text_zh: "英国", enabled: true, order: 2 },
  { id: "canada", text_en: "Canada", text_zh: "加拿大", enabled: true, order: 3 },
  { id: "australia", text_en: "Australia", text_zh: "澳大利亚", enabled: true, order: 4 },
  { id: "new-zealand", text_en: "New Zealand", text_zh: "新西兰", enabled: true, order: 5 },
  { id: "japan", text_en: "Japan", text_zh: "日本", enabled: true, order: 6 },
  { id: "singapore", text_en: "Singapore", text_zh: "新加坡", enabled: true, order: 7 },
  { id: "other-destination", text_en: "Other", text_zh: "其他", enabled: true, order: 8 },
];

const mockLearningInterests: FormOption[] = [
  { id: "history", text_en: "History & Civics", text_zh: "历史与文化", enabled: true, order: 1 },
  { id: "stem", text_en: "STEM/Science", text_zh: "科学技术", enabled: true, order: 2 },
  { id: "cultural", text_en: "Cultural Exploration", text_zh: "文化探索", enabled: true, order: 3 },
  { id: "religion", text_en: "Religion & Faith", text_zh: "宗教与信仰", enabled: true, order: 4 },
  { id: "performing", text_en: "Performing Arts", text_zh: "表演艺术", enabled: true, order: 5 },
  { id: "language-intensive", text_en: "Language Intensive", text_zh: "语言强化", enabled: true, order: 6 },
  { id: "community", text_en: "Community Engagement", text_zh: "社区参与", enabled: true, order: 7 },
  { id: "sports", text_en: "Sports", text_zh: "体育运动", enabled: true, order: 8 },
  { id: "specialty", text_en: "Specialty", text_zh: "特色课程", enabled: true, order: 9 },
  { id: "academic", text_en: "Academic", text_zh: "学术研究", enabled: true, order: 10 },
  { id: "others", text_en: "Others", text_zh: "其他", enabled: true, order: 11 },
];

export const useContactFormManager = () => {
  const [activeTab, setActiveTab] = useState("program-types");
  const [programTypes, setProgramTypes] = useState<FormOption[]>(mockProgramTypes);
  const [destinations, setDestinations] = useState<FormOption[]>(mockDestinations);
  const [learningInterests, setLearningInterests] = useState<FormOption[]>(mockLearningInterests);
  const [introText, setIntroText] = useState<FormIntroText>({
    en: "Need help with assistance, or just have a question for us?",
    zh: "需要帮助或有任何问题？"
  });
  const [responseTime, setResponseTime] = useState<FormResponseTime>({
    en: "Fill out our form and we'll respond within 2 business days.",
    zh: "填写我们的表单，我们将在2个工作日内回复。"
  });
  const [phoneNumber, setPhoneNumber] = useState("400-400-400");
  
  const toggleOptionEnabled = (list: FormOption[], setList: React.Dispatch<React.SetStateAction<FormOption[]>>, id: string) => {
    setList(list.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const updateOptionText = (
    list: FormOption[], 
    setList: React.Dispatch<React.SetStateAction<FormOption[]>>, 
    id: string, 
    field: 'text_en' | 'text_zh', 
    value: string
  ) => {
    setList(list.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    toast.success("设置已保存", {
      description: "联系表单选项已成功更新"
    });
  };

  const addNewOption = (
    list: FormOption[], 
    setList: React.Dispatch<React.SetStateAction<FormOption[]>>,
    defaultEnName: string,
    defaultZhName: string
  ) => {
    const newId = `option-${Date.now()}`;
    const newOrder = list.length > 0 ? Math.max(...list.map(item => item.order)) + 1 : 1;
    
    setList([
      ...list, 
      { 
        id: newId, 
        text_en: defaultEnName, 
        text_zh: defaultZhName, 
        enabled: true, 
        order: newOrder 
      }
    ]);
  };

  const removeOption = (
    list: FormOption[], 
    setList: React.Dispatch<React.SetStateAction<FormOption[]>>,
    id: string
  ) => {
    setList(list.filter(item => item.id !== id));
  };

  return {
    activeTab,
    setActiveTab,
    programTypes,
    setProgramTypes,
    destinations,
    setDestinations,
    learningInterests,
    setLearningInterests,
    introText,
    setIntroText,
    responseTime,
    setResponseTime,
    phoneNumber,
    setPhoneNumber,
    toggleOptionEnabled,
    updateOptionText,
    handleSave,
    addNewOption,
    removeOption
  };
};
