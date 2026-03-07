import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollabService, type Collab, type CreateCollabParams } from '@/services/CollabService';

describe('CollabService', () => {
  // 测试数据
  const mockCollabs: Collab[] = [
    {
      id: 'collab-1',
      name: '与知名IP联动活动',
      description: '与某知名动漫IP进行联动，推出限定皮肤和活动',
      startTime: '2024-01-01',
      endTime: '2024-01-31',
      status: '进行中',
      expectedRevenue: 500000,
    },
    {
      id: 'collab-2',
      name: '节日主题联动',
      description: '春节主题联动活动，推出限定英雄和皮肤',
      startTime: '2023-12-01',
      endTime: '2024-01-15',
      status: '已结束',
      expectedRevenue: 300000,
      actualRevenue: 350000,
    },
  ];

  describe('getCollabs', () => {
    it('should return all collabs', () => {
      const collabs = CollabService.getCollabs();
      expect(collabs).toBeDefined();
      expect(collabs.length).toBeGreaterThan(0);
      expect(collabs[0]).toHaveProperty('id');
      expect(collabs[0]).toHaveProperty('name');
      expect(collabs[0]).toHaveProperty('description');
      expect(collabs[0]).toHaveProperty('status');
      expect(collabs[0]).toHaveProperty('expectedRevenue');
    });

    it('should return a copy of the collabs array', () => {
      const collabs1 = CollabService.getCollabs();
      const collabs2 = CollabService.getCollabs();
      expect(collabs1).not.toBe(collabs2); // 应该是不同的引用
      expect(collabs1).toEqual(collabs2); // 但内容应该相同
    });
  });

  describe('createCollab', () => {
    it('should create a new collab with correct properties', () => {
      const params: CreateCollabParams = {
        name: '测试联动',
        description: '测试联动项目描述',
        expectedRevenue: 100000,
      };

      const newCollab = CollabService.createCollab(params);
      
      expect(newCollab).toHaveProperty('id');
      expect(newCollab.id).toStartWith('collab-');
      expect(newCollab.name).toBe(params.name);
      expect(newCollab.description).toBe(params.description);
      expect(newCollab.expectedRevenue).toBe(params.expectedRevenue);
      expect(newCollab.status).toBe('进行中');
      expect(newCollab.startTime).toBeDefined();
      expect(newCollab.endTime).toBeDefined();
      expect(newCollab.actualRevenue).toBeUndefined();
    });

    it('should set correct start and end time', () => {
      // 保存原始Date对象
      const originalDate = global.Date;
      
      // 创建固定时间的Date模拟
      const mockDate = new Date('2023-06-15');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const params: CreateCollabParams = {
        name: '测试联动',
        description: '测试联动项目描述',
        expectedRevenue: 100000,
      };

      const newCollab = CollabService.createCollab(params);
      
      expect(newCollab.startTime).toBe('2023-06-15');
      expect(newCollab.endTime).toBe('2023-07-15'); // 应该是一个月后
      
      // 恢复原始Date对象
      global.Date = originalDate;
    });

    it('should handle large expected revenue', () => {
      const params: CreateCollabParams = {
        name: '大额联动',
        description: '测试大额预期收益',
        expectedRevenue: 1000000000,
      };

      const newCollab = CollabService.createCollab(params);
      expect(newCollab.expectedRevenue).toBe(1000000000);
    });
  });

  describe('endCollab', () => {
    it('should end an ongoing collab and set actual revenue', () => {
      const updatedCollabs = CollabService.endCollab('collab-1', mockCollabs);
      const targetCollab = updatedCollabs.find(collab => collab.id === 'collab-1');
      
      expect(targetCollab?.status).toBe('已结束');
      expect(targetCollab?.actualRevenue).toBeDefined();
      // 实际收益应该在预期收益的80%-120%之间
      expect(targetCollab?.actualRevenue).toBeGreaterThanOrEqual(400000); // 500000 * 0.8
      expect(targetCollab?.actualRevenue).toBeLessThanOrEqual(600000); // 500000 * 1.2
    });

    it('should not change already ended collab', () => {
      const updatedCollabs = CollabService.endCollab('collab-2', mockCollabs);
      const targetCollab = updatedCollabs.find(collab => collab.id === 'collab-2');
      
      expect(targetCollab?.status).toBe('已结束');
      expect(targetCollab?.actualRevenue).toBe(350000); // 保持原有值
    });

    it('should not change other collabs', () => {
      const updatedCollabs = CollabService.endCollab('collab-1', mockCollabs);
      const unchangedCollab = updatedCollabs.find(collab => collab.id === 'collab-2');
      
      expect(unchangedCollab).toEqual(mockCollabs[1]); // 保持原有状态
    });

    it('should handle non-existent collab id', () => {
      const updatedCollabs = CollabService.endCollab('non-existent-id', mockCollabs);
      expect(updatedCollabs).toEqual(mockCollabs); // 没有变化
    });

    it('should handle empty collabs array', () => {
      const updatedCollabs = CollabService.endCollab('collab-1', []);
      expect(updatedCollabs).toEqual([]);
    });
  });

  describe('getCollabDetail', () => {
    it('should return the collab with the given id', () => {
      const collabDetail = CollabService.getCollabDetail('collab-1', mockCollabs);
      expect(collabDetail).toBeDefined();
      expect(collabDetail?.id).toBe('collab-1');
      expect(collabDetail?.name).toBe('与知名IP联动活动');
    });

    it('should return undefined for non-existent collab id', () => {
      const collabDetail = CollabService.getCollabDetail('non-existent-id', mockCollabs);
      expect(collabDetail).toBeUndefined();
    });

    it('should return undefined when collabs array is empty', () => {
      const collabDetail = CollabService.getCollabDetail('collab-1', []);
      expect(collabDetail).toBeUndefined();
    });
  });

  describe('filterCollabsByStatus', () => {
    it('should return ongoing collabs when status is "ongoing"', () => {
      const filteredCollabs = CollabService.filterCollabsByStatus(mockCollabs, 'ongoing');
      expect(filteredCollabs.length).toBe(1);
      expect(filteredCollabs[0].status).toBe('进行中');
    });

    it('should return completed collabs when status is "completed"', () => {
      const filteredCollabs = CollabService.filterCollabsByStatus(mockCollabs, 'completed');
      expect(filteredCollabs.length).toBe(1);
      expect(filteredCollabs[0].status).toBe('已结束');
    });

    it('should return all collabs when status is "all"', () => {
      const filteredCollabs = CollabService.filterCollabsByStatus(mockCollabs, 'all');
      expect(filteredCollabs).toEqual(mockCollabs);
    });

    it('should return all collabs for any other status', () => {
      const filteredCollabs = CollabService.filterCollabsByStatus(mockCollabs, 'unknown');
      expect(filteredCollabs).toEqual(mockCollabs);
    });

    it('should return empty array when collabs array is empty', () => {
      const filteredCollabs = CollabService.filterCollabsByStatus([], 'ongoing');
      expect(filteredCollabs).toEqual([]);
    });
  });
});
