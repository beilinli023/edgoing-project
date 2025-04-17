
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Globe } from "lucide-react";

interface BlogPostsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
  currentLanguage: string;
  onLanguageSwitch: () => void;
}

const BlogPostsHeader: React.FC<BlogPostsHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onAddNew,
  currentLanguage,
  onLanguageSwitch
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{currentLanguage === 'zh' ? '文章管理' : 'Article Management'}</CardTitle>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLanguageSwitch}
          className="px-2"
        >
          <Globe className="h-4 w-4 mr-1" />
          {currentLanguage === 'zh' ? 'EN' : '中文'}
        </Button>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={currentLanguage === 'zh' ? "搜索文章..." : "Search articles..."}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button size="sm" onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          {currentLanguage === 'zh' ? '新建文章' : 'New Article'}
        </Button>
      </div>
    </CardHeader>
  );
};

export default BlogPostsHeader;
