
// 此文件包含与网站通用内容管理相关的服务

// 导出MenuItem接口，确保可以被其他模块导入使用
export interface MenuItem {
  id: number;
  title_en: string;
  title_zh: string;
  url: string;
  order: number;
  parent_id: number | null;
  is_visible: boolean;
}

// 菜单项接口
export interface QuickLink {
  id: number;
  text_en: string;
  text_zh: string;
  url: string;
  order: number;
}

export interface SocialMedia {
  id: number;
  name: string; // 例如：Facebook, Twitter等
  icon: string; // 图标名称，匹配lucide-react中的图标
  url: string; // 社交媒体链接
  platform: string; // 平台标识
  order: number; // 显示顺序
}

// 导出ContactInfo接口供ContactInfoManager使用
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours?: string;
  phone_en?: string;
  phone_zh?: string;
  address_en?: string;
  address_zh?: string;
  hours_en?: string;
  hours_zh?: string;
}

// 模拟API调用 - 获取导航菜单
export const getNavigationMenu = async (): Promise<MenuItem[]> => {
  // 这里将来会替换为真实的API调用
  return [
    {
      id: 1,
      title_en: "Home",
      title_zh: "首页",
      url: "/",
      order: 1,
      parent_id: null,
      is_visible: true
    },
    {
      id: 2,
      title_en: "About",
      title_zh: "关于我们",
      url: "/about",
      order: 2,
      parent_id: null,
      is_visible: true
    },
    {
      id: 3,
      title_en: "Programs",
      title_zh: "项目",
      url: "/programs",
      order: 3,
      parent_id: null,
      is_visible: true
    }
  ];
};

// 模拟API调用 - 保存导航菜单
export const saveNavigationMenu = async (menuItems: MenuItem[]): Promise<MenuItem[]> => {
  console.log("Saving navigation menu:", menuItems);
  return menuItems;
};

// 模拟API调用 - 获取快速链接
export const getQuickLinks = async (): Promise<QuickLink[]> => {
  // 这里将来会替换为真实的API调用
  return [
    {
      id: 1,
      text_en: "Privacy Policy",
      text_zh: "隐私政策",
      url: "/privacy",
      order: 1
    },
    {
      id: 2,
      text_en: "Terms of Service",
      text_zh: "服务条款",
      url: "/terms",
      order: 2
    },
    {
      id: 3,
      text_en: "Contact Us",
      text_zh: "联系我们",
      url: "/contact",
      order: 3
    }
  ];
};

// 模拟API调用 - 保存快速链接
export const saveQuickLinks = async (quickLinks: QuickLink[]): Promise<QuickLink[]> => {
  console.log("Saving quick links:", quickLinks);
  return quickLinks;
};

// 模拟API调用 - 获取社交媒体链接
export const getSocialMedia = async (): Promise<SocialMedia[]> => {
  // 这里将来会替换为真实的API调用
  return [
    {
      id: 1,
      name: "Facebook",
      icon: "facebook",
      url: "https://facebook.com/younikco",
      platform: "facebook",
      order: 1
    },
    {
      id: 2,
      name: "Twitter",
      icon: "twitter",
      url: "https://twitter.com/younikco",
      platform: "twitter",
      order: 2
    },
    {
      id: 3,
      name: "Instagram",
      icon: "instagram",
      url: "https://instagram.com/younikco",
      platform: "instagram",
      order: 3
    }
  ];
};

// 模拟API调用 - 保存社交媒体链接
export const saveSocialMedia = async (socialMedia: SocialMedia[]): Promise<SocialMedia[]> => {
  console.log("Saving social media:", socialMedia);
  return socialMedia;
};

// 模拟API调用 - 获取联系信息
export const getContactInfo = async (): Promise<ContactInfo> => {
  // 这里将来会替换为真实的API调用
  return {
    phone: "+1 123 456 7890",
    email: "contact@younikco.com",
    address: "123 Education Street, Learning City, 12345"
  };
};

// 模拟API调用 - 保存联系信息
export const saveContactInfo = async (contactInfo: ContactInfo): Promise<ContactInfo> => {
  console.log("Saving contact info:", contactInfo);
  return contactInfo;
};

// 模拟API调用 - 上传Logo
export const uploadLogo = async (file: File): Promise<{url: string}> => {
  console.log("Uploading logo:", file.name);
  // 这里将来会替换为真实的API调用和文件上传
  return { url: "/placeholder.svg" };
};
