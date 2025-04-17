
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  fetchGradeLevels, 
  createGradeLevel, 
  updateGradeLevel, 
  deleteGradeLevel,
  GradeLevel
} from "@/services/programs/programGradeLevelService";

const ProgramGradeLevelManager = () => {
  const [newGradeLevel, setNewGradeLevel] = useState({ nameEn: "", nameCn: "" });
  const [editingGradeLevel, setEditingGradeLevel] = useState<any>(null);
  
  const queryClient = useQueryClient();

  // Fetch grade levels using the mock data
  const { data: gradeLevels = [], isLoading } = useQuery({
    queryKey: ['programGradeLevels'],
    queryFn: fetchGradeLevels
  });

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: (gradeLevel: { name_en: string, name_zh: string }) => 
      createGradeLevel(gradeLevel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programGradeLevels'] });
      toast.success("年级级别添加成功");
    },
    onError: (error) => {
      toast.error("添加失败: " + (error as Error).message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: { name_en: string, name_zh: string } }) => 
      updateGradeLevel(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programGradeLevels'] });
      toast.success("年级级别更新成功");
    },
    onError: (error) => {
      toast.error("更新失败: " + (error as Error).message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGradeLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programGradeLevels'] });
      toast.success("年级级别删除成功");
    },
    onError: (error) => {
      toast.error("删除失败: " + (error as Error).message);
    }
  });

  const handleAddGradeLevel = () => {
    if (newGradeLevel.nameEn && newGradeLevel.nameCn) {
      createMutation.mutate({
        name_en: newGradeLevel.nameEn,
        name_zh: newGradeLevel.nameCn
      });
      setNewGradeLevel({ nameEn: "", nameCn: "" });
    }
  };

  const handleStartEdit = (gradeLevel: GradeLevel) => {
    setEditingGradeLevel({
      id: gradeLevel.id,
      nameEn: gradeLevel.name_en,
      nameCn: gradeLevel.name_zh
    });
  };

  const handleSaveEdit = () => {
    if (editingGradeLevel && editingGradeLevel.nameEn && editingGradeLevel.nameCn) {
      updateMutation.mutate({
        id: editingGradeLevel.id,
        updates: {
          name_en: editingGradeLevel.nameEn,
          name_zh: editingGradeLevel.nameCn
        }
      });
      setEditingGradeLevel(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingGradeLevel(null);
  };

  const handleDeleteGradeLevel = (id: string, programCount: number = 0) => {
    if (programCount > 0) {
      toast.error("无法删除此年级级别，因为有关联的项目");
      return;
    }
    
    if (window.confirm("确定要删除此年级级别吗？")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <Card className="mb-6 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">添加新年级级别</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="英文名称 (English Name)"
              value={newGradeLevel.nameEn}
              onChange={(e) => setNewGradeLevel({ ...newGradeLevel, nameEn: e.target.value })}
            />
            <Input
              placeholder="中文名称 (Chinese Name)"
              value={newGradeLevel.nameCn}
              onChange={(e) => setNewGradeLevel({ ...newGradeLevel, nameCn: e.target.value })}
            />
          </div>
          <Button 
            onClick={handleAddGradeLevel} 
            disabled={!newGradeLevel.nameEn || !newGradeLevel.nameCn || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <span className="flex items-center">
                <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                处理中...
              </span>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> 添加年级级别
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <p>加载中...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {gradeLevels.map((gradeLevel: GradeLevel) => (
            <Card key={gradeLevel.id} className="overflow-hidden">
              <CardContent className="p-4">
                {editingGradeLevel && editingGradeLevel.id === gradeLevel.id ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        placeholder="英文名称 (English Name)"
                        value={editingGradeLevel.nameEn}
                        onChange={(e) => setEditingGradeLevel({ ...editingGradeLevel, nameEn: e.target.value })}
                      />
                      <Input
                        placeholder="中文名称 (Chinese Name)"
                        value={editingGradeLevel.nameCn}
                        onChange={(e) => setEditingGradeLevel({ ...editingGradeLevel, nameCn: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? '保存中...' : '保存'}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>取消</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{gradeLevel.name_en}</h3>
                      <p className="text-sm text-gray-500">{gradeLevel.name_zh}</p>
                      <p className="text-xs text-gray-400">关联项目数: {gradeLevel.count || 0}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(gradeLevel)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGradeLevel(gradeLevel.id, gradeLevel.count || 0)}
                        disabled={deleteMutation.isPending || (gradeLevel.count && gradeLevel.count > 0)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramGradeLevelManager;
