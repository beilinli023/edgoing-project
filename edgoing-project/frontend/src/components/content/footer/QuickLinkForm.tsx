
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { QuickLink } from "@/services/contentService";

interface QuickLinkFormProps {
  newLink: Omit<QuickLink, "id">;
  setNewLink: React.Dispatch<React.SetStateAction<Omit<QuickLink, "id">>>;
  addQuickLink: () => void;
  isPending: boolean;
}

const QuickLinkForm: React.FC<QuickLinkFormProps> = ({
  newLink,
  setNewLink,
  addQuickLink,
  isPending
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <Input
          placeholder="英文文本"
          value={newLink.text_en}
          onChange={e => setNewLink({ ...newLink, text_en: e.target.value })}
        />
      </div>
      <div>
        <Input
          placeholder="中文文本"
          value={newLink.text_zh}
          onChange={e => setNewLink({ ...newLink, text_zh: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="URL 路径"
          value={newLink.url}
          onChange={e => setNewLink({ ...newLink, url: e.target.value })}
        />
        <Button 
          onClick={addQuickLink} 
          size="icon"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus size={16} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuickLinkForm;
