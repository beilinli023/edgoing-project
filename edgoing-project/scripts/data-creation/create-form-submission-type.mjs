import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取内容类型定义
const schemaPath = path.join(__dirname, 'form-submission-schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// 创建 Strapi API 目录
const apiDir = path.join(__dirname, 'my-strapi-backend/src/api/form-submission');
const contentTypesDir = path.join(apiDir, 'content-types/form-submission');

// 确保目录存在
fs.mkdirSync(contentTypesDir, { recursive: true });
fs.mkdirSync(path.join(apiDir, 'controllers'), { recursive: true });
fs.mkdirSync(path.join(apiDir, 'routes'), { recursive: true });
fs.mkdirSync(path.join(apiDir, 'services'), { recursive: true });

// 写入 schema.json 文件
fs.writeFileSync(
  path.join(contentTypesDir, 'schema.json'),
  JSON.stringify(schema, null, 2)
);

// 创建控制器文件
fs.writeFileSync(
  path.join(apiDir, 'controllers/form-submission.ts'),
  `/**
 * form-submission controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::form-submission.form-submission');
`
);

// 创建路由文件
fs.writeFileSync(
  path.join(apiDir, 'routes/form-submission.ts'),
  `/**
 * form-submission router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::form-submission.form-submission');
`
);

// 创建服务文件
fs.writeFileSync(
  path.join(apiDir, 'services/form-submission.ts'),
  `/**
 * form-submission service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::form-submission.form-submission');
`
);

console.log('✅ 表单提交内容类型创建成功！');
console.log('现在需要重启 Strapi 服务器以应用更改。');
console.log('重启命令: cd my-strapi-backend && npm run develop');
