
import { PartnerUniversityDetail, StudyAbroadPageContent } from '@/types/studyAbroadTypes';

/**
 * Default study abroad page content
 */
export const getDefaultStudyAbroadContent = (): StudyAbroadPageContent => {
  console.log('Using default study abroad content');
  return {
    title_en: 'University Study Abroad Programs',
    title_zh: '精彩留学',
    description_en: 'Explore study abroad programs from world-class universities and begin your new academic journey',
    description_zh: '探索世界一流大学的留学项目，开启您的学术新旅程',
    benefits: [
      {
        icon: 'Building',
        title_en: 'World-Class Universities',
        title_zh: '世界一流大学',
        description_en: 'Partnerships with globally renowned institutions, including Ivy League, top European and Asian universities',
        description_zh: '与全球知名学府合作，包括常春藤名校、欧洲顶尖大学和亚洲优秀学府'
      },
      {
        icon: 'Book',
        title_en: 'Diverse Academic Options',
        title_zh: '多样化学科选择',
        description_en: 'From business and engineering to arts and humanities, universities offer a wide range of academic specializations',
        description_zh: '从商科、工程到艺术、人文学科，各大学提供广泛的专业选择'
      },
      {
        icon: 'Users',
        title_en: 'Campus Culture Experience',
        title_zh: '校园文化体验',
        description_en: 'Immerse in campus life, participate in student activities, and experience each university\'s unique culture',
        description_zh: '融入大学校园生活，参与学生活动，体验不同大学的独特文化'
      },
      {
        icon: 'GraduationCap',
        title_en: 'Academic Resource Access',
        title_zh: '学术资源访问',
        description_en: 'Access libraries, laboratories and research facilities, enjoying university-level academic resources',
        description_zh: '获得图书馆、实验室和研究设施的使用权，享受大学级别的学术资源'
      }
    ],
    universities: [
      {
        id: 1,
        name_en: 'Harvard University',
        name_zh: '哈佛大学',
        location_en: 'USA',
        location_zh: '美国',
        programs_en: 'Business Leadership, International Relations',
        programs_zh: '商业领导力、国际关系',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
      },
      {
        id: 2,
        name_en: 'Oxford University',
        name_zh: '牛津大学',
        location_en: 'UK',
        location_zh: '英国',
        programs_en: 'Literature & History, Scientific Research',
        programs_zh: '文学与历史、科学研究',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
      },
      {
        id: 3,
        name_en: 'University of Tokyo',
        name_zh: '东京大学',
        location_en: 'Japan',
        location_zh: '日本',
        programs_en: 'Technology Innovation, Japanese Cultural Studies',
        programs_zh: '技术创新、日本文化研究',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c'
      },
      {
        id: 4,
        name_en: 'University of Melbourne',
        name_zh: '墨尔本大学',
        location_en: 'Australia',
        location_zh: '澳大利亚',
        programs_en: 'Environmental Science, Public Health',
        programs_zh: '环境科学、公共健康',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
      },
      {
        id: 5,
        name_en: 'ETH Zurich',
        name_zh: '苏黎世联邦理工学院',
        location_en: 'Switzerland',
        location_zh: '瑞士',
        programs_en: 'Engineering, Computer Science, Physics',
        programs_zh: '工程学、计算机科学、物理学',
        image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
      },
      {
        id: 6,
        name_en: 'National University of Singapore',
        name_zh: '新加坡国立大学',
        location_en: 'Singapore',
        location_zh: '新加坡',
        programs_en: 'Business Administration, Data Science, Medicine',
        programs_zh: '工商管理、数据科学、医学',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
      }
    ],
    cta_title_en: 'Ready to apply for university study abroad programs?',
    cta_title_zh: '准备好申请大学留学项目了吗？',
    cta_description_en: 'We can help you choose the most suitable university and program, and guide you through the entire application process',
    cta_description_zh: '我们可以帮助您选择最适合的大学和项目，并指导您完成整个申请过程',
    cta_button_text_en: 'Start Planning',
    cta_button_text_zh: '开始规划',
    cta_button_link: '/start-planning'
  };
};

/**
 * Mock university details
 */
