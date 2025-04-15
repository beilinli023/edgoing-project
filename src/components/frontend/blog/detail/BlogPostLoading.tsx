
import React from "react";
import FrontendLayout from "@/components/frontend/FrontendLayout";
import { Skeleton } from "@/components/ui/skeleton";

export const BlogPostLoading: React.FC = () => {
  return (
    <FrontendLayout>
      {/* Hero skeleton */}
      <div className="relative h-80 md:h-96 bg-gray-200 animate-pulse">
        <div className="container mx-auto px-4 pt-32 text-center">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
      </div>
      
      {/* Navigation skeleton */}
      <div className="container mx-auto px-4 pt-8">
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Content skeleton */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          
          {/* Tags skeleton */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <Skeleton className="h-6 w-20 mb-3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </FrontendLayout>
  );
};

export default BlogPostLoading;
