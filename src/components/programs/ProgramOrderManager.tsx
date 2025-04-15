
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ProgramOrderItem from './ProgramOrderItem';
import { useProgramOrder } from './hooks/useProgramOrder';

interface ProgramOrderManagerProps {
  programs: any[]; // 接受来自管理员的任何程序格式
  onOrderChange?: () => void;
}

const ProgramOrderManager: React.FC<ProgramOrderManagerProps> = ({ programs, onOrderChange }) => {
  const { 
    orderedPrograms, 
    isSaving, 
    handleMoveUp, 
    handleMoveDown, 
    saveOrder,
    handleDragEnd
  } = useProgramOrder(programs, onOrderChange);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">项目排序管理</h2>
        <Button onClick={saveOrder} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? '保存中...' : '保存排序'}
        </Button>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-sm text-gray-500 mb-2">
          拖拽项目或使用箭头按钮调整项目在网站上的显示顺序。完成后点击"保存排序"。
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="programs">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {orderedPrograms.map((program, index) => (
                <ProgramOrderItem 
                  key={program.id.toString()}
                  program={program}
                  index={index}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  isLast={index === orderedPrograms.length - 1}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ProgramOrderManager;
