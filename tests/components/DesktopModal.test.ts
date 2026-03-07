import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DesktopModal from '@/components/common/DesktopModal/index.vue';

// 模拟应用组件
const mockChatApp = { template: '<div>Chat App</div>' };
const mockGameReleaseApp = { template: '<div>Game Release App</div>' };

// 模拟应用组件的导入
vi.mock('@/components/business/apps/chat/ChatApp.vue', () => ({
  default: mockChatApp
}));

vi.mock('@/modules/game/views/GameReleaseApp.vue', () => ({
  default: mockGameReleaseApp
}));

// 其他应用组件的模拟
const mockComponents = [
  'DataCenterApp',
  'OperationsApp',
  'ContentApp',
  'RewardsApp',
  'WalletApp',
  'LotteryApp',
  'GameSettingsApp',
  'AppStore',
  'HeroApp',
  'SkinApp'
];

mockComponents.forEach(component => {
  vi.mock(`@/components/business/apps/${component.includes('DataCenter') ? 'DataCenter/DataCenterApp' : 
    component.includes('Operations') ? 'operations/OperationsApp' : 
    component.includes('Content') ? 'content/ContentApp' : 
    component.includes('Rewards') ? 'rewards/RewardsApp' : 
    component.includes('Wallet') ? 'wallet/WalletApp' : 
    component.includes('Lottery') ? 'lottery/LotteryApp' : 
    component.includes('GameSettings') ? 'game-settings/GameSettingsApp' : 
    component.includes('AppStore') ? 'AppStore/AppStore' : 
    component.includes('Hero') ? 'hero/HeroApp' : 
    component.includes('Skin') ? 'skin/SkinApp' : component}/${component}.vue`, () => ({
    default: { template: `<div>${component}</div>` }
  }));
});

