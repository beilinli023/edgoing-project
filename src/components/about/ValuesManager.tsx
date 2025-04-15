
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AboutValue } from "@/types/aboutTypes";
import ValueItem from "./values/ValueItem";
import { useValuesManager } from "@/hooks/useValuesManager";

interface ValuesManagerProps {
  valuesData?: AboutValue[];
  onUpdate: (data: AboutValue[]) => void;
}

const ValuesManager: React.FC<ValuesManagerProps> = ({ valuesData, onUpdate }) => {
  const { values, addNewValue, removeValue, moveValue, updateValue } = useValuesManager(valuesData, onUpdate);

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>公司价值观管理</CardTitle>
          <CardDescription>编辑公司的核心价值观内容，可添加、删除或重新排序</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={addNewValue} className="mb-6">
            <Plus className="h-4 w-4 mr-2" />
            添加新价值观
          </Button>
          
          <div className="space-y-6">
            {values.map((value, index) => (
              <ValueItem
                key={value.id}
                value={value}
                index={index}
                totalValues={values.length}
                onUpdate={updateValue}
                onMove={moveValue}
                onRemove={removeValue}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuesManager;
