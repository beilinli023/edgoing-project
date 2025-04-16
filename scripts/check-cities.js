/**
 * 检查缺少城市数据的省份
 * 
 * 这个脚本用于检查哪些省份缺少城市数据
 */

// 使用fs模块读取文件
import fs from 'fs';
import path from 'path';

// 读取文件内容
const filePath = path.resolve('./src/data/chinaCities.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

// 提取省份和城市数据
let provincesMatch = fileContent.match(/export const provinces: Province\[\] = \[([\s\S]*?)\];/);
let citiesMatch = fileContent.match(/export const cities: City\[\] = \[([\s\S]*?)\];/);

if (!provincesMatch || !citiesMatch) {
  console.error('无法解析文件内容');
  process.exit(1);
}

// 提取省份ID
const provinceIdRegex = /id: "([^"]+)"/g;
const provinceIds = [];
let match;

while ((match = provinceIdRegex.exec(provincesMatch[1])) !== null) {
  provinceIds.push(match[1]);
}

// 提取城市的provinceId
const cityProvinceIdRegex = /provinceId: "([^"]+)"/g;
const cityProvinceIds = [];

while ((match = cityProvinceIdRegex.exec(citiesMatch[1])) !== null) {
  cityProvinceIds.push(match[1]);
}

// 统计每个省份的城市数量
const provincesWithCities = {};
provinceIds.forEach(provinceId => {
  provincesWithCities[provinceId] = cityProvinceIds.filter(id => id === provinceId).length;
});

// 找出缺少城市数据的省份
const missingCities = provinceIds.filter(provinceId => provincesWithCities[provinceId] === 0);

// 提取省份名称
const provinceNameRegex = /id: "([^"]+)"[^}]*zh: "([^"]+)"/g;
const provinceNames = {};

while ((match = provinceNameRegex.exec(provincesMatch[1])) !== null) {
  provinceNames[match[1]] = match[2];
}

// 输出结果
console.log('===== 省份城市数据检查结果 =====');
console.log(`总省份数量: ${provinceIds.length}`);
console.log(`有城市数据的省份数量: ${provinceIds.length - missingCities.length}`);
console.log(`缺少城市数据的省份数量: ${missingCities.length}`);

if (missingCities.length > 0) {
  console.log('\n缺少城市数据的省份:');
  missingCities.forEach(provinceId => {
    console.log(`- ${provinceNames[provinceId]} (${provinceId})`);
  });
}

console.log('\n各省份城市数量:');
provinceIds.forEach(provinceId => {
  console.log(`- ${provinceNames[provinceId]} (${provinceId}): ${provincesWithCities[provinceId]} 个城市`);
});
