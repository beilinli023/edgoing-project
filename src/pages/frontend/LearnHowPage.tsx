import React, { useState } from "react";
import { Search, ChevronDown, AlertCircle } from "lucide-react";
import FrontendLayout from "@/components/frontend/FrontendLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLearnHow } from "@/hooks/useLearnHow";
import { Skeleton } from "@/components/ui/skeleton";

const LearnHowPage = () => {
  const {
    loading,
    error,
    content,
    filteredFaqs,
    searchQuery,
    setSearchQuery,
    hasResults,
    currentLanguage
  } = useLearnHow();

  // 显示加载状态
  if (loading) {
    return (
      <FrontendLayout>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-80 bg-gray-200 rounded-md"></div>
            <div className="h-12 w-3/4 mx-auto bg-gray-200 rounded-md"></div>
            <div className="h-10 bg-gray-200 rounded-md"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-16 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </FrontendLayout>
    );
  }

  // 显示错误
  if (error) {
    return (
      <FrontendLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-lg mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-medium">无法加载内容</h2>
            </div>
            <p className="mt-2">很抱歉，我们无法加载页面内容。请稍后再试或联系我们的支持团队。</p>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              刷新页面
            </Button>
          </div>

          {/* 备用内容 */}
          <div className="mt-12 text-center">
            <h1 className="text-3xl font-bold mb-6">了解更多有关我们的教育项目</h1>
            <p className="max-w-2xl mx-auto text-gray-600">
              虽然我们无法加载所有内容，但您仍然可以联系我们了解有关我们项目的更多信息
            </p>
            <Button
              className="mt-6 bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = "/start-planning"}>
              立即联系我们
            </Button>
          </div>
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      {/* Hero Section */}
      <div
        className="relative pt-32 pb-24 text-white"
        style={{
          backgroundImage: "url('/Edgoing/Page Picture/FAQ.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container-fluid w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">{content?.hero?.title || "了解更多"}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 text-center">{content?.hero?.subtitle || "获取有关我们国际教育项目、活动和服务的常见问题解答"}</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder={currentLanguage === 'zh' ? "搜索常见问题..." : "Search FAQs..."}
              className="pl-10 py-6 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs && filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-md overflow-hidden">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline data-[state=open]:bg-blue-50">
                    <span className="text-left font-normal">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {searchQuery ?
                (currentLanguage === 'zh' ? "未找到匹配结果。请尝试使用其他搜索词。" : "No results found. Please try different search terms.") :
                (currentLanguage === 'zh' ? "暂无常见问题。" : "No FAQs available.")}
            </div>
          )}

          {!hasResults && searchQuery && (
            <div className="text-center py-10 text-gray-500">
              {currentLanguage === 'zh' ? "未找到匹配结果。请尝试使用其他搜索词。" : "No results found. Please try different search terms."}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {content?.contactSection?.title || (currentLanguage === 'zh' ? "还有疑问？" : "Still Have Questions?")}
          </h2>
          <p className="mb-8 text-gray-700">
            {content?.contactSection?.description ||
              (currentLanguage === 'zh'
                ? "如果您没有找到问题的答案，请随时直接联系我们。我们的顾问将帮助您解答任何疑问。"
                : "If you couldn't find the answer to your question, don't hesitate to reach out to us directly. Our advisors are here to help you with any inquiries you may have.")}
          </p>
          <Button
            className="bg-[#a4be55] hover:bg-[#94ae45] text-white font-medium rounded-md px-8 py-5"
            onClick={() => window.location.href = content?.contactSection?.buttonUrl || "/contact"}
          >
            {content?.contactSection?.buttonText || (currentLanguage === 'zh' ? "咨询顾问" : "Ask An Advisor")}
          </Button>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default LearnHowPage;
