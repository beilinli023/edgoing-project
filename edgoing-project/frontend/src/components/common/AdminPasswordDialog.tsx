
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

// 设置超级管理员密码，实际应用中应该从后端验证
// 这里为了演示，使用一个固定的密码
const ADMIN_PASSWORD = "admin123";

interface AdminPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

const AdminPasswordDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "管理员验证",
  description = "请输入超级管理员密码以继续操作",
  confirmLabel = "确认",
}: AdminPasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setIsLoading(true);
    setError(null);
    
    // 在实际应用中，应该通过API请求验证密码
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsLoading(false);
        setPassword("");
        onConfirm();
        onClose();
      } else {
        setIsLoading(false);
        setError("密码错误，请重试");
        toast({
          variant: "destructive",
          title: "验证失败",
          description: "管理员密码错误，无法完成操作"
        });
      }
    }, 500); // 模拟网络请求延迟
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">超级管理员密码</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className={error ? "border-red-500" : ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!password || isLoading}
          >
            {isLoading ? "验证中..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordDialog;
