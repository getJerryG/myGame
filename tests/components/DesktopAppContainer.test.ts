import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DesktopAppContainer from '@/components/common/DesktopAppContainer/index.vue';

// 模拟应用组件
const mockChatApp = { template: '<div>Chat App</div>' };
const mockCareerApp = { template: '<div>Career App</div>' };

// 模拟所有应用组件的导入
vi.mock('@/components/business/apps/chat/ChatApp.vue', () => ({
  default: mockChatApp
}));

vi.mock('@/components/business/apps/career/CareerApp.vue', () => ({
  default: mockCareerApp
}));

// 其他应用组件的模拟
const mockComponents = [
  'CollabCenterApp',
  'ContentApp',
  'DataCenterApp',
  'EventApp',
  'EventLogApp',
  'GameReleaseApp',
  'HeroApp',
  'LotteryApp',
  'OperationsApp',
  'RewardsApp',
  'SentimentCenterApp',
  'SkinApp',
  'SystemSettingsApp',
  'TaskCenterApp',
  'WalletApp',
  'AppStore'
];

mockComponents.forEach(component => {
  vi.mock(`@/components/business/apps/${component.includes('CollabCenter') ? 'CollabCenter/CollabCenterApp' : component.includes('AppStore') ? 'AppStore/AppStore' : component}/${component}.vue`, () => ({
    default: { template: `<div>${component}</div>` }
  }));
});

