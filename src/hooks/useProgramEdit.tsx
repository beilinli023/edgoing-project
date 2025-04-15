
import { useProgramData } from "./program/useProgramData";
import { useProgramForm } from "./program/useProgramForm";
import { useProgramActions } from "./program/useProgramActions";

export function useProgramEdit() {
  // Get program data
  const { 
    id, 
    isAdding, 
    program, 
    programLoading, 
    categories, 
    locations, 
    gradeLevels 
  } = useProgramData();
  
  // Manage form state
  const {
    formData,
    activeTab,
    setActiveTab,
    newTag,
    setNewTag,
    showPreview,
    setShowPreview,
    previewLanguage,
    isSaving,
    setIsSaving,
    handleInputChange,
    handleAddTag,
    handleRemoveTag
  } = useProgramForm(program, isAdding);
  
  // Handle actions (save, preview)
  const { 
    handleSave, 
    handlePreview, 
    handleClosePreview 
  } = useProgramActions(formData, isAdding, id || "", setIsSaving, setShowPreview);

  return {
    isAdding,
    formData,
    programLoading,
    activeTab,
    setActiveTab,
    newTag,
    setNewTag,
    showPreview,
    previewLanguage,
    categories,
    locations,
    gradeLevels,
    handleInputChange,
    handleAddTag,
    handleRemoveTag,
    handleSave,
    handlePreview,
    handleClosePreview,
    isSaving
  };
}
