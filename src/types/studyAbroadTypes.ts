
// Study Abroad related type definitions

/**
 * 留学页面Hero数据类型
 */
export interface StudyAbroadHero {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string | null;
}

export interface StudyAbroadBenefit {
  icon: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
}

export interface PartnerUniversity {
  id: number;
  documentId?: string;
  name_en: string;
  name_zh: string;
  location_en: string;
  location_zh: string;
  programs_en: string;
  programs_zh: string;
  image: string;
}

export interface PartnerUniversityDetail extends PartnerUniversity {
  description_en: string;
  description_zh: string;
  featured_image?: string;
  gallery_images?: string[];
  highlights_en?: string;
  highlights_zh?: string;
  facilities_en?: string;
  facilities_zh?: string;
  academics_en?: string;
  academics_zh?: string;
  admission_en?: string;
  admission_zh?: string;
  ranking?: string;
  founded?: string;
  website?: string;
}

export interface StudyAbroadPageContent {
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  benefits: StudyAbroadBenefit[];
  universities: PartnerUniversity[];
  cta_title_en: string;
  cta_title_zh: string;
  cta_description_en: string;
  cta_description_zh: string;
  cta_button_text_en: string;
  cta_button_text_zh: string;
  cta_button_link: string;
}
