
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";

const Index = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    toast({
      title: "导航",
      description: `即将导航到 ${path} 页面`,
    });
    
    // 实际导航功能
    if (path === "dashboard") {
      navigate("/");
    } else {
      navigate(`/admin/${path}`);
    }
  };

  const handleLogout = () => {
    toast({
      title: "登出成功",
      description: "您已成功退出管理系统",
    });
    // 导航到登录页面
    navigate("/login");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-sidebar">
        <DashboardSidebar 
          handleNavigation={handleNavigation} 
          handleLogout={handleLogout}
        />

        <SidebarInset className="bg-background">
          <DashboardContent 
            handleNavigation={handleNavigation} 
            handleLogout={handleLogout}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
