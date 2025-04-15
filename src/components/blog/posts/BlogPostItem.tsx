
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Calendar, Tag } from "lucide-react";

interface BlogPost {
  id: number | string;
  title_en: string;
  title_zh: string;
  date: string;
  category: string;
  tags: string[];
  status: string;
}

interface BlogPostItemProps {
  post: BlogPost;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
  isDeleting: boolean;
  currentLanguage?: string;
}

const BlogPostItem: React.FC<BlogPostItemProps> = ({
  post,
  onEdit,
  onDelete,
  isDeleting,
  currentLanguage = 'zh'
}) => {
  // 根据当前语言选择显示的标题
  const displayTitle = currentLanguage === 'zh' ? post.title_zh : post.title_en;
  const secondaryTitle = currentLanguage === 'zh' ? post.title_en : post.title_zh;
  
  // 状态文本
  const statusText = {
    published: currentLanguage === 'zh' ? '已发布' : 'Published',
    draft: currentLanguage === 'zh' ? '草稿' : 'Draft'
  };

  // 未设置文本
  const notSetText = currentLanguage === 'zh' ? '未设置' : 'Not set';
  const unCategorizedText = currentLanguage === 'zh' ? '未分类' : 'Uncategorized';
  const dateText = post.date || `${notSetText}${currentLanguage === 'zh' ? '日期' : ' date'}`;
  
  return (
    <div className="grid grid-cols-12 items-center p-3">
      <div className="col-span-6">
        <div className="font-medium">{displayTitle || (currentLanguage === 'zh' ? '无标题' : 'No title')}</div>
        <div className="text-sm text-muted-foreground">{secondaryTitle || (currentLanguage === 'zh' ? '无标题' : 'No title')}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <div className={`rounded-full px-2 py-0.5 ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {statusText[post.status as keyof typeof statusText] || statusText.draft}
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {Array.isArray(post.tags) && post.tags.length > 0 ? post.tags.join(", ") : ''}
          </div>
        </div>
      </div>
      <div className="col-span-2 flex items-center text-sm text-muted-foreground">
        <Calendar className="mr-1 h-3 w-3" />
        {dateText}
      </div>
      <div className="col-span-2 text-sm">{post.category || unCategorizedText}</div>
      <div className="col-span-2 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(post.id)}
          title={currentLanguage === 'zh' ? '编辑' : 'Edit'}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(post.id)}
          disabled={isDeleting}
          title={currentLanguage === 'zh' ? '删除' : 'Delete'}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BlogPostItem;
