
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsService } from "@/services/api/cmsService";
import { SocialMedia } from "@/types/cmsTypes";
import { toast } from "@/components/ui/use-toast";
import { SocialPlatform } from "@/components/content/social/SocialPlatformIcon";

export const useSocialMediaManager = () => {
  const queryClient = useQueryClient();
  const [newLink, setNewLink] = React.useState<{
    platform: SocialPlatform;
    url: string;
  }>({
    platform: "facebook",
    url: "",
  });

  // 使用React Query从API获取社交媒体链接
  const { 
    data: socialLinks = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['socialMedia'],
    queryFn: async () => {
      const response = await cmsService.socialMedia.getAll();
      return response.data as SocialMedia[];
    }
  });

  // 添加社交媒体链接的mutation
  const addSocialLinkMutation = useMutation({
    mutationFn: (newSocial: Omit<SocialMedia, 'id'>) => {
      return cmsService.socialMedia.create(newSocial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMedia'] });
      toast({
        title: "成功",
        description: "社交媒体链接已添加",
      });
      setNewLink({ platform: "facebook", url: "" });
    },
    onError: (error) => {
      console.error("添加社交媒体链接失败:", error);
      toast({
        title: "错误",
        description: "添加社交媒体链接失败，请重试",
        variant: "destructive",
      });
    }
  });

  // 删除社交媒体链接的mutation
  const removeSocialLinkMutation = useMutation({
    mutationFn: (id: number) => {
      return cmsService.socialMedia.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMedia'] });
      toast({
        title: "成功",
        description: "社交媒体链接已删除",
      });
    },
    onError: (error) => {
      console.error("删除社交媒体链接失败:", error);
      toast({
        title: "错误",
        description: "删除社交媒体链接失败，请重试",
        variant: "destructive",
      });
    }
  });

  const addSocialLink = () => {
    if (!newLink.platform || !newLink.url) {
      toast({
        title: "验证错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      });
      return;
    }

    const socialToAdd = {
      platform: newLink.platform,
      icon: newLink.platform, // 使用平台名称作为图标标识
      url: newLink.url,
      order: socialLinks.length + 1
    } as Omit<SocialMedia, 'id'>;

    addSocialLinkMutation.mutate(socialToAdd);
  };

  const removeSocialLink = (id: number) => {
    removeSocialLinkMutation.mutate(id);
  };

  return {
    socialLinks,
    newLink,
    setNewLink,
    addSocialLink,
    removeSocialLink,
    isLoading,
    error,
    isPending: addSocialLinkMutation.isPending || removeSocialLinkMutation.isPending
  };
};
