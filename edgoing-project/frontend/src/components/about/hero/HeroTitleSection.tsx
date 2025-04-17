
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HeroTitleSectionProps {
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  onChange: (field: string, value: string) => void;
}

const HeroTitleSection: React.FC<HeroTitleSectionProps> = ({
  title_en,
  title_zh,
  subtitle_en,
  subtitle_zh,
  onChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
          <Input
            value={title_en}
            onChange={e => onChange("title_en", e.target.value)}
            placeholder="About YOUNIKCO"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
          <Input
            value={title_zh}
            onChange={e => onChange("title_zh", e.target.value)}
            placeholder="关于 YOUNIKCO"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-1 block">副标题 (英文)</label>
          <Textarea
            value={subtitle_en}
            onChange={e => onChange("subtitle_en", e.target.value)}
            placeholder="Empowering global education and cultural exchange"
            rows={3}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">副标题 (中文)</label>
          <Textarea
            value={subtitle_zh}
            onChange={e => onChange("subtitle_zh", e.target.value)}
            placeholder="赋能全球教育和文化交流"
            rows={3}
          />
        </div>
      </div>
    </>
  );
};

export default HeroTitleSection;
