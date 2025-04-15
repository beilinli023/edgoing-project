
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuickLinks } from '@/hooks/useQuickLinks';
import { useSocialMedia } from '@/hooks/useSocialMedia';
import { useFooterContact } from '@/hooks/useFooterContact';
import QuickLinksList from './footer/QuickLinksList';
import QuickLinkForm from './footer/QuickLinkForm';
import SocialMediaForm from './footer/SocialMediaForm';
import SocialMediaList from './footer/SocialMediaList';
import FooterContactForm from './footer/FooterContactForm';
import FooterLogoUploaderWithHook from './footer/FooterLogoUploader';
import FooterLoading from './footer/FooterLoading';

const FooterManager = () => {
  const [activeTab, setActiveTab] = useState('quick-links');
  
  // 快速链接钩子
  const { 
    quickLinks,
    newQuickLink,
    setNewQuickLink,
    addQuickLink,
    removeQuickLink,
    isLoading: isLoadingQuickLinks,
    isPending: isSavingQuickLinks
  } = useQuickLinks();
  
  // 社交媒体钩子
  const {
    socialMedia,
    newSocialMedia,
    setNewSocialMedia,
    addSocialMedia,
    removeSocialMedia,
    isLoading: isLoadingSocialMedia,
    isPending: isSavingSocialMedia
  } = useSocialMedia();
  
  // 页脚联系信息钩子
  const {
    contactInfo,
    setContactInfo,
    isLoading: isLoadingContact,
    isPending: isSavingContact,
    saveContactInfoChanges
  } = useFooterContact();
  
  // 判断是否正在加载任何数据
  const isLoading = isLoadingQuickLinks || isLoadingSocialMedia || isLoadingContact;
  
  // 如果正在加载，则显示加载中状态
  if (isLoading) {
    return <FooterLoading />;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>页脚信息管理</CardTitle>
        <CardDescription>管理网站页脚的快速链接、社交媒体链接和联系信息</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="quick-links">快速链接</TabsTrigger>
            <TabsTrigger value="social-media">社交媒体</TabsTrigger>
            <TabsTrigger value="contact-info">联系信息</TabsTrigger>
            <TabsTrigger value="footer-logo">页脚Logo</TabsTrigger>
          </TabsList>
          
          {/* 快速链接管理 */}
          <TabsContent value="quick-links">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>添加快速链接</CardTitle>
                  <CardDescription>
                    添加在页脚显示的快速导航链接
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuickLinkForm
                    newLink={newQuickLink}
                    setNewLink={setNewQuickLink}
                    addQuickLink={addQuickLink}
                    isPending={isSavingQuickLinks}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>当前快速链接</CardTitle>
                  <CardDescription>
                    管理和排序页脚中显示的快速链接
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuickLinksList
                    quickLinks={quickLinks}
                    removeQuickLink={removeQuickLink}
                    isPending={isSavingQuickLinks}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* 社交媒体管理 */}
          <TabsContent value="social-media">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>添加社交媒体链接</CardTitle>
                  <CardDescription>
                    添加在页脚显示的社交媒体链接
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SocialMediaForm
                    newSocialMedia={newSocialMedia}
                    setNewSocialMedia={setNewSocialMedia}
                    addSocialMedia={addSocialMedia}
                    isPending={isSavingSocialMedia}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>当前社交媒体链接</CardTitle>
                  <CardDescription>
                    管理和排序页脚中显示的社交媒体链接
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SocialMediaList
                    socialMedia={socialMedia}
                    removeSocialMedia={removeSocialMedia}
                    isPending={isSavingSocialMedia}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* 联系信息管理 */}
          <TabsContent value="contact-info">
            <Card>
              <CardHeader>
                <CardTitle>页脚联系信息</CardTitle>
                <CardDescription>
                  更新显示在页脚的联系信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FooterContactForm
                  contactInfo={contactInfo}
                  setContactInfo={setContactInfo}
                  onSubmit={saveContactInfoChanges}
                  isSubmitting={isSavingContact}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 页脚Logo管理 */}
          <TabsContent value="footer-logo">
            <Card>
              <CardHeader>
                <CardTitle>页脚Logo</CardTitle>
                <CardDescription>
                  上传和更新页脚Logo图片
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FooterLogoUploaderWithHook />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FooterManager;
