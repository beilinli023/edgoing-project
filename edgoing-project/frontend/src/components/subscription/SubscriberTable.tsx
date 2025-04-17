
import { formatDate } from "@/utils/dateUtils";
import { Badge } from "@/components/ui/badge";
import SubscriberActions from "./SubscriberActions";
import { Subscriber } from "@/types/subscriberTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SubscriberTableProps {
  subscribers: Subscriber[];
  onStatusChange: (id: number, status: "active" | "unsubscribed" | "bounced") => void;
  onDeleteSubscriber: (id: number) => void;
}

const SubscriberTable = ({ 
  subscribers, 
  onStatusChange, 
  onDeleteSubscriber 
}: SubscriberTableProps) => {

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">活跃</Badge>;
      case "unsubscribed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">已退订</Badge>;
      case "bounced":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">邮件退回</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">邮箱地址</TableHead>
            <TableHead>姓名</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>订阅时间</TableHead>
            <TableHead>最近发送</TableHead>
            <TableHead>来源</TableHead>
            <TableHead>标签</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell className="font-medium">{subscriber.email}</TableCell>
              <TableCell>{subscriber.name || "—"}</TableCell>
              <TableCell>{renderStatusBadge(subscriber.status)}</TableCell>
              <TableCell>{formatDate(subscriber.subscribedAt)}</TableCell>
              <TableCell>{formatDate(subscriber.lastEmailedAt)}</TableCell>
              <TableCell>{subscriber.source}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {subscriber.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50">
                      {tag}
                    </Badge>
                  ))}
                  {subscriber.tags.length === 0 && "—"}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <SubscriberActions
                  subscriberId={subscriber.id}
                  currentStatus={subscriber.status}
                  onStatusChange={onStatusChange}
                  onDeleteSubscriber={onDeleteSubscriber}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscriberTable;
