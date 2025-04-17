
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, MoveUp, MoveDown, Image, Plus } from "lucide-react";

interface TeamMember {
  id: string;
  name_en: string;
  name_zh: string;
  position_en: string;
  position_zh: string;
  bio_en: string;
  bio_zh: string;
  image: string;
}

const TeamMemberManager: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name_en: "Zhang Ming",
      name_zh: "张明",
      position_en: "Founder & CEO",
      position_zh: "创始人 & CEO",
      bio_en: "20 years of experience in international education, Harvard Ed.D.",
      bio_zh: "拥有20年国际教育经验，哈佛大学教育学博士。",
      image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "2",
      name_en: "Li Ting",
      name_zh: "李婷",
      position_en: "Academic Director",
      position_zh: "学术总监",
      bio_en: "Former Oxford lecturer, M.Ed, specializing in international curriculum development.",
      bio_zh: "前牛津大学讲师，教育学硕士，专注国际课程开发。",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ]);

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name_en: "",
      name_zh: "",
      position_en: "",
      position_zh: "",
      bio_en: "",
      bio_zh: "",
      image: "https://via.placeholder.com/400x300?text=Upload+Image"
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const moveTeamMember = (id: string, direction: 'up' | 'down') => {
    const index = teamMembers.findIndex(member => member.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === teamMembers.length - 1)
    ) {
      return;
    }
    
    const newMembers = [...teamMembers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];
    setTeamMembers(newMembers);
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSave = () => {
    console.log("Saving team members:", teamMembers);
    // Implement API call to save team members
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>团队成员管理</CardTitle>
        <CardDescription>添加、编辑或删除"关于我们"页面上显示的团队成员</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={addTeamMember} className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          添加新团队成员
        </Button>
        
        <div className="space-y-6">
          {teamMembers.map((member, index) => (
            <Card key={member.id} className="border border-gray-200">
              <CardHeader className="bg-gray-50 flex flex-row items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 flex items-center justify-center bg-primary rounded-full text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-medium">
                    {member.name_en || member.name_zh || `团队成员 #${index + 1}`}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveTeamMember(member.id, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => moveTeamMember(member.id, "down")}
                    disabled={index === teamMembers.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeTeamMember(member.id)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">姓名 (英文)</label>
                        <Input
                          value={member.name_en}
                          onChange={e => updateTeamMember(member.id, "name_en", e.target.value)}
                          placeholder="Name in English"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">职位 (英文)</label>
                        <Input
                          value={member.position_en}
                          onChange={e => updateTeamMember(member.id, "position_en", e.target.value)}
                          placeholder="Position in English"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">简介 (英文)</label>
                        <Textarea
                          value={member.bio_en}
                          onChange={e => updateTeamMember(member.id, "bio_en", e.target.value)}
                          placeholder="Bio in English"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">姓名 (中文)</label>
                        <Input
                          value={member.name_zh}
                          onChange={e => updateTeamMember(member.id, "name_zh", e.target.value)}
                          placeholder="中文姓名"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">职位 (中文)</label>
                        <Input
                          value={member.position_zh}
                          onChange={e => updateTeamMember(member.id, "position_zh", e.target.value)}
                          placeholder="中文职位"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">简介 (中文)</label>
                        <Textarea
                          value={member.bio_zh}
                          onChange={e => updateTeamMember(member.id, "bio_zh", e.target.value)}
                          placeholder="中文简介"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">照片</label>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      {member.image ? (
                        <img src={member.image} alt={member.name_en} className="w-full h-full object-cover" />
                      ) : (
                        <Image size={24} className="text-gray-500" />
                      )}
                    </div>
                    
                    <Button variant="outline">
                      <Upload size={16} className="mr-2" />
                      上传新照片
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    建议使用正方形照片，至少400x400像素。支持JPG、PNG格式。
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>保存所有团队成员</Button>
      </CardFooter>
    </Card>
  );
};

export default TeamMemberManager;
