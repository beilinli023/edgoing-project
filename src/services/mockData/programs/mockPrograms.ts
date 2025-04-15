// 使用从真实JSON文件同步的项目数据
// 这些数据来自 public/content/programs/ 目录下的文件
export const mockPrograms = [
  // 项目数据会从本地JSON文件加载，这里只是为API失败时提供回退数据结构
  // 不会自己篡改或生成数据
];

/**
 * 获取本地真实项目数据而不是使用硬编码Mock数据
 * 当API不可用时，前端会直接从public/content/programs/下读取JSON文件
 */
export const getLocalProgramData = async () => {
  try {
    // 首先获取索引文件
    const indexResponse = await fetch('/content/programs/index.json');
    if (!indexResponse.ok) {
      throw new Error(`无法加载索引文件: ${indexResponse.statusText}`);
    }
    
    // 读取索引中的文件名列表
    const filenames = await indexResponse.json();
    
    // 读取每个程序文件
    const programPromises = filenames.map(async (filename: string) => {
      try {
        const response = await fetch(`/content/programs/${filename}`);
        if (!response.ok) {
          console.error(`加载项目文件 ${filename} 失败: ${response.statusText}`);
          return null;
        }
        
        return await response.json();
      } catch (error) {
        console.error(`处理项目文件 ${filename} 出错:`, error);
        return null;
      }
    });
    
    // 等待所有请求完成
    const programs = (await Promise.all(programPromises)).filter(p => p !== null);
    return programs;
  } catch (error) {
    console.error('读取本地程序数据出错:', error);
    return [];
  }
};
