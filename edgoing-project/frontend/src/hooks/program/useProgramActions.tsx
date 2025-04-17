
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createProject, updateProject } from "@/services/projects/projectService";
import { ProgramFormData } from "@/types/programTypes";

export function useProgramActions(
  formData: ProgramFormData | null, 
  isAdding: boolean, 
  id: string, 
  setIsSaving: (value: boolean) => void, 
  setShowPreview: (value: boolean) => void
) {
  const navigate = useNavigate();

  // Handle saving program
  const handleSave = async () => {
    if (!formData) {
      toast.error("表单数据不能为空");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Perform different operations based on whether adding or editing
      if (isAdding) {
        await createProject(formData);
        toast.success("项目创建成功");
      } else {
        await updateProject(id || "", formData);
        toast.success("项目更新成功");
      }
      
      // Navigate back to program list after successful save
      navigate("/admin/programs");
    } catch (error) {
      console.error("保存项目出错:", error);
      toast.error("保存失败，请检查填写的内容并重试");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    setShowPreview(true);
  };

  // Handle closing preview
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return {
    handleSave,
    handlePreview,
    handleClosePreview
  };
}
