
import React from "react";
import { AlertCircle, RefreshCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApiErrorType } from "@/services/api/apiService";

interface ApiErrorProps {
  title?: string;
  message?: string;
  errorType?: ApiErrorType;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
  currentLanguage?: string;
}

export function ApiError({
  title,
  message,
  errorType = ApiErrorType.UNKNOWN,
  onRetry,
  className = "",
  compact = false,
  currentLanguage = "en"
}: ApiErrorProps) {
  // 根据错误类型选择图标
  const getIcon = () => {
    switch (errorType) {
      case ApiErrorType.VALIDATION:
      case ApiErrorType.AUTHENTICATION:
      case ApiErrorType.AUTHORIZATION:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case ApiErrorType.SERVER_ERROR:
      case ApiErrorType.NOT_FOUND:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  // 根据错误类型和语言获取默认标题
  const getDefaultTitle = () => {
    if (currentLanguage === "zh") {
      switch (errorType) {
        case ApiErrorType.VALIDATION:
          return "表单验证错误";
        case ApiErrorType.AUTHENTICATION:
          return "身份验证失败";
        case ApiErrorType.AUTHORIZATION:
          return "权限不足";
        case ApiErrorType.NOT_FOUND:
          return "未找到资源";
        case ApiErrorType.SERVER_ERROR:
          return "服务器错误";
        case ApiErrorType.NETWORK_ERROR:
          return "网络连接错误";
        default:
          return "发生错误";
      }
    } else {
      switch (errorType) {
        case ApiErrorType.VALIDATION:
          return "Validation Error";
        case ApiErrorType.AUTHENTICATION:
          return "Authentication Failed";
        case ApiErrorType.AUTHORIZATION:
          return "Access Denied";
        case ApiErrorType.NOT_FOUND:
          return "Resource Not Found";
        case ApiErrorType.SERVER_ERROR:
          return "Server Error";
        case ApiErrorType.NETWORK_ERROR:
          return "Network Error";
        default:
          return "An Error Occurred";
      }
    }
  };

  // 根据错误类型和语言获取默认消息
  const getDefaultMessage = () => {
    if (currentLanguage === "zh") {
      switch (errorType) {
        case ApiErrorType.VALIDATION:
          return "您提供的数据无效，请检查并更正错误。";
        case ApiErrorType.AUTHENTICATION:
          return "请登录后再试。";
        case ApiErrorType.AUTHORIZATION:
          return "您没有权限执行此操作。";
        case ApiErrorType.NOT_FOUND:
          return "请求的资源不存在或已被移除。";
        case ApiErrorType.SERVER_ERROR:
          return "服务器处理请求时发生错误，请稍后再试。";
        case ApiErrorType.NETWORK_ERROR:
          return "无法连接到服务器，请检查您的网络连接。";
        default:
          return "处理您的请求时发生错误，请稍后再试。";
      }
    } else {
      switch (errorType) {
        case ApiErrorType.VALIDATION:
          return "The data you provided is invalid. Please check and correct the errors.";
        case ApiErrorType.AUTHENTICATION:
          return "Please log in to continue.";
        case ApiErrorType.AUTHORIZATION:
          return "You don't have permission to perform this action.";
        case ApiErrorType.NOT_FOUND:
          return "The requested resource does not exist or has been removed.";
        case ApiErrorType.SERVER_ERROR:
          return "An error occurred while processing your request. Please try again later.";
        case ApiErrorType.NETWORK_ERROR:
          return "Unable to connect to the server. Please check your network connection.";
        default:
          return "An error occurred while processing your request. Please try again later.";
      }
    }
  };

  // 获取重试按钮文本
  const getRetryText = () => {
    return currentLanguage === "zh" ? "重试" : "Retry";
  };

  // 紧凑版本
  if (compact) {
    return (
      <div className={`flex items-start space-x-2 text-sm ${className}`}>
        {getIcon()}
        <span className="flex-1">
          {message || getDefaultMessage()}
          {onRetry && (
            <Button
              variant="link"
              size="sm"
              className="px-1 h-auto"
              onClick={onRetry}
            >
              {getRetryText()}
            </Button>
          )}
        </span>
      </div>
    );
  }

  // 标准版本
  return (
    <Card className={className}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3">
          {getIcon()}
          <h3 className="text-lg font-medium">
            {title || getDefaultTitle()}
          </h3>
        </div>
        <p className="mt-2 text-muted-foreground">
          {message || getDefaultMessage()}
        </p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onRetry}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            {getRetryText()}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
