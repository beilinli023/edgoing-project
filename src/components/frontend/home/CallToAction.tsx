
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFrontendCta } from '@/hooks/useFrontendCta';

interface CallToActionProps {
  currentLanguage: 'en' | 'zh';
}

const CallToAction: React.FC<CallToActionProps> = ({ currentLanguage }) => {
  const { content, isLoading, error } = useFrontendCta(currentLanguage);

  if (isLoading) {
    return <div className="py-12 bg-blue-600">Loading...</div>;
  }

  if (error || !content) {
    return null;
  }

  const { title, description, buttonText, buttonUrl } = content;
  
  return (
    <section className="bg-blue-600 py-16 px-4">
      <div className="container mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="max-w-2xl mx-auto mb-8 text-blue-100">{description}</p>
        <Button
          asChild
          className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-md transition-colors"
        >
          <a href={buttonUrl}>{buttonText}</a>
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
