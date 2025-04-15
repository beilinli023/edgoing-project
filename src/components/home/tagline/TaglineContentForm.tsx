
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaglineContent } from "@/hooks/useTaglineSection";

interface TaglineContentFormProps {
  taglineContent: TaglineContent;
  onChange: (updatedContent: TaglineContent) => void;
}

const TaglineContentForm: React.FC<TaglineContentFormProps> = ({
  taglineContent,
  onChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
          <Input
            value={taglineContent.title_en}
            onChange={e => onChange({ ...taglineContent, title_en: e.target.value })}
            placeholder="Explore. Learn. Grow."
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
          <Input
            value={taglineContent.title_zh}
            onChange={e => onChange({ ...taglineContent, title_zh: e.target.value })}
            placeholder="探索. 学习. 成长."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium mb-1 block">描述 (英文)</label>
          <Textarea
            value={taglineContent.description_en}
            onChange={e => onChange({ ...taglineContent, description_en: e.target.value })}
            placeholder="At YouNiKco, we believe in providing..."
            rows={4}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">描述 (中文)</label>
          <Textarea
            value={taglineContent.description_zh}
            onChange={e => onChange({ ...taglineContent, description_zh: e.target.value })}
            placeholder="在YouNiKco，我们致力于提供..."
            rows={4}
          />
        </div>
      </div>
    </>
  );
};

export default TaglineContentForm;
