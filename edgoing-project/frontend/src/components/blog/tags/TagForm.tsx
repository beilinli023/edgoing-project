
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

interface ColorOption {
  value: string;
  label: string;
}

interface TagFormProps {
  tagName: {
    en: string;
    zh: string;
  };
  color: string;
  colors: ColorOption[];
  onInputChange: (field: "name_en" | "name_zh" | "color", value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  isValid: boolean;
}

const TagForm: React.FC<TagFormProps> = ({
  tagName,
  color,
  colors,
  onInputChange,
  onCancel,
  onSave,
  isValid
}) => {
  return (
    <div className="p-3 bg-muted/30 border-b">
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div>
          <label className="block text-sm font-medium mb-1">英文名称</label>
          <Input 
            value={tagName.en}
            onChange={e => onInputChange("name_en", e.target.value)}
            placeholder="e.g. Education"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">中文名称</label>
          <Input 
            value={tagName.zh}
            onChange={e => onInputChange("name_zh", e.target.value)}
            placeholder="例如：教育"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">颜色</label>
          <Select value={color} onValueChange={value => onInputChange("color", value)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="选择颜色" />
            </SelectTrigger>
            <SelectContent>
              {colors.map(color => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center">
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onCancel}
          type="button"
        >
          <X className="h-4 w-4 mr-2" />
          取消
        </Button>
        <Button 
          size="sm" 
          onClick={onSave}
          disabled={!isValid}
          type="button"
        >
          <Save className="h-4 w-4 mr-2" />
          保存
        </Button>
      </div>
    </div>
  );
};

export default TagForm;
