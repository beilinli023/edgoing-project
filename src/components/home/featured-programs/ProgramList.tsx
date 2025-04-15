
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, X, Image } from "lucide-react";

interface Program {
  id?: string;
  image: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  location_en: string;
  location_zh: string;
  duration: string;
  order_index: number;
}

interface ProgramListProps {
  programs: Program[];
  onMove: (id: string, direction: 'up' | 'down') => void;
  onRemove: (id: string) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({ programs, onMove, onRemove }) => {
  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-10 gap-2 bg-muted p-3 rounded-t-md">
        <div className="col-span-1">图片</div>
        <div className="col-span-2">名称</div>
        <div className="col-span-3">描述</div>
        <div className="col-span-1">地点</div>
        <div className="col-span-1">时长</div>
        <div className="col-span-2">操作</div>
      </div>
      <div className="divide-y">
        {programs.map(program => (
          <div key={program.id} className="grid grid-cols-10 gap-2 p-3 items-center">
            <div className="col-span-1">
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                <Image size={14} />
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-medium">{program.title_en}</div>
              <div className="text-xs text-muted-foreground">{program.title_zh}</div>
            </div>
            <div className="col-span-3">
              <div className="text-xs truncate">{program.description_en.substring(0, 50)}...</div>
              <div className="text-xs text-muted-foreground truncate">{program.description_zh.substring(0, 50)}...</div>
            </div>
            <div className="col-span-1">
              <div className="text-sm">{program.location_en}</div>
              <div className="text-xs text-muted-foreground">{program.location_zh}</div>
            </div>
            <div className="col-span-1 text-sm">
              {program.duration}
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => program.id && onMove(program.id, 'up')}
                disabled={program.order_index === 1}
              >
                <ArrowUp size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => program.id && onMove(program.id, 'down')}
                disabled={program.order_index === programs.length}
              >
                <ArrowDown size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => program.id && onRemove(program.id)}
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

export default ProgramList;
