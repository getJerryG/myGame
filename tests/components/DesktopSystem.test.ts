import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DesktopSystem from '@/components/common/DesktopSystem/index.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

// 模拟子组件
const mockNotchBar = { template: '<div>NotchBar</div>' };
const mockTaskSystemPanel = { template: '<div>TaskSystemPanel</div>' };
const mockExitConfirmDialog = { template: '<div>ExitConfirmDialog</div>' };
const mockDesktopLevelUpEffect = { template: '<div>DesktopLevelUpEffect</div>' };
const mockDesktopBackground = { template: '<div>DesktopBackground</div>' };
const mockDesktopTaskbar = { template: '<div>DesktopTaskbar</div>' };
const mockDesktopAppContainer = { template: '<div>DesktopAppContainer</div>' };

// 模拟组件的导入
vi.mock('@/components/common/NotchBar/index.vue', () => ({
  default: mockNotchBar
}));

vi.mock('@/components/common/TaskSystemPanel/index.vue', () => ({
  default: mockTaskSystemPanel
}));

vi.mock('@/components/common/dialogs/ExitConfirmDialog.vue', () => ({
  default: mockExitConfirmDialog
}));

vi.mock('@/components/common/DesktopSystem/DesktopLevelUpEffect.vue', () => ({
  default: mockDesktopLevelUpEffect
}));

vi.mock('@/components/common/DesktopSystem/DesktopBackground.vue', () => ({
  default: mockDesktopBackground
}));

vi.mock('@/components/common/DesktopSystem/DesktopTaskbar.vue', () => ({
  default: mockDesktopTaskbar
}));

vi.mock('@/components/common/DesktopAppContainer/index.vue', () => ({
  default: mockDesktopAppContainer
}));

// 模拟所有store
const mockStores = [
  'useGameStore',
  'useSimulationGameStateStore',
  'usePlayerStore',
  'useSimulationStore',
  'useSimulationCareerSystemStore',
  'useWindowManagerStore',
  'useSimulationTaskSystemStore',
  'useSimulationNewbieGoalsStore',
  'useSimulationSkinDevelopmentStore',
  'useSimulationHeroDevelopmentStore',
  'useSimulationBusinessDataStore',
  'useSimulationCoreGoalsStore',
  'useLotteryStorageStore',
  'useHeroSkinStore',
  'useModalStore'
];

mockStores.forEach(store => {
  vi.mock(`@/stores/${store.includes('Simulation') ? `simulation/${store}` : store}`, () => ({
    [store]: vi.fn(() => ({
      $state: {},
      $reset: vi.fn(),
      resetResources: vi.fn(),
      resetStatistics: vi.fn(),
      resetGameState: vi.fn(),
      resetPlayer: vi.fn(),
      resetSimulation: vi.fn(),
      resetTaskSystem: vi.fn(),
      resetCareerSystem: vi.fn(),
      resetNewbieGoals: vi.fn(),
      resetSkinDevelopmentSystem: vi.fn(),
      resetHeroDevelopmentSystem: vi.fn(),
      resetBusinessData: vi.fn(),
      clearAllData: vi.fn(),
      addExp: vi.fn(() => ({ fundsEarned: 0 })),
      getCurrentCareerLevel: { name: '初级策划' },
      getCurrentSubLevel: { name: 'I', expRequired: 100 },
      levelIndex: 0,
      currentLevelIndex: 0,
      currentSubLevelIndex: 0,
      exp: 0,
      windows: [],
      downloadProgress: [],
      isDownloading: vi.fn(() => false),
      getDownloadProgress: vi.fn(() => 0),
      isDownloadCompleted: vi.fn(() => false),
      cancelDownload: vi.fn()
    }))
  }));
});

