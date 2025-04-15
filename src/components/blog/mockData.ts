
// Mock data for development and testing

export interface ImageData {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  created_at?: string;
}

export interface BlogPostFormData {
  title_en: string;
  title_zh: string;
  content_en: string;
  content_zh: string;
  summary_en: string;
  summary_zh: string;
  date: string;
  category_id: string;
  tags: string[]; // Changed from number[] to string[] to match the type in blogTypes.ts
  status: "draft" | "published";
  featured_image: string;
  author?: string;
  seo_title_en?: string;
  seo_title_zh?: string;
  seo_description_en?: string;
  seo_description_zh?: string;
  excerpt_en?: string;
  excerpt_zh?: string;
  slug?: string;
  published_at?: string | null;
  category?: string;
}

export interface CategoryData {
  id: number;
  name: string;
  name_en: string;
  name_zh: string;
  slug: string;
}

export interface TagData {
  id: number;
  name: string;
  name_en: string;
  name_zh: string;
  slug: string;
  color: string;
}

// Mock categories for development
export const CATEGORIES_MOCK: CategoryData[] = [
  {
    id: 1,
    name: "Study Tips",
    name_en: "Study Tips",
    name_zh: "学习技巧",
    slug: "study-tips"
  },
  {
    id: 2,
    name: "Cultural Exchange",
    name_en: "Cultural Exchange",
    name_zh: "文化交流",
    slug: "cultural-exchange"
  },
  {
    id: 3,
    name: "University Life",
    name_en: "University Life",
    name_zh: "大学生活",
    slug: "university-life"
  },
  {
    id: 4,
    name: "Language Learning",
    name_en: "Language Learning",
    name_zh: "语言学习",
    slug: "language-learning"
  },
  {
    id: 5,
    name: "Travel Guide",
    name_en: "Travel Guide",
    name_zh: "旅行指南",
    slug: "travel-guide"
  }
];

// Mock tags for development
export const TAGS_MOCK: TagData[] = [
  {
    id: 1,
    name: "Study Abroad",
    name_en: "Study Abroad",
    name_zh: "海外留学",
    slug: "study-abroad",
    color: "#3B82F6"
  },
  {
    id: 2,
    name: "Travel",
    name_en: "Travel",
    name_zh: "旅行",
    slug: "travel",
    color: "#10B981"
  },
  {
    id: 3,
    name: "Education",
    name_en: "Education",
    name_zh: "教育",
    slug: "education",
    color: "#6366F1"
  },
  {
    id: 4,
    name: "Cultural Exchange",
    name_en: "Cultural Exchange",
    name_zh: "文化交流",
    slug: "cultural-exchange",
    color: "#F59E0B"
  },
  {
    id: 5,
    name: "Language",
    name_en: "Language",
    name_zh: "语言",
    slug: "language",
    color: "#EC4899"
  },
  {
    id: 6,
    name: "Career",
    name_en: "Career",
    name_zh: "职业",
    slug: "career",
    color: "#8B5CF6"
  },
  {
    id: 7,
    name: "Food",
    name_en: "Food",
    name_zh: "美食",
    slug: "food",
    color: "#EF4444"
  },
  {
    id: 8,
    name: "Application",
    name_en: "Application",
    name_zh: "申请",
    slug: "application",
    color: "#0EA5E9"
  },
  {
    id: 9,
    name: "Scholarship",
    name_en: "Scholarship",
    name_zh: "奖学金",
    slug: "scholarship",
    color: "#14B8A6"
  }
];

// Mock blog posts for development
export const POSTS_MOCK = [
  {
    id: 1,
    title_en: "10 Tips for Studying Abroad",
    title_zh: "留学10个小贴士",
    date: "2023-06-15",
    category: "Study Tips",
    tags: ["Study Abroad", "Education"],
    status: "published"
  },
  {
    id: 2,
    title_en: "How to Prepare for Your First International Trip",
    title_zh: "如何准备您的第一次国际旅行",
    date: "2023-05-20",
    category: "Travel Guide",
    tags: ["Travel", "Cultural Exchange"],
    status: "published"
  },
  {
    id: 3,
    title_en: "Learning a New Language: Effective Strategies",
    title_zh: "学习新语言：有效策略",
    date: "2023-07-10",
    category: "Language Learning",
    tags: ["Language", "Education"],
    status: "draft"
  },
  {
    id: 4,
    title_en: "University Application Process: A Complete Guide",
    title_zh: "大学申请流程：完整指南",
    date: "2023-04-05",
    category: "University Life",
    tags: ["Education", "Application"],
    status: "published"
  },
  {
    id: 5,
    title_en: "Cultural Differences: What to Expect",
    title_zh: "文化差异：该期待什么",
    date: "2023-08-22",
    category: "Cultural Exchange",
    tags: ["Cultural Exchange", "Study Abroad"],
    status: "draft"
  }
];

// Mock images for development
export const IMAGES_MOCK: ImageData[] = [
  {
    id: 1,
    url: "/lovable-uploads/016e6197-438b-4fe1-9650-ddabcb0eb8db.png",
    alt: "Students studying abroad",
    width: 800,
    height: 600,
    created_at: "2023-06-10T10:30:00Z"
  },
  {
    id: 2,
    url: "/lovable-uploads/f0b87c9a-14ef-4e95-ae65-07fe4018b1fc.png",
    alt: "International travel",
    width: 800,
    height: 600,
    created_at: "2023-05-15T14:20:00Z"
  },
  {
    id: 3,
    url: "/lovable-uploads/8938e5c0-ccf2-466d-b9f3-c7e3c0f599ff.png",
    alt: "Language learning",
    width: 800,
    height: 600,
    created_at: "2023-07-05T09:15:00Z"
  }
];
