
import { useState } from "react";

interface Benefit {
  id: number;
  icon: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  order: number;
}

// Initial sample data
const initialBenefits = [
  { 
    id: 1, 
    icon: "award", 
    title_en: "Academic Excellence", 
    title_zh: "学术卓越",
    description_en: "Programs designed to enhance academic performance and skills.",
    description_zh: "旨在提高学术表现和技能的项目。",
    order: 1
  },
  { 
    id: 2, 
    icon: "globe", 
    title_en: "Cultural Immersion", 
    title_zh: "文化沉浸",
    description_en: "Experience new cultures first-hand with local engagement.",
    description_zh: "通过本地参与，亲身体验新文化。",
    order: 2
  },
  { 
    id: 3, 
    icon: "users", 
    title_en: "Lifelong Connections", 
    title_zh: "终身联系",
    description_en: "Build international friendships that last a lifetime.",
    description_zh: "建立持续一生的国际友谊。",
    order: 3
  },
];

// Default empty benefit
const emptyBenefit = {
  icon: "award",
  title_en: "",
  title_zh: "",
  description_en: "",
  description_zh: ""
};

export const useBenefitsManager = () => {
  const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);
  const [newBenefit, setNewBenefit] = useState(emptyBenefit);

  const addBenefit = () => {
    if (newBenefit.title_en && newBenefit.title_zh) {
      const newId = benefits.length > 0 ? Math.max(...benefits.map(benefit => benefit.id)) + 1 : 1;
      setBenefits([
        ...benefits,
        {
          id: newId,
          icon: newBenefit.icon,
          title_en: newBenefit.title_en,
          title_zh: newBenefit.title_zh,
          description_en: newBenefit.description_en,
          description_zh: newBenefit.description_zh,
          order: benefits.length + 1,
        },
      ]);
      setNewBenefit(emptyBenefit);
    }
  };

  const removeBenefit = (id: number) => {
    setBenefits(benefits.filter(benefit => benefit.id !== id));
  };

  const moveBenefit = (id: number, direction: 'up' | 'down') => {
    const index = benefits.findIndex(benefit => benefit.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === benefits.length - 1)
    ) {
      return;
    }

    const newBenefits = [...benefits];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap items
    [newBenefits[index], newBenefits[targetIndex]] = [newBenefits[targetIndex], newBenefits[index]];
    
    // Update order property
    newBenefits.forEach((benefit, idx) => {
      benefit.order = idx + 1;
    });
    
    setBenefits(newBenefits);
  };

  const saveBenefits = async () => {
    // Here you would implement the API call to save benefits
    console.log("Saving benefits:", benefits);
    // const response = await saveBenefitsToAPI(benefits);
    // return response;
  };

  return {
    benefits,
    newBenefit,
    setNewBenefit,
    addBenefit,
    removeBenefit,
    moveBenefit,
    saveBenefits
  };
};
