// 本地页脚数据服务
// 在 API 不可用时提供备选数据源

export interface FooterInfo {
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  quickLinks: Array<{
    text: string;
    url: string;
  }>;
  socialLinks: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
}

export async function getLocalFooterInfo(): Promise<FooterInfo> {
  try {
    const response = await fetch('/content/footer-info.json');
    if (!response.ok) {
      throw new Error('Failed to load local footer data');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error loading local footer data:', error);
    // 提供一个基础的默认数据，确保页面始终能显示
    return {
      contactInfo: {
        phone: "4001153558",
        email: "Hello@edgoing.com",
        address: "18F, Tower B, China Overseas, 838 S. Huangpi Road, Huangpu, Shanghai",
        hours: ""
      },
      quickLinks: [
        { text: "首页", url: "/" }
      ],
      socialLinks: []
    };
  }
}
