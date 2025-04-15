
import React from "react";
import TagItem, { Tag } from "./TagItem";

interface ColorOption {
  value: string;
  label: string;
}

interface TagListProps {
  tags: Tag[];
  editingId: number | null;
  editedTag: { name_en: string; name_zh: string; color: string };
  colors: ColorOption[];
  onEdit: (id: number) => void;
  onEditInputChange: (field: "name_en" | "name_zh" | "color", value: string) => void;
  onSave: (id: number) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  editingId,
  editedTag,
  colors,
  onEdit,
  onEditInputChange,
  onSave,
  onDelete,
  onCancelEdit
}) => {
  return (
    <div className="divide-y">
      <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
        <div className="col-span-4">英文名称</div>
        <div className="col-span-4">中文名称</div>
        <div className="col-span-2">文章数量</div>
        <div className="col-span-2 text-right">操作</div>
      </div>
      
      {tags.map(tag => (
        <TagItem 
          key={tag.id}
          tag={tag}
          editingId={editingId}
          editedTag={editedTag}
          colors={colors}
          onEdit={onEdit}
          onEditInputChange={onEditInputChange}
          onSave={onSave}
          onDelete={onDelete}
          onCancelEdit={onCancelEdit}
        />
      ))}
      
      {tags.length === 0 && (
        <div className="p-4 text-center text-muted-foreground">
          暂无标签，请点击"添加标签"按钮创建
        </div>
      )}
    </div>
  );
};

export default TagList;
