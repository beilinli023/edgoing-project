import api from './api';
import { LearnHowPage, FaqItemWithCategory } from '@/types/learnHowTypes';

// 获取Learn How页面内容
export const getLearnHowPageContent = async (): Promise<LearnHowPage> => {
  try {
    console.log('API call: Fetching learn-more page content');
    const response = await api.get('/learn-more/content');
    
    // 如果响应不存在或不是对象，返回默认数据
    if (!response || !response.data || typeof response.data !== 'object') {
      console.warn('Invalid response data format, using defaults');
      throw new Error('Invalid response data format');
    }
    
    console.log('API success: Got learn-more page content', response.data);
    // 确保hero和contact_section字段存在
    const data = response.data;
    
    return {
      hero: {
        title_en: data.hero?.title_en || "Learn More",
        title_zh: data.hero?.title_zh || "了解更多",
        subtitle_en: data.hero?.subtitle_en || "Find answers to common questions about our international education programs, activities, and services",
        subtitle_zh: data.hero?.subtitle_zh || "获取有关我们国际教育项目、活动和服务的常见问题解答",
        background_image: data.hero?.background_image || "/lovable-uploads/095982ef-a87c-40ba-a4fe-d4d95ab84dae.png"
      },
      contact_section: {
        title_en: data.contact_section?.title_en || "Still Have Questions?",
        title_zh: data.contact_section?.title_zh || "还有疑问？",
        description_en: data.contact_section?.description_en || "If you couldn't find the answer to your question, don't hesitate to reach out to us directly. Our advisors are here to help you with any inquiries you may have",
        description_zh: data.contact_section?.description_zh || "如果您没有找到问题的答案，请随时直接联系我们。我们的顾问将帮助您解答任何疑问。",
        button_text_en: data.contact_section?.button_text_en || "Ask An Advisor",
        button_text_zh: data.contact_section?.button_text_zh || "咨询顾问",
        button_url: data.contact_section?.button_url || "/contact"
      }
    };
  } catch (error) {
    console.error('获取了解更多页面内容失败:', error);
    // 返回默认数据
    return {
      hero: {
        title_en: "Learn More",
        title_zh: "了解更多",
        subtitle_en: "Find answers to common questions about our international education programs, activities, and services",
        subtitle_zh: "获取有关我们国际教育项目、活动和服务的常见问题解答",
        background_image: "/lovable-uploads/095982ef-a87c-40ba-a4fe-d4d95ab84dae.png"
      },
      contact_section: {
        title_en: "Still Have Questions?",
        title_zh: "还有疑问？",
        description_en: "If you couldn't find the answer to your question, don't hesitate to reach out to us directly. Our advisors are here to help you with any inquiries you may have",
        description_zh: "如果您没有找到问题的答案，请随时直接联系我们。我们的顾问将帮助您解答任何疑问。",
        button_text_en: "Ask An Advisor",
        button_text_zh: "咨询顾问",
        button_url: "/contact"
      }
    };
  }
};

// 获取所有FAQ
export const getAllFaqs = async (): Promise<FaqItemWithCategory[]> => {
  try {
    console.log('API call: Fetching all FAQs');
    const response = await api.get('/faqs');
    
    // 验证返回的数据是否为数组
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.warn('Invalid FAQs response, using mock data');
      return getMockFaqs();
    }
    
    console.log(`API success: Got ${response.data.length} FAQs`);
    return response.data.length > 0 ? response.data : getMockFaqs();
  } catch (error) {
    console.error('获取FAQ失败:', error);
    // 返回默认数据
    return getMockFaqs();
  }
};

// 更新Learn How页面内容
export const updateLearnHowPageContent = async (content: LearnHowPage): Promise<LearnHowPage> => {
  try {
    console.log('API call: Updating learn-more page content');
    const response = await api.put('/learn-more/content', content);
    console.log('API success: Updated learn-more page content');
    return response.data;
  } catch (error) {
    console.error('更新Learn How页面内容失败:', error);
    throw error;
  }
};

