// 本地社交链接数据服务
// 在 API 不可用时提供备选数据源

export interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string;
}

export async function getLocalSocialLinks(): Promise<SocialLink[]> {
  try {
    const response = await fetch('/content/social-links.json');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error loading local social links:', error);
    return [];
  }
}
