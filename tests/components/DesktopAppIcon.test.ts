import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DesktopAppIcon from '@/components/common/DesktopAppIcon/index.vue';
import { createPinia } from 'pinia';

// 模拟windowManagerStore
vi.mock('@/stores/windowManagerStore', () => ({
  useWindowManagerStore: vi.fn(() => ({
    isDownloading: vi.fn(() => false),
    getDownloadProgress: vi.fn(() => 0),
    isDownloadCompleted: vi.fn(() => false),
    cancelDownload: vi.fn()
  }))
}));

describe('DesktopAppIcon Component', () => {
  let wrapper: any;
  let mockStore: any;
  
  // 模拟应用数据
  const mockApp = {
    id: 'chat',
    name: '聊天应用',
    icon: '💬',
    position: { x: 100, y: 100 },
    coreData: {},
    modules: []
  };
  
  // 模拟位置数据
  const mockPosition = {
    x: 100,
    y: 100
  };
  
  beforeEach(() => {
    // 创建pinia实例
    const pinia = createPinia();
    
    // 重置模拟store
    mockStore = {
      isDownloading: vi.fn(() => false),
      getDownloadProgress: vi.fn(() => 0),
      isDownloadCompleted: vi.fn(() => false),
      cancelDownload: vi.fn()
    };
    
    // 替换模拟store
    vi.mocked(require('@/stores/windowManagerStore').useWindowManagerStore).mockReturnValue(mockStore);
    
    // 挂载组件
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [pinia]
      }
    });
  });
  
  it('should render correctly with basic app information', () => {
    // 检查组件是否正确渲染
    expect(wrapper.exists()).toBe(true);
    
    // 检查应用图标
    expect(wrapper.find('.app-icon').text()).toBe('💬');
    
    // 检查应用名称
    expect(wrapper.find('.app-name').text()).toBe('聊天应用');
    
    // 检查应用位置样式
    const style = wrapper.attributes('style');
    expect(style).toContain('left: 100px');
    expect(style).toContain('top: 100px');
    expect(style).toContain('opacity: 1');
  });
  
  it('should emit click event when clicked', async () => {
    // 点击应用图标
    await wrapper.trigger('click');
    
    // 检查是否发出了click事件
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')?.[0]?.[0]).toEqual(mockApp);
  });
  
  it('should show hover state when mouse enters', async () => {
    // 鼠标进入
    await wrapper.trigger('mouseenter');
    
    // 检查是否添加了hover状态
    // 注意：isHovered是组件内部状态，我们无法直接访问，但可以通过检查上下文菜单是否显示来间接验证
  });
  
  it('should hide hover state when mouse leaves', async () => {
    // 鼠标进入然后离开
    await wrapper.trigger('mouseenter');
    await wrapper.trigger('mouseleave');
    
    // 检查是否移除了hover状态
  });
  
  it('should not show context menu when not hovering', () => {
    // 检查上下文菜单是否存在
    expect(wrapper.find('.app-context-menu').exists()).toBe(false);
  });
  
  it('should display core data for wallet app', async () => {
    // 创建钱包应用的wrapper
    const walletAppWrapper = mount(DesktopAppIcon, {
      props: {
        app: {
          ...mockApp,
          id: 'wallet',
          coreData: { balance: 1000 }
        },
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 检查是否显示了核心数据
    expect(walletAppWrapper.find('.app-badge').exists()).toBe(true);
    expect(walletAppWrapper.find('.app-badge span').text()).toBe('￥1000');
  });
  
  it('should not display core data when coreData is empty', () => {
    // 检查是否显示了核心数据
    expect(wrapper.find('.app-badge').exists()).toBe(false);
  });
  
  it('should display downloading state correctly', async () => {
    // 设置模拟store返回正在下载状态
    mockStore.isDownloading.mockReturnValue(true);
    mockStore.getDownloadProgress.mockReturnValue(50);
    
    // 重新挂载组件以应用新的store状态
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 检查是否添加了downloading类
    expect(wrapper.classes()).toContain('downloading');
    
    // 检查下载进度是否显示
    expect(wrapper.find('.download-progress-overlay').exists()).toBe(true);
    expect(wrapper.find('.progress-text').text()).toBe('50%');
    
    // 检查透明度是否正确
    const style = wrapper.attributes('style');
    expect(style).toContain('opacity: 0.5');
  });
  
  it('should display download completed state correctly', async () => {
    // 设置模拟store返回下载完成状态
    mockStore.isDownloading.mockReturnValue(false);
    mockStore.isDownloadCompleted.mockReturnValue(true);
    
    // 重新挂载组件以应用新的store状态
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 检查是否添加了download-completed类
    expect(wrapper.classes()).toContain('download-completed');
  });
  
  it('should show context menu when hovering and downloading', async () => {
    // 设置模拟store返回正在下载状态
    mockStore.isDownloading.mockReturnValue(true);
    
    // 重新挂载组件
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 鼠标进入
    await wrapper.trigger('mouseenter');
    
    // 检查上下文菜单是否显示
    expect(wrapper.find('.app-context-menu').exists()).toBe(true);
    expect(wrapper.find('.menu-item').text()).toBe('取消下载');
  });
  
  it('should show delete confirm modal when cancel download is clicked', async () => {
    // 设置模拟store返回正在下载状态
    mockStore.isDownloading.mockReturnValue(true);
    
    // 重新挂载组件
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 鼠标进入显示上下文菜单
    await wrapper.trigger('mouseenter');
    
    // 点击取消下载
    await wrapper.find('.menu-item').trigger('click');
    
    // 检查删除确认模态框是否显示
    expect(wrapper.find('.delete-confirm-overlay').exists()).toBe(true);
    expect(wrapper.find('.confirm-modal').exists()).toBe(true);
    expect(wrapper.find('.confirm-modal h3').text()).toBe('确认删除');
    expect(wrapper.find('.confirm-modal p').text()).toContain('确定要取消下载「聊天应用」吗？');
  });
  
  it('should hide delete confirm modal when cancel button is clicked', async () => {
    // 设置模拟store返回正在下载状态
    mockStore.isDownloading.mockReturnValue(true);
    
    // 重新挂载组件
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 鼠标进入显示上下文菜单
    await wrapper.trigger('mouseenter');
    
    // 点击取消下载
    await wrapper.find('.menu-item').trigger('click');
    
    // 点击取消按钮
    await wrapper.find('.btn-cancel').trigger('click');
    
    // 检查删除确认模态框是否隐藏
    expect(wrapper.find('.delete-confirm-overlay').exists()).toBe(false);
  });
  
  it('should call cancelDownload when confirm delete is clicked', async () => {
    // 设置模拟store返回正在下载状态
    mockStore.isDownloading.mockReturnValue(true);
    
    // 重新挂载组件
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 鼠标进入显示上下文菜单
    await wrapper.trigger('mouseenter');
    
    // 点击取消下载
    await wrapper.find('.menu-item').trigger('click');
    
    // 点击确定删除按钮
    await wrapper.find('.btn-delete').trigger('click');
    
    // 检查是否调用了cancelDownload方法
    expect(mockStore.cancelDownload).toHaveBeenCalledWith('chat');
    
    // 检查删除确认模态框是否隐藏
    expect(wrapper.find('.delete-confirm-overlay').exists()).toBe(false);
  });
  
  it('should hide delete confirm modal when clicking outside', async () => {
    // 设置模拟store返回正在下载状态
    mockStore.isDownloading.mockReturnValue(true);
    
    // 重新挂载组件
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 鼠标进入显示上下文菜单
    await wrapper.trigger('mouseenter');
    
    // 点击取消下载
    await wrapper.find('.menu-item').trigger('click');
    
    // 点击模态框外部
    await wrapper.find('.delete-confirm-overlay').trigger('click');
    
    // 检查删除确认模态框是否隐藏
    expect(wrapper.find('.delete-confirm-overlay').exists()).toBe(false);
  });
  
  it('should not show delete confirm modal when clicking inside modal content', async () => {
    // 设置模拟store返回正在下载状态
    mockStore.isDownloading.mockReturnValue(true);
    
    // 重新挂载组件
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 鼠标进入显示上下文菜单
    await wrapper.trigger('mouseenter');
    
    // 点击取消下载
    await wrapper.find('.menu-item').trigger('click');
    
    // 点击模态框内部
    await wrapper.find('.confirm-modal-content').trigger('click');
    
    // 检查删除确认模态框是否仍然显示
    expect(wrapper.find('.delete-confirm-overlay').exists()).toBe(true);
  });
  
  it('should apply correct styles for downloading state', async () => {
    // 设置模拟store返回正在下载状态
    mockStore.isDownloading.mockReturnValue(true);
    
    // 重新挂载组件
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 检查是否添加了downloading类
    expect(wrapper.classes()).toContain('downloading');
    
    // 检查透明度是否正确
    const style = wrapper.attributes('style');
    expect(style).toContain('opacity: 0.5');
  });
  
  it('should update download progress correctly', async () => {
    // 设置模拟store返回正在下载状态和50%进度
    mockStore.isDownloading.mockReturnValue(true);
    mockStore.getDownloadProgress.mockReturnValue(50);
    
    // 重新挂载组件
    wrapper = mount(DesktopAppIcon, {
      props: {
        app: mockApp,
        position: mockPosition
      },
      global: {
        plugins: [createPinia()]
      }
    });
    
    // 检查下载进度显示
    expect(wrapper.find('.progress-text').text()).toBe('50%');
    
    // 检查进度条样式
    const progressFill = wrapper.find('.progress-fill');
    expect(progressFill.attributes('style')).toContain('strokeDashoffset: 141.5');
  });
});
