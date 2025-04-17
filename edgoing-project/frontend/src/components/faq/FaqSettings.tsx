
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FaqSettingsProps {
  order: number;
  status: string;
  isHot: boolean;
  onSettingsChange: (key: string, value: any) => void;
}

const FaqSettings = ({
  order,
  status,
  isHot,
  onSettingsChange
}: FaqSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ设置</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="order">排序权重</Label>
              <Input 
                id="order" 
                type="number" 
                min="1"
                value={order}
                onChange={(e) => onSettingsChange("order", parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground mt-1">数字越小排序越靠前</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">状态</Label>
              <Select 
                value={status}
                onValueChange={(value) => onSettingsChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="草稿">草稿</SelectItem>
                  <SelectItem value="已发布">已发布</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hot-question"
                className="h-4 w-4 rounded border-gray-300"
                checked={isHot}
                onChange={(e) => onSettingsChange("isHot", e.target.checked)}
              />
              <Label htmlFor="hot-question">设为热门问题</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaqSettings;
