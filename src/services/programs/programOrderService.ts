
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Mock data and helpers for program ordering
export const updateProgramsOrder = async (
  programs: {
    id: string;
    order_index: number;
    program_id: string;
    title_en: string;
    title_zh: string;
  }[]
) => {
  try {
    console.log('Updating program order:', programs);

    // In a real implementation, we would update the database
    // For now just log the update and return success
    toast.success('项目顺序已更新');
    return true;
  } catch (error) {
    console.error('Error updating program order:', error);
    toast.error('更新项目顺序失败');
    return false;
  }
};

// Mock data for program ordering
export const mockOrderedPrograms = [
  {
    id: "1",
    program_id: "prog-1",
    title_en: "Academic Excellence Program",
    title_zh: "学术卓越项目",
    order_index: 1
  },
  {
    id: "2",
    program_id: "prog-2",
    title_en: "Cultural Exchange Program",
    title_zh: "文化交流项目",
    order_index: 2
  },
  {
    id: "3",
    program_id: "prog-3",
    title_en: "Language Immersion Program",
    title_zh: "语言沉浸项目",
    order_index: 3
  }
];

export default {
  updateProgramsOrder
};
