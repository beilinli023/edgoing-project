import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import FrontendLayout from "@/components/frontend/FrontendLayout";
import { Link } from "react-router-dom";
import { BlogPost, BlogVideo, ProgramTypeData, FrontendBlogPost, GradeData } from "@/types/blogTypes";
import { Card } from "@/components/ui/card";
import FeaturedVideosSection from '@/components/frontend/blog/FeaturedVideosSection';
import BlogPagination from '@/components/frontend/blog/BlogPagination';
import { useBlogPosts, BlogSortOption, BlogPostsResponse } from "@/hooks/useBlogPosts";
import { useQueryClient } from "@tanstack/react-query";
import { getLocalBlogVideos } from "@/services/blog/localBlogService";
import { getBlogVideos } from "@/services/frontend/blogVideoService";
// import { Helmet } from "react-helmet";
// import { useTranslation } from "react-i18next";
import { getBlogPosts } from "@/services/frontend/blogService";
import { format } from "date-fns";
import { getImageUrl } from "@/utils/blogUtils";

// 为 window 对象添加自定义属性类型定义
interface ExtendedWindow extends Window {
  USE_STATIC_DATA?: boolean;
  DEBUG_MODE?: boolean;
}

const BlogPage: React.FC = () => {
  // const { t } = useTranslation();
  // 临时函数替代t
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'blog.pageTitle': '博客',
      'blog.metaDescription': '浏览我们的博客文章',
      'blog.title': '博客'
    };
    return translations[key] || key;
  };

  const { currentLanguage } = useLanguage();
  const [blogVideos, setBlogVideos] = useState<BlogVideo[]>([]);
  const [videoError, setVideoError] = useState<Error | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<FrontendBlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const itemsPerPage = 6; // 恢复每页显示的文章数量为 6

  // 根据当前语言获取本地化文本
  const getLocalizedText = (en: string, zh: string) => {
    return currentLanguage === 'en' ? en : zh;
  };

  // 获取React Query客户端实例，用于管理缓存
  const queryClient = useQueryClient();

  // 使用自定义Hook获取博客文章数据
  const {
    data: blogPostsData,
    isLoading: apiLoading,
    error: apiError,
    refetch: refetchBlogPosts,
    isRefetching: isRefetchingBlogPosts
  } = useBlogPosts({
    language: currentLanguage,
    page: currentPage,
    limit: itemsPerPage, // 使用已定义的 itemsPerPage变量（6篇文章）
    sortBy: BlogSortOption.NEWEST
  });

  // 组件挂载时重置博客文章查询缓存，确保不使用可能错误的缓存数据
  useEffect(() => {
    // 重置所有与博客文章相关的查询缓存
    queryClient.resetQueries({ queryKey: ['blogPosts'] });

    // 添加手动刷新机制，确保获取最新数据
    setTimeout(() => {
      refetchBlogPosts();
    }, 100);
  }, [queryClient, refetchBlogPosts]);

  // 打印API请求状态
  console.log('博客API请求状态:', {
    isLoading: apiLoading,
    isRefetching: isRefetchingBlogPosts,
    hasError: !!apiError,
    errorMessage: apiError?.message,
    currentPage,
    itemsPerPage
  });

  // 从响应中提取博客文章
  const blogPostsDataMemo = React.useMemo(() => {
    console.log('===== 博客数据详细日志 =====');
    console.log('原始博客数据:', blogPostsData);
    console.log('原始数据类型:', typeof blogPostsData);
    console.log('是否为空或未定义:', !blogPostsData);

    if (blogPostsData) {
      console.log('是否为对象:', typeof blogPostsData === 'object');
      console.log('是否有posts属性:', blogPostsData && typeof blogPostsData === 'object' && 'posts' in (blogPostsData as any));
      console.log('posts属性值:', (blogPostsData as any)?.posts);
      console.log('posts是否为数组:', Array.isArray((blogPostsData as any)?.posts));
      console.log('posts数组长度:', Array.isArray((blogPostsData as any)?.posts) ? (blogPostsData as any).posts.length : 'N/A');
      console.log('totalPages值:', (blogPostsData as any)?.totalPages);
      console.log('totalPosts值:', (blogPostsData as any)?.totalPosts);
    }
    console.log('===== 博客数据日志结束 =====');

    if (!blogPostsData) return [];

    try {
      const posts = (blogPostsData as BlogPostsResponse)?.posts || [];
      console.log(`成功提取博客文章数据，共 ${posts.length} 篇文章`);
      return posts;
    } catch (err) {
      console.error('处理博客数据时出错:', err);
      return [];
    }
  }, [blogPostsData]);

  // 加载博客视频数据
  React.useEffect(() => {
    const fetchVideos = async () => {
      setVideoLoading(true);
      try {
        // 先尝试从 API 获取视频数据
        console.log('尝试从 API 获取博客视频数据...');
        const response = await getBlogVideos(currentLanguage, 1, 100); // 获取所有视频，然后由 FeaturedVideosSection 组件处理分页
        console.log(`成功从 API 加载视频数据，共 ${response.videos.length} 个视频`);
        setBlogVideos(response.videos);
        setVideoError(null);
      } catch (apiError) {
        console.error('从 API 获取博客视频失败，尝试使用本地数据:', apiError);

        try {
          // 如果 API 请求失败，尝试使用本地数据
          const videos = await getLocalBlogVideos();
          console.log(`成功从本地加载视频数据，共 ${videos.length} 个视频`);
          setBlogVideos(videos);
          setVideoError(null);
        } catch (localError) {
          console.error('从本地获取博客视频也失败:', localError);
          setVideoError(localError instanceof Error ? localError : new Error('加载博客视频失败'));
          setBlogVideos([]);
        }
      } finally {
        setVideoLoading(false);
      }
    };

    fetchVideos();
  }, [currentLanguage]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        console.log('\n===== 直接调用getBlogPosts函数 =====');
        console.log('开始获取博客文章，当前页码:', currentPage, '语言:', currentLanguage);
        console.log('USE_STATIC_DATA值:', (window as ExtendedWindow).USE_STATIC_DATA);

        const result = await getBlogPosts(currentLanguage, currentPage, itemsPerPage, selectedCategory);
        console.log('[DEBUG] 1. 获取到的原始博客文章数据:', result);
        console.log('[DEBUG] 数据类型:', typeof result);
        console.log('[DEBUG] 是否有posts属性:', result && typeof result === 'object' && 'posts' in result);
        console.log('[DEBUG] posts是否为数组:', result && typeof result === 'object' && Array.isArray(result.posts));
        console.log('[DEBUG] posts数组长度:', result && typeof result === 'object' && Array.isArray(result.posts) ? result.posts.length : 'N/A');
        console.log('===== 直接调用日志结束 =====\n');

        console.log('[DEBUG] 2. 准备检查和转换数据格式...');
        if (result && result.posts && Array.isArray(result.posts) && typeof result.totalPages === 'number' && typeof result.totalPosts === 'number') {

          // Perform full transformation from BlogPost to FrontendBlogPost
          const transformedPosts: FrontendBlogPost[] = result.posts.map((p: BlogPost) => {

            // Safely resolve GradeData
            let resolvedGrade: GradeData | null = null;
            const gradeSource = p.grade || p.Grade || p.grade_en || p.grade_zh;
            if (gradeSource && typeof gradeSource === 'object' && 'id' in gradeSource) {
              const safeGradeSource = gradeSource as { id: number; name?: string; grade?: string };
              resolvedGrade = { id: safeGradeSource.id, name: safeGradeSource.name || safeGradeSource.grade || '' };
            }

            // Safely resolve ProgramTypeData
            let resolvedProgramType: ProgramTypeData | null = null;
            const programTypeSource = p.programType || p.program_type || p.program_type_en || p.program_type_zh;
            if (programTypeSource && typeof programTypeSource === 'object' && 'id' in programTypeSource) {
              const safeProgramTypeSource = programTypeSource as { id: number; name?: string; programname?: string };
              resolvedProgramType = { id: safeProgramTypeSource.id, name: safeProgramTypeSource.name || safeProgramTypeSource.programname || '' };
            }

            // Handle image source - Read 'image' from p (proxy response), not 'featured_image' from BlogPost type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageSource = (p as any).image; // Access the correct field from proxy response
            const imageUrl = getImageUrl(typeof imageSource === 'string' ? imageSource : undefined);

            // Handle slideshow (use p.slideshow from proxy response)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const slideshowData = (p as any).slideshow;

            return {
              // --- Map to FrontendBlogPost structure ---
              id: p.id,
              slug: p.slug || '',
              title: p.title || p.title_zh || p.title_en || 'No Title',
              excerpt: p.excerpt || p.excerpt_zh || p.excerpt_en || '',
              image: imageUrl,
              authorName: p.authorName || p.author || p.author_zh || p.author_en || null,
              // publishedAt is required in FrontendBlogPost, use published_at or date from BlogPost
              publishedAt: p.published_at || p.date || new Date().toISOString(),
              // date is optional, use date or published_at from BlogPost
              date: p.date || p.published_at || undefined,
              // documentId is optional
              documentId: p.documentId || undefined,
              // slideshow uses mapped data from p.slideshow
              slideshow: Array.isArray(slideshowData)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? slideshowData.map((item: any) => ({ url: getImageUrl(item?.url || '') }))
                : null,
              // Use resolved grade and programType
              grade: resolvedGrade,
              programType: resolvedProgramType,
              // content is optional in FrontendBlogPost, can be omitted if not needed here
            };
          });

          console.log(`[DEBUG] 3. 完整转换后数据格式正确，即将设置状态: totalPages=${result.totalPages}, totalPosts=${result.totalPosts}`);
          setBlogPosts(transformedPosts); // Set the fully transformed data
          setTotalPages(result.totalPages);
          setTotalPosts(result.totalPosts);
        } else {
          console.error('[DEBUG] 4. 从 getBlogPosts 返回的数据格式不正确或缺少分页信息:', result);
          setBlogPosts([]);
          setTotalPages(1);
          setTotalPosts(0);
        }
      } catch (error) {
        console.error('获取博客文章失败:', error);
        setBlogPosts([]);
        setTotalPages(1);
        setTotalPosts(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [currentPage, currentLanguage, selectedCategory, itemsPerPage]);

  // 处理分页变化的函数
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // 如果请求的页码超过了总页数，则使用最后一页
      const validPage = Math.min(newPage, totalPages);
      console.log(`设置页码为 ${validPage}`);
      setCurrentPage(validPage);
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 定义博客卡片的背景颜色
  const cardColors = [
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-violet-600",
    "bg-rose-600",
  ];

  return (
    <FrontendLayout>
      {/* 临时注释Helmet
      <Helmet>
        <title>{t('blog.pageTitle')}</title>
        <meta name="description" content={t('blog.metaDescription')} />
      </Helmet>
      */}

      {/* 调试信息区域 - 仅在开发环境且有调试标志时显示 */}
      {/* 调试信息区域已移除 */}

      <div className="min-h-screen">
        {/* 博客页面头部 */}
        <section
          className="relative pt-32 pb-24 text-white bg-cover bg-center"
          style={{ backgroundImage: `url("/Edgoing/Blog_Page/Heading1.jpg")` }}
        >
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container-fluid w-full max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center justify-center">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                {getLocalizedText('Our Blog', '我们的博客')}
              </h1>
              <p className="text-base max-w-2xl mx-auto opacity-90">
                {getLocalizedText(
                  "Welcome to our blog This is where we share inspirational stories and insights from our educational journey around the world",
                  "欢迎来到我们的博客，这里是学习与冒险的交汇之地！在这里，我们分享来自参与者的故事、实用建议和深刻见解，记录他们踏上改变人生的教育之旅的点滴"
                )}
              </p>
            </div>
          </div>
        </section>

        {/* 博客文章列表部分 */}
        <div className="max-w-[90%] lg:max-w-[85%] mx-auto px-4 py-12">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">
              {getLocalizedText('Latest Articles', '最新文章')}
            </h2>

            {/* 加载状态 */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className="flex flex-col h-full rounded-lg overflow-hidden shadow-md">
                    <div className="h-64 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 错误提示 */}
            {!isLoading && apiError && (
              <div className="text-center py-8">
                <p className="text-red-500">{getLocalizedText('Failed to load blog posts', '加载博客文章失败')}</p>
                <p className="text-gray-600 mt-2">{apiError.message}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    console.log('重试加载博客数据...');
                    queryClient.clear();
                    refetchBlogPosts();
                  }}
                >
                  {currentLanguage === 'en' ? 'Retry' : '重试'}
                </button>
              </div>
            )}

            {/* 没有文章提示 */}
            {!isLoading && !apiError && blogPostsDataMemo.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {currentLanguage === 'en'
                    ? 'No articles available in English. Please check back later.'
                    : '暂无文章'}
                </p>
                {currentLanguage === 'en' && (
                  <p className="text-gray-400 mt-3">
                    Switch to Chinese for available content.
                  </p>
                )}
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    console.log('手动刷新数据...');
                    queryClient.clear();
                    refetchBlogPosts();
                  }}
                >
                  {currentLanguage === 'en' ? 'Refresh Data' : '刷新数据'}
                </button>
              </div>
            )}

            {/* 博客文章色块列表 */}
            {!isLoading && !apiError && blogPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className={`h-full overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 ${cardColors[index % cardColors.length]} text-white`}>
                      <div className="relative h-64 overflow-hidden">
                        {/* 使用 post.image (来自 FrontendBlogPost, 已包含 base URL) */}
                        <div
                          className="absolute inset-0 bg-center bg-cover"
                          // 直接使用 post.image，不再调用 getImageUrl
                          style={{ backgroundImage: `url(${post.image || ''})` }}
                        >
                         {/* Background image applied via style */}
                        </div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>

                        {/* 移除右上角的标题，只保留卡片中间的标题 */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          {/* Centered Title */}
                          <h3 className="text-xl font-bold mb-4 text-center">
                            {post.title || ''}
                          </h3>
                          {/* Centered Author and Program Type Section - Moved to bottom center */}
                          <div className="flex items-center text-sm justify-center space-x-3 mt-2">
                             {/* Author - Increased font size and icon size */}
                            {post.authorName && (
                               <span className="flex items-center text-sm opacity-90"> {/* Changed to text-sm, adjusted opacity */}
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"> {/* Increased icon size and margin */}
                                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                 </svg>
                                 {post.authorName}
                               </span>
                            )}
                            {/* Separator only if both exist */}
                            {post.authorName && post.programType?.name && (
                              <span className="text-sm opacity-70">·</span>
                            )}
                            {/* Program Type - Increased font size */}
                            {post.programType && typeof post.programType === 'object' && 'name' in post.programType && post.programType.name && (
                               <span className="inline-block px-2.5 py-1 bg-gray-600 bg-opacity-30 text-white text-opacity-95 rounded-full text-sm"> {/* Changed to text-sm, adjusted padding/opacity */}
                                   {(post.programType as ProgramTypeData).name}
                               </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* 分页控件 */}
          {!isLoading && !apiError && totalPages > 1 && (
            <div className="mt-12 mb-8">
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToNextPage={() => handlePageChange(currentPage + 1)}
                goToPreviousPage={() => handlePageChange(currentPage - 1)}
                goToPage={handlePageChange}
                getLocalizedText={getLocalizedText}
              />
            </div>
          )}

          {/* 特色视频部分 */}
          {!videoLoading && !videoError && blogVideos.length > 0 && (
            <section className="mt-16 mb-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {getLocalizedText('Featured Videos', '精选视频')}
                </h2>
                {/* 暂时隐藏“查看所有视频”链接，因为博客视频页面还在开发中 */}
                {/*
                <Link
                  to="/blog-videos"
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                >
                  {getLocalizedText('View All Videos', '查看所有视频')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                */}
              </div>
              <FeaturedVideosSection
                videos={blogVideos}
                isLoading={videoLoading}
                getLocalizedText={getLocalizedText}
              />
            </section>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
};

export default BlogPage;
