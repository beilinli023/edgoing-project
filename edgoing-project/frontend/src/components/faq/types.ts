
export interface FaqData {
  id?: string;
  questionZh: string;
  questionEn: string;
  answerZh: string;
  answerEn: string;
  order: number;
  status: string;
  isHot: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  status: string;
}
