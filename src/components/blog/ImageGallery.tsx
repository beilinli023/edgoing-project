
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { blogService } from "@/services/blog";
import { ImageData } from "@/types/blogTypes";
import { useQuery } from "@tanstack/react-query";
import GalleryContent from "./gallery/GalleryContent";

interface ImageGalleryProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (image: ImageData) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  isVisible,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [activeTab, setActiveTab] = useState("browse");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch images
  const { data: images = [], isLoading } = useQuery({
    queryKey: ["blogImages"],
    queryFn: () => blogService.mediaService.getImageList(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Filter images based on search term
  const filteredImages = searchTerm
    ? images.filter((img: ImageData) => 
        img.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.alt && img.alt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : images;

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image selection
  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
    } else if (previewUrl && uploadFile) {
      // Create a temporary image object with the preview URL
      const tempImage: ImageData = {
        id: new Date().getTime(),
        url: previewUrl,
        alt: uploadFile.name
      };
      onSelect(tempImage);
    }
  };

  // Reset state when dialog is closed
  useEffect(() => {
    if (!isVisible) {
      setSelectedImage(null);
      setSearchTerm("");
      setUploadFile(null);
      setPreviewUrl(null);
      setActiveTab("browse");
    }
  }, [isVisible]);

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>图片库</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="browse"
          className="flex-1 overflow-hidden flex flex-col"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 w-48">
            <TabsTrigger value="browse">浏览图片</TabsTrigger>
            <TabsTrigger value="upload">上传图片</TabsTrigger>
          </TabsList>

          <GalleryContent
            activeTab={activeTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredImages={filteredImages}
            isLoading={isLoading}
            selectedImage={selectedImage}
            handleImageClick={handleImageClick}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            setUploadFile={setUploadFile}
            handleFileChange={handleFileChange}
          />
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={(activeTab === "browse" && !selectedImage) || 
                     (activeTab === "upload" && !previewUrl)}
          >
            确认选择
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGallery;
