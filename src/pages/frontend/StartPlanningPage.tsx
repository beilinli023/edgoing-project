import React from "react";
import FrontendLayout from "@/components/frontend/FrontendLayout";
import { useFrontendFormContent } from "@/hooks/useFrontendFormContent";
import PlanningFormHero from "@/components/frontend/forms/PlanningFormHero";
import PlanningFormIntro from "@/components/frontend/forms/PlanningFormIntro";
import PlanningForm from "@/components/frontend/forms/PlanningForm";
import PlanningFormSkeleton from "@/components/frontend/forms/PlanningFormSkeleton";
import PlanningFormError from "@/components/frontend/forms/PlanningFormError";

const StartPlanningPage: React.FC = () => {
  const { content, loading, error, currentLanguage } = useFrontendFormContent();
  
  // 本地化文本
  const text = {
    pageTitle: currentLanguage === 'en' ? "Start Your Planning" : "开始计划",
    pageSubtitle: currentLanguage === 'en' 
      ? "Ready to begin your educational journey? Let us help you create the perfect study abroad experience" 
      : "准备开始您的教育之旅？让我们帮助您创造完美的海外学习体验",
    helpText: currentLanguage === 'en'
      ? "Need help with assistance, or just have a question for us?"
      : "需要帮助或有任何问题？",
    responseTime: currentLanguage === 'en'
      ? "Fill out our form and we'll respond within 2 business days"
      : "填写我们的表单，我们将在2个工作日内回复",
    phoneContact: currentLanguage === 'en'
      ? "Or Call Us @ 400-115-3558 (Email: Hello@edgoing.com)"
      : "或致电 400-115-3558（邮件：Hello@edgoing.com）",
    errorTitle: currentLanguage === 'en' ? "Unable to load form" : "无法加载表单",
    errorMessage: currentLanguage === 'en' 
      ? "Sorry, we couldn't load the form Please try again later or contact us directly" 
      : "抱歉，无法加载表单 请稍后再试或直接联系我们",
    tryAgain: currentLanguage === 'en' ? "Try Again" : "重试",
    backupFormTitle: currentLanguage === 'en' ? "Contact Us" : "联系我们",
    backupFormMessage: currentLanguage === 'en' 
      ? "While we're experiencing technical difficulties with our form, you can still reach us" 
      : "虽然我们的表单遇到了技术问题，但您仍然可以联系我们",
    callUs: currentLanguage === 'en' ? "Call us" : "致电我们",
    emailUs: currentLanguage === 'en' ? "Email us" : "发送邮件"
  };

  // 加载状态
  if (loading) {
    return (
      <FrontendLayout>
        <PlanningFormSkeleton />
      </FrontendLayout>
    );
  }

  // 错误状态
  if (error) {
    return (
      <FrontendLayout>
        <PlanningFormHero
          title={text.pageTitle}
          subtitle={text.pageSubtitle}
          backgroundImage="/lovable-uploads/47bf9bbe-157b-4ebd-8119-331c7101bce3.png"
        />
        <PlanningFormError
          errorTitle={text.errorTitle}
          errorMessage={text.errorMessage}
          tryAgainText={text.tryAgain}
          onRetry={() => window.location.reload()}
          backupFormTitle={text.backupFormTitle}
          backupFormMessage={text.backupFormMessage}
          callUsText={text.callUs}
          emailUsText={text.emailUs}
          currentLanguage={currentLanguage}
        />
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      {/* 英雄区域 */}
      <PlanningFormHero
        title={content.hero.title || text.pageTitle}
        subtitle={content.hero.subtitle || text.pageSubtitle}
        backgroundImage={content.hero.backgroundImage}
      />

      {/* 表单区域 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* 介绍文本 */}
          <PlanningFormIntro
            title={content.formSection.title || text.helpText}
            responseTimeText={content.formSection.responseTimeText || text.responseTime}
            phoneContact={text.phoneContact}
          />

          {/* 表单 */}
          <PlanningForm 
            content={content}
            currentLanguage={currentLanguage}
          />
        </div>
      </div>
    </FrontendLayout>
  );
};

export default StartPlanningPage;
