import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FrontendLayout from "@/components/frontend/FrontendLayout";
import { BlogPostLoading } from "@/components/frontend/blog/detail/BlogPostLoading";
import BlogPostHero from "@/components/frontend/blog/detail/BlogPostHero";
import BlogPostNavigation from "@/components/frontend/blog/detail/BlogPostNavigation";
import BlogPostContent from "@/components/frontend/blog/detail/BlogPostContent";
import BlogPostHeaderNew from "@/components/frontend/blog/detail/BlogPostHeaderNew";
import BlogPostTags from "@/components/frontend/blog/detail/BlogPostTags";
import BlogPostError from "@/components/frontend/blog/detail/BlogPostError";
import FeaturedVideosSection from '@/components/frontend/blog/FeaturedVideosSection';
import { getBlogVideos } from '@/services/frontend/blogVideoService';
import { getLocalBlogVideos } from '@/services/blog/localBlogService';
import { BlogVideo } from '@/types/blogTypes';
import { useLanguage } from "@/context/LanguageContext";
import { useBlogPostBySlug } from "@/hooks/useBlogPostBySlug";
import { normalizeTags } from "@/utils/blogUtils";
import ErrorMessage from "@/components/frontend/blog/ErrorMessage";
import { BlogPost, BlogTag, StrapiMedia } from "@/types/blogTypes";
import localBlogService from "@/services/blog/localBlogService";
import { Link } from "react-router-dom";
import BlogPostNotFound from "@/components/frontend/blog/detail/BlogPostNotFound";

// Define missing Rich Text types locally
interface RichTextChild {
  type: string;
  text?: string;
  // Add other potential properties if needed (e.g., bold: true)
}

interface RichTextBlock {
  type: string; // e.g., 'paragraph', 'heading', 'list'
  children?: RichTextChild[];
  // Add other potential properties if needed (e.g., level for heading)
}

// 强制永久禁用静态数据 - 始终使用Strapi API
(window as any).USE_STATIC_DATA = false;
// 添加防护代码，防止其他地方重新启用
Object.defineProperty(window, 'USE_STATIC_DATA', {
  value: false,
  writable: false,
  configurable: false
});

console.log('BlogPostDetail: 已强制禁用静态数据');

// Define a broader type for incoming data, including potential variations
interface RawBlogPostData extends Partial<Omit<BlogPost, 'content_en' | 'content_zh' | 'slideshow' | 'featured_image' | 'excerpt' | 'tags' | 'related_posts'>> {
  // Add excerpt fields if they can come from raw data
  excerpt?: string;
  excerpt_en?: string;
  excerpt_zh?: string;
  // Keep other fields from previous definition
  title?: string;
  content?: string | RichTextBlock[];
  content_en?: string | RichTextBlock[];
  content_zh?: string | RichTextBlock[];
  author?: string;
  author_en?: string;
  author_zh?: string;
  grade?: any;
  Grade?: any;
  Grade_en?: string;
  Grade_zh?: string;
  project_type?: any;
  projectType?: any;
  program_type?: any;
  programType?: any;
  Program_type?: any;
  project_type_en?: string;
  projectType_en?: string;
  programType_en?: string;
  project_type_zh?: string;
  projectType_zh?: string;
  programType_zh?: string;
  featured_image?: string | { url?: string; [key: string]: any } | null;
  carousel_images?: (string | { url?: string } | null)[];
  slideshow?: (string | { url?: string; [key: string]: any } | null)[];
  tags?: BlogTag[];
  related_posts?: RawBlogPostData[];
}

/**
 * 检查博客文章对象是否有效
 * @param post 博客文章对象
 * @returns 布尔值，表示博客文章是否有效
 */
