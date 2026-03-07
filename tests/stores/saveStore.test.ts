import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSaveStore } from '@/stores/saveStore';
import { useGameStore } from '@/stores/gameStore';

describe('saveStore', () => {
  beforeEach(() => {
    // 重置Pinia状态
    const pinia = createPinia();
    setActivePinia(pinia);
    
    // 完整模拟localStorage
    const store = {} as Record<string, string>;
    const localStorageMock = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value }),
      removeItem: vi.fn((key: string) => { delete store[key] }),
      clear: vi.fn(() => { Object.keys(store).forEach(key => delete store[key]) }),
      length: 0
    };
    
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // 模拟Date
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-07T12:00:00Z'));
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  describe('状态初始化', () => {
    it('应该初始化空的存档列表和null的当前存档ID', () => {
      const saveStore = useSaveStore();
      expect(saveStore.saves).toEqual([]);
      expect(saveStore.currentSaveId).toBeNull();
      expect(saveStore.autoSaveInterval).toBeNull();
    });
  });
  
  describe('getters', () => {
    it('getAllSaves应该返回所有存档', () => {
      const saveStore = useSaveStore();
      const mockSaves = [
        { id: '1', date: new Date(), preview: { currentDate: { year: 2026, month: 3, day: 7 }, money: 1000, plannerLevel: '1', plannerSubLevel: '1' } },
        { id: '2', date: new Date(), preview: { currentDate: { year: 2026, month: 3, day: 8 }, money: 2000, plannerLevel: '1', plannerSubLevel: '2' } }
      ];
      
      saveStore.saves = mockSaves;
      expect(saveStore.getAllSaves).toEqual(mockSaves);
    });
    
    it('getCurrentSave应该返回当前存档', () => {
      const saveStore = useSaveStore();
      const mockSaves = [
        { id: '1', date: new Date(), preview: { currentDate: { year: 2026, month: 3, day: 7 }, money: 1000, plannerLevel: '1', plannerSubLevel: '1' } },
        { id: '2', date: new Date(), preview: { currentDate: { year: 2026, month: 3, day: 8 }, money: 2000, plannerLevel: '1', plannerSubLevel: '2' } }
      ];
      
      saveStore.saves = mockSaves;
      saveStore.currentSaveId = '2';
      
      expect(saveStore.getCurrentSave).toEqual(mockSaves[1]);
    });
    
    it('当没有当前存档ID时，getCurrentSave应该返回null', () => {
      const saveStore = useSaveStore();
      expect(saveStore.getCurrentSave).toBeNull();
    });
    
    it('当当前存档ID无效时，getCurrentSave应该返回null', () => {
      const saveStore = useSaveStore();
      const mockSaves = [
        { id: '1', date: new Date(), preview: { currentDate: { year: 2026, month: 3, day: 7 }, money: 1000, plannerLevel: '1', plannerSubLevel: '1' } }
      ];
      
      saveStore.saves = mockSaves;
      saveStore.currentSaveId = 'invalid-id';
      
      expect(saveStore.getCurrentSave).toBeNull();
    });
  });
  
  describe('actions', () => {
    describe('loadSavesFromStorage', () => {
      it('应该从localStorage加载存档并转换日期', () => {
        const saveStore = useSaveStore();
        const mockSaves = [
          { id: '1', date: '2026-03-07T12:00:00.000Z', preview: { currentDate: { year: 2026, month: 3, day: 7 }, money: 1000, plannerLevel: '1', plannerSubLevel: '1' } },
          { id: '2', date: '2026-03-08T12:00:00.000Z', preview: { currentDate: { year: 2026, month: 3, day: 8 }, money: 2000, plannerLevel: '1', plannerSubLevel: '2' } }
        ];
        
        localStorage.setItem('game_saves', JSON.stringify(mockSaves));
        saveStore.loadSavesFromStorage();
        
        expect(saveStore.saves).toHaveLength(2);
        expect(saveStore.saves[0].id).toBe('1');
        expect(saveStore.saves[0].date).toBeInstanceOf(Date);
        expect(saveStore.saves[0].date.toISOString()).toBe('2026-03-07T12:00:00.000Z');
      });
      
      it('当localStorage中没有存档时，应该初始化空数组', () => {
        const saveStore = useSaveStore();
        localStorage.removeItem('game_saves');
        
        saveStore.loadSavesFromStorage();
        
        expect(saveStore.saves).toEqual([]);
      });
      
      it('当localStorage中的存档格式无效时，应该初始化空数组', () => {
        const saveStore = useSaveStore();
        localStorage.setItem('game_saves', 'invalid-json');
        
        saveStore.loadSavesFromStorage();
        
        expect(saveStore.saves).toEqual([]);
      });
    });
    
    describe('saveSavesToStorage', () => {
      it('应该将存档保存到localStorage', () => {
        const saveStore = useSaveStore();
        const mockSaves = [
          { id: '1', date: new Date('2026-03-07T12:00:00Z'), preview: { currentDate: { year: 2026, month: 3, day: 7 }, money: 1000, plannerLevel: '1', plannerSubLevel: '1' } }
        ];
        
        saveStore.saves = mockSaves;
        saveStore.saveSavesToStorage();
        
        const savedSaves = JSON.parse(localStorage.getItem('game_saves') || '[]');
        expect(savedSaves).toHaveLength(1);
        expect(savedSaves[0].id).toBe('1');
        expect(savedSaves[0].date).toBe('2026-03-07T12:00:00.000Z');
      });
    });
    
    describe('createSave', () => {
      it('应该创建新存档并保存到localStorage', () => {
        const saveStore = useSaveStore();
        const gameStore = useGameStore();
        
        // 设置游戏状态
        gameStore.currentDate = { year: 2026, month: 3, day: 7 };
        gameStore.money = 1000;
        gameStore.plannerLevel = '1';
        gameStore.plannerSubLevel = '1';
        
        const saveId = saveStore.createSave();
        
        // 验证存档列表
        expect(saveStore.saves).toHaveLength(1);
        expect(saveStore.currentSaveId).toBe(saveId);
        
        // 验证localStorage中的游戏数据
        const gameData = JSON.parse(localStorage.getItem(`game_save_${saveId}`) || '{}');
        expect(gameData.currentDate).toEqual({ year: 2026, month: 3, day: 7 });
        expect(gameData.money).toBe(1000);
        
        // 验证localStorage中的存档列表
        const savedSaves = JSON.parse(localStorage.getItem('game_saves') || '[]');
        expect(savedSaves).toHaveLength(1);
        expect(savedSaves[0].id).toBe(saveId);
      });
    });
    
    describe('loadSave', () => {
      it('应该加载指定存档并更新gameStore', () => {
        const saveStore = useSaveStore();
        const gameStore = useGameStore();
        
        // 创建模拟存档数据
        const mockSaveData = {
          currentDate: { year: 2026, month: 3, day: 7 },
          isPlayerTurn: true,
          money: 2000,
          reputation: 50,
          popularity: 100,
          wordOfMouth: 80,
          totalMoney: 5000,
          heroCount: 5,
          skinCount: 10,
          plannerLevel: '2',
          plannerSubLevel: '3',
          plannerExp: 1500,
          ongoingProjects: [],
          onlineHeroes: [],
          onlineSkins: [],
          activeEvents: []
        };
        
        const saveId = 'test-save-1';
        localStorage.setItem(`game_save_${saveId}`, JSON.stringify(mockSaveData));
        
        // 添加到存档列表
        saveStore.saves.push({
          id: saveId,
          date: new Date(),
          preview: {
            currentDate: mockSaveData.currentDate,
            money: mockSaveData.money,
            plannerLevel: mockSaveData.plannerLevel,
            plannerSubLevel: mockSaveData.plannerSubLevel
          }
        });
        
        // 加载存档
        const result = saveStore.loadSave(saveId);
        
        expect(result).toBe(true);
        expect(saveStore.currentSaveId).toBe(saveId);
        expect(gameStore.currentDate).toEqual(mockSaveData.currentDate);
        expect(gameStore.money).toBe(mockSaveData.money);
        expect(gameStore.plannerLevel).toBe(mockSaveData.plannerLevel);
      });
      
      it('当存档不存在时，应该返回false', () => {
        const saveStore = useSaveStore();
        const result = saveStore.loadSave('non-existent-save');
        
        expect(result).toBe(false);
        expect(saveStore.currentSaveId).toBeNull();
      });
    });
    
    describe('deleteSave', () => {
      it('应该删除指定存档并更新状态', () => {
        const saveStore = useSaveStore();
        
        // 创建模拟存档
        const saveId = 'test-save-1';
        localStorage.setItem(`game_save_${saveId}`, JSON.stringify({}));
        
        saveStore.saves.push({
          id: saveId,
          date: new Date(),
          preview: { currentDate: { year: 2026, month: 3, day: 7 }, money: 1000, plannerLevel: '1', plannerSubLevel: '1' }
        });
        
        saveStore.currentSaveId = saveId;
        
        // 删除存档
        const result = saveStore.deleteSave(saveId);
        
        expect(result).toBe(true);
        expect(saveStore.saves).toEqual([]);
        expect(saveStore.currentSaveId).toBeNull();
        expect(localStorage.getItem(`game_save_${saveId}`)).toBeNull();
      });
      
      it('删除非当前存档时，应该保持currentSaveId不变', () => {
        const saveStore = useSaveStore();
        
        // 创建两个模拟存档
        const saveId1 = 'test-save-1';
        const saveId2 = 'test-save-2';
        
        localStorage.setItem(`game_save_${saveId1}`, JSON.stringify({}));
        localStorage.setItem(`game_save_${saveId2}`, JSON.stringify({}));
        
        saveStore.saves.push(
          {
            id: saveId1,
            date: new Date(),
            preview: { currentDate: { year: 2026, month: 3, day: 7 }, money: 1000, plannerLevel: '1', plannerSubLevel: '1' }
          },
          {
            id: saveId2,
            date: new Date(),
            preview: { currentDate: { year: 2026, month: 3, day: 8 }, money: 2000, plannerLevel: '1', plannerSubLevel: '2' }
          }
        );
        
        saveStore.currentSaveId = saveId1;
        
        // 删除第二个存档
        const result = saveStore.deleteSave(saveId2);
        
        expect(result).toBe(true);
        expect(saveStore.saves).toHaveLength(1);
        expect(saveStore.saves[0].id).toBe(saveId1);
        expect(saveStore.currentSaveId).toBe(saveId1);
      });
    });
    
    describe('serializeGameData和deserializeGameData', () => {
      it('应该正确序列化和反序列化游戏数据', () => {
        const saveStore = useSaveStore();
        const gameStore = useGameStore();
        
        // 设置游戏状态
        gameStore.currentDate = { year: 2026, month: 3, day: 7 };
        gameStore.isPlayerTurn = true;
        gameStore.money = 1500;
        gameStore.reputation = 60;
        gameStore.popularity = 120;
        gameStore.wordOfMouth = 90;
        gameStore.totalMoney = 6000;
        gameStore.heroCount = 6;
        gameStore.skinCount = 12;
        gameStore.plannerLevel = '2';
        gameStore.plannerSubLevel = '4';
        gameStore.plannerExp = 2000;
        gameStore.ongoingProjects = [{ id: 'proj-1', name: 'Test Project', type: 'hero', progress: 50, dailyProgress: 10, status: 'in_progress', details: {} }];
        gameStore.onlineHeroes = [];
        gameStore.onlineSkins = [];
        gameStore.activeEvents = [];
        
        // 序列化数据
        const serializedData = saveStore.serializeGameData(gameStore);
        
        // 重置游戏状态
        const newGameStore = useGameStore();
        newGameStore.money = 0;
        newGameStore.reputation = 0;
        
        // 反序列化数据
        saveStore.deserializeGameData(newGameStore, serializedData);
        
        // 验证数据
        expect(newGameStore.currentDate).toEqual({ year: 2026, month: 3, day: 7 });
        expect(newGameStore.isPlayerTurn).toBe(true);
        expect(newGameStore.money).toBe(1500);
        expect(newGameStore.reputation).toBe(60);
        expect(newGameStore.ongoingProjects).toHaveLength(1);
        expect(newGameStore.ongoingProjects[0].id).toBe('proj-1');
      });
    });
    
    describe('startAutoSave和stopAutoSave', () => {
      it('应该启动自动存档定时器', () => {
        const saveStore = useSaveStore();
        
        // 模拟setInterval
        const mockSetInterval = vi.spyOn(window, 'setInterval').mockReturnValue(123 as unknown as number);
        
        saveStore.startAutoSave();
        
        expect(saveStore.autoSaveInterval).toBe(123);
        expect(mockSetInterval).toHaveBeenCalled();
        expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 5 * 60 * 1000);
        
        mockSetInterval.mockRestore();
      });
      
      it('应该停止自动存档定时器', () => {
        const saveStore = useSaveStore();
        
        // 模拟setInterval和clearInterval
        const mockSetInterval = vi.spyOn(window, 'setInterval').mockReturnValue(123 as unknown as number);
        const mockClearInterval = vi.spyOn(window, 'clearInterval').mockImplementation();
        
        saveStore.startAutoSave();
        saveStore.stopAutoSave();
        
        expect(saveStore.autoSaveInterval).toBeNull();
        expect(mockClearInterval).toHaveBeenCalledWith(123);
        
        mockSetInterval.mockRestore();
        mockClearInterval.mockRestore();
      });
      
      it('当autoSaveInterval为null时，stopAutoSave应该不执行任何操作', () => {
        const saveStore = useSaveStore();
        
        // 模拟clearInterval
        const mockClearInterval = vi.spyOn(window, 'clearInterval').mockImplementation();
        
        saveStore.stopAutoSave();
        
        expect(mockClearInterval).not.toHaveBeenCalled();
        
        mockClearInterval.mockRestore();
      });
    });
    
    describe('initialize', () => {
      it('应该初始化存档系统', () => {
        const saveStore = useSaveStore();
        
        // 模拟方法
        const mockLoadSavesFromStorage = vi.spyOn(saveStore, 'loadSavesFromStorage').mockImplementation();
        const mockStartAutoSave = vi.spyOn(saveStore, 'startAutoSave').mockImplementation();
        
        saveStore.initialize();
        
        expect(mockLoadSavesFromStorage).toHaveBeenCalled();
        expect(mockStartAutoSave).toHaveBeenCalled();
        
        mockLoadSavesFromStorage.mockRestore();
        mockStartAutoSave.mockRestore();
      });
    });
  });
});
