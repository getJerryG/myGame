import { describe, it, expect } from 'vitest';
import { ContentService } from '@/services/ContentService';

describe('ContentService', () => {
  describe('getModuleIcon', () => {
    it('should return correct icon for hero-management', () => {
      expect(ContentService.getModuleIcon('hero-management')).toBe('🦸');
    });

    it('should return correct icon for skin-release', () => {
      expect(ContentService.getModuleIcon('skin-release')).toBe('🎨');
    });

    it('should return correct icon for game-optimization', () => {
      expect(ContentService.getModuleIcon('game-optimization')).toBe('⚙️');
    });

    it('should return default icon for unknown module', () => {
      expect(ContentService.getModuleIcon('unknown-module')).toBe('📦');
    });

    it('should return default icon for empty string', () => {
      expect(ContentService.getModuleIcon('')).toBe('📦');
    });
  });

  describe('getCoreDataLabel', () => {
    it('should return correct label for totalHeroes', () => {
      expect(ContentService.getCoreDataLabel('totalHeroes')).toBe('总英雄数');
    });

    it('should return correct label for totalSkins', () => {
      expect(ContentService.getCoreDataLabel('totalSkins')).toBe('总皮肤数');
    });

    it('should return correct label for activeEvents', () => {
      expect(ContentService.getCoreDataLabel('activeEvents')).toBe('活跃活动数');
    });

    it('should return correct label for contentQuality', () => {
      expect(ContentService.getCoreDataLabel('contentQuality')).toBe('内容质量评分');
    });

    it('should return original key for unknown key', () => {
      expect(ContentService.getCoreDataLabel('unknownKey')).toBe('unknownKey');
    });

    it('should return empty string for empty key', () => {
      expect(ContentService.getCoreDataLabel('')).toBe('');
    });
  });

  describe('getCurrentModule', () => {
    const mockModules = [
      { id: 'module1', name: '模块1' },
      { id: 'module2', name: '模块2' },
      { id: 'module3', name: '模块3' },
    ];

    it('should return correct module for existing id', () => {
      const currentModule = ContentService.getCurrentModule(mockModules, 'module2');
      expect(currentModule).toBeDefined();
      expect(currentModule?.id).toBe('module2');
      expect(currentModule?.name).toBe('模块2');
    });

    it('should return first module when activeModuleId is not found', () => {
      const currentModule = ContentService.getCurrentModule(mockModules, 'non-existent-module');
      expect(currentModule).toBeDefined();
      expect(currentModule?.id).toBe('module1');
      expect(currentModule?.name).toBe('模块1');
    });

    it('should return first module when activeModuleId is empty string', () => {
      const currentModule = ContentService.getCurrentModule(mockModules, '');
      expect(currentModule).toBeDefined();
      expect(currentModule?.id).toBe('module1');
      expect(currentModule?.name).toBe('模块1');
    });

    it('should return undefined when modules array is empty', () => {
      const currentModule = ContentService.getCurrentModule([], 'module1');
      expect(currentModule).toBeUndefined();
    });

    it('should handle modules with different properties', () => {
      const differentModules = [
        { id: 'moduleA', title: '标题A', description: '描述A' },
        { id: 'moduleB', title: '标题B', description: '描述B' },
      ];

      const currentModule = ContentService.getCurrentModule(differentModules, 'moduleB');
      expect(currentModule).toBeDefined();
      expect(currentModule?.id).toBe('moduleB');
      expect(currentModule?.title).toBe('标题B');
    });
  });
});
