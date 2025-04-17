
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { MenuItem } from "@/services/contentService";

interface NavigationItemListProps {
  menuItems: MenuItem[];
  onMoveItem: (id: number, direction: 'up' | 'down') => void;
  onRemoveItem: (id: number) => void;
  isPending: boolean;
}

const NavigationItemList: React.FC<NavigationItemListProps> = ({ 
  menuItems, 
  onMoveItem, 
  onRemoveItem, 
  isPending 
}) => {
  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-7 gap-2 bg-muted p-3 rounded-t-md">
        <div className="col-span-2">英文标题</div>
        <div className="col-span-2">中文标题</div>
        <div className="col-span-2">URL</div>
        <div className="col-span-1">操作</div>
      </div>
      <div className="divide-y">
        {menuItems.map(item => (
          <div key={item.id} className="grid grid-cols-7 gap-2 p-3 items-center">
            <div className="col-span-2">{item.title_en}</div>
            <div className="col-span-2">{item.title_zh}</div>
            <div className="col-span-2 text-sm text-muted-foreground truncate">{item.url}</div>
            <div className="col-span-1 flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onMoveItem(item.id, 'up')}
                disabled={item.order === 1 || isPending}
              >
                <ArrowUp size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onMoveItem(item.id, 'down')}
                disabled={item.order === menuItems.length || isPending}
              >
                <ArrowDown size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onRemoveItem(item.id)}
                disabled={isPending}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationItemList;
