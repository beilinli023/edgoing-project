
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BenefitFormProps {
  newBenefit: {
    icon: string;
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
  };
  setNewBenefit: React.Dispatch<React.SetStateAction<{
    icon: string;
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
  }>>;
  addBenefit: () => void;
}

const BenefitForm: React.FC<BenefitFormProps> = ({ 
  newBenefit, 
  setNewBenefit, 
  addBenefit 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-slate-50 mb-4">
        <div>
          <label className="text-sm font-medium mb-1 block">图标</label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={newBenefit.icon}
            onChange={e => setNewBenefit({ ...newBenefit, icon: e.target.value })}
          >
            <option value="award">Award</option>
            <option value="globe">Globe</option>
            <option value="users">Users</option>
            <option value="book">Book</option>
            <option value="star">Star</option>
            <option value="heart">Heart</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (英文)</label>
          <Input
            value={newBenefit.title_en}
            onChange={e => setNewBenefit({ ...newBenefit, title_en: e.target.value })}
            placeholder="例如: Academic Excellence"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">标题 (中文)</label>
          <Input
            value={newBenefit.title_zh}
            onChange={e => setNewBenefit({ ...newBenefit, title_zh: e.target.value })}
            placeholder="例如: 学术卓越"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">描述 (英文)</label>
          <Input
            value={newBenefit.description_en}
            onChange={e => setNewBenefit({ ...newBenefit, description_en: e.target.value })}
            placeholder="Programs designed to enhance..."
          />
        </div>
        
        <div className="md:col-span-1 flex flex-col">
          <label className="text-sm font-medium mb-1 block">描述 (中文)</label>
          <Input
            value={newBenefit.description_zh}
            onChange={e => setNewBenefit({ ...newBenefit, description_zh: e.target.value })}
            placeholder="旨在提高学术表现和技能的项目..."
          />
        </div>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button onClick={addBenefit}>添加好处/特点</Button>
      </div>
    </>
  );
};

export default BenefitForm;
