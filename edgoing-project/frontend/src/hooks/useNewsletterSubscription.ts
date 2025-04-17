
import { useState } from 'react';
import { toast } from "sonner";
import { submitNewsletterSubscription } from '@/services/frontend/formService';
import { useLanguage } from '@/context/LanguageContext';

export const useNewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useLanguage();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error(currentLanguage === 'zh' ? '请输入有效的电子邮箱' : 'Please enter a valid email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting newsletter subscription:', email);
      const response = await submitNewsletterSubscription(email, currentLanguage);
      
      if (response.success) {
        console.log('Subscription successful:', response.data);
        toast.success(
          currentLanguage === 'zh' 
            ? '订阅成功！感谢您的关注。' 
            : 'Subscribed successfully! Thank you for joining us.'
        );
        setEmail('');
      } else {
        console.error('Subscription failed:', response.error);
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(
        currentLanguage === 'zh' 
          ? '订阅失败，请稍后再试。' 
          : 'Subscription failed, please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    isLoading,
    handleEmailChange,
    handleSubmit
  };
};

export default useNewsletterSubscription;
