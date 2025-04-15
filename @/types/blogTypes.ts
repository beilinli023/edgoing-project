/**
 * Represents the structure of a media item returned by Strapi v4
 */
export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string | null;
    caption?: string | null;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: StrapiMediaFormat;
      small?: StrapiMediaFormat;
      medium?: StrapiMediaFormat;
      large?: StrapiMediaFormat;
      [key: string]: StrapiMediaFormat | undefined; // Allow other custom formats
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string | null;
    provider: string;
    provider_metadata?: unknown | null;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Represents a single blog post.
 */
export interface BlogPost {
  id: string;
  title_en: string;
  title_zh: string;
  title: string; // Often used as the primary title based on language
  content_en: string;
  content_zh: string;
  content: string; // Often used as the primary content based on language
  slug: string;
  featured_image: string | StrapiMedia['attributes'] | { url: string }; // Allow URL string, Strapi attributes, or simple url object
  published_at: string;
  date: string; // Often derived from published_at or another date field
  status: string; // e.g., 'published', 'draft'
  category: string; // Consider linking to BlogCategory interface if defined
  tags: string[]; // Consider linking to BlogTag interface if defined
  author: string;
  excerpt_en: string;
  excerpt_zh: string;
  grade_en?: string; // Optional as some posts might not have it
  grade_zh?: string;
  program_type_en?: string;
  program_type_zh?: string;
  slideshow?: { url: string }[]; // Add optional slideshow field
}

/**
 * Represents a blog video.
 */
export interface BlogVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export interface BlogHero {
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  background_image: string;
}

export interface BlogContent {
  posts: BlogPost[];
  hero: BlogHero;
  videos: BlogVideo[];
}

/**
 * Represents a single item returned by Strapi API v4 (in data array or as data object)
 */
export interface StrapiDataItem<T> {
  id: number;
  attributes: T;
  // meta?: any; // Optional meta for single items if needed
}

/**
 * Represents the common response structure for Strapi API v4 collections
 */
export interface StrapiResponse<T> {
  data: StrapiDataItem<T>[] | StrapiDataItem<T> | null;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
    // Add other meta fields if needed
  };
}

// Add type for SocialLink if not already present globally
export interface SocialLink {
  url: string;
  name?: string;
  icon?: string;
} 