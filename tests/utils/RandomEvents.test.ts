import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  activateEvent,
  deactivateEvent,
  deleteEvent,
  markEventAsRead,
  clearAllEvents,
  RandomEventType
} from '../../src/utils/RandomEvents';

// Mock localStorage with actual storage
const localStorageMock = (() => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(key => delete store[key]); })
  };
})();

// Mock Date
const mockDate = new Date('2026-03-07T12:00:00.000Z');

// Mock Math.random to get consistent results
const originalMathRandom = Math.random;

describe('RandomEvents', () => {
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

    // Reset mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();

    // Mock Math.random
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    // Mock Date with a simpler approach
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    // Restore original Date
    vi.useRealTimers();
    // Restore Math.random
    Math.random = originalMathRandom;
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

  describe('clearAllEvents', () => {
    it('should clear all events from storage', () => {
      clearAllEvents();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('random-events');
    });
  });
});
