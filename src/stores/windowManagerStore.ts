import { defineStore } from 'pinia';

export interface WindowInfo {
  id: string;
  title: string;
  component: string;
  props?: Record<string, any>;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  isActive: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  isResizable: boolean;
  isDraggable: boolean;
}

export interface DownloadProgress {
  appId: string;
  progress: number;
}

export interface WindowManagerState {
  windows: WindowInfo[];
  activeWindowId: string | null;
  nextZIndex: number;
  nextWindowId: number;
  maximizedWindowId: string | null;
  minimizedWindows: string[];
  downloadProgress: DownloadProgress[];
}

export const useWindowManagerStore = defineStore('windowManager', {
  state: (): WindowManagerState => ({
    windows: [],
    activeWindowId: null,
    nextZIndex: 1,
    nextWindowId: 1,
    maximizedWindowId: null,
    minimizedWindows: [],
    downloadProgress: [],
  }),

  getters: {
    /**
     * 获取所有窗口列表，按zIndex排序
     */
    sortedWindows(): WindowInfo[] {
      return [...this.windows].sort((a, b) => a.zIndex - b.zIndex);
    },

    /**
     * 获取当前活动窗口
     */
    activeWindow(): WindowInfo | null {
      if (!this.activeWindowId) return null;
      return (
        this.windows.find((window) => window.id === this.activeWindowId) || null
      );
    },

    /**
     * 获取最大化窗口
     */
    maximizedWindow(): WindowInfo | null {
      if (!this.maximizedWindowId) return null;
      return (
        this.windows.find((window) => window.id === this.maximizedWindowId) ||
        null
      );
    },

    /**
     * 获取最小化窗口列表
     */
    sortedMinimizedWindows(): WindowInfo[] {
      return this.windows
        .filter((window) => this.minimizedWindows.includes(window.id))
        .sort((a, b) => a.zIndex - b.zIndex);
    },

    /**
     * 获取普通窗口列表（非最小化、非最大化）
     */
    normalWindows(): WindowInfo[] {
      return this.windows.filter(
        (window) =>
          !this.minimizedWindows.includes(window.id) &&
          window.id !== this.maximizedWindowId,
      );
    },
  },

  actions: {
    /**
     * 创建新窗口
     */
    createWindow(
      options: Omit<
        WindowInfo,
        'id' | 'zIndex' | 'isActive' | 'isMaximized' | 'isMinimized'
      >,
    ): string {
      const newWindowId = `window_${this.nextWindowId++}`;
      const newWindow: WindowInfo = {
        ...options,
        id: newWindowId,
        zIndex: this.nextZIndex++,
        isActive: true,
        isMaximized: false,
        isMinimized: false,
      };

      // 将其他窗口设置为非活动状态
      this.windows.forEach((window) => {
        window.isActive = false;
      });

      this.windows.push(newWindow);
      this.activeWindowId = newWindowId;

      return newWindowId;
    },

    /**
     * 激活窗口
     */
    activateWindow(windowId: string) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window) return;

      // 将其他窗口设置为非活动状态
      this.windows.forEach((w) => {
        w.isActive = false;
      });

      // 更新当前窗口状态
      window.isActive = true;
      window.zIndex = this.nextZIndex++;
      this.activeWindowId = windowId;

      // 如果窗口是最小化的，恢复它
      const minimizedIndex = this.minimizedWindows.indexOf(windowId);
      if (minimizedIndex !== -1) {
        this.minimizedWindows.splice(minimizedIndex, 1);
        window.isMinimized = false;
      }
    },

    /**
     * 关闭窗口
     */
    closeWindow(windowId: string) {
      const windowIndex = this.windows.findIndex((w) => w.id === windowId);
      if (windowIndex === -1) return;

      // 移除窗口
      this.windows.splice(windowIndex, 1);

      // 更新最小化窗口列表
      const minimizedIndex = this.minimizedWindows.indexOf(windowId);
      if (minimizedIndex !== -1) {
        this.minimizedWindows.splice(minimizedIndex, 1);
      }

      // 如果关闭的是活动窗口，激活下一个窗口
      if (this.activeWindowId === windowId) {
        this.activeWindowId = null;
        const sorted = this.sortedWindows;
        if (sorted.length > 0) {
          const nextActiveWindow = sorted[sorted.length - 1];
          this.activateWindow(nextActiveWindow.id);
        }
      }

      // 如果关闭的是最大化窗口，清除最大化状态
      if (this.maximizedWindowId === windowId) {
        this.maximizedWindowId = null;
      }
    },

    /**
     * 最大化窗口
     */
    maximizeWindow(windowId: string) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window) return;

      window.isMaximized = true;
      this.maximizedWindowId = windowId;
      this.activateWindow(windowId);
    },

    /**
     * 恢复窗口（从最大化状态）
     */
    restoreWindow(windowId: string) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window) return;

      window.isMaximized = false;
      if (this.maximizedWindowId === windowId) {
        this.maximizedWindowId = null;
      }
      this.activateWindow(windowId);
    },

    /**
     * 最小化窗口
     */
    minimizeWindow(windowId: string) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window) return;

      window.isMinimized = true;
      if (!this.minimizedWindows.includes(windowId)) {
        this.minimizedWindows.push(windowId);
      }

      // 如果最小化的是活动窗口，激活下一个窗口
      if (this.activeWindowId === windowId) {
        this.activeWindowId = null;
        const sorted = this.sortedWindows;
        const nextActiveWindow = sorted.find(
          (w) => w.id !== windowId && !this.minimizedWindows.includes(w.id),
        );
        if (nextActiveWindow) {
          this.activateWindow(nextActiveWindow.id);
        }
      }
    },

    /**
     * 恢复窗口（从最小化状态）
     */
    restoreMinimizedWindow(windowId: string) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window) return;

      window.isMinimized = false;
      const minimizedIndex = this.minimizedWindows.indexOf(windowId);
      if (minimizedIndex !== -1) {
        this.minimizedWindows.splice(minimizedIndex, 1);
      }

      this.activateWindow(windowId);
    },

    /**
     * 调整窗口大小
     */
    resizeWindow(windowId: string, width: number, height: number) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window?.isResizable) return;

      window.width = Math.max(200, width);
      window.height = Math.max(100, height);
      this.activateWindow(windowId);
    },

    /**
     * 移动窗口
     */
    moveWindow(windowId: string, x: number, y: number) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window?.isDraggable) return;

      window.x = x;
      window.y = y;
      this.activateWindow(windowId);
    },

    /**
     * 更新窗口属性
     */
    updateWindow(windowId: string, updates: Partial<WindowInfo>) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window) return;

      Object.assign(window, updates);
      this.activateWindow(windowId);
    },

    /**
     * 关闭所有窗口
     */
    closeAllWindows() {
      this.windows = [];
      this.activeWindowId = null;
      this.maximizedWindowId = null;
      this.minimizedWindows = [];
    },

    /**
     * 关闭所有非活动窗口
     */
    closeAllInactiveWindows() {
      if (!this.activeWindowId) {
        this.closeAllWindows();
        return;
      }

      this.windows = this.windows.filter((w) => w.id === this.activeWindowId);
      this.maximizedWindowId =
        this.maximizedWindowId === this.activeWindowId
          ? this.activeWindowId
          : null;
      this.minimizedWindows = [];
    },

    /**
     * 切换窗口最大化状态
     */
    toggleMaximize(windowId: string) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window) return;

      if (window.isMaximized) {
        this.restoreWindow(windowId);
      } else {
        this.maximizeWindow(windowId);
      }
    },

    /**
     * 切换窗口最小化状态
     */
    toggleMinimize(windowId: string) {
      const window = this.windows.find((w) => w.id === windowId);
      if (!window) return;

      if (window.isMinimized) {
        this.restoreMinimizedWindow(windowId);
      } else {
        this.minimizeWindow(windowId);
      }
    },

    /**
     * 开始下载应用
     */
    startDownload(appId: string) {
      // 检查是否已经在下载
      const existing = this.downloadProgress.find((dp) => dp.appId === appId);
      if (!existing) {
        this.downloadProgress.push({ appId, progress: 0 });
      }
    },

    /**
     * 检查应用是否正在下载
     */
    isDownloading(appId: string): boolean {
      return this.downloadProgress.some((dp) => dp.appId === appId);
    },

    /**
     * 获取应用的下载进度
     */
    getDownloadProgress(appId: string): number {
      const download = this.downloadProgress.find((dp) => dp.appId === appId);
      return download ? download.progress : 0;
    },

    /**
     * 检查应用是否下载完成
     */
    isDownloadCompleted(appId: string): boolean {
      const download = this.downloadProgress.find((dp) => dp.appId === appId);
      return !download || download.progress >= 100;
    },

    /**
     * 更新应用的下载进度
     */
    updateDownloadProgress(appId: string, progress: number) {
      const download = this.downloadProgress.find((dp) => dp.appId === appId);
      if (download) {
        download.progress = Math.min(100, Math.max(0, progress));
      }
    },

    /**
     * 取消应用下载
     */
    cancelDownload(appId: string) {
      const index = this.downloadProgress.findIndex((dp) => dp.appId === appId);
      if (index !== -1) {
        this.downloadProgress.splice(index, 1);
      }
    },

    /**
     * 移除已完成的下载
     */
    removeCompletedDownload(appId: string) {
      const index = this.downloadProgress.findIndex((dp) => dp.appId === appId);
      if (index !== -1) {
        this.downloadProgress.splice(index, 1);
      }
    },
  },
});
