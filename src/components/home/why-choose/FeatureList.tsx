
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, X } from "lucide-react";

interface Feature {
  id: number;
  icon: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  order: number;
}

interface FeatureListProps {
  features: Feature[];
  moveFeature: (id: number, direction: 'up' | 'down') => void;
  removeFeature: (id: number) => void;
}

const FeatureList: React.FC<FeatureListProps> = ({ 
  features, 
  moveFeature, 
  removeFeature 
}) => {
  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-7 gap-2 bg-muted p-3 rounded-t-md">
        <div className="col-span-1">图标</div>
        <div className="col-span-2">标题</div>
        <div className="col-span-3">描述</div>
        <div className="col-span-1">操作</div>
      </div>
      <div className="divide-y">
        {features.map(feature => (
          <div key={feature.id} className="grid grid-cols-7 gap-2 p-3 items-center">
            <div className="col-span-1">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                {feature.icon}
              </div>
            </div>
            <div className="col-span-2">
              <div>{feature.title_en}</div>
              <div className="text-sm text-muted-foreground">{feature.title_zh}</div>
            </div>
            <div className="col-span-3">
              <div className="text-sm">{feature.description_en}</div>
              <div className="text-sm text-muted-foreground">{feature.description_zh}</div>
            </div>
            <div className="col-span-1 flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => moveFeature(feature.id, 'up')}
                disabled={feature.order === 1}
              >
                <ArrowUp size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => moveFeature(feature.id, 'down')}
                disabled={feature.order === features.length}
              >
                <ArrowDown size={14} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeFeature(feature.id)}>
                <X size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureList;
