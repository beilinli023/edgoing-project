
import React, { useState } from "react";
import { toast } from "sonner";
import { FormContent, usePlanningFormSubmit, PlanningFormData, FormOption } from "@/hooks/useForms";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import EducationInfoSection from "./sections/EducationInfoSection";
import ProgramInterestsSection from "./sections/ProgramInterestsSection";
import FormFooterSection from "./sections/FormFooterSection";

/**
 * 规划表单组件的属性接口
 * 
 * @interface PlanningFormProps
 * @property {FormContent} content - 表单内容配置，包含标题、描述、选项等
 * @property {string} currentLanguage - 当前语言设置，用于切换表单显示的语言（'en'或'zh'）
 */
interface PlanningFormProps {
  content: FormContent;
  currentLanguage: string;
}

/**
 * 教育规划表单组件
 * 
 * 该组件是一个多步骤的教育规划表单，用于收集用户的个人信息、教育背景和感兴趣的项目类型。
 * 表单包含多个部分，包括个人信息、教育信息、项目兴趣和隐私政策同意等。
 * 表单支持多语言，可以根据当前语言设置自动切换显示的文本。
 * 
 * @component
 * @example
 * ```tsx
 * import { PlanningForm } from '@/components/frontend/forms/PlanningForm';
 * import { useFrontendFormContent } from '@/hooks/useFrontendFormContent';
 * import { useLanguage } from '@/context/LanguageContext';
 * 
 * // 使用示例
 * function PlanningPage() {
 *   const { formContent } = useFrontendFormContent();
 *   const { currentLanguage } = useLanguage();
 *   
 *   return (
 *     <div className="container mx-auto py-8">
 *       <h1 className="text-2xl font-bold mb-6">教育规划表单</h1>
 *       <PlanningForm 
 *         content={formContent} 
 *         currentLanguage={currentLanguage} 
 *       />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @param {PlanningFormProps} props - 组件属性
 * @returns {JSX.Element} 渲染的教育规划表单
 */
const PlanningForm: React.FC<PlanningFormProps> = ({ content, currentLanguage }) => {
  // 使用 React Query 的 usePlanningFormSubmit hook 管理提交状态，不再需要本地状态
  
  // 表单状态
  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    schoolName: "",
    gradeLevel: "",
    province: "",
    city: "",
    programTypes: [] as string[],  // 存储选中项目的 id
    destinations: [] as string[],  // 存储选中目的地的 id
    interests: [] as string[],     // 存储选中兴趣的 id
    questions: "",
    agreeToReceiveInfo: false,
    agreeToPrivacyPolicy: false
  });

  // 本地化文本
  const text = {
    yourRole: currentLanguage === 'en' ? "Your Role" : "您的角色",
    firstName: currentLanguage === 'en' ? "First Name" : "名",
    lastName: currentLanguage === 'en' ? "Last Name" : "姓",
    email: currentLanguage === 'en' ? "Email" : "电子邮箱",
    phoneNumber: currentLanguage === 'en' ? "Phone Number" : "电话号码",
    schoolName: currentLanguage === 'en' ? "School Name" : "学校名称",
    gradeLevel: currentLanguage === 'en' ? "Grade Level" : "年级",
    province: currentLanguage === 'en' ? "Province" : "省份",
    city: currentLanguage === 'en' ? "City" : "城市",
    programTypes: currentLanguage === 'en' ? "Interested Program Types (Multiple Choice)" : "感兴趣的项目类型（多选）",
    destinations: currentLanguage === 'en' ? "Preferred Destinations (Multiple Choice)" : "首选目的地（多选）",
    interests: currentLanguage === 'en' ? "I WANT TO LEARN ABOUT" : "感兴趣的项目",
    questions: currentLanguage === 'en' ? "Your Questions or Requirements" : "您的问题或要求",
    questionsPlaceholder: currentLanguage === 'en' ? "Please describe your specific needs or questions" : "请描述您的具体需求或问题",
    agreeToReceive: currentLanguage === 'en' 
      ? "I agree to receive educational information and activity notifications from EdGoing. I understand that I can unsubscribe at any time." 
      : "我同意接收来自EdGoing的教育信息和活动通知。我了解我可以随时取消订阅。",
    privacyPolicy: currentLanguage === 'en'
      ? "I have read and agree to the Privacy Policy"
      : "我已阅读并同意隐私政策",
    submitButton: currentLanguage === 'en' ? "Submit" : "提交",
    selectYourRole: currentLanguage === 'en' ? "Select your role" : "选择您的角色",
    selectYourGradeLevel: currentLanguage === 'en' ? "Select your grade level" : "选择您的年级",
    selectYourProvince: currentLanguage === 'en' ? "Select your province" : "选择您的省份",
    selectYourCity: currentLanguage === 'en' ? "Select your city" : "选择您的城市",
    submitting: currentLanguage === 'en' ? "Submitting..." : "提交中..."
  };

  // 处理文本输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理选择框变化
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理复选框变化
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = [...(prev[field as keyof typeof prev] as string[])];
      
      if (checked) {
        // 当选中时，添加选项的 id
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        // 当取消选中时，移除选项的 id
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      }
    });
  };

  // 处理同意接收信息复选框
  const handleAgreeChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToReceiveInfo: checked }));
  };

  // 处理隐私政策同意复选框
  const handlePrivacyPolicyChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToPrivacyPolicy: checked }));
  };

  // 使用 React Query 的 usePlanningFormSubmit hook 处理表单提交
  const { mutate, isPending: isSubmitting } = usePlanningFormSubmit(currentLanguage);

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本验证
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error(currentLanguage === 'en' ? "Please fill in all required fields" : "请填写所有必填字段");
      return;
    }

    // 验证隐私政策是否勾选
    if (!formData.agreeToPrivacyPolicy) {
      toast.error(
        currentLanguage === 'en' 
          ? "You must agree to the Privacy Policy to submit the form" 
          : "您必须同意隐私政策才能提交表单"
      );
      return;
    }
    
    // 使用 mutate 提交表单
    mutate(formData, {
      onSuccess: () => {
        // 成功提交后重置表单
        setFormData({
          role: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          schoolName: "",
          gradeLevel: "",
          province: "",
          city: "",
          programTypes: [],
          destinations: [],
          interests: [],
          questions: "",
          agreeToReceiveInfo: false,
          agreeToPrivacyPolicy: false
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 个人信息部分 */}
      <PersonalInfoSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        roles={content.options.roles}
        text={text}
        currentLanguage={currentLanguage}
      />

      {/* 教育信息部分 */}
      <EducationInfoSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        gradeLevels={content.options.gradeLevels || []}
        provinces={content.options.provinces || []}
        cities={content.options.cities || []}
        text={text}
        currentLanguage={currentLanguage}
      />

      {/* 项目兴趣部分 */}
      <ProgramInterestsSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        options={content.options}
        text={text}
      />

      {/* 表单底部部分 */}
      <FormFooterSection 
        formData={formData}
        handleAgreeChange={handleAgreeChange}
        handlePrivacyPolicyChange={handlePrivacyPolicyChange}
        isSubmitting={isSubmitting}
        text={text}
        currentLanguage={currentLanguage}
      />
    </form>
  );
};

export default PlanningForm;
