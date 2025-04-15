
export interface AboutHero {
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  background_image: string;
}

/**
 * Strapi的AboutHero数据类型
 */
export interface StrapiAboutHero {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string | null;
}

export interface AboutMission {
  title_en: string;
  title_zh: string;
  content_en: string;
  content_zh: string;
  image: string;
}

export interface AboutValue {
  id: string;
  icon: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
}

export interface AboutContent {
  hero: AboutHero;
  mission: AboutMission;
  values: AboutValue[];
}
