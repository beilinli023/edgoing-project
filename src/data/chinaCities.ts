/**
 * 中国行政区划数据
 * 包含省级行政区和主要城市信息，支持中英文
 * 数据版本：2025-03-14
 */

// 定义省份类型
export interface Province {
  id: string;        // 省份ID，用于关联城市
  code: string;      // 行政区划代码（GB/T 2260-2007）
  label: {
    zh: string;      // 中文名称
    en: string;      // 英文名称
  };
  type: string;      // 行政区类型：province(省)、autonomous_region(自治区)、municipality(直辖市)、special_administrative_region(特别行政区)
}

// 定义城市类型
export interface City {
  id: string;        // 城市ID
  code: string;      // 行政区划代码（GB/T 2260-2007）
  provinceId: string; // 所属省份ID
  label: {
    zh: string;      // 中文名称
    en: string;      // 英文名称
  };
  level: string;     // 城市级别：provincial_capital(省会)、sub_provincial(副省级)、prefecture(地级市)、county(县级市)
}

// 省份数据
export const provinces: Province[] = [
  // 直辖市
  { id: "beijing", code: "110000", label: { zh: "北京", en: "Beijing" }, type: "municipality" },
  { id: "tianjin", code: "120000", label: { zh: "天津", en: "Tianjin" }, type: "municipality" },
  { id: "shanghai", code: "310000", label: { zh: "上海", en: "Shanghai" }, type: "municipality" },
  { id: "chongqing", code: "500000", label: { zh: "重庆", en: "Chongqing" }, type: "municipality" },
  
  // 省份
  { id: "hebei", code: "130000", label: { zh: "河北", en: "Hebei" }, type: "province" },
  { id: "shanxi", code: "140000", label: { zh: "山西", en: "Shanxi" }, type: "province" },
  { id: "liaoning", code: "210000", label: { zh: "辽宁", en: "Liaoning" }, type: "province" },
  { id: "jilin", code: "220000", label: { zh: "吉林", en: "Jilin" }, type: "province" },
  { id: "heilongjiang", code: "230000", label: { zh: "黑龙江", en: "Heilongjiang" }, type: "province" },
  { id: "jiangsu", code: "320000", label: { zh: "江苏", en: "Jiangsu" }, type: "province" },
  { id: "zhejiang", code: "330000", label: { zh: "浙江", en: "Zhejiang" }, type: "province" },
  { id: "anhui", code: "340000", label: { zh: "安徽", en: "Anhui" }, type: "province" },
  { id: "fujian", code: "350000", label: { zh: "福建", en: "Fujian" }, type: "province" },
  { id: "jiangxi", code: "360000", label: { zh: "江西", en: "Jiangxi" }, type: "province" },
  { id: "shandong", code: "370000", label: { zh: "山东", en: "Shandong" }, type: "province" },
  { id: "henan", code: "410000", label: { zh: "河南", en: "Henan" }, type: "province" },
  { id: "hubei", code: "420000", label: { zh: "湖北", en: "Hubei" }, type: "province" },
  { id: "hunan", code: "430000", label: { zh: "湖南", en: "Hunan" }, type: "province" },
  { id: "guangdong", code: "440000", label: { zh: "广东", en: "Guangdong" }, type: "province" },
  { id: "hainan", code: "460000", label: { zh: "海南", en: "Hainan" }, type: "province" },
  { id: "sichuan", code: "510000", label: { zh: "四川", en: "Sichuan" }, type: "province" },
  { id: "guizhou", code: "520000", label: { zh: "贵州", en: "Guizhou" }, type: "province" },
  { id: "yunnan", code: "530000", label: { zh: "云南", en: "Yunnan" }, type: "province" },
  { id: "shaanxi", code: "610000", label: { zh: "陕西", en: "Shaanxi" }, type: "province" },
  { id: "gansu", code: "620000", label: { zh: "甘肃", en: "Gansu" }, type: "province" },
  { id: "qinghai", code: "630000", label: { zh: "青海", en: "Qinghai" }, type: "province" },
  { id: "taiwan", code: "710000", label: { zh: "台湾", en: "Taiwan" }, type: "province" },
  
  // 自治区
  { id: "neimenggu", code: "150000", label: { zh: "内蒙古", en: "Inner Mongolia" }, type: "autonomous_region" },
  { id: "guangxi", code: "450000", label: { zh: "广西", en: "Guangxi" }, type: "autonomous_region" },
  { id: "xizang", code: "540000", label: { zh: "西藏", en: "Tibet" }, type: "autonomous_region" },
  { id: "ningxia", code: "640000", label: { zh: "宁夏", en: "Ningxia" }, type: "autonomous_region" },
  { id: "xinjiang", code: "650000", label: { zh: "新疆", en: "Xinjiang" }, type: "autonomous_region" },
  
  // 特别行政区
  { id: "hongkong", code: "810000", label: { zh: "香港", en: "Hong Kong" }, type: "special_administrative_region" },
  { id: "macao", code: "820000", label: { zh: "澳门", en: "Macao" }, type: "special_administrative_region" }
];

