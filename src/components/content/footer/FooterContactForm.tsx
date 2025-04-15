
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FooterContactInfo } from "@/hooks/useFooterContact";

interface FooterContactFormProps {
  contactInfo: FooterContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<FooterContactInfo>>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FooterContactForm: React.FC<FooterContactFormProps> = ({
  contactInfo,
  setContactInfo,
  onSubmit,
  isSubmitting
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">联系信息</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">电话</label>
          <Input
            value={contactInfo.phone}
            onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">邮箱</label>
          <Input
            value={contactInfo.email}
            onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">地址</label>
          <Input
            value={contactInfo.address}
            onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : "保存联系信息"}
        </Button>
      </div>
    </div>
  );
};

export default FooterContactForm;
