
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ProgramEditHeaderProps {
  isAdding: boolean;
  onSave: () => void;
  onPreview: () => void;
  isSaving?: boolean;
}

const ProgramEditHeader = ({ 
  isAdding, 
  onSave, 
  onPreview,
  isSaving = false
}: ProgramEditHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Link to="/admin/programs">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {isAdding ? "添加新项目" : "编辑项目"}
          </h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          {isAdding
            ? "创建一个新的教育项目，并填写相关信息"
            : "修改现有项目的信息和内容"}
        </p>
      </div>
      
      <div className="flex gap-2 self-end sm:self-auto">
        <Button variant="outline" onClick={onPreview}>
          <Eye className="mr-2 h-4 w-4" />
          预览
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              保存项目
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProgramEditHeader;
