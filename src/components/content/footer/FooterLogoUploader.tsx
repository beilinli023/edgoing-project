
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { useSocialMedia } from "@/hooks/useSocialMedia";

export interface FooterLogoUploaderProps {
  logoUrl: string;
  uploadLogo: (file: File) => void;
  isUploading: boolean;
}

const FooterLogoUploader: React.FC<FooterLogoUploaderProps> = ({
  logoUrl,
  uploadLogo,
  isUploading
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadLogo(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
        {logoUrl ? (
          <div className="relative w-full max-w-xs">
            <img 
              src={logoUrl} 
              alt="页脚Logo" 
              className="object-contain w-full h-auto mb-4"
            />
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>暂无Logo，请上传</p>
          </div>
        )}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('footer-logo-upload')?.click()}
          disabled={isUploading}
          className="mt-4"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              上传中...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {logoUrl ? "更换Logo" : "上传Logo"}
            </>
          )}
        </Button>
        <input
          id="footer-logo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>推荐尺寸: 200 x 60 像素</p>
        <p>支持的格式: PNG, JPG, SVG</p>
        <p>最大文件大小: 2MB</p>
      </div>
    </div>
  );
};

// 创建一个包装器组件来使用钩子
const FooterLogoUploaderWithHook: React.FC = () => {
  const { logoUrl, uploadLogo, isLogoUploading } = useSocialMedia();
  
  return (
    <FooterLogoUploader 
      logoUrl={logoUrl} 
      uploadLogo={uploadLogo} 
      isUploading={isLogoUploading} 
    />
  );
};

export default FooterLogoUploaderWithHook;
