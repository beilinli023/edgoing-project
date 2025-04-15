import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'backup-blog');
const DATA_DIR = path.join(process.cwd(), 'src/data/blog');

// 确保目标目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 复制所有 JSON 文件
const jsonFiles = fs.readdirSync(BACKUP_DIR).filter(file => file.endsWith('.json'));

jsonFiles.forEach(file => {
  const sourcePath = path.join(BACKUP_DIR, file);
  const targetPath = path.join(DATA_DIR, file);
  
  try {
    const content = fs.readFileSync(sourcePath, 'utf-8');
    fs.writeFileSync(targetPath, content);
    console.log(`✅ 已恢复: ${file}`);
  } catch (error) {
    console.error(`❌ 恢复失败 ${file}:`, error);
  }
});

// 复制 fixed 目录（如果存在）
const fixedSourceDir = path.join(BACKUP_DIR, 'fixed');
if (fs.existsSync(fixedSourceDir)) {
  const fixedTargetDir = path.join(DATA_DIR, 'fixed');
  if (!fs.existsSync(fixedTargetDir)) {
    fs.mkdirSync(fixedTargetDir, { recursive: true });
  }
  
  const fixedFiles = fs.readdirSync(fixedSourceDir);
  fixedFiles.forEach(file => {
    const sourcePath = path.join(fixedSourceDir, file);
    const targetPath = path.join(fixedTargetDir, file);
    
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ 已恢复 fixed/${file}`);
    } catch (error) {
      console.error(`❌ 恢复失败 fixed/${file}:`, error);
    }
  });
}

console.log('备份恢复完成！'); 