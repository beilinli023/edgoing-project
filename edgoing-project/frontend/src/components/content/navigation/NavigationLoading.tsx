
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const NavigationLoading: React.FC = () => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>导航菜单管理</CardTitle>
        <CardDescription>正在加载数据...</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};

export default NavigationLoading;
