
import { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { OrderableProgram } from '../types/orderTypes';

// Mock implementation - no Supabase
export const useProgramOrder = (programs: any[], onOrderChange?: () => void) => {
  const [orderedPrograms, setOrderedPrograms] = useState<OrderableProgram[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && programs.length > 0) {
      // Initialize with programs passed in (mock data)
      initializeOrderedPrograms(programs);
      hasInitialized.current = true;
    }
  }, [programs]);

  const initializeOrderedPrograms = (inputPrograms: any[]) => {
    // Convert any program format to OrderableProgram format
    const convertedPrograms = inputPrograms.map((p, index) => ({
      id: p.id.toString(),
      title_en: p.title_en || p.titleEn || '',
      title_zh: p.title_zh || p.title || '',
      thumbnail: p.thumbnail || p.image || '/placeholder.svg',
      order_index: p.order_index ?? index,
      program_id: p.program_id || `program-${index}` // Ensure program_id is set
    }));
    
    // Sort by order_index
    const sorted = [...convertedPrograms].sort((a, b) => a.order_index - b.order_index);
    setOrderedPrograms(sorted);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPrograms = [...orderedPrograms];
    const temp = newPrograms[index];
    newPrograms[index] = newPrograms[index - 1];
    newPrograms[index - 1] = temp;
    
    // Update order_index for affected items
    newPrograms[index].order_index = index;
    newPrograms[index - 1].order_index = index - 1;
    
    setOrderedPrograms(newPrograms);
  };

  const handleMoveDown = (index: number) => {
    if (index === orderedPrograms.length - 1) return;
    const newPrograms = [...orderedPrograms];
    const temp = newPrograms[index];
    newPrograms[index] = newPrograms[index + 1];
    newPrograms[index + 1] = temp;
    
    // Update order_index for affected items
    newPrograms[index].order_index = index;
    newPrograms[index + 1].order_index = index + 1;
    
    setOrderedPrograms(newPrograms);
  };

  const saveOrder = async () => {
    setIsSaving(true);
    try {
      // Update order_index for all items
      const updatedPrograms = orderedPrograms.map((program, index) => ({
        ...program,
        order_index: index
      }));
      
      // In a mock implementation, just update the state directly
      setOrderedPrograms(updatedPrograms);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('项目排序已保存');
      if (onOrderChange) onOrderChange();
    } catch (error) {
      console.error('Error saving program order:', error);
      toast.error('保存排序失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(orderedPrograms);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update all order_index values to match new positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index
    }));

    setOrderedPrograms(updatedItems);
  };

  return {
    orderedPrograms,
    isSaving,
    handleMoveUp,
    handleMoveDown,
    saveOrder,
    handleDragEnd
  };
};
