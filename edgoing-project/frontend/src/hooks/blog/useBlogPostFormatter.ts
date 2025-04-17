import { BlogPost } from "@/types/blogTypes";

/**
 * Hook to format and localize blog post data
 */
export const useBlogPostFormatter = (post: BlogPost | null, currentLanguage: string) => {
  // Get localized text helper
  const getLocalizedText = (en: string, zh: string): string => {
    return currentLanguage === 'en' ? en : zh;
  };

  if (!post) {
    return {
      localizedTitle: '',
      localizedContent: null,
      backLabel: getLocalizedText('Back to Blogs', '返回博客列表'),
      featuredImageUrl: '/placeholder.svg',
      slideshowUrls: [] as string[],
      localizedGrade: '',
      localizedProgramType: '',
      getLocalizedText,
    };
  }

  // --- ADD LOGS ---
  console.log('[useBlogPostFormatter] Input Post Data:', {
      grade_en: post.grade_en,
      grade_zh: post.grade_zh,
      program_type_en: post.program_type_en,
      program_type_zh: post.program_type_zh
  });
  // --- END LOGS ---

  // Get localized content
  const localizedTitle = getLocalizedText(post.title_en || '', post.title_zh || '');
  const localizedContent = currentLanguage === 'en' ? post.content_en : post.content_zh;
  const backLabel = getLocalizedText('Back to Blogs', '返回博客列表');

  // Handle featured image URL
  const featuredImageUrl = post.featured_image || '/placeholder.svg';

  // Handle slideshow
  // 确保处理不同的轮播图数据结构
  console.log('原始 slideshow 数据:', post.slideshow);
  console.log('原始 slideshow 类型:', typeof post.slideshow);
  console.log('原始 slideshow 是否为数组:', Array.isArray(post.slideshow));

  let slideshowUrls: string[] = [];

  if (post.slideshow) {
    try {
      // 如果 slideshow 是对象数组，提取 url 属性
      if (Array.isArray(post.slideshow)) {
        slideshowUrls = post.slideshow.map((item, index) => {
          // 输出轮播图项的详细信息，便于调试
          console.log(`轮播图项 ${index} 类型:`, typeof item);
          console.log(`轮播图项 ${index} 结构:`, JSON.stringify(item));

          if (typeof item === 'string') {
            console.log(`轮播图项 ${index} 是字符串:`, item);
            return item;
          } else if (item && typeof item === 'object') {
            // 尝试不同的属性名
            if ('url' in item && typeof item.url === 'string') {
              console.log(`轮播图项 ${index} 是对象，包含 url 属性:`, item.url);
              return item.url;
            } else if (item.attributes && item.attributes.url) {
              console.log(`轮播图项 ${index} 是对象，包含 attributes.url 属性:`, item.attributes.url);
              return item.attributes.url;
            } else {
              // 尝试遍历对象的所有属性，查找可能的 URL
              for (const key in item) {
                if (typeof item[key] === 'string' && (item[key].includes('http') || item[key].includes('/uploads'))) {
                  console.log(`轮播图项 ${index} 是对象，找到可能的 URL 属性 ${key}:`, item[key]);
                  return item[key];
                }
              }
              console.log(`轮播图项 ${index} 是对象，但没有找到 URL 属性`);
            }
          }

          console.log(`轮播图项 ${index} 格式不支持:`, item);
          return null;
        }).filter((url): url is string => !!url);
      }

      console.log('处理后的 slideshowUrls:', slideshowUrls);
    } catch (error) {
      console.error('处理 slideshow 时出错:', error);
    }
  }

  // Calculate localized values
  const localizedGrade = getLocalizedText(post.grade_en || '', post.grade_zh || '');
  const localizedProgramType = getLocalizedText(post.program_type_en || '', post.program_type_zh || '');

  // 输出详细的调试信息
  console.log('[useBlogPostFormatter] 原始 grade 和 programType 字段:', {
    grade_en: post.grade_en,
    grade_zh: post.grade_zh,
    program_type_en: post.program_type_en,
    program_type_zh: post.program_type_zh,
    localizedGrade,
    localizedProgramType
  });

  // --- ADD LOGS (Existing + ✅️ V12 for Slideshow) ---
  console.log('[useBlogPostFormatter] Calculated Values:', {
      localizedGrade,
      localizedProgramType
  });
  console.log('✅️ [useBlogPostFormatter V12] Calculated Slideshow URLs:', slideshowUrls); // Log the already calculated value
  // --- END LOGS ---

  return {
    localizedTitle,
    localizedContent,
    backLabel,
    featuredImageUrl,
    slideshowUrls, // Ensure this is returned
    getLocalizedText,
    localizedGrade,
    localizedProgramType
  };
};
