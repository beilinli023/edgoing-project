import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { useFrontendFooter } from "@/hooks/useFrontendFooter";
import { useLanguage } from "@/context/LanguageContext";
import { Logo } from "./Logo";

const FrontendFooter: React.FC = () => {
  const { quickLinks, contactInfo, socialLinks, isLoading } = useFrontendFooter();
  const { currentLanguage } = useLanguage();

  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:px-8 lg:px-16">
              {/* 快速链接 */}
              <div className="flex flex-col items-center md:items-start md:pl-4">
                <h3 className="text-2xl font-bold uppercase mb-6 tracking-wide text-gray-800">
                  {currentLanguage === 'zh' ? '快速链接' : 'QUICK LINKS'}
                </h3>
                <ul className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link to={link.url} className="text-base hover:text-blue-600 transition-colors">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 需要帮助? */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-2xl font-bold uppercase mb-6 tracking-wide text-gray-800">
                  {currentLanguage === 'zh' ? '联系我们' : 'CONTACT US'}
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-2 items-start">
                    <div>
                      <span className="text-base">
                        {currentLanguage === 'zh' ? '联系电话: ' : 'Call Us: '}
                      </span>
                      <span className="text-base text-blue-600">{contactInfo.phone}</span>
                    </div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <div>
                      <span className="text-base">
                        {currentLanguage === 'zh' ? '邮箱: ' : 'Email: '}
                      </span>
                      <a href={`mailto:${contactInfo.email}`} className="text-base text-blue-600 hover:underline">
                        {contactInfo.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <div>
                      <div className="text-base mb-1">
                        {currentLanguage === 'zh' ? '地址:' : 'Address:'}
                      </div>
                      <address className="not-italic text-base text-blue-600 leading-relaxed text-left">
                        {currentLanguage === 'zh' ? (
                          <>
                            <div>上海市黄埔区黄陂南路838号</div>
                            <div>中海国际B座18楼</div>
                          </>
                        ) : (
                          <>
                            <div>18F, Tower B, China Overseas,</div>
                            <div>838 S. Huangpi Road, Huangpu, Shanghai</div>
                          </>
                        )}
                      </address>
                    </div>
                  </li>
                </ul>
              </div>

              {/* 联系我们 */}
              <div className="flex flex-col items-center md:pr-4">
                <h3 className="text-2xl font-bold uppercase mb-6 tracking-wide text-gray-800">
                  {currentLanguage === 'zh' ? '关注我们' : 'FOLLOW US'}
                </h3>

                <div className="flex flex-col items-center">
                  <div className="flex justify-center mb-4">
                    <Logo className="h-14 w-auto" />
                  </div>
                  
                  <div className="flex justify-center space-x-4 mt-2">
                    <a href="https://www.facebook.com/edgoing" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                      <img src="/Edgoing/icon/2.png" alt="Facebook" width="24" height="24" />
                    </a>
                    <a href="https://www.linkedin.com/company/edgoing" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                      <img src="/Edgoing/icon/3.png" alt="LinkedIn" width="24" height="24" />
                    </a>
                    <a href="https://www.instagram.com/edgoing.official" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                      <img src="/Edgoing/icon/4.png" alt="Instagram" width="24" height="24" />
                    </a>
                    <a href="https://www.youtube.com/channel/edgoing" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                      <img src="/Edgoing/icon/5.png" alt="YouTube" width="24" height="24" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm">
              <p> 2025 引里信息咨询（上海）有限公司 保留所有权</p>
            </div>
          </>
        )}
      </div>
    </footer>
  );
};

export default FrontendFooter;
