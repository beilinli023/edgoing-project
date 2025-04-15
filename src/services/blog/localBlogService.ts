import { BlogPost, BlogCategory, BlogTag, BlogContent, BlogVideo, BlogHero } from '@/types/blogTypes';

/**
 * 获取本地博客文章列表
 * 当API请求失败时作为备选数据源
 */
export const getLocalBlogPosts = async (page = 1, limit = 10, categoryId?: string, tagId?: string): Promise<{ posts: BlogPost[], total: number }> => {
  try {
    let posts = await loadAllPosts();
    
    // 如果提供了分类ID，过滤文章
    if (categoryId) {
      posts = posts.filter(post => {
        const category = post.category;
        return typeof category === 'object' && category !== null && category.id === categoryId;
      });
    }
    
    // 如果提供了标签ID，过滤文章
    if (tagId) {
      posts = posts.filter(post => 
        post.tags && post.tags.some(tag => 
          typeof tag === 'object' && tag !== null && tag.id === tagId
        )
      );
    }
    
    // 计算分页
    const total = posts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    
    return { posts: paginatedPosts, total };
  } catch (error) {
    console.error('Error fetching local blog posts:', error);
    return { posts: [], total: 0 };
  }
};

/**
 * 通过slug获取本地博客文章
 */
export const getLocalBlogPostBySlug = async (slug: string, language = 'en'): Promise<BlogPost | null> => {
  try {
    console.log(`尝试获取slug为${slug}的博客文章，语言：${language}`);
    
    // 特殊处理："us-language-camp" 文章的硬编码处理
    if (slug === 'us-language-camp' || slug === '4') {
      console.log("使用特殊处理加载 US Language Camp 文章");
      try {
        // 1. 先检查文件是否可以访问
        await testBlog4JsonExists();
        
        // 2. 尝试多个可能的路径
        const possibleUrls = [
          `/content/blog/blog4.json?_t=${Date.now()}`,
          `/blog4.json?_t=${Date.now()}`,
          `/public/content/blog/blog4.json?_t=${Date.now()}`,
          `/us-language-camp-backup.json?_t=${Date.now()}` // 添加备份文件路径
        ];
        
        let data = null;
        let response = null;
        
        // 3. 逐个尝试路径
        for (const url of possibleUrls) {
          try {
            console.log(`尝试从路径加载: ${url}`);
            response = await fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              },
              cache: 'no-store'
            });
            
            if (response.ok) {
              console.log(`成功从 ${url} 加载响应`);
              try {
                data = await response.json();
                if (data && (data.post || data.id === 4 || data.slug === 'us-language-camp')) {
                  console.log("成功解析JSON数据:", data);
                  break; // 找到有效数据，跳出循环
                } else {
                  console.log("加载的JSON不包含有效博客数据:", data);
                }
              } catch (jsonError) {
                console.error(`解析 ${url} 的JSON响应失败:`, jsonError);
                const text = await response.text();
                console.log(`原始响应文本前200字符: ${text.substring(0, 200)}`);
              }
            } else {
              console.log(`从 ${url} 加载失败: ${response.status}`);
            }
          } catch (urlError) {
            console.error(`尝试 ${url} 时出错:`, urlError);
          }
        }
        
        // 4. 处理数据
        if (data && data.post) {
          console.log("✅ 成功通过特殊处理加载 US Language Camp 文章");
          const post = data.post;
          return {
            ...post,
            title: language === 'en' ? post.title_en : post.title_zh,
            content: language === 'en' ? post.content_en : post.content_zh
          };
        } else if (data && (data.id === 4 || data.slug === 'us-language-camp')) {
          // 直接格式的数据
          console.log("✅ 成功通过特殊处理加载 US Language Camp 文章 (直接格式)");
          return {
            ...data,
            title: language === 'en' ? data.title_en : data.title_zh,
            content: language === 'en' ? data.content_en : data.content_zh
          };
        }
        
        // 5. 如果所有尝试都失败，回退到硬编码数据
        console.log("所有URL尝试失败，使用硬编码博客数据");
        return getHardcodedBlog4();
      } catch (error) {
        console.error("特殊处理加载blog4.json失败:", error);
        // 回退到硬编码数据
        console.log("加载失败，使用硬编码博客数据");
        return getHardcodedBlog4();
      }
    }
    
    // 加载所有博客文章
    const posts = await loadAllPosts();
    console.log(`已加载 ${posts.length} 篇博客文章，正在查找：${slug}`);
    
    // 打印所有文章的 slug 以便调试
    posts.forEach((post, index) => {
      console.log(`博客 ${index + 1}: id=${post.id}, slug=${post.slug}`);
    });
    
    // 尝试查找匹配的文章 - 改进匹配逻辑，确保slug比较是不区分大小写的
    const post = posts.find(post => 
      (post.slug && post.slug.toLowerCase() === slug.toLowerCase()) || 
      post.id.toString() === slug
    );
    
    if (!post) {
      console.error(`未找到slug/id为${slug}的博客文章`);
      return null;
    }
    
    // 根据语言选择返回相应的内容
    const localizedPost = {
      ...post,
      title: language === 'en' ? post.title_en : post.title_zh,
      content: language === 'en' ? post.content_en : post.content_zh
    };
    
    console.log(`成功加载博客文章: ${localizedPost.title}`, localizedPost);
    return localizedPost;
  } catch (error) {
    console.error('获取本地博客文章失败:', error);
    
    // 对特定博客使用硬编码回退
    if (slug === 'us-language-camp' || slug === '4') {
      console.log("使用硬编码数据作为最终回退");
      return getHardcodedBlog4();
    }
    
    return null;
  }
};

