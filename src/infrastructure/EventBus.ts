// 定义事件类型
export type EventType =
  | "timeUpdate"
  | "levelUp"
  | "taskComplete"
  | "gameReleased"
  | "careerPromoted"
  | "simulationStateChange"
  | "businessDataUpdate"
  | "eventTriggered"
  | "userAction"
  | "collaborationRequest"
  | "collaborationResponse";

// 定义事件监听器类型
export type EventListener<T = unknown> = (data: T) => void;

// 定义监听器配置类型
export interface ListenerConfig {
  callback: EventListener;
  priority: number;
  isOnce: boolean;
}

// 定义事件总线类
export class EventBus {
  // 事件监听器映射
  private listeners: Map<EventType, ListenerConfig[]> = new Map();

  // 订阅事件
  public on<T = unknown>(
    event: EventType,
    callback: EventListener<T>,
    priority = 0,
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const listeners = this.listeners.get(event)!;
    const listenerConfig: ListenerConfig = {
      callback: callback as EventListener,
      priority,
      isOnce: false,
    };

    // 按优先级插入监听器
    const insertIndex = listeners.findIndex((l) => l.priority > priority);
    if (insertIndex === -1) {
      listeners.push(listenerConfig);
    } else {
      listeners.splice(insertIndex, 0, listenerConfig);
    }

    // 返回取消订阅函数
    return () => {
      this.off(event, callback as EventListener);
    };
  }

  // 订阅一次性事件
  public once<T = unknown>(
    event: EventType,
    callback: EventListener<T>,
    priority = 0,
  ): () => void {
    const onceCallback: EventListener<T> = (data) => {
      callback(data);
      this.off(event, onceCallback as EventListener);
    };

    return this.on(event, onceCallback, priority);
  }

  // 取消订阅事件
  public off(event: EventType, callback?: EventListener): void {
    const listeners = this.listeners.get(event);
    if (!listeners) return;

    if (!callback) {
      // 取消该事件的所有监听器
      this.listeners.set(event, []);
      return;
    }

    // 取消指定的监听器
    const index = listeners.findIndex((l) => l.callback === callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  // 发布事件
  public emit<T = unknown>(event: EventType, data?: T): void {
    const listeners = this.listeners.get(event);
    if (!listeners || listeners.length === 0) return;

    // 复制监听器数组，避免在执行过程中修改导致的问题
    const listenersCopy = [...listeners];

    listenersCopy.forEach((listener) => {
      try {
        listener.callback(data as T);
      } catch {
        // 忽略事件监听器错误
      }
    });

    // 移除一次性监听器
    const remainingListeners = listeners.filter((l) => !l.isOnce);
    if (remainingListeners.length !== listeners.length) {
      this.listeners.set(event, remainingListeners);
    }
  }

  // 获取事件的监听器数量
  public listenerCount(event?: EventType): number {
    if (!event) {
      // 返回所有事件的监听器总数
      return Array.from(this.listeners.values()).reduce(
        (total, listeners) => total + listeners.length,
        0,
      );
    }

    const listeners = this.listeners.get(event);
    return listeners ? listeners.length : 0;
  }

  // 移除所有事件的监听器
  public removeAllListeners(): void {
    this.listeners.clear();
  }

  // 获取所有已注册的事件类型
  public getEventTypes(): EventType[] {
    return Array.from(this.listeners.keys());
  }
}

// 创建并导出全局事件总线实例
export const eventBus = new EventBus();
