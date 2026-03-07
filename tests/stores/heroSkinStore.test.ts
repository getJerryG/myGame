import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useHeroSkinStore } from '@/stores/heroSkinStore';
import {
  getHeroesFromStorage,
  getSkinsFromStorage,
  saveHeroesToStorage,
  saveSkinsToStorage,
  createHero,
  autoGenerateHero,
  batchGenerateHeroes,
  advanceDevelopment,
  calculateHeroDevelopmentCost,
  pauseHeroDevelopment,
  cancelHeroDevelopment,
  getHeroDevelopmentDetails,
  analyzeHeroBalance,
  analyzeAllHeroesBalance,
  getBalanceWarnings,
  adjustHeroAttributes,
  getBalanceReport
} from '@/utils/HeroSkinManager';

// Mock dependencies
vi.mock('@/utils/HeroSkinManager', () => ({
  getHeroesFromStorage: vi.fn().mockReturnValue([]),
  getSkinsFromStorage: vi.fn().mockReturnValue([]),
  saveHeroesToStorage: vi.fn(),
  saveSkinsToStorage: vi.fn(),
  createHero: vi.fn((data) => ({
    id: 'hero-1',
    name: data.name,
    role: data.role,
    usageRate: 0,
    winRate: 50,
    banRate: 0,
    createdAt: new Date().toISOString(),
    ...data
  })),
  autoGenerateHero: vi.fn().mockReturnValue({
    id: 'auto-hero-1',
    name: 'Auto Hero',
    role: 'tank',
    usageRate: 0,
    winRate: 50,
    banRate: 0,
    createdAt: new Date().toISOString()
  }),
  batchGenerateHeroes: vi.fn((count) => {
    const heroes = [];
    for (let i = 0; i < count; i++) {
      heroes.push({
        id: `batch-hero-${i}`,
        name: `Batch Hero ${i}`,
        role: 'tank',
        usageRate: 0,
        winRate: 50,
        banRate: 0,
        createdAt: new Date().toISOString()
      });
    }
    return heroes;
  }),
  advanceDevelopment: vi.fn(),
  calculateHeroDevelopmentCost: vi.fn().mockReturnValue(1000),
  pauseHeroDevelopment: vi.fn(),
  cancelHeroDevelopment: vi.fn(),
  getHeroDevelopmentDetails: vi.fn().mockReturnValue({ progress: 50, remainingTime: 10 }),
  analyzeHeroBalance: vi.fn().mockReturnValue({ heroId: 'hero-1', overallScore: 80, warnings: [] }),
  analyzeAllHeroesBalance: vi.fn().mockReturnValue([]),
  getBalanceWarnings: vi.fn().mockReturnValue([]),
  adjustHeroAttributes: vi.fn((id, adjustments) => ({
    id,
    name: 'Test Hero',
    role: 'tank',
    usageRate: 0,
    winRate: 50,
    banRate: 0,
    createdAt: new Date().toISOString(),
    health: 1000 + (adjustments.health || 0),
    attack: 100 + (adjustments.attack || 0),
    defense: 50 + (adjustments.defense || 0)
  })),
  getBalanceReport: vi.fn().mockReturnValue({ totalHeroes: 0, balancedHeroes: 0 })
}));

