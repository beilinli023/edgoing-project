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
  { id: "shangrao", code: "361100", provinceId: "jiangxi", label: { zh: "上饶市", en: "Shangrao" }, level: "prefecture" },

  // 湖北省
  { id: "wuhan", code: "420100", provinceId: "hubei", label: { zh: "武汉市", en: "Wuhan" }, level: "provincial_capital" },
  { id: "huangshi", code: "420200", provinceId: "hubei", label: { zh: "黄石市", en: "Huangshi" }, level: "prefecture" },
  { id: "shiyan", code: "420300", provinceId: "hubei", label: { zh: "十堰市", en: "Shiyan" }, level: "prefecture" },
  { id: "yichang", code: "420500", provinceId: "hubei", label: { zh: "宜昌市", en: "Yichang" }, level: "prefecture" },
  { id: "xiangyang", code: "420600", provinceId: "hubei", label: { zh: "襄阳市", en: "Xiangyang" }, level: "prefecture" },
  { id: "ezhou", code: "420700", provinceId: "hubei", label: { zh: "鄂州市", en: "Ezhou" }, level: "prefecture" },
  { id: "jingmen", code: "420800", provinceId: "hubei", label: { zh: "荆门市", en: "Jingmen" }, level: "prefecture" },
  { id: "xiaogan", code: "420900", provinceId: "hubei", label: { zh: "孝感市", en: "Xiaogan" }, level: "prefecture" },
  { id: "jingzhou", code: "421000", provinceId: "hubei", label: { zh: "荆州市", en: "Jingzhou" }, level: "prefecture" },
  { id: "huanggang", code: "421100", provinceId: "hubei", label: { zh: "黄冈市", en: "Huanggang" }, level: "prefecture" },
  { id: "xianning", code: "421200", provinceId: "hubei", label: { zh: "咸宁市", en: "Xianning" }, level: "prefecture" },
  { id: "suizhou", code: "421300", provinceId: "hubei", label: { zh: "随州市", en: "Suizhou" }, level: "prefecture" },
  { id: "enshi", code: "422800", provinceId: "hubei", label: { zh: "恩施土家族苗族自治州", en: "Enshi Tujia and Miao Autonomous Prefecture" }, level: "prefecture" },
  { id: "xiantao", code: "429004", provinceId: "hubei", label: { zh: "仙桃市", en: "Xiantao" }, level: "county" },
  { id: "qianjiang", code: "429005", provinceId: "hubei", label: { zh: "潜江市", en: "Qianjiang" }, level: "county" },
  { id: "tianmen", code: "429006", provinceId: "hubei", label: { zh: "天门市", en: "Tianmen" }, level: "county" },
  { id: "shennongjia", code: "429021", provinceId: "hubei", label: { zh: "神农架林区", en: "Shennongjia Forestry District" }, level: "county" },

  // 山东省
  { id: "jinan", code: "370100", provinceId: "shandong", label: { zh: "济南市", en: "Jinan" }, level: "provincial_capital" },
  { id: "qingdao", code: "370200", provinceId: "shandong", label: { zh: "青岛市", en: "Qingdao" }, level: "sub_provincial" },
  { id: "zibo", code: "370300", provinceId: "shandong", label: { zh: "淄博市", en: "Zibo" }, level: "prefecture" },
  { id: "zaozhuang", code: "370400", provinceId: "shandong", label: { zh: "枣庄市", en: "Zaozhuang" }, level: "prefecture" },
  { id: "dongying", code: "370500", provinceId: "shandong", label: { zh: "东营市", en: "Dongying" }, level: "prefecture" },
  { id: "yantai", code: "370600", provinceId: "shandong", label: { zh: "烟台市", en: "Yantai" }, level: "prefecture" },
  { id: "weifang", code: "370700", provinceId: "shandong", label: { zh: "潍坊市", en: "Weifang" }, level: "prefecture" },
  { id: "jining", code: "370800", provinceId: "shandong", label: { zh: "济宁市", en: "Jining" }, level: "prefecture" },
  { id: "taian", code: "370900", provinceId: "shandong", label: { zh: "泰安市", en: "Tai'an" }, level: "prefecture" },
  { id: "weihai", code: "371000", provinceId: "shandong", label: { zh: "威海市", en: "Weihai" }, level: "prefecture" },
  { id: "rizhao", code: "371100", provinceId: "shandong", label: { zh: "日照市", en: "Rizhao" }, level: "prefecture" },
  { id: "laiwu", code: "371200", provinceId: "shandong", label: { zh: "莱芜市", en: "Laiwu" }, level: "prefecture" },
  { id: "linyi", code: "371300", provinceId: "shandong", label: { zh: "临沂市", en: "Linyi" }, level: "prefecture" },
  { id: "dezhou", code: "371400", provinceId: "shandong", label: { zh: "德州市", en: "Dezhou" }, level: "prefecture" },
  { id: "liaocheng", code: "371500", provinceId: "shandong", label: { zh: "聊城市", en: "Liaocheng" }, level: "prefecture" },
  { id: "binzhou", code: "371600", provinceId: "shandong", label: { zh: "滨州市", en: "Binzhou" }, level: "prefecture" },
  { id: "heze", code: "371700", provinceId: "shandong", label: { zh: "菏泽市", en: "Heze" }, level: "prefecture" },

  // 河南省
  { id: "zhengzhou", code: "410100", provinceId: "henan", label: { zh: "郑州市", en: "Zhengzhou" }, level: "provincial_capital" },
  { id: "kaifeng", code: "410200", provinceId: "henan", label: { zh: "开封市", en: "Kaifeng" }, level: "prefecture" },
  { id: "luoyang", code: "410300", provinceId: "henan", label: { zh: "洛阳市", en: "Luoyang" }, level: "prefecture" },
  { id: "pingdingshan", code: "410400", provinceId: "henan", label: { zh: "平顶山市", en: "Pingdingshan" }, level: "prefecture" },
  { id: "anyang", code: "410500", provinceId: "henan", label: { zh: "安阳市", en: "Anyang" }, level: "prefecture" },
  { id: "hebi", code: "410600", provinceId: "henan", label: { zh: "鹤壁市", en: "Hebi" }, level: "prefecture" },
  { id: "xinxiang", code: "410700", provinceId: "henan", label: { zh: "新乡市", en: "Xinxiang" }, level: "prefecture" },
  { id: "jiaozuo", code: "410800", provinceId: "henan", label: { zh: "焦作市", en: "Jiaozuo" }, level: "prefecture" },
  { id: "puyang", code: "410900", provinceId: "henan", label: { zh: "濮阳市", en: "Puyang" }, level: "prefecture" },
  { id: "xuchang", code: "411000", provinceId: "henan", label: { zh: "许昌市", en: "Xuchang" }, level: "prefecture" },
  { id: "luohe", code: "411100", provinceId: "henan", label: { zh: "漯河市", en: "Luohe" }, level: "prefecture" },
  { id: "sanmenxia", code: "411200", provinceId: "henan", label: { zh: "三门峡市", en: "Sanmenxia" }, level: "prefecture" },
  { id: "nanyang", code: "411300", provinceId: "henan", label: { zh: "南阳市", en: "Nanyang" }, level: "prefecture" },
  { id: "shangqiu", code: "411400", provinceId: "henan", label: { zh: "商丘市", en: "Shangqiu" }, level: "prefecture" },
  { id: "xinyang", code: "411500", provinceId: "henan", label: { zh: "信阳市", en: "Xinyang" }, level: "prefecture" },
  { id: "zhoukou", code: "411600", provinceId: "henan", label: { zh: "周口市", en: "Zhoukou" }, level: "prefecture" },
  { id: "zhumadian", code: "411700", provinceId: "henan", label: { zh: "驻马店市", en: "Zhumadian" }, level: "prefecture" },
  { id: "jiyuan", code: "419001", provinceId: "henan", label: { zh: "济源市", en: "Jiyuan" }, level: "county" },

  // 湖南省
  { id: "changsha", code: "430100", provinceId: "hunan", label: { zh: "长沙市", en: "Changsha" }, level: "provincial_capital" },
  { id: "zhuzhou", code: "430200", provinceId: "hunan", label: { zh: "株洲市", en: "Zhuzhou" }, level: "prefecture" },
  { id: "xiangtan", code: "430300", provinceId: "hunan", label: { zh: "湘潭市", en: "Xiangtan" }, level: "prefecture" },
  { id: "hengyang", code: "430400", provinceId: "hunan", label: { zh: "衡阳市", en: "Hengyang" }, level: "prefecture" },
  { id: "shaoyang", code: "430500", provinceId: "hunan", label: { zh: "邵阳市", en: "Shaoyang" }, level: "prefecture" },
  { id: "yueyang", code: "430600", provinceId: "hunan", label: { zh: "岳阳市", en: "Yueyang" }, level: "prefecture" },
  { id: "changde", code: "430700", provinceId: "hunan", label: { zh: "常德市", en: "Changde" }, level: "prefecture" },
  { id: "zhangjiajie", code: "430800", provinceId: "hunan", label: { zh: "张家界市", en: "Zhangjiajie" }, level: "prefecture" },
  { id: "yiyang", code: "430900", provinceId: "hunan", label: { zh: "益阳市", en: "Yiyang" }, level: "prefecture" },
  { id: "chenzhou", code: "431000", provinceId: "hunan", label: { zh: "郴州市", en: "Chenzhou" }, level: "prefecture" },
  { id: "yongzhou", code: "431100", provinceId: "hunan", label: { zh: "永州市", en: "Yongzhou" }, level: "prefecture" },
  { id: "huaihua", code: "431200", provinceId: "hunan", label: { zh: "怀化市", en: "Huaihua" }, level: "prefecture" },
  { id: "loudi", code: "431300", provinceId: "hunan", label: { zh: "娄底市", en: "Loudi" }, level: "prefecture" },
  { id: "xiangxi", code: "433100", provinceId: "hunan", label: { zh: "湘西土家族苗族自治州", en: "Xiangxi Tujia and Miao Autonomous Prefecture" }, level: "prefecture" },

  // 广东省
  { id: "guangzhou", code: "440100", provinceId: "guangdong", label: { zh: "广州市", en: "Guangzhou" }, level: "provincial_capital" },
  { id: "shaoguan", code: "440200", provinceId: "guangdong", label: { zh: "韶关市", en: "Shaoguan" }, level: "prefecture" },
  { id: "shenzhen", code: "440300", provinceId: "guangdong", label: { zh: "深圳市", en: "Shenzhen" }, level: "sub_provincial" },
  { id: "zhuhai", code: "440400", provinceId: "guangdong", label: { zh: "珠海市", en: "Zhuhai" }, level: "prefecture" },
  { id: "shantou", code: "440500", provinceId: "guangdong", label: { zh: "汕头市", en: "Shantou" }, level: "prefecture" },
  { id: "foshan", code: "440600", provinceId: "guangdong", label: { zh: "佛山市", en: "Foshan" }, level: "prefecture" },
  { id: "jiangmen", code: "440700", provinceId: "guangdong", label: { zh: "江门市", en: "Jiangmen" }, level: "prefecture" },
  { id: "zhanjiang", code: "440800", provinceId: "guangdong", label: { zh: "湛江市", en: "Zhanjiang" }, level: "prefecture" },
  { id: "maoming", code: "440900", provinceId: "guangdong", label: { zh: "茂名市", en: "Maoming" }, level: "prefecture" },
  { id: "zhaoqing", code: "441200", provinceId: "guangdong", label: { zh: "肇庆市", en: "Zhaoqing" }, level: "prefecture" },
  { id: "huizhou", code: "441300", provinceId: "guangdong", label: { zh: "惠州市", en: "Huizhou" }, level: "prefecture" },
  { id: "meizhou", code: "441400", provinceId: "guangdong", label: { zh: "梅州市", en: "Meizhou" }, level: "prefecture" },
  { id: "shanwei", code: "441500", provinceId: "guangdong", label: { zh: "汕尾市", en: "Shanwei" }, level: "prefecture" },
  { id: "heyuan", code: "441600", provinceId: "guangdong", label: { zh: "河源市", en: "Heyuan" }, level: "prefecture" },
  { id: "yangjiang", code: "441700", provinceId: "guangdong", label: { zh: "阳江市", en: "Yangjiang" }, level: "prefecture" },
  { id: "qingyuan", code: "441800", provinceId: "guangdong", label: { zh: "清远市", en: "Qingyuan" }, level: "prefecture" },
  { id: "dongguan", code: "441900", provinceId: "guangdong", label: { zh: "东莞市", en: "Dongguan" }, level: "prefecture" },
  { id: "zhongshan", code: "442000", provinceId: "guangdong", label: { zh: "中山市", en: "Zhongshan" }, level: "prefecture" },
  { id: "chaozhou", code: "445100", provinceId: "guangdong", label: { zh: "潮州市", en: "Chaozhou" }, level: "prefecture" },
  { id: "jieyang", code: "445200", provinceId: "guangdong", label: { zh: "揭阳市", en: "Jieyang" }, level: "prefecture" },
  { id: "yunfu", code: "445300", provinceId: "guangdong", label: { zh: "云浮市", en: "Yunfu" }, level: "prefecture" },

  // 海南省
  { id: "haikou", code: "460100", provinceId: "hainan", label: { zh: "海口市", en: "Haikou" }, level: "provincial_capital" },
  { id: "sanya", code: "460200", provinceId: "hainan", label: { zh: "三亚市", en: "Sanya" }, level: "prefecture" },
  { id: "sansha", code: "460300", provinceId: "hainan", label: { zh: "三沙市", en: "Sansha" }, level: "prefecture" },
  { id: "danzhou", code: "460400", provinceId: "hainan", label: { zh: "儋州市", en: "Danzhou" }, level: "county" },
  { id: "wuzhishan", code: "469001", provinceId: "hainan", label: { zh: "五指山市", en: "Wuzhishan" }, level: "county" },
  { id: "qionghai", code: "469002", provinceId: "hainan", label: { zh: "琼海市", en: "Qionghai" }, level: "county" },
  { id: "wenchang", code: "469005", provinceId: "hainan", label: { zh: "文昌市", en: "Wenchang" }, level: "county" },
  { id: "wanning", code: "469006", provinceId: "hainan", label: { zh: "万宁市", en: "Wanning" }, level: "county" },
  { id: "dongfang", code: "469007", provinceId: "hainan", label: { zh: "东方市", en: "Dongfang" }, level: "county" },
  { id: "ding_an", code: "469025", provinceId: "hainan", label: { zh: "定安县", en: "Ding'an" }, level: "county" },
  { id: "tunchang", code: "469026", provinceId: "hainan", label: { zh: "屯昌县", en: "Tunchang" }, level: "county" },
  { id: "chengmai", code: "469027", provinceId: "hainan", label: { zh: "澄迈县", en: "Chengmai" }, level: "county" },
  { id: "lingao", code: "469028", provinceId: "hainan", label: { zh: "临高县", en: "Lingao" }, level: "county" },
  { id: "baisha", code: "469030", provinceId: "hainan", label: { zh: "白沙黎族自治县", en: "Baisha Li Autonomous County" }, level: "county" },
  { id: "changjiang", code: "469031", provinceId: "hainan", label: { zh: "昌江黎族自治县", en: "Changjiang Li Autonomous County" }, level: "county" },
  { id: "ledong", code: "469033", provinceId: "hainan", label: { zh: "乐东黎族自治县", en: "Ledong Li Autonomous County" }, level: "county" },
  { id: "lingshui", code: "469034", provinceId: "hainan", label: { zh: "陵水黎族自治县", en: "Lingshui Li Autonomous County" }, level: "county" },
  { id: "baoting", code: "469035", provinceId: "hainan", label: { zh: "保亭黎族苗族自治县", en: "Baoting Li and Miao Autonomous County" }, level: "county" },
  { id: "qiongzhong", code: "469036", provinceId: "hainan", label: { zh: "琼中黎族苗族自治县", en: "Qiongzhong Li and Miao Autonomous County" }, level: "county" },

  // 四川省
  { id: "chengdu", code: "510100", provinceId: "sichuan", label: { zh: "成都市", en: "Chengdu" }, level: "provincial_capital" },
  { id: "zigong", code: "510300", provinceId: "sichuan", label: { zh: "自贡市", en: "Zigong" }, level: "prefecture" },
  { id: "panzhihua", code: "510400", provinceId: "sichuan", label: { zh: "攀枝花市", en: "Panzhihua" }, level: "prefecture" },
  { id: "luzhou", code: "510500", provinceId: "sichuan", label: { zh: "泸州市", en: "Luzhou" }, level: "prefecture" },
  { id: "deyang", code: "510600", provinceId: "sichuan", label: { zh: "德阳市", en: "Deyang" }, level: "prefecture" },
  { id: "mianyang", code: "510700", provinceId: "sichuan", label: { zh: "绵阳市", en: "Mianyang" }, level: "prefecture" },
  { id: "guangyuan", code: "510800", provinceId: "sichuan", label: { zh: "广元市", en: "Guangyuan" }, level: "prefecture" },
  { id: "suining", code: "510900", provinceId: "sichuan", label: { zh: "遂宁市", en: "Suining" }, level: "prefecture" },
  { id: "neijiang", code: "511000", provinceId: "sichuan", label: { zh: "内江市", en: "Neijiang" }, level: "prefecture" },
  { id: "leshan", code: "511100", provinceId: "sichuan", label: { zh: "乐山市", en: "Leshan" }, level: "prefecture" },
  { id: "nanchong", code: "511300", provinceId: "sichuan", label: { zh: "南充市", en: "Nanchong" }, level: "prefecture" },
  { id: "meishan", code: "511400", provinceId: "sichuan", label: { zh: "眉山市", en: "Meishan" }, level: "prefecture" },
  { id: "yibin", code: "511500", provinceId: "sichuan", label: { zh: "宜宾市", en: "Yibin" }, level: "prefecture" },
  { id: "guangan", code: "511600", provinceId: "sichuan", label: { zh: "广安市", en: "Guang'an" }, level: "prefecture" },
  { id: "dazhou", code: "511700", provinceId: "sichuan", label: { zh: "达州市", en: "Dazhou" }, level: "prefecture" },
  { id: "yaan", code: "511800", provinceId: "sichuan", label: { zh: "雅安市", en: "Ya'an" }, level: "prefecture" },
  { id: "bazhong", code: "511900", provinceId: "sichuan", label: { zh: "巴中市", en: "Bazhong" }, level: "prefecture" },
  { id: "ziyang", code: "512000", provinceId: "sichuan", label: { zh: "资阳市", en: "Ziyang" }, level: "prefecture" },
  { id: "aba", code: "513200", provinceId: "sichuan", label: { zh: "阿坝藏族羌族自治州", en: "Aba Tibetan and Qiang Autonomous Prefecture" }, level: "prefecture" },
  { id: "ganzi", code: "513300", provinceId: "sichuan", label: { zh: "甘孜藏族自治州", en: "Garze Tibetan Autonomous Prefecture" }, level: "prefecture" },
  { id: "liangshan", code: "513400", provinceId: "sichuan", label: { zh: "凉山彝族自治州", en: "Liangshan Yi Autonomous Prefecture" }, level: "prefecture" },

  // 贵州省
  { id: "guiyang", code: "520100", provinceId: "guizhou", label: { zh: "贵阳市", en: "Guiyang" }, level: "provincial_capital" },
  { id: "liupanshui", code: "520200", provinceId: "guizhou", label: { zh: "六盘水市", en: "Liupanshui" }, level: "prefecture" },
  { id: "zunyi", code: "520300", provinceId: "guizhou", label: { zh: "遵义市", en: "Zunyi" }, level: "prefecture" },
  { id: "anshun", code: "520400", provinceId: "guizhou", label: { zh: "安顺市", en: "Anshun" }, level: "prefecture" },
  { id: "bijie", code: "520500", provinceId: "guizhou", label: { zh: "毕节市", en: "Bijie" }, level: "prefecture" },
  { id: "tongren", code: "520600", provinceId: "guizhou", label: { zh: "铜仁市", en: "Tongren" }, level: "prefecture" },
  { id: "qianxinan", code: "522300", provinceId: "guizhou", label: { zh: "黔西南布依族苗族自治州", en: "Qianxinan Buyei and Miao Autonomous Prefecture" }, level: "prefecture" },
  { id: "qiandongnan", code: "522600", provinceId: "guizhou", label: { zh: "黔东南苗族侗族自治州", en: "Qiandongnan Miao and Dong Autonomous Prefecture" }, level: "prefecture" },
  { id: "qiannan", code: "522700", provinceId: "guizhou", label: { zh: "黔南布依族苗族自治州", en: "Qiannan Buyei and Miao Autonomous Prefecture" }, level: "prefecture" },

  // 云南省
  { id: "kunming", code: "530100", provinceId: "yunnan", label: { zh: "昆明市", en: "Kunming" }, level: "provincial_capital" },
  { id: "qujing", code: "530300", provinceId: "yunnan", label: { zh: "曲靖市", en: "Qujing" }, level: "prefecture" },
  { id: "yuxi", code: "530400", provinceId: "yunnan", label: { zh: "玉溪市", en: "Yuxi" }, level: "prefecture" },
  { id: "baoshan", code: "530500", provinceId: "yunnan", label: { zh: "保山市", en: "Baoshan" }, level: "prefecture" },
  { id: "zhaotong", code: "530600", provinceId: "yunnan", label: { zh: "昭通市", en: "Zhaotong" }, level: "prefecture" },
  { id: "lijiang", code: "530700", provinceId: "yunnan", label: { zh: "丽江市", en: "Lijiang" }, level: "prefecture" },
  { id: "puer", code: "530800", provinceId: "yunnan", label: { zh: "普洱市", en: "Pu'er" }, level: "prefecture" },
  { id: "lincang", code: "530900", provinceId: "yunnan", label: { zh: "临沧市", en: "Lincang" }, level: "prefecture" },
  { id: "chuxiong", code: "532300", provinceId: "yunnan", label: { zh: "楚雄彝族自治州", en: "Chuxiong Yi Autonomous Prefecture" }, level: "prefecture" },
  { id: "honghe", code: "532500", provinceId: "yunnan", label: { zh: "红河哈尼族彝族自治州", en: "Honghe Hani and Yi Autonomous Prefecture" }, level: "prefecture" },
  { id: "wenshan", code: "532600", provinceId: "yunnan", label: { zh: "文山壮族苗族自治州", en: "Wenshan Zhuang and Miao Autonomous Prefecture" }, level: "prefecture" },
  { id: "xishuangbanna", code: "532800", provinceId: "yunnan", label: { zh: "西双版纳傣族自治州", en: "Xishuangbanna Dai Autonomous Prefecture" }, level: "prefecture" },
  { id: "dali", code: "532900", provinceId: "yunnan", label: { zh: "大理白族自治州", en: "Dali Bai Autonomous Prefecture" }, level: "prefecture" },
  { id: "dehong", code: "533100", provinceId: "yunnan", label: { zh: "德宏傣族景颇族自治州", en: "Dehong Dai and Jingpo Autonomous Prefecture" }, level: "prefecture" },
  { id: "nujiang", code: "533300", provinceId: "yunnan", label: { zh: "怒江傈僳族自治州", en: "Nujiang Lisu Autonomous Prefecture" }, level: "prefecture" },
  { id: "diqing", code: "533400", provinceId: "yunnan", label: { zh: "迪庆藏族自治州", en: "Diqing Tibetan Autonomous Prefecture" }, level: "prefecture" },

  // 陕西省
  { id: "xian", code: "610100", provinceId: "shaanxi", label: { zh: "西安市", en: "Xi'an" }, level: "provincial_capital" },
  { id: "tongchuan", code: "610200", provinceId: "shaanxi", label: { zh: "铜川市", en: "Tongchuan" }, level: "prefecture" },
  { id: "baoji", code: "610300", provinceId: "shaanxi", label: { zh: "宝鸡市", en: "Baoji" }, level: "prefecture" },
  { id: "xianyang", code: "610400", provinceId: "shaanxi", label: { zh: "咸阳市", en: "Xianyang" }, level: "prefecture" },
  { id: "weinan", code: "610500", provinceId: "shaanxi", label: { zh: "渭南市", en: "Weinan" }, level: "prefecture" },
  { id: "yanan", code: "610600", provinceId: "shaanxi", label: { zh: "延安市", en: "Yan'an" }, level: "prefecture" },
  { id: "hanzhong", code: "610700", provinceId: "shaanxi", label: { zh: "汉中市", en: "Hanzhong" }, level: "prefecture" },
  { id: "yulin", code: "610800", provinceId: "shaanxi", label: { zh: "榆林市", en: "Yulin" }, level: "prefecture" },
  { id: "ankang", code: "610900", provinceId: "shaanxi", label: { zh: "安康市", en: "Ankang" }, level: "prefecture" },
  { id: "shangluo", code: "611000", provinceId: "shaanxi", label: { zh: "商洛市", en: "Shangluo" }, level: "prefecture" },

  // 甘肃省
  { id: "lanzhou", code: "620100", provinceId: "gansu", label: { zh: "兰州市", en: "Lanzhou" }, level: "provincial_capital" },
  { id: "jiayuguan", code: "620200", provinceId: "gansu", label: { zh: "嘉峪关市", en: "Jiayuguan" }, level: "prefecture" },
  { id: "jinchang", code: "620300", provinceId: "gansu", label: { zh: "金昌市", en: "Jinchang" }, level: "prefecture" },
  { id: "baiyin", code: "620400", provinceId: "gansu", label: { zh: "白银市", en: "Baiyin" }, level: "prefecture" },
  { id: "tianshui", code: "620500", provinceId: "gansu", label: { zh: "天水市", en: "Tianshui" }, level: "prefecture" },
  { id: "wuwei", code: "620600", provinceId: "gansu", label: { zh: "武威市", en: "Wuwei" }, level: "prefecture" },
  { id: "zhangye", code: "620700", provinceId: "gansu", label: { zh: "张掖市", en: "Zhangye" }, level: "prefecture" },
  { id: "pingliang", code: "620800", provinceId: "gansu", label: { zh: "平凉市", en: "Pingliang" }, level: "prefecture" },
  { id: "jiuquan", code: "620900", provinceId: "gansu", label: { zh: "酒泉市", en: "Jiuquan" }, level: "prefecture" },
  { id: "qingyang", code: "621000", provinceId: "gansu", label: { zh: "庆阳市", en: "Qingyang" }, level: "prefecture" },
  { id: "dingxi", code: "621100", provinceId: "gansu", label: { zh: "定西市", en: "Dingxi" }, level: "prefecture" },
  { id: "longnan", code: "621200", provinceId: "gansu", label: { zh: "陇南市", en: "Longnan" }, level: "prefecture" },
  { id: "linxia", code: "622900", provinceId: "gansu", label: { zh: "临夏回族自治州", en: "Linxia Hui Autonomous Prefecture" }, level: "prefecture" },
  { id: "gannan", code: "623000", provinceId: "gansu", label: { zh: "甘南藏族自治州", en: "Gannan Tibetan Autonomous Prefecture" }, level: "prefecture" },

  // 青海省
  { id: "xining", code: "630100", provinceId: "qinghai", label: { zh: "西宁市", en: "Xining" }, level: "provincial_capital" },
  { id: "haidong", code: "630200", provinceId: "qinghai", label: { zh: "海东市", en: "Haidong" }, level: "prefecture" },
  { id: "haibei", code: "632200", provinceId: "qinghai", label: { zh: "海北藏族自治州", en: "Haibei Tibetan Autonomous Prefecture" }, level: "prefecture" },
  { id: "huangnan", code: "632300", provinceId: "qinghai", label: { zh: "黄南藏族自治州", en: "Huangnan Tibetan Autonomous Prefecture" }, level: "prefecture" },
  { id: "hainan", code: "632500", provinceId: "qinghai", label: { zh: "海南藏族自治州", en: "Hainan Tibetan Autonomous Prefecture" }, level: "prefecture" },
  { id: "guoluo", code: "632600", provinceId: "qinghai", label: { zh: "果洛藏族自治州", en: "Golog Tibetan Autonomous Prefecture" }, level: "prefecture" },
  { id: "yushu", code: "632700", provinceId: "qinghai", label: { zh: "玉树藏族自治州", en: "Yushu Tibetan Autonomous Prefecture" }, level: "prefecture" },
  { id: "haixi", code: "632800", provinceId: "qinghai", label: { zh: "海西蒙古族藏族自治州", en: "Haixi Mongolian and Tibetan Autonomous Prefecture" }, level: "prefecture" },

  // 内蒙古自治区
  { id: "hohhot", code: "150100", provinceId: "neimenggu", label: { zh: "呼和浩特市", en: "Hohhot" }, level: "provincial_capital" },
  { id: "baotou", code: "150200", provinceId: "neimenggu", label: { zh: "包头市", en: "Baotou" }, level: "prefecture" },
  { id: "wuhai", code: "150300", provinceId: "neimenggu", label: { zh: "乌海市", en: "Wuhai" }, level: "prefecture" },
  { id: "chifeng", code: "150400", provinceId: "neimenggu", label: { zh: "赤峰市", en: "Chifeng" }, level: "prefecture" },
  { id: "tongliao", code: "150500", provinceId: "neimenggu", label: { zh: "通辽市", en: "Tongliao" }, level: "prefecture" },
  { id: "ordos", code: "150600", provinceId: "neimenggu", label: { zh: "鄂尔多斯市", en: "Ordos" }, level: "prefecture" },
  { id: "hulunbuir", code: "150700", provinceId: "neimenggu", label: { zh: "呼伦贝尔市", en: "Hulunbuir" }, level: "prefecture" },
  { id: "bayannur", code: "150800", provinceId: "neimenggu", label: { zh: "巴彦淖尔市", en: "Bayannur" }, level: "prefecture" },
  { id: "ulanqab", code: "150900", provinceId: "neimenggu", label: { zh: "乌兰察布市", en: "Ulanqab" }, level: "prefecture" },
  { id: "xilingol", code: "152500", provinceId: "neimenggu", label: { zh: "锡林郭勒盟", en: "Xilingol League" }, level: "prefecture" },
  { id: "alxa", code: "152900", provinceId: "neimenggu", label: { zh: "阿拉善盟", en: "Alxa League" }, level: "prefecture" },
  { id: "hinggan", code: "152200", provinceId: "neimenggu", label: { zh: "兴安盟", en: "Hinggan League" }, level: "prefecture" },

  // 广西壮族自治区
  { id: "nanning", code: "450100", provinceId: "guangxi", label: { zh: "南宁市", en: "Nanning" }, level: "provincial_capital" },
  { id: "liuzhou", code: "450200", provinceId: "guangxi", label: { zh: "柳州市", en: "Liuzhou" }, level: "prefecture" },
  { id: "guilin", code: "450300", provinceId: "guangxi", label: { zh: "桂林市", en: "Guilin" }, level: "prefecture" },
  { id: "wuzhou", code: "450400", provinceId: "guangxi", label: { zh: "梧州市", en: "Wuzhou" }, level: "prefecture" },
  { id: "beihai", code: "450500", provinceId: "guangxi", label: { zh: "北海市", en: "Beihai" }, level: "prefecture" },
  { id: "fangchenggang", code: "450600", provinceId: "guangxi", label: { zh: "防城港市", en: "Fangchenggang" }, level: "prefecture" },
  { id: "qinzhou", code: "450700", provinceId: "guangxi", label: { zh: "钦州市", en: "Qinzhou" }, level: "prefecture" },
  { id: "guigang", code: "450800", provinceId: "guangxi", label: { zh: "贵港市", en: "Guigang" }, level: "prefecture" },
  { id: "yulin_gx", code: "450900", provinceId: "guangxi", label: { zh: "玉林市", en: "Yulin" }, level: "prefecture" },
  { id: "baise", code: "451000", provinceId: "guangxi", label: { zh: "百色市", en: "Baise" }, level: "prefecture" },
  { id: "hezhou", code: "451100", provinceId: "guangxi", label: { zh: "贺州市", en: "Hezhou" }, level: "prefecture" },
  { id: "hechi", code: "451200", provinceId: "guangxi", label: { zh: "河池市", en: "Hechi" }, level: "prefecture" },
  { id: "laibin", code: "451300", provinceId: "guangxi", label: { zh: "来宾市", en: "Laibin" }, level: "prefecture" },
  { id: "chongzuo", code: "451400", provinceId: "guangxi", label: { zh: "崇左市", en: "Chongzuo" }, level: "prefecture" },

  // 西藏自治区
  { id: "lhasa", code: "540100", provinceId: "xizang", label: { zh: "拉萨市", en: "Lhasa" }, level: "provincial_capital" },
  { id: "shigatse", code: "540200", provinceId: "xizang", label: { zh: "日喀则市", en: "Shigatse" }, level: "prefecture" },
  { id: "qamdo", code: "540300", provinceId: "xizang", label: { zh: "昌都市", en: "Qamdo" }, level: "prefecture" },
  { id: "nyingchi", code: "540400", provinceId: "xizang", label: { zh: "林芝市", en: "Nyingchi" }, level: "prefecture" },
  { id: "shannan", code: "540500", provinceId: "xizang", label: { zh: "山南市", en: "Shannan" }, level: "prefecture" },
  { id: "nagqu", code: "540600", provinceId: "xizang", label: { zh: "那曲市", en: "Nagqu" }, level: "prefecture" },
  { id: "ngari", code: "542500", provinceId: "xizang", label: { zh: "阿里地区", en: "Ngari Prefecture" }, level: "prefecture" },

  // 宁夏回族自治区
  { id: "yinchuan", code: "640100", provinceId: "ningxia", label: { zh: "银川市", en: "Yinchuan" }, level: "provincial_capital" },
  { id: "shizuishan", code: "640200", provinceId: "ningxia", label: { zh: "石嘴山市", en: "Shizuishan" }, level: "prefecture" },
  { id: "wuzhong", code: "640300", provinceId: "ningxia", label: { zh: "吴忠市", en: "Wuzhong" }, level: "prefecture" },
  { id: "guyuan", code: "640400", provinceId: "ningxia", label: { zh: "固原市", en: "Guyuan" }, level: "prefecture" },
  { id: "zhongwei", code: "640500", provinceId: "ningxia", label: { zh: "中卫市", en: "Zhongwei" }, level: "prefecture" },

  // 新疆维吾尔自治区
  { id: "urumqi", code: "650100", provinceId: "xinjiang", label: { zh: "乌鲁木齐市", en: "Urumqi" }, level: "provincial_capital" },
  { id: "karamay", code: "650200", provinceId: "xinjiang", label: { zh: "克拉玛依市", en: "Karamay" }, level: "prefecture" },
  { id: "turpan", code: "650400", provinceId: "xinjiang", label: { zh: "吐鲁番市", en: "Turpan" }, level: "prefecture" },
  { id: "hami", code: "650500", provinceId: "xinjiang", label: { zh: "哈密市", en: "Hami" }, level: "prefecture" },
  { id: "changji", code: "652300", provinceId: "xinjiang", label: { zh: "昌吉回族自治州", en: "Changji Hui Autonomous Prefecture" }, level: "prefecture" },
  { id: "bortala", code: "652700", provinceId: "xinjiang", label: { zh: "博尔塔拉蒙古自治州", en: "Bortala Mongol Autonomous Prefecture" }, level: "prefecture" },
  { id: "bayingolin", code: "652800", provinceId: "xinjiang", label: { zh: "巴音郭楞蒙古自治州", en: "Bayingolin Mongol Autonomous Prefecture" }, level: "prefecture" },
  { id: "aksu", code: "652900", provinceId: "xinjiang", label: { zh: "阿克苏地区", en: "Aksu Prefecture" }, level: "prefecture" },
  { id: "kizilsu", code: "653000", provinceId: "xinjiang", label: { zh: "克孜勒苏柯尔克孜自治州", en: "Kizilsu Kyrgyz Autonomous Prefecture" }, level: "prefecture" },
  { id: "kashgar", code: "653100", provinceId: "xinjiang", label: { zh: "喀什地区", en: "Kashgar Prefecture" }, level: "prefecture" },
  { id: "hotan", code: "653200", provinceId: "xinjiang", label: { zh: "和田地区", en: "Hotan Prefecture" }, level: "prefecture" },
  { id: "ili", code: "654000", provinceId: "xinjiang", label: { zh: "伊犁哈萨克自治州", en: "Ili Kazakh Autonomous Prefecture" }, level: "prefecture" },
  { id: "tacheng", code: "654200", provinceId: "xinjiang", label: { zh: "塔城地区", en: "Tacheng Prefecture" }, level: "prefecture" },
  { id: "altay", code: "654300", provinceId: "xinjiang", label: { zh: "阿勒泰地区", en: "Altay Prefecture" }, level: "prefecture" },

  // 台湾省
  { id: "taipei", code: "710100", provinceId: "taiwan", label: { zh: "台北市", en: "Taipei" }, level: "provincial_capital" },
  { id: "kaohsiung", code: "710200", provinceId: "taiwan", label: { zh: "高雄市", en: "Kaohsiung" }, level: "prefecture" },
  { id: "taichung", code: "710300", provinceId: "taiwan", label: { zh: "台中市", en: "Taichung" }, level: "prefecture" },
  { id: "tainan", code: "710400", provinceId: "taiwan", label: { zh: "台南市", en: "Tainan" }, level: "prefecture" },
  { id: "hsinchu", code: "710500", provinceId: "taiwan", label: { zh: "新竹市", en: "Hsinchu" }, level: "prefecture" },
  { id: "keelung", code: "710600", provinceId: "taiwan", label: { zh: "基隆市", en: "Keelung" }, level: "prefecture" },

  // 香港特别行政区
  { id: "hongkong", code: "810100", provinceId: "hongkong", label: { zh: "香港特别行政区", en: "Hong Kong" }, level: "special_administrative_region" },

  // 澳门特别行政区
  { id: "macao", code: "820100", provinceId: "macao", label: { zh: "澳门特别行政区", en: "Macao" }, level: "special_administrative_region" }
];

// 导出城市数据供其他模块使用
export { cities as allCities };