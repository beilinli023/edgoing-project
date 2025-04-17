import { BlogPost } from "@/types/blogTypes";

// Mock post for fallback
export const mockPost: BlogPost = {
  id: "99",
  title_en: "Sample Blog Post Title",
  title_zh: "示例博客文章标题",
  slug: "sample-blog-post",
  content_en: `<p>This is a sample blog post content. The actual content could not be loaded.</p>
<p>Please try refreshing the page or check your connection.</p>`,
  content_zh: `<p>这是示例博客文章内容。无法加载实际内容。</p>
<p>请尝试刷新页面或检查您的连接。</p>`,
  excerpt_en: "This is a sample blog post. The actual content could not be loaded.",
  excerpt_zh: "这是示例博客文章。无法加载实际内容。",
  featured_image: "/placeholder.svg",
  status: "published",
  published_at: "2023-01-01",
  author: "System",
  date: "2023-01-01",
  category: "Uncategorized",
  primary_category: {
    id: "0",
    name_en: "Uncategorized",
    name_zh: "未分类",
    slug: "uncategorized"
  },
  tags: [
    {
      id: "0", 
      name_en: "Sample", 
      name_zh: "示例", 
      slug: "sample", 
      color: "#cccccc"
    }
  ]
};
