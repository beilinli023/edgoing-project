
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Edit, 
  Plus, 
  Trash, 
  Folder,
  Save,
  X
} from "lucide-react";

const CATEGORIES_MOCK = [
  {
    id: 1,
    name_en: "Study Tips",
    name_zh: "学习技巧",
    slug: "study-tips",
    count: 5
  },
  {
    id: 2,
    name_en: "Cultural Exchange",
    name_zh: "文化交流",
    slug: "cultural-exchange",
    count: 3
  },
  {
    id: 3,
    name_en: "Program Reviews",
    name_zh: "项目评测",
    slug: "program-reviews",
    count: 2
  },
  {
    id: 4,
    name_en: "Travel Guides",
    name_zh: "旅行指南",
    slug: "travel-guides",
    count: 4
  }
];

const BlogCategoriesManager = () => {
  const [categories, setCategories] = useState(CATEGORIES_MOCK);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState({ name_en: "", name_zh: "" });
  const [editedCategory, setEditedCategory] = useState({ name_en: "", name_zh: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (id: number) => {
    const categoryToEdit = categories.find(cat => cat.id === id);
    if (categoryToEdit) {
      setEditedCategory({ 
        name_en: categoryToEdit.name_en, 
        name_zh: categoryToEdit.name_zh 
      });
      setEditingId(id);
    }
  };

  const handleSave = (id: number) => {
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { 
            ...cat, 
            name_en: editedCategory.name_en, 
            name_zh: editedCategory.name_zh,
            slug: editedCategory.name_en.toLowerCase().replace(/\s+/g, '-')
          } 
        : cat
    ));
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("确定要删除这个分类吗？相关文章将变为未分类状态。")) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleAddNew = () => {
    if (newCategory.name_en.trim() && newCategory.name_zh.trim()) {
      const newId = Math.max(...categories.map(cat => cat.id), 0) + 1;
      setCategories([
        ...categories,
        {
          id: newId,
          name_en: newCategory.name_en,
          name_zh: newCategory.name_zh,
          slug: newCategory.name_en.toLowerCase().replace(/\s+/g, '-'),
          count: 0
        }
      ]);
      setNewCategory({ name_en: "", name_zh: "" });
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>分类管理</CardTitle>
        <Button size="sm" onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          添加分类
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          {isAdding && (
            <div className="p-3 bg-muted/30 border-b">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium mb-1">英文名称</label>
                  <Input 
                    value={newCategory.name_en}
                    onChange={e => setNewCategory({...newCategory, name_en: e.target.value})}
                    placeholder="e.g. Study Tips"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">中文名称</label>
                  <Input 
                    value={newCategory.name_zh}
                    onChange={e => setNewCategory({...newCategory, name_zh: e.target.value})}
                    placeholder="例如：学习技巧"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategory({ name_en: "", name_zh: "" });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  取消
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAddNew}
                  disabled={!newCategory.name_en.trim() || !newCategory.name_zh.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
            <div className="col-span-4">英文名称</div>
            <div className="col-span-4">中文名称</div>
            <div className="col-span-2">文章数量</div>
            <div className="col-span-2 text-right">操作</div>
          </div>
          
          <div className="divide-y">
            {categories.map(category => (
              <div key={category.id} className="grid grid-cols-12 items-center p-3">
                {editingId === category.id ? (
                  <>
                    <div className="col-span-4 pr-2">
                      <Input 
                        value={editedCategory.name_en}
                        onChange={e => setEditedCategory({...editedCategory, name_en: e.target.value})}
                      />
                    </div>
                    <div className="col-span-4 pr-2">
                      <Input 
                        value={editedCategory.name_zh}
                        onChange={e => setEditedCategory({...editedCategory, name_zh: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-4 flex items-center gap-2">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span>{category.name_en}</span>
                    </div>
                    <div className="col-span-4">{category.name_zh}</div>
                  </>
                )}
                
                <div className="col-span-2 text-muted-foreground">
                  {category.count} 篇文章
                </div>
                
                <div className="col-span-2 flex justify-end gap-2">
                  {editingId === category.id ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSave(category.id)}
                        disabled={!editedCategory.name_en.trim() || !editedCategory.name_zh.trim()}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(category.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                暂无分类，请点击"添加分类"按钮创建
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCategoriesManager;
