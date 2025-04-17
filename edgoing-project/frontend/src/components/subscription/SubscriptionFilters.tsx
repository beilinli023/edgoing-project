
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriptionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const SubscriptionFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}: SubscriptionFiltersProps) => {
  return (
    <div className="flex flex-1 items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索邮箱或姓名..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="全部状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value="active">活跃</SelectItem>
          <SelectItem value="unsubscribed">已退订</SelectItem>
          <SelectItem value="bounced">邮件退回</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubscriptionFilters;
