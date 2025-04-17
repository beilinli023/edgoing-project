
import React from "react";
import { CardContent } from "@/components/ui/card";
import { ApiError } from "@/components/ui/api-error";
import { ApiErrorType } from "@/services/api/apiService";

interface BlogPostsErrorProps {
  message?: string;
  currentLanguage?: string;
}

const BlogPostsError: React.FC<BlogPostsErrorProps> = ({ 
  message = "加载失败，请刷新页面重试",
  currentLanguage = "zh"
}) => {
  return (
    <CardContent className="py-10">
      <ApiError
        message={message}
        errorType={ApiErrorType.NETWORK_ERROR}
        compact={true}
        currentLanguage={currentLanguage}
      />
    </CardContent>
  );
};

export default BlogPostsError;
