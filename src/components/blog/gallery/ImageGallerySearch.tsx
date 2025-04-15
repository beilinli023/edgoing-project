
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ImageData } from "@/types/blogTypes";

interface ImageGallerySearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ImageGallerySearch: React.FC<ImageGallerySearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="mb-4 relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索图片..."
        className="pl-10"
      />
    </div>
  );
};

export default ImageGallerySearch;
