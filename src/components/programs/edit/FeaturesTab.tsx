
import React from "react";
import LanguageRichTextEditor from "../../wysiwyg/LanguageRichTextEditor";

interface FeaturesTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

const FeaturesTab = ({ formData, handleInputChange }: FeaturesTabProps) => {
  return (
    <LanguageRichTextEditor
      title="项目特色"
      zhLabel="中文特色"
      enLabel="英文特色"
      zhContent={formData.features}
      enContent={formData.featuresEn}
      zhPlaceholder="请输入项目特色（中文）"
      enPlaceholder="Please enter program features (English)"
      helpTextZh="提示：使用列表按钮创建项目符号列表"
      helpTextEn="Tip: Use the list button to create bullet points"
      onZhChange={(html) => handleInputChange("features", html)}
      onEnChange={(html) => handleInputChange("featuresEn", html)}
    />
  );
};

export default FeaturesTab;
