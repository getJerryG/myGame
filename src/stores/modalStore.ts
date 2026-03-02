import { defineStore } from 'pinia';

// 定义模态框状态类型
interface ModalState {
  // 模态框配置
  modals: Array<{
    id: string;
    appId: string;
    title: string;
    size: { width: number; height: number };
    position: { x: number; y: number };
    isMaximized: boolean;
    isMinimized: boolean;
    activeModule: string;
  }>;
  // 模态框计数器
  modalCounter: number;
  // 模态框配置
  config: {
    defaultSize: { width: number; height: number };
    defaultPosition: { x: number; y: number };
  };
}

// 创建并导出模态框store
export const useModalStore = defineStore('modal', {
  state: (): ModalState => ({
    // 模态框列表
    modals: [],
    // 模态框计数器，用于生成唯一ID
    modalCounter: 0,
    // 模态框默认配置
    config: {
      defaultSize: { width: 800, height: 600 },
      defaultPosition: { x: 100, y: 100 },
    },
  }),

  getters: {
    // 获取所有模态框
    getAllModals: (state) => state.modals,

    // 根据ID获取模态框
    getModalById: (state) => (id: string) => {
      return state.modals.find((modal) => modal.id === id);
    },

    // 根据应用ID获取模态框
    getModalsByAppId: (state) => (appId: string) => {
      return state.modals.filter((modal) => modal.appId === appId);
    },

    // 获取模态框数量
    getModalCount: (state) => state.modals.length,
  },

  actions: {
    // 创建新的模态框
    createModal(
      appId: string,
      title: string,
      options?: {
        size?: { width: number; height: number };
        position?: { x: number; y: number };
        activeModule?: string;
      },
    ) {
      // 生成唯一ID
      const id = `modal-${this.modalCounter++}`;

      // 创建模态框对象
      const newModal = {
        id,
        appId,
        title,
        size: options?.size || this.config.defaultSize,
        position: options?.position || {
          x: this.config.defaultPosition.x + this.modalCounter * 20,
          y: this.config.defaultPosition.y + this.modalCounter * 20,
        },
        isMaximized: false,
        isMinimized: false,
        activeModule: options?.activeModule || 'main',
      };

      // 添加到模态框列表
      this.modals.push(newModal);

      return newModal;
    },

    // 更新模态框
    updateModal(updatedModal: {
      id: string;
      title?: string;
      size?: { width: number; height: number };
      position?: { x: number; y: number };
      isMaximized?: boolean;
      isMinimized?: boolean;
      activeModule?: string;
    }) {
      const index = this.modals.findIndex(
        (modal) => modal.id === updatedModal.id,
      );
      if (index !== -1) {
        this.modals[index] = {
          ...this.modals[index],
          ...updatedModal,
        };
      }
    },

    // 删除模态框
    deleteModal(id: string) {
      const index = this.modals.findIndex((modal) => modal.id === id);
      if (index !== -1) {
        this.modals.splice(index, 1);
      }
    },

    // 关闭所有模态框
    closeAllModals() {
      this.modals = [];
    },

    // 关闭指定应用的所有模态框
    closeModalsByAppId(appId: string) {
      this.modals = this.modals.filter((modal) => modal.appId !== appId);
    },

    // 最大化模态框
    maximizeModal(id: string) {
      this.updateModal({ id, isMaximized: true });
    },

    // 恢复模态框
    restoreModal(id: string) {
      this.updateModal({ id, isMaximized: false });
    },

    // 最小化模态框
    minimizeModal(id: string) {
      this.updateModal({ id, isMinimized: true });
    },

    // 恢复最小化模态框
    restoreMinimizedModal(id: string) {
      this.updateModal({ id, isMinimized: false });
    },

    // 更新模态框标题
    updateModalTitle(id: string, title: string) {
      this.updateModal({ id, title });
    },

    // 更新模态框位置
    updateModalPosition(id: string, position: { x: number; y: number }) {
      this.updateModal({ id, position });
    },

    // 更新模态框大小
    updateModalSize(id: string, size: { width: number; height: number }) {
      this.updateModal({ id, size });
    },

    // 更新模态框活动模块
    updateModalActiveModule(id: string, activeModule: string) {
      this.updateModal({ id, activeModule });
    },
  },

  // 持久化存储
  persist: {
    key: 'modal-system',
    storage: localStorage,
  },
});