/**
 * 测试 blog4.json 是否可访问
 */
export const testBlog4JsonExists = async (): Promise<boolean> => {
  try {
    // 测试多个可能的路径
    const testUrls = [
      '/content/blog/blog4.json',
      '/blog4.json',
      '/public/content/blog/blog4.json'
    ];
    
    console.log("测试 blog4.json 是否可访问...");
    
    for (const url of testUrls) {
      try {
        const response = await fetch(`${url}?_t=${Date.now()}`, {
          method: 'HEAD', // 只检查头信息，不下载内容
          cache: 'no-store'
        });
        
        console.log(`测试 ${url}: ${response.status} ${response.ok ? '成功' : '失败'}`);
        
        if (response.ok) {
          return true;
        }
      } catch (e) {
        console.log(`测试 ${url} 时出错:`, e);
      }
    }
    
    return false;
  } catch (error) {
    console.error("测试 blog4.json 可访问性时出错:", error);
    return false;
  }
};

/**
 * 获取硬编码的 blog4 数据作为最终回退
 */
const getHardcodedBlog4 = (): BlogPost => {
  console.log("生成硬编码的博客4数据");
  return {
    id: 4,
    title_en: "US Language Camp: Learning, Friends, and Fun!",
    title_zh: "美国语言夏令营：学习、友谊与乐趣！",
    slug: "us-language-camp",
    content_en: "I had an amazing time at the camp! The camp canteen served buffet-style meals, so I could try everything—pasta, salads, burgers, and desserts! It was a delicious way to experience American food.\n\nWe also went on exciting trips, like visiting MIT and its museum, where I saw futuristic technology that blew my mind. Another trip was to Plymouth, where we learned about American history. It was so interesting!\n\nIn the next few days, I attended a seminar called \"How to Choose the Right School,\" which helped me think about my future. I also got tips for the TOEFL and SAT exams, which will help me stand out when applying to schools. The teachers were super supportive, and I feel much more confident speaking English now.\n\nEvenings were the best part! We had karaoke nights where we sang our favorite songs, disco parties where we danced nonstop, and movie nights where we watched films together. My favorite was the Hawaiian dance party. There was also a cultural showcase, where we shared traditions from our countries. It was so cool to learn about different cultures.\n\nThis camp taught me so much more than English. I learned how to write a strong resume and essay for college applications. I even got to talk to university admissions counselors, who gave me great advice. But the best part was making friends from all over the world. We've already promised to stay in touch! This camp was one of the best experiences of my life.",
    content_zh: "我在夏令营度过了非常愉快的时光！夏令营的食堂提供自助餐，所以我可以尝试各种美食——意大利面、沙拉、汉堡和甜点！这是体验美国美食的美味方式。\n\n我们还参加了一些令人兴奋的旅行，比如参观了麻省理工学院及其博物馆，那里的未来科技让我大开眼界。另一次旅行是去普利茅斯，我们在那里了解了美国历史，非常有趣！\n\n接下来的几天，我参加了一个名为如何选择合适学校的讲座，这让我对未来有了更多的思考。我还获得了关于托福和SAT考试的技巧，这些将帮助我在申请学校时脱颖而出。老师们非常支持我，现在我对说英语更有信心了。\n\n晚上的活动是最棒的！我们有卡拉OK之夜，可以唱我们最喜欢的歌曲；还有迪斯科舞会，大家跳个不停；还有电影之夜，我们一起看电影。我最喜欢的是夏威夷舞会。还有文化展示，我们分享了各自国家的传统，了解不同文化真是太酷了。\n\n这次夏令营教会我的不仅仅是英语。我学会了如何为大学申请写一份出色的简历和论文。我甚至有机会与大学招生顾问交流，他们给了我很多宝贵的建议。但最棒的是，我结交了来自世界各地的朋友，我们已经约定要保持联系！这次夏令营是我一生中最美好的经历之一。",
    featured_image: "/Edgoing/Blog_Page/blog4-1.jpg",
    carousel_images: [
      "/Edgoing/Blog_Page/blog4-1.jpg",
      "/Edgoing/Blog_Page/blog4-2.jpg"
    ],
    status: "published",
    published_at: "2024-08-24T08:00:00Z",
    author_en: "Leo",
    author_zh: "Leo",
    date: "2024-08-24",
    grade_en: "Grade 11",
    grade_zh: "高二",
    project_type_en: "US MIT",
    project_type_zh: "US MIT",
    excerpt_en: "Join me on my unforgettable journey at the US Language Camp! From delicious American food to exciting trips to MIT.",
    excerpt_zh: "跟随我一起体验难忘的美国语言夏令营之旅！从美味的美国美食到令人兴奋的麻省理工学院之行。",
    title: "", // 这将在函数中根据语言设置
    content: "", // 这将在函数中根据语言设置
    // 添加必要的类型信息
    category: {
      id: "1",
      name_en: "Study Abroad",
      name_zh: "海外学习",
      slug: "study-abroad"
    },
    tags: [
      {
        id: "1",
        name_en: "Language Camp",
        name_zh: "语言夏令营",
        slug: "language-camp"
      },
      {
        id: "2",
        name_en: "MIT",
        name_zh: "麻省理工",
        slug: "mit"
      }
    ],
    // 添加缺失的属性以满足 BlogPost 类型要求
    author: "Leo"
  };
};

