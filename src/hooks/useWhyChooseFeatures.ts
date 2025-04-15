
import { useState } from "react";

interface Feature {
  id: number;
  icon: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  order: number;
}

interface NewFeature {
  icon: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
}

export const useWhyChooseFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([
    { 
      id: 1, 
      icon: "star", 
      title_en: "Expert Guidance", 
      title_zh: "专业指导",
      description_en: "Our advisors have extensive experience in international education.",
      description_zh: "我们的顾问在国际教育方面拥有丰富的经验。",
      order: 1
    },
    { 
      id: 2, 
      icon: "globe", 
      title_en: "Global Network", 
      title_zh: "全球网络",
      description_en: "Partnerships with top institutions worldwide.",
      description_zh: "与全球顶尖机构合作。",
      order: 2
    },
    { 
      id: 3, 
      icon: "shield", 
      title_en: "Safety First", 
      title_zh: "安全第一",
      description_en: "Comprehensive safety protocols for all our programs.",
      description_zh: "为所有项目提供全面的安全协议。",
      order: 3
    },
  ]);

  const [newFeature, setNewFeature] = useState<NewFeature>({
    icon: "star",
    title_en: "",
    title_zh: "",
    description_en: "",
    description_zh: "",
  });

  const addFeature = () => {
    if (newFeature.title_en && newFeature.title_zh) {
      const newId = features.length > 0 ? Math.max(...features.map(feature => feature.id)) + 1 : 1;
      setFeatures([
        ...features,
        {
          id: newId,
          icon: newFeature.icon,
          title_en: newFeature.title_en,
          title_zh: newFeature.title_zh,
          description_en: newFeature.description_en,
          description_zh: newFeature.description_zh,
          order: features.length + 1,
        },
      ]);
      setNewFeature({
        icon: "star",
        title_en: "",
        title_zh: "",
        description_en: "",
        description_zh: "",
      });
    }
  };

  const removeFeature = (id: number) => {
    setFeatures(features.filter(feature => feature.id !== id));
  };

  const moveFeature = (id: number, direction: 'up' | 'down') => {
    const index = features.findIndex(feature => feature.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === features.length - 1)
    ) {
      return;
    }

    const newFeatures = [...features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap items
    [newFeatures[index], newFeatures[targetIndex]] = [newFeatures[targetIndex], newFeatures[index]];
    
    // Update order property
    newFeatures.forEach((feature, idx) => {
      feature.order = idx + 1;
    });
    
    setFeatures(newFeatures);
  };

  return {
    features,
    setFeatures,
    newFeature,
    setNewFeature,
    addFeature,
    removeFeature,
    moveFeature
  };
};
