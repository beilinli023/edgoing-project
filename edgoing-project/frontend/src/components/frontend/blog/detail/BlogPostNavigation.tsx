
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BlogPostNavigationProps {
  backLabel: string;
}

const BlogPostNavigation: React.FC<BlogPostNavigationProps> = ({
  backLabel
}) => {
  return (
    <div className="container mx-auto px-4 pt-8">
      <Link to="/blog">
        <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {backLabel}
        </Button>
      </Link>
    </div>
  );
};

export default BlogPostNavigation;
