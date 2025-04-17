
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FeaturedProgramsContent } from '@/services/featured-programs/featuredProgramsService';

interface IntroContentFormProps {
  introContent: FeaturedProgramsContent;
  setIntroContent: React.Dispatch<React.SetStateAction<FeaturedProgramsContent>>;
  onSave: () => void;
}

const IntroContentForm: React.FC<IntroContentFormProps> = ({ introContent, setIntroContent, onSave }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
          <Input
            value={introContent.title_en}
            onChange={(e) => setIntroContent({ ...introContent, title_en: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
          <Input
            value={introContent.title_zh}
            onChange={(e) => setIntroContent({ ...introContent, title_zh: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">副标题 (英文)</label>
          <Textarea
            value={introContent.subtitle_en}
            onChange={(e) => setIntroContent({ ...introContent, subtitle_en: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">副标题 (中文)</label>
          <Textarea
            value={introContent.subtitle_zh}
            onChange={(e) => setIntroContent({ ...introContent, subtitle_zh: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">链接文本 (英文)</label>
          <Input
            value={introContent.link_text_en}
            onChange={(e) => setIntroContent({ ...introContent, link_text_en: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">链接文本 (中文)</label>
          <Input
            value={introContent.link_text_zh}
            onChange={(e) => setIntroContent({ ...introContent, link_text_zh: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">链接URL</label>
          <Input
            value={introContent.link_url}
            onChange={(e) => setIntroContent({ ...introContent, link_url: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave}>保存简介内容</Button>
      </div>
    </div>
  );
};

export default IntroContentForm;
