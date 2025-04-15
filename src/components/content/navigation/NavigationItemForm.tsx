
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface NavigationItemFormProps {
  newItem: {
    title_en: string;
    title_zh: string;
    url: string;
  };
  onItemChange: (updatedItem: {
    title_en: string;
    title_zh: string;
    url: string;
  }) => void;
  onAddItem: () => void;
  isPending: boolean;
}

const NavigationItemForm: React.FC<NavigationItemFormProps> = ({ 
  newItem, 
  onItemChange, 
  onAddItem, 
  isPending 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <Input
          placeholder="英文标题"
          value={newItem.title_en}
          onChange={e => onItemChange({ ...newItem, title_en: e.target.value })}
        />
      </div>
      <div>
        <Input
          placeholder="中文标题"
          value={newItem.title_zh}
          onChange={e => onItemChange({ ...newItem, title_zh: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="URL 路径"
          value={newItem.url}
          onChange={e => onItemChange({ ...newItem, url: e.target.value })}
        />
        <Button 
          onClick={onAddItem} 
          size="icon"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus size={16} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default NavigationItemForm;
