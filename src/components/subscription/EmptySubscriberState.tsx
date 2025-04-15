
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";

interface EmptySubscriberStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

const EmptySubscriberState = ({ hasFilters, onResetFilters }: EmptySubscriberStateProps) => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Mail className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium">没有找到订阅者</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {hasFilters
          ? "请尝试调整搜索条件"
          : "点击\"添加订阅者\"按钮添加第一个订阅者"}
      </p>
      {hasFilters && (
        <Button variant="outline" className="mt-4" onClick={onResetFilters}>
          <RefreshCw className="mr-2 h-4 w-4" />
          重置筛选
        </Button>
      )}
    </div>
  );
};

export default EmptySubscriberState;
