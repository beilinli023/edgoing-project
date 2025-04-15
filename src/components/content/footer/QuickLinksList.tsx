
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { QuickLink } from "@/services/contentService";

interface QuickLinksListProps {
  quickLinks: QuickLink[];
  removeQuickLink: (id: number) => void;
  isPending: boolean;
}

const QuickLinksList: React.FC<QuickLinksListProps> = ({
  quickLinks,
  removeQuickLink,
  isPending
}) => {
  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-7 gap-2 bg-muted p-3 rounded-t-md">
        <div className="col-span-3">英文文本</div>
        <div className="col-span-3">中文文本</div>
        <div className="col-span-1">操作</div>
      </div>
      <div className="divide-y">
        {quickLinks.map(link => (
          <div key={link.id} className="grid grid-cols-7 gap-2 p-3 items-center">
            <div className="col-span-3 flex items-center">
              <div>{link.text_en}</div>
              <div className="text-sm text-muted-foreground ml-2">({link.url})</div>
            </div>
            <div className="col-span-3">{link.text_zh}</div>
            <div className="col-span-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeQuickLink(link.id)}
                disabled={isPending}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickLinksList;
