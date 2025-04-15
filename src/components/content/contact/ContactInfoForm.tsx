
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ContactInfo } from "@/types/cmsTypes";

interface ContactInfoFormProps {
  contactInfo: ContactInfo;
  handleInputChange: (field: keyof ContactInfo, value: string) => void;
  handleSave: () => void;
  isPending: boolean;
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  contactInfo,
  handleInputChange,
  handleSave,
  isPending
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">电话号码 (英文)</label>
            <Input
              value={contactInfo.phone_en}
              onChange={(e) => handleInputChange('phone_en', e.target.value)}
              placeholder="例如: +86 123 4567 8910"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">电话号码 (中文)</label>
            <Input
              value={contactInfo.phone_zh}
              onChange={(e) => handleInputChange('phone_zh', e.target.value)}
              placeholder="例如: 123 4567 8910"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">邮箱地址</label>
            <Input
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@younikco.com"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">地址 (英文)</label>
            <Textarea
              value={contactInfo.address_en}
              onChange={(e) => handleInputChange('address_en', e.target.value)}
              placeholder="英文地址"
              rows={2}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">地址 (中文)</label>
            <Textarea
              value={contactInfo.address_zh}
              onChange={(e) => handleInputChange('address_zh', e.target.value)}
              placeholder="中文地址"
              rows={2}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-1 block">营业时间 (英文)</label>
          <Input
            value={contactInfo.hours_en}
            onChange={(e) => handleInputChange('hours_en', e.target.value)}
            placeholder="例如: Monday - Friday: 9AM - 5PM"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">营业时间 (中文)</label>
          <Input
            value={contactInfo.hours_zh}
            onChange={(e) => handleInputChange('hours_zh', e.target.value)}
            placeholder="例如: 周一至周五：上午9点 - 下午5点"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              保存更改
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
