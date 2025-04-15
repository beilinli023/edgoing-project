
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useNewsletterSubscription from '@/hooks/useNewsletterSubscription';

const NewsletterSubscription: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { email, isLoading, handleEmailChange, handleSubmit } = useNewsletterSubscription();

  // 文本内容根据当前语言显示
  const content = {
    title: currentLanguage === 'zh' ? '订阅我们的最新消息' : 'Subscribe to Our Newsletter',
    description: currentLanguage === 'zh' 
      ? '订阅我们的电子邮件，及时了解最新的项目、旅行机会和教育资讯。' 
      : 'Subscribe to our newsletter to stay updated with the latest programs, travel opportunities, and educational insights.',
    buttonText: currentLanguage === 'zh' ? '订阅' : 'Subscribe',
    placeholder: currentLanguage === 'zh' ? '输入您的电子邮箱' : 'Enter your email',
    loadingText: currentLanguage === 'zh' ? '提交中...' : 'Submitting...'
  };

  return (
    <section className="bg-gradient-to-r from-[#193976] to-[#2563eb] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{content.title}</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">{content.description}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="email"
              placeholder={content.placeholder}
              className="pl-10 bg-white h-12"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="bg-[#f59e0b] hover:bg-[#d97706] h-12 px-6 transition-colors" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {content.loadingText}
              </span>
            ) : content.buttonText}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSubscription;
