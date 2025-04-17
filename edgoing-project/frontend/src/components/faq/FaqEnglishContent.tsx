
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SimpleRichTextEditor from "@/components/wysiwyg/SimpleRichTextEditor";

interface FaqEnglishContentProps {
  questionEn: string;
  answerEn: string;
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
}

const FaqEnglishContent = ({
  questionEn,
  answerEn,
  onQuestionChange,
  onAnswerChange
}: FaqEnglishContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>英文问题</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-en">Question Title</Label>
            <Input 
              id="question-en" 
              value={questionEn}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="Enter FAQ question..."
            />
          </div>
          <div>
            <Label htmlFor="answer-en">Answer Content</Label>
            <SimpleRichTextEditor 
              id="answer-en"
              content={answerEn}
              onChange={onAnswerChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaqEnglishContent;
