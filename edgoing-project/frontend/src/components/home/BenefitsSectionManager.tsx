
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BenefitForm from "./benefits/BenefitForm";
import BenefitList from "./benefits/BenefitList";
import { useBenefitsManager } from "@/hooks/useBenefitsManager";

const BenefitsSectionManager = () => {
  const {
    benefits,
    newBenefit,
    setNewBenefit,
    addBenefit,
    removeBenefit,
    moveBenefit,
    saveBenefits
  } = useBenefitsManager();

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>好处/特点部分管理</CardTitle>
        <CardDescription>管理首页好处/特点部分的内容</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">          
          <div>
            <h3 className="text-lg font-medium mb-4">好处/特点管理</h3>
            
            <BenefitForm 
              newBenefit={newBenefit}
              setNewBenefit={setNewBenefit}
              addBenefit={addBenefit}
            />
            
            <BenefitList 
              benefits={benefits}
              moveBenefit={moveBenefit}
              removeBenefit={removeBenefit}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={saveBenefits}>保存更改</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BenefitsSectionManager;
