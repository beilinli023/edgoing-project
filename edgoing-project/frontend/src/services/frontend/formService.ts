import axios from 'axios';
import type { NewsletterSubscription, NewsletterSubscriptionInput } from '@/types/newsletterTypes';
import { toast } from 'sonner';
import type { FormContent, PlanningFormData, FormOption } from '@/types/formTypes';
import { getCompatibleProvinces, getCompatibleCities } from '@/data/chinaRegions';
import subscriptionService from '@/data/subscriptions/emailSubscriptions';

// 获取表单页面内容
export const getFrontendFormContent = async (language = 'en'): Promise<FormContent | null> => {
  try {
    // 模拟API响应延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 返回模拟的表单内容
    return {
      hero: {
        title: language === 'en' ? "Start Your Planning" : "开始计划",
        subtitle: language === 'en'
          ? "Ready to begin your educational journey? Let us help you create the perfect study abroad experience."
          : "准备开始您的教育之旅？让我们帮助您创造完美的海外学习体验。",
        backgroundImage: "/lovable-uploads/47bf9bbe-157b-4ebd-8119-331c7101bce3.png",
      },
      formSection: {
        title: language === 'en' ? "Need help with assistance, or just have a question for us?" : "需要帮助或有任何问题？",
        responseTimeText: language === 'en' ? "Fill out our form and we'll respond within 2 business days." : "填写我们的表单，我们将在2个工作日内回复。",
        phoneContact: language === 'en' ? "Or Call Us @ 400-115-3558 (Email: Hello@edgoing.com)" : "或致电 400-115-3558（邮件：Hello@edgoing.com）",
      },
      options: {
        roles: [
          { id: "student", label: language === 'en' ? "Student" : "学生" },
          { id: "parent", label: language === 'en' ? "Parent" : "家长" },
          { id: "teacher", label: language === 'en' ? "Teacher" : "教师" },
          { id: "other", label: language === 'en' ? "Other" : "其他" }
        ],
        gradeLevels: [
          { id: "elementary", label: language === 'en' ? "Elementary School" : "小学" },
          { id: "middle", label: language === 'en' ? "Middle School" : "初中" },
          { id: "high", label: language === 'en' ? "High School" : "高中" },
          { id: "university", label: language === 'en' ? "University" : "大学" },
          { id: "graduate", label: language === 'en' ? "Graduate School" : "研究生" },
          { id: "other", label: language === 'en' ? "Other" : "其他" }
        ],
        // 使用从chinaRegions模块导入的数据
        provinces: getCompatibleProvinces(language),
        cities: getCompatibleCities(language),
        programTypes: [
          { id: "summer", label: language === 'en' ? "Summer Program" : "夏季项目" },
          { id: "semester", label: language === 'en' ? "Semester Program" : "学期项目" },
          { id: "year", label: language === 'en' ? "Year-long Program" : "全年项目" },
          { id: "language", label: language === 'en' ? "Language Program" : "语言项目" },
          { id: "university", label: language === 'en' ? "University Program" : "大学项目" }
        ],
        destinations: [
          { id: "usa", label: language === 'en' ? "United States" : "美国" },
          { id: "uk", label: language === 'en' ? "United Kingdom" : "英国" },
          { id: "canada", label: language === 'en' ? "Canada" : "加拿大" },
          { id: "australia", label: language === 'en' ? "Australia" : "澳大利亚" },
          { id: "europe", label: language === 'en' ? "Europe" : "欧洲" },
          { id: "singapore", label: language === 'en' ? "Singapore" : "新加坡" },
          { id: "malaysia", label: language === 'en' ? "Malaysia" : "马来西亚" },
          { id: "japan", label: language === 'en' ? "Japan" : "日本" }
        ],
        interests: [
          { id: "academic", label: language === 'en' ? "Academic Enrichment" : "学术拓展" },
          { id: "heritage", label: language === 'en' ? "Heritage & Arts Exploration" : "传统与艺术探索" },
          { id: "performing", label: language === 'en' ? "Performing Arts" : "表演艺术" },
          { id: "lifestyle", label: language === 'en' ? "Language & Lifestyle" : "语言与生活" },
          { id: "language", label: language === 'en' ? "Language Intensive" : "语言强化" },
          { id: "history", label: language === 'en' ? "History & Civic" : "历史与公民" },
          { id: "stem", label: language === 'en' ? "STEM & Science" : "STEM与科学创新" },
          { id: "religion", label: language === 'en' ? "Religion & Belief" : "宗教与信仰" },
          { id: "community", label: language === 'en' ? "Community Service" : "社区服务" },
          { id: "sports", label: language === 'en' ? "Sports" : "体育" },
          { id: "courses", label: language === 'en' ? "Academic Courses" : "专业发展" }
        ]
      }
    };
  } catch (error) {
    console.error('Error fetching form content:', error);
    return null;
  }
};

