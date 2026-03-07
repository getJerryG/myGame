import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChannelDeliveryService, type Channel, type DeliveryIntensity } from '@/services/ChannelDeliveryService';

describe('ChannelDeliveryService', () => {
  // 模拟alert函数
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 测试数据
  const mockChannels: Channel[] = [
    {
      id: '1',
      name: '应用商店推广',
      type: 'online',
      effect: 'medium',
      cost: 1000,
      status: 'inactive',
    },
    {
      id: '2',
      name: '社交媒体广告',
      type: 'online',
      effect: 'medium',
      cost: 800,
      status: 'active',
    },
    {
      id: '3',
      name: '线下展会',
      type: 'offline',
      effect: 'high',
      cost: 2000,
      status: 'inactive',
    },
  ];

  describe('getChannels', () => {
    it('should return all channels', () => {
      const channels = ChannelDeliveryService.getChannels();
      expect(channels).toBeDefined();
      expect(channels.length).toBeGreaterThan(0);
      expect(channels[0]).toHaveProperty('id');
      expect(channels[0]).toHaveProperty('name');
      expect(channels[0]).toHaveProperty('type');
    });

    it('should return a copy of the channels array', () => {
      const channels1 = ChannelDeliveryService.getChannels();
      const channels2 = ChannelDeliveryService.getChannels();
      expect(channels1).not.toBe(channels2); // 应该是不同的引用
      expect(channels1).toEqual(channels2); // 但内容应该相同
    });
  });

  describe('filterChannelsByType', () => {
    it('should return all channels when type is "all"', () => {
      const filteredChannels = ChannelDeliveryService.filterChannelsByType(mockChannels, 'all');
      expect(filteredChannels).toEqual(mockChannels);
    });

    it('should filter channels by online type', () => {
      const filteredChannels = ChannelDeliveryService.filterChannelsByType(mockChannels, 'online');
      expect(filteredChannels.length).toBe(2);
      expect(filteredChannels.every(channel => channel.type === 'online')).toBe(true);
    });

    it('should filter channels by offline type', () => {
      const filteredChannels = ChannelDeliveryService.filterChannelsByType(mockChannels, 'offline');
      expect(filteredChannels.length).toBe(1);
      expect(filteredChannels[0].type).toBe('offline');
    });

    it('should return empty array for non-existent type', () => {
      const filteredChannels = ChannelDeliveryService.filterChannelsByType(mockChannels, 'non-existent-type');
      expect(filteredChannels).toEqual([]);
    });

    it('should return empty array when input channels array is empty', () => {
      const filteredChannels = ChannelDeliveryService.filterChannelsByType([], 'online');
      expect(filteredChannels).toEqual([]);
    });
  });

  describe('startDelivery', () => {
    it('should start delivery for a specific channel', () => {
      const updatedChannels = ChannelDeliveryService.startDelivery(mockChannels, '1');
      const targetChannel = updatedChannels.find(channel => channel.id === '1');
      expect(targetChannel?.status).toBe('active');
    });

    it('should not change other channels', () => {
      const updatedChannels = ChannelDeliveryService.startDelivery(mockChannels, '1');
      const unchangedChannel = updatedChannels.find(channel => channel.id === '2');
      expect(unchangedChannel?.status).toBe('active'); // 保持原有状态
    });

    it('should return the same array length', () => {
      const updatedChannels = ChannelDeliveryService.startDelivery(mockChannels, '1');
      expect(updatedChannels.length).toBe(mockChannels.length);
    });

    it('should handle non-existent channel id', () => {
      const updatedChannels = ChannelDeliveryService.startDelivery(mockChannels, 'non-existent-id');
      expect(updatedChannels).toEqual(mockChannels); // 没有变化
    });

    it('should handle empty channels array', () => {
      const updatedChannels = ChannelDeliveryService.startDelivery([], '1');
      expect(updatedChannels).toEqual([]);
    });
  });

  describe('stopDelivery', () => {
    it('should stop delivery for a specific channel', () => {
      const updatedChannels = ChannelDeliveryService.stopDelivery(mockChannels, '2');
      const targetChannel = updatedChannels.find(channel => channel.id === '2');
      expect(targetChannel?.status).toBe('inactive');
    });

    it('should not change other channels', () => {
      const updatedChannels = ChannelDeliveryService.stopDelivery(mockChannels, '2');
      const unchangedChannel = updatedChannels.find(channel => channel.id === '1');
      expect(unchangedChannel?.status).toBe('inactive'); // 保持原有状态
    });

    it('should return the same array length', () => {
      const updatedChannels = ChannelDeliveryService.stopDelivery(mockChannels, '2');
      expect(updatedChannels.length).toBe(mockChannels.length);
    });

    it('should handle non-existent channel id', () => {
      const updatedChannels = ChannelDeliveryService.stopDelivery(mockChannels, 'non-existent-id');
      expect(updatedChannels).toEqual(mockChannels); // 没有变化
    });

    it('should handle empty channels array', () => {
      const updatedChannels = ChannelDeliveryService.stopDelivery([], '1');
      expect(updatedChannels).toEqual([]);
    });
  });

  describe('confirmIntensity', () => {
    it('should start delivery when confirming intensity', () => {
      const intensity: DeliveryIntensity = 'medium';
      const updatedChannels = ChannelDeliveryService.confirmIntensity(mockChannels, '1', intensity);
      const targetChannel = updatedChannels.find(channel => channel.id === '1');
      expect(targetChannel?.status).toBe('active');
    });

    it('should work with light intensity', () => {
      const intensity: DeliveryIntensity = 'light';
      const updatedChannels = ChannelDeliveryService.confirmIntensity(mockChannels, '1', intensity);
      const targetChannel = updatedChannels.find(channel => channel.id === '1');
      expect(targetChannel?.status).toBe('active');
    });

    it('should work with heavy intensity', () => {
      const intensity: DeliveryIntensity = 'heavy';
      const updatedChannels = ChannelDeliveryService.confirmIntensity(mockChannels, '1', intensity);
      const targetChannel = updatedChannels.find(channel => channel.id === '1');
      expect(targetChannel?.status).toBe('active');
    });

    it('should handle non-existent channel id', () => {
      const intensity: DeliveryIntensity = 'medium';
      const updatedChannels = ChannelDeliveryService.confirmIntensity(mockChannels, 'non-existent-id', intensity);
      expect(updatedChannels).toEqual(mockChannels); // 没有变化
    });
  });

  describe('generateReport', () => {
    it('should call alert when generating report', () => {
      ChannelDeliveryService.generateReport();
      expect(window.alert).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('投放报告已生成，可在数据中心查看详细数据');
    });
  });
});
