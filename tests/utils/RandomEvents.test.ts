import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getLatestHeroStrengthRecommendations,
  activateEvent,
  deactivateEvent,
  deleteEvent,
  markEventAsRead,
  batchGenerateTestEvents,
  clearAllEvents,
  simulatePastEvents,
  randomEventsManager,
  RandomEventType
} from '@/utils/RandomEvents';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

// Mock Date
const mockDate = new Date('2026-03-07T12:00:00.000Z');
const originalDate = global.Date;

// Mock Math.random to get consistent results
vi.spyOn(Math, 'random').mockReturnValue(0.5);

describe('RandomEvents', () => {
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Reset mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    
    // Mock Date
    global.Date = vi.fn().mockImplementation(() => mockDate) as any;
    (Date.now as any) = vi.fn(() => mockDate.getTime());
    (Date.prototype as any).toISOString = vi.fn(() => mockDate.toISOString());
    (Date.prototype as any).getTime = vi.fn(() => mockDate.getTime());
  });
  
  afterEach(() => {
    // Restore original Date
    global.Date = originalDate;
    // Restore Math.random
    (Math.random as any).mockRestore();
  });
  
  describe('getLatestHeroStrengthRecommendations', () => {
    it('should return empty array when no events exist', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = getLatestHeroStrengthRecommendations();
      
      expect(result).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('random-events');
    });
    
    it('should return active hero strength recommendations', () => {
      const mockEvents = [
        {
          id: 'event-1',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '战士英雄强度推荐',
          description: '推荐理由',
          profession: '战士',
          strengthScore: 85.5,
          reason: '版本强势英雄，出场率极高',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: true,
          isRead: false
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
      
      const result = getLatestHeroStrengthRecommendations();
      
      expect(result).toEqual(mockEvents);
    });
    
    it('should filter out inactive events', () => {
      const mockEvents = [
        {
          id: 'event-1',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '战士英雄强度推荐',
          description: '推荐理由',
          profession: '战士',
          strengthScore: 85.5,
          reason: '版本强势英雄，出场率极高',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() - 1000 * 60 * 60 * 24).toISOString(),
          isActive: true,
          isRead: false
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
      
      const result = getLatestHeroStrengthRecommendations();
      
      expect(result).toEqual([]);
    });
  });
  
  describe('activateEvent', () => {
    it('should activate a specific event', () => {
      const mockEvents = [
        {
          id: 'event-1',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '战士英雄强度推荐',
          description: '推荐理由',
          profession: '战士',
          strengthScore: 85.5,
          reason: '版本强势英雄，出场率极高',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: false,
          isRead: false
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
      
      activateEvent('event-1');
      
      const expectedEvents = [
        {
          ...mockEvents[0],
          isActive: true
        }
      ];
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('random-events', JSON.stringify(expectedEvents));
    });
    
    it('should not change other events when activating an event', () => {
      const mockEvents = [
        {
          id: 'event-1',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '战士英雄强度推荐',
          description: '推荐理由',
          profession: '战士',
          strengthScore: 85.5,
          reason: '版本强势英雄，出场率极高',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: false,
          isRead: false
        },
        {
          id: 'event-2',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '法师英雄强度推荐',
          description: '推荐理由',
          profession: '法师',
          strengthScore: 90.0,
          reason: '法师爆发伤害高，秒人能力强',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: true,
          isRead: false
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
      
      activateEvent('event-1');
      
      const expectedEvents = [
        {
          ...mockEvents[0],
          isActive: true
        },
        mockEvents[1]
      ];
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('random-events', JSON.stringify(expectedEvents));
    });
    
    it('should handle non-existent event id', () => {
      const mockEvents = [
        {
          id: 'event-1',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '战士英雄强度推荐',
          description: '推荐理由',
          profession: '战士',
          strengthScore: 85.5,
          reason: '版本强势英雄，出场率极高',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: false,
          isRead: false
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
      
      activateEvent('non-existent-id');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('random-events', JSON.stringify(mockEvents));
    });
  });
  
  describe('deactivateEvent', () => {
    it('should deactivate a specific event', () => {
      const mockEvents = [
        {
          id: 'event-1',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '战士英雄强度推荐',
          description: '推荐理由',
          profession: '战士',
          strengthScore: 85.5,
          reason: '版本强势英雄，出场率极高',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: true,
          isRead: false
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
      
      deactivateEvent('event-1');
      
      const expectedEvents = [
        {
          ...mockEvents[0],
          isActive: false
        }
      ];
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('random-events', JSON.stringify(expectedEvents));
    });
  });
  
  describe('deleteEvent', () => {
    it('should delete a specific event', () => {
      const mockEvents = [
        {
          id: 'event-1',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '战士英雄强度推荐',
          description: '推荐理由',
          profession: '战士',
          strengthScore: 85.5,
          reason: '版本强势英雄，出场率极高',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: true,
          isRead: false
        },
        {
          id: 'event-2',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '法师英雄强度推荐',
          description: '推荐理由',
          profession: '法师',
          strengthScore: 90.0,
          reason: '法师爆发伤害高，秒人能力强',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: true,
          isRead: false
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
      
      deleteEvent('event-1');
      
      const expectedEvents = [mockEvents[1]];
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('random-events', JSON.stringify(expectedEvents));
    });
    
    it('should handle non-existent event id', () => {
      const mockEvents = [
        {
          id: 'event-1',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '战士英雄强度推荐',
          description: '推荐理由',
          profession: '战士',
          strengthScore: 85.5,
          reason: '版本强势英雄，出场率极高',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: true,
          isRead: false
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
      
      deleteEvent('non-existent-id');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('random-events', JSON.stringify(mockEvents));
    });
  });
  
  describe('markEventAsRead', () => {
    it('should mark a specific event as read', () => {
      const mockEvents = [
        {
          id: 'event-1',
          type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
          title: '战士英雄强度推荐',
          description: '推荐理由',
          profession: '战士',
          strengthScore: 85.5,
          reason: '版本强势英雄，出场率极高',
          createdAt: mockDate.toISOString(),
          startDate: mockDate.toISOString(),
          endDate: new Date(mockDate.getTime() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          isActive: true,
          isRead: false
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEvents));
      
      markEventAsRead('event-1');
      
      const expectedEvents = [
        {
          ...mockEvents[0],
          isRead: true
        }
      ];
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('random-events', JSON.stringify(expectedEvents));
    });
  });
  
  describe('batchGenerateTestEvents', () => {
    it('should generate specified number of test events', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      batchGenerateTestEvents(3);
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const callArgs = localStorageMock.setItem.mock.calls[0][1];
      const events = JSON.parse(callArgs);
      expect(events.length).toBe(3);
      events.forEach((event: any) => {
        expect(event.type).toBe(RandomEventType.HERO_STRENGTH_RECOMMENDATION);
        expect(event.isActive).toBe(true);
      });
    });
  });
  
  describe('clearAllEvents', () => {
    it('should clear all events from storage', () => {
      clearAllEvents();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('random-events');
    });
  });
  
  describe('simulatePastEvents', () => {
    it('should generate past events with inactive status', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      simulatePastEvents(2);
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const callArgs = localStorageMock.setItem.mock.calls[0][1];
      const events = JSON.parse(callArgs);
      expect(events.length).toBe(2);
      events.forEach((event: any) => {
        expect(event.type).toBe(RandomEventType.HERO_STRENGTH_RECOMMENDATION);
        expect(event.isActive).toBe(false);
      });
    });
  });
  
  describe('randomEventsManager', () => {
    it('should expose all methods', () => {
      expect(randomEventsManager).toHaveProperty('getLatestHeroStrengthRecommendations');
      expect(randomEventsManager).toHaveProperty('activateEvent');
      expect(randomEventsManager).toHaveProperty('deactivateEvent');
      expect(randomEventsManager).toHaveProperty('deleteEvent');
      expect(randomEventsManager).toHaveProperty('markEventAsRead');
      expect(randomEventsManager).toHaveProperty('batchGenerateTestEvents');
      expect(randomEventsManager).toHaveProperty('clearAllEvents');
      expect(randomEventsManager).toHaveProperty('simulatePastEvents');
    });
    
    it('should call the correct method when using manager', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      randomEventsManager.clearAllEvents();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('random-events');
    });
  });
});