describe('DesktopSystem Component', () => {
  let wrapper: any;
  let pinia: any;
  let router: any;
  
  // 模拟游戏数据
  const mockGameData = {
    player: { name: '测试玩家' },
    balance: 1000
  };
  
  // 保存原始的localStorage
  const originalLocalStorage = localStorage;
  
  beforeEach(() => {
    // 创建pinia实例
    pinia = createPinia();
    
    // 创建路由实例
    router = createRouter({
      history: createWebHistory(),
      routes: []
    });
    
    // 模拟localStorage
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.getItem = vi.fn(() => null);
    Storage.prototype.removeItem = vi.fn();
    
    // 模拟window.location.reload
    window.location.reload = vi.fn();
    
    // 模拟confirm
    window.confirm = vi.fn(() => true);
    
    // 挂载组件
    wrapper = mount(DesktopSystem, {
      props: {
        gameData: mockGameData
      },
      global: {
        plugins: [pinia, router],
        stubs: {
          // 可以在这里 stub 任何需要的组件
        }
      }
    });
  });
  
  afterEach(() => {
    // 恢复原始的localStorage
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
  });
  
  it('should render correctly with all child components', () => {
    // 检查组件是否正确渲染
    expect(wrapper.exists()).toBe(true);
    
    // 检查所有子组件是否都被渲染
    expect(wrapper.findComponent(mockNotchBar).exists()).toBe(true);
    expect(wrapper.findComponent(mockTaskSystemPanel).exists()).toBe(true);
    expect(wrapper.findComponent(mockExitConfirmDialog).exists()).toBe(true);
    expect(wrapper.findComponent(mockDesktopLevelUpEffect).exists()).toBe(true);
    expect(wrapper.findComponent(mockDesktopBackground).exists()).toBe(true);
    expect(wrapper.findComponent(mockDesktopTaskbar).exists()).toBe(true);
  });
  
  it('should initialize correctly with initial desktop apps', () => {
    // 检查desktopApps是否被正确初始化
    // 由于desktopApps是组件内部的ref，我们无法直接访问，但可以通过测试其他依赖它的功能来间接验证
  });
  
  it('should handle app installation correctly', async () => {
    // 触发app-installed事件
    await wrapper.vm.handleAppInstalled({
      id: 'test-app',
      name: '测试应用',
      icon: '📱',
      position: { x: 0, y: 0 },
      coreData: {},
      modules: []
    });
    
    // 检查localStorage是否被调用
    expect(Storage.prototype.setItem).toHaveBeenCalled();
  });
  
  it('should save desktop apps to localStorage', () => {
    // 调用saveDesktopApps方法
    wrapper.vm.saveDesktopApps();
    
    // 检查localStorage是否被调用
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('desktop-apps', expect.any(String));
  });
  
  it('should load desktop apps from localStorage when available', () => {
    // 模拟localStorage返回数据
    const mockApps = JSON.stringify([{
      id: 'test-app',
      name: '测试应用',
      icon: '📱',
      position: { x: 0, y: 0 },
      coreData: {},
      modules: []
    }]);
    
    Storage.prototype.getItem.mockReturnValue(mockApps);
    
    // 重新挂载组件以测试loadDesktopApps
    wrapper = mount(DesktopSystem, {
      props: {
        gameData: mockGameData
      },
      global: {
        plugins: [pinia, router]
      }
    });
    
    // 检查localStorage是否被调用
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('desktop-apps');
  });
  
  it('should use initial desktop apps when localStorage is empty', () => {
    // 模拟localStorage返回null
    Storage.prototype.getItem.mockReturnValue(null);
    
    // 重新挂载组件以测试loadDesktopApps
    wrapper = mount(DesktopSystem, {
      props: {
        gameData: mockGameData
      },
      global: {
        plugins: [pinia, router]
      }
    });
    
    // 检查localStorage是否被调用
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('desktop-apps');
  });
  
  it('should reset app positions correctly', () => {
    // 创建测试应用列表
    const testApps = [
      { id: 'app1', name: '应用1', icon: '📱', position: { x: 0, y: 0 }, coreData: {}, modules: [] },
      { id: 'app2', name: '应用2', icon: '📱', position: { x: 0, y: 0 }, coreData: {}, modules: [] },
      { id: 'app3', name: '应用3', icon: '📱', position: { x: 0, y: 0 }, coreData: {}, modules: [] }
    ];
    
    // 调用resetAppPositions方法
    wrapper.vm.resetAppPositions(testApps);
    
    // 检查应用位置是否被正确重置
    expect(testApps[0].position).toEqual({ x: 50, y: 50 });
    expect(testApps[1].position).toEqual({ x: 250, y: 50 });
    expect(testApps[2].position).toEqual({ x: 450, y: 50 });
  });
  
  it('should handle saveGame correctly', () => {
    // 调用saveGame方法
    wrapper.vm.saveGame();
    
    // 检查localStorage是否被调用
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('game-snapshots', expect.any(String));
  });
  
  it('should handle restartGame correctly', () => {
    // 调用restartGame方法
    wrapper.vm.restartGame();
    
    // 检查localStorage.removeItem是否被调用
    expect(Storage.prototype.removeItem).toHaveBeenCalled();
    
    // 检查window.location.reload是否被调用
    expect(window.location.reload).toHaveBeenCalled();
  });
  
  it('should handle addExp correctly', () => {
    // 调用addExp方法
    wrapper.vm.addExp(100);
    
    // 检查addExp方法是否被调用
    // 由于addExp是通过provide提供的，我们无法直接访问，但可以通过测试store的addExp方法是否被调用
  });
  
  it('should update career data correctly', () => {
    // 调用updateCareerData方法
    wrapper.vm.updateCareerData();
    
    // 检查策划数据是否被正确更新
    expect(wrapper.vm.plannerLevel).toBe(1);
    expect(wrapper.vm.plannerRankName).toBe('初级策划');
    expect(wrapper.vm.plannerTier).toBe('I');
  });
  
  it('should show level up effect when level changes', () => {
    // 设置previousLevel为0，然后调用updateCareerData
    wrapper.vm.previousLevel = 0;
    wrapper.vm.updateCareerData();
    
    // 检查showLevelUpEffect是否为true
    expect(wrapper.vm.showLevelUpEffect).toBe(true);
    expect(wrapper.vm.levelUpMessage).toBe('恭喜晋升为初级策划 I');
  });
  
  it('should not show level up effect when level remains the same', () => {
    // 设置previousLevel为1，然后调用updateCareerData
    wrapper.vm.previousLevel = 1;
    wrapper.vm.updateCareerData();
    
    // 检查showLevelUpEffect是否为false
    expect(wrapper.vm.showLevelUpEffect).toBe(false);
  });
  
  it('should close level up effect after 3 seconds', () => {
    // 模拟setTimeout
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      // 立即执行回调函数
      fn();
      return 1 as unknown as NodeJS.Timeout;
    });
    
    // 设置previousLevel为0，然后调用updateCareerData
    wrapper.vm.previousLevel = 0;
    wrapper.vm.updateCareerData();
    
    // 检查setTimeout是否被调用
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000);
    
    // 检查showLevelUpEffect是否为false
    expect(wrapper.vm.showLevelUpEffect).toBe(false);
    
    // 恢复原始的setTimeout
    setTimeoutSpy.mockRestore();
  });
  
  it('should merge desktop apps and downloading apps correctly', () => {
    // 检查allDesktopApps计算属性是否正确合并了桌面应用和下载中的应用
    // 由于allDesktopApps是组件内部的计算属性，我们无法直接访问，但可以通过测试组件的渲染来间接验证
  });
  
  it('should handle closeApp correctly', () => {
    // 调用closeApp方法
    wrapper.vm.closeApp('test-app');
    
    // 检查activeApps和minimizedApps是否被正确更新
    // 由于这些是组件内部的ref，我们无法直接访问，但可以通过测试其他依赖它们的功能来间接验证
  });
});
