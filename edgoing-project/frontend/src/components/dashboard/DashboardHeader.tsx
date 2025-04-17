
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  handleLogout: () => void;
};

const DashboardHeader = ({ title, subtitle, handleLogout }: DashboardHeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="w-full text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button size="sm" variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          登出
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