/**
 * 获取本地博客分类
 */
export const getLocalBlogCategories = async (): Promise<BlogCategory[]> => {
  // 已删除 - 不再需要获取博客分类数据
  console.log('博客分类数据已不再需要');
  return [];
};

/**
 * 获取本地博客标签
 */
export const getLocalBlogTags = async (): Promise<BlogTag[]> => {
  // 已删除 - 不再需要获取博客标签数据
  console.log('博客标签数据已不再需要');
  return [];
};

/**
 * 获取本地博客页面设置
 */
export const getLocalBlogPageSettings = async (): Promise<BlogContent> => {
  try {
    // 加载博客页面设置
    const url = `/content/blog/index.json`;
    console.log('获取博客页面设置:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('获取博客页面设置失败:', response.status, response.statusText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('成功获取博客页面设置');
    
    // 加载博客文章
    const { posts } = await getLocalBlogPosts();
    
    // 加载视频
    const videos = await getLocalBlogVideos();
    
    const hero: BlogHero = {
      title_en: 'Blog',
      title_zh: '博客',
      subtitle_en: 'Latest News and Updates',
      subtitle_zh: '最新动态和更新',
      background_image: '/Edgoing/Blog_Page/Heading1.jpg'
    };
    
    return {
      hero: data.hero || hero,
      posts,
      videos
    };
  } catch (error) {
    console.error('Error fetching local blog page settings:', error);
    
    // 返回默认值
    const defaultHero: BlogHero = {
      title_en: 'Blog',
      title_zh: '博客',
      subtitle_en: 'Latest News and Updates',
      subtitle_zh: '最新动态和更新',
      background_image: '/Edgoing/Blog_Page/Heading1.jpg'
    };
    
    return {
      hero: defaultHero,
      posts: [],
      videos: []
    };
  }
};

/**
 * 获取本地博客视频
 */
export const getLocalBlogVideos = async (): Promise<BlogVideo[]> => {
  // 硬编码视频数据，因为没有本地视频数据文件
  const videos: BlogVideo[] = [
    {
      id: '1',
      title_en: 'Introduction to Our Programs',
      title_zh: '我们项目的介绍',
      youtube_url: '',
      thumbnail: '/Edgoing/video/thumbnails/video1.jpg',
      file_url: '/Edgoing/video/162.mp4'
    },
    {
      id: '2',
      title_en: 'Cultural Exchange Program',
      title_zh: '文化交流项目',
      youtube_url: '',
      thumbnail: '/Edgoing/video/thumbnails/video2.jpg',
      file_url: '/Edgoing/video/164.mp4'
    }
  ];
  
  return videos;
};

/**
 * 辅助函数：加载所有博客文章
 * @returns 所有博客文章的数组
 */
async function loadAllPosts(): Promise<BlogPost[]> {
  try {
    // 先从index.json加载博客文章引用列表
    console.log('尝试加载博客文章索引文件: /content/blog/index.json');
    
    // 加载索引文件
    const url = `/content/blog/index.json?_t=${Date.now()}`;
    console.log('获取博客文章索引文件:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('加载博客索引失败:', response.status, response.statusText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const indexData = await response.json();
    console.log('成功加载博客索引文件', indexData);
    
    // 确保索引文件包含posts数组
    if (!indexData.posts || !Array.isArray(indexData.posts)) {
      console.error('博客索引文件格式错误，缺少posts数组:', indexData);
      return [];
    }
    
    // 读取文件列表
    console.log('从索引中读取到的博客文章文件列表:', indexData.posts);
    
    // 手动定义文章列表进行回退
    const fallbackPosts = [
      '/content/blog/blog1.json',
      '/content/blog/blog2.json',
      '/content/blog/blog3.json',
      '/content/blog/blog4.json',
      '/content/blog/blog5.json',
    ];
    
    // 使用索引中的文件列表，如果为空则使用回退列表
    const postFiles = indexData.posts.length > 0 ? indexData.posts : fallbackPosts;
    console.log('最终使用的博客文章文件列表:', postFiles);
    
    const postsPromises = postFiles.map(async (file, index) => {
      try {
        // 确保使用正确的路径格式
        const fullPath = file.startsWith('/') ? file : `/content/blog/${file}`;
        const url = `${fullPath}?_t=${Date.now()}`;
        console.log(`尝试加载文章 ${index + 1}:`, url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          console.error(`加载文章失败: ${url}`, response.status, response.statusText);
          return null;
        }
        
        let postData;
        try {
          postData = await response.json();
        } catch (jsonError) {
          console.error(`解析JSON数据失败: ${url}`, jsonError);
          const textData = await response.text();
          console.log(`原始文本数据: ${textData.substring(0, 200)}...`);
          return null;
        }
        
        // 确保数据结构正确
        if (!postData) {
          console.error(`文章数据为空: ${url}`);
          return null;
        }
        
        // 确保正确处理数据结构，允许直接的post或者包装在post字段中的数据
        const postContent = postData.post || postData;
        
        if (!postContent || (!postContent.title_en && !postContent.title_zh)) {
          console.error(`文章数据结构无效: ${url}`, postContent);
          return null;
        }
        
        console.log(`成功加载文章 ${index + 1}:`, postContent.title_en || postContent.title_zh);
        console.log(`文章slug: ${postContent.slug}`);
        
        return postContent;
      } catch (error) {
        console.error(`加载文章 ${file} 失败:`, error);
        return null;
      }
    });
    
    const posts = await Promise.all(postsPromises);
    return posts.filter((post): post is BlogPost => post !== null);
  } catch (error) {
    console.error('加载所有博客文章失败:', error);
    return [];
  }
}

export default {
  getLocalBlogPosts,
  getLocalBlogPostBySlug,
  getLocalBlogCategories,
  getLocalBlogTags,
  getLocalBlogPageSettings,
  getLocalBlogVideos
};
