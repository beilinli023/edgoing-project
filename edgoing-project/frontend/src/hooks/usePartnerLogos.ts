import { useState, useEffect } from 'react';
import axios from 'axios';

interface PartnerLogo {
  id: number;
  name: string;
  image_url: string;
  website_url?: string;
  description?: string;
}

/**
 * 自定义Hook，用于获取合作伙伴Logo数据
 *
 * 该Hook从Strapi后端获取合作伙伴Logo数据，支持根据当前语言获取相应的数据。
 *
 * @param {string} language - 当前语言，'en'或'zh'
 * @returns {Object} 包含logos数组、加载状态和错误信息的对象
 */
export const usePartnerLogos = (language: string = 'en') => {
  const [logos, setLogos] = useState<PartnerLogo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLogos = async () => {
      setIsLoading(true);
      try {
        // 从API获取合作伙伴Logo数据
        console.log(`请求合作伙伴Logo数据: /api/partner-logos?language=${language}`);
        const response = await axios.get(`/api/partner-logos?language=${language}`);

        console.log('获取到的合作伙伴Logo数据:', response.data);

        if (response.data && Array.isArray(response.data)) {
          console.log(`数组格式数据, 长度: ${response.data.length}`);
          setLogos(response.data);
        } else if (response.data && response.data.data) {
          console.log(`对象格式数据, 长度: ${response.data.data.length}`);
          setLogos(response.data.data);
        } else {
          console.log('没有有效数据，设置为空数组');
          setLogos([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching partner logos:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch partner logos'));
        // 在生产环境中，如果API调用失败，使用空数组而不是显示错误
        setLogos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogos();
  }, [language]);

  return { logos, isLoading, error };
};
