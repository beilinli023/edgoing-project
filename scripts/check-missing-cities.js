/**
 * 检查缺少城市数据的省份
 *
 * 这个脚本用于检查哪些省份缺少城市数据
 */

// 导入省份和城市数据
import { provinces, cities } from '../src/data/chinaCities.js';

// 获取所有省份ID
const provinceIds = provinces.map(province => province.id);

// 检查每个省份是否有对应的城市数据
const missingCities = [];
const provincesWithCities = {};

// 统计每个省份的城市数量
provinceIds.forEach(provinceId => {
  const citiesForProvince = cities.filter(city => city.provinceId === provinceId);
  provincesWithCities[provinceId] = citiesForProvince.length;

  if (citiesForProvince.length === 0) {
    const province = provinces.find(p => p.id === provinceId);
    missingCities.push({
      id: provinceId,
      name: province.label.zh,
      englishName: province.label.en,
      type: province.type
    });
  }
});

// 输出结果
console.log('===== 省份城市数据检查结果 =====');
console.log(`总省份数量: ${provinceIds.length}`);
console.log(`有城市数据的省份数量: ${provinceIds.length - missingCities.length}`);
console.log(`缺少城市数据的省份数量: ${missingCities.length}`);

if (missingCities.length > 0) {
  console.log('\n缺少城市数据的省份:');
  missingCities.forEach(province => {
    console.log(`- ${province.name} (${province.englishName}) [${province.type}]`);
  });
}

console.log('\n各省份城市数量:');
provinceIds.forEach(provinceId => {
  const province = provinces.find(p => p.id === provinceId);
  console.log(`- ${province.label.zh} (${province.label.en}): ${provincesWithCities[provinceId]} 个城市`);
});
