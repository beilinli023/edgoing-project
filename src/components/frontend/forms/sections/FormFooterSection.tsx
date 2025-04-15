import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, FileText } from "lucide-react";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface FormFooterSectionProps {
  formData: {
    agreeToReceiveInfo: boolean;
    agreeToPrivacyPolicy?: boolean;
  };
  handleAgreeChange: (checked: boolean) => void;
  handlePrivacyPolicyChange?: (checked: boolean) => void;
  isSubmitting: boolean;
  text: {
    agreeToReceive: string;
    submitButton: string;
    submitting: string;
    privacyPolicy?: string;
    privacyPolicyText?: string;
    privacyPolicyTitle?: string;
    privacyPolicyDialogText?: string;
    readMore?: string;
  };
  currentLanguage?: string;
}

const FormFooterSection: React.FC<FormFooterSectionProps> = ({
  formData,
  handleAgreeChange,
  handlePrivacyPolicyChange,
  isSubmitting,
  text,
  currentLanguage = 'en'
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 默认文本（如果props中没有提供）
  const privacyPolicyText = text.privacyPolicy || 
    (currentLanguage === 'en' 
      ? "I have read and agree to the Privacy Policy" 
      : "我已阅读并同意隐私政策");
  
  const privacyPolicyTitle = text.privacyPolicyTitle || 
    (currentLanguage === 'en' ? "Privacy Policy" : "隐私政策");
  
  const privacyPolicyDialogText = text.privacyPolicyDialogText || 
    (currentLanguage === 'en' 
      ? "This is a summary of our privacy policy. For the full privacy policy, please visit our privacy policy page." 
      : "这是我们隐私政策的摘要。要查看完整的隐私政策，请访问我们的隐私政策页面。");
  
  const readMoreText = text.readMore || 
    (currentLanguage === 'en' ? "Read full Privacy Policy" : "阅读完整隐私政策");

  return (
    <>
      {/* 同意接收信息 */}
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="agreeToReceive"
          checked={formData.agreeToReceiveInfo}
          onCheckedChange={(checked) => handleAgreeChange(checked as boolean)}
        />
        <label 
          htmlFor="agreeToReceive"
          className="text-sm text-gray-600"
        >
          {text.agreeToReceive}
        </label>
      </div>

      {/* 隐私政策勾选 */}
      <div className="flex items-start space-x-2 mt-4">
        <Checkbox 
          id="agreeToPrivacyPolicy"
          checked={formData.agreeToPrivacyPolicy || false}
          onCheckedChange={(checked) => {
            if (handlePrivacyPolicyChange) {
              handlePrivacyPolicyChange(checked as boolean);
            }
          }}
          required
        />
        <div className="flex items-center">
          <label 
            htmlFor="agreeToPrivacyPolicy"
            className="text-sm text-gray-600 mr-1"
          >
            {privacyPolicyText}
          </label>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" size="sm" className="p-0 h-auto text-blue-500 hover:text-blue-700">
                <FileText className="h-4 w-4 mr-1" />
                {currentLanguage === 'en' ? 'View' : '查看'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{privacyPolicyTitle}</DialogTitle>
                <DialogDescription>{privacyPolicyDialogText}</DialogDescription>
              </DialogHeader>
              <div className="mt-4 text-sm">
                <p className="mb-2">
                  {currentLanguage === 'en' 
                    ? "We collect personal information to provide you with our educational services. This includes contact details, educational background, and preferences. Your data is used to process your requests, customize our services, and communicate with you about our programs."
                    : "我们收集个人信息以提供教育服务。这包括联系方式、教育背景和偏好。您的数据用于处理您的请求、定制我们的服务以及就我们的项目与您沟通。"}
                </p>
                <p className="mb-2">
                  {currentLanguage === 'en'
                    ? "We may share your information with partner schools and service providers as necessary to facilitate your educational experience. We implement appropriate security measures to protect your data."
                    : "我们可能会与合作学校和服务提供商分享您的信息，以便于您的教育体验。我们实施适当的安全措施来保护您的数据。"}
                </p>
              </div>
              <div className="mt-4 flex justify-between">
                <DialogClose asChild>
                  <Button variant="outline">
                    {currentLanguage === 'en' ? 'Close' : '关闭'}
                  </Button>
                </DialogClose>
                <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  <Button variant="default">
                    {readMoreText}
                  </Button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-center mt-8">
        <Button 
          type="submit" 
          className="bg-[#a4be55] hover:bg-[#94ae45] text-white px-8 py-2 rounded-full"
          disabled={isSubmitting || !(formData.agreeToPrivacyPolicy || false)}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              {text.submitting}
            </div>
          ) : text.submitButton}
        </Button>
      </div>
    </>
  );
};

export default FormFooterSection;
