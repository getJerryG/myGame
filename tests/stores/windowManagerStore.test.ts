import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useWindowManagerStore } from '@/stores/windowManagerStore';

describe('WindowManagerStore', () => {
  beforeEach(() => {
    // 创建一个新的 Pinia 实例用于测试
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('状态初始化', () => {
    it('应该使用正确的默认值初始化', () => {
      const windowManagerStore = useWindowManagerStore();
      
      expect(windowManagerStore.windows).toEqual([]);
      expect(windowManagerStore.activeWindowId).toBeNull();
      expect(windowManagerStore.nextZIndex).toBe(1);
      expect(windowManagerStore.nextWindowId).toBe(1);
      expect(windowManagerStore.maximizedWindowId).toBeNull();
      expect(windowManagerStore.minimizedWindows).toEqual([]);
    });
  });

  describe('窗口管理', () => {
    it('createWindow 应该创建一个新窗口', () => {
      const windowManagerStore = useWindowManagerStore();
      const initialWindowCount = windowManagerStore.windows.length;
      
      const windowOptions = {
        title: '测试窗口',
        component: 'TestComponent',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      };
      
      const windowId = windowManagerStore.createWindow(windowOptions);
      
      // 检查窗口是否创建成功
      expect(windowManagerStore.windows.length).toBe(initialWindowCount + 1);
      const newWindow = windowManagerStore.windows.find(w => w.id === windowId);
      expect(newWindow).toBeDefined();
      expect(newWindow?.title).toBe(windowOptions.title);
      expect(newWindow?.component).toBe(windowOptions.component);
      expect(newWindow?.width).toBe(windowOptions.width);
      expect(newWindow?.height).toBe(windowOptions.height);
      expect(newWindow?.x).toBe(windowOptions.x);
      expect(newWindow?.y).toBe(windowOptions.y);
      expect(newWindow?.isActive).toBe(true);
      expect(newWindow?.isMaximized).toBe(false);
      expect(newWindow?.isMinimized).toBe(false);
      expect(newWindow?.isResizable).toBe(windowOptions.isResizable);
      expect(newWindow?.isDraggable).toBe(windowOptions.isDraggable);
      
      // 检查活动窗口是否正确设置
      expect(windowManagerStore.activeWindowId).toBe(windowId);
    });

    it('activateWindow 应该激活指定窗口', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建两个窗口
      const windowId1 = windowManagerStore.createWindow({
        title: '窗口1',
        component: 'TestComponent1',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      const windowId2 = windowManagerStore.createWindow({
        title: '窗口2',
        component: 'TestComponent2',
        width: 800,
        height: 600,
        x: 150,
        y: 150,
        isResizable: true,
        isDraggable: true
      });
      
      // 当前活动窗口应该是窗口2
      expect(windowManagerStore.activeWindowId).toBe(windowId2);
      
      // 激活窗口1
      windowManagerStore.activateWindow(windowId1);
      
      // 检查活动窗口是否切换到窗口1
      expect(windowManagerStore.activeWindowId).toBe(windowId1);
      const window1 = windowManagerStore.windows.find(w => w.id === windowId1);
      const window2 = windowManagerStore.windows.find(w => w.id === windowId2);
      expect(window1?.isActive).toBe(true);
      expect(window2?.isActive).toBe(false);
      
      // 检查zIndex是否更新
      expect(window1?.zIndex).toBeGreaterThan(window2?.zIndex as number);
    });

    it('closeWindow 应该关闭指定窗口', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建两个窗口
      const windowId1 = windowManagerStore.createWindow({
        title: '窗口1',
        component: 'TestComponent1',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      const windowId2 = windowManagerStore.createWindow({
        title: '窗口2',
        component: 'TestComponent2',
        width: 800,
        height: 600,
        x: 150,
        y: 150,
        isResizable: true,
        isDraggable: true
      });
      
      const initialWindowCount = windowManagerStore.windows.length;
      
      // 关闭窗口2
      windowManagerStore.closeWindow(windowId2);
      
      // 检查窗口是否关闭
      expect(windowManagerStore.windows.length).toBe(initialWindowCount - 1);
      const closedWindow = windowManagerStore.windows.find(w => w.id === windowId2);
      expect(closedWindow).toBeUndefined();
      
      // 检查活动窗口是否切换到窗口1
      expect(windowManagerStore.activeWindowId).toBe(windowId1);
    });

    it('closeWindow 应该处理关闭最后一个窗口的情况', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建一个窗口
      const windowId = windowManagerStore.createWindow({
        title: '唯一窗口',
        component: 'TestComponent',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      // 关闭唯一窗口
      windowManagerStore.closeWindow(windowId);
      
      // 检查窗口列表是否为空
      expect(windowManagerStore.windows.length).toBe(0);
      expect(windowManagerStore.activeWindowId).toBeNull();
    });

    it('maximizeWindow 和 restoreWindow 应该处理窗口最大化和恢复', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建一个窗口
      const windowId = windowManagerStore.createWindow({
        title: '测试窗口',
        component: 'TestComponent',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      // 最大化窗口
      windowManagerStore.maximizeWindow(windowId);
      
      // 检查窗口是否最大化
      const maximizedWindow = windowManagerStore.windows.find(w => w.id === windowId);
      expect(maximizedWindow?.isMaximized).toBe(true);
      expect(windowManagerStore.maximizedWindowId).toBe(windowId);
      
      // 恢复窗口
      windowManagerStore.restoreWindow(windowId);
      
      // 检查窗口是否恢复正常
      const restoredWindow = windowManagerStore.windows.find(w => w.id === windowId);
      expect(restoredWindow?.isMaximized).toBe(false);
      expect(windowManagerStore.maximizedWindowId).toBeNull();
    });

    it('minimizeWindow 和 restoreMinimizedWindow 应该处理窗口最小化和恢复', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建两个窗口
      const windowId1 = windowManagerStore.createWindow({
        title: '窗口1',
        component: 'TestComponent1',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      const windowId2 = windowManagerStore.createWindow({
        title: '窗口2',
        component: 'TestComponent2',
        width: 800,
        height: 600,
        x: 150,
        y: 150,
        isResizable: true,
        isDraggable: true
      });
      
      // 最小化窗口2
      windowManagerStore.minimizeWindow(windowId2);
      
      // 检查窗口是否最小化
      const minimizedWindow = windowManagerStore.windows.find(w => w.id === windowId2);
      expect(minimizedWindow?.isMinimized).toBe(true);
      expect(windowManagerStore.minimizedWindows).toContain(windowId2);
      
      // 检查活动窗口是否切换到窗口1
      expect(windowManagerStore.activeWindowId).toBe(windowId1);
      
      // 恢复最小化窗口
      windowManagerStore.restoreMinimizedWindow(windowId2);
      
      // 检查窗口是否恢复
      const restoredWindow = windowManagerStore.windows.find(w => w.id === windowId2);
      expect(restoredWindow?.isMinimized).toBe(false);
      expect(windowManagerStore.minimizedWindows).not.toContain(windowId2);
      
      // 检查活动窗口是否切换到恢复的窗口
      expect(windowManagerStore.activeWindowId).toBe(windowId2);
    });

    it('resizeWindow 应该调整窗口大小', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建一个窗口
      const windowId = windowManagerStore.createWindow({
        title: '测试窗口',
        component: 'TestComponent',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      // 调整窗口大小
      const newWidth = 1024;
      const newHeight = 768;
      windowManagerStore.resizeWindow(windowId, newWidth, newHeight);
      
      // 检查窗口大小是否调整
      const resizedWindow = windowManagerStore.windows.find(w => w.id === windowId);
      expect(resizedWindow?.width).toBe(newWidth);
      expect(resizedWindow?.height).toBe(newHeight);
      
      // 检查不可调整大小的窗口
      const fixedWindowId = windowManagerStore.createWindow({
        title: '固定窗口',
        component: 'FixedComponent',
        width: 800,
        height: 600,
        x: 200,
        y: 200,
        isResizable: false,
        isDraggable: true
      });
      
      windowManagerStore.resizeWindow(fixedWindowId, 1024, 768);
      const fixedWindow = windowManagerStore.windows.find(w => w.id === fixedWindowId);
      expect(fixedWindow?.width).toBe(800); // 应该保持不变
      expect(fixedWindow?.height).toBe(600); // 应该保持不变
    });

    it('moveWindow 应该移动窗口', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建一个窗口
      const windowId = windowManagerStore.createWindow({
        title: '测试窗口',
        component: 'TestComponent',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      // 移动窗口
      const newX = 200;
      const newY = 150;
      windowManagerStore.moveWindow(windowId, newX, newY);
      
      // 检查窗口位置是否移动
      const movedWindow = windowManagerStore.windows.find(w => w.id === windowId);
      expect(movedWindow?.x).toBe(newX);
      expect(movedWindow?.y).toBe(newY);
      
      // 检查不可拖动的窗口
      const fixedWindowId = windowManagerStore.createWindow({
        title: '固定窗口',
        component: 'FixedComponent',
        width: 800,
        height: 600,
        x: 300,
        y: 200,
        isResizable: true,
        isDraggable: false
      });
      
      windowManagerStore.moveWindow(fixedWindowId, 400, 300);
      const fixedWindow = windowManagerStore.windows.find(w => w.id === fixedWindowId);
      expect(fixedWindow?.x).toBe(300); // 应该保持不变
      expect(fixedWindow?.y).toBe(200); // 应该保持不变
    });

    it('updateWindow 应该更新窗口属性', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建一个窗口
      const windowId = windowManagerStore.createWindow({
        title: '测试窗口',
        component: 'TestComponent',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      // 更新窗口属性
      const updates = {
        title: '更新后的窗口',
        width: 900,
        height: 700,
        isResizable: false
      };
      
      windowManagerStore.updateWindow(windowId, updates);
      
      // 检查窗口属性是否更新
      const updatedWindow = windowManagerStore.windows.find(w => w.id === windowId);
      expect(updatedWindow?.title).toBe(updates.title);
      expect(updatedWindow?.width).toBe(updates.width);
      expect(updatedWindow?.height).toBe(updates.height);
      expect(updatedWindow?.isResizable).toBe(updates.isResizable);
      // 未更新的属性应该保持不变
      expect(updatedWindow?.component).toBe('TestComponent');
      expect(updatedWindow?.isDraggable).toBe(true);
    });

    it('closeAllWindows 应该关闭所有窗口', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建三个窗口
      for (let i = 0; i < 3; i++) {
        windowManagerStore.createWindow({
          title: `窗口${i + 1}`,
          component: `TestComponent${i + 1}`,
          width: 800,
          height: 600,
          x: 100 + i * 50,
          y: 100 + i * 50,
          isResizable: true,
          isDraggable: true
        });
      }
      
      // 关闭所有窗口
      windowManagerStore.closeAllWindows();
      
      // 检查是否所有窗口都已关闭
      expect(windowManagerStore.windows.length).toBe(0);
      expect(windowManagerStore.activeWindowId).toBeNull();
      expect(windowManagerStore.maximizedWindowId).toBeNull();
      expect(windowManagerStore.minimizedWindows).toEqual([]);
    });

    it('closeAllInactiveWindows 应该关闭所有非活动窗口', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建三个窗口
      const windowId1 = windowManagerStore.createWindow({
        title: '窗口1',
        component: 'TestComponent1',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      const windowId2 = windowManagerStore.createWindow({
        title: '窗口2',
        component: 'TestComponent2',
        width: 800,
        height: 600,
        x: 150,
        y: 150,
        isResizable: true,
        isDraggable: true
      });
      
      const windowId3 = windowManagerStore.createWindow({
        title: '窗口3',
        component: 'TestComponent3',
        width: 800,
        height: 600,
        x: 200,
        y: 200,
        isResizable: true,
        isDraggable: true
      });
      
      // 激活窗口2
      windowManagerStore.activateWindow(windowId2);
      
      // 关闭所有非活动窗口
      windowManagerStore.closeAllInactiveWindows();
      
      // 检查是否只有活动窗口2保留
      expect(windowManagerStore.windows.length).toBe(1);
      expect(windowManagerStore.activeWindowId).toBe(windowId2);
      const remainingWindow = windowManagerStore.windows[0];
      expect(remainingWindow?.id).toBe(windowId2);
    });

    it('toggleMaximize 和 toggleMinimize 应该切换窗口状态', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建一个窗口
      const windowId = windowManagerStore.createWindow({
        title: '测试窗口',
        component: 'TestComponent',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      // 切换最大化状态
      windowManagerStore.toggleMaximize(windowId);
      let windowInfo = windowManagerStore.windows.find(w => w.id === windowId);
      expect(windowInfo?.isMaximized).toBe(true);
      
      windowManagerStore.toggleMaximize(windowId);
      windowInfo = windowManagerStore.windows.find(w => w.id === windowId);
      expect(windowInfo?.isMaximized).toBe(false);
      
      // 切换最小化状态
      windowManagerStore.toggleMinimize(windowId);
      windowInfo = windowManagerStore.windows.find(w => w.id === windowId);
      expect(windowInfo?.isMinimized).toBe(true);
      
      windowManagerStore.toggleMinimize(windowId);
      windowInfo = windowManagerStore.windows.find(w => w.id === windowId);
      expect(windowInfo?.isMinimized).toBe(false);
    });
  });

  describe('计算属性', () => {
    it('sortedWindows 应该返回按zIndex排序的窗口列表', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建三个窗口
      for (let i = 0; i < 3; i++) {
        windowManagerStore.createWindow({
          title: `窗口${i + 1}`,
          component: `TestComponent${i + 1}`,
          width: 800,
          height: 600,
          x: 100 + i * 50,
          y: 100 + i * 50,
          isResizable: true,
          isDraggable: true
        });
      }
      
      // 激活第一个窗口，使其zIndex最高
      const windowId1 = windowManagerStore.windows[0].id;
      windowManagerStore.activateWindow(windowId1);
      
      // 检查排序后的窗口列表
      const sortedWindows = windowManagerStore.sortedWindows;
      for (let i = 0; i < sortedWindows.length - 1; i++) {
        expect(sortedWindows[i].zIndex).toBeLessThanOrEqual(sortedWindows[i + 1].zIndex);
      }
      // 第一个窗口应该是zIndex最高的
      expect(sortedWindows[sortedWindows.length - 1].id).toBe(windowId1);
    });

    it('activeWindow 应该返回当前活动窗口', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 没有窗口时应该返回null
      expect(windowManagerStore.activeWindow).toBeNull();
      
      // 创建一个窗口
      const windowId = windowManagerStore.createWindow({
        title: '测试窗口',
        component: 'TestComponent',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      // 应该返回创建的窗口
      const activeWindow = windowManagerStore.activeWindow;
      expect(activeWindow).toBeDefined();
      expect(activeWindow?.id).toBe(windowId);
    });

    it('maximizedWindow 应该返回当前最大化窗口', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 没有最大化窗口时应该返回null
      expect(windowManagerStore.maximizedWindow).toBeNull();
      
      // 创建并最大化一个窗口
      const windowId = windowManagerStore.createWindow({
        title: '测试窗口',
        component: 'TestComponent',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      windowManagerStore.maximizeWindow(windowId);
      
      // 应该返回最大化的窗口
      const maximizedWindow = windowManagerStore.maximizedWindow;
      expect(maximizedWindow).toBeDefined();
      expect(maximizedWindow?.id).toBe(windowId);
    });

    it('sortedMinimizedWindows 应该返回按zIndex排序的最小化窗口列表', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建三个窗口并最小化它们
      const minimizedWindowIds: string[] = [];
      for (let i = 0; i < 3; i++) {
        const windowId = windowManagerStore.createWindow({
          title: `窗口${i + 1}`,
          component: `TestComponent${i + 1}`,
          width: 800,
          height: 600,
          x: 100 + i * 50,
          y: 100 + i * 50,
          isResizable: true,
          isDraggable: true
        });
        windowManagerStore.minimizeWindow(windowId);
        minimizedWindowIds.push(windowId);
      }
      
      // 检查最小化窗口列表
      const sortedMinimizedWindows = windowManagerStore.sortedMinimizedWindows;
      expect(sortedMinimizedWindows.length).toBe(3);
      
      // 激活第一个最小化窗口，使其zIndex最高
      windowManagerStore.restoreMinimizedWindow(minimizedWindowIds[0]);
      windowManagerStore.minimizeWindow(minimizedWindowIds[0]);
      
      // 重新获取排序后的最小化窗口列表
      const updatedSortedMinimizedWindows = windowManagerStore.sortedMinimizedWindows;
      // 第一个窗口应该是zIndex最高的
      expect(updatedSortedMinimizedWindows[updatedSortedMinimizedWindows.length - 1].id).toBe(minimizedWindowIds[0]);
    });

    it('normalWindows 应该返回非最小化、非最大化的窗口列表', () => {
      const windowManagerStore = useWindowManagerStore();
      
      // 创建三个窗口
      const windowId1 = windowManagerStore.createWindow({
        title: '正常窗口',
        component: 'TestComponent1',
        width: 800,
        height: 600,
        x: 100,
        y: 100,
        isResizable: true,
        isDraggable: true
      });
      
      const windowId2 = windowManagerStore.createWindow({
        title: '最大化窗口',
        component: 'TestComponent2',
        width: 800,
        height: 600,
        x: 150,
        y: 150,
        isResizable: true,
        isDraggable: true
      });
      
      const windowId3 = windowManagerStore.createWindow({
        title: '最小化窗口',
        component: 'TestComponent3',
        width: 800,
        height: 600,
        x: 200,
        y: 200,
        isResizable: true,
        isDraggable: true
      });
      
      // 最大化第二个窗口
      windowManagerStore.maximizeWindow(windowId2);
      
      // 最小化第三个窗口
      windowManagerStore.minimizeWindow(windowId3);
      
      // 检查正常窗口列表
      const normalWindows = windowManagerStore.normalWindows;
      expect(normalWindows.length).toBe(1);
      expect(normalWindows[0].id).toBe(windowId1);
    });
  });

  describe('下载管理', () => {
    it('startDownload 应该开始应用下载', () => {
      const windowManagerStore = useWindowManagerStore();
      const appId = 'test-app';
      
      windowManagerStore.startDownload(appId);
      
      // 检查下载是否开始
      expect(windowManagerStore.isDownloading(appId)).toBe(true);
      expect(windowManagerStore.getDownloadProgress(appId)).toBe(0);
    });

    it('isDownloadCompleted 应该正确检查下载状态', () => {
      const windowManagerStore = useWindowManagerStore();
      const appId = 'test-app-2';
      
      // 未开始下载时应该返回true
      expect(windowManagerStore.isDownloadCompleted(appId)).toBe(true);
      
      // 开始下载后应该返回false
      windowManagerStore.startDownload(appId);
      expect(windowManagerStore.isDownloadCompleted(appId)).toBe(false);
      
      // 下载进度100%时应该返回true
      windowManagerStore.updateDownloadProgress(appId, 100);
      expect(windowManagerStore.isDownloadCompleted(appId)).toBe(true);
    });

    it('cancelDownload 应该取消应用下载', () => {
      const windowManagerStore = useWindowManagerStore();
      const appId = 'test-app-3';
      
      // 开始下载
      windowManagerStore.startDownload(appId);
      windowManagerStore.updateDownloadProgress(appId, 50);
      expect(windowManagerStore.isDownloading(appId)).toBe(true);
      
      // 取消下载
      windowManagerStore.cancelDownload(appId);
      expect(windowManagerStore.isDownloading(appId)).toBe(false);
      expect(windowManagerStore.getDownloadProgress(appId)).toBe(0);
    });

    it('updateDownloadProgress 应该更新下载进度', () => {
      const windowManagerStore = useWindowManagerStore();
      const appId = 'test-app-4';
      
      windowManagerStore.startDownload(appId);
      
      // 更新进度
      const progress = 75;
      windowManagerStore.updateDownloadProgress(appId, progress);
      expect(windowManagerStore.getDownloadProgress(appId)).toBe(progress);
      
      // 进度应该限制在0-100之间
      windowManagerStore.updateDownloadProgress(appId, 150);
      expect(windowManagerStore.getDownloadProgress(appId)).toBe(100);
      
      windowManagerStore.updateDownloadProgress(appId, -50);
      expect(windowManagerStore.getDownloadProgress(appId)).toBe(0);
    });
  });
});