
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";
import NavigationItemForm from "@/components/content/navigation/NavigationItemForm";
import NavigationItemList from "@/components/content/navigation/NavigationItemList";
import NavigationLoading from "@/components/content/navigation/NavigationLoading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsService } from "@/services/api/cmsService";
import { MenuItem } from "@/services/contentService";
import { toast } from "@/components/ui/use-toast";

// 定义一个新的类型，用于新建菜单项表单
interface NewMenuItem {
  title_en: string;
  title_zh: string;
  url: string;
  order: number;
  parent_id: number | null;
  is_visible: boolean;
}

const NavigationManager = () => {
  const queryClient = useQueryClient();
  
  // 使用React Query从API获取导航菜单数据
  const { 
    data: menuItems = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['navigationMenu'],
    queryFn: async () => {
      const response = await cmsService.navigation.getAll();
      if (response && response.data) {
        return response.data as MenuItem[];
      }
      return [];
    }
  });

  // 添加菜单项的mutation
  const addMutation = useMutation({
    mutationFn: (newItem: Omit<MenuItem, 'id'>) => {
      return cmsService.navigation.create(newItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationMenu'] });
      toast({
        title: "成功",
        description: "导航菜单项已添加",
      });
    },
    onError: (error) => {
      console.error("添加菜单项失败:", error);
      toast({
        title: "错误",
        description: "添加菜单项失败，请重试",
        variant: "destructive",
      });
    }
  });

  // 删除菜单项的mutation
  const removeMutation = useMutation({
    mutationFn: (id: number) => {
      return cmsService.navigation.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationMenu'] });
      toast({
        title: "成功",
        description: "导航菜单项已删除",
      });
    },
    onError: (error) => {
      console.error("删除菜单项失败:", error);
      toast({
        title: "错误",
        description: "删除菜单项失败，请重试",
        variant: "destructive",
      });
    }
  });

  // 更新菜单顺序的mutation
  const reorderMutation = useMutation({
    mutationFn: (items: { id: number, order: number }[]) => {
      return cmsService.navigation.updateOrder(items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigationMenu'] });
      toast({
        title: "成功",
        description: "菜单顺序已更新",
      });
    },
    onError: (error) => {
      console.error("更新菜单顺序失败:", error);
      toast({
        title: "错误",
        description: "更新菜单顺序失败，请重试",
        variant: "destructive",
      });
    }
  });

  // 菜单项状态管理
  const [newItem, setNewItem] = React.useState<NewMenuItem>({
    title_en: '',
    title_zh: '',
    url: '',
    order: 0,
    parent_id: null,
    is_visible: true
  });

  // 添加菜单项
  const addMenuItem = async () => {
    if (!newItem.title_en || !newItem.title_zh || !newItem.url) {
      toast({
        title: "验证错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      });
      return;
    }

    // 合并数据并添加到API
    const itemToAdd: Omit<MenuItem, 'id'> = {
      ...newItem,
      order: newItem.order || menuItems.length + 1,
    };

    addMutation.mutate(itemToAdd);
    
    // 重置表单
    setNewItem({
      title_en: '',
      title_zh: '',
      url: '',
      order: 0,
      parent_id: null,
      is_visible: true
    });
  };

  // 删除菜单项
  const removeMenuItem = (id: number) => {
    removeMutation.mutate(id);
  };

  // 移动菜单项（改变顺序）
  const moveMenuItem = (id: number, direction: 'up' | 'down') => {
    const currentIndex = menuItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newItems = [...menuItems];
    
    if (direction === 'up' && currentIndex > 0) {
      const temp = newItems[currentIndex - 1].order;
      newItems[currentIndex - 1].order = newItems[currentIndex].order;
      newItems[currentIndex].order = temp;
    } else if (direction === 'down' && currentIndex < newItems.length - 1) {
      const temp = newItems[currentIndex + 1].order;
      newItems[currentIndex + 1].order = newItems[currentIndex].order;
      newItems[currentIndex].order = temp;
    } else {
      return;
    }

    const updatedItems = newItems.map(item => ({
      id: item.id,
      order: item.order
    }));

    reorderMutation.mutate(updatedItems);
  };

  // 处理表单输入变化
  const handleItemChange = (updatedItem: Partial<NewMenuItem>) => {
    setNewItem({
      ...newItem,
      ...updatedItem
    });
  };

  // 错误处理
  if (error) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>导航菜单管理</CardTitle>
          <CardDescription>管理网站的主导航菜单项</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
            加载导航菜单数据失败。请刷新页面重试。
          </div>
        </CardContent>
      </Card>
    );
  }

  // 加载状态
  if (isLoading) {
    return <NavigationLoading />;
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>导航菜单管理</CardTitle>
        <CardDescription>管理网站的主导航菜单项</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <NavigationItemForm 
            newItem={newItem}
            onItemChange={handleItemChange}
            onAddItem={addMenuItem}
            isPending={addMutation.isPending}
          />

          <NavigationItemList 
            menuItems={menuItems}
            onMoveItem={moveMenuItem}
            onRemoveItem={removeMenuItem}
            isPending={removeMutation.isPending || reorderMutation.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationManager;
