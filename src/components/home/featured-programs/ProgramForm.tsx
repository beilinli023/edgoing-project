
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image } from "lucide-react";

interface ProgramFormProps {
  newProgram: {
    image: string;
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
    location_en: string;
    location_zh: string;
    duration: string;
  };
  setNewProgram: React.Dispatch<React.SetStateAction<{
    image: string;
    title_en: string;
    title_zh: string;
    description_en: string;
    description_zh: string;
    location_en: string;
    location_zh: string;
    duration: string;
  }>>;
  onAdd: () => void;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ newProgram, setNewProgram, onAdd }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <div className="flex flex-col items-center">
          <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center mb-2">
            <Image className="text-gray-500" size={24} />
          </div>
          <Button variant="outline" className="w-full">
            <Upload size={16} className="mr-2" />
            上传图片
          </Button>
        </div>
      </div>
      
      <div className="md:col-span-3 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">项目名称 (英文)</label>
            <Input
              value={newProgram.title_en}
              onChange={e => setNewProgram({ ...newProgram, title_en: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">项目名称 (中文)</label>
            <Input
              value={newProgram.title_zh}
              onChange={e => setNewProgram({ ...newProgram, title_zh: e.target.value })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">项目描述 (英文)</label>
            <Textarea
              value={newProgram.description_en}
              onChange={e => setNewProgram({ ...newProgram, description_en: e.target.value })}
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">项目描述 (中文)</label>
            <Textarea
              value={newProgram.description_zh}
              onChange={e => setNewProgram({ ...newProgram, description_zh: e.target.value })}
              rows={2}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">地点 (英文)</label>
            <Input
              value={newProgram.location_en}
              onChange={e => setNewProgram({ ...newProgram, location_en: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">地点 (中文)</label>
            <Input
              value={newProgram.location_zh}
              onChange={e => setNewProgram({ ...newProgram, location_zh: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">持续时间</label>
            <Input
              value={newProgram.duration}
              onChange={e => setNewProgram({ ...newProgram, duration: e.target.value })}
              placeholder="例如: 2 weeks"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onAdd}>添加项目</Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramForm;
