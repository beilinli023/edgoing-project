import React from "react";
import {
  Globe,
  BookOpen,
  UserPlus,
  Shield,
  CheckCircle,
  User,
  Globe2
} from "lucide-react";
import FrontendLayout from "../../components/frontend/FrontendLayout";
import { useFrontendAbout } from "@/hooks/useFrontendAbout";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import AboutHero from "@/components/frontend/about/AboutHero";

// 创建一个图标映射以根据名称渲染正确的图标
const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="h-8 w-8 text-blue-500" />,
  Globe2: <Globe2 className="h-8 w-8 text-blue-500" />,
  BookOpen: <BookOpen className="h-8 w-8 text-blue-500" />,
  UserPlus: <UserPlus className="h-8 w-8 text-blue-500" />,
  Shield: <Shield className="h-8 w-8 text-blue-500" />,
  CheckCircle: <CheckCircle className="h-8 w-8 text-blue-500" />,
  User: <User className="h-8 w-8 text-blue-500" />
};

const AboutPage: React.FC = () => {
  const { content, isLoading, error, getLocalizedText } = useFrontendAbout();

  // 处理错误
  React.useEffect(() => {
    if (error) {
      console.error("Error loading about page content:", error);
      toast.error(getLocalizedText(
        'Error loading about page content, showing fallback data',
        '加载"关于我们"页面内容时出错，显示备用内容'
      ));
    }
  }, [error, getLocalizedText]);

  // 确保内容始终可用，即使content为undefined
  const safeContent = content || {
    hero: {
      title_en: "About EdGoing",
      title_zh: "关于 EdGoing",
      subtitle_en: "Empowering global education and cultural exchange",
      subtitle_zh: "赋能全球教育和文化交流",
      background_image: "/lovable-uploads/f0b87c9a-14ef-4e95-ae65-07fe4018b1fc.png"
    },
    mission: {
      title_en: "Our Mission",
      title_zh: "我们的使命",
      content_en: "Redefine education by creating transformative, real-world learning experiences beyond the classroom.\n\nBridge cultures and foster global connections through curated educational travel programs.\n\nInspire curiosity and personal growth through immersive, hands-on learning opportunities.\n\nPartner with top universities worldwide to offer high-quality programs in fields like AI, technology, and humanities.\n\nEmpower students from China and around the world to explore new fields and develop critical skills.\n\nShape the future by cultivating thoughtful, innovative, and globally-minded leaders.",
      content_zh: "通过创造超越课堂的变革性、真实世界的学习体验，重新定义教育。\n\n通过精心策划的教育旅行项目，架起文化桥梁，促进全球连接。\n\n通过沉浸式、实践性的学习机会，激发好奇心和个人成长。\n\n与全球顶级大学合作，提供人工智能、技术、人文学科等领域的高质量课程。\n\n赋能来自中国及世界各地的学生，探索新领域并发展关键技能。\n\n通过培养富有思想、创新和全球视野的领导者，塑造未来。",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"
    },
    values: []
  };

  // 计算核心价值观的布局
  const valuesCount = safeContent?.values?.length || 0;
  const topRowValues = valuesCount > 3 ? 3 : valuesCount;
  const bottomRowValues = valuesCount - topRowValues;

  return (
    <FrontendLayout>
      {/* Hero Section */}
      <AboutHero />

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-6xl">
          <div className="mb-12">
            <div className="mx-auto bg-white rounded-lg shadow-lg p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  {getLocalizedText("Our Story", "我们的故事")}
                </h2>
                <div className="prose prose-lg">
                  <div className="text-gray-700">
                {[
                  getLocalizedText(
                    "Edgoing was founded on the belief that education should be an immersive experience, not just a lesson. With years of expertise at a world-leading educational travel company, we've seen firsthand how travel transforms students—broadening their perspectives and sparking lifelong curiosity.",
                    "Edgoing成立于一个信念：教育应该是一次沉浸式的体验，而不仅仅是课堂上的一课。凭借在全球领先的教育旅行公司多年的经验，我们亲眼见证了旅行如何通过拓宽学生的视野并激发终生好奇心，改变他们的成长历程。"
                  ),
                  getLocalizedText(
                    "Driven by this vision, we created Edgoing to offer exclusive, curated educational travel experiences for students from China and around the globe. Specializing in high-quality programs in fields like AI, technology, and humanities, we collaborate with top-tier universities worldwide to deliver a truly transformative learning experience.",
                    "受此启发，我们创办了Edgoing，旨在为来自中国和全球的学生提供独特的教育旅行体验。我们专注于与全球顶级大学合作，提供高质量的课程，涵盖人工智能、技术、人文学科等领域，力求带来真正具有变革性的学习体验。"
                  ),
                  getLocalizedText(
                    "We're passionate about bridging cultures and creating programs that inspire discovery, shaping the next generation of leaders, thinkers, and global citizens.",
                    "我们热衷于架起文化桥梁，创造能够激发发现的项目，培养下一代领导者、思想家和全球公民。"
                  )
                ].map((text, i) => (
                  <p key={i} className="mb-6 last:mb-0">{text}</p>
                ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/5 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-6">
                    {getLocalizedText(safeContent?.mission?.title_en || '', safeContent?.mission?.title_zh || '')}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700">
                      {[
                        getLocalizedText(
                          "Redefine education by creating transformative, real-world learning experiences beyond the classroom.",
                          "通过创造超越课堂的变革性、真实世界的学习体验，重新定义教育。"
                        ),
                        getLocalizedText(
                          "Bridge cultures and foster global connections through curated educational travel programs.",
                          "通过精心策划的教育旅行项目，架起文化桥梁，促进全球连接。"
                        ),
                        getLocalizedText(
                          "Inspire curiosity and personal growth through immersive, hands-on learning opportunities.",
                          "通过沉浸式、实践性的学习机会，激发好奇心和个人成长。"
                        ),
                        getLocalizedText(
                          "Partner with top universities worldwide to offer high-quality programs in fields like AI, technology, and humanities.",
                          "与全球顶级大学合作，提供人工智能、技术、人文学科等领域的高质量课程。"
                        ),
                        getLocalizedText(
                          "Empower students from China and around the world to explore new fields and develop critical skills.",
                          "赋能来自中国及世界各地的学生，探索新领域并发展关键技能。"
                        ),
                        getLocalizedText(
                          "Shape the future by cultivating thoughtful, innovative, and globally-minded leaders.",
                          "通过培养富有思想、创新和全球视野的领导者，塑造未来。"
                        )
                      ].map((text, i) => (
                        <p key={i} className="mb-4">{text}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="md:w-1/2">
              {isLoading ? (
                <Skeleton className="w-full h-72 rounded-lg" />
              ) : (
                <img
                  src="/Edgoing/mission.png"
                  alt={getLocalizedText("Our Mission", "我们的使命")}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - 重新设计布局 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {getLocalizedText("Our Core Values", "我们的核心价值观")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {getLocalizedText(
                "The principles that guide everything we do",
                "指导我们一切行动的原则"
              )}
            </p>
          </div>

          {isLoading ? (
            // 加载时显示骨架屏
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex flex-col items-center text-center">
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-6 w-4/5 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* 3x2 网格布局 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    id: 1,
                    icon: 'BookOpen',
                    title_en: 'Curiosity',
                    title_zh: '好奇心',
                    description_en: 'We believe in fostering a lifelong love of learning, encouraging students to explore, question, and discover new perspectives',
                    description_zh: '我们相信培养终身学习的热爱，鼓励学生探索、提问并发现新的视角'
                  },
                  {
                    id: 2,
                    icon: 'Globe',
                    title_en: 'Cultural Bridge',
                    title_zh: '文化桥梁',
                    description_en: 'We are committed to bridging cultures, promoting understanding, and connecting students with diverse global communities',
                    description_zh: '我们致力于架起文化桥梁，促进理解，并将学生与多元的全球社区连接起来'
                  },
                  {
                    id: 3,
                    icon: 'CheckCircle',
                    title_en: 'Excellence',
                    title_zh: '卓越',
                    description_en: 'We strive for the highest standards in everything we do, from program quality to student experiences',
                    description_zh: '我们追求一切工作的最高标准，从课程质量到学生体验'
                  },
                  {
                    id: 4,
                    icon: 'UserPlus',
                    title_en: 'Innovation',
                    title_zh: '创新',
                    description_en: 'We embrace creativity and innovation, continuously evolving our programs to stay at the forefront of education',
                    description_zh: '我们拥抱创造力和创新，不断发展我们的项目，以保持在教育领域的领先地位'
                  },
                  {
                    id: 5,
                    icon: 'Shield',
                    title_en: 'Integrity',
                    title_zh: '诚信',
                    description_en: 'We act with honesty and transparency, ensuring that our programs are built on trust and mutual respect',
                    description_zh: '我们以诚实和透明的态度行事，确保我们的项目建立在信任和相互尊重的基础上'
                  },
                  {
                    id: 6,
                    icon: 'Globe2',
                    title_en: 'Global Citizenship',
                    title_zh: '全球公民',
                    description_en: 'We aim to cultivate responsible, empathetic leaders who will contribute positively to the global community',
                    description_zh: '我们旨在培养负责任的、有同理心的领导者，为全球社区做出积极贡献'
                  }
                ].map((value) => (
                  <div key={value.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                    <div className="mb-4">
                      {iconMap[value.icon] || <div className="h-8 w-8 bg-blue-500 rounded-full"></div>}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {getLocalizedText(value.title_en, value.title_zh)}
                    </h3>
                    <p className="text-gray-600">
                      {getLocalizedText(value.description_en, value.description_zh)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </FrontendLayout>
  );
};

export default AboutPage;
