
import React from "react";
import { ImageData } from "@/types/blogTypes";

interface ImageGridProps {
  images: ImageData[];
  selectedImage: ImageData | null;
  onImageClick: (image: ImageData) => void;
  isLoading: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  selectedImage,
  onImageClick,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="text-center py-4">加载中...</div>;
  }
  
  if (images.length === 0) {
    return (
      <div className="text-center py-4">
        暂无图片
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image: ImageData) => (
        <div
          key={typeof image === 'string' ? image : image.id.toString()}
          className={`
            relative aspect-square border rounded-md overflow-hidden cursor-pointer transition-all
            ${selectedImage && (typeof selectedImage === 'string' ? selectedImage === image : selectedImage.id === image.id)
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:opacity-90"
            }
          `}
          onClick={() => onImageClick(image)}
        >
          <img
            src={typeof image === 'string' ? image : image.url}
            alt={typeof image === 'string' ? "" : image.alt || ""}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
