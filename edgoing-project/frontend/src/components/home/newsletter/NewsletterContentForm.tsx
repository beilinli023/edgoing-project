
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NewsletterContent {
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  button_text_en: string;
  button_text_zh: string;
  placeholder_en: string;
  placeholder_zh: string;
}

interface NewsletterContentFormProps {
  newsletterContent: NewsletterContent;
  handleChange: (field: keyof NewsletterContent, value: string) => void;
}

const NewsletterContentForm: React.FC<NewsletterContentFormProps> = ({ 
  newsletterContent, 
  handleChange 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title_en">标题 (英文)</Label>
          <Input
            id="title_en"
            value={newsletterContent.title_en}
            onChange={(e) => handleChange('title_en', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title_zh">标题 (中文)</Label>
          <Input
            id="title_zh"
            value={newsletterContent.title_zh}
            onChange={(e) => handleChange('title_zh', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="description_en">描述 (英文)</Label>
          <Textarea
            id="description_en"
            rows={3}
            value={newsletterContent.description_en}
            onChange={(e) => handleChange('description_en', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_zh">描述 (中文)</Label>
          <Textarea
            id="description_zh"
            rows={3}
            value={newsletterContent.description_zh}
            onChange={(e) => handleChange('description_zh', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="button_text_en">按钮文本 (英文)</Label>
          <Input
            id="button_text_en"
            value={newsletterContent.button_text_en}
            onChange={(e) => handleChange('button_text_en', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="button_text_zh">按钮文本 (中文)</Label>
          <Input
            id="button_text_zh"
            value={newsletterContent.button_text_zh}
            onChange={(e) => handleChange('button_text_zh', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="placeholder_en">输入框占位符 (英文)</Label>
          <Input
            id="placeholder_en"
            value={newsletterContent.placeholder_en}
            onChange={(e) => handleChange('placeholder_en', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="placeholder_zh">输入框占位符 (中文)</Label>
          <Input
            id="placeholder_zh"
            value={newsletterContent.placeholder_zh}
            onChange={(e) => handleChange('placeholder_zh', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default NewsletterContentForm;