// 搜索FAQ
export const searchFaqs = async (query: string): Promise<FaqItemWithCategory[]> => {
  try {
    console.log(`API call: Searching FAQs with query "${query}"`);
    const response = await api.get(`/faqs/search?q=${encodeURIComponent(query)}`);
    
    // 验证返回的数据是否为数组
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Invalid search response, using local search');
      return [];
    }
    
    console.log(`API success: Found ${response.data.length} FAQ results`);
    return response.data;
  } catch (error) {
    console.error('搜索FAQ失败:', error);
    // 使用本地搜索作为降级方案
    console.log('Falling back to local search');
    const allFaqs = await getAllFaqs();
    return allFaqs.filter(faq => 
      faq.question_en.toLowerCase().includes(query.toLowerCase()) || 
      faq.question_zh.toLowerCase().includes(query.toLowerCase()) || 
      faq.answer_en.toLowerCase().includes(query.toLowerCase()) || 
      faq.answer_zh.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// 提供默认FAQ数据
const getMockFaqs = (): FaqItemWithCategory[] => {
  console.log('Using mock FAQ data');
  return [
    {
      id: 1,
      question_en: "Who can participate in your educational travel programs?",
      question_zh: "谁可以参加你们的教育旅行项目？",
      answer_en: "Our programs are designed for students of all backgrounds, typically ranging from middle school to college, depending on the trip. We also offer some programs for educators, families, and adult learners who are passionate about learning through travel. Each trip has specific age recommendations to ensure the best experience for everyone!",
      answer_zh: "我们的项目适合各种背景的学生，通常针对初中生到大学生，具体取决于行程安排。此外，我们还提供专为教师、家庭以及热爱通过旅行学习的成人设计的项目。每个行程都有特定的年龄建议，以确保所有参与者都能获得最佳体验！",
      category_id: 1,
      order: 1,
      is_featured: true
    },
    {
      id: 2,
      question_en: "Are your programs suitable for students with no prior travel experience?",
      question_zh: "你们的项目适合没有旅行经验的学生吗？",
      answer_en: "Absolutely! Many of our travelers are experiencing international or group travel for the first time. Our programs are structured to provide plenty of guidance, from pre-trip orientations to on-the-ground support, ensuring that even first-time travelers feel comfortable and confident every step of the way.",
      answer_zh: "当然！我们的许多旅行者都是第一次参加国际旅行或团体旅行。我们的项目提供全面的指导，包括行前说明会和全程的专业支持，确保即使是第一次旅行的学生也能感到安心和自信，享受旅程的乐趣。",
      category_id: 1,
      order: 2,
      is_featured: true
    },
    {
      id: 3,
      question_en: "Will students have free time to explore on their own?",
      question_zh: "学生是否有自由活动时间？",
      answer_en: "Yes, but with structure and safety in mind. We understand the excitement of discovering a new place, so we build in supervised free time where students can explore in small groups within designated areas. Our trip leaders provide clear guidelines to make sure students enjoy their independence while staying safe.",
      answer_zh: "有的，但会在确保安全的前提下进行。我们理解探索新地方的兴奋感，因此我们会安排适量的自由活动时间，允许学生在小组内，在指定区域内进行探索。我们的领队会提供明确的指导，以确保学生既能享受自由，又能保持安全。",
      category_id: 2,
      order: 1,
      is_featured: true
    },
    {
      id: 4,
      question_en: "What safety measures do you have in place during the trip?",
      question_zh: "你们在旅途中采取了哪些安全措施？",
      answer_en: "Safety is our top priority. Our programs include 24/7 support from trained staff, carefully vetted accommodations and transportation, and strict check-in procedures. Students receive emergency contact information, and we always have a plan in place for any unexpected situations.",
      answer_zh: "安全是我们的首要任务。我们的项目提供全天候支持，所有住宿和交通方式都经过严格筛选，我们也实行严格的签到制度。每位学生都会获得紧急联系方式，我们始终制定详细的应急预案，以应对任何突发情况。",
      category_id: 6,
      order: 1,
      is_featured: true
    },
    {
      id: 5,
      question_en: "How do you handle medical emergencies or illnesses during the trip?",
      question_zh: "如果学生在旅途中生病或遇到医疗紧急情况，你们如何处理？",
      answer_en: "If a student feels unwell or has a medical emergency, our staff will assess the situation immediately and seek medical attention as needed. We have partnerships with local medical providers and hospitals in every destination. Parents/guardians will be contacted right away, and we'll ensure the student receives the best possible care.",
      answer_zh: "如果学生感到不适或发生医疗紧急情况，我们的工作人员会立即评估情况，并及时安排就医。我们与每个目的地的当地医疗机构和医院建立了合作关系，以确保学生能获得最佳的医疗照顾。同时，我们会第一时间联系学生的家长/监护人，并持续提供最新情况反馈。",
      category_id: 6,
      order: 2,
      is_featured: true
    },
    {
      id: 6,
      question_en: "What happens if a student gets lost or separated from the group?",
      question_zh: "如果学生走失或与团队失散怎么办？",
      answer_en: "We have clear protocols in place to prevent this, including buddy systems, regular check-ins, and designated meeting points. If a student does get separated, our team acts quickly, using local contacts and communication tools to reunite them with the group. Each traveler also carries emergency contact details and instructions on what to do if they get lost.",
      answer_zh: "我们有明确的预防措施来避免这种情况，包括结伴同行制度、定期点名和指定集合点等。如果学生不小心与团队失散，我们的团队会立即启动应急程序，利用当地资源和通讯工具迅速找到并接回学生。每位旅行者都会随身携带紧急联系方式和应对指引，以确保即使迷路也能安全返回团队。",
      category_id: 6,
      order: 3,
      is_featured: true
    },
    {
      id: 7,
      question_en: "Are meals included, and can you accommodate dietary restrictions?",
      question_zh: "是否包含餐食？可以满足特殊饮食需求吗？",
      answer_en: "Yes, most of our programs include daily meals, typically breakfast and either lunch or dinner. We can accommodate dietary restrictions such as vegetarian, vegan, gluten-free, and other special dietary needs—just let us know in advance, and we’ll make the necessary arrangements.",
      answer_zh: "是的，我们的大部分项目都包含每日餐食，通常是早餐和午餐或晚餐。我们可以根据需求提供特殊饮食安排，例如素食、纯素食、无麸质饮食等。请提前告知我们您的饮食要求，我们将为您打造个性化的旅行计划。",
      category_id: 9,
      order: 4,
      is_featured: true
    },
    {
      id: 8,
      question_en: "What should students pack for the trip?",
      question_zh: "学生应该为旅行准备哪些物品？",
      answer_en: "Packing lists vary based on the destination and season, but we provide a detailed packing guide before departure. In general, students should bring comfortable clothing, appropriate footwear, travel documents, personal essentials, and any required medications. We also recommend a small daypack for daily excursions.",
      answer_zh: "具体的行李清单会根据目的地和季节有所不同，但我们会在出发前提供详细的打包指南。一般来说，建议携带舒适的衣物、合适的鞋子、旅行证件、个人必需品和任何所需的药品。同时，我们建议携带一个小型背包，以便日常外出使用。",
      category_id: 9,
      order: 5,
      is_featured: true
    },
    {
      id: 9,
      question_en: "Who can I contact if I have questions before or during the trip?",
      question_zh: "如果在出发前或旅途中有问题，我可以联系谁？",
      answer_en: "Before the trip, our customer support team is available via phone and email to answer any questions. During the trip, students and parents will have access to our on-site trip leaders and emergency contact numbers for immediate assistance.",
      answer_zh: "在出发前，您可以通过电话或电子邮件联系我们的客户支持团队，我们随时为您解答疑问。在旅途中，学生和家长可以随时与我们的现场领队联系，并获取紧急联系电话，以便在需要时获得帮助。",
      category_id: 9,
      order: 6,
      is_featured: true
    },
    {
      id: 10,
      question_en: "Do you offer customized programs for schools or groups?",
      question_zh: "你们是否为学校或团体提供定制旅行项目？",
      answer_en: "Yes! We work closely with schools and organizations to design customized educational travel experiences that align with their learning goals and interests.",
      answer_zh: "是的！我们可以根据学校或机构的需求，定制符合其学习目标和兴趣的教育旅行项目。",
      category_id: 9,
      order: 7,
      is_featured: true
    },
    {
      id: 11,
      question_en: "Can we request specific destinations or activities for our group?",
      question_zh: "我们可以为团队指定特定的目的地或活动吗？",
      answer_en: "Absolutely! We can tailor the itinerary based on your preferences, whether it’s adding cultural experiences, historical sites, hands-on workshops, or specific academic components. Let us know your group's needs, and we’ll create a personalized program.",
      answer_zh: "当然可以！我们可以根据您的需求调整行程，无论是添加文化体验、历史遗址、实践工作坊，还是特定的学术内容。请告诉我们您的团体需求，我们将为您打造个性化的旅行计划。",
      category_id: 9,
      order: 8,
      is_featured: true
    },
    {
      id: 12,
      question_en: "What is the minimum or maximum group size for a customized program?",
      question_zh: "定制项目的最小和最大团队规模是多少？",
      answer_en: "Group sizes vary depending on the destination and type of program. Generally, customized programs require a minimum of 10-15 participants. Maximum group sizes depend on factors such as accommodation availability and activity capacity, but we can accommodate large groups with proper planning.",
      answer_zh: "团队规模取决于目的地和项目类型。通常，定制项目的最低人数要求为10-15人。最大团队规模受住宿、活动容量等因素的影响，但我们可以通过提前规划来安排大型团体。",
      category_id: 9,
      order: 9,
      is_featured: true
    }
  ];
};
