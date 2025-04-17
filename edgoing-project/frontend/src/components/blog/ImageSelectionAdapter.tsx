
import React from 'react';
import { ImageData } from '@/types/blogTypes';
import { MediaImageData, convertToBlogImageData } from '@/services/blog/mediaService';

interface ImageSelectionAdapterProps {
  onSelect: (image: ImageData) => void;
}

// This component adapts different image sources to the common ImageData format
const ImageSelectionAdapter: React.FC<ImageSelectionAdapterProps> = ({ onSelect }) => {
  // Handle image selection from media library
  const handleMediaImageSelect = (mediaImage: MediaImageData) => {
    const blogImage = convertToBlogImageData(mediaImage);
    onSelect(blogImage);
  };

  // Handle direct URL selection
  const handleUrlSelect = (url: string) => {
    const blogImage: ImageData = {
      id: Math.floor(Math.random() * 10000),
      url
    };
    onSelect(blogImage);
  };

  return null; // This is a utility component that doesn't render UI
};

export default ImageSelectionAdapter;
