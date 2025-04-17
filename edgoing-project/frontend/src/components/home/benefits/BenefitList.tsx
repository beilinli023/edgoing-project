
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, X } from "lucide-react";

interface Benefit {
  id: number;
  icon: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  order: number;
}

interface BenefitListProps {
  benefits: Benefit[];
  moveBenefit: (id: number, direction: 'up' | 'down') => void;
  removeBenefit: (id: number) => void;
}

const BenefitList: React.FC<BenefitListProps> = ({ 
  benefits, 
  moveBenefit, 
  removeBenefit 
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
        {benefits.map(benefit => (
          <div key={benefit.id} className="grid grid-cols-7 gap-2 p-3 items-center">
            <div className="col-span-1">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                {benefit.icon}
              </div>
            </div>
            <div className="col-span-2">
              <div>{benefit.title_en}</div>
              <div className="text-sm text-muted-foreground">{benefit.title_zh}</div>
            </div>
            <div className="col-span-3">
              <div className="text-sm">{benefit.description_en}</div>
              <div className="text-sm text-muted-foreground">{benefit.description_zh}</div>
            </div>
            <div className="col-span-1 flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => moveBenefit(benefit.id, 'up')}
                disabled={benefit.order === 1}
              >
                <ArrowUp size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => moveBenefit(benefit.id, 'down')}
                disabled={benefit.order === benefits.length}
              >
                <ArrowDown size={14} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeBenefit(benefit.id)}>
                <X size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitList;
