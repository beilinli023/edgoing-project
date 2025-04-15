
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LucideIcon } from "lucide-react";

type StatsItemProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  badgeColor?: string;
};

const StatsItem = ({ label, value, icon: Icon, iconColor = "", badgeColor = "bg-blue-100 text-blue-700" }: StatsItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        {label}
      </span>
      <span className={`font-medium ${badgeColor} px-2 py-0.5 rounded-full text-sm`}>{value}</span>
    </div>
  );
};

type StatsCardProps = {
  title: string;
  description: string;
  items: StatsItemProps[];
  isLoading?: boolean;
};

const StatsCard = ({ title, description, items, isLoading = false }: StatsCardProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg pb-2">
        <CardTitle className="text-xl text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <StatsItem 
                key={index} 
                label={item.label} 
                value={item.value} 
                icon={item.icon}
                iconColor={item.iconColor}
                badgeColor={item.badgeColor}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
