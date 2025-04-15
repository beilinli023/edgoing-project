import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Loader2, X } from "lucide-react";
import { useFrontendFooter } from "@/hooks/useFrontendFooter";
import { useLanguage } from "@/context/LanguageContext";
import { Logo } from "./Logo";

// 定义社交图标类型
interface SocialIcon {
  name: string;
  src: string;
  url?: string;
  qrCode?: boolean;
}

const FrontendFooter: React.FC = () => {
  const { quickLinks, contactInfo, isLoading } = useFrontendFooter();
  const { currentLanguage } = useLanguage();
  // 添加弹出框状态
  const [showQRModal, setShowQRModal] = useState(false);

  // 过滤掉不需要的链接
  const filteredQuickLinks = quickLinks.filter(link => link.url !== "/why-edgoing");

  // 静态图标数据
  const socialIcons: SocialIcon[] = [
    { name: "Icon 2", src: "/Edgoing/icon/2.png", url: "https://www.linkedin.com/feed/update/urn:li:activity:7305866085268889600" },
    { name: "Icon 3", src: "/Edgoing/icon/3.png", url: "https://www.instagram.com/edgoing_global?igsh=MTQwb3M2NHl2YjFjMA%3D%3D&utm_source=qr" },
    { name: "Icon 4", src: "/Edgoing/icon/4.png", qrCode: true },
    { name: "Icon 5", src: "/Edgoing/icon/5.png", qrCode: true }
  ];

  // 处理QR码图标点击
  const handleQRCodeClick = (e: React.MouseEvent, icon: SocialIcon) => {
    if (icon.qrCode) {
      e.preventDefault();
      setShowQRModal(true);
    }
  };

  // 关闭弹出框
  const closeModal = () => {
    setShowQRModal(false);
  };

  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-8 sm:px-12 md:px-10 lg:px-20 py-10">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-6 lg:gap-8">
              {/* 导航链接 */}
              <div className="flex flex-col items-start text-left pl-4 sm:pl-6 md:pl-0 md:w-1/4">
                <h3 className="text-xl md:text-2xl font-bold uppercase mb-4 tracking-wide text-gray-800">
                  {currentLanguage === 'zh' ? '导航' : 'NAVIGATION'}
                </h3>
                <ul className="space-y-2">
                  {filteredQuickLinks.map((link, index) => (
                    <li key={index}>
                      <Link to={link.url} className="text-base hover:text-blue-600 transition-colors">
                        {currentLanguage === 'zh'
                          ? (link.text_zh === "开始规划" ? "开始项目" : link.text_zh)
                          : (link.text_en === "Start Planning" ? "Let's Plan" : link.text_en)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 联系我们 */}
              <div className="flex flex-col items-start text-left pl-4 sm:pl-6 md:pl-0 mt-6 md:mt-0 md:w-1/3">
                <h3 className="text-xl md:text-2xl font-bold uppercase mb-4 tracking-wide text-gray-800">
                  {currentLanguage === 'zh' ? '联系我们' : 'CONTACT US'}
                </h3>
                <ul className="space-y-3">
                  <li className="flex flex-col md:flex-row items-start">
                    <span className="text-base font-medium mb-1 md:mb-0 md:mr-1">
                      {currentLanguage === 'zh' ? '联系电话: ' : 'Call Us: '}
                    </span>
                    <span className="text-base text-blue-600">{contactInfo.phone}</span>
                  </li>
                  <li className="flex flex-col md:flex-row items-start">
                    <span className="text-base font-medium mb-1 md:mb-0 md:mr-1">
                      {currentLanguage === 'zh' ? '邮箱: ' : 'Email: '}
                    </span>
                    <a href={`mailto:${contactInfo.email}`} className="text-base text-blue-600 hover:underline">
                      {contactInfo.email}
                    </a>
                  </li>
                  <li className="flex flex-col items-start">
                    <span className="text-base font-medium mb-1 md:mb-0">
                      {currentLanguage === 'zh' ? (
                        <>地址: <span className="font-normal">上海｜新加坡</span></>
                      ) : (
                        <>Address: <span className="font-normal">Shanghai | Singapore</span></>
                      )}
                    </span>
                    <span className="text-base text-left">
                      {currentLanguage === 'zh' ? (
                        <div className="flex flex-col items-start">
                          <span className="mt-1">上海：上海市黄埔区黄陂南路838号</span>
                          <span>中海国际B座18楼</span>
                          <span className="mt-1">新加坡：9 Kelantan Lane #06-01</span>
                          <span>Singapore 208628</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start">
                          <span className="mt-1">Shanghai: 18F, Tower B,</span>
                          <span>838 South Huangpi Road</span>
                          <span>Huangpu District, Shanghai, 200025.</span>
                          <span className="mt-1">Singapore: 9 Kelantan Lane #06-01</span>
                          <span>Singapore 208628</span>
                        </div>
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              {/* 关注我们 */}
              <div className="flex flex-col items-start text-left pl-4 sm:pl-6 md:pl-0 mt-6 md:mt-0 md:w-1/3">
                <h3 className="text-xl md:text-2xl font-bold uppercase mb-4 tracking-wide text-gray-800">
                  {currentLanguage === 'zh' ? '关注我们' : 'FOLLOW US'}
                </h3>
                <div className="w-full mb-4">
                  <p className="text-base mb-4">
                    {currentLanguage === 'zh'
                      ? '通过社交媒体关注我们，了解最新动态和教育资讯'
                      : 'Follow us on social media for updates and educational insights'}
                  </p>
                  <div className="flex items-start justify-start space-x-5 mb-6">
                    {socialIcons.map((icon, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 flex items-center justify-center"
                      >
                        {icon.qrCode ? (
                          <div
                            className="cursor-pointer"
                            onClick={(e) => handleQRCodeClick(e, icon)}
                          >
                            <img
                              src={icon.src}
                              alt={icon.name}
                              className="w-full h-full object-contain hover:opacity-80 transition-opacity"
                            />
                          </div>
                        ) : (
                          <a href={icon.url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={icon.src}
                              alt={icon.name}
                              className="w-full h-full object-contain hover:opacity-80 transition-opacity"
                            />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-start w-full">
                  <Logo logoType="footer" className="h-12 w-auto opacity-80" />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-6 text-center">
              <p className="text-sm text-gray-500 px-4">
                {new Date().getFullYear()} {currentLanguage === 'zh' ? '引里信息咨询（上海）有限公司 版权所有' : 'EdGoing. All rights reserved.'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* 二维码弹出框 */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {currentLanguage === 'zh' ? '扫码关注我们' : 'Scan to Follow Us'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-2 border border-gray-200">
                  {/* 微信二维码图片 */}
                  <img
                    src="/Edgoing/icon/Wechat.jpg"
                    alt="微信二维码"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-center text-sm font-medium text-gray-700 mt-2">
                  {currentLanguage === 'zh' ? '微信' : 'WeChat'}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-2 border border-gray-200">
                  {/* 小红书二维码图片 */}
                  <img
                    src="/Edgoing/icon/RedNote.jpg"
                    alt="小红书二维码"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-center text-sm font-medium text-gray-700 mt-2">
                  {currentLanguage === 'zh' ? '小红书' : 'RedNote'}
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              {currentLanguage === 'zh'
                ? '扫描二维码关注我们的官方账号，获取最新资讯'
                : 'Scan the QR codes to follow our official accounts for the latest updates'}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default FrontendFooter;
