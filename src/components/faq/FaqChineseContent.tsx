
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SimpleRichTextEditor from "@/components/wysiwyg/SimpleRichTextEditor";

interface FaqChineseContentProps {
  questionZh: string;
  answerZh: string;
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
}

const FaqChineseContent = ({
  questionZh,
  answerZh,
  onQuestionChange,
  onAnswerChange
}: FaqChineseContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>中文问题</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-zh">问题标题</Label>
            <Input 
              id="question-zh" 
              value={questionZh}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="输入FAQ问题..."
            />
          </div>
          <div>
            <Label htmlFor="answer-zh">回答内容</Label>
            <SimpleRichTextEditor 
              id="answer-zh"
              content={answerZh}
              onChange={onAnswerChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaqChineseContent;
