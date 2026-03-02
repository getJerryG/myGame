/**
 * 应用工具函数集合
 *
 * @description 提供应用中常用的工具函数，包括图标获取、数据格式化、日期处理等
 * @example
 * ```typescript
 * import { getModuleIcon, formatNumber, formatDate } from '@/utils/appUtils';
 *
 * // 获取模块图标
 * const icon = getModuleIcon('core-data'); // 返回 '📊'
 *
 * // 格式化数字
 * const formattedNum = formatNumber(1234567); // 返回 '1,234,567'
 *
 * // 格式化日期
 * const formattedDate = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'); // 返回格式化后的日期字符串
 * ```
 */

// 模块图标映射
const MODULE_ICONS: Record<string, string> = {
  // 数据中心模块图标
  'core-data': '📊',
  'revenue-analysis': '💰',
  'user-profile': '👥',
  'data-trends': '📈',

  // 钱包模块图标
  'balance-info': '💰',
  'transaction-history': '📜',

  // 默认图标
  default: '📦',
};

// 核心数据标签映射
const CORE_DATA_LABELS: Record<string, string> = {
  // 通用核心数据
  money: '当前资金',
  reputation: '声望',
  popularity: '游戏热度',
  wordOfMouth: '口碑',
  totalMoney: '累计总流水',
  heroCount: '已上线英雄',
  skinCount: '已上线皮肤',
  downloads: '下载量',
  dau: '日活跃用户',
  mau: '月活跃用户',
  totalRevenue: '总收入',
  dailyRevenue: '日收入',
  marketSentiment: '市场情绪',
  sevenDayRetention: '七日留存率',
  paymentRate: '付费率',
  arpu: 'ARPU',
  userComplaints: '用户投诉量',
  revenue: '收入',

  // 钱包模块数据
  balance: '余额',
};

// 渠道类型标签映射
const CHANNEL_TYPE_LABELS: Record<string, string> = {
  online: '线上',
  offline: '线下',
  cooperation: '合作',
  default: '未知',
};

/**
 * 获取模块图标
 *
 * @description 根据模块ID获取对应的图标
 * @param {string} moduleId - 模块唯一标识符
 * @returns {string} 模块对应的图标字符串
 * @example
 * ```typescript
 * const icon = getModuleIcon('core-data'); // 返回 '📊'
 * const defaultIcon = getModuleIcon('unknown-module'); // 返回 '📦'
 * ```
 */
export const getModuleIcon = (moduleId: string): string => {
  return MODULE_ICONS[moduleId] || MODULE_ICONS.default;
};

/**
 * 获取核心数据标签
 *
 * @description 根据数据键名获取对应的中文标签，支持自定义标签映射
 * @param {string} key - 数据键名
 * @param {Record<string, string>} [customLabels={}] - 自定义标签映射，优先级高于默认映射
 * @returns {string} 数据对应的中文标签
 * @example
 * ```typescript
 * const label = getCoreDataLabel('money'); // 返回 '当前资金'
 * const customLabel = getCoreDataLabel('customKey', { customKey: '自定义标签' }); // 返回 '自定义标签'
 * ```
 */
export const getCoreDataLabel = (
  key: string,
  customLabels: Record<string, string> = {},
): string => {
  return customLabels[key] || CORE_DATA_LABELS[key] || key;
};

/**
 * 获取渠道类型名称
 *
 * @description 根据渠道类型获取对应的中文名称
 * @param {string} type - 渠道类型
 * @returns {string} 渠道类型对应的中文名称
 * @example
 * ```typescript
 * const channelName = getChannelTypeName('online'); // 返回 '线上'
 * const defaultChannelName = getChannelTypeName('unknown'); // 返回 '未知'
 * ```
 */
export const getChannelTypeName = (type: string): string => {
  return CHANNEL_TYPE_LABELS[type] || CHANNEL_TYPE_LABELS.default;
};

/**
 * 格式化数字，添加千位分隔符
 *
 * @description 将数字格式化为带有千位分隔符的字符串，仅对整数部分添加分隔符
 * @param {number} num - 需要格式化的数字
 * @returns {string} 带有千位分隔符的数字字符串
 * @example
 * ```typescript
 * const formattedNum = formatNumber(1234567); // 返回 '1,234,567'
 * const formattedDecimal = formatNumber(1234.567); // 返回 '1,234.567'
 * ```
 */
export const formatNumber = (num: number): string => {
  const numStr = num.toString();
  const [integerPart, decimalPart] = numStr.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (decimalPart) {
    return `${formattedInteger}.${decimalPart}`;
  }

  return formattedInteger;
};

