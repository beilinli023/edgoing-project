
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

export interface CompanyEmailsManagerProps {
  companyEmails: string[];
  onEmailsChange: (emails: string[]) => void;
}

const CompanyEmailsManager: React.FC<CompanyEmailsManagerProps> = ({ 
  companyEmails, 
  onEmailsChange 
}) => {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddEmail = () => {
    if (!newEmail.trim()) {
      setError("邮箱地址不能为空");
      return;
    }

    if (!validateEmail(newEmail)) {
      setError("请输入有效的邮箱地址");
      return;
    }

    if (companyEmails.includes(newEmail)) {
      setError("该邮箱地址已存在");
      return;
    }

    onEmailsChange([...companyEmails, newEmail]);
    setNewEmail("");
    setError("");
  };

  const handleRemoveEmail = (email: string) => {
    onEmailsChange(companyEmails.filter(e => e !== email));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          value={newEmail}
          onChange={(e) => {
            setNewEmail(e.target.value);
            setError("");
          }}
          placeholder="输入邮箱地址"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddEmail();
            }
          }}
        />
        <Button onClick={handleAddEmail} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          添加
        </Button>
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <div className="space-y-2">
        {companyEmails.length > 0 ? (
          companyEmails.map((email, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
              <span className="text-sm">{email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveEmail(email)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">尚未添加任何接收邮箱</p>
        )}
      </div>
    </div>
  );
};

export default CompanyEmailsManager;
