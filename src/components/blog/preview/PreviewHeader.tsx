
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Eye, Columns } from "lucide-react";

interface PreviewHeaderProps {
  onClose: () => void;
  viewMode: "single" | "split";
  setViewMode: (mode: "single" | "split") => void;
  language: "en" | "zh";
  setLanguage: (lang: "en" | "zh") => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  onClose,
  viewMode,
  setViewMode,
  language,
  setLanguage
}) => {
  return (
    <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
      <h2 className="text-xl font-bold text-primary">
        文章预览
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
  );
};

export default PreviewHeader;
