
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash, Save, X, Tag } from "lucide-react";

export interface Tag {
  id: number;
  name_en: string;
  name_zh: string;
  color?: string;
  count?: number;
}

interface ColorOption {
  value: string;
  label: string;
}

interface TagItemProps {
  tag: Tag;
  editingId: number | null;
  editedTag: { name_en: string; name_zh: string; color: string };
  colors: ColorOption[];
  onEdit: (id: number) => void;
  onEditInputChange: (field: "name_en" | "name_zh" | "color", value: string) => void;
  onSave: (id: number) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
}

const TagItem: React.FC<TagItemProps> = ({
  tag,
  editingId,
  editedTag,
  colors,
  onEdit,
  onEditInputChange,
  onSave,
  onDelete,
  onCancelEdit
}) => {
  const isEditing = editingId === tag.id;

  return (
    <div className="grid grid-cols-12 items-center p-3">
      {isEditing ? (
        <>
          <div className="col-span-4 pr-2">
            <Input 
              value={editedTag.name_en}
              onChange={e => onEditInputChange("name_en", e.target.value)}
            />
          </div>
          <div className="col-span-4 pr-2">
            <Input 
              value={editedTag.name_zh}
              onChange={e => onEditInputChange("name_zh", e.target.value)}
            />
          </div>
          <div className="col-span-2 pr-2">
            <Select value={editedTag.color} onValueChange={value => onEditInputChange("color", value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="选择颜色" />
              </SelectTrigger>
              <SelectContent>
                {colors.map(color => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      ) : (
        <>
          <div className="col-span-4 flex items-center gap-2">
            <span 
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: tag.color || '#cbd5e1' }}
            />
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>{tag.name_en}</span>
          </div>
          <div className="col-span-4">{tag.name_zh}</div>
          <div className="col-span-2 text-muted-foreground">
            {tag.count || 0} 篇文章
          </div>
        </>
      )}
      
      <div className="col-span-2 flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" onClick={onCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onSave(tag.id)}
              disabled={!editedTag.name_en.trim() || !editedTag.name_zh.trim()}
            >
              <Save className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => onEdit(tag.id)} title="编辑">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(tag.id)} title="删除">
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TagItem;
