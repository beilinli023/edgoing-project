
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormPageSettings from "./FormPageSettings";
import FormOptionsManager from "./FormOptionsManager";

const FormSettingsManager = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>页面内容设置</CardTitle>
        </CardHeader>
        <CardContent>
          <FormPageSettings />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>表单选项管理</CardTitle>
        </CardHeader>
        <CardContent>
          <FormOptionsManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default FormSettingsManager;
