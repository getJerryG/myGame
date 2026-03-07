import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventService, type EventType, type EventIntensity, type Event } from '@/services/EventService';

describe('EventService', () => {
  // 模拟alert函数
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getEventTypes', () => {
    it('should return correct event types configuration', () => {
      const eventTypes = EventService.getEventTypes();
      expect(eventTypes).toBeDefined();
      expect(eventTypes.length).toBe(7);
      
      // 检查所有事件类型是否存在
      expect(eventTypes.some(type => type.value === 'hero_discount')).toBe(true);
      expect(eventTypes.some(type => type.value === 'hero_skin_bundle')).toBe(true);
      expect(eventTypes.some(type => type.value === 'rank_boost')).toBe(true);
      expect(eventTypes.some(type => type.value === 'recharge_bonus')).toBe(true);
      expect(eventTypes.some(type => type.value === 'limited_return')).toBe(true);
      expect(eventTypes.some(type => type.value === 'collab_theme')).toBe(true);
      expect(eventTypes.some(type => type.value === 'server_crash_compensation')).toBe(true);
    });

    it('should return event types with correct label and value pairs', () => {
      const eventTypes = EventService.getEventTypes();
      const heroDiscountType = eventTypes.find(type => type.value === 'hero_discount');
      const limitedReturnType = eventTypes.find(type => type.value === 'limited_return');
      
      expect(heroDiscountType?.label).toBe('新英雄折扣');
      expect(limitedReturnType?.label).toBe('限定返场');
    });
  });

  describe('getEventIntensities', () => {
    it('should return correct event intensities configuration', () => {
      const eventIntensities = EventService.getEventIntensities();
      expect(eventIntensities).toBeDefined();
      expect(eventIntensities.length).toBe(3);
      
      // 检查所有事件力度是否存在
      expect(eventIntensities.some(intensity => intensity.value === 'light')).toBe(true);
      expect(eventIntensities.some(intensity => intensity.value === 'moderate')).toBe(true);
      expect(eventIntensities.some(intensity => intensity.value === 'heavy')).toBe(true);
    });

    it('should return event intensities with correct label and value pairs', () => {
      const eventIntensities = EventService.getEventIntensities();
      const lightIntensity = eventIntensities.find(intensity => intensity.value === 'light');
      const heavyIntensity = eventIntensities.find(intensity => intensity.value === 'heavy');
      
      expect(lightIntensity?.label).toBe('轻度');
      expect(heavyIntensity?.label).toBe('重磅');
    });
  });

  describe('getEventDuration', () => {
    it('should return correct duration for light intensity', () => {
      expect(EventService.getEventDuration('light')).toBe(3);
    });

    it('should return correct duration for moderate intensity', () => {
      expect(EventService.getEventDuration('moderate')).toBe(5);
    });

    it('should return correct duration for heavy intensity', () => {
      expect(EventService.getEventDuration('heavy')).toBe(7);
    });

    it('should return default duration for unknown intensity', () => {
      expect(EventService.getEventDuration('unknown')).toBe(5);
    });

    it('should return default duration for empty string', () => {
      expect(EventService.getEventDuration('')).toBe(5);
    });
  });

  describe('getEvents', () => {
    it('should return all events', () => {
      const events = EventService.getEvents();
      expect(events).toBeDefined();
      expect(events.length).toBeGreaterThan(0);
      expect(events[0]).toHaveProperty('id');
      expect(events[0]).toHaveProperty('name');
      expect(events[0]).toHaveProperty('type');
      expect(events[0]).toHaveProperty('status');
      expect(events[0]).toHaveProperty('heatBoost');
      expect(events[0]).toHaveProperty('revenueBoost');
    });

    it('should return a copy of the events array', () => {
      const events1 = EventService.getEvents();
      const events2 = EventService.getEvents();
      expect(events1).not.toBe(events2); // 应该是不同的引用
      expect(events1).toEqual(events2); // 但内容应该相同
    });

    it('should return events with correct structure', () => {
      const events = EventService.getEvents();
      events.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('name');
        expect(event).toHaveProperty('type');
        expect(event).toHaveProperty('status');
        expect(event).toHaveProperty('startDate');
        expect(event).toHaveProperty('endDate');
        expect(event).toHaveProperty('heatBoost');
        expect(event).toHaveProperty('revenueBoost');
      });
    });
  });

  describe('createEvent', () => {
    it('should call alert when creating an event', () => {
      const eventData = {
        name: '测试活动',
        type: 'hero_discount',
        intensity: 'moderate'
      };
      
      EventService.createEvent(eventData);
      expect(window.alert).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('活动创建成功');
    });

    it('should handle empty event data', () => {
      EventService.createEvent({});
      expect(window.alert).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('活动创建成功');
    });

    it('should handle event data with different properties', () => {
      const eventData = {
        id: 1,
        title: '测试活动标题',
        category: '测试类别',
        duration: 5,
        bonus: 10
      };
      
      EventService.createEvent(eventData);
      expect(window.alert).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('活动创建成功');
    });
  });
});
