
import React from "react";
import LanguageRichTextEditor from "../../wysiwyg/LanguageRichTextEditor";

interface ItineraryTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

const ItineraryTab = ({ formData, handleInputChange }: ItineraryTabProps) => {
  return (
    <LanguageRichTextEditor
      title="项目行程"
      zhLabel="中文行程"
      enLabel="英文行程"
      zhContent={formData.itinerary}
      enContent={formData.itineraryEn}
      zhPlaceholder="请输入项目行程（中文），每天的活动可以用'第X天：'开头"
      enPlaceholder="Please enter program itinerary (English), use 'Day X:' to start each day's activities"
      helpTextZh="提示：使用'第X天：'格式开始每一天的行程安排"
      helpTextEn="Tip: Use 'Day X:' format to start each day's itinerary"
      onZhChange={(html) => handleInputChange("itinerary", html)}
      onEnChange={(html) => handleInputChange("itineraryEn", html)}
    />
  );
};

export default ItineraryTab;
