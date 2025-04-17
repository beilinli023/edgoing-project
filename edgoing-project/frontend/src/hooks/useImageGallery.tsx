
import { useState, useEffect, useCallback } from 'react';
import { ImageData } from '@/types/blogTypes';
import { convertStringsToImageData } from '@/services/blog/mediaService';
import { blogService } from '@/services/blog';

export interface UseImageGalleryProps {
  onSelect?: (image: ImageData) => void;
  onClose?: () => void;
  initialSelectedImage?: ImageData | null;
}

export const useImageGallery = ({
  onSelect,
  onClose,
  initialSelectedImage = null
}: UseImageGalleryProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(initialSelectedImage);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch images from the API or use mock data
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const imageList = await blogService.mediaService.getImageList();
      setImages(imageList);
    } catch (error) {
      console.error('Error fetching images:', error);
      // Get mock images and convert them to ImageData objects
      const mockImageUrls = await blogService.mediaService.getAvailableImages();
      setImages(convertStringsToImageData(mockImageUrls));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch of images
  useEffect(() => {
    if (isVisible) {
      fetchImages();
    }
  }, [isVisible, fetchImages]);

  // Open the gallery
  const openGallery = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Close the gallery
  const closeGallery = useCallback(() => {
    setIsVisible(false);
    setSelectedImage(null);
    onClose?.();
  }, [onClose]);

  // Handle image selection
  const handleImageSelect = useCallback((image: ImageData) => {
    setSelectedImage(image);
  }, []);

  // Confirm selection
  const confirmSelection = useCallback(() => {
    if (selectedImage && onSelect) {
      onSelect(selectedImage);
    }
    closeGallery();
  }, [selectedImage, onSelect, closeGallery]);

  // Handle file upload
  const uploadImage = useCallback(async (file: File) => {
    setUploadProgress(0);
    try {
      const uploadedImage = await blogService.mediaService.uploadBlogImage(file);
      if (uploadedImage) {
        setImages(prev => [uploadedImage, ...prev]);
        setSelectedImage(uploadedImage);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadProgress(0);
    }
  }, []);

  // Filter images based on search term
  const filteredImages = searchTerm
    ? images.filter(img => 
        img.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.alt && img.alt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : images;

  return {
    isVisible,
    images: filteredImages,
    selectedImage,
    isLoading,
    searchTerm,
    uploadProgress,
    openGallery,
    closeGallery,
    handleImageSelect,
    confirmSelection,
    setSearchTerm,
    uploadImage,
    fetchImages
  };
};

export default useImageGallery;