const isValidBlogPost = (post: RawBlogPostData | null | undefined): boolean => {
  if (!post) return false;
  try {
    if ((post.slug === 'blogpost-4' || post.id === 94) && (post.title_zh || post.title_en)) return true;
    const hasTitle = Boolean(post.title_en || post.title_zh);
    const hasSlug = Boolean(post.slug);
    const hasId = Boolean(post.id);
    const hasContent = Boolean(post.content_en || post.content_zh || (Array.isArray(post.content_zh) && post.content_zh.length > 0) || (Array.isArray(post.content_en) && post.content_en.length > 0));
    return hasTitle && (hasSlug || hasId) && hasContent;
  } catch (error) { console.error("验证博客文章时出错:", error); return false; }
};

/**
 * 从复杂数据中提取文本内容
 * @param content 内容对象或数组
 * @returns 格式化的文本内容
 */
const extractTextContent = (content: string | RichTextBlock[] | null | undefined): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  // Restore original logic to process Rich Text arrays
  if (Array.isArray(content)) {
    try {
      return content.map(block => {
        // Ensure block and children are valid before processing
        if (block && block.type === 'paragraph' && Array.isArray(block.children)) {
          // Filter for valid children and map text
          return block.children
                 .filter((child): child is RichTextChild => !!child && typeof child === 'object' && 'text' in child)
                 .map(child => child.text || '') // Extract text, default to empty string
                 .join(' '); // Join text from children with space
        }
        // Add handling for other block types (e.g., headings, lists) if needed
        // else if (block && block.type === 'heading' && ...) { ... }
        return ''; // Return empty string for unhandled block types
      }).filter(text => text.trim() !== '').join('\n\n'); // Join paragraphs with double newline
    } catch (error) { console.error('提取文本内容时出错:', error); return ''; }
  }
  return ''; // Fallback if content is not string or array
};

/**
 * 提取关联字段中的文本值
 */
const extractRelationValue = (field: unknown, keyName: string): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field !== 'object' || field === null) return '';
  try {
    const obj = field as Record<string, any>;
    if (obj[keyName] && typeof obj[keyName] === 'string') return obj[keyName] as string;
    if (typeof obj.data === 'object' && obj.data !== null) {
      const dataObj = obj.data as Record<string, unknown>;
      if (typeof dataObj.attributes === 'object' && dataObj.attributes !== null) {
        const attributesObj = dataObj.attributes as Record<string, unknown>;
        if (attributesObj[keyName] && typeof attributesObj[keyName] === 'string') return attributesObj[keyName] as string;
      }
    }
    if (typeof obj.attributes === 'object' && obj.attributes !== null) {
        const attributesObj = obj.attributes as Record<string, unknown>;
        if (attributesObj[keyName] && typeof attributesObj[keyName] === 'string') return attributesObj[keyName] as string;
    }
  } catch (error) { console.error(`关联字段${keyName}数据提取错误:`, error); }
  return '';
};

/**
 * 博客文章详情页面组件
 */
