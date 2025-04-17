
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import TagForm from "./tags/TagForm";
import TagList from "./tags/TagList";
import { Tag } from "./tags/TagItem";

const TAGS_MOCK: Tag[] = [
  {
    id: 1,
    name_en: "Academic",
    name_zh: "学术",
    count: 8,
    color: "#2563eb"
  },
  {
    id: 2,
    name_en: "University",
    name_zh: "大学",
    count: 5,
    color: "#f59e0b"
  },
  {
    id: 3,
    name_en: "Europe",
    name_zh: "欧洲",
    count: 4,
    color: "#4f46e5"
  },
  {
    id: 4,
    name_en: "Culture",
    name_zh: "文化",
    count: 6,
    color: "#10b981"
  },
  {
    id: 5,
    name_en: "Visa",
    name_zh: "签证",
    count: 3,
    color: "#ef4444"
  }
];

const COLORS = [
  { value: "#2563eb", label: "蓝色" },
  { value: "#4f46e5", label: "紫色" },
  { value: "#10b981", label: "绿色" },
  { value: "#f59e0b", label: "橙色" },
  { value: "#ef4444", label: "红色" },
  { value: "#6b7280", label: "灰色" }
];

const BlogTagsManager = () => {
  const [tags, setTags] = useState<Tag[]>(TAGS_MOCK);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTag, setNewTag] = useState({ name_en: "", name_zh: "", color: "#2563eb" });
  const [editedTag, setEditedTag] = useState({ name_en: "", name_zh: "", color: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (id: number) => {
    const tagToEdit = tags.find(tag => tag.id === id);
    if (tagToEdit) {
      setEditedTag({ 
        name_en: tagToEdit.name_en, 
        name_zh: tagToEdit.name_zh,
        color: tagToEdit.color
      });
      setEditingId(id);
    }
  };

  const handleSave = (id: number) => {
    setTags(tags.map(tag => 
      tag.id === id 
        ? { 
            ...tag, 
            name_en: editedTag.name_en, 
            name_zh: editedTag.name_zh,
            color: editedTag.color
          } 
        : tag
    ));
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("确定要删除这个标签吗？相关文章中的此标签将被移除。")) {
      setTags(tags.filter(tag => tag.id !== id));
    }
  };

  const handleAddNew = () => {
    if (newTag.name_en.trim() && newTag.name_zh.trim()) {
      const newId = Math.max(...tags.map(tag => tag.id), 0) + 1;
      setTags([
        ...tags,
        {
          id: newId,
          name_en: newTag.name_en,
          name_zh: newTag.name_zh,
          count: 0,
          color: newTag.color
        }
      ]);
      setNewTag({ name_en: "", name_zh: "", color: "#2563eb" });
      setIsAdding(false);
    }
  };

  const handleNewTagChange = (field: "name_en" | "name_zh" | "color", value: string) => {
    setNewTag({ ...newTag, [field]: value });
  };

  const handleEditInputChange = (field: "name_en" | "name_zh" | "color", value: string) => {
    setEditedTag({ ...editedTag, [field]: value });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>标签管理</CardTitle>
        <Button size="sm" onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          添加标签
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          {isAdding && (
            <TagForm 
              tagName={{ en: newTag.name_en, zh: newTag.name_zh }}
              color={newTag.color}
              colors={COLORS}
              onInputChange={handleNewTagChange}
              onCancel={() => {
                setIsAdding(false);
                setNewTag({ name_en: "", name_zh: "", color: "#2563eb" });
              }}
              onSave={handleAddNew}
              isValid={newTag.name_en.trim() !== "" && newTag.name_zh.trim() !== ""}
            />
          )}
          
          <TagList 
            tags={tags}
            editingId={editingId}
            editedTag={editedTag}
            colors={COLORS}
            onEdit={handleEdit}
            onEditInputChange={handleEditInputChange}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancelEdit={() => setEditingId(null)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogTagsManager;
