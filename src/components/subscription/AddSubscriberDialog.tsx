
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AddSubscriberDialogProps {
  onAddSubscriber: (email: string, name: string | null) => void;
  existingEmails: string[];
}

const AddSubscriberDialog = ({ onAddSubscriber, existingEmails }: AddSubscriberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState("");
  const [newSubscriberName, setNewSubscriberName] = useState("");

  const handleAddSubscriber = () => {
    if (!newSubscriberEmail) {
      toast({
        title: "输入不完整",
        description: "请至少输入邮箱地址",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newSubscriberEmail)) {
      toast({
        title: "格式错误",
        description: "请输入有效的邮箱地址",
        variant: "destructive"
      });
      return;
    }

    if (existingEmails.includes(newSubscriberEmail)) {
      toast({
        title: "邮箱已存在",
        description: "该邮箱地址已在订阅列表中",
        variant: "destructive"
      });
      return;
    }

    onAddSubscriber(newSubscriberEmail, newSubscriberName || null);
    setNewSubscriberEmail("");
    setNewSubscriberName("");
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          添加订阅者
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>添加新订阅者</AlertDialogTitle>
          <AlertDialogDescription>
            请输入新订阅者的邮箱地址和姓名（可选）
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              邮箱地址 <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              value={newSubscriberEmail}
              onChange={(e) => setNewSubscriberEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              姓名（可选）
            </label>
            <Input
              id="name"
              value={newSubscriberName}
              onChange={(e) => setNewSubscriberName(e.target.value)}
              placeholder="订阅者姓名"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddSubscriber}>添加</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddSubscriberDialog;
