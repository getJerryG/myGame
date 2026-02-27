import { describe, it, expect } from 'vitest';
import { 
  getModuleIcon, 
  getCoreDataLabel, 
  getChannelTypeName, 
  formatNumber, 
  generateId, 
  getDaysDifference, 
  formatDate 
} from '@/utils/appUtils';

describe('appUtils', () => {
  describe('getModuleIcon', () => {
    it('returns correct icon for known module id', () => {
      expect(getModuleIcon('core-data')).toBe('📊');
      expect(getModuleIcon('revenue-analysis')).toBe('💰');
      expect(getModuleIcon('balance-info')).toBe('💰');
    });

    it('returns default icon for unknown module id', () => {
      expect(getModuleIcon('unknown-module')).toBe('📦');
      expect(getModuleIcon('')).toBe('📦');
    });
  });

  describe('getCoreDataLabel', () => {
    it('returns correct label for known key', () => {
      expect(getCoreDataLabel('money')).toBe('当前资金');
      expect(getCoreDataLabel('reputation')).toBe('声望');
      expect(getCoreDataLabel('popularity')).toBe('游戏热度');
    });

    it('returns custom label when provided', () => {
      const customLabels = {
        money: '自定义资金',
        reputation: '自定义声望'
      };
      
      expect(getCoreDataLabel('money', customLabels)).toBe('自定义资金');
      expect(getCoreDataLabel('reputation', customLabels)).toBe('自定义声望');
      // 对于未在自定义标签中定义的key，仍返回默认标签
      expect(getCoreDataLabel('popularity', customLabels)).toBe('游戏热度');
    });

    it('returns the key itself for unknown keys without custom labels', () => {
      expect(getCoreDataLabel('unknown-key')).toBe('unknown-key');
      expect(getCoreDataLabel('')).toBe('');
    });

    it('returns custom label for unknown keys when provided', () => {
      const customLabels = {
        'unknown-key': '自定义未知key'
      };
      
      expect(getCoreDataLabel('unknown-key', customLabels)).toBe('自定义未知key');
    });
  });

  describe('getChannelTypeName', () => {
    it('returns correct name for known channel type', () => {
      expect(getChannelTypeName('online')).toBe('线上');
      expect(getChannelTypeName('offline')).toBe('线下');
      expect(getChannelTypeName('cooperation')).toBe('合作');
    });

    it('returns default name for unknown channel type', () => {
      expect(getChannelTypeName('unknown-type')).toBe('未知');
      expect(getChannelTypeName('')).toBe('未知');
    });
  });

  describe('formatNumber', () => {
    it('formats integers with thousands separators', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(999999999)).toBe('999,999,999');
    });

    it('formats decimal numbers with thousands separators', () => {
      expect(formatNumber(1000.5)).toBe('1,000.5');
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
      expect(formatNumber(0.12345)).toBe('0.12345');
    });

    it('formats negative numbers correctly', () => {
      expect(formatNumber(-1000)).toBe('-1,000');
      expect(formatNumber(-1234567.89)).toBe('-1,234,567.89');
    });
  });

  describe('generateId', () => {
    it('generates unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      const id3 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('generates id in correct format', () => {
      const id = generateId();
      const parts = id.split('-');
      
      // 格式应为 timestamp-random
      expect(parts.length).toBe(2);
      
      // 第一部分应为数字（时间戳）
      expect(!isNaN(Number(parts[0]))).toBe(true);
      
      // 第二部分应为字母和数字的组合
      expect(/^[a-z0-9]+$/i.test(parts[1])).toBe(true);
    });
  });

  describe('getDaysDifference', () => {
    it('returns correct difference between two dates', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-05');
      const date3 = new Date('2024-02-01');
      
      expect(getDaysDifference(date1, date2)).toBe(4);
      expect(getDaysDifference(date2, date1)).toBe(4); // 结果应为正数
      expect(getDaysDifference(date1, date3)).toBe(31);
    });

    it('returns 0 for the same date', () => {
      const date = new Date('2024-01-01');
      expect(getDaysDifference(date, date)).toBe(0);
    });

    it('handles leap year correctly', () => {
      // 2024是闰年，2月有29天
      const date1 = new Date('2024-02-28');
      const date2 = new Date('2024-03-01');
      expect(getDaysDifference(date1, date2)).toBe(2);
      
      // 2023不是闰年，2月有28天
      const date3 = new Date('2023-02-28');
      const date4 = new Date('2023-03-01');
      expect(getDaysDifference(date3, date4)).toBe(1);
    });
  });

  describe('formatDate', () => {
    it('formats date in default YYYY-MM-DD format', () => {
      const date = new Date('2024-01-01');
      expect(formatDate(date)).toBe('2024-01-01');
      
      const date2 = new Date('2024-12-31');
      expect(formatDate(date2)).toBe('2024-12-31');
    });

    it('formats date with time in YYYY-MM-DD HH:mm:ss format', () => {
      const date = new Date('2024-01-01T14:30:45');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-01 14:30:45');
      
      const date2 = new Date('2024-12-31T23:59:59');
      expect(formatDate(date2, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-12-31 23:59:59');
    });

    it('formats date in custom format', () => {
      const date = new Date('2024-01-01T14:30:45');
      
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/01/2024');
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('01/01/2024');
      expect(formatDate(date, 'YYYY年MM月DD日')).toBe('2024年01月01日');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm')).toBe('2024-01-01 14:30');
      expect(formatDate(date, 'HH:mm:ss')).toBe('14:30:45');
    });

    it('handles single digit months and days correctly', () => {
      const date = new Date('2024-01-01');
      // 确保月份和日期被格式化为两位数
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/01/2024');
      
      const date2 = new Date('2024-05-08');
      expect(formatDate(date2, 'MM/DD/YYYY')).toBe('05/08/2024');
    });

    it('handles single digit hours, minutes and seconds correctly', () => {
      const date = new Date('2024-01-01T01:02:03');
      expect(formatDate(date, 'HH:mm:ss')).toBe('01:02:03');
      
      const date2 = new Date('2024-01-01T09:08:07');
      expect(formatDate(date2, 'HH:mm:ss')).toBe('09:08:07');
    });
  });
});
