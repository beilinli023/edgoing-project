import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "./Logo";

const FrontendNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentLanguage, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
  };

  // 硬编码导航菜单项，不依赖API
  const menuItems = [
    { name: currentLanguage === 'zh' ? '首页' : 'Home', path: '/' },
    { name: currentLanguage === 'zh' ? '游学项目' : 'Educational Travel Programs', path: '/programs' },
    { name: currentLanguage === 'zh' ? '留学' : 'Study Abroad', path: '/study-abroad' },
    { name: currentLanguage === 'zh' ? '关于EdGoing' : 'Meet EdGoing', path: '/about' },
    { name: currentLanguage === 'zh' ? '开始项目' : 'Let\'s Plan', path: '/start-planning' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto py-2">
        <div className="w-full max-w-[1240px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center flex-shrink-0">
            <Logo className="h-12 w-auto" logoType="navbar" />
          </Link>

          <div className="hidden md:flex items-center justify-between space-x-4 ml-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center text-center px-2 whitespace-nowrap"
                style={{ minWidth: "155px", height: "40px" }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 mr-4 w-[88px]"
            >
              <Globe className="h-5 w-5 flex-shrink-0" />
              <span className="ml-2 w-12 text-center">{currentLanguage === 'zh' ? 'EN' : 'CN'}</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 px-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default FrontendNavbar;