const BlogPostDetail: React.FC = () => {
  console.log('============== BlogPostDetail组件开始渲染 ==============');
  const { id } = useParams<{ id: string }>();
  const { currentLanguage } = useLanguage();
  console.log(`当前博客ID: ${id}, 语言: ${currentLanguage}`);
  const getLocalizedText = (en: string, zh: string) => currentLanguage === 'en' ? en : zh;

  const {
    data: postFromHook,
    isLoading,
    error
  } = useBlogPostBySlug({
    slugOrId: id || '',
    language: currentLanguage,
    includeRelated: true
  });

  console.log('API响应的博客文章数据 (from hook):', postFromHook);

  const [localPost, setLocalPost] = useState<BlogPost | null>(null);
  const [isUsingLocalData, setIsUsingLocalData] = useState(false);
  const [processedPost, setProcessedPost] = useState<BlogPost | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Move processPostData back inside if it depends on component scope (like currentLanguage)
  // Or keep it outside if it's truly pure
  const processPostData = (rawPost: RawBlogPostData, currentLanguage: string): BlogPost => {
    if (!rawPost || typeof rawPost !== 'object') {
      throw new Error("无效的博客文章数据 (非对象或null)");
    }
    console.log('原始博客文章对象:', rawPost);
    const title_en = rawPost.title_en ?? '';
    const title_zh = rawPost.title_zh ?? '';
    const content_en = rawPost.content_en ?? [];
    const content_zh = rawPost.content_zh ?? [];
    const excerpt_en = rawPost.excerpt_en ?? '';
    const excerpt_zh = rawPost.excerpt_zh ?? '';
    const authorName = rawPost.authorName ?? rawPost.author ?? '';

    // Restore grade and program type processing
    const grade = rawPost.grade ?? rawPost.Grade ?? null;
    const program_type = rawPost.program_type ?? rawPost.Program_type ?? rawPost.project_type ?? rawPost.projectType ?? null;
    const gradeValue = extractRelationValue(grade, 'grade'); // Extract English grade name if available
    const programTypeValue = extractRelationValue(program_type, 'programname'); // Extract English program name if available

    // Extract specific language fields, prioritizing direct field, then relation, then fallback
    const grade_en = rawPost.grade_en ?? rawPost.Grade_en ?? gradeValue ?? '';
    const grade_zh = rawPost.grade_zh ?? rawPost.Grade_zh ?? gradeValue ?? '';
    const program_type_en = rawPost.program_type_en ?? rawPost.project_type_en ?? rawPost.projectType_en ?? rawPost.programType_en ?? programTypeValue ?? '';
    const program_type_zh = rawPost.program_type_zh ?? rawPost.project_type_zh ?? rawPost.projectType_zh ?? rawPost.programType_zh ?? programTypeValue ?? '';

    const processedPostResult: BlogPost = {
      id: String(rawPost.id ?? '0'),
      slug: rawPost.slug ?? '',
      publishedAt: rawPost.publishedAt ?? new Date().toISOString(),
      authorName: authorName,
      title_en: title_en,
      title_zh: title_zh,
      title: currentLanguage === 'en' ? title_en : title_zh,
      content_en: content_en as string,
      content_zh: content_zh as string,
      content: currentLanguage === 'en' ? content_en as string : content_zh as string,
      featured_image: typeof rawPost.featured_image === 'string'
                         ? rawPost.featured_image // Use if it's already a string URL
                         : typeof rawPost.coverImage === 'string'
                            ? rawPost.coverImage // Prioritize coverImage if it's a string URL
                            : (typeof rawPost.featured_image === 'object' && rawPost.featured_image !== null)
                               // Fallback to object extraction logic if featured_image is an object
                               ? (rawPost.featured_image as any)?.url ?? (rawPost.featured_image as any)?.attributes?.url ?? (rawPost.featured_image as any)?.data?.attributes?.url ?? null
                               : null,
      excerpt_en: excerpt_en,
      excerpt_zh: excerpt_zh,
      grade_en: grade_en,
      grade_zh: grade_zh,
      program_type_en: program_type_en,
      program_type_zh: program_type_zh,
      tags: Array.isArray(rawPost.tags) ? rawPost.tags : [],
      // Restore slideshow processing
      slideshow: Array.isArray(rawPost.slideshow)
        ? rawPost.slideshow
            .map(s => ({ url: typeof s === 'string' ? s : ((s as any)?.url ?? '') })) // Create {url: string} object, handle potential object/string types
            .filter(item => item.url !== null && item.url !== '') // Filter out items with null/empty urls
        : [],
    };

    // Add log to check processed slideshow data
    console.log('✅️ [processPostData DEBUG] Processed Slideshow:', processedPostResult.slideshow);

    console.log('处理后的文章元数据 (Strict BlogPost):', {
      id: processedPostResult.id,
      slug: processedPostResult.slug,
      title_en: processedPostResult.title_en,
      title_zh: processedPostResult.title_zh,
      grade_en: grade_en,
      grade_zh: grade_zh,
      program_type_en: program_type_en,
      program_type_zh: program_type_zh,
      hasContentEn: Array.isArray(processedPostResult.content_en) ? processedPostResult.content_en.length > 0 : !!processedPostResult.content_en,
      hasContentZh: Array.isArray(processedPostResult.content_zh) ? processedPostResult.content_zh.length > 0 : !!processedPostResult.content_zh,
    });
    return processedPostResult;
  };

  useEffect(() => {
    if (postFromHook && typeof postFromHook === 'object') {
      try {
        console.log("检查API响应的博客数据 (原始):", postFromHook);
        const isValid = isValidBlogPost(postFromHook as RawBlogPostData);
        console.log(`API数据验证结果: ${isValid ? '有效' : '无效'}`);

        if (isValid) {
          const processedApiPost = processPostData(postFromHook as RawBlogPostData, currentLanguage);
          setProcessedPost(processedApiPost);
          setIsUsingLocalData(false);
          setLoadingComplete(true);
          console.log("使用API数据，处理完成:", processedApiPost);
        } else if ((window as any).USE_STATIC_DATA) {
          console.log("API数据无效，将尝试加载本地数据");
        } else {
          setProcessingError("博客数据格式无效");
          setLoadingComplete(true);
        }
      } catch (err: unknown) {
        console.error("处理API博客数据时出错:", err);
        setProcessingError(err instanceof Error ? err.message : "处理博客数据时出错");
        setLoadingComplete(true);
      }
    }
  }, [postFromHook, currentLanguage]);

  useEffect(() => {
    if ((error || !postFromHook || !isValidBlogPost(postFromHook as RawBlogPostData)) &&
        (window as any).USE_STATIC_DATA &&
        id &&
        !localPost) {
      const loadLocalPost = async () => {
        try {
          let localId = id;
          if (id === 'blogpost-4') localId = 'us-language-camp';
          const localPostData = await localBlogService.getLocalBlogPostBySlug(localId, currentLanguage);
          if (localPostData) {
            const processedLocalPost = processPostData(localPostData as RawBlogPostData, currentLanguage);
            setLocalPost(processedLocalPost);
            setProcessedPost(processedLocalPost);
            setIsUsingLocalData(true);
            setLoadingComplete(true);
          } else {
            console.error(`❌ 未找到ID为${localId}的本地博客文章`);
            if (!isNaN(Number(id))) {
              const numericalId = Number(id);
              const fallbackPosts = await localBlogService.getLocalBlogPosts(1, 10);
              const foundPost = fallbackPosts.posts.find(p => p.id === numericalId);
              if (foundPost) {
                console.log('✅ 通过数字ID成功加载本地博客文章:', foundPost.title_en || foundPost.title_zh);
                const processedFoundPost = processPostData(foundPost as RawBlogPostData, currentLanguage);
                setLocalPost(processedFoundPost);
                setProcessedPost(processedFoundPost);
                setIsUsingLocalData(true);
              } else {
                setProcessingError("未找到博客文章");
              }
            } else {
              setProcessingError("未找到博客文章");
            }
            setLoadingComplete(true);
          }
        } catch (localError: unknown) {
          console.error('❌ 加载本地博客文章出错:', localError);
          setProcessingError(localError instanceof Error ? localError.message : '加载本地数据失败');
          setLoadingComplete(true);
        }
      };
      loadLocalPost();
    }
  }, [id, currentLanguage, error, postFromHook, localPost]);

  const actualPost = processedPost;
  const showLoading = (isLoading && !loadingComplete) || (!processedPost && !loadingComplete);

  useEffect(() => {
    if (actualPost) {
      const pageTitle = actualPost.title_en || actualPost.title_zh || getLocalizedText('Blog Post', '博客文章');
      document.title = `${pageTitle} | Edgoing`;
    } else {
      document.title = getLocalizedText('Blog Post', '博客文章') + ' | Edgoing';
    }
  }, [actualPost, currentLanguage]);

  useEffect(() => {
    console.log("博客文章详情状态:", {
      id,
      hasPostData: Boolean(actualPost),
      isLoading: showLoading,
      error: error || processingError,
      isUsingLocalData,
      loadingComplete
    });
  }, [id, actualPost, showLoading, error, processingError, isUsingLocalData, loadingComplete]);

  if (showLoading) return <BlogPostLoading />;
  if ((error || processingError) && !isUsingLocalData && !processedPost) {
    return (
      <BlogPostError
        message={ (error instanceof Error ? error.message : String(error)) || processingError || getLocalizedText('Failed to load blog post', '加载博客文章失败')}
        actionLabel={getLocalizedText('Back to Blog', '返回博客列表')}
        actionLink="/blog"
      />
    );
  }
  if (!actualPost && loadingComplete) return <BlogPostNotFound />;

  if (!actualPost) {
      console.error("Critical Error: actualPost is null or undefined before final render.");
      return <BlogPostError message={getLocalizedText('An unexpected error occurred', '发生意外错误')} actionLabel="Back" actionLink="/"/>;
  }

  // --- Ensure Helper functions are defined INSIDE the component scope ---
  const getLocalizedContent = (post: BlogPost | null, lang: string): string => {
      if (!post) return '';
      try {
        const langContent = lang === 'en' ? post.content_en : post.content_zh;
        if (!langContent || (Array.isArray(langContent) && langContent.length === 0)) {
          const fallbackContent = lang === 'en' ? post.content_zh : post.content_en;
          // Ensure type matches the restored extractTextContent signature
          return fallbackContent ? extractTextContent(fallbackContent as (string | RichTextBlock[] | null | undefined)) : '';
        }
        // Ensure type matches the restored extractTextContent signature
        return extractTextContent(langContent as (string | RichTextBlock[] | null | undefined));
      } catch (error) { console.error('提取本地化内容时出错:', error); return ''; }
    };

  const getFeaturedImageUrl = (post: BlogPost | null): string => {
    return post?.featured_image || '/Edgoing/Blog_Page/Heading1.jpg';
  };

  // --- Start of pre-render calculations and logs ---

  // Log the final 'actualPost' data used for rendering calculations
  console.log('✅️ [BlogPostDetail PRE-RENDER FINAL DATA] actualPost:', {
      id: actualPost.id,
      slug: actualPost.slug,
      title_en: actualPost.title_en,
      title_zh: actualPost.title_zh,
  });

  // --- Recalculate localized values based on final 'actualPost' ---

  // Fixed Title Localization Logic: Prioritize current language, fallback to other language
  const localizedTitle = currentLanguage === 'zh'
      ? (actualPost.title_zh || actualPost.title_en || '')
      : (actualPost.title_en || actualPost.title_zh || '');

  const localizedContentValue = getLocalizedContent(actualPost, currentLanguage); // Restore the call

  // Restore excerpt calculation based on BlogPost type
  const localizedExcerpt = currentLanguage === 'en' ? actualPost.excerpt_en : actualPost.excerpt_zh;

  // Restore grade and program type calculations
  const localizedGrade = currentLanguage === 'en' ? actualPost.grade_en : actualPost.grade_zh;
  console.log(`✅️ [BlogPostDetail DEBUG] Calculated localizedGrade (${currentLanguage}):`, localizedGrade, `(Source EN: ${actualPost.grade_en}, Source ZH: ${actualPost.grade_zh})`);

  const localizedProgramType = currentLanguage === 'en' ? actualPost.program_type_en : actualPost.program_type_zh;
  console.log(`✅️ [BlogPostDetail DEBUG] Calculated localizedProgramType (${currentLanguage}):`, localizedProgramType, `(Source EN: ${actualPost.program_type_en}, Source ZH: ${actualPost.program_type_zh})`);

  const featuredImageUrlValue = getFeaturedImageUrl(actualPost);

  // Extract image URLs for the carousel from the processed slideshow data
  const carouselImageUrls = actualPost?.slideshow?.map(slide => slide.url).filter(Boolean) as string[] ?? [];

  const normalizedTags = normalizeTags(actualPost);

  // Add log for the final featured image URL being passed to components
  console.log('✅️ [BlogPostDetail DEBUG] Final featuredImageUrlValue:', featuredImageUrlValue);
  console.log('✅️ [BlogPostDetail DEBUG] Final carouselImageUrls:', carouselImageUrls); // Log the final URLs for the carousel

  console.log('============== 开始最终渲染 (Final Render - Log & Logic Fixed) =============');

  const headerProps = {
    title: localizedTitle,
    author: actualPost.authorName,
    publishedDate: actualPost.publishedAt,
    currentLanguage: currentLanguage,
    grade: localizedGrade,
    programType: localizedProgramType,
    isUsingLocalData: isUsingLocalData,
    post: actualPost
  };

  // Enhanced V26 log
  console.log('✅️ [BlogPostDetail V26 FINAL CHECK] Props -> BlogPostHeaderNew:', {
      title: headerProps.title,
      author: headerProps.author,
      publishedDate: headerProps.publishedDate,
      grade: headerProps.grade,
      programType: headerProps.programType,
      _source_title_en: actualPost.title_en,
      _source_title_zh: actualPost.title_zh,
      _source_grade_en: actualPost.grade_en,
      _source_grade_zh: actualPost.grade_zh,
      _source_program_type_en: actualPost.program_type_en,
      _source_program_type_zh: actualPost.program_type_zh,
  });

  return (
    <FrontendLayout>
      {/* Hero section with title and excerpt */}
      <BlogPostHero
        title={localizedTitle}
        excerpt={localizedExcerpt}
        featuredImage={featuredImageUrlValue}
      />

      {/* Navigation - back to blog list */}
      <BlogPostNavigation backLabel={getLocalizedText('Back to Blog', '返回博客列表')} />

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* 使用本地数据的提示 */}
          {isUsingLocalData && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-sm text-yellow-700">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                </svg>
                {currentLanguage === 'en'
                  ? 'Displaying locally stored content (API request failed)'
                  : '显示本地存储的内容（API请求失败）'}
              </p>
            </div>
          )}

          {/* 博客文章头部 */}
          <BlogPostHeaderNew {...headerProps} />

          {/* 博客文章内容 */}
          <BlogPostContent
            content={localizedContentValue}
            featuredImage={featuredImageUrlValue}
            imageAlt={localizedTitle}
            showFeaturedImage={false}
            slideshowUrls={carouselImageUrls}
          />

          {/* 博客标签 */}
          {normalizedTags && normalizedTags.length > 0 && (
            <div className="mt-6 mb-10">
              <h4 className="text-md font-semibold mb-3">
                {getLocalizedText('Tags', '标签')}:
              </h4>
              <BlogPostTags
                tags={normalizedTags}
                currentLanguage={currentLanguage}
              />
            </div>
          )}

          {/* 相关文章 */}
          {/* Temporarily commented out due to potential type mismatch for related_posts */}
          {/* {actualPost?.related_posts && Array.isArray(actualPost.related_posts) && actualPost.related_posts.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h3 className="text-xl font-bold mb-6">
                {getLocalizedText('Related Articles', '相关文章')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {actualPost.related_posts.map((relatedPost: RawBlogPostData, index) => { // Assume relatedPost is Raw
                  if (!relatedPost) return null;

                  // 获取相关文章图片
                  const relatedImageUrl = typeof relatedPost.featured_image === 'string'
                    ? relatedPost.featured_image
                    : (relatedPost.featured_image && typeof relatedPost.featured_image === 'object' && 'url' in relatedPost.featured_image
                      ? (relatedPost.featured_image as any).url
                      : '/Edgoing/Blog_Page/Heading1.jpg');

                  // 获取相关文章标题
                  const relatedTitle = currentLanguage === 'en'
                      ? (relatedPost.title_en || relatedPost.title_zh || getLocalizedText('Related Article', '相关文章'))
                      : (relatedPost.title_zh || relatedPost.title_en || getLocalizedText('Related Article', '相关文章'));

                  return (
                    <Link to={`/blog/${relatedPost.slug}`} key={index} className="block group">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <div className="h-40 overflow-hidden relative">
                          <img
                            src={relatedImageUrl}
                            alt={relatedTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="text-base font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {relatedTitle}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )} */}
        </div>
      </section>
    </FrontendLayout>
  );
};

export default BlogPostDetail;
