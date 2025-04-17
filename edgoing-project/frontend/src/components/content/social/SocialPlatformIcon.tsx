
import React from "react";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Github } from "lucide-react";

export const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  github: Github,
};

export type SocialPlatform = keyof typeof socialIcons;

interface SocialPlatformIconProps {
  platform: string;
  size?: number;
}

export const SocialPlatformIcon: React.FC<SocialPlatformIconProps> = ({ 
  platform, 
  size = 18 
}) => {
  const IconComponent = socialIcons[platform as SocialPlatform] || socialIcons.github;
  return <IconComponent size={size} />;
};
