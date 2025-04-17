
import React from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "@/types/blogTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/utils/blogUtils";
import { format } from "date-fns";

interface FeaturedBlogPostProps {
  post: BlogPost | undefined;
  isLoading: boolean;
  getLocalizedText: (en: string, zh: string) => string;
}

const FeaturedBlogPost: React.FC<FeaturedBlogPostProps> = ({
  post,
  isLoading,
  getLocalizedText
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-96 rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="pt-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-gray-500">
          {getLocalizedText(
            'Featured article not found',
            '未找到精选文章'
          )}
        </p>
      </div>
    );
  }

  // 获取图片URL
  const imageUrl = getImageUrl(post.featured_image);
  const title = getLocalizedText(post.title_en, post.title_zh);
  const excerpt = getLocalizedText(post.excerpt_en, post.excerpt_zh);
  
  // 格式化日期
  const formattedDate = post.date ? format(new Date(post.date), "yyyy-MM-dd") : "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-lg overflow-hidden border shadow-sm">
      <div className="h-full">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col justify-between">
        <div>
          <span className="text-sm text-gray-500">{formattedDate}</span>
          <h2 className="text-2xl font-bold mt-2 mb-4 text-gray-900">{title}</h2>
          <p className="text-gray-700 line-clamp-4 mb-6">{excerpt}</p>
        </div>
        
        <div>
          <Link 
            to={`/blog/${post.slug}`}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {getLocalizedText('Read More', '阅读更多')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogPost;
