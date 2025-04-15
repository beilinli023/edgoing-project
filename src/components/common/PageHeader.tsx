
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  backUrl?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backUrl,
  actions,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div className="w-full">
        {backUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 h-8 pl-0"
            onClick={() => navigate(backUrl)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            返回
          </Button>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-center">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-center">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 mx-auto md:mx-0">{actions}</div>}
    </div>
  );
};
