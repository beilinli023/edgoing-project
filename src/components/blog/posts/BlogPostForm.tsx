import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPostFormData, BlogCategory, BlogTag } from '@/types/blogTypes';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import SimpleRichTextEditor from '@/components/wysiwyg/SimpleRichTextEditor';
import { getMockCategories, getMockTags } from '@/services/blog/mockData';
import { useLanguage } from '@/context/LanguageContext';

interface BlogPostFormProps {
  initialData?: Partial<BlogPostFormData>;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  isLoading?: boolean;
  isEditMode?: boolean;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ 
  initialData, 
  onSubmit,
  isLoading = false,
  isEditMode = false
}) => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const [formData, setFormData] = useState<BlogPostFormData>({
    title_en: initialData?.title_en || '',
    title_zh: initialData?.title_zh || '',
    content_en: initialData?.content_en || '',
    content_zh: initialData?.content_zh || '',
    excerpt_en: initialData?.excerpt_en || '',
    excerpt_zh: initialData?.excerpt_zh || '',
    slug: initialData?.slug || '',
    featured_image: initialData?.featured_image || '/placeholder.svg',
    status: initialData?.status || 'draft',
    published_at: initialData?.published_at || format(new Date(), 'yyyy-MM-dd'),
    author: initialData?.author || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    summary_en: initialData?.summary_en || '',
    summary_zh: initialData?.summary_zh || '',
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
    category_id: initialData?.category_id || '',
    seo_title_en: initialData?.seo_title_en || '',
    seo_title_zh: initialData?.seo_title_zh || '',
    seo_description_en: initialData?.seo_description_en || '',
    seo_description_zh: initialData?.seo_description_zh || ''
  });

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [availableTags, setAvailableTags] = useState<BlogTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  
  // 加载分类和标签
  useEffect(() => {
    // 这里可以替换为实际API调用
    setCategories(getMockCategories());
    setAvailableTags(getMockTags());
  }, []);
  
  const handleInputChange = (field: keyof BlogPostFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 如果标题更改且slug为空，自动生成slug
    if (field === 'title_en' && !formData.slug) {
      const slug = value.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };
  
  const handleContentChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(prev => prev.filter(id => id !== tagId));
    } else {
      setSelectedTags(prev => [...prev, tagId]);
    }
    
    // 更新表单数据
    setFormData(prev => ({
      ...prev,
      tags: selectedTags.includes(tagId) 
        ? prev.tags.filter(id => id !== tagId) 
        : [...prev.tags, tagId]
    }));
  };
  
  const handleStatusChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      status: value ? 'published' : 'draft'
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit({
        ...formData,
        tags: selectedTags
      });
      
      toast.success(
        currentLanguage === 'zh' ? '保存成功！' : 'Saved successfully!',
        {
          description: currentLanguage === 'zh' 
            ? '博客文章已成功保存' 
            : 'Blog post has been saved'
        }
      );
      
      // 保存成功后，根据是否是编辑模式决定导航
      if (!isEditMode) {
        navigate('/admin/blog');
      }
    } catch (error) {
      console.error('保存博客文章失败:', error);
      toast.error(
        currentLanguage === 'zh' ? '保存失败！' : 'Save failed!',
        {
          description: currentLanguage === 'zh'
            ? '保存博客文章时发生错误'
            : 'An error occurred while saving the blog post'
        }
      );
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title_en">English Title</Label>
            <Input
              id="title_en"
              value={formData.title_en}
              onChange={(e) => handleInputChange('title_en', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="title_zh">中文标题</Label>
            <Input
              id="title_zh"
              value={formData.title_zh}
              onChange={(e) => handleInputChange('title_zh', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {currentLanguage === 'zh' ? category.name_zh : category.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date">Publication Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="featured_image">Featured Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="featured_image"
                value={formData.featured_image}
                onChange={(e) => handleInputChange('featured_image', e.target.value)}
              />
            </div>
            
            {formData.featured_image && (
              <div className="mt-2">
                <img 
                  src={formData.featured_image} 
                  alt="Featured" 
                  className="h-24 w-auto object-cover rounded border"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.status === 'published'}
              onCheckedChange={handleStatusChange}
            />
            <Label htmlFor="published">
              {formData.status === 'published' ? 'Published' : 'Draft'}
            </Label>
          </div>
        </div>
      </div>
      
      {/* 摘要区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="excerpt_en">English Excerpt</Label>
          <Textarea
            id="excerpt_en"
            value={formData.excerpt_en}
            onChange={(e) => handleInputChange('excerpt_en', e.target.value)}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="excerpt_zh">中文摘要</Label>
          <Textarea
            id="excerpt_zh"
            value={formData.excerpt_zh}
            onChange={(e) => handleInputChange('excerpt_zh', e.target.value)}
            rows={3}
          />
        </div>
      </div>
      
      {/* 标签区域 */}
      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableTags.map((tag) => (
            <Button
              key={tag.id}
              type="button"
              variant={selectedTags.includes(tag.slug) ? "default" : "outline"}
              onClick={() => handleTagToggle(tag.slug)}
              className="text-xs"
              style={selectedTags.includes(tag.slug) ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
            >
              {currentLanguage === 'zh' ? tag.name_zh : tag.name_en}
            </Button>
          ))}
        </div>
      </div>
      
      {/* 内容编辑区域 */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="content_en">English Content</Label>
          <div className="mt-2 border rounded-md">
            <SimpleRichTextEditor
              content={formData.content_en}
              onChange={(value) => handleContentChange('content_en', value)}
              placeholder="Enter English content here..."
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="content_zh">中文内容</Label>
          <div className="mt-2 border rounded-md">
            <SimpleRichTextEditor
              content={formData.content_zh}
              onChange={(value) => handleContentChange('content_zh', value)}
              placeholder="在此输入中文内容..."
            />
          </div>
        </div>
      </div>
      
      {/* SEO区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="seo_title_en">SEO Title (English)</Label>
          <Input
            id="seo_title_en"
            value={formData.seo_title_en}
            onChange={(e) => handleInputChange('seo_title_en', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="seo_title_zh">SEO标题 (中文)</Label>
          <Input
            id="seo_title_zh"
            value={formData.seo_title_zh}
            onChange={(e) => handleInputChange('seo_title_zh', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="seo_description_en">SEO Description (English)</Label>
          <Textarea
            id="seo_description_en"
            value={formData.seo_description_en}
            onChange={(e) => handleInputChange('seo_description_en', e.target.value)}
            rows={2}
          />
        </div>
        
        <div>
          <Label htmlFor="seo_description_zh">SEO描述 (中文)</Label>
          <Textarea
            id="seo_description_zh"
            value={formData.seo_description_zh}
            onChange={(e) => handleInputChange('seo_description_zh', e.target.value)}
            rows={2}
          />
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/admin/blog')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default BlogPostForm; 