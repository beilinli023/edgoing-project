/**
 * 社交媒体链接类型
 */
export interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string;
}

/**
 * 联系信息类型
 */
export interface ContactInfo {
  phone: string;
  email: string;
  address: {
    en: string;
    zh: string;
  };
  hours: string;
}

/**
 * 快速链接类型
 */
export interface QuickLink {
  text_en: string;
  text_zh: string;
  url: string;
}

/**
 * 页脚数据类型
 */
export interface FooterData {
  contactInfo: ContactInfo;
  quickLinks: QuickLink[];
  socialLinks: SocialLink[];
}
