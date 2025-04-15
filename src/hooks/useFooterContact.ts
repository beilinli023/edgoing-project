
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// 定义接口
export interface FooterContactInfo {
  phone: string;
  email: string;
  address: string;
}

// 模拟API调用
const fetchFooterContact = async (): Promise<FooterContactInfo> => {
  // 这里将来会替换为真实的API调用
  return {
    phone: "+1 (555) 123-4567",
    email: "contact@younikco.com",
    address: "123 Education Ave, Learning City"
  };
};

const saveFooterContact = async (contactInfo: FooterContactInfo): Promise<FooterContactInfo> => {
  // 这里将来会替换为真实的API调用
  console.log("Saving contact info:", contactInfo);
  return contactInfo;
};

export const useFooterContact = () => {
  const queryClient = useQueryClient();
  const [contactInfo, setContactInfo] = useState<FooterContactInfo>({
    phone: "",
    email: "",
    address: ""
  });

  // 获取页脚联系信息
  const { isLoading } = useQuery({
    queryKey: ['footerContact'],
    queryFn: fetchFooterContact,
    meta: {
      onSuccess: (data: FooterContactInfo) => {
        if (data) {
          setContactInfo(data);
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5分钟缓存
  });

  // 保存页脚联系信息
  const mutation = useMutation({
    mutationFn: saveFooterContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footerContact'] });
      toast({
        title: "保存成功",
        description: "页脚联系信息已更新",
      });
    },
    onError: (error) => {
      console.error("Error saving footer contact:", error);
      toast({
        title: "保存失败",
        description: "无法保存页脚联系信息，请稍后重试",
        variant: "destructive"
      });
    }
  });

  const saveContact = () => {
    mutation.mutate(contactInfo);
  };
  
  // 为了兼容FooterManager中的用法，添加saveContactInfoChanges别名和isPending属性
  const saveContactInfoChanges = saveContact;
  const isPending = mutation.isPending;

  return {
    contactInfo,
    setContactInfo,
    saveContact,
    saveContactInfoChanges,
    isLoading,
    isSubmitting: mutation.isPending,
    isPending
  };
};