describe('heroSkinStore', () => {
  let heroSkinStore: ReturnType<typeof useHeroSkinStore>;
  
  beforeEach(() => {
    // Create a new pinia instance for each test
    const pinia = createPinia();
    setActivePinia(pinia);
    
    // Create a new store instance
    heroSkinStore = useHeroSkinStore();
  });
  
  describe('state initialization', () => {
    it('should initialize with correct default values', () => {
      expect(heroSkinStore.heroes).toEqual([]);
      expect(heroSkinStore.skins).toEqual([]);
      expect(heroSkinStore.loading).toBe(false);
      expect(heroSkinStore.error).toBe(null);
    });
  });
  
  describe('getters', () => {
    it('should return all heroes and skins', () => {
      // Add some test data
      heroSkinStore.heroes = [
        { id: 'hero-1', name: 'Hero 1', role: 'tank', usageRate: 0, winRate: 50, banRate: 0, createdAt: new Date().toISOString() },
        { id: 'hero-2', name: 'Hero 2', role: 'damage', usageRate: 0, winRate: 50, banRate: 0, createdAt: new Date().toISOString() }
      ];
      
      heroSkinStore.skins = [
        { id: 'skin-1', name: 'Skin 1', heroName: 'Hero 1', rarity: '普通', sales: { daily: 0, total: 0 } },
        { id: 'skin-2', name: 'Skin 2', heroName: 'Hero 2', rarity: '史诗', sales: { daily: 0, total: 0 } }
      ];
      
      expect(heroSkinStore.getAllHeroes).toHaveLength(2);
      expect(heroSkinStore.getAllSkins).toHaveLength(2);
      expect(heroSkinStore.getHeroCount).toBe(2);
      expect(heroSkinStore.getSkinCount).toBe(2);
    });
    
    it('should get heroes and skins by id and name', () => {
      // Add some test data
      heroSkinStore.heroes = [
        { id: 'hero-1', name: 'Hero 1', role: 'tank', usageRate: 0, winRate: 50, banRate: 0, createdAt: new Date().toISOString() },
        { id: 'hero-2', name: 'Hero 2', role: 'damage', usageRate: 0, winRate: 50, banRate: 0, createdAt: new Date().toISOString() }
      ];
      
      heroSkinStore.skins = [
        { id: 'skin-1', name: 'Skin 1', heroName: 'Hero 1', rarity: '普通', sales: { daily: 0, total: 0 } },
        { id: 'skin-2', name: 'Skin 2', heroName: 'Hero 2', rarity: '史诗', sales: { daily: 0, total: 0 } },
        { id: 'skin-3', name: 'Skin 3', heroName: 'Hero 1', rarity: '传说', sales: { daily: 0, total: 0 } }
      ];
      
      // Test get by id
      expect(heroSkinStore.getHeroById('hero-1')?.name).toBe('Hero 1');
      expect(heroSkinStore.getHeroById('non-existent')).toBeUndefined();
      
      expect(heroSkinStore.getSkinById('skin-2')?.name).toBe('Skin 2');
      expect(heroSkinStore.getSkinById('non-existent')).toBeUndefined();
      
      // Test get by name
      expect(heroSkinStore.getHeroByName('Hero 2')?.id).toBe('hero-2');
      expect(heroSkinStore.getHeroByName('Non Existent Hero')).toBeUndefined();
      
      // Test get skins by hero
      expect(heroSkinStore.getSkinsByHeroId('hero-1')).toHaveLength(2);
      expect(heroSkinStore.getSkinsByHeroName('Hero 1')).toHaveLength(2);
      expect(heroSkinStore.getSkinsByHeroId('non-existent')).toEqual([]);
      
      // Test get skin hero
      expect(heroSkinStore.getSkinHero(heroSkinStore.skins[0])?.id).toBe('hero-1');
    });
  });
  
  describe('actions', () => {
    describe('initializeData', () => {
      it('should load data from storage', async () => {
        // Mock the return values for getHeroesFromStorage and getSkinsFromStorage
        (getHeroesFromStorage as vi.Mock).mockReturnValue([
          { id: 'hero-1', name: 'Hero 1', role: 'tank', usageRate: 0, winRate: 50, banRate: 0, createdAt: new Date().toISOString() }
        ]);
        
        (getSkinsFromStorage as vi.Mock).mockReturnValue([
          { id: 'skin-1', name: 'Skin 1', heroName: 'Hero 1', rarity: '普通', sales: { daily: 0, total: 0 } }
        ]);
        
        await heroSkinStore.initializeData();
        
        expect(heroSkinStore.heroes).toHaveLength(1);
        expect(heroSkinStore.skins).toHaveLength(1);
        expect(heroSkinStore.loading).toBe(false);
        expect(heroSkinStore.error).toBe(null);
      });
      
      it('should handle errors when loading data', async () => {
        // Mock getHeroesFromStorage to throw an error
        (getHeroesFromStorage as vi.Mock).mockRejectedValue(new Error('Failed to load heroes'));
        
        await heroSkinStore.initializeData();
        
        expect(heroSkinStore.loading).toBe(false);
        expect(heroSkinStore.error).not.toBe(null);
      });
    });
    
    describe('createHero', () => {
      it('should create a new hero', async () => {
        const heroData = {
          name: 'New Hero',
          role: 'tank',
          usageRate: 0,
          winRate: 50,
          banRate: 0
        };
        
        const newHero = await heroSkinStore.createHero(heroData);
        
        expect(newHero).toBeDefined();
        expect(newHero?.id).toBe('hero-1');
        expect(newHero?.name).toBe('New Hero');
        expect(heroSkinStore.heroes).toHaveLength(1);
        expect(saveHeroesToStorage).toHaveBeenCalled();
        expect(saveSkinsToStorage).toHaveBeenCalled();
      });
      
      it('should handle errors when creating a hero', async () => {
        // Mock createHero to throw an error
        (createHero as vi.Mock).mockRejectedValue(new Error('Failed to create hero'));
        
        const heroData = {
          name: 'New Hero',
          role: 'tank',
          usageRate: 0,
          winRate: 50,
          banRate: 0
        };
        
        await expect(heroSkinStore.createHero(heroData)).rejects.toThrow();
        expect(heroSkinStore.heroes).toEqual([]);
      });
    });
    
    describe('updateHero', () => {
      it('should update an existing hero', async () => {
        // Add a hero first
        const initialHero = {
          id: 'hero-1',
          name: 'Initial Hero',
          role: 'tank',
          usageRate: 0,
          winRate: 50,
          banRate: 0,
          createdAt: new Date().toISOString()
        };
        heroSkinStore.heroes = [initialHero];
        
        // Update the hero
        const updatedHero = {
          ...initialHero,
          name: 'Updated Hero',
          winRate: 55
        };
        
        await heroSkinStore.updateHero(updatedHero);
        
        expect(heroSkinStore.heroes[0].name).toBe('Updated Hero');
        expect(heroSkinStore.heroes[0].winRate).toBe(55);
        expect(saveHeroesToStorage).toHaveBeenCalled();
      });
      
      it('should throw an error when updating a non-existent hero', async () => {
        const nonExistentHero = {
          id: 'non-existent',
          name: 'Non Existent Hero',
          role: 'tank',
          usageRate: 0,
          winRate: 50,
          banRate: 0,
          createdAt: new Date().toISOString()
        };
        
        await expect(heroSkinStore.updateHero(nonExistentHero)).rejects.toThrow('英雄不存在');
      });
    });
    
    describe('deleteHero', () => {
      it('should delete a hero and its skins', async () => {
        // Add a hero and its skins
        const hero = {
          id: 'hero-1',
          name: 'Hero 1',
          role: 'tank',
          usageRate: 0,
          winRate: 50,
          banRate: 0,
          createdAt: new Date().toISOString()
        };
        
        const skin1 = {
          id: 'skin-1',
          name: 'Skin 1',
          heroName: 'Hero 1',
          rarity: '普通',
          sales: { daily: 0, total: 0 }
        };
        
        const skin2 = {
          id: 'skin-2',
          name: 'Skin 2',
          heroName: 'Hero 1',
          rarity: '史诗',
          sales: { daily: 0, total: 0 }
        };
        
        const otherSkin = {
          id: 'skin-3',
          name: 'Skin 3',
          heroName: 'Other Hero',
          rarity: '普通',
          sales: { daily: 0, total: 0 }
        };
        
        heroSkinStore.heroes = [hero];
        heroSkinStore.skins = [skin1, skin2, otherSkin];
        
        await heroSkinStore.deleteHero('hero-1');
        
        expect(heroSkinStore.heroes).toEqual([]);
        expect(heroSkinStore.skins).toEqual([otherSkin]);
        expect(saveHeroesToStorage).toHaveBeenCalled();
      });
    });
    
    describe('addSkin', () => {
      it('should add a new skin', async () => {
        const skin = {
          id: 'skin-1',
          name: 'New Skin',
          heroName: 'Hero 1',
          rarity: '普通',
          sales: { daily: 0, total: 0 }
        };
        
        await heroSkinStore.addSkin(skin);
        
        expect(heroSkinStore.skins).toHaveLength(1);
        expect(heroSkinStore.skins[0].id).toBe('skin-1');
        expect(saveSkinsToStorage).toHaveBeenCalled();
      });
      
      it('should handle errors when adding a skin', async () => {
        // Mock saveSkinsToStorage to throw an error
        (saveSkinsToStorage as vi.Mock).mockRejectedValue(new Error('Failed to save skin'));
        
        const skin = {
          id: 'skin-1',
          name: 'New Skin',
          heroName: 'Hero 1',
          rarity: '普通',
          sales: { daily: 0, total: 0 }
        };
        
        await expect(heroSkinStore.addSkin(skin)).rejects.toThrow();
        expect(heroSkinStore.skins).toEqual([]);
      });
    });
    
    describe('updateSkin', () => {
      it('should update an existing skin', async () => {
        // Add a skin first
        const initialSkin = {
          id: 'skin-1',
          name: 'Initial Skin',
          heroName: 'Hero 1',
          rarity: '普通',
          sales: { daily: 0, total: 0 }
        };
        heroSkinStore.skins = [initialSkin];
        
        // Update the skin
        const updatedSkin = {
          ...initialSkin,
          name: 'Updated Skin',
          rarity: '史诗'
        };
        
        await heroSkinStore.updateSkin(updatedSkin);
        
        expect(heroSkinStore.skins[0].name).toBe('Updated Skin');
        expect(heroSkinStore.skins[0].rarity).toBe('史诗');
        expect(saveSkinsToStorage).toHaveBeenCalled();
      });
      
      it('should throw an error when updating a non-existent skin', async () => {
        const nonExistentSkin = {
          id: 'non-existent',
          name: 'Non Existent Skin',
          heroName: 'Hero 1',
          rarity: '普通',
          sales: { daily: 0, total: 0 }
        };
        
        await expect(heroSkinStore.updateSkin(nonExistentSkin)).rejects.toThrow('皮肤不存在');
      });
    });
    
    describe('deleteSkin', () => {
      it('should delete a skin', async () => {
        // Add a skin
        const skin = {
          id: 'skin-1',
          name: 'Skin 1',
          heroName: 'Hero 1',
          rarity: '普通',
          sales: { daily: 0, total: 0 }
        };
        heroSkinStore.skins = [skin];
        
        await heroSkinStore.deleteSkin('skin-1');
        
        expect(heroSkinStore.skins).toEqual([]);
        expect(saveSkinsToStorage).toHaveBeenCalled();
      });
    });
    
    describe('deleteSkins', () => {
      it('should delete multiple skins', async () => {
        // Add multiple skins
        const skins = [
          { id: 'skin-1', name: 'Skin 1', heroName: 'Hero 1', rarity: '普通', sales: { daily: 0, total: 0 } },
          { id: 'skin-2', name: 'Skin 2', heroName: 'Hero 1', rarity: '史诗', sales: { daily: 0, total: 0 } },
          { id: 'skin-3', name: 'Skin 3', heroName: 'Hero 2', rarity: '传说', sales: { daily: 0, total: 0 } }
        ];
        heroSkinStore.skins = skins;
        
        await heroSkinStore.deleteSkins(['skin-1', 'skin-3']);
        
        expect(heroSkinStore.skins).toHaveLength(1);
        expect(heroSkinStore.skins[0].id).toBe('skin-2');
        expect(saveSkinsToStorage).toHaveBeenCalled();
      });
    });
    
    describe('autoGenerateHero', () => {
      it('should auto generate a hero', async () => {
        const newHero = await heroSkinStore.autoGenerateHero();
        
        expect(newHero).toBeDefined();
        expect(newHero?.id).toBe('auto-hero-1');
        expect(heroSkinStore.heroes).toHaveLength(1);
        expect(saveHeroesToStorage).toHaveBeenCalled();
      });
    });
    
    describe('batchGenerateHeroes', () => {
      it('should batch generate heroes', async () => {
        const count = 3;
        const newHeroes = await heroSkinStore.batchGenerateHeroes(count);
        
        expect(newHeroes).toHaveLength(count);
        expect(heroSkinStore.heroes).toHaveLength(count);
        expect(batchGenerateHeroes).toHaveBeenCalledWith(count);
        expect(saveHeroesToStorage).toHaveBeenCalled();
      });
    });
    
    describe('advanceHeroDevelopment', () => {
      it('should advance hero development', async () => {
        await heroSkinStore.advanceHeroDevelopment('hero-1');
        
        expect(advanceDevelopment).toHaveBeenCalledWith('hero-1', true, 'normal');
        expect(getHeroesFromStorage).toHaveBeenCalled();
        expect(getSkinsFromStorage).toHaveBeenCalled();
      });
    });
    
    describe('pauseHeroDevelopment', () => {
      it('should pause hero development', async () => {
        await heroSkinStore.pauseHeroDevelopment('hero-1');
        
        expect(pauseHeroDevelopment).toHaveBeenCalledWith('hero-1');
        expect(getHeroesFromStorage).toHaveBeenCalled();
        expect(getSkinsFromStorage).toHaveBeenCalled();
      });
    });
    
    describe('cancelHeroDevelopment', () => {
      it('should cancel hero development', async () => {
        await heroSkinStore.cancelHeroDevelopment('hero-1');
        
        expect(cancelHeroDevelopment).toHaveBeenCalledWith('hero-1');
        expect(getHeroesFromStorage).toHaveBeenCalled();
        expect(getSkinsFromStorage).toHaveBeenCalled();
      });
    });
    
    describe('calculateHeroDevelopmentCost', () => {
      it('should calculate hero development cost', () => {
        const hero = {
          id: 'hero-1',
          name: 'Hero 1',
          role: 'tank',
          usageRate: 0,
          winRate: 50,
          banRate: 0,
          createdAt: new Date().toISOString()
        };
        
        const cost = heroSkinStore.calculateHeroDevelopmentCost(hero);
        
        expect(cost).toBe(1000);
        expect(calculateHeroDevelopmentCost).toHaveBeenCalledWith(hero, 'normal');
      });
    });
    
    describe('analyzeHeroBalance', () => {
      it('should analyze hero balance', () => {
        const hero = {
          id: 'hero-1',
          name: 'Hero 1',
          role: 'tank',
          usageRate: 0,
          winRate: 50,
          banRate: 0,
          createdAt: new Date().toISOString()
        };
        
        const analysis = heroSkinStore.analyzeHeroBalance(hero);
        
        expect(analysis).toEqual({ heroId: 'hero-1', overallScore: 80, warnings: [] });
        expect(analyzeHeroBalance).toHaveBeenCalledWith(hero);
      });
    });
    
    describe('analyzeAllHeroesBalance', () => {
      it('should analyze all heroes balance', () => {
        const analysis = heroSkinStore.analyzeAllHeroesBalance();
        
        expect(analysis).toEqual([]);
        expect(analyzeAllHeroesBalance).toHaveBeenCalled();
      });
    });
    
    describe('adjustHeroAttributes', () => {
      it('should adjust hero attributes', async () => {
        // Add a hero first
        const hero = {
          id: 'hero-1',
          name: 'Test Hero',
          role: 'tank',
          usageRate: 0,
          winRate: 50,
          banRate: 0,
          createdAt: new Date().toISOString(),
          health: 1000,
          attack: 100,
          defense: 50
        };
        heroSkinStore.heroes = [hero];
        
        const adjustments = { health: 200, attack: 50 };
        await heroSkinStore.adjustHeroAttributes('hero-1', adjustments);
        
        expect(adjustHeroAttributes).toHaveBeenCalledWith('hero-1', adjustments);
        expect(saveHeroesToStorage).toHaveBeenCalled();
      });
    });
    
    describe('clearAllData', () => {
      it('should clear all data', async () => {
        // Add some test data
        heroSkinStore.heroes = [
          { id: 'hero-1', name: 'Hero 1', role: 'tank', usageRate: 0, winRate: 50, banRate: 0, createdAt: new Date().toISOString() }
        ];
        
        heroSkinStore.skins = [
          { id: 'skin-1', name: 'Skin 1', heroName: 'Hero 1', rarity: '普通', sales: { daily: 0, total: 0 } }
        ];
        
        await heroSkinStore.clearAllData();
        
        expect(heroSkinStore.heroes).toEqual([]);
        expect(heroSkinStore.skins).toEqual([]);
        expect(saveHeroesToStorage).toHaveBeenCalledWith([]);
        expect(saveSkinsToStorage).toHaveBeenCalledWith([]);
      });
    });
    
    describe('isHeroExists and isSkinExists', () => {
      it('should check if hero or skin exists', () => {
        // Add some test data
        heroSkinStore.heroes = [
          { id: 'hero-1', name: 'Hero 1', role: 'tank', usageRate: 0, winRate: 50, banRate: 0, createdAt: new Date().toISOString() }
        ];
        
        heroSkinStore.skins = [
          { id: 'skin-1', name: 'Skin 1', heroName: 'Hero 1', rarity: '普通', sales: { daily: 0, total: 0 } }
        ];
        
        expect(heroSkinStore.isHeroExists('Hero 1')).toBe(true);
        expect(heroSkinStore.isHeroExists('Non Existent Hero')).toBe(false);
        
        expect(heroSkinStore.isSkinExists('skin-1')).toBe(true);
        expect(heroSkinStore.isSkinExists('non-existent-skin')).toBe(false);
      });
    });
  });
});
