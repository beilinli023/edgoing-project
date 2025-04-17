
import React from "react";
import FrontendNavbar from "./FrontendNavbar";
import FrontendFooter from "./FrontendFooter";

interface FrontendLayoutProps {
  children: React.ReactNode;
}

const FrontendLayout: React.FC<FrontendLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FrontendNavbar />
      <main className="flex-1">{children}</main>
      <FrontendFooter />
    </div>
  );
};

export default FrontendLayout;
