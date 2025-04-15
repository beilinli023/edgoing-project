
import React, { useState } from "react";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ImageIcon,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { validateImage, uploadImage } from "@/utils/imageUpload";

interface SimpleRichTextEditorProps {
  id?: string;
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const SimpleRichTextEditor: React.FC<SimpleRichTextEditorProps> = ({
  id,
  content,
  onChange,
  placeholder = "开始输入内容...",
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose focus:outline-none w-full max-w-none min-h-[150px] px-3 py-2',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    // 创建一个文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/gif,image/webp';
    
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      
      if (!files || files.length === 0) return;
      
      const file = files[0];
      const validation = validateImage(file);
      
      if (!validation.valid) {
        toast({
          title: "上传失败",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }
      
      try {
        setUploading(true);
        toast({
          title: "上传中",
          description: "正在上传图片，请稍候...",
        });
        
        const imageUrl = await uploadImage(file);
        
        // 将图片插入到编辑器
        editor.chain().focus().setImage({ src: imageUrl }).run();
        
        toast({
          title: "上传成功",
          description: "图片已成功插入到编辑器",
        });
      } catch (error) {
        toast({
          title: "上传失败",
          description: "上传图片时发生错误，请重试",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };
    
    // 触发文件选择
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className={`border rounded-md ${className}`}>
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 p-0 px-2"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive('bold')}
          title="粗体"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 p-0 px-2"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive('italic')}
          title="斜体"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 p-0 px-2"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive('bulletList')}
          title="列表"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 p-0 px-2"
          onClick={setLink}
          data-active={editor.isActive('link')}
          title="添加链接"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 p-0 px-2"
          onClick={addImage}
          disabled={uploading}
          title="插入图片"
        >
          {uploading ? (
            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <EditorContent editor={editor} className="min-h-[150px]" />
    </div>
  );
};

export default SimpleRichTextEditor;
