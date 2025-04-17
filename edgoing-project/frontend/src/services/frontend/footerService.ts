import { ContactInfo, QuickLink, SocialLink, FooterData } from '@/types/footerTypes';

// 默认社交媒体链接
const defaultSocialLinks: SocialLink[] = [
  {
    id: 1,
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7305866085268889600',
    icon: 'linkedin'
  },
  {
    id: 2,
    name: 'Instagram',
    url: 'https://www.instagram.com/edgoing_global?igsh=MTQwb3M2NHl2YjFjMA%3D%3D&utm_source=qr',
    icon: 'instagram'
  },
  {
    id: 3,
    name: 'WeChat',
    url: 'https://mp.weixin.qq.com/s/5MthyqojmOut9rg8zoBH6Q',
    icon: 'wechat'
  },
  {
    id: 4,
    name: 'XiaoHongShu',
    url: 'https://www.xiaohongshu.com/user/profile/5d402d9b000000001203ce50?xsec_token=YB3thkt5dHkUpr6M0y2eZrTOxC0gq8U25n7T4_zQ6USk0=&xsec_source=app_share&xhsshare=CopyLink&appuid=5d402d9b000000001203ce50&apptime=1742017280&share_id=d68757aa651049e18d2402a31c575cfc',
    icon: 'xiaohongshu'
  }
];

// 默认联系信息
const defaultContactInfo: ContactInfo = {
  phone: '4001153558',
  email: 'Hello@edgoing.com',
  address: {
    en: 'Shanghai | Singapore\nShanghai: 18F, Tower B,\n838 South Huangpi Road\nHuangpu District, Shanghai, 200025.\nSingapore: 9 Kelantan Lane #06-01\nSingapore 208628',
    zh: '上海｜新加坡\n上海：上海市黄埔区黄陂南路838号\n中海国际B座18楼\n新加坡：9 Kelantan Lane #06-01\nSingapore 208628'
  },
  hours: '9:00 AM - 6:00 PM'
};

// 获取默认快速链接
const getDefaultQuickLinks = (language = 'en'): QuickLink[] => [
  {
    text_en: 'Educational Travel Programs',
    text_zh: '游学项目',
    url: '/programs'
  },
  {
    text_en: 'Study Abroad',
    text_zh: '留学',
    url: '/study-abroad'
  },
  {
    text_en: 'View Blog',
    text_zh: '浏览博客',
    url: '/blog'
  },
  {
    text_en: 'Meet EdGoing',
    text_zh: '关于EdGoing',
    url: '/about'
  },
  {
    text_en: 'FAQ',
    text_zh: '常见问题',
    url: '/learn-how'
  },
  {
    text_en: 'Let\'s Plan',
    text_zh: '开始项目',
    url: '/start-planning'
  }
];

/**
 * 从本地 JSON 文件加载社交媒体链接
 */
const loadSocialLinksFromFile = async (): Promise<SocialLink[]> => {
  try {
    const response = await fetch('/content/social-links.json');
    if (!response.ok) {
      console.error('加载社交媒体链接失败:', response.statusText);
      return defaultSocialLinks;
    }
    const data = await response.json();
    return data.data || defaultSocialLinks;
  } catch (error) {
    console.error('加载社交媒体链接出错:', error);
    return defaultSocialLinks;
  }
};

/**
 * 从本地 JSON 文件加载联系信息
 */
const loadContactInfoFromFile = async (language = 'en'): Promise<ContactInfo> => {
  try {
    const response = await fetch('/content/contact-info.json');
    if (!response.ok) {
      console.error('加载联系信息失败:', response.statusText);
      return defaultContactInfo;
    }
    const data = await response.json();
    return {
      phone: data.phone || defaultContactInfo.phone,
      email: data.email || defaultContactInfo.email,
      address: {
        en: data.address?.en || defaultContactInfo.address.en,
        zh: data.address?.zh || defaultContactInfo.address.zh
      },
      hours: data.hours || defaultContactInfo.hours
    };
  } catch (error) {
    console.error('加载联系信息出错:', error);
    return defaultContactInfo;
  }
};

/**
 * 从本地 JSON 文件加载快速链接
 */
const loadQuickLinksFromFile = async (language = 'en'): Promise<QuickLink[]> => {
  try {
    const response = await fetch('/content/quick-links.json');
    if (!response.ok) {
      console.error('加载快速链接失败:', response.statusText);
      return getDefaultQuickLinks(language);
    }
    const data = await response.json();
    // 确保数据结构正确，直接输出日志
    console.log('从本地文件加载的快速链接数据:', data);
    if (data && Array.isArray(data.data)) {
      return data.data.map((link: { text_en?: string; text_zh?: string; text?: string; url: string }) => ({
        text_en: link.text_en || link.text || '',
        text_zh: link.text_zh || link.text || '',
        url: link.url || '#'
      }));
    } else {
      console.error('快速链接数据结构不正确:', data);
      return getDefaultQuickLinks(language);
    }
  } catch (error) {
    console.error('加载快速链接出错:', error);
    return getDefaultQuickLinks(language);
  }
};

/**
 * 获取社交媒体链接，直接从本地文件加载
 */
export const fetchSocialLinks = async (): Promise<SocialLink[]> => {
  try {
    // 直接从本地文件加载，不再尝试 API 请求
    return await loadSocialLinksFromFile();
  } catch (error) {
    console.error('获取社交媒体链接出错:', error);
    return defaultSocialLinks;
  }
};

/**
 * 获取联系信息，直接从本地文件加载
 */
export const fetchContactInfo = async (language = 'en'): Promise<ContactInfo> => {
  try {
    // 直接从本地文件加载，不再尝试 API 请求
    return await loadContactInfoFromFile(language);
  } catch (error) {
    console.error('获取联系信息失败:', error);
    return defaultContactInfo;
  }
};

/**
 * 获取快速链接，直接从本地文件加载
 */
export const fetchQuickLinks = async (language = 'en'): Promise<QuickLink[]> => {
  try {
    // 直接从本地文件加载，不再尝试 API 请求
    return await loadQuickLinksFromFile(language);
  } catch (error) {
    console.error('获取快速链接失败:', error);
    return getDefaultQuickLinks(language);
  }
};

/**
 * 获取页脚所需的所有数据
 */
export const getFooterInfo = async (language = 'en'): Promise<FooterData> => {
  const [contactInfo, quickLinks, socialLinks] = await Promise.all([
    fetchContactInfo(language),
    fetchQuickLinks(language),
    fetchSocialLinks()
  ]);

  return {
    contactInfo,
    quickLinks,
    socialLinks
  };
};
