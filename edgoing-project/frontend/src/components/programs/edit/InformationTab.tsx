
import React from "react";
import LanguageRichTextEditor from "../../wysiwyg/LanguageRichTextEditor";

interface InformationTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

const InformationTab = ({ formData, handleInputChange }: InformationTabProps) => {
  return (
    <LanguageRichTextEditor
      title="项目信息"
      zhLabel="中文信息"
      enLabel="英文信息"
      zhContent={formData.information}
      enContent={formData.informationEn}
      zhPlaceholder="请输入项目信息（中文）"
      enPlaceholder="Please enter program information (English)"
      helpTextZh="提示：使用列表按钮创建项目符号列表"
      helpTextEn="Tip: Use the list button to create bullet points"
      onZhChange={(html) => handleInputChange("information", html)}
      onEnChange={(html) => handleInputChange("informationEn", html)}
    />
  );
};

export default InformationTab;