describe('DesktopModal Component', () => {
  let wrapper: any;
  
  // 模拟模态框数据
  const mockModal = {
    id: 'test-modal',
    position: { x: 100, y: 100 },
    size: { width: 800, height: 600 },
    isMaximized: false,
    isMinimized: false,
    activeModule: 'module1'
  };
  
  // 模拟应用数据
  const mockApp = {
    id: 'chat',
    name: '聊天应用',
    icon: '💬',
    position: { x: 100, y: 100 },
    coreData: {},
    modules: []
  };
  
  // 模拟游戏数据
  const mockGameData = {
    player: { name: '测试玩家' },
    balance: 1000
  };
  
  beforeEach(() => {
    // 挂载组件
    wrapper = mount(DesktopModal, {
      props: {
        modal: mockModal,
        app: mockApp,
        gameData: mockGameData
      }
    });
  });
  
  it('should render correctly with basic structure', () => {
    // 检查组件是否正确渲染
    expect(wrapper.exists()).toBe(true);
    
    // 检查容器类
    expect(wrapper.classes()).toContain('desktop-modal');
    expect(wrapper.classes()).not.toContain('is-maximized');
    expect(wrapper.classes()).not.toContain('is-minimized');
    
    // 检查标题栏
    expect(wrapper.find('.modal-header').exists()).toBe(true);
    
    // 检查内容区域
    expect(wrapper.find('.modal-content').exists()).toBe(true);
  });
  
  it('should render title bar with correct content and buttons', () => {
    // 检查应用图标
    expect(wrapper.find('.app-icon').text()).toBe('💬');
    
    // 检查应用名称
    expect(wrapper.find('.app-name').text()).toBe('聊天应用');
    
    // 检查控制按钮
    expect(wrapper.find('.control-button.minimize').exists()).toBe(true);
    expect(wrapper.find('.control-button.maximize').exists()).toBe(true);
    expect(wrapper.find('.control-button.close').exists()).toBe(true);
    
    // 检查最大化按钮文本
    expect(wrapper.find('.control-button.maximize span').text()).toBe('□');
  });
  
  it('should emit close event when close button is clicked', async () => {
    // 点击关闭按钮
    await wrapper.find('.control-button.close').trigger('click');
    
    // 检查是否发出了正确的事件
    expect(wrapper.emitted('close')).toBeTruthy();
  });
  
  it('should emit minimize event when minimize button is clicked', async () => {
    // 点击最小化按钮
    await wrapper.find('.control-button.minimize').trigger('click');
    
    // 检查是否发出了正确的事件
    expect(wrapper.emitted('minimize')).toBeTruthy();
  });
  
  it('should emit maximize event when maximize button is clicked', async () => {
    // 点击最大化按钮
    await wrapper.find('.control-button.maximize').trigger('click');
    
    // 检查是否发出了正确的事件
    expect(wrapper.emitted('maximize')).toBeTruthy();
  });
  
  it('should update maximize button text when modal is maximized', async () => {
    // 创建最大化状态的模态框
    const maximizedWrapper = mount(DesktopModal, {
      props: {
        modal: {
          ...mockModal,
          isMaximized: true
        },
        app: mockApp,
        gameData: mockGameData
      }
    });
    
    // 检查最大化按钮文本
    expect(maximizedWrapper.find('.control-button.maximize span').text()).toBe('❐');
  });
  
  it('should load correct app component based on app.id', () => {
    // 检查聊天应用是否被加载
    expect(wrapper.text()).toContain('Chat App');
  });
  
  it('should show error message when app component does not exist', () => {
    // 使用不存在的应用ID
    const wrapperWithInvalidApp = mount(DesktopModal, {
      props: {
        modal: mockModal,
        app: {
          ...mockApp,
          id: 'non-existent-app'
        },
        gameData: mockGameData
      }
    });
    
    // 检查错误信息
    expect(wrapperWithInvalidApp.find('.error-container').exists()).toBe(true);
    expect(wrapperWithInvalidApp.find('.error-container h3').text()).toBe('应用组件不存在');
    expect(wrapperWithInvalidApp.find('.error-container p').text()).toContain('无法加载应用: non-existent-app');
  });
  
  it('should apply correct styles based on modal state', () => {
    // 检查非最大化状态的样式
    let style = wrapper.attributes('style');
    expect(style).toContain('left: 100px');
    expect(style).toContain('top: 100px');
    expect(style).toContain('width: 800px');
    expect(style).toContain('height: 600px');
    
    // 检查最大化状态的样式
    const maximizedWrapper = mount(DesktopModal, {
      props: {
        modal: {
          ...mockModal,
          isMaximized: true
        },
        app: mockApp,
        gameData: mockGameData
      }
    });
    
    style = maximizedWrapper.attributes('style');
    expect(style).toContain('left: 0px');
    expect(style).toContain('top: 0px');
    expect(style).toContain('width: 100%');
    expect(style).toContain('height: calc(100% - 48px)');
  });
  
  it('should apply is-maximized class when modal is maximized', () => {
    // 创建最大化状态的模态框
    const maximizedWrapper = mount(DesktopModal, {
      props: {
        modal: {
          ...mockModal,
          isMaximized: true
        },
        app: mockApp,
        gameData: mockGameData
      }
    });
    
    // 检查是否添加了is-maximized类
    expect(maximizedWrapper.classes()).toContain('is-maximized');
  });
  
  it('should apply is-minimized class when modal is minimized', () => {
    // 创建最小化状态的模态框
    const minimizedWrapper = mount(DesktopModal, {
      props: {
        modal: {
          ...mockModal,
          isMinimized: true
        },
        app: mockApp,
        gameData: mockGameData
      }
    });
    
    // 检查是否添加了is-minimized类
    expect(minimizedWrapper.classes()).toContain('is-minimized');
  });
  
  it('should handle game-release app correctly', () => {
    // 使用game-release应用ID
    const gameReleaseWrapper = mount(DesktopModal, {
      props: {
        modal: mockModal,
        app: {
          ...mockApp,
          id: 'game-release',
          name: '游戏发布'
        },
        gameData: mockGameData
      }
    });
    
    // 检查游戏发布应用是否被加载
    expect(gameReleaseWrapper.text()).toContain('Game Release App');
  });
  
  it('should handle startDrag and stopDrag correctly', async () => {
    // 模拟鼠标事件
    const mockEvent = {
      clientX: 150,
      clientY: 150
    } as MouseEvent;
    
    // 监听全局事件
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    // 触发拖拽开始
    await wrapper.find('.modal-header').trigger('mousedown', mockEvent);
    
    // 检查是否添加了事件监听器
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    
    // 模拟鼠标抬起，结束拖拽
    const mouseupEvent = new MouseEvent('mouseup');
    document.dispatchEvent(mouseupEvent);
    
    // 检查是否移除了事件监听器
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    
    // 恢复原始函数
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
  
  it('should not start drag when clicking control buttons', async () => {
    // 模拟鼠标事件
    const mockEvent = {
      clientX: 150,
      clientY: 150
    } as MouseEvent;
    
    // 监听全局事件
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    
    // 点击关闭按钮，不应该触发拖拽
    await wrapper.find('.control-button.close').trigger('mousedown', mockEvent);
    
    // 检查是否没有添加事件监听器
    expect(addEventListenerSpy).not.toHaveBeenCalled();
    
    // 恢复原始函数
    addEventListenerSpy.mockRestore();
  });
  
  it('should emit update:modal event when dragging stops', async () => {
    // 模拟鼠标按下事件，开始拖拽
    const mousedownEvent = {
      clientX: 150,
      clientY: 150
    } as MouseEvent;
    
    await wrapper.find('.modal-header').trigger('mousedown', mousedownEvent);
    
    // 模拟鼠标移动事件，改变位置
    const mousemoveEvent = {
      clientX: 200,
      clientY: 200
    } as MouseEvent;
    
    // 直接调用drag函数，因为它是组件内部函数，无法直接触发
    // 我们可以通过模拟document的mousemove事件来触发它
    document.dispatchEvent(mousemoveEvent);
    
    // 模拟鼠标抬起，结束拖拽
    const mouseupEvent = new MouseEvent('mouseup');
    document.dispatchEvent(mouseupEvent);
    
    // 检查是否发出了update:modal事件
    expect(wrapper.emitted('update:modal')).toBeTruthy();
  });
  
  it('should render correctly when modal is minimized', () => {
    // 创建最小化状态的模态框
    const minimizedWrapper = mount(DesktopModal, {
      props: {
        modal: {
          ...mockModal,
          isMinimized: true
        },
        app: mockApp,
        gameData: mockGameData
      }
    });
    
    // 检查样式是否包含display: none
    const style = minimizedWrapper.attributes('style');
    expect(style).toContain('display: none');
  });
  
  it('should apply correct z-index style', () => {
    // 检查z-index是否正确
    const style = wrapper.attributes('style');
    expect(style).toContain('zIndex: 100');
  });
});
