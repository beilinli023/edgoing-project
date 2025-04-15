
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Subscriber } from "@/types/subscriberTypes";

interface SubscriptionStatsProps {
  subscribers: Subscriber[];
}

const SubscriptionStats = ({ subscribers }: SubscriptionStatsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-xl flex items-center">
        <Users className="mr-2 h-5 w-5 text-primary" />
        订阅者列表
      </div>
      <div className="flex items-center text-sm text-muted-foreground gap-4">
        <div className="flex items-center">
          <Badge variant="outline" className="mr-1 bg-green-50">
            {subscribers.filter(s => s.status === "active").length}
          </Badge>
          <span>活跃</span>
        </div>
        <div className="flex items-center">
          <Badge variant="outline" className="mr-1 bg-gray-50">
            {subscribers.filter(s => s.status === "unsubscribed").length}
          </Badge>
          <span>已退订</span>
        </div>
        <div className="flex items-center">
          <Badge variant="outline" className="mr-1 bg-red-50">
            {subscribers.filter(s => s.status === "bounced").length}
          </Badge>
          <span>退回</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStats;