/**
 * 生成唯一ID
 *
 * @description 生成基于时间戳和随机字符串的唯一ID
 * @returns {string} 唯一ID字符串，格式为 'timestamp-random'
 * @example
 * ```typescript
 * const id = generateId(); // 返回类似 '1709234567890-abc123def'
 * ```
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * 计算两个日期之间的天数差
 *
 * @description 计算两个日期对象之间的天数差，结果为正数
 * @param {Date} date1 - 第一个日期对象
 * @param {Date} date2 - 第二个日期对象
 * @returns {number} 两个日期之间的天数差
 * @example
 * ```typescript
 * const date1 = new Date('2024-01-01');
 * const date2 = new Date('2024-01-05');
 * const daysDiff = getDaysDifference(date1, date2); // 返回 4
 * ```
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * 格式化日期为指定格式
 *
 * @description 将日期对象格式化为指定格式的字符串
 * @param {Date} date - 日期对象
 * @param {string} [format='YYYY-MM-DD'] - 格式化字符串，支持的格式：
 *                                         YYYY - 年份
 *                                         MM - 月份(01-12)
 *                                         DD - 日期(01-31)
 *                                         HH - 小时(00-23)
 *                                         mm - 分钟(00-59)
 *                                         ss - 秒(00-59)
 * @returns {string} 格式化后的日期字符串
 * @example
 * ```typescript
 * const date = new Date('2024-01-01 14:30:45');
 * const formattedDate1 = formatDate(date); // 返回 '2024-01-01'
 * const formattedDate2 = formatDate(date, 'YYYY-MM-DD HH:mm:ss'); // 返回 '2024-01-01 14:30:45'
 * const formattedDate3 = formatDate(date, 'MM/DD/YYYY'); // 返回 '01/01/2024'
 * ```
 */
export const formatDate = (date: Date, format = 'YYYY-MM-DD'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 格式化百分比
 *
 * @description 将小数格式化为百分比字符串
 * @param {number} value - 小数数值
 * @param {number} [digits=2] - 保留的小数位数
 * @returns {string} 格式化后的百分比字符串
 * @example
 * ```typescript
 * const percent = formatPercentage(0.1234); // 返回 '12.34%'
 * const percent2 = formatPercentage(0.5); // 返回 '50.00%'
 * const percent3 = formatPercentage(0.789, 1); // 返回 '78.9%'
 * ```
 */
export const formatPercentage = (value: number, digits = 2): string => {
  return `${(value * 100).toFixed(digits)}%`;
};

/**
 * 生成随机颜色
 *
 * @description 生成随机的十六进制颜色代码
 * @returns {string} 十六进制颜色代码
 * @example
 * ```typescript
 * const color = generateRandomColor(); // 返回类似 '#1a2b3c'
 * ```
 */
export const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * 防抖函数
 *
 * @description 限制函数在指定时间内只能执行一次
 * @param {Function} func - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 * @example
 * ```typescript
 * const debouncedFunction = debounce(() => {
 *   // 执行的逻辑
 * }, 300);
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 节流函数
 *
 * @description 限制函数在指定时间内只能执行一次
 * @param {Function} func - 需要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流处理后的函数
 * @example
 * ```typescript
 * const throttledFunction = throttle(() => {
 *   // 执行的逻辑
 * }, 300);
 * ```
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * 深拷贝对象
 *
 * @description 深拷贝一个对象
 * @param {T} obj - 需要深拷贝的对象
 * @returns {T} 深拷贝后的对象
 * @example
 * ```typescript
 * const obj = { a: 1, b: { c: 2 } };
 * const copiedObj = deepClone(obj);
 * ```
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * 从数组中随机选择一个元素
 *
 * @description 从数组中随机选择一个元素
 * @param {T[]} array - 输入数组
 * @returns {T} 随机选择的元素
 * @example
 * ```typescript
 * const array = [1, 2, 3, 4, 5];
 * const randomElement = getRandomElement(array); // 返回数组中的一个随机元素
 * ```
 */
export const getRandomElement = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error('数组不能为空');
  }
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * 打乱数组
 *
 * @description 打乱数组的顺序
 * @param {T[]} array - 输入数组
 * @returns {T[]} 打乱后的数组
 * @example
 * ```typescript
 * const array = [1, 2, 3, 4, 5];
 * const shuffledArray = shuffleArray(array); // 返回打乱顺序后的数组
 * ```
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * 格式化文件大小
 *
 * @description 将字节数格式化为人类可读的文件大小
 * @param {number} bytes - 字节数
 * @param {number} [digits=2] - 保留的小数位数
 * @returns {string} 格式化后的文件大小
 * @example
 * ```typescript
 * const size = formatFileSize(1024); // 返回 '1.00 KB'
 * const size2 = formatFileSize(1048576); // 返回 '1.00 MB'
 * ```
 */
export const formatFileSize = (bytes: number, digits = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(digits)} ${sizes[i]}`;
};

/**
 * 检查是否为开发环境
 *
 * @description 检查当前环境是否为开发环境
 * @returns {boolean} 是否为开发环境
 * @example
 * ```typescript
 * if (isDevEnv()) {
 *   // 开发环境下的逻辑
 * }
 * ```
 */
export const isDevEnv = (): boolean => {
  return import.meta.env.MODE === 'development';
};

/**
 * 检查是否为生产环境
 *
 * @description 检查当前环境是否为生产环境
 * @returns {boolean} 是否为生产环境
 * @example
 * ```typescript
 * if (isProdEnv()) {
 *   // 生产环境下的逻辑
 * }
 * ```
 */
export const isProdEnv = (): boolean => {
  return import.meta.env.MODE === 'production';
};

/**
 * 获取环境变量
 *
 * @description 获取指定的环境变量值
 * @param {string} key - 环境变量键名
 * @param {string} [defaultValue=''] - 默认值
 * @returns {string} 环境变量值
 * @example
 * ```typescript
 * const apiUrl = getEnvVar('VITE_API_URL', 'http://localhost:3000');
 * ```
 */
export const getEnvVar = (key: string, defaultValue = ''): string => {
  return (import.meta.env as any)[key] || defaultValue;
};
