
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import IntroContentForm from "./featured-programs/IntroContentForm";
import ProgramForm from "./featured-programs/ProgramForm";
import ProgramList from "./featured-programs/ProgramList";
import { useFeaturedPrograms } from "./featured-programs/useFeaturedPrograms";
import { Loader2 } from "lucide-react";

const FeaturedProgramsManager = () => {
  const {
    introContent,
    setIntroContent,
    programs,
    newProgram,
    setNewProgram,
    addProgram,
    removeProgram,
    moveProgram,
    saveIntroContent,
    saveAllChanges,
    isLoading
  } = useFeaturedPrograms();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>精选项目简介</CardTitle>
          <CardDescription>编辑精选项目部分的标题和描述</CardDescription>
        </CardHeader>
        <CardContent>
          <IntroContentForm 
            introContent={introContent}
            setIntroContent={setIntroContent}
            onSave={saveIntroContent}
          />
        </CardContent>
      </Card>
      
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>精选项目管理</CardTitle>
          <CardDescription>添加、编辑和管理首页展示的精选项目</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border rounded-md p-4 bg-slate-50">
              <h3 className="text-lg font-medium mb-4">添加新项目</h3>
              <ProgramForm 
                newProgram={newProgram}
                setNewProgram={setNewProgram}
                onAdd={addProgram}
              />
            </div>
            
            <ProgramList 
              programs={programs}
              onMove={moveProgram}
              onRemove={removeProgram}
            />
            
            <div className="flex justify-end">
              <Button onClick={saveAllChanges}>保存所有更改</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProgramsManager;
