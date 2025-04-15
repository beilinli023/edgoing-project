
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ImageGallerySearch from "./ImageGallerySearch";
import ImageGrid from "./ImageGrid";
import ImageUploader from "./ImageUploader";
import { ImageData } from "@/types/blogTypes";

interface GalleryContentProps {
  activeTab: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredImages: ImageData[];
  isLoading: boolean;
  selectedImage: ImageData | null;
  handleImageClick: (image: ImageData) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  setUploadFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GalleryContent: React.FC<GalleryContentProps> = ({
  activeTab,
  searchTerm,
  setSearchTerm,
  filteredImages,
  isLoading,
  selectedImage,
  handleImageClick,
  previewUrl,
  setPreviewUrl,
  setUploadFile,
  handleFileChange,
}) => {
  return (
    <>
      <TabsContent value="browse" className="flex-1 overflow-hidden flex flex-col">
        <ImageGallerySearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex-1 overflow-y-auto">
          <ImageGrid 
            images={filteredImages}
            selectedImage={selectedImage}
            onImageClick={handleImageClick}
            isLoading={isLoading}
          />
        </div>
      </TabsContent>

      <TabsContent value="upload" className="flex-1 overflow-hidden flex flex-col">
        <ImageUploader
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          setUploadFile={setUploadFile}
          handleFileChange={handleFileChange}
        />
      </TabsContent>
    </>
  );
};

export default GalleryContent;
