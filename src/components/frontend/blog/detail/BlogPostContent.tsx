import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BlogPostCarousel from "./BlogPostCarousel";
import { BlogPost } from "@/types/blogTypes";
import { Skeleton } from '@/components/ui/skeleton';
import RichTextRenderer from './RichTextRenderer';
import { BlockNode } from './RichTextRenderer';

interface ExtendedBlogPost extends BlogPost {
  images?: string[];
  Slideshow?: Array<{
    id: number;
    url: string;
    attributes?: {
      url: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }>;
}

export interface BlogPostContentProps {
  content: unknown;
  featuredImage?: string | null;
  imageAlt?: string;
  showFeaturedImage?: boolean;
  slideshowUrls?: string[] | null;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({
  content,
  featuredImage,
  imageAlt,
  showFeaturedImage = true,
  slideshowUrls = [],
}) => {
  console.log('[BlogPostContent] Received Props (Again):', { content: typeof content, featuredImage, imageAlt, showFeaturedImage, slideshowUrls });
  // console.log('[BlogPostContent] Received content prop structure:', JSON.stringify(content, null, 2)); // Keep this commented unless needed

  const slideImages = slideshowUrls && slideshowUrls.length > 0
    ? slideshowUrls
    : featuredImage ? [featuredImage] : [];

  const renderFeaturedImage = () => {
    if (!featuredImage) return null;
    return <img src={featuredImage} alt={imageAlt || 'Featured Image'} className="w-full h-auto object-cover rounded-lg mb-8 shadow-md" />;
  };

  const renderSlideshow = () => {
    // 输出原始 slideshowUrls 的详细信息
    console.log('原始 slideshowUrls:', slideshowUrls);
    console.log('原始 slideshowUrls 类型:', typeof slideshowUrls);
    console.log('原始 slideshowUrls 是否为数组:', Array.isArray(slideshowUrls));

    // 确保 slideshowUrls 是字符串数组
    let validUrls: string[] = [];

    try {
      // 处理不同的轮播图数据结构
      if (Array.isArray(slideshowUrls)) {
        // 处理字符串数组
        validUrls = slideshowUrls.filter(url => typeof url === 'string' && url.trim() !== '');
      } else if (slideshowUrls && typeof slideshowUrls === 'object') {
        // 如果 slideshowUrls 是对象，尝试提取 url 属性
        console.log('尝试从对象中提取 URL');

        // 尝试不同的属性名
        if ('url' in slideshowUrls && typeof slideshowUrls.url === 'string') {
          validUrls = [slideshowUrls.url];
        } else if (slideshowUrls.data && Array.isArray(slideshowUrls.data)) {
          // 如果有 data 属性且是数组
          validUrls = slideshowUrls.data
            .map(item => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object' && 'url' in item) return item.url;
              if (item && typeof item === 'object' && item.attributes && item.attributes.url) return item.attributes.url;
              return null;
            })
            .filter((url): url is string => !!url);
        }
      }

      // 输出处理后的轮播图 URL 列表
      console.log('处理后的轮播图 URL 列表:', validUrls);
      console.log('处理后的轮播图 URL 数量:', validUrls.length);

      // 如果没有有效的轮播图 URL，尝试使用主图
      const imagesToUse = validUrls.length > 0 ? validUrls : (featuredImage ? [featuredImage] : []);
      console.log('最终使用的图片列表:', imagesToUse);

      // 如果没有图片或只有一张图片，不显示轮播图
      if (imagesToUse.length <= 1) {
        console.log('图片数量不足，不显示轮播图');
        return null;
      }

      // 输出传递给 BlogPostCarousel 的参数
      console.log('传递给 BlogPostCarousel 的参数:', {
        images: imagesToUse,
        imageAlt: imageAlt
      });

      return (
        <div className="mb-8">
          <BlogPostCarousel images={imagesToUse} imageAlt={imageAlt} />
        </div>
      );
    } catch (error) {
      console.error('处理轮播图时出错:', error);
      return null;
    }
  };

  const renderRichText = () => {
    if (Array.isArray(content)) {
       return <RichTextRenderer blocks={content as BlockNode[]} />;
    } else if (typeof content === 'string' && content.trim()) {
      // If content is a string, split by newline and render paragraphs with explicit margin
      return content.split('\n').map((paragraph, index) =>
        paragraph.trim() ? <p key={index} className="mb-4">{paragraph.trim()}</p> : null
      ).filter(Boolean); // Filter out potential nulls from empty lines
    } else {
      return <p className="text-gray-500">No content available.</p>;
    }
  };

  return (
    <div className="mt-8">
      {/* Wrap image and slideshow in a flex container to enforce stacking */}
      <div className="flex flex-col mb-8">
        {/* {renderFeaturedImage()} // Remove featured image rendering as requested */}
        {renderSlideshow()}
      </div>
      <div className="blog-content-rich-text prose dark:prose-invert max-w-none">
        {renderRichText()}
      </div>
    </div>
  );
};

export default BlogPostContent;
