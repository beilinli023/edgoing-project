
import React from "react";
import LanguageRichTextEditor from "../../wysiwyg/LanguageRichTextEditor";

interface DetailsTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

const DetailsTab = ({ formData, handleInputChange }: DetailsTabProps) => {
  return (
    <LanguageRichTextEditor
      title="项目详细描述"
      zhLabel="中文描述"
      enLabel="英文描述"
      zhContent={formData.description}
      enContent={formData.descriptionEn}
      zhPlaceholder="请输入项目的详细中文描述"
      enPlaceholder="Please enter detailed program description in English"
      onZhChange={(html) => handleInputChange("description", html)}
      onEnChange={(html) => handleInputChange("descriptionEn", html)}
    />
  );
};

export default DetailsTab;
