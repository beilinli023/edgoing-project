
import React, { useState } from "react";
import FrontendLayout from "@/components/frontend/FrontendLayout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ContactPage = () => {
  const { currentLanguage } = useLanguage();
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
    programTypes: [] as string[],
    destinations: [] as string[],
    learningInterests: [] as string[],
    message: "",
    agreeToReceiveInfo: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };

  const handleAgreementChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToReceiveInfo: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success(currentLanguage === 'zh' 
      ? '表单已提交，我们将很快与您联系！' 
      : 'Form submitted! We will contact you soon!');
    // Here you would typically send the data to your backend
  };

  const programTypeOptions = [
    { id: 'short-term', label: currentLanguage === 'zh' ? '短期学习' : 'Short-term Study' },
    { id: 'semester', label: currentLanguage === 'zh' ? '学期交换' : 'Semester Exchange' },
    { id: 'degree', label: currentLanguage === 'zh' ? '学位课程' : 'Degree Program' },
    { id: 'summer-camp', label: currentLanguage === 'zh' ? '夏令营' : 'Summer Camp' },
    { id: 'winter-camp', label: currentLanguage === 'zh' ? '冬令营' : 'Winter Camp' },
    { id: 'language', label: currentLanguage === 'zh' ? '语言课程' : 'Language Course' },
    { id: 'other-program', label: currentLanguage === 'zh' ? '其他' : 'Other' },
  ];

  const destinationOptions = [
    { id: 'usa', label: currentLanguage === 'zh' ? '美国' : 'USA' },
    { id: 'uk', label: currentLanguage === 'zh' ? '英国' : 'UK' },
    { id: 'canada', label: currentLanguage === 'zh' ? '加拿大' : 'Canada' },
    { id: 'australia', label: currentLanguage === 'zh' ? '澳大利亚' : 'Australia' },
    { id: 'new-zealand', label: currentLanguage === 'zh' ? '新西兰' : 'New Zealand' },
    { id: 'japan', label: currentLanguage === 'zh' ? '日本' : 'Japan' },
    { id: 'singapore', label: currentLanguage === 'zh' ? '新加坡' : 'Singapore' },
    { id: 'other-destination', label: currentLanguage === 'zh' ? '其他' : 'Other' },
  ];

  const learningInterestOptions = [
    { id: 'history', label: currentLanguage === 'zh' ? '历史与文化' : 'History & Civics' },
    { id: 'stem', label: currentLanguage === 'zh' ? '科学技术' : 'STEM/Science' },
    { id: 'cultural', label: currentLanguage === 'zh' ? '文化探索' : 'Cultural Exploration' },
    { id: 'religion', label: currentLanguage === 'zh' ? '宗教与信仰' : 'Religion & Faith' },
    { id: 'performing', label: currentLanguage === 'zh' ? '表演艺术' : 'Performing Arts' },
    { id: 'language-intensive', label: currentLanguage === 'zh' ? '语言强化' : 'Language Intensive' },
    { id: 'community', label: currentLanguage === 'zh' ? '社区参与' : 'Community Engagement' },
    { id: 'sports', label: currentLanguage === 'zh' ? '体育运动' : 'Sports' },
    { id: 'specialty', label: currentLanguage === 'zh' ? '特色课程' : 'Specialty' },
    { id: 'academic', label: currentLanguage === 'zh' ? '学术研究' : 'Academic' },
    { id: 'others', label: currentLanguage === 'zh' ? '其他' : 'Others' },
  ];

  return (
    <FrontendLayout>
      {/* Hero Banner */}
      <div 
        className="bg-gray-500 bg-blend-overlay bg-opacity-50 py-16 text-white text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/e826f22e-e4f5-4026-8074-2f4d5c03e2ec.png')" }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {currentLanguage === 'zh' ? '开始您的规划' : 'Start Your Planning'}
          </h1>
          <p className="max-w-2xl mx-auto">
            {currentLanguage === 'zh' 
              ? '准备开始您的教育旅程？让我们帮助您创建完美的海外学习体验。' 
              : 'Ready to begin your educational journey? Let us help you create the perfect study abroad experience.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto py-10 px-4">
        {/* Introduction section */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-lg font-medium mb-2">
            {currentLanguage === 'zh' 
              ? '需要帮助或有任何问题？' 
              : 'Need help with assistance, or just have a question for us?'}
          </h2>
          <p className="text-gray-600 mb-2">
            {currentLanguage === 'zh' 
              ? '填写我们的表单，我们将在2个工作日内回复。' 
              : 'Fill out our form and we\'ll respond within 2 business days.'}
          </p>
          <p className="text-gray-600">
            {currentLanguage === 'zh' 
              ? '或致电 400-400-400' 
              : 'Or Call Us @ 400-400-400'}
          </p>
        </div>

        {/* Form */}
        <form className="max-w-3xl mx-auto" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Role Selector */}
            <div className="md:col-span-2 mb-2">
              <label htmlFor="role" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '您的角色' : 'Your Role'}<span className="text-red-500">*</span>
              </label>
              <Select 
                onValueChange={(value) => handleSelectChange('role', value)} 
                value={formData.role}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={currentLanguage === 'zh' ? '选择您的角色' : 'Select your role'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    {currentLanguage === 'zh' ? '学生' : 'Student'}
                  </SelectItem>
                  <SelectItem value="parent">
                    {currentLanguage === 'zh' ? '家长' : 'Parent'}
                  </SelectItem>
                  <SelectItem value="teacher">
                    {currentLanguage === 'zh' ? '教师' : 'Teacher'}
                  </SelectItem>
                  <SelectItem value="school">
                    {currentLanguage === 'zh' ? '学校管理者' : 'School Administrator'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name Fields */}
            <div>
              <label htmlFor="firstName" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '名字' : 'First Name'}<span className="text-red-500">*</span>
              </label>
              <Input
                id="firstName"
                name="firstName"
                placeholder={currentLanguage === 'zh' ? '输入您的名字' : 'Enter your first name'}
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '姓氏' : 'Last Name'}<span className="text-red-500">*</span>
              </label>
              <Input
                id="lastName"
                name="lastName"
                placeholder={currentLanguage === 'zh' ? '输入您的姓氏' : 'Enter your last name'}
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Contact Fields */}
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '邮箱' : 'Email'}<span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={currentLanguage === 'zh' ? '输入您的邮箱地址' : 'Enter your email address'}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '电话号码' : 'Phone Number'}<span className="text-red-500">*</span>
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder={currentLanguage === 'zh' ? '输入您的电话号码' : 'Enter your phone number'}
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* School Info */}
            <div className="md:col-span-2">
              <label htmlFor="schoolName" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '学校名称' : 'School Name'}
              </label>
              <Input
                id="schoolName"
                name="schoolName"
                placeholder={currentLanguage === 'zh' ? '输入您的学校名称（可选）' : 'Enter your school name (optional)'}
                value={formData.schoolName}
                onChange={handleInputChange}
              />
            </div>

            {/* Grade Level */}
            <div className="md:col-span-2">
              <label htmlFor="gradeLevel" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '年级水平' : 'Grade Level'}<span className="text-red-500">*</span>
              </label>
              <Select 
                onValueChange={(value) => handleSelectChange('gradeLevel', value)} 
                value={formData.gradeLevel}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={currentLanguage === 'zh' ? '选择您的年级水平' : 'Select your grade level'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elementary">
                    {currentLanguage === 'zh' ? '小学' : 'Elementary School'}
                  </SelectItem>
                  <SelectItem value="middle">
                    {currentLanguage === 'zh' ? '初中' : 'Middle School'}
                  </SelectItem>
                  <SelectItem value="high">
                    {currentLanguage === 'zh' ? '高中' : 'High School'}
                  </SelectItem>
                  <SelectItem value="college">
                    {currentLanguage === 'zh' ? '大学' : 'College/University'}
                  </SelectItem>
                  <SelectItem value="graduate">
                    {currentLanguage === 'zh' ? '研究生' : 'Graduate School'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="province" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '省份' : 'Province'}
              </label>
              <Select 
                onValueChange={(value) => handleSelectChange('province', value)} 
                value={formData.province}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={currentLanguage === 'zh' ? '选择您的省份' : 'Select your province'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beijing">
                    {currentLanguage === 'zh' ? '北京' : 'Beijing'}
                  </SelectItem>
                  <SelectItem value="shanghai">
                    {currentLanguage === 'zh' ? '上海' : 'Shanghai'}
                  </SelectItem>
                  <SelectItem value="guangdong">
                    {currentLanguage === 'zh' ? '广东' : 'Guangdong'}
                  </SelectItem>
                  <SelectItem value="jiangsu">
                    {currentLanguage === 'zh' ? '江苏' : 'Jiangsu'}
                  </SelectItem>
                  <SelectItem value="other">
                    {currentLanguage === 'zh' ? '其他' : 'Other'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="city" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '城市' : 'City'}
              </label>
              <Select 
                onValueChange={(value) => handleSelectChange('city', value)} 
                value={formData.city}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={currentLanguage === 'zh' ? '选择您的城市' : 'Select your city'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beijing">
                    {currentLanguage === 'zh' ? '北京' : 'Beijing'}
                  </SelectItem>
                  <SelectItem value="shanghai">
                    {currentLanguage === 'zh' ? '上海' : 'Shanghai'}
                  </SelectItem>
                  <SelectItem value="guangzhou">
                    {currentLanguage === 'zh' ? '广州' : 'Guangzhou'}
                  </SelectItem>
                  <SelectItem value="shenzhen">
                    {currentLanguage === 'zh' ? '深圳' : 'Shenzhen'}
                  </SelectItem>
                  <SelectItem value="other">
                    {currentLanguage === 'zh' ? '其他' : 'Other'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Program Types */}
            <div className="md:col-span-2 mb-2">
              <label className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '感兴趣的项目类型（多选）' : 'Interested Program Types (Multiple Choice)'}<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {programTypeOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`program-${option.id}`} 
                      checked={formData.programTypes.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleCheckboxChange('programTypes', option.id);
                        } else {
                          handleCheckboxChange('programTypes', option.id);
                        }
                      }}
                    />
                    <label htmlFor={`program-${option.id}`} className="text-sm font-normal">{option.label}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Destinations */}
            <div className="md:col-span-2 mb-2">
              <label className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '首选目的地（多选）' : 'Preferred Destinations (Multiple Choice)'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {destinationOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`destination-${option.id}`} 
                      checked={formData.destinations.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleCheckboxChange('destinations', option.id);
                        } else {
                          handleCheckboxChange('destinations', option.id);
                        }
                      }}
                    />
                    <label htmlFor={`destination-${option.id}`} className="text-sm font-normal">{option.label}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Interests */}
            <div className="md:col-span-2 mb-2">
              <label className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '我想学习的内容' : 'I WANT TO LEARN ABOUT+'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {learningInterestOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`interest-${option.id}`} 
                      checked={formData.learningInterests.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleCheckboxChange('learningInterests', option.id);
                        } else {
                          handleCheckboxChange('learningInterests', option.id);
                        }
                      }}
                    />
                    <label htmlFor={`interest-${option.id}`} className="text-sm font-normal">{option.label}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="md:col-span-2 mb-2">
              <label htmlFor="message" className="block mb-2 font-medium">
                {currentLanguage === 'zh' ? '您的问题或需求' : 'Your Questions or Requirements'}
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder={currentLanguage === 'zh' ? '请描述您的具体需求或问题' : 'Please describe your specific needs or questions'}
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full"
              />
            </div>

            {/* Agreement */}
            <div className="md:col-span-2 mb-6">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="agree" 
                  checked={formData.agreeToReceiveInfo}
                  onCheckedChange={(checked) => {
                    handleAgreementChange(checked === true);
                  }}
                />
                <label htmlFor="agree" className="text-sm">
                  {currentLanguage === 'zh' 
                    ? '我同意接收来自EdGoing的教育信息和活动通知。我理解我可以随时取消订阅。' 
                    : 'I agree to receive educational information and activity notifications from EdGoing. I understand that I can unsubscribe at any time.'}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 text-center">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
                {currentLanguage === 'zh' ? '提交' : 'Submit'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </FrontendLayout>
  );
};

export default ContactPage;
