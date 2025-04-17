
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormIntroText, FormResponseTime } from "@/types/contactFormTypes";

interface FormIntroCardProps {
  introText: FormIntroText;
  responseTime: FormResponseTime;
  phoneNumber: string;
  setIntroText: React.Dispatch<React.SetStateAction<FormIntroText>>;
  setResponseTime: React.Dispatch<React.SetStateAction<FormResponseTime>>;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
}

const FormIntroCard: React.FC<FormIntroCardProps> = ({
  introText,
  responseTime,
  phoneNumber,
  setIntroText,
  setResponseTime,
  setPhoneNumber
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>联系表单介绍文本</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="intro-en">英文介绍文本</Label>
          <Input 
            id="intro-en"
            value={introText.en}
            onChange={(e) => setIntroText({...introText, en: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="intro-zh">中文介绍文本</Label>
          <Input 
            id="intro-zh"
            value={introText.zh}
            onChange={(e) => setIntroText({...introText, zh: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="response-en">英文响应时间承诺</Label>
          <Input 
            id="response-en"
            value={responseTime.en}
            onChange={(e) => setResponseTime({...responseTime, en: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="response-zh">中文响应时间承诺</Label>
          <Input 
            id="response-zh"
            value={responseTime.zh}
            onChange={(e) => setResponseTime({...responseTime, zh: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="phone">联系电话</Label>
          <Input 
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FormIntroCard;
