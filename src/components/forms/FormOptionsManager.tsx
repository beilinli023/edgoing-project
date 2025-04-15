import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FormOptionsCard from "@/components/forms/contact/FormOptionsCard";
import { useContactFormManager } from "@/hooks/useContactFormManager";

const FormOptionsManager = () => {
  const {
    activeTab,
    setActiveTab,
    programTypes,
    setProgramTypes,
    destinations,
    setDestinations,
    learningInterests,
    setLearningInterests,
    toggleOptionEnabled,
    updateOptionText,
    addNewOption,
    removeOption,
    handleSave
  } = useContactFormManager();

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          在此页面上，您可以管理表单中的选项，包括项目类型、目的地和学习兴趣。
          这些选项将显示在前端的"开始计划"表单中供用户选择。
        </p>
      </div>

      <FormOptionsCard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        programTypes={programTypes}
        setProgramTypes={setProgramTypes}
        destinations={destinations}
        setDestinations={setDestinations}
        learningInterests={learningInterests}
        setLearningInterests={setLearningInterests}
        toggleOptionEnabled={toggleOptionEnabled}
        updateOptionText={updateOptionText}
        addNewOption={addNewOption}
        removeOption={removeOption}
      />

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave}>保存选项设置</Button>
      </div>
    </div>
  );
};

export default FormOptionsManager;
