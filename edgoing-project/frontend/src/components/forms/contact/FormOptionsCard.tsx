
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormOptionsList from "./FormOptionsList";
import { FormOption } from "@/types/contactFormTypes";

interface FormOptionsCardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  programTypes: FormOption[];
  setProgramTypes: React.Dispatch<React.SetStateAction<FormOption[]>>;
  destinations: FormOption[];
  setDestinations: React.Dispatch<React.SetStateAction<FormOption[]>>;
  learningInterests: FormOption[];
  setLearningInterests: React.Dispatch<React.SetStateAction<FormOption[]>>;
  toggleOptionEnabled: (list: FormOption[], setList: React.Dispatch<React.SetStateAction<FormOption[]>>, id: string) => void;
  updateOptionText: (list: FormOption[], setList: React.Dispatch<React.SetStateAction<FormOption[]>>, id: string, field: 'text_en' | 'text_zh', value: string) => void;
  addNewOption: (list: FormOption[], setList: React.Dispatch<React.SetStateAction<FormOption[]>>, defaultEnName: string, defaultZhName: string) => void;
  removeOption: (list: FormOption[], setList: React.Dispatch<React.SetStateAction<FormOption[]>>, id: string) => void;
}

const FormOptionsCard: React.FC<FormOptionsCardProps> = ({
  activeTab,
  setActiveTab,
  programTypes,
  setProgramTypes,
  destinations,
  setDestinations,
  learningInterests,
  setLearningInterests,
  toggleOptionEnabled,
  updateOptionText,
  addNewOption,
  removeOption
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>表单选项管理</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full grid grid-cols-3">
            <TabsTrigger value="program-types">项目类型</TabsTrigger>
            <TabsTrigger value="destinations">目的地</TabsTrigger>
            <TabsTrigger value="learning-interests">学习兴趣</TabsTrigger>
          </TabsList>
          
          <TabsContent value="program-types">
            <FormOptionsList
              options={programTypes}
              setOptions={setProgramTypes}
              toggleOptionEnabled={toggleOptionEnabled}
              updateOptionText={updateOptionText}
              addNewOption={addNewOption}
              removeOption={removeOption}
              defaultEnName="New Program Type"
              defaultZhName="新项目类型"
            />
          </TabsContent>
          
          <TabsContent value="destinations">
            <FormOptionsList
              options={destinations}
              setOptions={setDestinations}
              toggleOptionEnabled={toggleOptionEnabled}
              updateOptionText={updateOptionText}
              addNewOption={addNewOption}
              removeOption={removeOption}
              defaultEnName="New Destination"
              defaultZhName="新目的地"
            />
          </TabsContent>
          
          <TabsContent value="learning-interests">
            <FormOptionsList
              options={learningInterests}
              setOptions={setLearningInterests}
              toggleOptionEnabled={toggleOptionEnabled}
              updateOptionText={updateOptionText}
              addNewOption={addNewOption}
              removeOption={removeOption}
              defaultEnName="New Interest"
              defaultZhName="新兴趣领域"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FormOptionsCard;