export const defaultUniversities: Record<number, PartnerUniversityDetail> = {
  1: {
    id: 1,
    name_en: 'Harvard University',
    name_zh: '哈佛大学',
    location_en: 'Cambridge, Massachusetts, USA',
    location_zh: '美国 马萨诸塞州 剑桥',
    programs_en: 'Business Leadership, International Relations, Computer Science',
    programs_zh: '商业领导力、国际关系、计算机科学',
    image: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4',
    featured_image: 'https://images.unsplash.com/photo-1523050854058-8f6e74349ca1',
    description_en: 'Harvard University, established in 1636, is a private Ivy League research university in Cambridge, Massachusetts. It is the oldest institution of higher learning in the United States and consistently ranks among the top universities globally. Harvard offers an exceptional educational experience with world-renowned faculty, cutting-edge research facilities, and a diverse student body from around the world.',
    description_zh: '哈佛大学成立于1636年，是美国马萨诸塞州剑桥市的一所私立常春藤盟校研究型大学。它是美国历史最悠久的高等学府，始终在全球顶尖大学中名列前茅。哈佛大学拥有世界著名的教授团队、尖端研究设施和来自世界各地的多元化学生群体，提供卓越的教育体验。',
    gallery_images: [
      'https://images.unsplash.com/photo-1562774053-701939374585',
      'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1', 
      'https://images.unsplash.com/photo-1583889539090-22ae9810cd5c'
    ],
    highlights_en: '<ul><li>Founded in 1636, Harvard is America\'s oldest institution of higher learning</li><li>Harvard Library is the largest academic library system in the world</li><li>Harvard\'s endowment is the largest of any academic institution in the world</li><li>Harvard has produced 8 U.S. presidents and 161 Nobel laureates</li></ul>',
    highlights_zh: '<ul><li>哈佛大学创建于1636年，是美国历史最悠久的高等学府</li><li>哈佛图书馆是世界上最大的学术图书馆系统</li><li>哈佛大学的捐赠基金是世界上任何学术机构中最大的</li><li>哈佛大学培养了8位美国总统和161位诺贝尔奖获得者</li></ul>',
    facilities_en: '<p>Harvard\'s campus spans approximately 209 acres in Cambridge, with additional facilities throughout the Boston metropolitan area. Key facilities include:</p><ul><li>More than 70 libraries with over 20 million volumes</li><li>State-of-the-art research laboratories and centers</li><li>The Harvard Art Museums complex</li><li>Multiple athletic facilities including the Harvard Stadium</li><li>Various residence halls organized in the House system</li></ul>',
    facilities_zh: '<p>哈佛大学的校园占地约209英亩，位于剑桥市，在波士顿大都市区还有其他设施。主要设施包括：</p><ul><li>70多个图书馆，藏书超过2000万册</li><li>先进的研究实验室和中心</li><li>哈佛艺术博物馆综合体</li><li>多个体育设施，包括哈佛体育场</li><li>按照学院制组织的各种学生宿舍</li></ul>',
    academics_en: '<p>Harvard offers undergraduate, graduate and professional degrees across a broad spectrum of disciplines, organized into various schools and departments:</p><ul><li>Harvard College (undergraduate)</li><li>Graduate School of Arts and Sciences</li><li>Harvard Business School</li><li>Harvard Law School</li><li>Harvard Medical School</li><li>Harvard Kennedy School</li><li>Plus multiple other graduate and professional schools</li></ul>',
    academics_zh: '<p>哈佛大学提供本科、研究生和专业学位，涵盖广泛的学科领域，分为各种学院和系：</p><ul><li>哈佛学院（本科）</li><li>文理研究生院</li><li>哈佛商学院</li><li>哈佛法学院</li><li>哈佛医学院</li><li>哈佛肯尼迪政府学院</li><li>以及其他多个研究生院和专业学院</li></ul>',
    admission_en: '<p>Harvard\'s admission process is highly competitive. For international students, it requires:</p><ul><li>Strong academic record with challenging coursework</li><li>High standardized test scores (SAT/ACT)</li><li>English proficiency test scores (TOEFL/IELTS)</li><li>Significant extracurricular achievements</li><li>Compelling personal essays</li><li>Letters of recommendation</li></ul>',
    admission_zh: '<p>哈佛大学的录取过程竞争非常激烈。对国际学生的要求包括：</p><ul><li>优秀的学术成绩和具有挑战性的课程</li><li>高标准化考试成绩（SAT/ACT）</li><li>英语水平考试成绩（托福/雅思）</li><li>显著的课外活动成就</li><li>引人入胜的个人陈述</li><li>推荐信</li></ul>',
    ranking: '#3 (2023 QS World University Rankings)',
    founded: '1636',
    website: 'harvard.edu'
  },
  2: {
    id: 2,
    name_en: 'Oxford University',
    name_zh: '牛津大学',
    location_en: 'Oxford, United Kingdom',
    location_zh: '英国 牛津',
    programs_en: 'Literature & History, Scientific Research, Humanities',
    programs_zh: '文学与历史、科学研究、人文学科',
    image: 'https://images.unsplash.com/photo-1580539924400-a3633009c920',
    featured_image: 'https://images.unsplash.com/photo-1553965489-8cb80a85871a',
    description_en: 'The University of Oxford is a collegiate research university in Oxford, England. There is evidence of teaching as early as 1096, making it the oldest university in the English-speaking world and the world\'s second-oldest university in continuous operation. The university consists of 39 semi-autonomous constituent colleges, six permanent private halls, and a range of academic departments.',
    description_zh: '牛津大学是英国牛津的一所大学联邦制研究型大学。有证据表明早在1096年就开始了教学活动，这使其成为英语世界最古老的大学，也是世界上第二古老的持续运营大学。该大学由39个半自治的学院、6个永久性私立学堂和一系列学术部门组成。',
    gallery_images: [
      'https://images.unsplash.com/photo-1588422337035-40de075362cd',
      'https://images.unsplash.com/photo-1572027743004-e7c4e96c8b1a',
      'https://images.unsplash.com/photo-1551383616-a3d6767e4fbc'
    ],
    highlights_en: '<ul><li>Oxford is the oldest university in the English-speaking world</li><li>The Bodleian Library is one of the oldest libraries in Europe</li><li>Oxford\'s unique college system creates tight-knit academic communities</li><li>Oxford has educated 28 British Prime Ministers, at least 30 international leaders, and 72 Nobel Prize laureates</li></ul>',
    highlights_zh: '<ul><li>牛津是英语世界中最古老的大学</li><li>博德利图书馆是欧洲最古老的图书馆之一</li><li>牛津独特的学院系统创造了紧密的学术社区</li><li>牛津培养了28位英国首相、至少30位国际领导人和72位诺贝尔奖获得者</li></ul>',
    facilities_en: '<p>Oxford\'s historic facilities blend centuries of tradition with modern research infrastructure:</p><ul><li>The Bodleian Library with over 13 million printed items</li><li>World-class museums including the Ashmolean</li><li>Advanced scientific research facilities</li><li>Historic college buildings dating back centuries</li><li>Modern student centers and facilities</li></ul>',
    facilities_zh: '<p>牛津的历史设施将几个世纪的传统与现代研究基础设施融为一体：</p><ul><li>博德利图书馆拥有超过1300万件印刷品</li><li>世界级博物馆，包括阿什莫林博物馆</li><li>先进的科学研究设施</li><li>可追溯至几个世纪前的历史悠久的学院建筑</li><li>现代学生中心和设施</li></ul>',
    academics_en: '<p>Oxford offers undergraduate and graduate degrees across all major academic disciplines, organized through departments and colleges. Key academic areas include:</p><ul><li>Humanities (Classics, History, Languages)</li><li>Social Sciences (PPE, Economics, Law)</li><li>Mathematical, Physical and Life Sciences</li><li>Medical Sciences</li></ul>',
    academics_zh: '<p>牛津通过系和学院提供涵盖所有主要学术学科的本科和研究生学位。主要学术领域包括：</p><ul><li>人文学科（古典学、历史、语言）</li><li>社会科学（哲学、政治和经济学、法律）</li><li>数学、物理和生命科学</li><li>医学科学</li></ul>',
    admission_en: '<p>Oxford\'s admission is highly selective, with different processes for undergraduate and graduate study. For international students:</p><ul><li>Outstanding academic achievement in previous studies</li><li>Aptitude test scores for many programs</li><li>English language proficiency (IELTS/TOEFL)</li><li>Interview performance for shortlisted candidates</li><li>Personal statement/research proposal</li></ul>',
    admission_zh: '<p>牛津的录取非常有选择性，本科和研究生学习有不同的录取流程。对国际学生的要求：</p><ul><li>之前学习中的卓越学术成就</li><li>许多项目的能力测试成绩</li><li>英语语言能力（雅思/托福）</li><li>入围候选人的面试表现</li><li>个人陈述/研究计划</li></ul>',
    ranking: '#2 (2023 Times Higher Education World University Rankings)',
    founded: '1096',
    website: 'ox.ac.uk'
  },
  3: {
    id: 3,
    name_en: 'University of Tokyo',
    name_zh: '东京大学',
    location_en: 'Tokyo, Japan',
    location_zh: '日本 东京',
    programs_en: 'Technology Innovation, Japanese Cultural Studies, Engineering',
    programs_zh: '技术创新、日本文化研究、工程学',
    image: 'https://images.unsplash.com/photo-1565618722479-b74a8fd72eb6',
    featured_image: 'https://images.unsplash.com/photo-1565618722479-b74a8fd72eb6',
    description_en: 'The University of Tokyo, established in 1877, is a leading research university located in Tokyo, Japan. It is the first imperial university and currently Japan\'s most prestigious university. The university has produced many notable alumni, including 17 Prime Ministers of Japan, 16 Nobel Prize laureates, 3 Pritzker Prize laureates, 3 astronauts, and 1 Fields Medalist.',
    description_zh: '东京大学成立于1877年，是位于日本东京的一所领先研究型大学。它是日本第一所帝国大学，目前是日本最负盛名的大学。该大学培养了许多杰出校友，包括17位日本首相、16位诺贝尔奖获得者、3位普利兹克奖获得者、3位宇航员和1位菲尔兹奖获得者。',
    gallery_images: [
      'https://images.unsplash.com/photo-1542542540-6da0f4dd4b51',
      'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f',
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc'
    ],
    highlights_en: '<ul><li>Japan\'s most prestigious university with a history dating back to 1877</li><li>The first of Japan\'s imperial universities</li><li>Located in the heart of Tokyo with multiple campuses</li><li>A global leader in research with cutting-edge facilities</li><li>Has produced numerous Japanese prime ministers and corporate leaders</li></ul>',
    highlights_zh: '<ul><li>日本最负盛名的大学，历史可追溯至1877年</li><li>日本帝国大学之首</li><li>位于东京中心，拥有多个校区</li><li>拥有尖端设施的全球研究领导者</li><li>培养了众多日本首相和企业领导人</li></ul>',
    facilities_en: '<p>The University of Tokyo offers state-of-the-art facilities across its five main campuses:</p><ul><li>Advanced research laboratories and institutes</li><li>One of Japan\'s largest university library systems</li><li>Modern IT infrastructure and computing resources</li><li>Museum and cultural heritage sites</li><li>Athletic and recreational facilities</li></ul>',
    facilities_zh: '<p>东京大学在其五个主要校区提供最先进的设施：</p><ul><li>先进的研究实验室和研究所</li><li>日本最大的大学图书馆系统之一</li><li>现代化的IT基础设施和计算资源</li><li>博物馆和文化遗产景点</li><li>运动和休闲设施</li></ul>',
    academics_en: '<p>The university offers a broad range of academic programs organized into 10 faculties:</p><ul><li>Law</li><li>Medicine</li><li>Engineering</li><li>Letters</li><li>Science</li><li>Agriculture</li><li>Economics</li><li>Arts and Sciences</li><li>Education</li><li>Pharmaceutical Sciences</li></ul>',
    academics_zh: '<p>该大学提供广泛的学术项目，分为10个学部：</p><ul><li>法学</li><li>医学</li><li>工学</li><li>文学</li><li>理学</li><li>农学</li><li>经济学</li><li>教养学部</li><li>教育学</li><li>药学</li></ul>',
    admission_en: '<p>Admission to the University of Tokyo is extremely competitive. International students must:</p><ul><li>Complete a rigorous entrance examination or special program application</li><li>Demonstrate excellent academic achievement</li><li>Prove Japanese language proficiency (for Japanese-taught programs)</li><li>Provide English proficiency scores for English-taught programs</li><li>Submit a well-crafted personal statement and research plan (for graduate studies)</li></ul>',
    admission_zh: '<p>东京大学的入学竞争非常激烈。国际学生必须：</p><ul><li>完成严格的入学考试或特殊项目申请</li><li>展示优秀的学术成就</li><li>证明日语能力（对于日语授课的项目）</li><li>提供英语水平成绩（对于英语授课的项目）</li><li>提交精心制作的个人陈述和研究计划（研究生学习）</li></ul>',
    ranking: '#23 (2023 QS World University Rankings)',
    founded: '1877',
    website: 'u-tokyo.ac.jp'
  },
  4: {
    id: 4,
    name_en: 'University of Melbourne',
    name_zh: '墨尔本大学',
    location_en: 'Melbourne, Australia',
    location_zh: '澳大利亚 墨尔本',
    programs_en: 'Environmental Science, Public Health, Business',
    programs_zh: '环境科学、公共健康、商务管理',
    image: 'https://images.unsplash.com/photo-1596443686116-a1e568358079',
    featured_image: 'https://images.unsplash.com/photo-1596443686116-a1e568358079',
    description_en: 'The University of Melbourne is a public research university located in Melbourne, Australia. Founded in 1853, it is Australia\'s second oldest university and the oldest in Victoria. Melbourne\'s main campus is in Parkville, with several other campuses located across Victoria. It is consistently ranked among the top universities in Australia and the world.',
    description_zh: '墨尔本大学是位于澳大利亚墨尔本的一所公立研究型大学。成立于1853年，是澳大利亚第二古老的大学，也是维多利亚州最古老的大学。墨尔本大学的主校区位于帕克维尔，在维多利亚州还有其他几个校区。它在澳大利亚和世界大学排名中一直名列前茅。',
    gallery_images: [
      'https://images.unsplash.com/photo-1589299526492-21cee46d0dac',
      'https://images.unsplash.com/photo-1576091044178-1baf1c0a2c97',
      'https://images.unsplash.com/photo-1504618223053-559bdef9dd5a'
    ],
    highlights_en: '<ul><li>Australia\'s leading research university</li><li>Located in the world\'s most livable city</li><li>Melbourne Model curriculum provides depth and breadth of education</li><li>Strong industry connections and career opportunities</li><li>Diverse and inclusive campus community</li></ul>',
    highlights_zh: '<ul><li>澳大利亚领先的研究型大学</li><li>位于世界最宜居城市</li><li>"墨尔本模式"课程提供深度和广度的教育</li><li>强大的行业联系和职业机会</li><li>多元化和包容的校园社区</li></ul>',
    facilities_en: '<p>The University of Melbourne boasts excellent facilities including:</p><ul><li>17 libraries with over 3.5 million physical volumes</li><li>State-of-the-art laboratories and research centers</li><li>One of the largest academic art collections in Australia</li><li>Modern sporting and recreational facilities</li><li>Dedicated student spaces and accommodation</li></ul>',
    facilities_zh: '<p>墨尔本大学拥有出色的设施，包括：</p><ul><li>17个图书馆，拥有超过350万册实体藏书</li><li>最先进的实验室和研究中心</li><li>澳大利亚最大的学术艺术收藏之一</li><li>现代化的体育和娱乐设施</li><li>专门的学生空间和住宿</li></ul>',
    academics_en: '<p>The university offers a comprehensive range of undergraduate and graduate programs across:</p><ul><li>Architecture, Building and Planning</li><li>Arts, Humanities and Social Sciences</li><li>Business and Economics</li><li>Education</li><li>Engineering and IT</li><li>Law</li><li>Medicine, Dentistry and Health Sciences</li><li>Science</li><li>Veterinary and Agricultural Sciences</li><li>Fine Arts and Music</li></ul>',
    academics_zh: '<p>该大学提供全面的本科和研究生课程，涵盖：</p><ul><li>建筑、建造和规划</li><li>艺术、人文和社会科学</li><li>商业和经济</li><li>教育</li><li>工程和IT</li><li>法律</li><li>医学、牙科和健康科学</li><li>科学</li><li>兽医和农业科学</li><li>美术和音乐</li></ul>',
    admission_en: '<p>For international students seeking admission, requirements include:</p><ul><li>Strong academic performance in previous studies</li><li>English language proficiency (IELTS/TOEFL)</li><li>Specific prerequisites for certain programs</li><li>Portfolio submissions for creative arts programs</li><li>Personal statements and references</li></ul>',
    admission_zh: '<p>对于寻求入学的国际学生，要求包括：</p><ul><li>之前学习中的强劲学术表现</li><li>英语语言能力（雅思/托福）</li><li>某些项目的特定先决条件</li><li>创意艺术项目的作品集提交</li><li>个人陈述和推荐信</li></ul>',
    ranking: '#14 (2023 Times Higher Education World University Rankings)',
    founded: '1853',
    website: 'unimelb.edu.au'
  },
  5: {
    id: 5,
    name_en: 'ETH Zurich',
    name_zh: '苏黎世联邦理工学院',
    location_en: 'Zurich, Switzerland',
    location_zh: '瑞士 苏黎世',
    programs_en: 'Engineering, Computer Science, Physics, Mathematics',
    programs_zh: '工程学、计算机科学、物理学、数学',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    featured_image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    description_en: 'ETH Zurich (Swiss Federal Institute of Technology) is a public research university in Zurich, Switzerland. Founded in 1854, it is consistently ranked among the top universities in the world, especially for science and technology. ETH Zurich has produced 21 Nobel Prize laureates, including Albert Einstein.',
    description_zh: '苏黎世联邦理工学院是位于瑞士苏黎世的一所公立研究型大学。成立于1854年，它在全球大学排名中始终名列前茅，尤其在科学和技术领域。苏黎世联邦理工学院培养了21位诺贝尔奖获得者，包括阿尔伯特·爱因斯坦。',
    gallery_images: [
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1518770660439-4636190af475'
    ],
    highlights_en: '<ul><li>Consistently ranked among the top 10 universities in the world</li><li>21 Nobel Prize winners, including Albert Einstein</li><li>Strong focus on research and innovation</li><li>Beautiful historic main building in the heart of Zurich</li></ul>',
    highlights_zh: '<ul><li>始终位列全球十大顶尖大学</li><li>21位诺贝尔奖获得者，包括阿尔伯特·爱因斯坦</li><li>注重研究与创新</li><li>位于苏黎世中心的美丽历史主楼</li></ul>',
    facilities_en: '<p>ETH Zurich offers cutting-edge research facilities:</p><ul><li>State-of-the-art laboratories and research centers</li><li>One of Europe\'s most powerful supercomputers</li><li>Specialized libraries with extensive scientific collections</li><li>Modern student centers and sports facilities</li><li>Innovation and entrepreneurship hubs</li></ul>',
    facilities_zh: '<p>苏黎世联邦理工学院提供尖端研究设施：</p><ul><li>最先进的实验室和研究中心</li><li>欧洲最强大的超级计算机之一</li><li>拥有丰富科学藏品的专业图书馆</li><li>现代化的学生中心和体育设施</li><li>创新和创业中心</li></ul>',
    academics_en: '<p>ETH Zurich offers programs across multiple disciplines with strong emphasis on:</p><ul><li>Engineering Sciences</li><li>Natural Sciences and Mathematics</li><li>Architecture and Civil Engineering</li><li>Computer Science</li><li>Interdisciplinary Sciences</li><li>Management, Technology and Economics</li></ul>',
    academics_zh: '<p>苏黎世联邦理工学院提供多学科项目，重点关注：</p><ul><li>工程科学</li><li>自然科学和数学</li><li>建筑和土木工程</li><li>计算机科学</li><li>跨学科科学</li><li>管理、技术和经济学</li></ul>',
    admission_en: '<p>Admission to ETH Zurich is competitive. International students need:</p><ul><li>Excellent academic record in science and mathematics</li><li>Language proficiency (German for most Bachelor\'s programs, English for most Master\'s)</li><li>Entrance examination for some programs</li><li>Strong letters of recommendation</li><li>Research proposal for doctoral programs</li></ul>',
    admission_zh: '<p>苏黎世联邦理工学院的录取竞争激烈。国际学生需要：</p><ul><li>在科学和数学方面的优秀学术记录</li><li>语言能力（大多数本科课程需要德语，大多数硕士课程需要英语）</li><li>某些项目的入学考试</li><li>有力的推荐信</li><li>博士项目的研究计划</li></ul>',
    ranking: '#9 (2023 QS World University Rankings)',
    founded: '1854',
    website: 'ethz.ch'
  },
  6: {
    id: 6,
    name_en: 'National University of Singapore',
    name_zh: '新加坡国立大学',
    location_en: 'Singapore',
    location_zh: '新加坡',
    programs_en: 'Business Administration, Data Science, Medicine, Engineering',
    programs_zh: '工商管理、数据科学、医学、工程学',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    featured_image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    description_en: 'The National University of Singapore (NUS) is the first autonomous research university in Singapore. Founded in 1905, NUS is the oldest higher education institution in Singapore. It is consistently ranked as one of Asia\'s top universities and among the best in the world. NUS offers a global approach to education and research with a focus on Asian perspectives and expertise.',
    description_zh: '新加坡国立大学是新加坡第一所自主研究型大学。成立于1905年，是新加坡最古老的高等教育机构。它始终被评为亚洲顶尖大学之一，也是世界最好的大学之一。新加坡国立大学提供全球化的教育和研究方法，注重亚洲视角和专业知识。',
    gallery_images: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      'https://images.unsplash.com/photo-1523050854058-8f6e74349ca1',
      'https://images.unsplash.com/photo-1542542540-6da0f4dd4b51'
    ],
    highlights_en: '<ul><li>Consistently ranked #1 in Asia and among top 20 globally</li><li>Strong global partnerships with leading universities</li><li>Vibrant campus with over 40,000 students from 100 countries</li><li>Entrepreneurial ecosystem with strong industry connections</li><li>17 faculties and schools across three campuses</li></ul>',
    highlights_zh: '<ul><li>始终位居亚洲第一，全球前20名</li><li>与世界领先大学建立了强大的全球合作关系</li><li>充满活力的校园，拥有来自100多个国家的40,000多名学生</li><li>具有强大行业联系的创业生态系统</li><li>三个校区的17个学院和学校</li></ul>',
    facilities_en: '<p>NUS offers world-class facilities across its three campuses:</p><ul><li>Cutting-edge research centers and laboratories</li><li>NUS Libraries with over 2 million print and electronic resources</li><li>University Town with educational and residential spaces</li><li>State-of-the-art sports facilities</li><li>UTown Green and other recreational spaces</li></ul>',
    facilities_zh: '<p>新加坡国立大学在其三个校区提供世界级设施：</p><ul><li>尖端研究中心和实验室</li><li>国大图书馆拥有超过200万册印刷和电子资源</li><li>具有教育和住宿空间的大学城</li><li>最先进的体育设施</li><li>大学城绿地和其他休闲空间</li></ul>',
    academics_en: '<p>NUS offers comprehensive programs across disciplines including:</p><ul><li>Arts and Social Sciences</li><li>Business and Accountancy</li><li>Computing</li><li>Dentistry</li><li>Design and Environment</li><li>Engineering</li><li>Law</li><li>Medicine</li><li>Music</li><li>Science</li><li>Public Health</li><li>Public Policy</li></ul>',
    academics_zh: '<p>新加坡国立大学提供跨学科的综合项目，包括：</p><ul><li>艺术与社会科学</li><li>商业与会计</li><li>计算机</li><li>牙医</li><li>设计与环境</li><li>工程</li><li>法律</li><li>医学</li><li>音乐</li><li>科学</li><li>公共卫生</li><li>公共政策</li></ul>',
    admission_en: '<p>NUS has a competitive admission process. International students require:</p><ul><li>Excellent academic record</li><li>Strong English proficiency (IELTS/TOEFL)</li><li>SAT/ACT scores for some programs</li><li>Personal statements and references</li><li>Interviews for selected candidates</li><li>Portfolio for design and arts programs</li></ul>',
    admission_zh: '<p>新加坡国立大学有竞争激烈的录取流程。国际学生需要：</p><ul><li>优秀的学术记录</li><li>强大的英语能力（雅思/托福）</li><li>某些项目的SAT/ACT成绩</li><li>个人陈述和推荐信</li><li>部分候选人的面试</li><li>设计和艺术项目的作品集</li></ul>',
    ranking: '#11 (2023 QS World University Rankings)',
    founded: '1905',
    website: 'nus.edu.sg'
  }
};

/**
 * 返回默认大学详情的辅助函数
 */
export const getDefaultUniversityDetail = (id: number): PartnerUniversityDetail => {
  console.log(`Using default university details for ID: ${id}`);
  
  // 返回请求的ID的大学，如果不存在则返回第一个默认大学
  return defaultUniversities[id] || defaultUniversities[1];
};
