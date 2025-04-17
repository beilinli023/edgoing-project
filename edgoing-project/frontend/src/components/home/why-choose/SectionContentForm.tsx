
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SectionContentFormProps {
  sectionContent: {
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
  };
  setSectionContent: React.Dispatch<React.SetStateAction<{
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
  }>>;
}

const SectionContentForm: React.FC<SectionContentFormProps> = ({ 
  sectionContent, 
  setSectionContent 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
          <Input
            value={sectionContent.title_en}
            onChange={e => setSectionContent({ ...sectionContent, title_en: e.target.value })}
            placeholder="Why Choose YouNiKco"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
          <Input
            value={sectionContent.title_zh}
            onChange={e => setSectionContent({ ...sectionContent, title_zh: e.target.value })}
            placeholder="为什么选择 YouNiKco"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-1 block">描述 (英文)</label>
          <Textarea
            value={sectionContent.description_en}
            onChange={e => setSectionContent({ ...sectionContent, description_en: e.target.value })}
            placeholder="With decades of experience..."
            rows={3}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">描述 (中文)</label>
          <Textarea
            value={sectionContent.description_zh}
            onChange={e => setSectionContent({ ...sectionContent, description_zh: e.target.value })}
            placeholder="凭借数十年的国际教育经验..."
            rows={3}
          />
        </div>
      </div>
    </>
  );
};

export default SectionContentForm;
