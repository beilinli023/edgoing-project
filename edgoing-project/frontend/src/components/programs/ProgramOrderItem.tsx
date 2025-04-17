
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Draggable } from '@hello-pangea/dnd';
import { OrderableProgram } from './types/orderTypes';

interface ProgramOrderItemProps {
  program: OrderableProgram;
  index: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isLast: boolean;
}

const ProgramOrderItem: React.FC<ProgramOrderItemProps> = ({ 
  program, 
  index, 
  onMoveUp, 
  onMoveDown, 
  isLast 
}) => {
  return (
    <Draggable 
      key={program.id.toString()} 
      draggableId={program.id.toString()} 
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="border border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={program.thumbnail || '/placeholder.svg'} 
                    alt={program.title_en}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-medium truncate">{program.title_zh || program.title_en}</p>
                  <p className="text-sm text-gray-500 truncate">{program.title_en}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onMoveDown(index)}
                    disabled={isLast}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default ProgramOrderItem;