// 提交规划表单
export const submitPlanningForm = async (formData: PlanningFormData) => {
  try {
    console.log('提交表单数据到API:', formData);

    // 准备提交到Strapi的数据
    const strapiFormData = {
      role: formData.role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      schoolName: formData.schoolName || '',
      gradeLevel: formData.gradeLevel || '',
      province: formData.province || '',
      city: formData.city || '',
      // 将数组转换为字符串
      destinations: formData.destinations.join(','),
      interests: formData.interests.join(','),
      programTypes: formData.programTypes.join(','),
      questions: formData.questions || '',
      agreeToReceiveInfo: formData.agreeToReceiveInfo,
      submittedAt: new Date().toISOString()
    };

    // 发送到Express代理服务器
    console.log('发送数据到Express代理服务器:', strapiFormData);
    const response = await axios.post('/api/form-submissions', strapiFormData);

    console.log('表单提交响应:', response.data);

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error submitting planning form:', error);
    console.error('Error details:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Mock newsletter subscriptions data
const mockSubscriptions: NewsletterSubscription[] = [];

// 提交邮件订阅
export const submitNewsletterSubscription = async (email: string, language = 'en') => {
  try {
    console.log('Submitting newsletter subscription:', { email, language });

    // 将邮件保存到本地表格文件中（作为备份）
    try {
      const savedSubscription = subscriptionService.saveSubscription(email, 'footer-form');
      console.log('邮件已保存到本地订阅表格（备份）:', savedSubscription);
    } catch (err) {
      console.error('保存邮件到本地订阅表格失败:', err);
      // 即使本地保存失败，也继续处理API请求
    }

    // 通过Express中间层发送到Strapi
    console.log('通过Express中间层发送订阅请求');

    // 发送请求到Express中间层
    const response = await axios.post(
      '/api/newsletter-subscriptions',
      { email: email }
    );

    console.log('订阅响应:', response.data);

    if (response.data && response.data.success) {
      toast.success(
        language === 'zh'
          ? '订阅成功！感谢您的关注。'
          : 'Subscribed successfully! Thank you for joining us.'
      );
      return {
        success: true,
        data: response.data.data
      };
    } else {
      throw new Error('Subscription failed');
    }
  } catch (error) {
    console.error('Error submitting newsletter subscription:', error);

    // 处理已存在邮箱的情况
    if (error.response && error.response.data &&
        error.response.data.message &&
        error.response.data.message.includes('已订阅')) {
      toast.info(
        language === 'zh'
          ? '该邮箱已订阅，无需重复提交。'
          : 'This email is already subscribed.'
      );
      return { success: true, data: { email } };
    }

    toast.error(
      language === 'zh'
        ? '订阅失败，请稍后再试。'
        : 'Subscription failed, please try again later.'
    );
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

export default {
  getFrontendFormContent,
  submitPlanningForm,
  submitNewsletterSubscription
};
