
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, MoveUp, MoveDown, Upload, Image } from "lucide-react";

const TeamManager = () => {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: "1",
      photo: "/placeholder.svg",
      name_en: "Sarah Johnson",
      name_zh: "莎拉·约翰逊",
      position_en: "CEO & Founder",
      position_zh: "首席执行官兼创始人",
      bio_en: "Sarah has over 15 years of experience in international education and has personally led educational tours to more than 20 countries.",
      bio_zh: "莎拉在国际教育领域拥有超过15年的经验，曾亲自带领教育旅游团前往20多个国家。"
    },
    {
      id: "2",
      photo: "/placeholder.svg",
      name_en: "Michael Zhang",
      name_zh: "张明",
      position_en: "Education Director",
      position_zh: "教育总监",
      bio_en: "With a PhD in Education, Michael specializes in creating curriculum that combines academic learning with cultural experiences.",
      bio_zh: "拥有教育学博士学位，张明专注于创建结合学术学习和文化体验的课程。"
    }
  ]);

  const addNewMember = () => {
    const newMember = {
      id: Date.now().toString(),
      photo: "/placeholder.svg",
      name_en: "",
      name_zh: "",
      position_en: "",
      position_zh: "",
      bio_en: "",
      bio_zh: ""
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const removeMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const moveMember = (id, direction) => {
    const index = teamMembers.findIndex(m => m.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === teamMembers.length - 1)
    ) {
      return;
    }
    
    const newTeamMembers = [...teamMembers];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    // 交换位置
    [newTeamMembers[index], newTeamMembers[newIndex]] = [newTeamMembers[newIndex], newTeamMembers[index]];
    setTeamMembers(newTeamMembers);
  };

  const updateMember = (id, field, value) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleSave = () => {
    console.log("保存团队成员内容:", teamMembers);
    // 在这里实现保存到API的逻辑
  };

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>团队成员管理</CardTitle>
          <CardDescription>添加、编辑或删除公司团队成员信息</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={addNewMember} className="mb-6">
            <Plus className="h-4 w-4 mr-2" />
            添加新成员
          </Button>
          
          <div className="space-y-6">
            {teamMembers.map((member, index) => (
              <Card key={member.id} className="border border-gray-200">
                <CardHeader className="bg-gray-50 flex flex-row items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 flex items-center justify-center bg-primary rounded-full text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium truncate max-w-xs">
                      {member.name_en || member.name_zh || `成员 #${index + 1}`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => moveMember(member.id, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => moveMember(member.id, "down")}
                      disabled={index === teamMembers.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMember(member.id)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">照片</label>
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          <Image size={24} className="text-gray-500" />
                        </div>
                        
                        <Button variant="outline">
                          <Upload size={16} className="mr-2" />
                          上传照片
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        建议使用正方形比例的照片，最小尺寸为300x300像素。
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">姓名 (英文)</label>
                        <Input
                          value={member.name_en}
                          onChange={e => updateMember(member.id, "name_en", e.target.value)}
                          placeholder="Name in English"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">姓名 (中文)</label>
                        <Input
                          value={member.name_zh}
                          onChange={e => updateMember(member.id, "name_zh", e.target.value)}
                          placeholder="中文姓名"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">职位 (英文)</label>
                        <Input
                          value={member.position_en}
                          onChange={e => updateMember(member.id, "position_en", e.target.value)}
                          placeholder="Position in English"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">职位 (中文)</label>
                        <Input
                          value={member.position_zh}
                          onChange={e => updateMember(member.id, "position_zh", e.target.value)}
                          placeholder="中文职位"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">简介 (英文)</label>
                        <Textarea
                          value={member.bio_en}
                          onChange={e => updateMember(member.id, "bio_en", e.target.value)}
                          placeholder="Short biography in English"
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">简介 (中文)</label>
                        <Textarea
                          value={member.bio_zh}
                          onChange={e => updateMember(member.id, "bio_zh", e.target.value)}
                          placeholder="中文简介"
                          rows={4}
                        />
                      </div>
                    </div>
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
    </div>
  );
};

export default TeamManager;
