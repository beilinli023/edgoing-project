import React from 'react';
import { useParams } from 'react-router-dom';
import { useBlogPostDetail } from '@/hooks/useBlogPostDetail';
import BlogPostHeaderNew, { BlogPostHeaderNewProps } from './BlogPostHeaderNew';
import BlogPostContent, { BlogPostContentProps } from './BlogPostContent';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/LanguageContext';

// --- ADD TOP LEVEL LOG (V11) ---
console.log('[BlogPostDetail.tsx MODULE EXECUTION CHECK]');
// --- END LOG ---

interface BlogPostDetailProps {
  slug?: string;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ slug }) => {
  const params = useParams<{ slug: string }>();
  const postSlug = slug || params.slug;
  const { currentLanguage } = useLanguage();

  console.log(`============== BlogPostDetail组件开始渲染 (REFACTORED V3) ==============`);
  console.log(`当前博客ID: ${postSlug}, 语言: ${currentLanguage}`);

  const {
    post,
    isLoading,
    error,
    localizedTitle,
    localizedContent,
    featuredImageUrl,
    slideshowUrls,
    localizedGrade,
    localizedProgramType,
  } = useBlogPostDetail(postSlug, currentLanguage);

  console.log(`[BlogPostDetail REFACTORED V3] Hook State: isLoading=${isLoading}, hasError=${!!error}, hasPost=${!!post}`);
  if (post) {
      console.log(`[BlogPostDetail REFACTORED V3] Received Post Data:`, { title: localizedTitle, author: post.authorName, date: post.publishedAt, grade: localizedGrade, program: localizedProgramType });
      console.log(`[BlogPostDetail REFACTORED V3] Received Image URLs:`, { featured: featuredImageUrl, slides: slideshowUrls });
  }

  // --- Loading State ---
  // REVISED Check V6: Ensure post object AND essential primitive/derived fields used in the header/content exist.
  const isEssentialDataReady =
    !!post &&
    !!post.publishedAt && // CRUCIAL check for date
    !!post.authorName &&  // Check author directly on post
    !!localizedTitle &&
    !!localizedGrade &&
    !!localizedProgramType &&
    !!featuredImageUrl;

  if (isLoading || !isEssentialDataReady) {
    // Updated log for V6 check
    console.log(`⏳ [V6] Waiting... isLoading=${isLoading}, isEssentialDataReady=${isEssentialDataReady}`, {
        hasPost: !!post,
        hasPublishedAt: !!post?.publishedAt,
        hasAuthor: !!post?.authorName,
        hasTitle: !!localizedTitle,
        hasGrade: !!localizedGrade,
        hasProgram: !!localizedProgramType,
        hasImage: !!featuredImageUrl
    });
    return <BlogPostDetailSkeleton />;
  }

  // --- Error State ---
  // Check for error AFTER loading is complete and post potentially exists
  if (error) {
    const getLocalizedText = (en: string, zh: string) => currentLanguage === 'zh' ? zh : en;
    console.log('❌ 显示博客文章错误状态 (REFACTORED V3):', error);
    return <div className="text-center py-10">
      <h2 className="text-xl font-semibold mb-2">{getLocalizedText('Post not found', '未找到文章')}</h2>
      <p>{getLocalizedText('The post you are looking for might have been removed or is temporarily unavailable.',
        '您查找的文章可能已被删除或暂时不可用。')}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {getLocalizedText('Reload', '重新加载')}
      </button>
    </div>;
  }

  // --- Success State ---
  console.log('✅ [V6] Data ready for rendering');

  // --- ADD SPECIFIC LOG BEFORE PASSING PROPS (V6) ---
  const headerProps: BlogPostHeaderNewProps = {
      title: localizedTitle,
      // Add explicit fallbacks for logging clarity, though BlogPostHeaderNew might handle them too
      author: post.authorName || null, // Pass null if empty string or undefined
      publishedDate: post.publishedAt || null, // Pass null if undefined
      currentLanguage: currentLanguage,
      grade: localizedGrade || null,
      programType: localizedProgramType || null
      // primaryCategory is not returned by useBlogPostDetail, so it won't be passed
  };
  console.log('[BlogPostDetail V6] Props being passed to BlogPostHeaderNew:', headerProps);
  console.log('[BlogPostDetail V6] 详细的 grade 和 programType 信息:', {
    localizedGrade,
    localizedProgramType,
    gradeType: typeof localizedGrade,
    programTypeType: typeof localizedProgramType,
    gradeEmpty: localizedGrade === '',
    programTypeEmpty: localizedProgramType === '',
    gradeNull: localizedGrade === null,
    programTypeNull: localizedProgramType === null,
    gradeUndefined: localizedGrade === undefined,
    programTypeUndefined: localizedProgramType === undefined
  });
  // --- END SPECIFIC LOG ---

  const contentProps: BlogPostContentProps = {
    content: localizedContent,
    featuredImage: featuredImageUrl,
    slideshowUrls: slideshowUrls,
    imageAlt: localizedTitle
  };
  console.log('[BlogPostDetail V6] Props being passed to BlogPostContent:', {
      hasContent: !!contentProps.content,
      contentType: typeof contentProps.content,
      featuredImage: contentProps.featuredImage,
      slideshowCount: contentProps.slideshowUrls?.length,
      imageAlt: contentProps.imageAlt
  });
  // ✅️ V12 Log for Slideshow specific props
  console.log(`✅️ [BlogPostDetail V12] Slideshow props for BlogPostContent:`, {
      slideshowUrls: contentProps.slideshowUrls,
      slideshowCount: contentProps.slideshowUrls?.length
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Pass the prepared props object using spread syntax */}
      <BlogPostHeaderNew {...headerProps} />
      <BlogPostContent {...contentProps} />
    </div>
  );
};

const BlogPostDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="mb-8">
      <Skeleton className="h-12 w-3/4 mb-4" />
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-48" />
      </div>
    </div>

    <div className="mb-8">
      <Skeleton className="h-64 w-full mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  </div>
);

export default BlogPostDetail;