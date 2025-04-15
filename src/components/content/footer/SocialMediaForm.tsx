
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialMedia } from "@/types/cmsTypes";

interface SocialMediaFormProps {
  newSocialMedia: Omit<SocialMedia, "id">;
  setNewSocialMedia: React.Dispatch<React.SetStateAction<Omit<SocialMedia, "id">>>;
  addSocialMedia: () => void;
  isPending: boolean;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({
  newSocialMedia,
  setNewSocialMedia,
  addSocialMedia,
  isPending
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div>
        <Select 
          value={newSocialMedia.platform}
          onValueChange={(value) => setNewSocialMedia({ 
            ...newSocialMedia, 
            platform: value,
            icon: value // 平台名称同时也作为图标
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择平台" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="wechat">微信</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:col-span-2">
        <Input
          placeholder="URL链接"
          value={newSocialMedia.url}
          onChange={e => setNewSocialMedia({ ...newSocialMedia, url: e.target.value })}
        />
      </div>
      
      <div>
        <Button 
          onClick={addSocialMedia} 
          className="w-full"
          disabled={isPending || !newSocialMedia.platform || !newSocialMedia.url}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              添加中
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" />
              添加
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaForm;
