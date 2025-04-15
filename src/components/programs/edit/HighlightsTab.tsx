
import React from "react";
import LanguageRichTextEditor from "../../wysiwyg/LanguageRichTextEditor";

interface HighlightsTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

const HighlightsTab = ({ formData, handleInputChange }: HighlightsTabProps) => {
  return (
    <LanguageRichTextEditor
      title="项目亮点"
      zhLabel="中文亮点"
      enLabel="英文亮点"
      zhContent={formData.highlights}
      enContent={formData.highlightsEn}
      zhPlaceholder="请输入项目亮点（中文）"
      enPlaceholder="Please enter program highlights (English)"
      helpTextZh="提示：使用段落格式（不使用列表）输入每个亮点，每个亮点单独一个段落"
      helpTextEn="Tip: Enter each highlight as a separate paragraph (do not use lists)"
      onZhChange={(html) => handleInputChange("highlights", html)}
      onEnChange={(html) => handleInputChange("highlightsEn", html)}
    />
  );
};

export default HighlightsTab;
