import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BlogPostCarouselProps {
  images: string[];
  imageAlt?: string;
}

/**
 * 处理图片URL，确保它可以正确加载
 * 如果路径已经是绝对URL或正确的站内路径，则直接返回
 * 否则使用备用图片
 */
const getValidImageUrl = (imagePath: string): string => {
  // 备用图片路径
  const fallbackImage = "/lovable-uploads/singapore-skyline.jpg";
  const strapiBaseUrl = 'http://localhost:1337'; // Strapi 服务器的基础 URL

  // 调试：输出原始路径
  console.log("原始图片路径:", imagePath);

  // 如果没有提供图片路径，返回备用图片
  if (!imagePath) {
    console.log("没有图片路径，使用备用图片");
    return fallbackImage;
  }

  try {
    // 检查路径是否为绝对URL（以http或https开头）
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log("使用绝对URL:", imagePath);
      // 直接返回完整URL
      return imagePath;
    }

    // 如果是 Strapi 上传路径
    if (imagePath.includes('/uploads/')) {
      // 如果路径已经是以 / 开头，添加 Strapi 基础 URL
      if (imagePath.startsWith('/')) {
        const fullUrl = `${strapiBaseUrl}${imagePath}`;
        console.log("添加 Strapi 基础 URL:", fullUrl);
        return fullUrl;
      } else {
        // 如果路径不是以 / 开头，添加 / 和 Strapi 基础 URL
        const fullUrl = `${strapiBaseUrl}/${imagePath}`;
        console.log("添加 / 和 Strapi 基础 URL:", fullUrl);
        return fullUrl;
      }
    }

    // 如果是博客图片的特殊处理
    if (imagePath.includes('blog') && (imagePath.includes('blog1-') || imagePath.includes('blog2-') ||
        imagePath.includes('blog3-') || imagePath.includes('blog4-') || imagePath.includes('blog5-'))) {
      const parsedPath = imagePath.trim();
      // 如果路径不是以/开头但包含blog文件名，将其转换为正确的路径
      if (!parsedPath.startsWith('/')) {
        const correctPath = `/Edgoing/Blog_Page/${parsedPath.split('/').pop()}`;
        console.log("修正博客图片路径:", correctPath);
        return correctPath;
      }
    }

    // 修复：确保路径正确处理
    // 如果路径已经是以 / 开头，并且不是以 /Volumes 开头的绝对路径
    if (imagePath.startsWith('/') && !imagePath.startsWith('/Volumes')) {
      console.log("使用以/开头的相对路径:", imagePath);
      return imagePath;
    }

    // 如果是绝对路径，提取出相对路径部分
    if (imagePath.includes('/public/')) {
      const relativePath = imagePath.split('/public/')[1];
      console.log("从绝对路径提取:", relativePath);
      return `/${relativePath}`;
    }

    // 使用相对路径（确保路径以/开头）
    const result = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    console.log("处理后的路径:", result);
    return result;
  } catch (error) {
    console.error('处理图片路径时出错:', error);
    return fallbackImage;
  }
};

/**
 * 博客文章图片轮播组件
 * 用于显示博客文章中的多张图片
 */
const BlogPostCarousel: React.FC<BlogPostCarouselProps> = ({ images, imageAlt }) => {
  // 调试：输出传入的图片数组的详细信息
  console.log('★★★ BlogPostCarousel 收到的图片数组:', images);
  console.log('★★★ BlogPostCarousel 收到的图片数量:', images?.length || 0);
  console.log('★★★ BlogPostCarousel 收到的 imageAlt:', imageAlt);

  // 详细检查每个图片项
  if (Array.isArray(images)) {
    images.forEach((image, index) => {
      console.log(`★★★ 图片 ${index} 类型:`, typeof image);
      console.log(`★★★ 图片 ${index} 值:`, image);
    });
  }

  // 如果没有图片，不渲染任何内容
  if (!images || images.length === 0) {
    console.log('★★★ 没有图片，不渲染轮播图');
    return null;
  }

  // 如果只有一张图片，直接显示单张图片
  if (images.length === 1) {
    const imageUrl = getValidImageUrl(images[0]);
    console.log('★★★ 单张图片处理后的URL:', imageUrl);

    return (
      <div className="mb-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
          <img
            src={imageUrl}
            alt={imageAlt || "博客图片"}
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={(e) => {
              console.error('★★★ 图片加载失败:', imageUrl);
              e.currentTarget.src = '/lovable-uploads/singapore-skyline.jpg';
            }}
          />
        </div>
      </div>
    );
  }

  // 多张图片时显示轮播图
  return (
    <div className="mb-8 relative w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full overflow-visible"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
                <img
                  src={getValidImageUrl(image)}
                  alt={`${imageAlt || "博客图片"} ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.error('★★★ 轮播图片加载失败:', image);
                    e.currentTarget.src = '/lovable-uploads/singapore-skyline.jpg';
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -left-2 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10">
          <CarouselPrevious className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-primary opacity-90 hover:opacity-100 bg-white/90 shadow-md" />
        </div>
        <div className="absolute -right-2 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10">
          <CarouselNext className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-primary opacity-90 hover:opacity-100 bg-white/90 shadow-md" />
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full bg-white/70 opacity-80`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default BlogPostCarousel;
