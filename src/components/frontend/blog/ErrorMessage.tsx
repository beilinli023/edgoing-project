
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  getLocalizedText: (en: string, zh: string) => string;
  currentLanguage?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  getLocalizedText,
  currentLanguage = "en"
}) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 font-medium">
              {getLocalizedText('Notice:', '注意:')}
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              {getLocalizedText(
                'Using fallback content due to API error. Please check server connection.', 
                '由于API错误，正在使用备用内容。请检查服务器连接。'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
