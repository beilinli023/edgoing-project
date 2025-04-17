
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import FormIntroCard from "./contact/FormIntroCard";
import FormOptionsCard from "./contact/FormOptionsCard";
import { useContactFormManager } from "@/hooks/useContactFormManager";

const ContactFormManager: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    programTypes,
    setProgramTypes,
    destinations,
    setDestinations,
    learningInterests,
    setLearningInterests,
    introText,
    setIntroText,
    responseTime,
    setResponseTime,
    phoneNumber,
    setPhoneNumber,
    toggleOptionEnabled,
    updateOptionText,
    handleSave,
    addNewOption,
    removeOption
  } = useContactFormManager();

  return (
    <div className="space-y-6">
      <FormIntroCard
        introText={introText}
        responseTime={responseTime}
        phoneNumber={phoneNumber}
        setIntroText={setIntroText}
        setResponseTime={setResponseTime}
        setPhoneNumber={setPhoneNumber}
      />

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

      <Button onClick={handleSave} className="w-full">
        <Save className="mr-2 h-4 w-4" />
        保存所有设置
      </Button>
    </div>
  );
};

export default ContactFormManager;
