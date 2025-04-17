import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "sonner";

// 测试组件
import TestHeroImage from "./components/frontend/home/TestHeroImage";

// Admin pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import ContentManager from "./pages/ContentManager";
import HomeManager from "./pages/HomeManager";
import BlogManager from "./pages/BlogManager";
import BlogPostAdd from "./pages/BlogPostAdd";
import BlogPostEdit from "./pages/BlogPostEdit";
import ProgramManager from "./pages/ProgramManager";
import ProgramEdit from "./pages/ProgramEdit";
import FaqManager from "./pages/FaqManager";
import FaqEdit from "./pages/FaqEdit";
import MediaManager from "./pages/MediaManager";
import LearnHowManager from "./pages/LearnHowManager";
import FormManager from "./pages/FormManager";
import SubscriptionManager from "./pages/SubscriptionManager";

// Frontend pages
import HomePage from "./pages/frontend/HomePage";
import AboutPage from "./pages/frontend/AboutPage";
import ProgramsPage from "./pages/frontend/ProgramsPage";
import ProgramDetailPage from "./pages/frontend/ProgramDetailPage";
import BlogPage from "./pages/frontend/BlogPage";
import BlogPostDetail from "./pages/frontend/BlogPostDetail";
import BlogVideoPage from "./pages/frontend/BlogVideoPage";
import LearnHowPage from "./pages/frontend/LearnHowPage";
import StartPlanningPage from "./pages/frontend/StartPlanningPage";
import StudyAbroadPage from "./pages/frontend/StudyAbroadPage";
import UniversityDetailPage from "./pages/frontend/UniversityDetailPage";
import PrivacyPolicyPage from "./pages/frontend/PrivacyPolicyPage";

// Create a client with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 窗口聚焦时不重新获取数据
      retry: 1, // 失败时最多重试1次
      staleTime: 5 * 60 * 1000, // 数据5分钟内视为新鲜
      gcTime: 10 * 60 * 1000, // 缓存保留10分钟（旧版为cacheTime）
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/content" element={<ContentManager />} />
            <Route path="/admin/home" element={<HomeManager />} />
            <Route path="/admin/blog" element={<BlogManager />} />
            <Route path="/admin/blog/posts/add" element={<BlogPostAdd />} />
            <Route path="/admin/blog/posts/edit/:id" element={<BlogPostEdit />} />
            <Route path="/admin/programs" element={<ProgramManager />} />
            <Route path="/program/edit/:id" element={<ProgramEdit />} />
            <Route path="/program/new" element={<ProgramEdit />} />
            <Route path="/admin/faq" element={<FaqManager />} />
            <Route path="/admin/faq/add" element={<FaqEdit />} />
            <Route path="/admin/faq/edit/:id" element={<FaqEdit />} />
            <Route path="/admin/media" element={<MediaManager />} />
            <Route path="/admin/learn-how" element={<LearnHowManager />} />
            <Route path="/admin/forms" element={<FormManager />} />
            <Route path="/admin/subscription" element={<SubscriptionManager />} />

            {/* Frontend Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/:id" element={<ProgramDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/blog-videos" element={<BlogVideoPage />} />
            <Route path="/learn-more" element={<LearnHowPage />} />
            <Route path="/learn-how" element={<LearnHowPage />} />
            <Route path="/start-planning" element={<StartPlanningPage />} />
            <Route path="/study-abroad" element={<StudyAbroadPage />} />
            <Route path="/university/:id" element={<UniversityDetailPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/test-hero" element={<TestHeroImage />} />

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </LanguageProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
