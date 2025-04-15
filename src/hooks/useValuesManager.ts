
import { useState, useEffect } from "react";
import { AboutValue } from "@/types/aboutTypes";

export const useValuesManager = (initialValues?: AboutValue[], onUpdateCallback?: (values: AboutValue[]) => void) => {
  const [values, setValues] = useState<AboutValue[]>([
    {
      id: "1",
      icon: "Globe",
      title_en: "Cultural Respect",
      title_zh: "文化尊重",
      description_en: "Fostering understanding and appreciation",
      description_zh: "培养理解与欣赏"
    },
    {
      id: "2",
      icon: "BookOpen",
      title_en: "Educational Excellence",
      title_zh: "教育卓越",
      description_en: "Providing high-quality learning experiences",
      description_zh: "提供高质量的学习体验"
    },
    {
      id: "3",
      icon: "UserPlus",
      title_en: "Personal Growth",
      title_zh: "个人成长",
      description_en: "Encouraging individual development",
      description_zh: "鼓励个人发展"
    }
  ]);

  useEffect(() => {
    if (initialValues && initialValues.length > 0) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const addNewValue = () => {
    const newValue: AboutValue = {
      id: Date.now().toString(),
      icon: "Globe",
      title_en: "",
      title_zh: "",
      description_en: "",
      description_zh: ""
    };
    const updatedValues = [...values, newValue];
    setValues(updatedValues);
    if (onUpdateCallback) onUpdateCallback(updatedValues);
  };

  const removeValue = (id: string) => {
    if (values.length <= 1) {
      alert("至少需要保留一个价值观项目");
      return;
    }
    const updatedValues = values.filter(v => v.id !== id);
    setValues(updatedValues);
    if (onUpdateCallback) onUpdateCallback(updatedValues);
  };

  const moveValue = (id: string, direction: "up" | "down") => {
    const index = values.findIndex(v => v.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === values.length - 1)
    ) {
      return;
    }
    
    const newValues = [...values];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    // 交换位置
    [newValues[index], newValues[newIndex]] = [newValues[newIndex], newValues[index]];
    setValues(newValues);
    if (onUpdateCallback) onUpdateCallback(newValues);
  };

  const updateValue = (id: string, field: keyof AboutValue, value: string) => {
    const updatedValues = values.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    );
    setValues(updatedValues);
    if (onUpdateCallback) onUpdateCallback(updatedValues);
  };

  return {
    values,
    addNewValue,
    removeValue,
    moveValue,
    updateValue
  };
};
