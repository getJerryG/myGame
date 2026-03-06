import { describe, it, expect } from 'vitest';
import { HeroService } from '@/services/HeroService';

describe('HeroService', () => {
  describe('static properties', () => {
    it('should have correct hero roles', () => {
      expect(HeroService.heroRoles).toHaveLength(6);
      expect(HeroService.heroRoles[0]).toEqual({ id: 'warrior', name: '战士', icon: '⚔️' });
    });

    it('should have correct hero types', () => {
      expect(HeroService.heroTypes).toHaveLength(3);
      expect(HeroService.heroTypes[0]).toEqual({ id: 'physical', name: '物理' });
    });

    it('should have correct development methods', () => {
      expect(HeroService.developmentMethods).toHaveLength(2);
      expect(HeroService.developmentMethods[0]).toEqual({ id: 'self', name: '自研' });
    });
  });

  describe('generateRandomHeroName', () => {
    it('should return a valid hero name from the list', () => {
      const name = HeroService.generateRandomHeroName();
      // 检查返回值是否为字符串且不为空
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });
  });

  describe('generateRandomIcon', () => {
    it('should return a valid icon from the list', () => {
      const icon = HeroService.generateRandomIcon();
      // 检查返回值是否为字符串且不为空
      expect(typeof icon).toBe('string');
      expect(icon.length).toBeGreaterThan(0);
    });
  });

  describe('getRoleName', () => {
    it('should return correct role name for existing role id', () => {
      expect(HeroService.getRoleName('warrior')).toBe('战士');
      expect(HeroService.getRoleName('mage')).toBe('法师');
    });

    it('should return "未知定位" for non-existent role id', () => {
      expect(HeroService.getRoleName('non-existent-role')).toBe('未知定位');
    });
  });

  describe('getTypeName', () => {
    it('should return correct type name for existing type id', () => {
      expect(HeroService.getTypeName('physical')).toBe('物理');
      expect(HeroService.getTypeName('magic')).toBe('法术');
    });

    it('should return "未知类型" for non-existent type id', () => {
      expect(HeroService.getTypeName('non-existent-type')).toBe('未知类型');
    });
  });

  describe('createHero', () => {
    it('should create a valid hero object', () => {
      const hero = HeroService.createHero('warrior', 'physical', 'self');
      
      expect(hero).toHaveProperty('id');
      expect(hero).toHaveProperty('name');
      expect(hero).toHaveProperty('icon');
      expect(hero.class).toBe('warrior');
      expect(hero.creationType).toBe('selfCreation');
      expect(hero.status).toBe('in_development');
      expect(hero.developmentProgress).toBe(0);
    });

    it('should create a collaboration hero when method is cooperation', () => {
      const hero = HeroService.createHero('warrior', 'physical', 'cooperation');
      expect(hero.creationType).toBe('collaboration');
    });
  });

  describe('getStatusText', () => {
    it('should return "研发中" for in_development status', () => {
      expect(HeroService.getStatusText('in_development')).toBe('研发中');
    });

    it('should return "已上线" for online status', () => {
      expect(HeroService.getStatusText('online')).toBe('已上线');
    });
  });

  describe('getStatusClass', () => {
    it('should return "developing" for in_development status', () => {
      expect(HeroService.getStatusClass('in_development')).toBe('developing');
    });

    it('should return "online" for online status', () => {
      expect(HeroService.getStatusClass('online')).toBe('online');
    });
  });

  describe('updateDevelopmentProgress', () => {
    const mockHero = {
      id: '1',
      name: '测试英雄',
      icon: '⚔️',
      class: 'warrior',
      stats: { health: 100, attack: 10, defense: 5 },
      description: '测试英雄描述',
      createdAt: new Date().toISOString(),
      creationType: 'selfCreation',
      style: 'standard',
      developmentTime: 30,
      developmentCost: 10000,
      developmentProgress: 50,
      status: 'in_development',
      pickRate: 0.1,
      userBase: 0.1,
      usageRate: 0,
      winRate: 50,
      banRate: 0
    };

    it('should update progress correctly within valid range', () => {
      const updatedHero = HeroService.updateDevelopmentProgress(mockHero, 75);
      expect(updatedHero.developmentProgress).toBe(75);
      expect(updatedHero.status).toBe('in_development');
    });

    it('should cap progress at 100 and change status to online', () => {
      const updatedHero = HeroService.updateDevelopmentProgress(mockHero, 150);
      expect(updatedHero.developmentProgress).toBe(100);
      expect(updatedHero.status).toBe('online');
    });

    it('should not allow progress below 0', () => {
      const updatedHero = HeroService.updateDevelopmentProgress(mockHero, -50);
      expect(updatedHero.developmentProgress).toBe(0);
      expect(updatedHero.status).toBe('in_development');
    });
  });
});
