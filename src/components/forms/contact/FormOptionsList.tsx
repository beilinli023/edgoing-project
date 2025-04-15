
import React from "react";
import { Button } from "@/components/ui/button";
import FormOptionCard from "./FormOptionCard";
import { FormOption } from "@/types/contactFormTypes";

interface FormOptionsListProps {
  options: FormOption[];
  setOptions: React.Dispatch<React.SetStateAction<FormOption[]>>;
  toggleOptionEnabled: (list: FormOption[], setList: React.Dispatch<React.SetStateAction<FormOption[]>>, id: string) => void;
  updateOptionText: (list: FormOption[], setList: React.Dispatch<React.SetStateAction<FormOption[]>>, id: string, field: 'text_en' | 'text_zh', value: string) => void;
  addNewOption: (list: FormOption[], setList: React.Dispatch<React.SetStateAction<FormOption[]>>, defaultEnName: string, defaultZhName: string) => void;
  removeOption: (list: FormOption[], setList: React.Dispatch<React.SetStateAction<FormOption[]>>, id: string) => void;
  defaultEnName: string;
  defaultZhName: string;
}

const FormOptionsList: React.FC<FormOptionsListProps> = ({
  options,
  setOptions,
  toggleOptionEnabled,
  updateOptionText,
  addNewOption,
  removeOption,
  defaultEnName,
  defaultZhName
}) => {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <FormOptionCard
          key={option.id}
          option={option}
          toggleEnabled={() => toggleOptionEnabled(options, setOptions, option.id)}
          updateText={(field, value) => updateOptionText(options, setOptions, option.id, field, value)}
          removeOption={() => removeOption(options, setOptions, option.id)}
        />
      ))}
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => addNewOption(options, setOptions, defaultEnName, defaultZhName)}
      >
        + 添加新选项
      </Button>
    </div>
  );
};

export default FormOptionsList;
