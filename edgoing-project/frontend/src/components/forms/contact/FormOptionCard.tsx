
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormOption } from "@/types/contactFormTypes";

interface FormOptionCardProps {
  option: FormOption;
  toggleEnabled: () => void;
  updateText: (field: 'text_en' | 'text_zh', value: string) => void;
  removeOption: () => void;
}

const FormOptionCard: React.FC<FormOptionCardProps> = ({
  option,
  toggleEnabled,
  updateText,
  removeOption
}) => {
  return (
    <Card key={option.id} className="overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={option.enabled} 
            onCheckedChange={toggleEnabled} 
          />
          <span className={option.enabled ? "font-medium" : "font-medium text-gray-400"}>
            {option.enabled ? "启用" : "禁用"}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={removeOption}
        >
          删除
        </Button>
      </div>
      <CardContent className="p-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${option.id}-en`}>英文名称</Label>
            <Input 
              id={`${option.id}-en`} 
              value={option.text_en} 
              onChange={(e) => updateText('text_en', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`${option.id}-zh`}>中文名称</Label>
            <Input 
              id={`${option.id}-zh`} 
              value={option.text_zh} 
              onChange={(e) => updateText('text_zh', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormOptionCard;
