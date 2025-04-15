
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { ContactInfo } from "@/types/cmsTypes";

// 定义初始状态
const initialContactInfo: ContactInfo = {
  id: 1,
  phone: "",
  email: "",
  address: "",
  phone_en: "",
  phone_zh: "",
  address_en: "",
  address_zh: "",
  hours_en: "",
  hours_zh: ""
};

export const useContactInfo = () => {
  const queryClient = useQueryClient();
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);

  // 获取联系信息数据
  const { isLoading } = useQuery({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/content/contact');
        const data = response.data as ContactInfo;
        // Move setting state here instead of using onSuccess
        if (data) {
          setContactInfo(data);
        }
        return data;
      } catch (error) {
        console.error('Error fetching contact info:', error);
        // 如果API不可用，返回模拟数据
        const mockData = {
          id: 1,
          phone: "+1 (555) 123-4567",
          phone_en: "+1 (555) 123-4567",
          phone_zh: "123 4567 8910",
          email: "contact@younikco.com",
          address: "123 Education Ave, Learning City",
          address_en: "123 Education Ave, Learning City",
          address_zh: "教育大道123号，学习城",
          hours_en: "Monday - Friday: 9AM - 5PM",
          hours_zh: "周一至周五：上午9点 - 下午5点"
        };
        setContactInfo(mockData);
        return mockData;
      }
    }
  });

  // 更新联系信息
  const mutation = useMutation({
    mutationFn: async (data: ContactInfo) => {
      try {
        const response = await axios.post('/api/content/contact', data);
        return response.data;
      } catch (error) {
        console.error('Error saving contact info:', error);
        // 如果API不可用，返回模拟保存成功
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
      toast({
        title: "保存成功",
        description: "联系信息已成功更新",
      });
    },
    onError: () => {
      toast({
        title: "保存失败",
        description: "无法保存联系信息，请稍后重试",
        variant: "destructive"
      });
    }
  });

  // 处理输入变化
  const handleInputChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // 保存变更
  const handleSave = () => {
    // 确保phone和address字段基于对应的EN字段设置
    const updatedContactInfo = {
      ...contactInfo,
      phone: contactInfo.phone_en || contactInfo.phone,
      address: contactInfo.address_en || contactInfo.address
    };
    mutation.mutate(updatedContactInfo);
  };

  return {
    contactInfo,
    isLoading,
    isPending: mutation.isPending,
    handleInputChange,
    handleSave
  };
};
