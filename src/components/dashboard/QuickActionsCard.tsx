
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type QuickActionProps = {
  label: string;
  icon: LucideIcon;
  path: string;
  onClick: (path: string) => void;
};

const QuickAction = ({ label, icon: Icon, path, onClick }: QuickActionProps) => {
  return (
    <Button 
      variant="outline" 
      className="justify-start hover:bg-blue-50" 
      onClick={() => onClick(path)}
    >
      <Icon className="mr-2 h-4 w-4 text-blue-500" />
      {label}
    </Button>
  );
};

type QuickActionsCardProps = {
  title: string;
  description: string;
  actions: QuickActionProps[];
};

const QuickActionsCard = ({ title, description, actions }: QuickActionsCardProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg pb-2">
        <CardTitle className="text-xl text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-2">
          {actions.map((action, index) => (
            <QuickAction 
              key={index} 
              label={action.label} 
              icon={action.icon} 
              path={action.path}
              onClick={action.onClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
