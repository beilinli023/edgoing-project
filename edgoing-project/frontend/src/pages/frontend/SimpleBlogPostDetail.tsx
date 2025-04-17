import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FrontendLayout from "@/components/frontend/FrontendLayout";
import { BlogPostLoading } from "@/components/frontend/blog/detail/BlogPostLoading";
import BlogPostHero from "@/components/frontend/blog/detail/BlogPostHero";
import BlogPostContent from "@/components/frontend/blog/detail/BlogPostContent";
import BlogPostHeaderNew from "@/components/frontend/blog/detail/BlogPostHeaderNew";
import BlogPostError from "@/components/frontend/blog/detail/BlogPostError";
import { useLanguage } from "@/context/LanguageContext";
import { BlogPost } from "@/types/blogTypes";
import axios from "axios";

/**
 * 简化版的博客文章详情页面
 */
const SimpleBlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);

  // 获取博客文章数据
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        setError("未提供博客文章ID");
        setLoading(false);
        return;
      }

      try {
        // 构造请求参数
        const params = {
          locale: language === 'zh' ? 'zh' : 'en',
          includeRelated: 'true',  // 使用字符串而不是布尔值
          populate: '*' // 获取所有关联字段
        };

        // 确保参数是字符串类型
        const safeParams = {};
        Object.keys(params).forEach(key => {
          safeParams[key] = String(params[key]);
        });

        // 尝试不同的API路径
        let blogData = null;

        // 尝试使用直接访问后端API
        try {
          // 使用安全的参数
          const response = await axios.get(`/api/blog/${id}`, { params: safeParams });

          if (response.status === 200 && typeof response.data === 'object' && response.data !== null) {
            blogData = response.data;
          }
        } catch (error) {
          // 如果使用slug查询失败，尝试使用documentId查询
          try {
            // 使用安全的参数
            const docResponse = await axios.get(`/api/blog/by-document-id/${id}`, { params: safeParams });

            if (docResponse.status === 200 && typeof docResponse.data === 'object' && docResponse.data !== null) {
              blogData = docResponse.data;
            }
          } catch (docError) {
            // 两种方式都失败，不做处理，继续往下执行
          }
        }

        // 如果所有尝试都失败，抛出错误
        if (!blogData) {
          throw new Error("无法获取博客文章数据");
        }

        // 检查响应数据是否包含必要的属性
        if (!blogData.id && !blogData.title) {
          throw new Error("博客文章数据缺少必要的属性");
        }

        setBlogPost(blogData);
        setLoading(false);
      } catch (err) {
        setError("获取博客文章失败");
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, language]);

  // 设置页面标题
  useEffect(() => {
    if (blogPost) {
      const pageTitle = blogPost.title || "博客文章";
      document.title = `${pageTitle} | Edgoing`;
    } else {
      document.title = "博客文章 | Edgoing";
    }
  }, [blogPost]);

  // 渲染加载状态
  if (loading) {
    return (
      <FrontendLayout>
        <BlogPostLoading />
      </FrontendLayout>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <FrontendLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">无法加载文章</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">建议尝试以下方法：</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>刷新页面再次尝试</li>
              <li>返回<a href="/blog" className="text-blue-500 hover:underline">博客列表页面</a>选择其他文章</li>
              <li>检查网络连接是否正常</li>
              <li>联系网站管理员报告此问题</li>
            </ul>

            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
              >
                重试
              </button>
              <a
                href="/blog"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                返回博客列表
              </a>
            </div>
          </div>
        </div>
      </FrontendLayout>
    );
  }

  // 渲染未找到状态
  if (!blogPost) {
    return (
      <FrontendLayout>
        <BlogPostError message="未找到博客文章" />
      </FrontendLayout>
    );
  }

  // 渲染博客文章
  return (
    <FrontendLayout>
      <div className="blog-post-container">
        {/* 博客文章头图 */}
        <BlogPostHero
          image={blogPost.featured_image}
          slideshow={blogPost.slideshow || []}
        />

        {/* 博客文章标题和元数据 */}
        <BlogPostHeaderNew
          title={language === 'zh' ? blogPost.title_zh || blogPost.title : blogPost.title_en || blogPost.title}
          publishedDate={blogPost.date || blogPost.Date || blogPost.publishedAt || new Date().toISOString()}
          author={blogPost.authorName || blogPost.author || ""}
          currentLanguage={language}
          grade={blogPost.grade?.name || blogPost.grade?.grade || null}
          programType={blogPost.program_type?.name || blogPost.program_type?.programname || null}
          primaryCategory={blogPost.category ? { name_zh: blogPost.category, name_en: blogPost.category } : null}
        />

        {/* 博客文章内容 */}
        <BlogPostContent
          content={language === 'zh' ?
            (blogPost.content_zh || blogPost.content) :
            (blogPost.content_en || blogPost.content)}
          featuredImage={blogPost.featured_image?.url || blogPost.image?.url}
          slideshowUrls={blogPost.slideshow?.map(item => item.url) || blogPost.Slideshow?.map(item => item.url)}
        />


      </div>
    </FrontendLayout>
  );
};

export default SimpleBlogPostDetail;
