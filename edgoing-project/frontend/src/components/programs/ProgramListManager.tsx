
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgramOrderManager from "./ProgramOrderManager";
import { Program } from "@/types/programTypes";

// Interface for admin program format
interface AdminProgram {
  id: string;
  title: string;
  titleEn: string;
  thumbnail: string;
  category: string;
  location: string;
  duration: string;
  gradeLevel: string;
  tags: string[];
}

// Mock function to fetch programs for admin
const fetchPrograms = async (): Promise<AdminProgram[]> => {
  // This should fetch from API in production
  return [
    {
      id: "USART-2023-001",
      title: "美国艺术之旅",
      titleEn: "US Art Tour",
      thumbnail: "/placeholder.svg",
      category: "Cultural Experience",
      location: "United States",
      duration: "2 weeks",
      gradeLevel: "Grade 9-12",
      tags: ["Art", "Culture"]
    },
    {
      id: "UKACA-2023-002",
      title: "英国学术交流",
      titleEn: "UK Academic Exchange",
      thumbnail: "/placeholder.svg",
      category: "Academic Study",
      location: "United Kingdom",
      duration: "3 weeks",
      gradeLevel: "Grade 10-12",
      tags: ["Academic", "Exchange"]
    }
  ];
};

const ProgramListManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const navigate = useNavigate();

  const { data: programs = [], isLoading, refetch } = useQuery({
    queryKey: ['programs'],
    queryFn: fetchPrograms
  });

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProgram = () => {
    navigate("/admin/programs/add");
  };

  const handleEditProgram = (id: string) => {
    navigate(`/admin/programs/edit/${id}`);
  };

  const handleDeleteProgram = (id: string) => {
    if (window.confirm("确定要删除此项目吗？此操作不可撤销。")) {
      console.log("删除项目:", id);
      // Call API to delete the program
    }
  };

  const handleOrderChange = () => {
    // Refresh the list after order changes
    refetch();
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">项目列表</TabsTrigger>
          <TabsTrigger value="order">排序管理</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索项目名称..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddProgram} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> 添加新项目
            </Button>
          </div>

          {isLoading ? (
            <p>加载中...</p>
          ) : filteredPrograms.length === 0 ? (
            <p>没有找到匹配的项目</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden bg-gray-100">
                    <img
                      src={program.thumbnail}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{program.title}</h3>
                        <p className="text-sm text-gray-500">{program.titleEn}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProgram(program.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProgram(program.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {program.category}
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        {program.location}
                      </div>
                      <div className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                        {program.duration}
                      </div>
                      <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        {program.gradeLevel}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {program.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="order">
          <ProgramOrderManager programs={programs} onOrderChange={handleOrderChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgramListManager;
