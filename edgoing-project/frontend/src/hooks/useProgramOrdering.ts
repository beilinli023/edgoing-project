
import { useState, useEffect } from 'react';
import { Program } from '@/types/programTypes';

export const useProgramOrdering = (programs: Program[]) => {
  const [orderedPrograms, setOrderedPrograms] = useState<Program[]>([]);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    // 初始化时按默认顺序排列
    setOrderedPrograms([...programs]);
  }, [programs]);

  // 简化的排序逻辑，直接使用传入的程序数据
  const fetchProgramOrder = async (programIds: (string | number)[]) => {
    try {
      setIsOrderLoading(true);
      setOrderError(null);
      
      // 直接返回现有程序，不再执行可能失败的查询
      setIsOrderLoading(false);
      return [...programs];
    } catch (error: any) {
      console.error('Error fetching program order:', error);
      setOrderError(error.message || 'Failed to fetch program order');
      setIsOrderLoading(false);
      return [...programs];
    }
  };

  useEffect(() => {
    const loadProgramOrder = async () => {
      if (programs.length === 0) return;
      
      try {
        // 直接设置排序后的程序为当前程序
        setOrderedPrograms([...programs]);
      } catch (error) {
        console.error('Error loading program order:', error);
        // 默认排序
        setOrderedPrograms([...programs]);
      }
    };

    loadProgramOrder();
  }, [programs]);

  return {
    orderedPrograms,
    isOrderLoading,
    orderError
  };
};
