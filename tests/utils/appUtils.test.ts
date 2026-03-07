import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  getModuleIcon, 
  getCoreDataLabel, 
  getChannelTypeName, 
  formatNumber, 
  generateId, 
  getDaysDifference, 
  formatDate, 
  formatPercentage, 
  generateRandomColor, 
  debounce, 
  throttle, 
  deepClone, 
  getRandomElement, 
  shuffleArray, 
  formatFileSize, 
  isDevEnv, 
  isProdEnv, 
  getEnvVar
} from '@/utils/appUtils';

describe('appUtils', () => {
  describe('getModuleIcon', () => {
    it('should return correct icon for existing module', () => {
      expect(getModuleIcon('core-data')).toBe('📊');
      expect(getModuleIcon('balance-info')).toBe('💰');
    });
    
    it('should return default icon for non-existing module', () => {
      expect(getModuleIcon('non-existing-module')).toBe('📦');
    });
    
    it('should return default icon for empty string', () => {
      expect(getModuleIcon('')).toBe('📦');
    });
  });
  
  describe('getCoreDataLabel', () => {
    it('should return correct label for existing key', () => {
      expect(getCoreDataLabel('money')).toBe('当前资金');
      expect(getCoreDataLabel('balance')).toBe('余额');
    });
    
    it('should return key itself for non-existing key', () => {
      expect(getCoreDataLabel('non-existing-key')).toBe('non-existing-key');
    });
    
    it('should return custom label when provided', () => {
      const customLabels = { 'custom-key': '自定义标签' };
      expect(getCoreDataLabel('custom-key', customLabels)).toBe('自定义标签');
    });
    
    it('should return custom label over default label', () => {
      const customLabels = { 'money': '自定义资金' };
      expect(getCoreDataLabel('money', customLabels)).toBe('自定义资金');
    });
    
    it('should return empty string for empty key', () => {
      expect(getCoreDataLabel('')).toBe('');
    });
  });
  
  describe('getChannelTypeName', () => {
    it('should return correct label for existing channel type', () => {
      expect(getChannelTypeName('online')).toBe('线上');
      expect(getChannelTypeName('offline')).toBe('线下');
    });
    
    it('should return default label for non-existing channel type', () => {
      expect(getChannelTypeName('non-existing-type')).toBe('未知');
    });
    
    it('should return default label for empty string', () => {
      expect(getChannelTypeName('')).toBe('未知');
    });
  });
  
  describe('formatNumber', () => {
    it('should format integer correctly', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(0)).toBe('0');
    });
    
    it('should format decimal number correctly', () => {
      expect(formatNumber(1234.567)).toBe('1,234.567');
      expect(formatNumber(1000.123)).toBe('1,000.123');
    });
    
    it('should format negative number correctly', () => {
      expect(formatNumber(-1234567)).toBe('-1,234,567');
      expect(formatNumber(-1234.567)).toBe('-1,234.567');
    });
    
    it('should format small number correctly', () => {
      expect(formatNumber(123)).toBe('123');
      expect(formatNumber(99)).toBe('99');
    });
  });
  
  describe('generateId', () => {
    it('should generate unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
    
    it('should generate id in correct format', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });
  
  describe('getDaysDifference', () => {
    it('should calculate correct days difference', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-05');
      expect(getDaysDifference(date1, date2)).toBe(4);
    });
    
    it('should return positive number regardless of date order', () => {
      const date1 = new Date('2024-01-05');
      const date2 = new Date('2024-01-01');
      expect(getDaysDifference(date1, date2)).toBe(4);
    });
    
    it('should return 0 for same dates', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-01');
      expect(getDaysDifference(date1, date2)).toBe(0);
    });
    
    it('should calculate correct days difference for dates with time', () => {
      const date1 = new Date('2024-01-01 23:59:59');
      const date2 = new Date('2024-01-02 00:00:01');
      expect(getDaysDifference(date1, date2)).toBe(1);
    });
  });
  
  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2024-01-01');
      expect(formatDate(date)).toBe('2024-01-01');
    });
    
    it('should format date with custom format', () => {
      const date = new Date('2024-01-01 14:30:45');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-01 14:30:45');
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/01/2024');
      expect(formatDate(date, 'YYYY年MM月DD日')).toBe('2024年01月01日');
    });
    
    it('should format date with single digit components correctly', () => {
      const date = new Date('2024-01-05 09:05:03');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-05 09:05:03');
    });
  });
  
  describe('formatPercentage', () => {
    it('should format decimal to percentage with default digits', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%');
      expect(formatPercentage(0.5)).toBe('50.00%');
      expect(formatPercentage(1)).toBe('100.00%');
    });
    
    it('should format decimal to percentage with custom digits', () => {
      expect(formatPercentage(0.1234, 1)).toBe('12.3%');
      expect(formatPercentage(0.1234, 0)).toBe('12%');
      expect(formatPercentage(0.1234, 3)).toBe('12.340%');
    });
    
    it('should format zero correctly', () => {
      expect(formatPercentage(0)).toBe('0.00%');
    });
    
    it('should format negative number correctly', () => {
      expect(formatPercentage(-0.1234)).toBe('-12.34%');
    });
  });
  
  describe('generateRandomColor', () => {
    it('should generate valid hex color', () => {
      const color = generateRandomColor();
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });
    
    it('should generate different colors on multiple calls', () => {
      const color1 = generateRandomColor();
      const color2 = generateRandomColor();
      const color3 = generateRandomColor();
      
      // 虽然理论上可能重复，但概率极低
      expect(color1).not.toBe(color2);
      expect(color2).not.toBe(color3);
    });
  });
  
  describe('debounce', () => {
    let setTimeoutSpy: any;
    let clearTimeoutSpy: any;
    
    beforeEach(() => {
      setTimeoutSpy = vi.spyOn(global, 'setTimeout').mockImplementation((fn) => {
        fn();
        return 1 as unknown as NodeJS.Timeout;
      });
      clearTimeoutSpy = vi.spyOn(global, 'clearTimeout').mockImplementation(() => {});
    });
    
    afterEach(() => {
      setTimeoutSpy.mockRestore();
      clearTimeoutSpy.mockRestore();
    });
    
    it('should call function after delay', () => {
      const mockFunc = vi.fn();
      const debouncedFunc = debounce(mockFunc, 300);
      
      debouncedFunc();
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 300);
      expect(mockFunc).toHaveBeenCalled();
    });
    
    it('should clear previous timeout when called multiple times', () => {
      const mockFunc = vi.fn();
      const debouncedFunc = debounce(mockFunc, 300);
      
      debouncedFunc();
      debouncedFunc();
      debouncedFunc();
      
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
      expect(setTimeoutSpy).toHaveBeenCalledTimes(3);
    });
  });
  
  describe('throttle', () => {
    let nowSpy: any;
    
    beforeEach(() => {
      nowSpy = vi.spyOn(Date, 'now').mockReturnValue(0);
    });
    
    afterEach(() => {
      nowSpy.mockRestore();
    });
    
    it('should call function immediately', () => {
      const mockFunc = vi.fn();
      const throttledFunc = throttle(mockFunc, 300);
      
      throttledFunc();
      expect(mockFunc).toHaveBeenCalledTimes(1);
    });
    
    it('should not call function again within delay', () => {
      const mockFunc = vi.fn();
      const throttledFunc = throttle(mockFunc, 300);
      
      throttledFunc();
      
      // 模拟时间过去100ms
      nowSpy.mockReturnValue(100);
      throttledFunc();
      
      expect(mockFunc).toHaveBeenCalledTimes(1);
    });
    
    it('should call function again after delay', () => {
      const mockFunc = vi.fn();
      const throttledFunc = throttle(mockFunc, 300);
      
      throttledFunc();
      
      // 模拟时间过去300ms
      nowSpy.mockReturnValue(300);
      throttledFunc();
      
      expect(mockFunc).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('deepClone', () => {
    it('should clone primitive values correctly', () => {
      expect(deepClone(1)).toBe(1);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBeNull();
      expect(deepClone(undefined)).toBeUndefined();
    });
    
    it('should clone object correctly', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clonedObj = deepClone(obj);
      
      expect(clonedObj).toEqual(obj);
      expect(clonedObj).not.toBe(obj);
      expect(clonedObj.b).not.toBe(obj.b);
      
      // 修改原对象，克隆对象不应受影响
      obj.b.c = 3;
      expect(clonedObj.b.c).toBe(2);
    });
    
    it('should clone array correctly', () => {
      const arr = [1, 2, { a: 3 }];
      const clonedArr = deepClone(arr);
      
      expect(clonedArr).toEqual(arr);
      expect(clonedArr).not.toBe(arr);
      expect(clonedArr[2]).not.toBe(arr[2]);
      
      // 修改原数组，克隆数组不应受影响
      arr[2].a = 4;
      expect(clonedArr[2].a).toBe(3);
    });
    
    it('should clone Date object correctly', () => {
      const date = new Date('2024-01-01');
      const clonedDate = deepClone(date);
      
      expect(clonedDate).toEqual(date);
      expect(clonedDate).not.toBe(date);
      expect(clonedDate.getTime()).toBe(date.getTime());
    });
  });
  
  describe('getRandomElement', () => {
    it('should return element from array', () => {
      const array = [1, 2, 3, 4, 5];
      const element = getRandomElement(array);
      
      expect(array).toContain(element);
    });
    
    it('should throw error for empty array', () => {
      expect(() => getRandomElement([])).toThrow('数组不能为空');
    });
    
    it('should return the only element for single element array', () => {
      const array = [42];
      expect(getRandomElement(array)).toBe(42);
    });
  });
  
  describe('shuffleArray', () => {
    it('should return array with same elements', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffledArray = shuffleArray(array);
      
      expect(shuffledArray.sort()).toEqual(array.sort());
    });
    
    it('should return new array', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffledArray = shuffleArray(array);
      
      expect(shuffledArray).not.toBe(array);
    });
    
    it('should shuffle array elements', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffledArray = shuffleArray(array);
      
      // 虽然理论上可能顺序相同，但概率极低
      expect(shuffledArray).not.toEqual(array);
    });
    
    it('should handle empty array', () => {
      const array: any[] = [];
      const shuffledArray = shuffleArray(array);
      
      expect(shuffledArray).toEqual([]);
      expect(shuffledArray).not.toBe(array);
    });
  });
  
  describe('formatFileSize', () => {
    it('should format file size correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1048576)).toBe('1.00 MB');
      expect(formatFileSize(1073741824)).toBe('1.00 GB');
    });
    
    it('should format file size with custom digits', () => {
      expect(formatFileSize(1024, 1)).toBe('1.0 KB');
      expect(formatFileSize(1024, 0)).toBe('1 KB');
      expect(formatFileSize(1536, 1)).toBe('1.5 KB');
    });
    
    it('should format file size for bytes correctly', () => {
      expect(formatFileSize(512)).toBe('512.00 Bytes');
      expect(formatFileSize(100)).toBe('100.00 Bytes');
    });
  });
  
  describe('isDevEnv', () => {
    it('should return true for development mode', () => {
      // 模拟开发环境
      vi.stubEnv('MODE', 'development');
      expect(isDevEnv()).toBe(true);
    });
    
    it('should return false for production mode', () => {
      // 模拟生产环境
      vi.stubEnv('MODE', 'production');
      expect(isDevEnv()).toBe(false);
    });
  });
  
  describe('isProdEnv', () => {
    it('should return true for production mode', () => {
      // 模拟生产环境
      vi.stubEnv('MODE', 'production');
      expect(isProdEnv()).toBe(true);
    });
    
    it('should return false for development mode', () => {
      // 模拟开发环境
      vi.stubEnv('MODE', 'development');
      expect(isProdEnv()).toBe(false);
    });
  });
  
  describe('getEnvVar', () => {
    it('should return environment variable value', () => {
      // 模拟环境变量
      vi.stubEnv('TEST_VAR', 'test-value');
      expect(getEnvVar('TEST_VAR')).toBe('test-value');
    });
    
    it('should return default value for non-existing environment variable', () => {
      // 确保环境变量不存在
      delete process.env.NON_EXISTING_VAR;
      expect(getEnvVar('NON_EXISTING_VAR')).toBe('');
      expect(getEnvVar('NON_EXISTING_VAR', 'default-value')).toBe('default-value');
    });
    
    it('should return empty string for non-existing environment variable with no default', () => {
      // 确保环境变量不存在
      delete process.env.NON_EXISTING_VAR;
      expect(getEnvVar('NON_EXISTING_VAR')).toBe('');
    });
  });
});
