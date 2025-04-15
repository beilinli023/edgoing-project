
import React from "react";

const BlogPostsLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-2">
      <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500">正在加载文章...</p>
    </div>
  );
};

export default BlogPostsLoading;
