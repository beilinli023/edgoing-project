
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { 
  BarChart3, 
  Home, 
  Image, 
  LayoutDashboard, 
  MessageSquare, 
  Users,
  BookOpen,
  FileQuestion,
  Mail,
  Globe,
  Send,
  LogOut
} from "lucide-react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";

type DashboardSidebarProps = {
  handleNavigation: (path: string) => void;
  handleLogout: () => void;
};

const DashboardSidebar = ({ handleNavigation, handleLogout }: DashboardSidebarProps) => {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Globe className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">EdGoing</span>
            <span className="text-xs text-sidebar-foreground/70">管理系统</span>
          </div>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={true}
              onClick={() => handleNavigation("dashboard")}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>仪表盘</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleNavigation("home")}>
              <Home className="h-5 w-5" />
              <span>首页内容</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleNavigation("programs")}>
              <BookOpen className="h-5 w-5" />
              <span>项目管理</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleNavigation("blog")}>
              <MessageSquare className="h-5 w-5" />
              <span>博客管理</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleNavigation("media")}>
              <Image className="h-5 w-5" />
              <span>媒体库</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleNavigation("faq")}>
              <FileQuestion className="h-5 w-5" />
              <span>FAQ管理</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleNavigation("forms")}>
              <Mail className="h-5 w-5" />
              <span>表单管理</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleNavigation("subscription")}>
              <Send className="h-5 w-5" />
              <span>订阅者管理</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span>登出</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
