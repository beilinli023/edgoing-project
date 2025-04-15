import React from "react";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroup from "../CheckboxGroup";
import { FormOption } from "@/hooks/useForms";

interface ProgramInterestsSectionProps {
  formData: {
    programTypes: string[];
    destinations: string[];
    interests: string[];
    questions: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCheckboxChange: (field: string, value: string, checked: boolean) => void;
  options: {
    programTypes: FormOption[];
    destinations: FormOption[];
    interests: FormOption[];
  };
  text: {
    programTypes: string;
    destinations: string;
    interests: string;
    questions: string;
    questionsPlaceholder: string;
  };
}

const ProgramInterestsSection: React.FC<ProgramInterestsSectionProps> = ({
  formData,
  handleInputChange,
  handleCheckboxChange,
  options,
  text
}) => {
  return (
    <>
      {/* 首选目的地 */}
      <CheckboxGroup
        label={text.destinations}
        options={options.destinations}
        selectedValues={formData.destinations}
        onChange={handleCheckboxChange}
        fieldName="destinations" 
        columns={3}
      />

      {/* 感兴趣的内容 */}
      <CheckboxGroup
        label={text.interests}
        options={options.interests}
        selectedValues={formData.interests}
        onChange={handleCheckboxChange}
        fieldName="interests"
        columns={3}
      />

      {/* 问题或要求 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {text.questions}
        </label>
        <Textarea 
          name="questions"
          value={formData.questions}
          onChange={handleInputChange}
          placeholder={text.questionsPlaceholder}
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};

export default ProgramInterestsSection;
