import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取项目根目录路径
const rootDir = path.resolve(__dirname, '../../');
const programsDir = path.join(rootDir, 'public/content/programs');

// 获取所有项目列表
router.get('/', async (req, res) => {
  try {
    console.log('处理获取所有项目的请求');
    
    // 读取索引文件
    const indexPath = path.join(programsDir, 'index.json');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const programFiles = JSON.parse(indexContent);
    
    // 读取每个项目文件
    const programs = [];
    for (const filename of programFiles) {
      try {
        const filePath = path.join(programsDir, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const program = JSON.parse(fileContent);
        programs.push(program);
      } catch (fileError) {
        console.error(`读取项目文件 ${filename} 失败:`, fileError);
      }
    }
    
    res.json(programs);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({
      message: '获取项目列表失败',
      success: false,
      error: error.message
    });
  }
});

// 获取单个项目详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`处理获取项目 ${id} 的请求`);
    
    // 尝试直接通过ID查找文件
    const filePath = path.join(programsDir, `program${id}.json`);
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const program = JSON.parse(fileContent);
      return res.json(program);
    }
    
    // 如果直接查找失败，则读取所有文件并查找匹配的ID
    const indexPath = path.join(programsDir, 'index.json');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const programFiles = JSON.parse(indexContent);
    
    for (const filename of programFiles) {
      try {
        const programPath = path.join(programsDir, filename);
        const fileContent = fs.readFileSync(programPath, 'utf8');
        const program = JSON.parse(fileContent);
        
        if (String(program.id) === String(id) || program.program_id === id) {
          return res.json(program);
        }
      } catch (fileError) {
        console.error(`读取项目文件 ${filename} 失败:`, fileError);
      }
    }
    
    // 如果没有找到匹配的项目
    res.status(404).json({
      message: `未找到ID为 ${id} 的项目`,
      success: false
    });
  } catch (error) {
    console.error(`获取项目 ${req.params.id} 失败:`, error);
    res.status(500).json({
      message: '获取项目详情失败',
      success: false,
      error: error.message
    });
  }
});

export default router; 