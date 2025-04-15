
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionContentForm from "./why-choose/SectionContentForm";
import FeatureForm from "./why-choose/FeatureForm";
import FeatureList from "./why-choose/FeatureList";
import { useWhyChooseFeatures } from "@/hooks/useWhyChooseFeatures";
import { toast } from "sonner";

const WhyChooseSectionManager = () => {
  const [sectionContent, setSectionContent] = useState({
    title_en: "Why Choose YouNiKco",
    title_zh: "为什么选择 YouNiKco",
    description_en: "With decades of experience in international education, we provide trusted guidance and unforgettable experiences.",
    description_zh: "凭借数十年的国际教育经验，我们提供值得信赖的指导和难忘的体验。",
  });

  const {
    features,
    newFeature,
    setNewFeature,
    addFeature,
    removeFeature,
    moveFeature
  } = useWhyChooseFeatures();

  const handleSave = () => {
    // In a real application, this would save to an API
    toast.success("Why Choose section content saved successfully");
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Why Choose YouNiKco 部分管理</CardTitle>
        <CardDescription>编辑我们优势部分的标题、描述和功能点</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <SectionContentForm 
            sectionContent={sectionContent} 
            setSectionContent={setSectionContent} 
          />
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">特点管理</h3>
            
            <FeatureForm 
              newFeature={newFeature} 
              setNewFeature={setNewFeature} 
              addFeature={addFeature} 
            />
            
            <FeatureList 
              features={features} 
              moveFeature={moveFeature} 
              removeFeature={removeFeature} 
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>保存更改</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhyChooseSectionManager;
