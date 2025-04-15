
import React from "react";
import BlogPostItem from "./BlogPostItem";

interface BlogPost {
  id: number | string;
  title_en: string;
  title_zh: string;
  date: string;
  category: string;
  tags: string[];
  status: string;
}

interface BlogPostsListProps {
  posts: BlogPost[];
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
  isDeleting: boolean;
  searchTerm: string;
  currentLanguage?: string;
}

const BlogPostsList: React.FC<BlogPostsListProps> = ({
  posts,
  onEdit,
  onDelete,
  isDeleting,
  searchTerm,
  currentLanguage = 'zh'
}) => {
  const filteredPosts = posts.filter(post => 
    post?.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post?.title_zh?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isEmpty = filteredPosts.length === 0;
  const isSearching = searchTerm.trim() !== '';
  
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
        <div className="col-span-6">{currentLanguage === 'zh' ? '标题' : 'Title'}</div>
        <div className="col-span-2">{currentLanguage === 'zh' ? '发布日期' : 'Date'}</div>
        <div className="col-span-2">{currentLanguage === 'zh' ? '分类' : 'Category'}</div>
        <div className="col-span-2 text-right">{currentLanguage === 'zh' ? '操作' : 'Actions'}</div>
      </div>
      <div className="divide-y">
        {!isEmpty ? (
          filteredPosts.map(post => (
            <BlogPostItem 
              key={post.id} 
              post={post} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              isDeleting={isDeleting}
              currentLanguage={currentLanguage}
            />
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {isSearching 
              ? (currentLanguage === 'zh' ? "没有找到匹配的文章" : "No matching articles found") 
              : (currentLanguage === 'zh' ? "暂无文章，请点击\"新建文章\"按钮添加" : "No articles yet, click the \"New Article\" button to add one")}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostsList;
