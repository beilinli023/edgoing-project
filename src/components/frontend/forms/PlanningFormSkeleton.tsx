import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PlanningFormSkeleton: React.FC = () => {
  return (
    <>
      <div className="relative pt-20 pb-32 text-white bg-gray-500 bg-opacity-70">
        <div className="container-fluid w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center mt-24">
          <Skeleton className="h-12 w-2/3 mx-auto bg-gray-400 mb-4" />
          <Skeleton className="h-6 w-4/5 mx-auto bg-gray-400" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-1/2 mx-auto bg-gray-200 mb-4" />
            <Skeleton className="h-4 w-3/4 mx-auto bg-gray-200 mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto bg-gray-200" />
          </div>

          <div className="space-y-6">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanningFormSkeleton;
