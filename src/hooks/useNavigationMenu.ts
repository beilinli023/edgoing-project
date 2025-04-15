
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNavigationMenu, saveNavigationMenu } from "@/services/contentService";
import { toast } from "@/components/ui/use-toast";

export interface MenuItem {
  id: number;
  title_en: string;
  title_zh: string;
  url: string;
  order: number;
  parent_id: number | null;
  is_visible: boolean;
}

export const useNavigationMenu = () => {
  const queryClient = useQueryClient();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    title_en: "",
    title_zh: "",
    url: ""
  });

  // Get navigation menu items
  const { isLoading } = useQuery({
    queryKey: ['navigationMenu'],
    queryFn: getNavigationMenu,
    meta: {
      onSuccess: (data: MenuItem[]) => {
        setMenuItems(data);
      },
      onError: (error: Error) => {
        console.error("Error fetching navigation menu:", error);
      }
    }
  });

  // Save navigation menu items
  const menuMutation = useMutation({
    mutationFn: (items: MenuItem[]) => saveNavigationMenu(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationMenu'] });
      toast({
        title: "保存成功",
        description: "导航菜单已更新",
      });
    },
    onError: () => {
      toast({
        title: "保存失败",
        description: "无法保存导航菜单，请稍后重试",
        variant: "destructive"
      });
    }
  });

  const addMenuItem = () => {
    if (newItem.title_en && newItem.url) {
      // For frontend demo, we're generating an ID locally
      // In a real app, this would be handled by the backend
      const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
      const newOrder = menuItems.length + 1;
      
      const completeItem: MenuItem = {
        id: newId,
        title_en: newItem.title_en || "", 
        title_zh: newItem.title_zh || "",
        url: newItem.url || "",
        order: newOrder,
        parent_id: null,
        is_visible: true
      };
      
      const updatedItems = [...menuItems, completeItem];
      setMenuItems(updatedItems);
      menuMutation.mutate(updatedItems);
      setNewItem({ title_en: "", title_zh: "", url: "" });
    }
  };

  const updateMenuItem = (id: number, updates: Partial<MenuItem>) => {
    const updatedItems = menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setMenuItems(updatedItems);
    menuMutation.mutate(updatedItems);
  };

  const removeMenuItem = (id: number) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedItems);
    menuMutation.mutate(updatedItems);
  };

  const moveMenuItem = (id: number, direction: 'up' | 'down') => {
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    
    const item = menuItems[itemIndex];
    const parentId = item.parent_id;
    
    // Get siblings (items with the same parent)
    const siblings = menuItems.filter(mi => mi.parent_id === parentId);
    const siblingIndex = siblings.findIndex(s => s.id === id);
    
    if ((direction === 'up' && siblingIndex === 0) || 
        (direction === 'down' && siblingIndex === siblings.length - 1)) {
      return; // Already at the top/bottom
    }
    
    // Find target sibling
    const targetSiblingIndex = direction === 'up' ? siblingIndex - 1 : siblingIndex + 1;
    const targetSibling = siblings[targetSiblingIndex];
    
    // Swap orders
    const updatedItems = menuItems.map(mi => {
      if (mi.id === id) {
        return { ...mi, order: targetSibling.order };
      } else if (mi.id === targetSibling.id) {
        return { ...mi, order: item.order };
      }
      return mi;
    });
    
    setMenuItems(updatedItems.sort((a, b) => a.order - b.order));
    menuMutation.mutate(updatedItems);
  };

  return {
    menuItems,
    newItem,
    setNewItem,
    isLoading,
    isPending: menuMutation.isPending,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    moveMenuItem,
  };
};
