
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Image, Calendar } from "lucide-react";
import { BlogPostFormData } from "@/types/blogTypes";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog";

interface PostSidebarInfoProps {
  formData: BlogPostFormData;
  onInputChange: (field: string, value: any) => void;
  handleTagToggle: (tagId: string) => void;
  openImageGallery: () => void;
}

const PostSidebarInfo: React.FC<PostSidebarInfoProps> = ({ 
  formData, 
  onInputChange,
  handleTagToggle,
  openImageGallery
}) => {
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: () => blogService.taxonomyService.getBlogCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['blogTags'],
    queryFn: () => blogService.taxonomyService.getBlogTags(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return (
    <div className="space-y-4">
      {/* 发布状态 */}
      <Card>
        <CardHeader>
          <CardTitle>发布状态</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.status}
            onValueChange={(value) => onInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择发布状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 特色图片 */}
      <Card>
        <CardHeader>
          <CardTitle>特色图片</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            {formData.featured_image ? (
              <div className="relative">
                <img 
                  src={formData.featured_image} 
                  alt="Featured" 
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute top-2 right-2 bg-white/80"
                  onClick={openImageGallery}
                >
                  更改
                </Button>
              </div>
            ) : (
              <Button onClick={openImageGallery} className="w-full">
                <Image className="h-4 w-4 mr-2" />
                选择特色图片
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            特色图片将显示在博客列表和文章顶部
          </p>
        </CardContent>
      </Card>

      {/* 分类 */}
      <Card>
        <CardHeader>
          <CardTitle>分类</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.category}
            onValueChange={(value) => onInputChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">未分类</SelectItem>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name_zh || category.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 标签 */}
      <Card>
        <CardHeader>
          <CardTitle>标签</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tags.length === 0 ? (
              <p className="text-sm text-gray-500">暂无标签</p>
            ) : (
              tags.map((tag: any) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tag-${tag.id}`}
                    checked={formData.tags.includes(tag.id.toString())}
                    onCheckedChange={() => handleTagToggle(tag.id.toString())}
                  />
                  <label 
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-1.5" 
                      style={{ backgroundColor: tag.color || '#cbd5e1' }}
                    />
                    {tag.name_zh || tag.name_en}
                  </label>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 作者和发布日期 */}
      <Card>
        <CardHeader>
          <CardTitle>其他信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">作者</label>
            <Input 
              value={formData.author}
              onChange={(e) => onInputChange("author", e.target.value)}
              placeholder="作者姓名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">发布日期</label>
            <div className="relative">
              <Input 
                type="date"
                value={formData.date ? formData.date.split('T')[0] : ''}
                onChange={(e) => onInputChange("date", e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostSidebarInfo;
