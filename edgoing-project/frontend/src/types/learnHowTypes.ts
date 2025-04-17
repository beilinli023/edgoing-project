
export interface LearnHowHero {
  id?: number;
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  background_image: string;
}

export interface LearnHowContactSection {
  id?: number;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  button_text_en: string;
  button_text_zh: string;
  button_url: string;
}

export interface LearnHowPage {
  hero: LearnHowHero;
  contact_section: LearnHowContactSection;
}

export interface FaqItemWithCategory {
  id: number;
  question_en: string;
  question_zh: string;
  answer_en: string;
  answer_zh: string;
  category_id: number;
  category_name_en?: string;
  category_name_zh?: string;
  order: number;
  is_featured: boolean;
}
