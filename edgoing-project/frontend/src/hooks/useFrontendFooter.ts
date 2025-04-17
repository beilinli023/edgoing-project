import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getFooterInfo } from "@/services/frontend/footerService";

export const useFrontendFooter = () => {
  const { currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);  // 默认为 false，避免初始加载状态
  const [contactInfo, setContactInfo] = useState({
    phone: "4001153558",
    email: "Hello@edgoing.com",
    address: {
      en: "Shanghai | Singapore\nShanghai: 18F, Tower B,\n838 South Huangpi Road\nHuangpu District, Shanghai, 200025.\nSingapore: 9 Kelantan Lane #06-01\nSingapore 208628",
      zh: "上海｜新加坡\n上海：上海市黄埔区黄陂南路838号\n中海国际B座18楼\n新加坡：9 Kelantan Lane #06-01\nSingapore 208628"
    },
    hours: ""
  });
  const [quickLinks, setQuickLinks] = useState<{ text_en: string; text_zh: string; url: string }[]>([
    { text_en: "Educational Travel Programs", text_zh: "游学项目", url: "/programs" },
    { text_en: "Study Abroad", text_zh: "留学", url: "/study-abroad" },
    { text_en: "View Blog", text_zh: "浏览博客", url: "/blog" },
    { text_en: "Meet EdGoing", text_zh: "关于EdGoing", url: "/about" },
    { text_en: "FAQ", text_zh: "常见问题", url: "/learn-how" },
    { text_en: "Let's Plan", text_zh: "开始项目", url: "/start-planning" }
  ]);
  const [socialLinks, setSocialLinks] = useState([
    { name: "LinkedIn", url: "https://www.linkedin.com/feed/update/urn:li:activity:7305866085268889600", icon: "linkedin" },
    { name: "Instagram", url: "https://www.instagram.com/edgoing_global?igsh=MTQwb3M2NHl2YjFjMA%3D%3D&utm_source=qr", icon: "instagram" },
    { name: "WeChat", url: "https://mp.weixin.qq.com/s/5MthyqojmOut9rg8zoBH6Q", icon: "wechat" },
    { name: "XiaoHongShu", url: "https://www.xiaohongshu.com/user/profile/5d402d9b000000001203ce50?xsec_token=YB3thkt5dHkUpr6M0y2eZrTOxC0gq8U25n7T4_zQ6USk0=&xsec_source=app_share&xhsshare=CopyLink&appuid=5d402d9b000000001203ce50&apptime=1742017280&share_id=d68757aa651049e18d2402a31c575cfc", icon: "xiaohongshu" }
  ]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterInfo = async () => {
      try {
        const { contactInfo: newContactInfo, quickLinks: newQuickLinks, socialLinks: newSocialLinks } = await getFooterInfo(currentLanguage);

        if (newContactInfo) {
          setContactInfo(newContactInfo);
        }

        if (newQuickLinks?.length > 0) {
          setQuickLinks(newQuickLinks);
        }

        if (newSocialLinks?.length > 0) {
          setSocialLinks(newSocialLinks);
        }
      } catch (error) {
        console.error("Error fetching footer info:", error);
        setError(error);
      }
    };

    fetchFooterInfo();
  }, [currentLanguage]);

  return {
    contactInfo,
    quickLinks,
    socialLinks,
    isLoading,
    error
  };
};
