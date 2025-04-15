import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { DownloadCloud } from "lucide-react";
import AdminPasswordDialog from "@/components/common/AdminPasswordDialog";
import SubscriptionFilters from "./SubscriptionFilters";
import SubscriptionStats from "./SubscriptionStats";
import SubscriberTable from "./SubscriberTable";
import EmptySubscriberState from "./EmptySubscriberState";
import AddSubscriberDialog from "./AddSubscriberDialog";
import { Subscriber } from "@/types/subscriberTypes";

const mockSubscribers: Subscriber[] = [
  {
    id: 1,
    email: "zhang.wei@example.com",
    name: "张伟",
    status: "active",
    subscribedAt: "2023-10-15T08:30:00Z",
    lastEmailedAt: "2023-11-10T14:22:00Z",
    source: "网站表单",
    tags: ["家长", "高中"]
  },
  {
    id: 2,
    email: "li.na@example.com",
    name: "李娜",
    status: "active",
    subscribedAt: "2023-09-22T10:15:00Z",
    lastEmailedAt: "2023-11-12T09:45:00Z",
    source: "活动注册",
    tags: ["学生", "国际项目"]
  },
  {
    id: 3,
    email: "wang.fang@example.com",
    name: null,
    status: "unsubscribed",
    subscribedAt: "2023-08-05T16:40:00Z",
    lastEmailedAt: "2023-10-20T11:30:00Z",
    source: "网站表单",
    tags: ["教师"]
  },
  {
    id: 4,
    email: "chen.jie@example.com",
    name: "陈杰",
    status: "bounced",
    subscribedAt: "2023-07-18T09:20:00Z",
    lastEmailedAt: "2023-09-05T15:10:00Z",
    source: "手动添加",
    tags: ["家长", "小学"]
  },
  {
    id: 5,
    email: "zhao.min@example.com",
    name: "赵敏",
    status: "active",
    subscribedAt: "2023-11-01T13:25:00Z",
    lastEmailedAt: null,
    source: "网站弹窗",
    tags: ["学生", "留学"]
  }
];

const SubscriptionList = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subscriberToDelete, setSubscriberToDelete] = useState<number | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      searchQuery === "" || 
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subscriber.name && subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" ||
      subscriber.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddSubscriber = (email: string, name: string | null) => {
    const newSubscriber: Subscriber = {
      id: subscribers.length > 0 ? Math.max(...subscribers.map(s => s.id)) + 1 : 1,
      email: email,
      name: name,
      status: "active",
      subscribedAt: new Date().toISOString(),
      lastEmailedAt: null,
      source: "手动添加",
      tags: []
    };

    setSubscribers([...subscribers, newSubscriber]);

    toast({
      title: "添加成功",
      description: `已添加订阅者: ${email}`
    });
  };

  const handleStatusChange = (id: number, newStatus: "active" | "unsubscribed" | "bounced") => {
    setSubscribers(subscribers.map(subscriber => 
      subscriber.id === id 
        ? { ...subscriber, status: newStatus } 
        : subscriber
    ));

    const subscriber = subscribers.find(s => s.id === id);
    
    toast({
      title: "状态已更新",
      description: `${subscriber?.email} 的状态已更改为 ${
        newStatus === "active" ? "活跃" : 
        newStatus === "unsubscribed" ? "已退订" : "邮件退回"
      }`
    });
  };

  const handleDeleteSubscriber = (id: number) => {
    const subscriber = subscribers.find(s => s.id === id);
    setSubscribers(subscribers.filter(s => s.id !== id));
    
    toast({
      title: "删除成功",
      description: `已删除订阅者: ${subscriber?.email}`
    });
    
    setIsPasswordDialogOpen(false);
    setSubscriberToDelete(null);
  };

  const promptPasswordForDelete = (id: number) => {
    setSubscriberToDelete(id);
    setIsPasswordDialogOpen(true);
  };

  const confirmDelete = () => {
    if (subscriberToDelete !== null) {
      handleDeleteSubscriber(subscriberToDelete);
    }
  };

  const handleExportSubscribers = () => {
    toast({
      title: "导出成功",
      description: "订阅者列表已导出为CSV文件"
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const hasFilters = searchQuery !== "" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SubscriptionFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <div className="flex space-x-2">
          <AddSubscriberDialog 
            onAddSubscriber={handleAddSubscriber}
            existingEmails={subscribers.map(s => s.email)}
          />
          
          <Button variant="outline" onClick={handleExportSubscribers}>
            <DownloadCloud className="mr-2 h-4 w-4" />
            导出CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <SubscriptionStats subscribers={subscribers} />
        </CardHeader>
        <CardContent>
          {filteredSubscribers.length === 0 ? (
            <EmptySubscriberState
              hasFilters={hasFilters}
              onResetFilters={resetFilters}
            />
          ) : (
            <SubscriberTable
              subscribers={filteredSubscribers}
              onStatusChange={handleStatusChange}
              onDeleteSubscriber={promptPasswordForDelete}
            />
          )}
        </CardContent>
      </Card>

      <AdminPasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        onConfirm={confirmDelete}
        title="验证删除权限"
        description="删除订阅者需要超级管理员权限，请输入密码继续"
        confirmLabel="确认删除"
      />
    </div>
  );
};

export default SubscriptionList;
