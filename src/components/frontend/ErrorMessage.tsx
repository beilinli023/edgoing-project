
import React from "react";
import { ApiError } from "@/components/ui/api-error";
import { ApiErrorType } from "@/services/api/apiService";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  currentLanguage: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title, 
  message, 
  buttonText, 
  onButtonClick,
  currentLanguage
}) => {
  return (
    <ApiError
      title={title}
      message={message}
      errorType={ApiErrorType.UNKNOWN}
      onRetry={onButtonClick}
      currentLanguage={currentLanguage}
      className="mb-8"
    />
  );
};

export default ErrorMessage;
