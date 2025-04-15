
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormOption } from "@/hooks/useForms";
import { cn } from "@/lib/utils";

interface CheckboxGroupProps {
  label: string;
  options: FormOption[];
  selectedValues: string[];
  onChange: (field: string, value: string, checked: boolean) => void;
  fieldName: string;
  columns?: number;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ 
  label, 
  options, 
  selectedValues, 
  onChange, 
  fieldName,
  columns = 2 
}) => {
  // Use cn utility to handle dynamic column classes
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  const columnClass = columnClasses[columns as keyof typeof columnClasses] || columnClasses[2];

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      <div className={cn("grid gap-2", columnClass)}>
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`${fieldName}-${option.id}`}
              checked={selectedValues.includes(option.id)}
              onCheckedChange={(checked) => 
                onChange(fieldName, option.id, checked as boolean)
              }
            />
            <label 
              htmlFor={`${fieldName}-${option.id}`}
              className="text-sm"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
