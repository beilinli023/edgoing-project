
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  setUploadFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewUrl,
  setPreviewUrl,
  setUploadFile,
  handleFileChange,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="image-upload"
        className="block p-6 border-2 border-dashed rounded-md text-center cursor-pointer"
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 mx-auto"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 bg-white/80 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewUrl(null);
                setUploadFile(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">
              点击或拖拽文件到此处上传
            </span>
            <span className="text-xs text-muted-foreground">
              支持 JPG, PNG, GIF, WebP 格式，最大 5MB
            </span>
          </div>
        )}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