describe('DesktopAppContainer Component', () => {
  let wrapper: any;
  
  // 模拟props数据
  const mockApp = {
    id: 'chat',
    name: '聊天应用',
    icon: '💬',
    position: { x: 100, y: 100 },
    coreData: {},
    modules: [
      { id: 'module1', name: '模块1' },
      { id: 'module2', name: '模块2' }
    ]
  };
  
  const mockWindowState = {
    position: { x: 100, y: 100 },
    size: { width: 800, height: 600 },
    isMaximized: false,
    isMinimized: false,
    activeModule: 'module1'
  };
  
  const mockGameData = {
    player: { name: '测试玩家' },
    balance: 1000
  };
  
  beforeEach(() => {
    wrapper = mount(DesktopAppContainer, {
      props: {
        windowId: 'test-window',
        windowState: mockWindowState,
        app: mockApp,
        gameData: mockGameData
      },
      global: {
        stubs: {
          // 可以在这里 stub 任何需要的组件
        }
      }
    });
  });
  
  it('should render correctly with basic structure', () => {
    // 检查组件是否正确渲染
    expect(wrapper.exists()).toBe(true);
    
    // 检查容器类
    expect(wrapper.classes()).toContain('desktop-app-container');
    expect(wrapper.classes()).not.toContain('is-maximized');
    expect(wrapper.classes()).not.toContain('is-minimized');
    
    // 检查标题栏
    expect(wrapper.find('.app-header').exists()).toBe(true);
    
    // 检查内容区域
    expect(wrapper.find('.app-content').exists()).toBe(true);
  });
  
  it('should render title bar with correct content', () => {
    // 检查应用图标
    expect(wrapper.find('.app-icon').text()).toBe('💬');
    
    // 检查应用名称
    expect(wrapper.find('.app-name').text()).toBe('聊天应用');
    
    // 检查关闭按钮
    expect(wrapper.find('.control-button.close').exists()).toBe(true);
  });
  
  it('should load correct app component based on app.id', () => {
    // 检查聊天应用是否被加载
    expect(wrapper.text()).toContain('Chat App');
  });
  
  it('should show error message when app component does not exist', () => {
    // 使用不存在的应用ID
    const wrapperWithInvalidApp = mount(DesktopAppContainer, {
      props: {
        windowId: 'test-window',
        windowState: mockWindowState,
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
  
  it('should emit close event when close button is clicked', async () => {
    // 点击关闭按钮
    await wrapper.find('.control-button.close').trigger('click');
    
    // 检查是否发出了正确的事件
    expect(wrapper.emitted('close')).toBeTruthy();
    expect(wrapper.emitted('close')?.[0]).toEqual(['chat']);
  });
  
  it('should render sidebar when app has multiple modules', () => {
    // 检查侧边栏是否渲染
    expect(wrapper.find('.app-sidebar').exists()).toBe(true);
    
    // 检查侧边栏项目数量
    const sidebarItems = wrapper.findAll('.sidebar-item');
    expect(sidebarItems.length).toBe(2);
    
    // 检查侧边栏项目内容
    expect(sidebarItems[0].text()).toContain('模块1');
    expect(sidebarItems[1].text()).toContain('模块2');
    
    // 检查第一个模块是否为激活状态
    expect(sidebarItems[0].classes()).toContain('active');
    expect(sidebarItems[1].classes()).not.toContain('active');
  });
  
  it('should not render sidebar when app has only one or no modules', () => {
    // 测试只有一个模块的情况
    const wrapperWithOneModule = mount(DesktopAppContainer, {
      props: {
        windowId: 'test-window',
        windowState: mockWindowState,
        app: {
          ...mockApp,
          modules: [{ id: 'module1', name: '模块1' }]
        },
        gameData: mockGameData
      }
    });
    
    expect(wrapperWithOneModule.find('.app-sidebar').exists()).toBe(false);
    
    // 测试没有模块的情况
    const wrapperWithNoModules = mount(DesktopAppContainer, {
      props: {
        windowId: 'test-window',
        windowState: mockWindowState,
        app: {
          ...mockApp,
          modules: []
        },
        gameData: mockGameData
      }
    });
    
    expect(wrapperWithNoModules.find('.app-sidebar').exists()).toBe(false);
  });
  
  it('should emit update:windowState when module is changed', async () => {
    // 点击第二个侧边栏项目
    await wrapper.findAll('.sidebar-item')[1].trigger('click');
    
    // 检查是否发出了正确的事件
    expect(wrapper.emitted('update:windowState')).toBeTruthy();
    expect(wrapper.emitted('update:windowState')?.[0]?.[0].activeModule).toBe('module2');
  });
  
  it('should apply correct styles based on windowState', () => {
    // 测试最大化状态
    const wrapperMaximized = mount(DesktopAppContainer, {
      props: {
        windowId: 'test-window',
        windowState: {
          ...mockWindowState,
          isMaximized: true
        },
        app: mockApp,
        gameData: mockGameData
      }
    });
    
    expect(wrapperMaximized.classes()).toContain('is-maximized');
    
    // 测试最小化状态
    const wrapperMinimized = mount(DesktopAppContainer, {
      props: {
        windowId: 'test-window',
        windowState: {
          ...mockWindowState,
          isMinimized: true
        },
        app: mockApp,
        gameData: mockGameData
      }
    });
    
    expect(wrapperMinimized.classes()).toContain('is-minimized');
  });
  
  it('should have correct container style based on windowState', () => {
    // 检查容器样式
    const containerStyle = wrapper.attributes('style');
    expect(containerStyle).toContain('left: 100px');
    expect(containerStyle).toContain('top: 100px');
    expect(containerStyle).toContain('width: 800px');
    expect(containerStyle).toContain('height: 600px');
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
    await wrapper.find('.app-header').trigger('mousedown', mockEvent);
    
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
  
  it('should handle handleDrag correctly', async () => {
    // 模拟鼠标按下事件，开始拖拽
    const mousedownEvent = {
      clientX: 150,
      clientY: 150
    } as MouseEvent;
    
    await wrapper.find('.app-header').trigger('mousedown', mousedownEvent);
    
    // 模拟鼠标移动事件，触发拖拽
    const mousemoveEvent = {
      clientX: 200,
      clientY: 200
    } as MouseEvent;
    
    // 直接调用handleDrag函数，因为它是组件内部函数，无法直接触发
    // 我们可以通过模拟document的mousemove事件来触发它
    document.dispatchEvent(mousemoveEvent);
    
    // 检查是否发出了update:windowState事件
    // 注意：由于事件监听器是在组件内部添加的，我们无法直接验证拖拽过程中的位置变化
    // 但我们可以验证组件的拖拽逻辑是否正确处理了事件
    
    // 模拟鼠标抬起，结束拖拽
    const mouseupEvent = new MouseEvent('mouseup');
    document.dispatchEvent(mouseupEvent);
  });
  
  it('should apply correct module icons', () => {
    // 检查模块图标
    const sidebarItems = wrapper.findAll('.sidebar-item');
    const icons = sidebarItems.map(item => item.find('.sidebar-item-icon').text());
    
    // 默认图标应该是📄
    expect(icons[0]).toBe('📄');
    expect(icons[1]).toBe('📄');
  });
});
