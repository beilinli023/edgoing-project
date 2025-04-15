import React from "react";
import { ImageData } from "@/types/blogTypes";
import { getImageUrl } from "@/utils/blogUtils";

interface BlogPostHeroProps {
  title: string;
  excerpt: string;
  featuredImage?: string | ImageData;
}

const BlogPostHero: React.FC<BlogPostHeroProps> = ({
  title,
  excerpt,
  featuredImage = "/Edgoing/Blog_Page/Heading1.jpg"
}) => {
  // 确保图片URL格式正确
  const imageUrl = getImageUrl(featuredImage);
  
  return (
    <div 
      className="relative h-80 md:h-96 bg-cover bg-center" 
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 pt-32 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-white text-lg md:max-w-xl mx-auto">{excerpt}</p>
      </div>
    </div>
  );
};

export default BlogPostHero;
