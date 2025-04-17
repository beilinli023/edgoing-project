
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleRichTextEditor from "./SimpleRichTextEditor";

interface LanguageRichTextEditorProps {
  zhLabel: string;
  enLabel: string;
  zhContent: string;
  enContent: string;
  zhPlaceholder?: string;
  enPlaceholder?: string;
  helpTextZh?: string;
  helpTextEn?: string;
  onZhChange: (html: string) => void;
  onEnChange: (html: string) => void;
  title?: string;
}

const LanguageRichTextEditor: React.FC<LanguageRichTextEditorProps> = ({
  zhLabel,
  enLabel,
  zhContent,
  enContent,
  zhPlaceholder = "请输入内容...",
  enPlaceholder = "Please enter content...",
  helpTextZh,
  helpTextEn,
  onZhChange,
  onEnChange,
  title
}) => {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{zhLabel}</label>
          <SimpleRichTextEditor 
            content={zhContent}
            onChange={onZhChange}
            placeholder={zhPlaceholder}
          />
          {helpTextZh && <p className="text-xs text-gray-500 mt-1">{helpTextZh}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">{enLabel}</label>
          <SimpleRichTextEditor 
            content={enContent}
            onChange={onEnChange}
            placeholder={enPlaceholder}
          />
          {helpTextEn && <p className="text-xs text-gray-500 mt-1">{helpTextEn}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageRichTextEditor;
