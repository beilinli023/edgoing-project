import React from "react";
import FrontendLayout from "@/components/frontend/FrontendLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicyPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  
  const title = currentLanguage === 'en' ? 'Privacy Policy' : '隐私政策';
  const lastUpdated = new Date().toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <FrontendLayout>
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            {title}
          </h1>
          <p className="text-gray-600 text-center">
            {currentLanguage === 'en' ? 'Effective Date: ' : '生效日期：'}{lastUpdated}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          {currentLanguage === 'en' ? (
            <>
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                <p className="mb-4">
                  At Edgoing, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you engage with our educational travel services, including our website, mobile applications, and any related services. By using our services, you agree to the terms of this Privacy Policy.
                </p>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">We may collect personal information from you when you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Register for an account</li>
                  <li>Book a trip or educational program</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Fill out forms on our website</li>
                  <li>Contact our customer service team</li>
                </ul>
                <p className="mt-4 mb-2">The types of personal information we may collect include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address.</li>
                  <li><strong>Payment Information:</strong> Credit card details and other payment-related information.</li>
                  <li><strong>Demographic Information:</strong> Age, gender, and travel preferences.</li>
                  <li><strong>Travel Information:</strong> Details about your travel itinerary, preferences, and any special requirements.</li>
                  <li><strong>Feedback and Communication:</strong> Information you provide when you contact us or participate in surveys.</li>
                </ul>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="mb-4">Edgoing uses your information for various purposes, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To process and manage your bookings and payments.</li>
                  <li>To communicate with you regarding your travel arrangements and provide customer support.</li>
                  <li>To send you promotional materials, newsletters, and updates about our services.</li>
                  <li>To improve our website, services, and customer experience.</li>
                  <li>To comply with legal obligations and protect our rights.</li>
                </ul>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Sharing Your Information</h2>
                <p className="mb-4">We do not sell or trade your personal information. However, we may share your information in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, and delivering services.</li>
                  <li><strong>Legal Compliance:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                </ul>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p className="mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
                </p>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you.</li>
                  <li>Request correction of any inaccuracies in your personal information.</li>
                  <li>Request deletion of your personal information, subject to certain exceptions.</li>
                  <li>Opt-out of receiving marketing communications from us.</li>
                </ul>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
                <p className="mb-4">
                  Our website uses cookies and similar technologies to enhance your experience. Cookies are small text files stored on your device that help us understand how you use our website. You can manage your cookie preferences through your browser settings.
                </p>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
                <p className="mb-4">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
                <p className="mb-4">
                  Edgoing reserves the right to update this Privacy Policy at any time. We will notify you of any changes by posting the new Privacy Policy on our website with a new effective date. We encourage you to review this Privacy Policy periodically for any updates.
                </p>
              </section>

              <Separator className="my-6" />

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="mb-4">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us.
                </p>
                <p className="mt-4">
                  Thank you for choosing Edgoing for your educational travel experiences. Your privacy is important to us, and we are committed to protecting your personal information.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">引言</h2>
                <p className="mb-4">
                  在Edgoing，我们致力于保护您的隐私，并确保您的个人信息得到安全、负责任的处理。本隐私政策概述了当您使用我们的教育旅行服务（包括我们的网站、移动应用程序及相关服务）时，我们如何收集、使用、披露和保护您的信息。通过使用我们的服务，您同意本隐私政策的条款。
                </p>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">我们收集的信息</h2>
                <p className="mb-4">我们可能会在以下情况下收集您的个人信息：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>注册账户</li>
                  <li>预订旅行或教育项目</li>
                  <li>订阅我们的新闻通讯</li>
                  <li>填写网站上的表格</li>
                  <li>联系我们的客服团队</li>
                </ul>
                <p className="mt-4 mb-2">我们可能收集的个人信息类型包括：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>联系信息：</strong>姓名、电子邮件地址、电话号码和邮寄地址。</li>
                  <li><strong>支付信息：</strong>信用卡信息及其他支付相关信息。</li>
                  <li><strong>人口统计信息：</strong>年龄、性别和旅行偏好。</li>
                  <li><strong>旅行信息：</strong>旅行行程、偏好及特殊要求的详细信息。</li>
                  <li><strong>反馈与沟通：</strong>您联系我们或参与调查时提供的信息。</li>
                </ul>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">我们如何使用您的信息</h2>
                <p className="mb-4">Edgoing将您的信息用于以下目的：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>处理和安排您的预订及付款。</li>
                  <li>就您的旅行安排与您沟通并提供客户支持。</li>
                  <li>向您发送促销材料、新闻通讯及服务更新。</li>
                  <li>改进我们的网站、服务及客户体验。</li>
                  <li>遵守法律义务并保护我们的权利。</li>
                </ul>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">分享您的信息</h2>
                <p className="mb-4">我们不会出售或交易您的个人信息。但在以下情况下，我们可能会共享您的信息：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>服务提供商：</strong>我们可能会与可信赖的第三方服务提供商共享您的信息，以协助我们运营网站、处理付款和提供服务。</li>
                  <li><strong>法律合规：</strong>如果法律要求或响应公共机构的有效请求，我们可能会披露您的信息。</li>
                  <li><strong>业务转让：</strong>在合并、收购或出售全部或部分资产的情况下，您的信息可能会作为交易的一部分被转移。</li>
                </ul>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">数据安全</h2>
                <p className="mb-4">
                  我们采取适当的技术和组织措施，保护您的个人信息免受未经授权的访问、丢失或滥用。然而，互联网传输或电子存储方法并非100%安全。尽管我们努力保护您的信息，但我们无法保证其绝对安全。
                </p>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">您的权利</h2>
                <p className="mb-4">您有权：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>访问我们持有的您的个人信息。</li>
                  <li>要求更正您个人信息中的任何不准确之处。</li>
                  <li>要求删除您的个人信息（受某些例外情况限制）。</li>
                  <li>选择退出接收我们的营销通讯。</li>
                </ul>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Cookie和跟踪技术</h2>
                <p className="mb-4">
                  我们的网站使用Cookie和类似技术来增强您的体验。Cookie是存储在您设备上的小型文本文件，可帮助我们了解您如何使用我们的网站。您可以通过浏览器设置管理您的Cookie偏好。
                </p>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">第三方链接</h2>
                <p className="mb-4">
                  我们的网站可能包含指向第三方网站的链接。我们对这些网站的隐私实践或内容不承担责任。我们建议您访问任何第三方网站时，查看其隐私政策。
                </p>
              </section>

              <Separator className="my-6" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">隐私政策的变更</h2>
                <p className="mb-4">
                  Edgoing保留随时更新本隐私政策的权利。我们将在网站上发布新的隐私政策并更新生效日期，以通知您任何变更。我们建议您定期查看本隐私政策以了解更新内容。
                </p>
              </section>

              <Separator className="my-6" />

              <section>
                <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
                <p className="mb-4">
                  如果您对本隐私政策或我们的数据实践有任何疑问或疑虑，请联系我们。
                </p>
                <p className="mt-4">
                  感谢您选择Edgoing作为您的教育旅行伙伴。您的隐私对我们至关重要，我们致力于保护您的个人信息。
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
};

export default PrivacyPolicyPage;
