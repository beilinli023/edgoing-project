
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface QuickLink {
  id: number;
  text_en: string;
  text_zh: string;
  url: string;
  order: number;
}

// Mock service functions
const getQuickLinks = async (): Promise<QuickLink[]> => {
  // Mock data - 保留博客链接
  return [
    { id: 1, text_en: "Programs", text_zh: "项目", url: "/programs", order: 1 },
    { id: 2, text_en: "About Us", text_zh: "关于我们", url: "/about", order: 2 },
    { id: 3, text_en: "Blog", text_zh: "博客", url: "/blog", order: 3 },
    { id: 4, text_en: "Contact", text_zh: "联系我们", url: "/contact", order: 4 }
  ];
};

const saveQuickLinksToServer = async (links: QuickLink[]): Promise<QuickLink[]> => {
  // Mock implementation
  console.log("Saving links:", links);
  return links;
};

export const useQuickLinks = () => {
  const queryClient = useQueryClient();
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [newQuickLink, setNewQuickLink] = useState<Omit<QuickLink, "id">>({
    text_en: "",
    text_zh: "",
    url: "",
    order: 0
  });

  // Get footer quick links
  const { isLoading } = useQuery({
    queryKey: ['footerQuickLinks'],
    queryFn: getQuickLinks,
    meta: {
      onSuccess: (data: QuickLink[]) => {
        if (data) {
          setQuickLinks(data);
        }
      }
    },
    staleTime: 1000 * 60 * 5
  });

  // Save footer quick links
  const linksMutation = useMutation({
    mutationFn: saveQuickLinksToServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footerQuickLinks'] });
      toast({
        title: "保存成功",
        description: "页脚快速链接已更新",
      });
    },
    onError: () => {
      toast({
        title: "保存失败",
        description: "无法保存页脚快速链接，请稍后重试",
        variant: "destructive"
      });
    }
  });

  const addQuickLink = () => {
    if (newQuickLink.text_en && newQuickLink.url) {
      // For frontend demo, we're generating an ID locally
      // In a real app, this would be handled by the backend
      const tempId = Date.now();
      const newOrder = quickLinks.length + 1;
      const updatedLinks = [...quickLinks, { id: tempId, ...newQuickLink, order: newOrder }];
      setQuickLinks(updatedLinks);
      linksMutation.mutate(updatedLinks);
      setNewQuickLink({ text_en: "", text_zh: "", url: "", order: 0 });
    }
  };

  const updateQuickLink = (id: number, updates: Partial<QuickLink>) => {
    const updatedLinks = quickLinks.map(link => 
      link.id === id ? { ...link, ...updates } : link
    );
    setQuickLinks(updatedLinks);
  };

  const removeQuickLink = (id: number) => {
    const updatedLinks = quickLinks.filter(link => link.id !== id);
    setQuickLinks(updatedLinks);
  };

  const saveQuickLinksChanges = () => {
    linksMutation.mutate(quickLinks);
  };

  return {
    quickLinks,
    setQuickLinks,
    newQuickLink,
    setNewQuickLink,
    addQuickLink,
    updateQuickLink,
    removeQuickLink,
    saveQuickLinks: saveQuickLinksChanges,
    isLoading,
    isPending: linksMutation.isPending
  };
};
