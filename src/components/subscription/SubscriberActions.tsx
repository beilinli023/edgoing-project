
import { Button } from "@/components/ui/button";
import { CheckCircle2, UserX, XCircle } from "lucide-react";
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

interface SubscriberActionsProps {
  subscriberId: number;
  currentStatus: "active" | "unsubscribed" | "bounced";
  onStatusChange: (id: number, status: "active" | "unsubscribed" | "bounced") => void;
  onDeleteSubscriber: (id: number) => void;
}

const SubscriberActions = ({
  subscriberId,
  currentStatus,
  onStatusChange,
  onDeleteSubscriber
}: SubscriberActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      {currentStatus !== "active" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStatusChange(subscriberId, "active")}
          title="设为活跃"
        >
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </Button>
      )}
      {currentStatus !== "unsubscribed" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStatusChange(subscriberId, "unsubscribed")}
          title="设为已退订"
        >
          <UserX className="h-4 w-4 text-gray-500" />
        </Button>
      )}
      {currentStatus !== "bounced" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStatusChange(subscriberId, "bounced")}
          title="设为邮件退回"
        >
          <XCircle className="h-4 w-4 text-red-500" />
        </Button>
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除此订阅者吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDeleteSubscriber(subscriberId)}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriberActions;
