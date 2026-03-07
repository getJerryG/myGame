import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppStoreService, type AvailableApp } from '@/services/AppStoreService';

// 模拟localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

// 替换全局localStorage
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  localStorageMock.clear();
});

describe('AppStoreService', () => {
  // 测试数据
  const mockApp: AvailableApp = {
    id: 'test-app',
    name: 'Test App',
    icon: '📱',
    description: 'Test description',
    memory: '128MB',
    category: 'core',
    requiredLevelId: 'junior-planner',
    requiredSubLevel: 2,
  };

  describe('getAllApps', () => {
    it('should return all available apps', () => {
      const apps = AppStoreService.getAllApps();
      expect(apps).toBeDefined();
      expect(apps.length).toBeGreaterThan(0);
      expect(apps[0]).toHaveProperty('id');
      expect(apps[0]).toHaveProperty('name');
      expect(apps[0]).toHaveProperty('icon');
    });

    it('should return a copy of the apps array', () => {
      const apps1 = AppStoreService.getAllApps();
      const apps2 = AppStoreService.getAllApps();
      expect(apps1).not.toBe(apps2); // 应该是不同的引用
      expect(apps1).toEqual(apps2); // 但内容应该相同
    });
  });

  describe('loadInstalledApps', () => {
    it('should return an empty array when no apps are installed', () => {
      const installedApps = AppStoreService.loadInstalledApps();
      expect(installedApps).toEqual([]);
    });

    it('should return installed apps from localStorage', () => {
      // 准备数据
      const mockInstalledApps = ['app1', 'app2', 'app3'];
      localStorage.setItem('app-store-installed-apps', JSON.stringify(mockInstalledApps));

      // 执行测试
      const installedApps = AppStoreService.loadInstalledApps();

      // 验证结果
      expect(installedApps).toEqual(mockInstalledApps);
      expect(localStorage.getItem).toHaveBeenCalledWith('app-store-installed-apps');
    });

    it('should return empty array when localStorage data is invalid JSON', () => {
      // 准备无效数据
      localStorage.setItem('app-store-installed-apps', 'invalid-json');

      // 执行测试
      const installedApps = AppStoreService.loadInstalledApps();

      // 验证结果
      expect(installedApps).toEqual([]);
    });
  });

  describe('saveInstalledApps', () => {
    it('should save installed apps to localStorage', () => {
      // 准备数据
      const mockInstalledApps = ['app1', 'app2'];

      // 执行测试
      AppStoreService.saveInstalledApps(mockInstalledApps);

      // 验证结果
      expect(localStorage.setItem).toHaveBeenCalledWith('app-store-installed-apps', JSON.stringify(mockInstalledApps));
    });
  });

  describe('isInstalled', () => {
    it('should return true if app is installed', () => {
      const installedApps = ['app1', 'app2'];
      expect(AppStoreService.isInstalled('app1', installedApps)).toBe(true);
    });

    it('should return false if app is not installed', () => {
      const installedApps = ['app1', 'app2'];
      expect(AppStoreService.isInstalled('app3', installedApps)).toBe(false);
    });

    it('should return false if installedApps is empty', () => {
      const installedApps: string[] = [];
      expect(AppStoreService.isInstalled('app1', installedApps)).toBe(false);
    });
  });

  describe('canUnlockApp', () => {
    it('should return true if app has no requiredSubLevel', () => {
      const app: AvailableApp = {
        ...mockApp,
        requiredSubLevel: undefined,
      };
      expect(AppStoreService.canUnlockApp(app, 0)).toBe(true);
    });

    it('should return true if user has reached requiredSubLevel', () => {
      expect(AppStoreService.canUnlockApp(mockApp, 1)).toBe(true); // subLevelIndex + 1 = 2, which matches requiredSubLevel
    });

    it('should return true if user has exceeded requiredSubLevel', () => {
      expect(AppStoreService.canUnlockApp(mockApp, 2)).toBe(true); // subLevelIndex + 1 = 3, which is greater than requiredSubLevel
    });

    it('should return false if user has not reached requiredSubLevel', () => {
      expect(AppStoreService.canUnlockApp(mockApp, 0)).toBe(false); // subLevelIndex + 1 = 1, which is less than requiredSubLevel
    });
  });

  describe('getLevelNameById', () => {
    it('should return correct level name for valid levelId', () => {
      expect(AppStoreService.getLevelNameById('trainee-planner')).toBe('见习策划');
      expect(AppStoreService.getLevelNameById('director-planner')).toBe('策划总监');
    });

    it('should return levelId itself for invalid levelId', () => {
      expect(AppStoreService.getLevelNameById('invalid-level')).toBe('invalid-level');
    });
  });

  describe('getSubLevelName', () => {
    it('should return correct sub level name', () => {
      expect(AppStoreService.getSubLevelName('any-level', 1)).toBe('1');
      expect(AppStoreService.getSubLevelName('any-level', 5)).toBe('5');
    });
  });

  describe('getUnlockConditionText', () => {
    it('should return correct unlock condition text with subLevel', () => {
      expect(AppStoreService.getUnlockConditionText(mockApp)).toBe('初级策划2');
    });

    it('should return correct unlock condition text without subLevel', () => {
      const app: AvailableApp = {
        ...mockApp,
        requiredSubLevel: undefined,
      };
      expect(AppStoreService.getUnlockConditionText(app)).toBe('初级策划');
    });
  });

  describe('getAppStatus', () => {
    it('should return installed status if app is installed', () => {
      const result = AppStoreService.getAppStatus(
        mockApp,
        ['test-app'],
        () => false,
        2
      );
      expect(result).toBe('installed');
    });

    it('should return downloading status if app is downloading', () => {
      const result = AppStoreService.getAppStatus(
        mockApp,
        [],
        (appId) => appId === 'test-app',
        2
      );
      expect(result).toBe('downloading');
    });

    it('should return locked status if app is not unlocked', () => {
      const result = AppStoreService.getAppStatus(
        mockApp,
        [],
        () => false,
        0
      );
      expect(result).toBe('locked');
    });

    it('should return available status if app is available', () => {
      const result = AppStoreService.getAppStatus(
        mockApp,
        [],
        () => false,
        2
      );
      expect(result).toBe('available');
    });
  });

  describe('getAppStatusText', () => {
    it('should return correct status text for each status', () => {
      expect(AppStoreService.getAppStatusText('locked')).toBe('未解锁');
      expect(AppStoreService.getAppStatusText('available')).toBe('可下载');
      expect(AppStoreService.getAppStatusText('downloading')).toBe('下载中');
      expect(AppStoreService.getAppStatusText('installed')).toBe('已安装');
    });
  });

  describe('getStatusClass', () => {
    it('should return correct class for each status', () => {
      expect(AppStoreService.getStatusClass('locked')).toBe('status-locked');
      expect(AppStoreService.getStatusClass('available')).toBe('status-available');
      expect(AppStoreService.getStatusClass('downloading')).toBe('status-installed');
      expect(AppStoreService.getStatusClass('installed')).toBe('status-installed');
    });
  });

  describe('filterApps', () => {
    it('should return all apps when category is default', () => {
      const allApps = AppStoreService.getAllApps();
      const filteredApps = AppStoreService.filterApps('default', 0);
      expect(filteredApps.length).toBe(allApps.length);
    });

    it('should filter apps by system category', () => {
      const filteredApps = AppStoreService.filterApps('system', 0);
      expect(filteredApps.every(app => app.category === 'system')).toBe(true);
    });

    it('should filter apps by unlocked category', () => {
      const filteredApps = AppStoreService.filterApps('unlocked', 5);
      // 所有应用都应该是可解锁的
      expect(filteredApps.length).toBeGreaterThan(0);
    });

    it('should filter apps by locked category', () => {
      const filteredApps = AppStoreService.filterApps('locked', 0);
      // 应该有一些应用是锁定的
      expect(filteredApps.length).toBeGreaterThan(0);
    });

    it('should return empty array for mini category', () => {
      const filteredApps = AppStoreService.filterApps('mini', 0);
      expect(filteredApps).toEqual([]);
    });
  });
});
