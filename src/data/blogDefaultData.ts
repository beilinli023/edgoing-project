import { BlogContent, BlogTag, BlogCategory, BlogPost, BlogVideo, BlogHero } from "@/types/blogTypes";

// 定义默认的博客标签
const defaultTags: BlogTag[] = [
  { id: "1", name_en: "Academic", name_zh: "学术", slug: "academic", color: "blue" },
  { id: "2", name_en: "Culture", name_zh: "文化", slug: "culture", color: "green" },
  { id: "3", name_en: "Travel", name_zh: "旅行", slug: "travel", color: "amber" },
  { id: "4", name_en: "Experience", name_zh: "体验", slug: "experience", color: "purple" }
];

// 定义默认的博客分类
const defaultCategories: BlogCategory[] = [
  { id: "1", name_en: "Study Abroad", name_zh: "海外学习", slug: "study-abroad", description_en: "All about studying in foreign countries", description_zh: "关于在国外学习的一切" },
  { id: "2", name_en: "Cultural Exchange", name_zh: "文化交流", slug: "cultural-exchange", description_en: "Cultural experiences and exchanges", description_zh: "文化体验与交流" },
  { id: "3", name_en: "Travel Tips", name_zh: "旅行贴士", slug: "travel-tips", description_en: "Tips for travelers", description_zh: "旅行者贴士" }
];

// 默认的博客文章 - 简化版，只作为回退方案
// 实际数据将从本地 JSON 文件加载
const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title_en: "Default Post Title",
    title_zh: "默认文章标题",
    slug: "default-post",
    content_en: "This is a placeholder post. Actual content should be loaded from JSON files.",
    content_zh: "这是一个占位文章。实际内容应该从 JSON 文件加载。",
    excerpt_en: "Placeholder post",
    excerpt_zh: "占位文章",
    featured_image: "/images/blog/default-post.jpg",
    author: {
      name: "System",
      avatar: "/images/avatars/default.jpg"
    },
    published_at: new Date().toISOString(),
    category: defaultCategories[0],
    tags: [defaultTags[0]]
  }
];

// 默认的博客视频
const defaultVideos: BlogVideo[] = [
  {
    id: "1",
    title_en: "Learning Abroad: Student Experiences",
    title_zh: "海外学习：学生体验",
    thumbnail: "/images/blog/video-thumbnail-1.jpg",
    video_url: "https://www.youtube.com/watch?v=example1",
    duration: "3:45",
    views: 1250,
    published_at: "2023-05-15T10:00:00Z"
  },
  {
    id: "2",
    title_en: "Cultural Exchange Program Highlights",
    title_zh: "文化交流项目亮点",
    thumbnail: "/images/blog/video-thumbnail-2.jpg",
    video_url: "https://www.youtube.com/watch?v=example2",
    duration: "5:20",
    views: 980,
    published_at: "2023-04-22T14:30:00Z"
  },
  {
    id: "3",
    title_en: "Travel Tips for International Students",
    title_zh: "国际学生旅行贴士",
    thumbnail: "/images/blog/video-thumbnail-3.jpg",
    video_url: "https://www.youtube.com/watch?v=example3",
    duration: "4:10",
    views: 1560,
    published_at: "2023-03-18T09:15:00Z"
  }
];

// 默认的博客页面英雄区域
const defaultHero: BlogHero = {
  title_en: "Our Blog",
  title_zh: "我们的博客",
  subtitle_en: "Explore stories, experiences, and insights from our community",
  subtitle_zh: "探索我们社区的故事、经历和见解",
  background_image: "/images/blog/blog-hero.jpg"
};

// 导出默认内容
export const defaultContent: BlogContent = {
  hero: defaultHero,
  posts: defaultPosts,
  videos: defaultVideos
};
