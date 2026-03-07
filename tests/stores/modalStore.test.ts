import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useModalStore } from '@/stores/modalStore';

describe('modalStore', () => {
  beforeEach(() => {
    // 重置Pinia状态
    const pinia = createPinia();
    setActivePinia(pinia);
  });
  
  describe('状态初始化', () => {
    it('应该初始化空的模态框列表和默认配置', () => {
      const modalStore = useModalStore();
      
      expect(modalStore.modals).toEqual([]);
      expect(modalStore.modalCounter).toBe(0);
      expect(modalStore.config).toEqual({
        defaultSize: { width: 800, height: 600 },
        defaultPosition: { x: 100, y: 100 }
      });
    });
  });
  
  describe('getters', () => {
    beforeEach(() => {
      const modalStore = useModalStore();
      // 创建一些测试模态框
      modalStore.createModal('app1', 'Modal 1');
      modalStore.createModal('app1', 'Modal 2');
      modalStore.createModal('app2', 'Modal 3');
    });
    
    it('getAllModals应该返回所有模态框', () => {
      const modalStore = useModalStore();
      
      expect(modalStore.getAllModals).toHaveLength(3);
      expect(modalStore.getAllModals[0].title).toBe('Modal 1');
      expect(modalStore.getAllModals[2].appId).toBe('app2');
    });
    
    it('getModalById应该根据ID返回正确的模态框', () => {
      const modalStore = useModalStore();
      
      const modal1 = modalStore.getModalById('modal-0');
      const modal2 = modalStore.getModalById('modal-1');
      const nonExistentModal = modalStore.getModalById('non-existent');
      
      expect(modal1?.title).toBe('Modal 1');
      expect(modal2?.appId).toBe('app1');
      expect(nonExistentModal).toBeUndefined();
    });
    
    it('getModalsByAppId应该根据应用ID返回正确的模态框列表', () => {
      const modalStore = useModalStore();
      
      const app1Modals = modalStore.getModalsByAppId('app1');
      const app2Modals = modalStore.getModalsByAppId('app2');
      const nonExistentAppModals = modalStore.getModalsByAppId('non-existent');
      
      expect(app1Modals).toHaveLength(2);
      expect(app2Modals).toHaveLength(1);
      expect(nonExistentAppModals).toHaveLength(0);
      
      expect(app1Modals[0].appId).toBe('app1');
      expect(app2Modals[0].appId).toBe('app2');
    });
    
    it('getModalCount应该返回当前模态框数量', () => {
      const modalStore = useModalStore();
      
      expect(modalStore.getModalCount).toBe(3);
      
      // 创建一个新模态框
      modalStore.createModal('app3', 'Modal 4');
      expect(modalStore.getModalCount).toBe(4);
      
      // 删除一个模态框
      modalStore.deleteModal('modal-0');
      expect(modalStore.getModalCount).toBe(3);
    });
  });
  
  describe('actions', () => {
    describe('createModal', () => {
      it('应该使用默认配置创建新模态框', () => {
        const modalStore = useModalStore();
        
        const newModal = modalStore.createModal('app1', 'Test Modal');
        
        expect(newModal).toBeDefined();
        expect(newModal.id).toBe('modal-0');
        expect(newModal.appId).toBe('app1');
        expect(newModal.title).toBe('Test Modal');
        expect(newModal.size).toEqual({ width: 800, height: 600 });
        expect(newModal.position).toEqual({ x: 120, y: 120 }); // 100+20*1
        expect(newModal.isMaximized).toBe(false);
        expect(newModal.isMinimized).toBe(false);
        expect(newModal.activeModule).toBe('main');
        
        expect(modalStore.modals).toHaveLength(1);
        expect(modalStore.modalCounter).toBe(1);
      });
      
      it('应该使用自定义配置创建新模态框', () => {
        const modalStore = useModalStore();
        
        const customSize = { width: 1000, height: 700 };
        const customPosition = { x: 200, y: 150 };
        const customModule = 'settings';
        
        const newModal = modalStore.createModal('app1', 'Custom Modal', {
          size: customSize,
          position: customPosition,
          activeModule: customModule
        });
        
        expect(newModal.size).toEqual(customSize);
        expect(newModal.position).toEqual(customPosition);
        expect(newModal.activeModule).toBe(customModule);
      });
      
      it('应该为每个新模态框生成唯一ID和偏移位置', () => {
        const modalStore = useModalStore();
        
        const modal1 = modalStore.createModal('app1', 'Modal 1');
        const modal2 = modalStore.createModal('app1', 'Modal 2');
        const modal3 = modalStore.createModal('app1', 'Modal 3');
        
        expect(modal1.id).toBe('modal-0');
        expect(modal2.id).toBe('modal-1');
        expect(modal3.id).toBe('modal-2');
        
        expect(modal1.position.x).toBe(120); // 100+20*1
        expect(modal2.position.x).toBe(140); // 100+20*2
        expect(modal3.position.x).toBe(160); // 100+20*3
        
        expect(modal1.position.y).toBe(120);
        expect(modal2.position.y).toBe(140);
        expect(modal3.position.y).toBe(160);
      });
    });
    
    describe('updateModal', () => {
      it('应该更新现有模态框的属性', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Original Title');
        
        modalStore.updateModal({
          id: 'modal-0',
          title: 'Updated Title',
          size: { width: 900, height: 600 },
          isMaximized: true
        });
        
        const updatedModal = modalStore.getModalById('modal-0');
        expect(updatedModal?.title).toBe('Updated Title');
        expect(updatedModal?.size).toEqual({ width: 900, height: 600 });
        expect(updatedModal?.isMaximized).toBe(true);
        expect(updatedModal?.isMinimized).toBe(false); // 未更改的属性保持不变
      });
      
      it('更新不存在的模态框应该没有效果', () => {
        const modalStore = useModalStore();
        const initialModals = [...modalStore.modals];
        
        modalStore.updateModal({
          id: 'non-existent',
          title: 'Should Not Exist'
        });
        
        expect(modalStore.modals).toEqual(initialModals); // 模态框列表应保持不变
      });
      
      it('应该只更新指定的属性', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal');
        
        const originalModal = { ...modalStore.getModalById('modal-0')! };
        
        modalStore.updateModal({
          id: 'modal-0',
          isMinimized: true
        });
        
        const updatedModal = modalStore.getModalById('modal-0');
        expect(updatedModal?.isMinimized).toBe(true);
        expect(updatedModal?.title).toBe(originalModal.title); // 未指定的属性保持不变
        expect(updatedModal?.size).toEqual(originalModal.size);
      });
    });
    
    describe('deleteModal', () => {
      it('应该删除指定的模态框', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal 1');
        modalStore.createModal('app1', 'Modal 2');
        
        expect(modalStore.modals).toHaveLength(2);
        
        modalStore.deleteModal('modal-0');
        
        expect(modalStore.modals).toHaveLength(1);
        expect(modalStore.modals[0].id).toBe('modal-1');
        expect(modalStore.getModalById('modal-0')).toBeUndefined();
      });
      
      it('删除不存在的模态框应该没有效果', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal 1');
        const initialModals = [...modalStore.modals];
        
        modalStore.deleteModal('non-existent');
        
        expect(modalStore.modals).toEqual(initialModals);
      });
    });
    
    describe('closeAllModals', () => {
      it('应该关闭所有模态框', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal 1');
        modalStore.createModal('app1', 'Modal 2');
        modalStore.createModal('app2', 'Modal 3');
        
        expect(modalStore.modals).toHaveLength(3);
        
        modalStore.closeAllModals();
        
        expect(modalStore.modals).toEqual([]);
        expect(modalStore.modalCounter).toBe(3); // 计数器应保持不变
      });
    });
    
    describe('closeModalsByAppId', () => {
      it('应该关闭指定应用的所有模态框', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal 1');
        modalStore.createModal('app1', 'Modal 2');
        modalStore.createModal('app2', 'Modal 3');
        
        expect(modalStore.modals).toHaveLength(3);
        
        modalStore.closeModalsByAppId('app1');
        
        expect(modalStore.modals).toHaveLength(1);
        expect(modalStore.modals[0].appId).toBe('app2');
        expect(modalStore.modals[0].id).toBe('modal-2');
      });
      
      it('关闭不存在的应用模态框应该没有效果', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal 1');
        const initialModals = [...modalStore.modals];
        
        modalStore.closeModalsByAppId('non-existent');
        
        expect(modalStore.modals).toEqual(initialModals);
      });
    });
    
    describe('maximizeModal和restoreModal', () => {
      it('应该最大化和恢复模态框', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal');
        
        // 最大化模态框
        modalStore.maximizeModal('modal-0');
        let modal = modalStore.getModalById('modal-0');
        expect(modal?.isMaximized).toBe(true);
        
        // 恢复模态框
        modalStore.restoreModal('modal-0');
        modal = modalStore.getModalById('modal-0');
        expect(modal?.isMaximized).toBe(false);
      });
      
      it('对不存在的模态框执行最大化操作应该没有效果', () => {
        const modalStore = useModalStore();
        
        modalStore.maximizeModal('non-existent');
        // 不应该抛出错误，也不应该有任何效果
      });
    });
    
    describe('minimizeModal和restoreMinimizedModal', () => {
      it('应该最小化和恢复最小化模态框', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal');
        
        // 最小化模态框
        modalStore.minimizeModal('modal-0');
        let modal = modalStore.getModalById('modal-0');
        expect(modal?.isMinimized).toBe(true);
        
        // 恢复最小化模态框
        modalStore.restoreMinimizedModal('modal-0');
        modal = modalStore.getModalById('modal-0');
        expect(modal?.isMinimized).toBe(false);
      });
      
      it('对不存在的模态框执行最小化操作应该没有效果', () => {
        const modalStore = useModalStore();
        
        modalStore.minimizeModal('non-existent');
        // 不应该抛出错误，也不应该有任何效果
      });
    });
    
    describe('updateModalTitle', () => {
      it('应该更新模态框标题', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Original Title');
        
        modalStore.updateModalTitle('modal-0', 'New Title');
        
        expect(modalStore.getModalById('modal-0')?.title).toBe('New Title');
      });
    });
    
    describe('updateModalPosition', () => {
      it('应该更新模态框位置', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal');
        
        const newPosition = { x: 300, y: 250 };
        modalStore.updateModalPosition('modal-0', newPosition);
        
        expect(modalStore.getModalById('modal-0')?.position).toEqual(newPosition);
      });
    });
    
    describe('updateModalSize', () => {
      it('应该更新模态框大小', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal');
        
        const newSize = { width: 1200, height: 800 };
        modalStore.updateModalSize('modal-0', newSize);
        
        expect(modalStore.getModalById('modal-0')?.size).toEqual(newSize);
      });
    });
    
    describe('updateModalActiveModule', () => {
      it('应该更新模态框活动模块', () => {
        const modalStore = useModalStore();
        modalStore.createModal('app1', 'Modal');
        
        const newModule = 'advanced-settings';
        modalStore.updateModalActiveModule('modal-0', newModule);
        
        expect(modalStore.getModalById('modal-0')?.activeModule).toBe(newModule);
      });
    });
  });
  
  describe('模态框状态转换', () => {
    it('应该正确处理模态框状态转换', () => {
      const modalStore = useModalStore();
      modalStore.createModal('app1', 'State Test Modal');
      
      const modal = modalStore.getModalById('modal-0')!;
      
      // 初始状态
      expect(modal.isMaximized).toBe(false);
      expect(modal.isMinimized).toBe(false);
      
      // 最小化
      modalStore.minimizeModal('modal-0');
      expect(modalStore.getModalById('modal-0')?.isMinimized).toBe(true);
      
      // 从最小化恢复
      modalStore.restoreMinimizedModal('modal-0');
      expect(modalStore.getModalById('modal-0')?.isMinimized).toBe(false);
      
      // 最大化
      modalStore.maximizeModal('modal-0');
      expect(modalStore.getModalById('modal-0')?.isMaximized).toBe(true);
      
      // 从最大化恢复
      modalStore.restoreModal('modal-0');
      expect(modalStore.getModalById('modal-0')?.isMaximized).toBe(false);
      
      // 同时设置最大化和最小化（应允许，但实际应用中可能有业务逻辑限制）
      modalStore.updateModal({
        id: 'modal-0',
        isMaximized: true,
        isMinimized: true
      });
      const updatedModal = modalStore.getModalById('modal-0');
      expect(updatedModal?.isMaximized).toBe(true);
      expect(updatedModal?.isMinimized).toBe(true);
    });
  });
});
