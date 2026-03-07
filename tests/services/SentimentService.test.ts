import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SentimentService, type Comment, type RealtimeStats, type SatisfactionDistribution } from '@/services/SentimentService';

describe('SentimentService', () => {
  // 模拟alert函数，用于测试exportReport方法
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    // 恢复原始alert函数
    vi.restoreAllMocks();
  });

  describe('getSentimentLabel', () => {
    it('should return correct label for positive sentiment', () => {
      expect(SentimentService.getSentimentLabel('positive')).toBe('正面');
    });

    it('should return correct label for neutral sentiment', () => {
      expect(SentimentService.getSentimentLabel('neutral')).toBe('中性');
    });

    it('should return correct label for negative sentiment', () => {
      expect(SentimentService.getSentimentLabel('negative')).toBe('负面');
    });

    it('should return unknown for invalid sentiment', () => {
      expect(SentimentService.getSentimentLabel('invalid')).toBe('未知');
    });

    it('should return unknown for empty string', () => {
      expect(SentimentService.getSentimentLabel('')).toBe('未知');
    });
  });

  describe('getRealtimeStats', () => {
    it('should return correct realtime stats structure', () => {
      const stats: RealtimeStats = SentimentService.getRealtimeStats();
      expect(stats).toHaveProperty('positive');
      expect(stats).toHaveProperty('neutral');
      expect(stats).toHaveProperty('negative');
      expect(typeof stats.positive).toBe('number');
      expect(typeof stats.neutral).toBe('number');
      expect(typeof stats.negative).toBe('number');
    });

    it('should return correct realtime stats values', () => {
      const stats: RealtimeStats = SentimentService.getRealtimeStats();
      expect(stats.positive).toBe(75);
      expect(stats.neutral).toBe(15);
      expect(stats.negative).toBe(10);
    });

    it('should return a new object on each call', () => {
      const stats1: RealtimeStats = SentimentService.getRealtimeStats();
      const stats2: RealtimeStats = SentimentService.getRealtimeStats();
      expect(stats1).not.toBe(stats2); // 应该是不同的引用
      expect(stats1).toEqual(stats2); // 但内容应该相同
    });
  });

  describe('getLatestComments', () => {
    it('should return array of comments', () => {
      const comments: Comment[] = SentimentService.getLatestComments();
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBeGreaterThan(0);
    });

    it('should return comments with correct structure', () => {
      const comments: Comment[] = SentimentService.getLatestComments();
      comments.forEach(comment => {
        expect(comment).toHaveProperty('id');
        expect(comment).toHaveProperty('user');
        expect(comment).toHaveProperty('content');
        expect(comment).toHaveProperty('sentiment');
        expect(comment).toHaveProperty('time');
        expect(['positive', 'neutral', 'negative']).toContain(comment.sentiment);
      });
    });

    it('should return a new array on each call', () => {
      const comments1: Comment[] = SentimentService.getLatestComments();
      const comments2: Comment[] = SentimentService.getLatestComments();
      expect(comments1).not.toBe(comments2); // 应该是不同的引用
      expect(comments1).toEqual(comments2); // 但内容应该相同
    });

    it('should return comments in correct order', () => {
      const comments: Comment[] = SentimentService.getLatestComments();
      // 检查第一条评论是否为最新时间
      expect(comments[0].time).toBe('今天 10:30');
      expect(comments[comments.length - 1].time).toBe('昨天 16:50');
    });
  });

  describe('getReputationTrend', () => {
    it('should return array of numbers', () => {
      const trend: number[] = SentimentService.getReputationTrend();
      expect(Array.isArray(trend)).toBe(true);
      expect(trend.length).toBe(30); // 根据模拟数据，应该返回30个数据点
      trend.forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    it('should return a new array on each call', () => {
      const trend1: number[] = SentimentService.getReputationTrend();
      const trend2: number[] = SentimentService.getReputationTrend();
      expect(trend1).not.toBe(trend2); // 应该是不同的引用
      expect(trend1).toEqual(trend2); // 但内容应该相同
    });

    it('should return expected reputation trend values', () => {
      const trend: number[] = SentimentService.getReputationTrend();
      // 检查第一个和最后一个值
      expect(trend[0]).toBe(65);
      expect(trend[trend.length - 1]).toBe(106);
    });
  });

  describe('getCurrentReputation', () => {
    it('should return a number', () => {
      const reputation: number = SentimentService.getCurrentReputation();
      expect(typeof reputation).toBe('number');
    });

    it('should return expected current reputation value', () => {
      const reputation: number = SentimentService.getCurrentReputation();
      expect(reputation).toBe(106);
    });
  });

  describe('getSatisfactionScore', () => {
    it('should return a number', () => {
      const score: number = SentimentService.getSatisfactionScore();
      expect(typeof score).toBe('number');
    });

    it('should return expected satisfaction score', () => {
      const score: number = SentimentService.getSatisfactionScore();
      expect(score).toBe(85);
    });

    it('should return a value between 0 and 100', () => {
      const score: number = SentimentService.getSatisfactionScore();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('getSatisfactionDistribution', () => {
    it('should return correct satisfaction distribution structure', () => {
      const distribution: SatisfactionDistribution = SentimentService.getSatisfactionDistribution();
      expect(distribution).toHaveProperty('verySatisfied');
      expect(distribution).toHaveProperty('satisfied');
      expect(distribution).toHaveProperty('neutral');
      expect(distribution).toHaveProperty('dissatisfied');
      expect(distribution).toHaveProperty('veryDissatisfied');
      
      expect(typeof distribution.verySatisfied).toBe('number');
      expect(typeof distribution.satisfied).toBe('number');
      expect(typeof distribution.neutral).toBe('number');
      expect(typeof distribution.dissatisfied).toBe('number');
      expect(typeof distribution.veryDissatisfied).toBe('number');
    });

    it('should return expected satisfaction distribution values', () => {
      const distribution: SatisfactionDistribution = SentimentService.getSatisfactionDistribution();
      expect(distribution.verySatisfied).toBe(45);
      expect(distribution.satisfied).toBe(30);
      expect(distribution.neutral).toBe(15);
      expect(distribution.dissatisfied).toBe(8);
      expect(distribution.veryDissatisfied).toBe(2);
    });

    it('should return a new object on each call', () => {
      const distribution1: SatisfactionDistribution = SentimentService.getSatisfactionDistribution();
      const distribution2: SatisfactionDistribution = SentimentService.getSatisfactionDistribution();
      expect(distribution1).not.toBe(distribution2); // 应该是不同的引用
      expect(distribution1).toEqual(distribution2); // 但内容应该相同
    });
  });

  describe('exportReport', () => {
    it('should call alert when exporting report', () => {
      SentimentService.exportReport();
      expect(window.alert).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('舆情报告导出成功');
    });
  });
});
