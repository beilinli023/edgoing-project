
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormOption } from "@/hooks/useForms";

interface PersonalInfoSectionProps {
  formData: {
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  roles: FormOption[];
  text: {
    yourRole: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    selectYourRole: string;
  };
  currentLanguage: string;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  roles,
  text,
  currentLanguage
}) => {
  return (
    <>
      {/* 角色 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {text.yourRole}<span className="text-red-500">*</span>
        </label>
        <Select 
          name="role" 
          value={formData.role} 
          onValueChange={(value) => handleSelectChange("role", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={text.selectYourRole} />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.id}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 名字和姓氏 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            {text.firstName}<span className="text-red-500">*</span>
          </label>
          <Input 
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder={currentLanguage === 'en' ? "Enter your first name" : "输入您的名"}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {text.lastName}<span className="text-red-500">*</span>
          </label>
          <Input 
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder={currentLanguage === 'en' ? "Enter your last name" : "输入您的姓"}
            required
          />
        </div>
      </div>

      {/* 电子邮件和电话 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            {text.email}<span className="text-red-500">*</span>
          </label>
          <Input 
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={currentLanguage === 'en' ? "Enter your email address" : "输入您的电子邮箱"}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {text.phoneNumber}<span className="text-red-500">*</span>
          </label>
          <Input 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={currentLanguage === 'en' ? "Enter your phone number" : "输入您的电话号码"}
            required
          />
        </div>
      </div>
    </>
  );
};

export default PersonalInfoSection;
