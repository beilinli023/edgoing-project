
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SocialMedia } from "@/hooks/useSocialMedia";

interface SocialMediaListProps {
  socialMedia: SocialMedia[];
  removeSocialMedia: (id: number) => void;
  isPending: boolean;
}

const SocialMediaList: React.FC<SocialMediaListProps> = ({
  socialMedia,
  removeSocialMedia,
  isPending
}) => {
  // 社交媒体图标映射 - 使用内联SVG以确保精确匹配设计
  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        );
      case 'instagram':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case 'youtube':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </svg>
        );
      case 'wechat':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <path d="M15 8v.5a3.5 3.5 0 0 1-7 0V8" />
            <path d="M17 16v.5a3.5 3.5 0 0 1-7 0V16" />
            <path d="M15 13a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
    }
  };

  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-6 gap-2 bg-muted p-3 rounded-t-md">
        <div className="col-span-1">平台</div>
        <div className="col-span-4">URL链接</div>
        <div className="col-span-1">操作</div>
      </div>
      <div className="divide-y">
        {socialMedia.map(item => (
          <div key={item.id} className="grid grid-cols-6 gap-2 p-3 items-center">
            <div className="col-span-1 flex items-center gap-2">
              {renderPlatformIcon(item.platform)}
              <span className="capitalize">{item.platform}</span>
            </div>
            <div className="col-span-4 truncate">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                {item.url}
              </a>
            </div>
            <div className="col-span-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeSocialMedia(item.id)}
                disabled={isPending}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        ))}
        {socialMedia.length === 0 && (
          <div className="p-3 text-center text-gray-500">
            尚未添加社交媒体链接
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaList;
