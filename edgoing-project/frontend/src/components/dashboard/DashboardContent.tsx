
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "./DashboardHeader";
import StatsCard from "./StatsCard";
import QuickActionsCard from "./QuickActionsCard";
import GettingStartedCard from "./GettingStartedCard";
import { 
  BookOpen, 
  MessageSquare, 
  FileQuestion, 
  Image, 
  Mail, 
  BarChart3,
  LucideIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { cmsService } from "@/services/api/cmsService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type DashboardContentProps = {
  handleNavigation: (path: string) => void;
  handleLogout: () => void;
};

type DashboardStats = {
  programCount: number;
  blogPostCount: number;
  faqCount: number;
  mediaCount: number;
  newSubmissions: number;
  completedSubmissions: number;
  totalSubmissions: number;
  quickActions: Array<{
    label: string;
    icon: string;
    path: string;
  }>;
};

const DashboardContent = ({ handleNavigation, handleLogout }: DashboardContentProps) => {
  // 使用React Query获取仪表盘数据
  const { 
    data: stats, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const response = await cmsService.dashboard.getStats();
        if (response.success && response.data) {
          return response.data as DashboardStats;
        }
        throw new Error("无法获取仪表盘数据");
      } catch (error) {
        console.error("加载仪表盘数据失败:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5分钟缓存
  });

  // 处理错误情况
  useEffect(() => {
    if (error) {
      toast({
        title: "数据加载失败",
        description: "无法加载仪表盘统计数据，请刷新页面重试",
        variant: "destructive"
      });
    }
  }, [error]);

  // 获取统计数据或使用默认值
  const safeStats = stats || {
    programCount: 0,
    blogPostCount: 0,
    faqCount: 0,
    mediaCount: 0,
    newSubmissions: 0,
    completedSubmissions: 0,
    totalSubmissions: 0,
    quickActions: []
  };

  // 根据API返回的数据生成统计卡片
  const contentStats = [
    { label: "项目总数", value: String(safeStats.programCount), icon: BookOpen },
    { label: "博客文章", value: String(safeStats.blogPostCount), icon: MessageSquare },
    { label: "FAQ问题", value: String(safeStats.faqCount), icon: FileQuestion },
    { label: "媒体文件", value: String(safeStats.mediaCount), icon: Image },
  ];

  const formStats = [
    { label: "新提交", value: String(safeStats.newSubmissions), icon: Mail },
    { label: "已处理", value: String(safeStats.completedSubmissions), icon: Mail, iconColor: "text-green-500", badgeColor: "bg-green-100 text-green-700" },
    { label: "总计", value: String(safeStats.totalSubmissions), icon: BarChart3 },
  ];

  // 快速操作项目 - 也可以从API获取，但这里暂时保持不变
  const quickActions = stats?.quickActions?.map(item => ({
    label: item.label,
    icon: getIconByName(item.icon),
    path: item.path,
    onClick: handleNavigation
  })) || [
    { label: "添加新项目", icon: BookOpen, path: "programs", onClick: handleNavigation },
    { label: "添加新文章", icon: MessageSquare, path: "blog", onClick: handleNavigation },
    { label: "上传新媒体", icon: Image, path: "media", onClick: handleNavigation },
  ];

  return (
    <div className="flex flex-col p-6 w-full">
      <DashboardHeader 
        title="仪表盘" 
        subtitle="欢迎使用 EdGoing 国际教育项目网站管理系统" 
        handleLogout={handleLogout} 
      />
      <Separator className="mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="内容统计" 
          description="网站内容总览" 
          items={contentStats} 
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="表单提交" 
          description="用户表单数据" 
          items={formStats} 
          isLoading={isLoading}
        />
        
        <QuickActionsCard 
          title="快速操作" 
          description="常用功能快捷入口" 
          actions={quickActions} 
        />
      </div>
      
      <div className="mt-6">
        <GettingStartedCard />
      </div>
    </div>
  );
};

// 根据图标名称获取对应的图标组件
function getIconByName(iconName: string) {
  const iconMap: Record<string, LucideIcon> = {
    'BookOpen': BookOpen,
    'MessageSquare': MessageSquare,
    'FileQuestion': FileQuestion,
    'Image': Image,
    'Mail': Mail,
    'BarChart3': BarChart3,
  };
  
  return iconMap[iconName] || BookOpen; // 默认返回BookOpen图标
}

export default DashboardContent;
