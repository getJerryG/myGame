// 模态框相关类型定义

export interface ModalConfig {
  id: string;
  title: string;
  content: string;
  isVisible: boolean;
  width?: string;
  height?: string;
  canClose?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export interface ModalState {
  modals: ModalConfig[];
}

export type ModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

export interface ModalOptions {
  title: string;
  content: string;
  type?: ModalType;
  width?: string;
  height?: string;
  canClose?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}
