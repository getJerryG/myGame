import { defineStore } from 'pinia';

// 定义动态事件类型
interface DynamicEvent {
  id: string;
  name: string;
  type: 'market' | 'user' | 'technical' | 'competitor' | 'team';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-1，事件发生概率
  impact: {
    revenue: number;
    userSatisfaction: number;
    gamePerformance: number;
    teamMorale: number;
  };
  triggers: Array<{
    condition: string;
    threshold: number;
  }>;
  responses: Array<{
    id: string;
    name: string;
    description: string;
    cost: number;
    effectiveness: number; // 0-1，响应效果
    implementationTime: number;
  }>;
  status: 'potential' | 'active' | 'resolved';
  resolvedBy?: string;
  resolvedAt?: number;
  resolutionEffectiveness?: number;
}

// 定义动态事件状态类型
interface SimulationDynamicEventsState {
  // 潜在事件列表
  potentialEvents: DynamicEvent[];
  // 活跃事件列表
  activeEvents: DynamicEvent[];
  // 已解决事件记录
  resolvedEvents: DynamicEvent[];
  // 事件历史记录
  eventHistory: Array<{
    eventId: string;
    timestamp: number;
    type: 'triggered' | 'resolved';
    details: any;
  }>;
  // 事件配置
  eventConfig: {
    maxActiveEvents: number;
    eventCheckFrequency: number;
    minSeverityForNotification: 'low' | 'medium' | 'high' | 'critical';
  };
}

// 创建并导出动态事件store
export const useSimulationDynamicEventsStore = defineStore('simulationDynamicEvents', {
  state: (): SimulationDynamicEventsState => ({
    // 初始潜在事件为空数组
    potentialEvents: [],
    // 初始活跃事件为空数组
    activeEvents: [],
    // 初始已解决事件记录为空数组
    resolvedEvents: [],
    // 初始事件历史记录为空数组
    eventHistory: [],
    // 初始事件配置
    eventConfig: {
      maxActiveEvents: 5,
      eventCheckFrequency: 60, // 分钟
      minSeverityForNotification: 'medium',
    },
  }),

  getters: {
    // 获取高严重性事件
    highSeverityEvents: (state) => {
      return state.activeEvents.filter((event) => event.severity === 'high' || event.severity === 'critical');
    },

    // 获取需要关注的潜在事件
    concerningPotentialEvents: (state) => {
      return state.potentialEvents.filter((event) => event.probability > 0.5 && event.severity !== 'low');
    },

    // 根据类型获取事件
    getEventsByType: (state) => (type: DynamicEvent['type']) => {
      return {
        potential: state.potentialEvents.filter((event) => event.type === type),
        active: state.activeEvents.filter((event) => event.type === type),
        resolved: state.resolvedEvents.filter((event) => event.type === type),
      };
    },

    // 根据ID获取事件
    getEventById: (state) => (eventId: string) => {
      return [...state.potentialEvents, ...state.activeEvents, ...state.resolvedEvents].find(
        (event) => event.id === eventId
      );
    },
  },

  actions: {
    // 添加潜在事件
    addPotentialEvent(eventData: Omit<DynamicEvent, 'id' | 'status'>) {
      const newEvent: DynamicEvent = {
        ...eventData,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'potential',
      };

      this.potentialEvents.push(newEvent);
      return newEvent;
    },

    // 触发事件
    triggerEvent(eventId: string) {
      const eventIndex = this.potentialEvents.findIndex((e) => e.id === eventId);
      if (eventIndex !== -1 && this.activeEvents.length < this.eventConfig.maxActiveEvents) {
        const [event] = this.potentialEvents.splice(eventIndex, 1);
        event.status = 'active';
        this.activeEvents.push(event);

        // 记录事件历史
        this.eventHistory.push({
          eventId,
          timestamp: Date.now(),
          type: 'triggered',
          details: { severity: event.severity, impact: event.impact },
        });
      }
    },

    // 解决事件
    resolveEvent(eventId: string, responseId: string, effectiveness: number) {
      const eventIndex = this.activeEvents.findIndex((e) => e.id === eventId);
      if (eventIndex !== -1) {
        const [event] = this.activeEvents.splice(eventIndex, 1);
        event.status = 'resolved';
        event.resolvedBy = responseId;
        event.resolvedAt = Date.now();
        event.resolutionEffectiveness = effectiveness;
        this.resolvedEvents.push(event);

        // 记录事件历史
        this.eventHistory.push({
          eventId,
          timestamp: Date.now(),
          type: 'resolved',
          details: { responseId, effectiveness },
        });
      }
    },

    // 更新事件概率
    updateEventProbability(eventId: string, probability: number) {
      const event = this.getEventById(eventId);
      if (event) {
        event.probability = Math.max(0, Math.min(1, probability));
      }
    },

    // 清理旧事件
    cleanOldEvents(daysToKeep = 30) {
      const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
      this.resolvedEvents = this.resolvedEvents.filter((event) => event.resolvedAt && event.resolvedAt > cutoffTime);
    },
  },

  // 持久化存储
  persist: {
    key: 'simulation-dynamic-events',
    storage: localStorage,
  },
});
