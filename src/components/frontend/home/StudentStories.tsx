import React from 'react';
import { Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useFrontendStudentStories } from '@/hooks/useFrontendStudentStories';

interface StudentStoriesProps {
  currentLanguage: 'en' | 'zh';
}

const StudentStories: React.FC<StudentStoriesProps> = ({ currentLanguage }) => {
  const [currentStory, setCurrentStory] = React.useState(0);
  const { stories, isLoading } = useFrontendStudentStories(currentLanguage);

  const nextStory = () => {
    if (stories.length > 0) {
      setCurrentStory((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
    }
  };

  const prevStory = () => {
    if (stories.length > 0) {
      setCurrentStory((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-white flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // 如果没有获取到故事数据，显示一个回退版本
  if (!stories || stories.length === 0) {
    const fallbackStories = [
      {
        id: "1",
        name: "Steven Stanley",
        image: "/Edgoing/Home_Page/Testimonial1StevenStanley.jpg",
        background: currentLanguage === 'en' ? "High School Student, 17 years old" : "高中生，17 岁",
        program: currentLanguage === 'en' ? "Cultural Exchange in Kyoto" : "京都的文化交流",
        rating: 5,
        testimony: currentLanguage === 'en' 
          ? "Kyoto was so cool! I loved checking out the streets and the culture, especially the taiko drumming and summer festivals – seriously awesome! The tea ceremony, calligraphy, and staying with a local family really showed me Japanese values."
          : "京都超酷的！我超喜欢逛那里的街道，感受那里的文化，尤其是太鼓表演和夏日祭——真的太赞了！茶道、书法，还有住在当地人家里，让我真正体会到了日本的文化价值观。"
      },
      {
        id: "2",
        name: "Kheng Lee",
        image: "/Edgoing/Home_Page/Testimonial2KhengLeng.jpg",
        background: currentLanguage === 'en' ? "Teacher" : "教师",
        program: currentLanguage === 'en' ? "STEM Program in Singapore" : "新加坡的STEM项目",
        rating: 5,
        testimony: currentLanguage === 'en'
          ? "My students couldn't stop sharing their exciting experiences after the trip to Singapore. I, too, thoroughly enjoyed the excursion to Gardens by the Bay, where we marveled at a stunning variety of flora and fauna in the beautiful indoor gardens, creating unforgettable memories."
          : "这是我的学生们在新加坡之旅后无法停止分享他们的激动经历。我也非常享受这次滨海湾花园的游览，我们在美丽的室内花园中惊叹于各种令人惊叹的动植物，创造了难忘的回忆。"
      },
      {
        id: "3",
        name: "Li Wei",
        image: "/Edgoing/Home_Page/Testimonial3Liwei.jpg",
        background: currentLanguage === 'en' ? "High School Student, 17 years old" : "高中生，17岁",
        program: currentLanguage === 'en' ? "Wealth Management Program by Edgoing at SMU" : "Edgoing与新加坡管理大学（SMU）合作的财富管理项目",
        rating: 5,
        testimony: currentLanguage === 'en'
          ? "I'm Li Wei, 17, from Shanghai. The Wealth Management Program by Edgoing at Singapore Management University (SMU) ignited my passion for finance. Lecturers made complex topics accessible—their interactive lectures on stock markets and personal budgeting were eye-opening! Assignments, like analyzing mock portfolios, and group presentations on risk management taught me teamwork and critical thinking. Presenting our case study to SMU lecturers, who gave personalized feedback, was nerve-wracking but rewarding. Earning the Certificate of Completion boosted my university applications—now I'm determined to pursue finance degrees. For pre-university students: Edgoing and SMU's blend of mentorship and real-world challenges is the perfect academic launchpad!"
          : "我是李维，17岁，来自上海。Edgoing与新加坡管理大学（SMU）合作的财富管理项目点燃了我对金融的热情。讲师们将复杂的主题讲解得通俗易懂——他们关于股票市场和个人预算的互动课程让我大开眼界！作业，比如分析模拟投资组合，以及关于风险管理的小组展示，教会了我团队合作和批判性思维。向SMU讲师展示我们的案例研究时，虽然紧张，但他们的个性化反馈让我受益匪浅。获得结业证书为我的大学申请增添了亮点——现在我决心攻读金融学位。对于大学预科生来说，Edgoing和SMU的导师指导与现实挑战相结合，是完美的学术起点！"
      }
    ];

    return renderContent(fallbackStories);
  }

  return renderContent(stories);

  // 渲染内容的辅助函数
  function renderContent(storiesData: any[]) {
    if (storiesData.length === 0) return null;

    const story = storiesData[currentStory % storiesData.length];

    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h2 className="text-3xl font-bold mb-2">{currentLanguage === 'en' ? 'Student Stories' : '学生故事'}</h2>
            <p className="text-gray-600">
              {currentLanguage === 'en' 
                ? 'Hear from our students about their transformative experiences abroad.'
                : '聆听我们的学生分享他们在国外的转变体验。'}
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="py-8 px-4 relative">
              <div className="text-center mb-8">
                <p className="text-lg font-italic mb-6">"{story.testimony}"</p>
                <div className="flex justify-center mb-2">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-16 h-16 rounded-full object-cover mb-3"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{story.name}</h3>
                <p className="text-sm text-gray-600">{story.background}</p>
                <p className="text-sm text-blue-600 mt-1 font-medium">{story.program}</p>
                
                <div className="flex items-center justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < story.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                {storiesData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStory(index)}
                    className={`w-2 h-2 mx-1 rounded-full transition-colors ${
                      index === currentStory ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to story ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {storiesData.length > 1 && (
              <>
                <button 
                  onClick={prevStory}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button 
                  onClick={nextStory}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Next story"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default StudentStories;
