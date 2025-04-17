
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FeatureFormProps {
  newFeature: {
    icon: string;
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
  };
  setNewFeature: React.Dispatch<React.SetStateAction<{
    icon: string;
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
  }>>;
  addFeature: () => void;
}

const FeatureForm: React.FC<FeatureFormProps> = ({ 
  newFeature, 
  setNewFeature, 
  addFeature 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-slate-50 mb-4">
        <div>
          <label className="text-sm font-medium mb-1 block">图标</label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={newFeature.icon}
            onChange={e => setNewFeature({ ...newFeature, icon: e.target.value })}
          >
            <option value="star">Star</option>
            <option value="globe">Globe</option>
            <option value="shield">Shield</option>
            <option value="book">Book</option>
            <option value="users">Users</option>
            <option value="award">Award</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
          <Input
            value={newFeature.title_en}
            onChange={e => setNewFeature({ ...newFeature, title_en: e.target.value })}
            placeholder="例如: Expert Guidance"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
          <Input
            value={newFeature.title_zh}
            onChange={e => setNewFeature({ ...newFeature, title_zh: e.target.value })}
            placeholder="例如: 专业指导"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">描述 (英文)</label>
          <Input
            value={newFeature.description_en}
            onChange={e => setNewFeature({ ...newFeature, description_en: e.target.value })}
            placeholder="Our advisors have extensive experience..."
          />
        </div>
        
        <div className="md:col-span-1 flex flex-col">
          <label className="text-sm font-medium mb-1 block">描述 (中文)</label>
          <Input
            value={newFeature.description_zh}
            onChange={e => setNewFeature({ ...newFeature, description_zh: e.target.value })}
            placeholder="我们的顾问在国际教育方面拥有丰富的经验..."
          />
        </div>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button onClick={addFeature}>添加特点</Button>
      </div>
    </>
  );
};

export default FeatureForm;
