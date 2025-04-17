
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Eye, Columns } from "lucide-react";
import SingleLanguageView from "./SingleLanguageView";
import SplitLanguageView from "./SplitLanguageView";

interface ProgramPreviewProps {
  formData: any;
  onClose: () => void;
  language: "en" | "zh";
}

const ProgramPreview: React.FC<ProgramPreviewProps> = ({ formData, onClose, language: initialLanguage }) => {
  const [viewMode, setViewMode] = useState<"single" | "split">("single");
  const [language, setLanguage] = useState<"en" | "zh">(initialLanguage);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-lg border-blue-100 flex flex-col">
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <h2 className="text-xl font-bold text-primary">
            项目预览
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex bg-white rounded-md p-1 shadow-sm">
              <Button 
                variant={viewMode === "single" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("single")}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden md:inline">单语言</span>
              </Button>
              <Button 
                variant={viewMode === "split" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("split")}
                className="flex items-center gap-1"
              >
                <Columns className="h-4 w-4" />
                <span className="hidden md:inline">对比模式</span>
              </Button>
            </div>
            
            {viewMode === "single" && (
              <div className="flex bg-white rounded-md p-1 shadow-sm">
                <Button 
                  variant={language === "en" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setLanguage("en")}
                >
                  EN
                </Button>
                <Button 
                  variant={language === "zh" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setLanguage("zh")}
                >
                  中
                </Button>
              </div>
            )}
            
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-blue-200/50 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-auto flex-1">
          {viewMode === "single" ? (
            <SingleLanguageView 
              formData={formData}
              language={language}
            />
          ) : (
            <SplitLanguageView 
              formData={formData}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProgramPreview;
