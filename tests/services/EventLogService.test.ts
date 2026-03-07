import { describe, it, expect } from 'vitest';
import { EventLogService, type Event, type EventFilters } from '@/services/EventLogService';

describe('EventLogService', () => {
  // 测试数据
  const mockEvents: Event[] = [
    {
      id: 1,
      name: '服务器卡顿问题',
      description: '部分玩家反映游戏服务器卡顿，影响游戏体验',
      type: 'technical',
      date: '2024/3/10',
      solution: '紧急扩容服务器，优化网络连接',
      impact: {
        status: 'resolved',
        description: '服务器恢复正常，玩家满意度提升',
      },
    },
    {
      id: 2,
      name: '新英雄上线热度爆发',
      description: '新英雄李白上线后，游戏热度大幅提升，超出预期',
      type: 'operation',
      date: '2024/3/15',
      solution: '增加服务器资源，确保游戏稳定运行',
      impact: {
        status: 'positive',
        description: '游戏热度+30，新增用户5000',
      },
    },
    {
      id: 3,
      name: '竞争对手发布新游戏',
      description: '主要竞争对手发布了一款新的MOBA游戏，可能影响我们的市场份额',
      type: 'market',
      date: '2024/3/20',
      solution: '推出新活动和皮肤，增强玩家粘性',
      impact: {
        status: 'neutral',
        description: '市场份额保持稳定，玩家流失率在可控范围内',
      },
    },
    {
      id: 4,
      name: '支付系统故障',
      description: '部分玩家无法正常进行支付，影响收入',
      type: 'technical',
      date: '2024/3/25',
      solution: '修复支付系统漏洞，恢复支付功能',
      impact: {
        status: 'resolved',
        description: '支付功能恢复正常，补偿受影响玩家',
      },
    },
    {
      id: 5,
      name: '玩家大规模投诉',
      description: '由于版本更新问题，导致大量玩家投诉',
      type: 'operation',
      date: '2024/3/30',
      solution: '发布道歉公告，发放补偿奖励',
      impact: {
        status: 'negative',
        description: '口碑-10，需加强版本测试',
      },
    },
  ];

  describe('getEventTypeLabel', () => {
    it('should return correct label for technical type', () => {
      expect(EventLogService.getEventTypeLabel('technical')).toBe('技术事件');
    });

    it('should return correct label for operation type', () => {
      expect(EventLogService.getEventTypeLabel('operation')).toBe('运营事件');
    });

    it('should return correct label for market type', () => {
      expect(EventLogService.getEventTypeLabel('market')).toBe('市场事件');
    });

    it('should return default label for unknown type', () => {
      expect(EventLogService.getEventTypeLabel('unknown-type')).toBe('未知事件');
    });

    it('should return default label for empty string', () => {
      expect(EventLogService.getEventTypeLabel('')).toBe('未知事件');
    });
  });

  describe('getEvents', () => {
    it('should return all events', () => {
      const events = EventLogService.getEvents();
      expect(events).toBeDefined();
      expect(events.length).toBeGreaterThan(0);
      expect(events[0]).toHaveProperty('id');
      expect(events[0]).toHaveProperty('name');
      expect(events[0]).toHaveProperty('type');
      expect(events[0]).toHaveProperty('impact');
    });

    it('should return a copy of the events array', () => {
      const events1 = EventLogService.getEvents();
      const events2 = EventLogService.getEvents();
      expect(events1).not.toBe(events2); // 应该是不同的引用
      expect(events1).toEqual(events2); // 但内容应该相同
    });

    it('should return events with correct structure', () => {
      const events = EventLogService.getEvents();
      events.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('name');
        expect(event).toHaveProperty('description');
        expect(event).toHaveProperty('type');
        expect(event).toHaveProperty('date');
        expect(event).toHaveProperty('solution');
        expect(event).toHaveProperty('impact');
        expect(event.impact).toHaveProperty('status');
        expect(event.impact).toHaveProperty('description');
      });
    });
  });

  describe('getTabs', () => {
    it('should return correct tabs configuration', () => {
      const tabs = EventLogService.getTabs();
      expect(tabs).toBeDefined();
      expect(tabs.length).toBe(4);
      
      // 检查所有标签页是否存在
      expect(tabs.some(tab => tab.value === 'all')).toBe(true);
      expect(tabs.some(tab => tab.value === 'technical')).toBe(true);
      expect(tabs.some(tab => tab.value === 'operation')).toBe(true);
      expect(tabs.some(tab => tab.value === 'market')).toBe(true);
    });

    it('should return tabs with correct label and value pairs', () => {
      const tabs = EventLogService.getTabs();
      const allTab = tabs.find(tab => tab.value === 'all');
      const technicalTab = tabs.find(tab => tab.value === 'technical');
      
      expect(allTab?.label).toBe('全部事件');
      expect(technicalTab?.label).toBe('技术事件');
    });
  });

  describe('getTimeRanges', () => {
    it('should return correct time ranges configuration', () => {
      const timeRanges = EventLogService.getTimeRanges();
      expect(timeRanges).toBeDefined();
      expect(timeRanges.length).toBe(4);
      
      // 检查所有时间范围是否存在
      expect(timeRanges.some(range => range.value === 'all')).toBe(true);
      expect(timeRanges.some(range => range.value === '7days')).toBe(true);
      expect(timeRanges.some(range => range.value === '30days')).toBe(true);
      expect(timeRanges.some(range => range.value === '90days')).toBe(true);
    });
  });

  describe('getEventStatuses', () => {
    it('should return correct event statuses configuration', () => {
      const statuses = EventLogService.getEventStatuses();
      expect(statuses).toBeDefined();
      expect(statuses.length).toBe(5);
      
      // 检查所有状态是否存在
      expect(statuses.some(status => status.value === 'all')).toBe(true);
      expect(statuses.some(status => status.value === 'resolved')).toBe(true);
      expect(statuses.some(status => status.value === 'positive')).toBe(true);
      expect(statuses.some(status => status.value === 'negative')).toBe(true);
      expect(statuses.some(status => status.value === 'neutral')).toBe(true);
    });
  });

  describe('getDefaultFilters', () => {
    it('should return correct default filters', () => {
      const defaultFilters = EventLogService.getDefaultFilters();
      expect(defaultFilters).toEqual({
        timeRange: 'all',
        status: 'all',
      });
    });

    it('should return a new object on each call', () => {
      const filters1 = EventLogService.getDefaultFilters();
      const filters2 = EventLogService.getDefaultFilters();
      expect(filters1).not.toBe(filters2); // 应该是不同的引用
      expect(filters1).toEqual(filters2); // 但内容应该相同
    });
  });

  describe('filterEvents', () => {
    it('should return all events when no filters are applied', () => {
      const filters: EventFilters = {
        timeRange: 'all',
        status: 'all',
      };
      const filteredEvents = EventLogService.filterEvents(mockEvents, 'all', filters);
      expect(filteredEvents).toEqual(mockEvents);
    });

    it('should filter events by tab type', () => {
      const filters: EventFilters = {
        timeRange: 'all',
        status: 'all',
      };
      const filteredEvents = EventLogService.filterEvents(mockEvents, 'technical', filters);
      expect(filteredEvents.length).toBe(2);
      expect(filteredEvents.every(event => event.type === 'technical')).toBe(true);
    });

    it('should filter events by status', () => {
      const filters: EventFilters = {
        timeRange: 'all',
        status: 'resolved',
      };
      const filteredEvents = EventLogService.filterEvents(mockEvents, 'all', filters);
      expect(filteredEvents.length).toBe(2);
      expect(filteredEvents.every(event => event.impact.status === 'resolved')).toBe(true);
    });

    it('should apply both tab type and status filters', () => {
      const filters: EventFilters = {
        timeRange: 'all',
        status: 'resolved',
      };
      const filteredEvents = EventLogService.filterEvents(mockEvents, 'technical', filters);
      expect(filteredEvents.length).toBe(2);
      expect(filteredEvents.every(event => event.type === 'technical' && event.impact.status === 'resolved')).toBe(true);
    });

    it('should return empty array when no events match filters', () => {
      const filters: EventFilters = {
        timeRange: 'all',
        status: 'positive',
      };
      const filteredEvents = EventLogService.filterEvents(mockEvents, 'market', filters);
      expect(filteredEvents).toEqual([]);
    });

    it('should handle empty events array', () => {
      const filters: EventFilters = {
        timeRange: 'all',
        status: 'all',
      };
      const filteredEvents = EventLogService.filterEvents([], 'all', filters);
      expect(filteredEvents).toEqual([]);
    });
  });

  describe('resetFilters', () => {
    it('should return default filters when resetting', () => {
      const resetFilters = EventLogService.resetFilters();
      const defaultFilters = EventLogService.getDefaultFilters();
      expect(resetFilters).toEqual(defaultFilters);
    });

    it('should return a new object', () => {
      const resetFilters = EventLogService.resetFilters();
      const defaultFilters = EventLogService.getDefaultFilters();
      expect(resetFilters).not.toBe(defaultFilters); // 应该是不同的引用
      expect(resetFilters).toEqual(defaultFilters); // 但内容应该相同
    });
  });
});
