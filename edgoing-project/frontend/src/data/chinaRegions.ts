/**
 * 中国行政区划数据
 * 包含省级行政区和主要城市信息，支持中英文
 */
import { cities as allCities } from './chinaCities';

// 定义省份类型
export interface Province {
  id: string;        // 省份ID，用于关联城市
  label: {
    zh: string;      // 中文名称
    en: string;      // 英文名称
  };
  type?: string;     // 行政区类型：省、自治区、直辖市、特别行政区
}

// 定义城市类型
export interface City {
  id: string;        // 城市ID
  provinceId: string; // 所属省份ID
  label: {
    zh: string;      // 中文名称
    en: string;      // 英文名称
  };
  level?: string;    // 城市级别：省会、地级市、县级市等
}

// 省份数据
export const provinces: Province[] = [
  // 直辖市
  { id: "beijing", label: { zh: "北京", en: "Beijing" }, type: "municipality" },
  { id: "tianjin", label: { zh: "天津", en: "Tianjin" }, type: "municipality" },
  { id: "shanghai", label: { zh: "上海", en: "Shanghai" }, type: "municipality" },
  { id: "chongqing", label: { zh: "重庆", en: "Chongqing" }, type: "municipality" },
  
  // 省份
  { id: "hebei", label: { zh: "河北", en: "Hebei" }, type: "province" },
  { id: "shanxi", label: { zh: "山西", en: "Shanxi" }, type: "province" },
  { id: "liaoning", label: { zh: "辽宁", en: "Liaoning" }, type: "province" },
  { id: "jilin", label: { zh: "吉林", en: "Jilin" }, type: "province" },
  { id: "heilongjiang", label: { zh: "黑龙江", en: "Heilongjiang" }, type: "province" },
  { id: "jiangsu", label: { zh: "江苏", en: "Jiangsu" }, type: "province" },
  { id: "zhejiang", label: { zh: "浙江", en: "Zhejiang" }, type: "province" },
  { id: "anhui", label: { zh: "安徽", en: "Anhui" }, type: "province" },
  { id: "fujian", label: { zh: "福建", en: "Fujian" }, type: "province" },
  { id: "jiangxi", label: { zh: "江西", en: "Jiangxi" }, type: "province" },
  { id: "shandong", label: { zh: "山东", en: "Shandong" }, type: "province" },
  { id: "henan", label: { zh: "河南", en: "Henan" }, type: "province" },
  { id: "hubei", label: { zh: "湖北", en: "Hubei" }, type: "province" },
  { id: "hunan", label: { zh: "湖南", en: "Hunan" }, type: "province" },
  { id: "guangdong", label: { zh: "广东", en: "Guangdong" }, type: "province" },
  { id: "hainan", label: { zh: "海南", en: "Hainan" }, type: "province" },
  { id: "sichuan", label: { zh: "四川", en: "Sichuan" }, type: "province" },
  { id: "guizhou", label: { zh: "贵州", en: "Guizhou" }, type: "province" },
  { id: "yunnan", label: { zh: "云南", en: "Yunnan" }, type: "province" },
  { id: "shaanxi", label: { zh: "陕西", en: "Shaanxi" }, type: "province" },
  { id: "gansu", label: { zh: "甘肃", en: "Gansu" }, type: "province" },
  { id: "qinghai", label: { zh: "青海", en: "Qinghai" }, type: "province" },
  
  // 自治区
  { id: "neimenggu", label: { zh: "内蒙古", en: "Inner Mongolia" }, type: "autonomous_region" },
  { id: "guangxi", label: { zh: "广西", en: "Guangxi" }, type: "autonomous_region" },
  { id: "xizang", label: { zh: "西藏", en: "Tibet" }, type: "autonomous_region" },
  { id: "ningxia", label: { zh: "宁夏", en: "Ningxia" }, type: "autonomous_region" },
  { id: "xinjiang", label: { zh: "新疆", en: "Xinjiang" }, type: "autonomous_region" },
  
  // 特别行政区
  { id: "hongkong", label: { zh: "香港", en: "Hong Kong" }, type: "special_administrative_region" },
  { id: "macao", label: { zh: "澳门", en: "Macao" }, type: "special_administrative_region" },
  { id: "taiwan", label: { zh: "台湾", en: "Taiwan" }, type: "province" },
  
  // 其他
  { id: "other", label: { zh: "其他", en: "Other" }, type: "other" }
];

// 使用从chinaCities导入的城市数据
export const cities: City[] = allCities;

/**
 * 根据语言获取省份列表
 * @param language 语言代码 'zh' 或 'en'
 * @returns 格式化后的省份列表
 */
export function getProvinceOptions(language: 'zh' | 'en' = 'zh') {
  return provinces.map(province => ({
    id: province.id,
    label: province.label[language]
  }));
}

/**
 * 获取指定省份的城市列表
 * @param provinceId 省份ID
 * @param language 语言代码 'zh' 或 'en'
 * @returns 格式化后的城市列表
 */
export function getCityOptions(provinceId: string, language: 'zh' | 'en' = 'zh') {
  return cities
    .filter(city => city.provinceId === provinceId)
    .map(city => ({
      id: city.id,
      label: city.label[language],
      provinceId: city.provinceId
    }));
}

/**
 * 兼容旧版格式的省份数据
 * @param language 语言代码 'en' 或 'zh'
 * @returns 旧版格式的省份数据
 */
export function getCompatibleProvinces(language = 'en') {
  return provinces.map(province => ({
    id: province.id,
    label: language === 'en' ? province.label.en : province.label.zh
  }));
}

/**
 * 兼容旧版格式的城市数据
 * @param language 语言代码 'en' 或 'zh'
 * @returns 旧版格式的城市数据
 */
export function getCompatibleCities(language = 'en') {
  return cities.map(city => ({
    id: city.id,
    label: language === 'en' ? city.label.en : city.label.zh,
    provinceId: city.provinceId
  }));
}

export default {
  provinces,
  cities,
  getProvinceOptions,
  getCityOptions,
  getCompatibleProvinces,
  getCompatibleCities
}; 