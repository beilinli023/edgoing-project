
import React from "react";
import { Button } from "@/components/ui/button";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  ImageIcon
} from "lucide-react";

interface EnhancedRichTextToolbarProps {
  onInsertImage: () => void;
  onApplyStyle: (style: string) => void;
}

const EnhancedRichTextToolbar: React.FC<EnhancedRichTextToolbarProps> = ({ 
  onInsertImage, 
  onApplyStyle 
}) => {
  return (
    <div className="flex items-center gap-1 bg-muted/50 p-2 border-b">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onApplyStyle("bold")}
        title="粗体"
      >
        <BoldIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onApplyStyle("italic")}
        title="斜体"
      >
        <ItalicIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onApplyStyle("h1")}
        title="一级标题"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onApplyStyle("h2")}
        title="二级标题"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onApplyStyle("list")}
        title="列表"
      >
        <ListIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onApplyStyle("link")}
        title="链接"
      >
        <Link className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onInsertImage()}
        title="插入图片"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onApplyStyle("alignLeft")}
        title="左对齐"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onApplyStyle("alignCenter")}
        title="居中对齐"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onApplyStyle("alignRight")}
        title="右对齐"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EnhancedRichTextToolbar;
