
import { Program } from "@/types/programTypes";
import { mockPrograms } from "./mockPrograms";

export const mockProgramDetails: Record<number, Program> = {
  1: {
    ...mockPrograms[0],
    description_en: `<p>Discover the art world through an intensive two-week program designed for passionate young artists. In this advanced program, students will be mentored by professional artists and educators from prestigious art institutions.</p><p>The curriculum covers various techniques and mediums, from traditional painting and drawing to digital art and mixed media.</p>`,
    description_zh: `<p>通过为热情的年轻艺术家设计的为期两周的密集项目，探索艺术世界。在这个高级项目中，学生将由来自著名艺术机构的专业艺术家和教育工作者指导。</p><p>课程涵盖各种技术和媒介，从传统绘画和素描到数字艺术和混合媒体。</p>`,
    highlights_en: `<p>Learn directly from professional artists</p><p>Create a portfolio of artwork across multiple mediums</p><p>Visit major museums and galleries</p><p>Participate in a final exhibition</p>`,
    highlights_zh: `<p>直接向专业艺术家学习</p><p>创建跨多种媒介的艺术品组合</p><p>参观主要博物馆和画廊</p><p>参加最终展览</p>`,
    itinerary_en: `<h3>Week 1</h3><ul><li><strong>Day 1-2:</strong> Introduction to art fundamentals and techniques</li><li><strong>Day 3-4:</strong> Museum visits and master studies</li><li><strong>Day 5:</strong> Digital art workshop</li></ul><h3>Week 2</h3><ul><li><strong>Day 6-7:</strong> Personal project development</li><li><strong>Day 8-9:</strong> Final artwork creation and critique</li><li><strong>Day 10:</strong> Exhibition preparation and opening</li></ul>`,
    itinerary_zh: `<h3>第一周</h3><ul><li><strong>第1-2天:</strong> 艺术基础和技巧介绍</li><li><strong>第3-4天:</strong> 博物馆参观和大师研究</li><li><strong>第5天:</strong> 数字艺术工作坊</li></ul><h3>第二周</h3><ul><li><strong>第6-7天:</strong> 个人项目开发</li><li><strong>第8-9天:</strong> 最终艺术品创作和评论</li><li><strong>第10天:</strong> 展览准备和开幕</li></ul>`,
    features_en: `<p>This program focuses on developing technical skills while encouraging creative expression and critical thinking. Features include:</p><ul><li>Small class sizes (max 15 students)</li><li>All materials provided</li><li>Studio access outside of class hours</li><li>Professional documentation of final works</li></ul>`,
    features_zh: `<p>该项目专注于发展技术技能，同时鼓励创意表达和批判性思维。特点包括：</p><ul><li>小班教学（最多15名学生）</li><li>提供所有材料</li><li>课外时间可使用工作室</li><li>最终作品的专业记录</li></ul>`,
    information_en: `<h3>Additional Information</h3><ul><li><strong>Accommodation:</strong> Dormitory housing available</li><li><strong>Meals:</strong> Breakfast and lunch included</li><li><strong>Prerequisites:</strong> Basic drawing skills recommended</li><li><strong>What to bring:</strong> Personal sketchbook, comfortable clothes</li></ul>`,
    information_zh: `<h3>附加信息</h3><ul><li><strong>住宿:</strong> 提供宿舍住宿</li><li><strong>餐饮:</strong> 包含早餐和午餐</li><li><strong>先决条件:</strong> 建议具备基本绘画技能</li><li><strong>需要带什么:</strong> 个人素描本，舒适的衣服</li></ul>`,
    price: "$2,995",
    gallery_images: [
      "/lovable-uploads/46fca3c1-4f18-4f48-935c-a97e8bb6eeb8.png",
      "/lovable-uploads/baa8050a-2b39-4cf4-8add-603763b1c755.png",
      "/lovable-uploads/f0b87c9a-14ef-4e95-ae65-07fe4018b1fc.png"
    ]
  },
  2: {
    ...mockPrograms[1],
    description_en: `<p>The UC Berkeley STEM Innovation Program is a dynamic two-week experience designed to immerse students in cutting-edge science, technology, engineering, and mathematics.</p><p>Working alongside Berkeley professors and graduate students, participants engage in hands-on laboratory experiences, innovative research projects, and collaborative problem-solving challenges.</p>`,
    description_zh: `<p>加州大学伯克利分校STEM创新项目是一个为期两周的动态体验，旨在让学生沉浸在尖端科学、技术、工程和数学中。</p><p>与伯克利教授和研究生一起工作，参与者将参与动手实验室体验、创新研究项目和协作解决问题的挑战。</p>`,
    highlights_en: `<p>Work in state-of-the-art laboratories at UC Berkeley</p><p>Design and conduct original research experiments</p><p>Learn from world-class faculty and researchers</p><p>Present findings at a culminating research symposium</p>`,
    highlights_zh: `<p>在加州大学伯克利分校的最先进实验室工作</p><p>设计和进行原创研究实验</p><p>向世界级教师和研究人员学习</p><p>在最后的研究座谈会上展示研究成果</p>`,
    itinerary_en: `<h3>Week 1</h3><ul><li><strong>Day 1:</strong> Campus orientation and introduction to research methodologies</li><li><strong>Day 2-3:</strong> Laboratory rotations across STEM disciplines</li><li><strong>Day 4-5:</strong> Team project selection and initial research</li></ul><h3>Week 2</h3><ul><li><strong>Day 6-8:</strong> Focused research and experimentation</li><li><strong>Day 9:</strong> Data analysis and presentation preparation</li><li><strong>Day 10:</strong> Research symposium and closing ceremony</li></ul>`,
    itinerary_zh: `<h3>第一周</h3><ul><li><strong>第1天:</strong> 校园导览和研究方法介绍</li><li><strong>第2-3天:</strong> 跨STEM学科的实验室轮换</li><li><strong>第4-5天:</strong> 团队项目选择和初步研究</li></ul><h3>第二周</h3><ul><li><strong>第6-8天:</strong> 专注研究和实验</li><li><strong>第9天:</strong> 数据分析和演示准备</li><li><strong>第10天:</strong> 研究座谈会和闭幕式</li></ul>`,
    features_en: `<p>This intensive program provides a genuine university research experience with these key features:</p><ul><li>4:1 student to instructor ratio</li><li>Access to university computing resources and libraries</li><li>Guest lectures from industry leaders</li><li>College admissions workshop</li></ul>`,
    features_zh: `<p>这个密集的项目提供了真正的大学研究体验，具有以下关键特点：</p><ul><li>4:1的学生与导师比例</li><li>访问大学计算资源和图书馆</li><li>行业领导者的客座讲座</li><li>大学申请研讨会</li></ul>`,
    information_en: `<h3>Additional Information</h3><ul><li><strong>Accommodation:</strong> University dormitories</li><li><strong>Meals:</strong> Full meal plan included</li><li><strong>Prerequisites:</strong> Completion of algebra II and at least one lab science</li><li><strong>Materials:</strong> Laptop required, other materials provided</li></ul>`,
    information_zh: `<h3>附加信息</h3><ul><li><strong>住宿:</strong> 大学宿舍</li><li><strong>餐饮:</strong> 包含全套餐计划</li><li><strong>先决条件:</strong> 完成代数II和至少一门实验科学</li><li><strong>材料:</strong> 需要笔记本电脑，其他材料提供</li></ul>`,
    price: "$3,450",
    gallery_images: [
      "/lovable-uploads/023aa03a-5bbe-40b1-b72a-85dd082c5c50.png",
      "/lovable-uploads/8938e5c0-ccf2-466d-b9f3-c7e3c0f599ff.png"
    ]
  },
  3: {
    ...mockPrograms[2],
    description_en: `<p>Immerse yourself in London's rich cultural landscape through our Ethics, Arts and Cultural Exploration program. This three-week journey combines academic inquiry with experiential learning across London's museums, theaters, and historical sites.</p><p>Students explore ethical dimensions of art and cultural heritage while developing critical thinking and analytical skills.</p>`,
    description_zh: `<p>通过我们的伦敦艺术与文化探索项目，沉浸在伦敦丰富的文化景观中。这个为期三周的旅程将学术探究与伦敦博物馆、剧院和历史遗址的体验式学习相结合。</p><p>学生探索艺术和文化遗产的道德维度，同时发展批判性思维和分析技能。</p>`,
    highlights_en: `<p>Learn from leading professors and arts professionals</p><p>Attend performances at West End theaters</p><p>Behind-the-scenes tours of major cultural institutions</p><p>Engage in philosophical debates on ethics in art</p>`,
    highlights_zh: `<p>向领先的教授和艺术专业人士学习</p><p>在西区剧院观看表演</p><p>主要文化机构的幕后参观</p><p>参与关于艺术道德的哲学辩论</p>`,
    itinerary_en: `<h3>Week 1: Cultural Foundations</h3><ul><li><strong>Day 1-2:</strong> Program introduction and the British Museum</li><li><strong>Day 3-4:</strong> Ethics of cultural heritage and the Victoria & Albert Museum</li><li><strong>Day 5-7:</strong> Art and society at the Tate Modern and National Gallery</li></ul><h3>Week 2: Performance and Expression</h3><ul><li><strong>Day 8-10:</strong> Theater studies and West End performances</li><li><strong>Day 11-14:</strong> Music, sound, and cultural identity</li></ul><h3>Week 3: Synthesis and Creation</h3><ul><li><strong>Day 15-20:</strong> Independent research, cultural projects, and presentations</li><li><strong>Day 21:</strong> Closing symposium</li></ul>`,
    itinerary_zh: `<h3>第一周：文化基础</h3><ul><li><strong>第1-2天:</strong> 项目介绍和大英博物馆</li><li><strong>第3-4天:</strong> 文化遗产的伦理和维多利亚与阿尔伯特博物馆</li><li><strong>第5-7天:</strong> 泰特现代美术馆和国家美术馆的艺术与社会</li></ul><h3>第二周：表演和表达</h3><ul><li><strong>第8-10天:</strong> 戏剧研究和西区表演</li><li><strong>第11-14天:</strong> 音乐、声音和文化身份</li></ul><h3>第三周：综合与创作</h3><ul><li><strong>第15-20天:</strong> 独立研究、文化项目和演讲</li><li><strong>第21天:</strong> 闭幕座谈会</li></ul>`,
    features_en: `<p>Our unique program offers a blend of academic and experiential learning:</p><ul><li>Daily seminars and discussions</li><li>Cultural excursions throughout London</li><li>Weekend day trips to Oxford and Stratford-upon-Avon</li><li>Final project with personalized mentoring</li></ul>`,
    features_zh: `<p>我们独特的项目提供学术和体验式学习的结合：</p><ul><li>每日研讨会和讨论</li><li>伦敦各地的文化游览</li><li>周末前往牛津和斯特拉特福德-厄普顿-埃文的一日游</li><li>具有个性化指导的最终项目</li></ul>`,
    information_en: `<h3>Additional Information</h3><ul><li><strong>Accommodation:</strong> Central London student residence</li><li><strong>Meals:</strong> Breakfast daily, plus select group dinners</li><li><strong>Transportation:</strong> Oyster card for zones 1-2 included</li><li><strong>Academic Credit:</strong> Optional college credit available</li></ul>`,
    information_zh: `<h3>附加信息</h3><ul><li><strong>住宿:</strong> 伦敦中心学生公寓</li><li><strong>餐饮:</strong> 每日早餐，加选定的团体晚餐</li><li><strong>交通:</strong> 包含1-2区的牡蛎卡</li><li><strong>学分:</strong> 可选择获得大学学分</li></ul>`,
    price: "£4,750",
    gallery_images: [
      "/lovable-uploads/095982ef-a87c-40ba-a4fe-d4d95ab84dae.png",
      "/lovable-uploads/871521cd-c1f5-450c-9de9-af23b940745e.png",
      "/lovable-uploads/b2a3078e-ac86-4de7-a527-680ca1fcfe69.png"
    ]
  },
  4: {
    ...mockPrograms[3],
    description_en: `<p>Dive into the fascinating world of marine biology on Australia's stunning Great Barrier Reef. This hands-on program combines scientific research with conservation efforts in one of the world's most diverse marine ecosystems.</p><p>Students work alongside marine biologists to study coral reef ecology, conduct underwater surveys, and contribute to ongoing conservation projects.</p>`,
    description_zh: `<p>在澳大利亚壮观的大堡礁潜入迷人的海洋生物世界。这个实践项目将科学研究与保护工作相结合，在世界上最多样化的海洋生态系统之一中进行。</p><p>学生与海洋生物学家一起研究珊瑚礁生态学，进行水下调查，并参与正在进行的保护项目。</p>`,
    highlights_en: `<p>Daily snorkeling and PADI-certified scuba diving (optional)</p><p>Marine species identification and behavior observation</p><p>Coral reef health assessment techniques</p><p>Climate change impact studies</p>`,
    highlights_zh: `<p>每日浮潜和PADI认证的水肺潜水（可选）</p><p>海洋物种识别和行为观察</p><p>珊瑚礁健康评估技术</p><p>气候变化影响研究</p>`,
    itinerary_en: `<h3>Week 1: Marine Biology Fundamentals</h3><ul><li><strong>Day 1-2:</strong> Program orientation and introduction to marine ecosystems</li><li><strong>Day 3-4:</strong> Snorkeling techniques and initial reef surveys</li><li><strong>Day 5-7:</strong> Fish and invertebrate identification</li></ul><h3>Week 2: Research and Conservation</h3><ul><li><strong>Day 8-10:</strong> Coral health assessment and data collection</li><li><strong>Day 11-13:</strong> Conservation project participation</li><li><strong>Day 14:</strong> Data analysis and research presentation</li></ul>`,
    itinerary_zh: `<h3>第一周：海洋生物学基础</h3><ul><li><strong>第1-2天:</strong> 项目指导和海洋生态系统介绍</li><li><strong>第3-4天:</strong> 浮潜技术和初步礁石调查</li><li><strong>第5-7天:</strong> 鱼类和无脊椎动物识别</li></ul><h3>第二周：研究与保护</h3><ul><li><strong>第8-10天:</strong> 珊瑚健康评估和数据收集</li><li><strong>第11-13天:</strong> 参与保护项目</li><li><strong>第14天:</strong> 数据分析和研究报告</li></ul>`,
    features_en: `<p>This immersive program offers unique experiences:</p><ul><li>Accommodation at a marine research station</li><li>Small group instruction (maximum 12 students)</li><li>Evening lectures by guest researchers</li><li>Contribution to real scientific data collection</li></ul>`,
    features_zh: `<p>这个沉浸式项目提供独特的体验：</p><ul><li>海洋研究站住宿</li><li>小组指导（最多12名学生）</li><li>客座研究员的晚间讲座</li><li>对真实科学数据收集的贡献</li></ul>`,
    information_en: `<h3>Additional Information</h3><ul><li><strong>Location:</strong> Cairns and Great Barrier Reef, Queensland</li><li><strong>Meals:</strong> All meals included</li><li><strong>Equipment:</strong> Snorkeling gear provided (own wetsuit recommended)</li><li><strong>Prerequisites:</strong> Basic swimming ability required, previous biology coursework recommended</li></ul>`,
    information_zh: `<h3>附加信息</h3><ul><li><strong>位置:</strong> 昆士兰凯恩斯和大堡礁</li><li><strong>餐饮:</strong> 包含所有餐食</li><li><strong>设备:</strong> 提供浮潜装备（建议自备潜水服）</li><li><strong>先决条件:</strong> 需要基本游泳能力，建议有生物学课程背景</li></ul>`,
    price: "AUD 5,250",
    gallery_images: [
      "/lovable-uploads/8938e5c0-ccf2-466d-b9f3-c7e3c0f599ff.png",
      "/lovable-uploads/f0b87c9a-14ef-4e95-ae65-07fe4018b1fc.png"
    ]
  },
  5: {
    ...mockPrograms[4],
    description_en: `<p>Experience the future through Tokyo's cutting-edge technology scene. This program takes students through Japan's most innovative technology companies, research institutions, and cultural landmarks that showcase the intersection of tradition and innovation.</p><p>Participants explore robotics, artificial intelligence, sustainable technology, and the unique Japanese approach to technological advancement.</p>`,
    description_zh: `<p>通过东京尖端的科技场景体验未来。该项目带领学生参观日本最具创新性的科技公司、研究机构以及展示传统与创新交叉的文化地标。</p><p>参与者探索机器人技术、人工智能、可持续技术以及日本独特的技术进步方法。</p>`,
    highlights_en: `<p>Visits to leading technology companies like Sony and Honda</p><p>Robotics workshops and programming sessions</p><p>Exploration of AI and machine learning applications</p><p>Discussions with tech entrepreneurs and researchers</p>`,
    highlights_zh: `<p>参观索尼和本田等领先科技公司</p><p>机器人工作坊和编程会议</p><p>探索人工智能和机器学习应用</p><p>与科技企业家和研究人员讨论</p>`,
    itinerary_en: `<h3>Week 1: The Japanese Technology Landscape</h3><ul><li><strong>Day 1-2:</strong> Arrival, orientation, and Tokyo overview</li><li><strong>Day 3:</strong> Sony Technology Lab and innovation center</li><li><strong>Day 4:</strong> National Museum of Emerging Science and Innovation</li><li><strong>Day 5:</strong> ASIMO and robotics at Honda Research Institute</li><li><strong>Day 6-7:</strong> Traditional technology and cultural connections</li></ul><h3>Week 2: Future Technology and Applications</h3><ul><li><strong>Day 8-9:</strong> AI and machine learning workshops</li><li><strong>Day 10:</strong> Sustainable technology initiatives</li><li><strong>Day 11:</strong> Gaming and entertainment technology</li><li><strong>Day 12-13:</strong> Team innovation project</li><li><strong>Day 14:</strong> Project presentations and closing ceremony</li></ul>`,
    itinerary_zh: `<h3>第一周：日本技术景观</h3><ul><li><strong>第1-2天:</strong> 抵达、迎新和东京概览</li><li><strong>第3天:</strong> 索尼技术实验室和创新中心</li><li><strong>第4天:</strong> 国家新兴科学与创新博物馆</li><li><strong>第5天:</strong> 本田研究所的ASIMO和机器人技术</li><li><strong>第6-7天:</strong> 传统技术和文化联系</li></ul><h3>第二周：未来技术与应用</h3><ul><li><strong>第8-9天:</strong> 人工智能和机器学习工作坊</li><li><strong>第10天:</strong> 可持续技术倡议</li><li><strong>第11天:</strong> 游戏和娱乐技术</li><li><strong>第12-13天:</strong> 团队创新项目</li><li><strong>第14天:</strong> 项目演示和闭幕式</li></ul>`,
    features_en: `<p>Our program offers a unique blend of technical learning and cultural immersion:</p><ul><li>Hands-on workshops and lab experiences</li><li>Industry expert presentations and Q&A sessions</li><li>Japanese language and culture primers</li><li>Group technology challenge with mentorship</li></ul>`,
    features_zh: `<p>我们的项目提供技术学习和文化沉浸的独特融合：</p><ul><li>实践工作坊和实验室体验</li><li>行业专家演讲和问答环节</li><li>日语和文化入门</li><li>有导师指导的团队技术挑战</li></ul>`,
    information_en: `<h3>Additional Information</h3><ul><li><strong>Accommodation:</strong> Tokyo university dormitory</li><li><strong>Meals:</strong> Breakfast included, plus welcome and farewell dinners</li><li><strong>Transportation:</strong> Public transportation passes included</li><li><strong>Prerequisites:</strong> Interest in technology, no specific technical skills required</li></ul>`,
    information_zh: `<h3>附加信息</h3><ul><li><strong>住宿:</strong> 东京大学宿舍</li><li><strong>餐饮:</strong> 包含早餐，加欢迎和告别晚宴</li><li><strong>交通:</strong> 包含公共交通通行证</li><li><strong>先决条件:</strong> 对技术有兴趣，不需要特定的技术技能</li></ul>`,
    price: "¥395,000",
    gallery_images: [
      "/lovable-uploads/016e6197-438b-4fe1-9650-ddabcb0eb8db.png",
      "/lovable-uploads/023aa03a-5bbe-40b1-b72a-85dd082c5c50.png"
    ]
  },
  6: {
    ...mockPrograms[5],
    description_en: `<p>Immerse yourself in the artistic heritage of Paris while exploring architectural marvels from classical to contemporary. This program combines studio art practice with architectural studies and art history against the backdrop of one of the world's most beautiful cities.</p><p>Students develop visual literacy, design thinking, and creative skills through hands-on workshops and guided explorations of Paris's renowned museums, monuments, and neighborhoods.</p>`,
    description_zh: `<p>沉浸在巴黎的艺术遗产中，同时探索从古典到当代的建筑奇迹。该项目将工作室艺术实践与建筑研究和艺术史相结合，以世界上最美丽的城市之一为背景。</p><p>学生通过实践工作坊和巴黎著名博物馆、纪念碑和街区的引导探索，发展视觉素养、设计思维和创造性技能。</p>`,
    highlights_en: `<p>Sketch sessions at iconic Parisian landmarks</p><p>Architectural walking tours spanning multiple eras</p><p>Private access to select museum collections</p><p>Studio workshops with French artists and architects</p>`,
    highlights_zh: `<p>在巴黎标志性地标的素描课程</p><p>跨越多个时代的建筑步行之旅</p><p>私人参观精选博物馆收藏</p><p>与法国艺术家和建筑师的工作室工作坊</p>`,
    itinerary_en: `<h3>Week 1: Classical Foundations</h3><ul><li><strong>Day 1-2:</strong> Orientation and introduction to Parisian art history</li><li><strong>Day 3:</strong> Louvre Museum and classical traditions</li><li><strong>Day 4:</strong> Gothic architecture and Notre-Dame Cathedral</li><li><strong>Day 5:</strong> Palace of Versailles and Baroque design</li><li><strong>Day 6-7:</strong> Studio practice and sketching sessions</li></ul><h3>Week 2: Modern Expressions</h3><ul><li><strong>Day 8:</strong> Impressionism at Musée d'Orsay</li><li><strong>Day 9:</strong> Centre Pompidou and contemporary art</li><li><strong>Day 10:</strong> Modern architecture walking tour</li><li><strong>Day 11-12:</strong> Personal project development</li><li><strong>Day 13-14:</strong> Final project presentation and exhibition</li></ul>`,
    itinerary_zh: `<h3>第一周：古典基础</h3><ul><li><strong>第1-2天:</strong> 迎新和巴黎艺术史介绍</li><li><strong>第3天:</strong> 卢浮宫博物馆和古典传统</li><li><strong>第4天:</strong> 哥特式建筑和巴黎圣母院</li><li><strong>第5天:</strong> 凡尔赛宫和巴洛克设计</li><li><strong>第6-7天:</strong> 工作室实践和素描课程</li></ul><h3>第二周：现代表达</h3><ul><li><strong>第8天:</strong> 奥赛博物馆的印象派</li><li><strong>第9天:</strong> 蓬皮杜中心和当代艺术</li><li><strong>第10天:</strong> 现代建筑步行之旅</li><li><strong>第11-12天:</strong> 个人项目开发</li><li><strong>第13-14天:</strong> 最终项目演示和展览</li></ul>`,
    features_en: `<p>This program balances academic learning with artistic practice:</p><ul><li>Daily art history and theory sessions</li><li>Professional-grade art supplies provided</li><li>Sketchbook journal development</li><li>Digital portfolio creation</li></ul>`,
    features_zh: `<p>该项目平衡学术学习与艺术实践：</p><ul><li>每日艺术历史和理论课程</li><li>提供专业级艺术用品</li><li>素描本日记开发</li><li>数字作品集创建</li></ul>`,
    information_en: `<h3>Additional Information</h3><ul><li><strong>Accommodation:</strong> Student residences in central Paris</li><li><strong>Meals:</strong> Daily breakfast and three group dinners</li><li><strong>Materials:</strong> All art supplies and museum entries included</li><li><strong>Prerequisites:</strong> No prior art experience required, but enthusiasm for art and architecture essential</li></ul>`,
    information_zh: `<h3>附加信息</h3><ul><li><strong>住宿:</strong> 巴黎中心学生公寓</li><li><strong>餐饮:</strong> 每日早餐和三次团体晚餐</li><li><strong>材料:</strong> 包含所有艺术用品和博物馆门票</li><li><strong>先决条件:</strong> 不需要之前的艺术经验，但对艺术和建筑的热情是必不可少的</li></ul>`,
    price: "€3,890",
    gallery_images: [
      "/lovable-uploads/871521cd-c1f5-450c-9de9-af23b940745e.png",
      "/lovable-uploads/b2a3078e-ac86-4de7-a527-680ca1fcfe69.png",
      "/lovable-uploads/095982ef-a87c-40ba-a4fe-d4d95ab84dae.png"
    ]
  }
};
