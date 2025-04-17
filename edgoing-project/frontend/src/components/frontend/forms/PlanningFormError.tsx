
import React from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/components/ui/api-error";
import { ApiErrorType } from "@/services/api/apiService";

interface PlanningFormErrorProps {
  errorTitle: string;
  errorMessage: string;
  tryAgainText: string;
  onRetry: () => void;
  backupFormTitle: string;
  backupFormMessage: string;
  callUsText: string;
  emailUsText: string;
  currentLanguage: string;
}

const PlanningFormError: React.FC<PlanningFormErrorProps> = ({
  errorTitle,
  errorMessage,
  tryAgainText,
  onRetry,
  backupFormTitle,
  backupFormMessage,
  callUsText,
  emailUsText,
  currentLanguage
}) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ApiError
        title={errorTitle}
        message={errorMessage}
        errorType={ApiErrorType.NETWORK_ERROR}
        onRetry={onRetry}
        currentLanguage={currentLanguage}
      />
      
      {/* 备用联系方式 */}
      <div className="mt-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{backupFormTitle}</h2>
        <p className="mb-6 text-gray-600">{backupFormMessage}</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700">
            {callUsText}: 400-400-400
          </Button>
          <Button className="bg-[#a4be55] hover:bg-[#94ae45]">
            {emailUsText}: info@younikco.com
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanningFormError;
