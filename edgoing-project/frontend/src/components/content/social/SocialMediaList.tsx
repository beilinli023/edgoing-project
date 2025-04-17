
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SocialMedia } from "@/types/cmsTypes";
import { SocialPlatformIcon } from "./SocialPlatformIcon";

interface SocialMediaListProps {
  socialLinks: SocialMedia[];
  removeSocialLink: (id: number) => void;
  isLoading: boolean;
  isPending: boolean;
}

const SocialMediaList: React.FC<SocialMediaListProps> = ({
  socialLinks,
  removeSocialLink,
  isLoading,
  isPending
}) => {
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-6 w-6 border-t-2 border-blue-500 rounded-full mx-auto mb-2"></div>
        <p>加载社交媒体链接...</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-6 gap-2 bg-muted p-3 rounded-t-md">
        <div className="col-span-1">平台</div>
        <div className="col-span-4">链接</div>
        <div className="col-span-1">操作</div>
      </div>
      <div className="divide-y">
        {socialLinks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            暂无社交媒体链接，请添加
          </div>
        ) : (
          socialLinks.map(link => (
            <div key={link.id} className="grid grid-cols-6 gap-2 p-3 items-center">
              <div className="col-span-1 flex items-center gap-2">
                <SocialPlatformIcon platform={link.platform} />
                <span className="capitalize">{link.platform}</span>
              </div>
              <div className="col-span-4 text-sm text-muted-foreground truncate">{link.url}</div>
              <div className="col-span-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeSocialLink(link.id)}
                  disabled={isPending}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocialMediaList;
