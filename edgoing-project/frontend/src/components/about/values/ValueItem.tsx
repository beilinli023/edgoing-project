
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { X, MoveUp, MoveDown, BookOpen, Globe, Shield, UserPlus, Target } from "lucide-react";
import { AboutValue } from "@/types/aboutTypes";

// Define icon options
export const iconOptions = [
  { value: "Globe", label: "地球", component: Globe },
  { value: "BookOpen", label: "书本", component: BookOpen },
  { value: "UserPlus", label: "个人成长", component: UserPlus },
  { value: "Shield", label: "安全", component: Shield },
  { value: "Target", label: "目标", component: Target }
];

// Helper function to get icon component
export const getIconComponent = (iconName: string) => {
  const found = iconOptions.find(option => option.value === iconName);
  if (found) {
    const IconComponent = found.component;
    return <IconComponent className="h-5 w-5" />;
  }
  return <Globe className="h-5 w-5" />;
};

interface ValueItemProps {
  value: AboutValue;
  index: number;
  totalValues: number;
  onUpdate: (id: string, field: keyof AboutValue, value: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onRemove: (id: string) => void;
}

const ValueItem: React.FC<ValueItemProps> = ({ 
  value, 
  index, 
  totalValues, 
  onUpdate, 
  onMove, 
  onRemove 
}) => {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-gray-50 flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 flex items-center justify-center bg-primary rounded-full text-white">
            {index + 1}
          </span>
          <h3 className="text-lg font-medium">价值观 #{index + 1}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onMove(value.id, "up")}
            disabled={index === 0}
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onMove(value.id, "down")}
            disabled={index === totalValues - 1}
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(value.id)}
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">图标</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map(option => (
                <Button
                  key={option.value}
                  type="button"
                  variant={value.icon === option.value ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => onUpdate(value.id, "icon", option.value)}
                >
                  {React.createElement(option.component, { className: "h-4 w-4" })}
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
              <Input
                value={value.title_en}
                onChange={e => onUpdate(value.id, "title_en", e.target.value)}
                placeholder="Value Title in English"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
              <Input
                value={value.title_zh}
                onChange={e => onUpdate(value.id, "title_zh", e.target.value)}
                placeholder="价值观标题（中文）"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">描述 (英文)</label>
              <Input
                value={value.description_en}
                onChange={e => onUpdate(value.id, "description_en", e.target.value)}
                placeholder="Describe this value in English"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">描述 (中文)</label>
              <Input
                value={value.description_zh}
                onChange={e => onUpdate(value.id, "description_zh", e.target.value)}
                placeholder="用中文描述这个价值观"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValueItem;
