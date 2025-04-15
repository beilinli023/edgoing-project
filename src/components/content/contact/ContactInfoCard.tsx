
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ContactInfoForm } from "./ContactInfoForm";
import { ContactInfo } from "@/types/cmsTypes";

interface ContactInfoCardProps {
  isLoading: boolean;
  contactInfo: ContactInfo;
  handleInputChange: (field: keyof ContactInfo, value: string) => void;
  handleSave: () => void;
  isPending: boolean;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  isLoading,
  contactInfo,
  handleInputChange,
  handleSave,
  isPending
}) => {
  if (isLoading) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>联系信息管理</CardTitle>
          <CardDescription>正在加载数据...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>联系信息管理</CardTitle>
        <CardDescription>管理网站显示的联系信息（双语）</CardDescription>
      </CardHeader>
      <CardContent>
        <ContactInfoForm 
          contactInfo={contactInfo}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          isPending={isPending}
        />
      </CardContent>
    </Card>
  );
};
