
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SocialPlatform, socialIcons } from "./SocialPlatformIcon";

interface SocialMediaFormProps {
  newLink: {
    platform: SocialPlatform;
    url: string;
  };
  setNewLink: React.Dispatch<React.SetStateAction<{
    platform: SocialPlatform;
    url: string;
  }>>;
  addSocialLink: () => void;
  isPending: boolean;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({
  newLink,
  setNewLink,
  addSocialLink,
  isPending
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <select
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
          value={newLink.platform}
          onChange={e => setNewLink({ ...newLink, platform: e.target.value as SocialPlatform })}
        >
          {Object.keys(socialIcons).map(platform => (
            <option key={platform} value={platform}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2 flex gap-2">
        <Input
          placeholder="社交媒体链接"
          value={newLink.url}
          onChange={e => setNewLink({ ...newLink, url: e.target.value })}
        />
        <Button 
          onClick={addSocialLink} 
          size="icon"
          disabled={isPending}
        >
          {isPending ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Plus size={16} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaForm;
