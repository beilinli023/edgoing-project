
import { BlogPost, BlogTag } from "@/types/blogTypes";

/**
 * Normalize tags to ensure they are all BlogTag objects
 * This converts any string tags into proper BlogTag objects
 */
export const normalizeTags = (post: BlogPost | undefined): BlogTag[] => {
  if (!post || !post.tags) return [];

  return post.tags.map((tag) => {
    if (typeof tag === 'string') {
      // Convert string tag to BlogTag object
      return {
        id: tag,
        name_en: tag,
        name_zh: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-')
      };
    }
    return tag as BlogTag;
  });
};

/**
 * Get normalized blog post with properly formatted tags
 */
export const getNormalizedPost = (post: BlogPost | undefined): BlogPost | undefined => {
  if (!post) return undefined;
  
  return {
    ...post,
    tags: normalizeTags(post)
  };
};
