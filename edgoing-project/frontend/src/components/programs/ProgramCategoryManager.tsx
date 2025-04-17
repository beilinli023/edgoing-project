
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// 模拟获取分类数据的函数
const fetchCategories = async () => {
  // 这里应该是从API获取数据，目前使用模拟数据
  return [
    { id: "1", nameEn: "Academic Study", nameCn: "学术研究", count: 12 },
    { id: "2", nameEn: "Cultural Experience", nameCn: "文化体验", count: 8 },
    { id: "3", nameEn: "Language Learning", nameCn: "语言学习", count: 5 },
    { id: "4", nameEn: "Sports & Activities", nameCn: "体育活动", count: 3 },
  ];
};

const ProgramCategoryManager = () => {
  const [newCategory, setNewCategory] = useState({ nameEn: "", nameCn: "" });
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['programCategories'],
    queryFn: fetchCategories
  });

  const handleAddCategory = () => {
    if (newCategory.nameEn && newCategory.nameCn) {
      console.log("添加新分类:", newCategory);
      // 这里应该调用API添加分类
      setNewCategory({ nameEn: "", nameCn: "" });
    }
  };

  const handleStartEdit = (category: any) => {
    setEditingCategory({ ...category });
  };

  const handleSaveEdit = () => {
    if (editingCategory && editingCategory.nameEn && editingCategory.nameCn) {
      console.log("保存编辑:", editingCategory);
      // 这里应该调用API保存编辑
      setEditingCategory(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("确定要删除此分类吗？此操作可能会影响已分配到该分类的项目。")) {
      console.log("删除分类:", id);
      // 这里应该调用API删除分类
    }
  };

  return (
    <div>
      <Card className="mb-6 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">添加新分类</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="英文名称 (English Name)"
              value={newCategory.nameEn}
              onChange={(e) => setNewCategory({ ...newCategory, nameEn: e.target.value })}
            />
            <Input
              placeholder="中文名称 (Chinese Name)"
              value={newCategory.nameCn}
              onChange={(e) => setNewCategory({ ...newCategory, nameCn: e.target.value })}
            />
          </div>
          <Button onClick={handleAddCategory} disabled={!newCategory.nameEn || !newCategory.nameCn}>
            <Plus className="mr-2 h-4 w-4" /> 添加分类
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <p>加载中...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardContent className="p-4">
                {editingCategory && editingCategory.id === category.id ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        placeholder="英文名称 (English Name)"
                        value={editingCategory.nameEn}
                        onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                      />
                      <Input
                        placeholder="中文名称 (Chinese Name)"
                        value={editingCategory.nameCn}
                        onChange={(e) => setEditingCategory({ ...editingCategory, nameCn: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit}>保存</Button>
                      <Button variant="outline" onClick={handleCancelEdit}>取消</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{category.nameEn}</h3>
                      <p className="text-sm text-gray-500">{category.nameCn}</p>
                      <p className="text-xs text-gray-400">关联项目数: {category.count}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={category.count > 0}
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

export default ProgramCategoryManager;