// 城市数据（完整版）
export const cities: City[] = [
  // 北京市
  { id: "beijing_city", code: "110100", provinceId: "beijing", label: { zh: "北京市", en: "Beijing" }, level: "municipality" },
  
  // 天津市
  { id: "tianjin_city", code: "120100", provinceId: "tianjin", label: { zh: "天津市", en: "Tianjin" }, level: "municipality" },
  
  // 上海市
  { id: "shanghai_city", code: "310100", provinceId: "shanghai", label: { zh: "上海市", en: "Shanghai" }, level: "municipality" },
  
  // 重庆市
  { id: "chongqing_city", code: "500100", provinceId: "chongqing", label: { zh: "重庆市", en: "Chongqing" }, level: "municipality" },
  
  // 河北省
  { id: "shijiazhuang", code: "130100", provinceId: "hebei", label: { zh: "石家庄市", en: "Shijiazhuang" }, level: "provincial_capital" },
  { id: "tangshan", code: "130200", provinceId: "hebei", label: { zh: "唐山市", en: "Tangshan" }, level: "prefecture" },
  { id: "qinhuangdao", code: "130300", provinceId: "hebei", label: { zh: "秦皇岛市", en: "Qinhuangdao" }, level: "prefecture" },
  { id: "handan", code: "130400", provinceId: "hebei", label: { zh: "邯郸市", en: "Handan" }, level: "prefecture" },
  { id: "xingtai", code: "130500", provinceId: "hebei", label: { zh: "邢台市", en: "Xingtai" }, level: "prefecture" },
  { id: "baoding", code: "130600", provinceId: "hebei", label: { zh: "保定市", en: "Baoding" }, level: "prefecture" },
  { id: "zhangjiakou", code: "130700", provinceId: "hebei", label: { zh: "张家口市", en: "Zhangjiakou" }, level: "prefecture" },
  { id: "chengde", code: "130800", provinceId: "hebei", label: { zh: "承德市", en: "Chengde" }, level: "prefecture" },
  { id: "cangzhou", code: "130900", provinceId: "hebei", label: { zh: "沧州市", en: "Cangzhou" }, level: "prefecture" },
  { id: "langfang", code: "131000", provinceId: "hebei", label: { zh: "廊坊市", en: "Langfang" }, level: "prefecture" },
  { id: "hengshui", code: "131100", provinceId: "hebei", label: { zh: "衡水市", en: "Hengshui" }, level: "prefecture" },
  
  // 山西省
  { id: "taiyuan", code: "140100", provinceId: "shanxi", label: { zh: "太原市", en: "Taiyuan" }, level: "provincial_capital" },
  { id: "datong", code: "140200", provinceId: "shanxi", label: { zh: "大同市", en: "Datong" }, level: "prefecture" },
  { id: "yangquan", code: "140300", provinceId: "shanxi", label: { zh: "阳泉市", en: "Yangquan" }, level: "prefecture" },
  { id: "changzhi", code: "140400", provinceId: "shanxi", label: { zh: "长治市", en: "Changzhi" }, level: "prefecture" },
  { id: "jincheng", code: "140500", provinceId: "shanxi", label: { zh: "晋城市", en: "Jincheng" }, level: "prefecture" },
  { id: "shuozhou", code: "140600", provinceId: "shanxi", label: { zh: "朔州市", en: "Shuozhou" }, level: "prefecture" },
  { id: "jinzhong", code: "140700", provinceId: "shanxi", label: { zh: "晋中市", en: "Jinzhong" }, level: "prefecture" },
  { id: "yuncheng", code: "140800", provinceId: "shanxi", label: { zh: "运城市", en: "Yuncheng" }, level: "prefecture" },
  { id: "xinzhou", code: "140900", provinceId: "shanxi", label: { zh: "忻州市", en: "Xinzhou" }, level: "prefecture" },
  { id: "linfen", code: "141000", provinceId: "shanxi", label: { zh: "临汾市", en: "Linfen" }, level: "prefecture" },
  { id: "lvliang", code: "141100", provinceId: "shanxi", label: { zh: "吕梁市", en: "Lüliang" }, level: "prefecture" },
  
  // 辽宁省
  { id: "shenyang", code: "210100", provinceId: "liaoning", label: { zh: "沈阳市", en: "Shenyang" }, level: "provincial_capital" },
  { id: "dalian", code: "210200", provinceId: "liaoning", label: { zh: "大连市", en: "Dalian" }, level: "sub_provincial" },
  { id: "anshan", code: "210300", provinceId: "liaoning", label: { zh: "鞍山市", en: "Anshan" }, level: "prefecture" },
  { id: "fushun", code: "210400", provinceId: "liaoning", label: { zh: "抚顺市", en: "Fushun" }, level: "prefecture" },
  { id: "benxi", code: "210500", provinceId: "liaoning", label: { zh: "本溪市", en: "Benxi" }, level: "prefecture" },
  { id: "dandong", code: "210600", provinceId: "liaoning", label: { zh: "丹东市", en: "Dandong" }, level: "prefecture" },
  { id: "jinzhou", code: "210700", provinceId: "liaoning", label: { zh: "锦州市", en: "Jinzhou" }, level: "prefecture" },
  { id: "yingkou", code: "210800", provinceId: "liaoning", label: { zh: "营口市", en: "Yingkou" }, level: "prefecture" },
  { id: "fuxin", code: "210900", provinceId: "liaoning", label: { zh: "阜新市", en: "Fuxin" }, level: "prefecture" },
  { id: "liaoyang", code: "211000", provinceId: "liaoning", label: { zh: "辽阳市", en: "Liaoyang" }, level: "prefecture" },
  { id: "panjin", code: "211100", provinceId: "liaoning", label: { zh: "盘锦市", en: "Panjin" }, level: "prefecture" },
  { id: "tieling", code: "211200", provinceId: "liaoning", label: { zh: "铁岭市", en: "Tieling" }, level: "prefecture" },
  { id: "chaoyang", code: "211300", provinceId: "liaoning", label: { zh: "朝阳市", en: "Chaoyang" }, level: "prefecture" },
  { id: "huludao", code: "211400", provinceId: "liaoning", label: { zh: "葫芦岛市", en: "Huludao" }, level: "prefecture" },
  
  // 吉林省
  { id: "changchun", code: "220100", provinceId: "jilin", label: { zh: "长春市", en: "Changchun" }, level: "provincial_capital" },
  { id: "jilin_city", code: "220200", provinceId: "jilin", label: { zh: "吉林市", en: "Jilin" }, level: "prefecture" },
  { id: "siping", code: "220300", provinceId: "jilin", label: { zh: "四平市", en: "Siping" }, level: "prefecture" },
  { id: "liaoyuan", code: "220400", provinceId: "jilin", label: { zh: "辽源市", en: "Liaoyuan" }, level: "prefecture" },
  { id: "tonghua", code: "220500", provinceId: "jilin", label: { zh: "通化市", en: "Tonghua" }, level: "prefecture" },
  { id: "baishan", code: "220600", provinceId: "jilin", label: { zh: "白山市", en: "Baishan" }, level: "prefecture" },
  { id: "songyuan", code: "220700", provinceId: "jilin", label: { zh: "松原市", en: "Songyuan" }, level: "prefecture" },
  { id: "baicheng", code: "220800", provinceId: "jilin", label: { zh: "白城市", en: "Baicheng" }, level: "prefecture" },
  { id: "yanbian", code: "222400", provinceId: "jilin", label: { zh: "延边朝鲜族自治州", en: "Yanbian Korean Autonomous Prefecture" }, level: "prefecture" },
  
  // 黑龙江省
  { id: "harbin", code: "230100", provinceId: "heilongjiang", label: { zh: "哈尔滨市", en: "Harbin" }, level: "provincial_capital" },
  { id: "qiqihar", code: "230200", provinceId: "heilongjiang", label: { zh: "齐齐哈尔市", en: "Qiqihar" }, level: "prefecture" },
  { id: "jixi", code: "230300", provinceId: "heilongjiang", label: { zh: "鸡西市", en: "Jixi" }, level: "prefecture" },
  { id: "hegang", code: "230400", provinceId: "heilongjiang", label: { zh: "鹤岗市", en: "Hegang" }, level: "prefecture" },
  { id: "shuangyashan", code: "230500", provinceId: "heilongjiang", label: { zh: "双鸭山市", en: "Shuangyashan" }, level: "prefecture" },
  { id: "daqing", code: "230600", provinceId: "heilongjiang", label: { zh: "大庆市", en: "Daqing" }, level: "prefecture" },
  { id: "yichun_hlj", code: "230700", provinceId: "heilongjiang", label: { zh: "伊春市", en: "Yichun" }, level: "prefecture" },
  { id: "jiamusi", code: "230800", provinceId: "heilongjiang", label: { zh: "佳木斯市", en: "Jiamusi" }, level: "prefecture" },
  { id: "qitaihe", code: "230900", provinceId: "heilongjiang", label: { zh: "七台河市", en: "Qitaihe" }, level: "prefecture" },
  { id: "mudanjiang", code: "231000", provinceId: "heilongjiang", label: { zh: "牡丹江市", en: "Mudanjiang" }, level: "prefecture" },
  { id: "heihe", code: "231100", provinceId: "heilongjiang", label: { zh: "黑河市", en: "Heihe" }, level: "prefecture" },
  { id: "suihua", code: "231200", provinceId: "heilongjiang", label: { zh: "绥化市", en: "Suihua" }, level: "prefecture" },
  { id: "daxinganling", code: "232700", provinceId: "heilongjiang", label: { zh: "大兴安岭地区", en: "Daxing'anling Prefecture" }, level: "prefecture" },
  
  // 江苏省
  { id: "nanjing", code: "320100", provinceId: "jiangsu", label: { zh: "南京市", en: "Nanjing" }, level: "provincial_capital" },
  { id: "wuxi", code: "320200", provinceId: "jiangsu", label: { zh: "无锡市", en: "Wuxi" }, level: "prefecture" },
  { id: "xuzhou", code: "320300", provinceId: "jiangsu", label: { zh: "徐州市", en: "Xuzhou" }, level: "prefecture" },
  { id: "changzhou", code: "320400", provinceId: "jiangsu", label: { zh: "常州市", en: "Changzhou" }, level: "prefecture" },
  { id: "suzhou", code: "320500", provinceId: "jiangsu", label: { zh: "苏州市", en: "Suzhou" }, level: "prefecture" },
  { id: "nantong", code: "320600", provinceId: "jiangsu", label: { zh: "南通市", en: "Nantong" }, level: "prefecture" },
  { id: "lianyungang", code: "320700", provinceId: "jiangsu", label: { zh: "连云港市", en: "Lianyungang" }, level: "prefecture" },
  { id: "huaian", code: "320800", provinceId: "jiangsu", label: { zh: "淮安市", en: "Huai'an" }, level: "prefecture" },
  { id: "yancheng", code: "320900", provinceId: "jiangsu", label: { zh: "盐城市", en: "Yancheng" }, level: "prefecture" },
  { id: "yangzhou", code: "321000", provinceId: "jiangsu", label: { zh: "扬州市", en: "Yangzhou" }, level: "prefecture" },
  { id: "zhenjiang", code: "321100", provinceId: "jiangsu", label: { zh: "镇江市", en: "Zhenjiang" }, level: "prefecture" },
  { id: "taizhou_js", code: "321200", provinceId: "jiangsu", label: { zh: "泰州市", en: "Taizhou" }, level: "prefecture" },
  { id: "suqian", code: "321300", provinceId: "jiangsu", label: { zh: "宿迁市", en: "Suqian" }, level: "prefecture" },
  
  // 浙江省
  { id: "hangzhou", code: "330100", provinceId: "zhejiang", label: { zh: "杭州市", en: "Hangzhou" }, level: "provincial_capital" },
  { id: "ningbo", code: "330200", provinceId: "zhejiang", label: { zh: "宁波市", en: "Ningbo" }, level: "sub_provincial" },
  { id: "wenzhou", code: "330300", provinceId: "zhejiang", label: { zh: "温州市", en: "Wenzhou" }, level: "prefecture" },
  { id: "jiaxing", code: "330400", provinceId: "zhejiang", label: { zh: "嘉兴市", en: "Jiaxing" }, level: "prefecture" },
  { id: "huzhou", code: "330500", provinceId: "zhejiang", label: { zh: "湖州市", en: "Huzhou" }, level: "prefecture" },
  { id: "shaoxing", code: "330600", provinceId: "zhejiang", label: { zh: "绍兴市", en: "Shaoxing" }, level: "prefecture" },
  { id: "jinhua", code: "330700", provinceId: "zhejiang", label: { zh: "金华市", en: "Jinhua" }, level: "prefecture" },
  { id: "quzhou", code: "330800", provinceId: "zhejiang", label: { zh: "衢州市", en: "Quzhou" }, level: "prefecture" },
  { id: "zhoushan", code: "330900", provinceId: "zhejiang", label: { zh: "舟山市", en: "Zhoushan" }, level: "prefecture" },
  { id: "taizhou_zj", code: "331000", provinceId: "zhejiang", label: { zh: "台州市", en: "Taizhou" }, level: "prefecture" },
  { id: "lishui", code: "331100", provinceId: "zhejiang", label: { zh: "丽水市", en: "Lishui" }, level: "prefecture" },
  
  // 安徽省
  { id: "hefei", code: "340100", provinceId: "anhui", label: { zh: "合肥市", en: "Hefei" }, level: "provincial_capital" },
  { id: "wuhu", code: "340200", provinceId: "anhui", label: { zh: "芜湖市", en: "Wuhu" }, level: "prefecture" },
  { id: "bengbu", code: "340300", provinceId: "anhui", label: { zh: "蚌埠市", en: "Bengbu" }, level: "prefecture" },
  { id: "huainan", code: "340400", provinceId: "anhui", label: { zh: "淮南市", en: "Huainan" }, level: "prefecture" },
  { id: "maanshan", code: "340500", provinceId: "anhui", label: { zh: "马鞍山市", en: "Ma'anshan" }, level: "prefecture" },
  { id: "huaibei", code: "340600", provinceId: "anhui", label: { zh: "淮北市", en: "Huaibei" }, level: "prefecture" },
  { id: "tongling", code: "340700", provinceId: "anhui", label: { zh: "铜陵市", en: "Tongling" }, level: "prefecture" },
  { id: "anqing", code: "340800", provinceId: "anhui", label: { zh: "安庆市", en: "Anqing" }, level: "prefecture" },
  { id: "huangshan", code: "341000", provinceId: "anhui", label: { zh: "黄山市", en: "Huangshan" }, level: "prefecture" },
  { id: "chuzhou", code: "341100", provinceId: "anhui", label: { zh: "滁州市", en: "Chuzhou" }, level: "prefecture" },
  { id: "fuyang", code: "341200", provinceId: "anhui", label: { zh: "阜阳市", en: "Fuyang" }, level: "prefecture" },
  { id: "suzhou_ah", code: "341300", provinceId: "anhui", label: { zh: "宿州市", en: "Suzhou" }, level: "prefecture" },
  { id: "luan", code: "341500", provinceId: "anhui", label: { zh: "六安市", en: "Lu'an" }, level: "prefecture" },
  { id: "bozhou", code: "341600", provinceId: "anhui", label: { zh: "亳州市", en: "Bozhou" }, level: "prefecture" },
  { id: "chizhou", code: "341700", provinceId: "anhui", label: { zh: "池州市", en: "Chizhou" }, level: "prefecture" },
  { id: "xuancheng", code: "341800", provinceId: "anhui", label: { zh: "宣城市", en: "Xuancheng" }, level: "prefecture" },
  
  // 福建省
  { id: "fuzhou", code: "350100", provinceId: "fujian", label: { zh: "福州市", en: "Fuzhou" }, level: "provincial_capital" },
  { id: "xiamen", code: "350200", provinceId: "fujian", label: { zh: "厦门市", en: "Xiamen" }, level: "sub_provincial" },
  { id: "putian", code: "350300", provinceId: "fujian", label: { zh: "莆田市", en: "Putian" }, level: "prefecture" },
  { id: "sanming", code: "350400", provinceId: "fujian", label: { zh: "三明市", en: "Sanming" }, level: "prefecture" },
  { id: "quanzhou", code: "350500", provinceId: "fujian", label: { zh: "泉州市", en: "Quanzhou" }, level: "prefecture" },
  { id: "zhangzhou", code: "350600", provinceId: "fujian", label: { zh: "漳州市", en: "Zhangzhou" }, level: "prefecture" },
  { id: "nanping", code: "350700", provinceId: "fujian", label: { zh: "南平市", en: "Nanping" }, level: "prefecture" },
  { id: "longyan", code: "350800", provinceId: "fujian", label: { zh: "龙岩市", en: "Longyan" }, level: "prefecture" },
  { id: "ningde", code: "350900", provinceId: "fujian", label: { zh: "宁德市", en: "Ningde" }, level: "prefecture" },
  
  // 江西省
  { id: "nanchang", code: "360100", provinceId: "jiangxi", label: { zh: "南昌市", en: "Nanchang" }, level: "provincial_capital" },
  { id: "jingdezhen", code: "360200", provinceId: "jiangxi", label: { zh: "景德镇市", en: "Jingdezhen" }, level: "prefecture" },
  { id: "pingxiang", code: "360300", provinceId: "jiangxi", label: { zh: "萍乡市", en: "Pingxiang" }, level: "prefecture" },
  { id: "jiujiang", code: "360400", provinceId: "jiangxi", label: { zh: "九江市", en: "Jiujiang" }, level: "prefecture" },
  { id: "xinyu", code: "360500", provinceId: "jiangxi", label: { zh: "新余市", en: "Xinyu" }, level: "prefecture" },
  { id: "yingtan", code: "360600", provinceId: "jiangxi", label: { zh: "鹰潭市", en: "Yingtan" }, level: "prefecture" },
  { id: "ganzhou", code: "360700", provinceId: "jiangxi", label: { zh: "赣州市", en: "Ganzhou" }, level: "prefecture" },
  { id: "jian", code: "360800", provinceId: "jiangxi", label: { zh: "吉安市", en: "Ji'an" }, level: "prefecture" },
  { id: "yichun_jx", code: "360900", provinceId: "jiangxi", label: { zh: "宜春市", en: "Yichun" }, level: "prefecture" },
  { id: "fuzhou_jx", code: "361000", provinceId: "jiangxi", label: { zh: "抚州市", en: "Fuzhou" }, level: "prefecture" },
  { id: "shangrao", code: "361100", provinceId: "jiangxi", label: { zh: "上饶市", en: "Shangrao" }, level: "prefecture" }
];

// 导出城市数据供其他模块使用
export { cities as allCities };