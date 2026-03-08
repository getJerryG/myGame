import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameReleaseService, gameReleaseService, type ReleaseConfig, type ReleaseStatus } from '@/services/GameReleaseService';

describe('GameReleaseService', () => {
  let service: GameReleaseService;
  
  beforeEach(() => {
    // 创建新的服务实例，确保测试之间的隔离
    service = new GameReleaseService();
    
    // 保存原始setTimeout函数
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    // 恢复原始setTimeout函数
    vi.useRealTimers();
  });
  
  describe('getChannels', () => {
    it('should return all release channels', () => {
      const channels = service.getChannels();
      expect(channels).toBeDefined();
      expect(channels.length).toBe(5);
      
      // 检查所有渠道是否存在
      expect(channels.some(channel => channel.id === 'appstore')).toBe(true);
      expect(channels.some(channel => channel.id === 'googleplay')).toBe(true);
      expect(channels.some(channel => channel.id === 'steam')).toBe(true);
      expect(channels.some(channel => channel.id === 'epic')).toBe(true);
      expect(channels.some(channel => channel.id === 'tap')).toBe(true);
    });
    
    it('should return a copy of the channels array', () => {
      const channels1 = service.getChannels();
      const channels2 = service.getChannels();
      expect(channels1).not.toBe(channels2); // 应该是不同的引用
      expect(channels1).toEqual(channels2); // 但内容应该相同
    });
    
    it('should return channels with correct id and name pairs', () => {
      const channels = service.getChannels();
      const steamChannel = channels.find(channel => channel.id === 'steam');
      const tapChannel = channels.find(channel => channel.id === 'tap');
      
      expect(steamChannel?.name).toBe('Steam');
      expect(tapChannel?.name).toBe('TapTap');
    });
  });
  
  describe('getReleaseHistory', () => {
    it('should return release history with at least one release', () => {
      const history = service.getReleaseHistory();
      expect(history).toBeDefined();
      expect(history.length).toBeGreaterThan(0);
      
      // 检查历史记录中是否有预期的版本
      expect(history.some(release => release.version === '0.9.0')).toBe(true);
    });
    
    it('should return a copy of the release history array', () => {
      const history1 = service.getReleaseHistory();
      const history2 = service.getReleaseHistory();
      expect(history1).not.toBe(history2); // 应该是不同的引用
      expect(history1).toEqual(history2); // 但内容应该相同
    });
    
    it('should return releases with correct structure', () => {
      const history = service.getReleaseHistory();
      history.forEach(release => {
        expect(release).toHaveProperty('id');
        expect(release).toHaveProperty('version');
        expect(release).toHaveProperty('date');
        expect(release).toHaveProperty('channels');
        expect(release).toHaveProperty('changelog');
        expect(Array.isArray(release.channels)).toBe(true);
      });
    });
  });
  
  describe('startRelease', () => {
    it('should throw error when no channels are selected', async () => {
      const config: ReleaseConfig = {
        version: '1.0.0',
        changelog: '测试版本发布',
        selectedChannels: []
      };
      
      await expect(service.startRelease(config)).rejects.toThrow('请至少选择一个发布渠道');
    });
    
    it('should successfully release game with valid config', async () => {
      const config: ReleaseConfig = {
        version: '1.0.0',
        changelog: '测试版本发布',
        selectedChannels: ['steam', 'epic']
      };
      
      // 设置固定时间
      const mockDate = new Date('2023-06-15');
      vi.setSystemTime(mockDate);
      
      // 调用startRelease方法
      const releasePromise = service.startRelease(config);
      
      // 快进时间，模拟异步操作完成
      vi.advanceTimersByTime(3000);
      
      // 等待promise完成
      const result = await releasePromise;
      
      // 验证结果
      expect(result).toBeDefined();
      expect(result.version).toBe(config.version);
      expect(result.changelog).toBe(config.changelog);
      expect(result.channels).toEqual(['Steam', 'Epic Games']);
      expect(result.date).toBe('2023-06-15');
      
      // 验证发布历史是否更新
      const history = service.getReleaseHistory();
      expect(history[0]).toEqual(result);
      expect(history.length).toBe(3); // 原始2条 + 新发布1条
    });
    
    it('should use default changelog when not provided', async () => {
      const config: ReleaseConfig = {
        version: '1.0.0',
        changelog: '',
        selectedChannels: ['steam']
      };
      
      // 调用startRelease方法
      const releasePromise = service.startRelease(config);
      
      // 快进时间，模拟异步操作完成
      vi.advanceTimersByTime(3000);
      
      // 等待promise完成
      const result = await releasePromise;
      
      // 验证结果
      expect(result.changelog).toBe('无更新说明');
    });
    
    it('should handle single channel selection', async () => {
      const config: ReleaseConfig = {
        version: '1.0.0',
        changelog: '测试单渠道发布',
        selectedChannels: ['appstore']
      };
      
      // 调用startRelease方法
      const releasePromise = service.startRelease(config);
      
      // 快进时间，模拟异步操作完成
      vi.advanceTimersByTime(3000);
      
      // 等待promise完成
      const result = await releasePromise;
      
      // 验证结果
      expect(result.channels).toEqual(['App Store']);
    });
    
    it('should handle all channels selection', async () => {
      const config: ReleaseConfig = {
        version: '1.0.0',
        changelog: '测试全渠道发布',
        selectedChannels: ['appstore', 'googleplay', 'steam', 'epic', 'tap']
      };
      
      // 调用startRelease方法
      const releasePromise = service.startRelease(config);
      
      // 快进时间，模拟异步操作完成
      vi.advanceTimersByTime(3000);
      
      // 等待promise完成
      const result = await releasePromise;
      
      // 验证结果
      expect(result.channels).toEqual(['App Store', 'Google Play', 'Steam', 'Epic Games', 'TapTap']);
    });
  });
  
  describe('getStatusIcon', () => {
    it('should return correct icon for idle status', () => {
      expect(service.getStatusIcon('idle')).toBe('📦');
    });
    
    it('should return correct icon for releasing status', () => {
      expect(service.getStatusIcon('releasing')).toBe('🚀');
    });
    
    it('should return correct icon for success status', () => {
      expect(service.getStatusIcon('success')).toBe('✅');
    });
    
    it('should return correct icon for failed status', () => {
      expect(service.getStatusIcon('failed')).toBe('❌');
    });
    
    it('should return default icon for unknown status', () => {
      expect(service.getStatusIcon('unknown' as ReleaseStatus)).toBe('📦');
    });
  });
  
  describe('getStatusText', () => {
    it('should return correct text for idle status', () => {
      expect(service.getStatusText('idle')).toBe('准备发布');
    });
    
    it('should return correct text for releasing status', () => {
      expect(service.getStatusText('releasing')).toBe('正在发布...');
    });
    
    it('should return correct text for success status', () => {
      expect(service.getStatusText('success')).toBe('发布成功');
    });
    
    it('should return correct text for failed status', () => {
      expect(service.getStatusText('failed')).toBe('发布失败');
    });
    
    it('should return default text for unknown status', () => {
      expect(service.getStatusText('unknown' as ReleaseStatus)).toBe('准备发布');
    });
  });
  
  describe('gameReleaseService Instance', () => {
    it('should be a single instance', () => {
      // 验证导出的实例是GameReleaseService类型
      expect(gameReleaseService).toBeInstanceOf(GameReleaseService);
      
      // 验证多次访问导出的实例是同一个对象
      const instance1 = gameReleaseService;
      const instance2 = gameReleaseService;
      expect(instance1).toBe(instance2);
    });
    
    it('should have the same functionality as a new instance', () => {
      // 验证导出的实例具有相同的功能
      const instanceChannels = gameReleaseService.getChannels();
      const newInstanceChannels = service.getChannels();
      
      expect(instanceChannels).toEqual(newInstanceChannels);
      
      const instanceHistory = gameReleaseService.getReleaseHistory();
      const newInstanceHistory = service.getReleaseHistory();
      
      expect(instanceHistory).toEqual(newInstanceHistory);
    });
  });
});
