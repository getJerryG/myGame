import { defineStore } from 'pinia';

// 定义决策类型
interface Decision {
  id: string;
  name: string;
  category: 'business' | 'product' | 'marketing' | 'team';
  description: string;
  options: Array<{
    id: string;
    name: string;
    description: string;
    consequences: {
      positive: string[];
      negative: string[];
      neutral: string[];
    };
    impact: {
      revenue: number;
      userSatisfaction: number;
      teamMorale: number;
      marketShare: number;
    };
  }>;
  deadline: number;
  status: 'pending' | 'decided' | 'implemented';
  selectedOption?: string;
  decisionTime?: number;
  implementationProgress: number;
}

// 定义决策状态类型
interface SimulationDecisionMakingState {
  // 当前决策列表
  currentDecisions: Decision[];
  // 历史决策记录
  historicalDecisions: Decision[];
  // 决策影响记录
  decisionImpacts: Array<{
    decisionId: string;
    optionId: string;
    timestamp: number;
    actualImpact: {
      revenue: number;
      userSatisfaction: number;
      teamMorale: number;
      marketShare: number;
    };
  }>;
  // 决策配置
  decisionConfig: {
    maxPendingDecisions: number;
    decisionMakingPeriodDays: number;
    impactMeasurementPeriodDays: number;
  };
}

// 创建并导出决策制定store
export const useSimulationDecisionMakingStore = defineStore('simulationDecisionMaking', {
  state: (): SimulationDecisionMakingState => ({
    // 初始当前决策为空数组
    currentDecisions: [],
    // 初始历史决策记录为空数组
    historicalDecisions: [],
    // 初始决策影响记录为空数组
    decisionImpacts: [],
    // 初始决策配置
    decisionConfig: {
      maxPendingDecisions: 3,
      decisionMakingPeriodDays: 7,
      impactMeasurementPeriodDays: 30,
    },
  }),

  getters: {
    // 获取待处理决策
    pendingDecisions: (state) => {
      return state.currentDecisions
        .filter((decision) => decision.status === 'pending')
        .sort((a, b) => a.deadline - b.deadline);
    },

    // 获取已决定的决策
    decidedDecisions: (state) => {
      return state.currentDecisions.filter((decision) => decision.status === 'decided');
    },

    // 获取已实施的决策
    implementedDecisions: (state) => {
      return [
        ...state.currentDecisions.filter((decision) => decision.status === 'implemented'),
        ...state.historicalDecisions,
      ];
    },

    // 根据ID获取决策
    getDecisionById: (state) => (decisionId: string) => {
      return [...state.currentDecisions, ...state.historicalDecisions].find((decision) => decision.id === decisionId);
    },
  },

  actions: {
    // 创建新决策
    createDecision(decisionData: Omit<Decision, 'id' | 'status' | 'implementationProgress'>) {
      if (this.pendingDecisions.length >= this.decisionConfig.maxPendingDecisions) {
        throw new Error('已达到最大待处理决策数量限制');
      }

      const newDecision: Decision = {
        ...decisionData,
        id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        implementationProgress: 0,
      };

      this.currentDecisions.push(newDecision);
      return newDecision;
    },

    // 做出决策
    makeDecision(decisionId: string, optionId: string) {
      const decision = this.getDecisionById(decisionId);
      if (decision) {
        decision.selectedOption = optionId;
        decision.status = 'decided';
        decision.decisionTime = Date.now();
      }
    },

    // 更新决策实施进度
    updateImplementationProgress(decisionId: string, progress: number) {
      const decision = this.getDecisionById(decisionId);
      if (decision) {
        decision.implementationProgress = Math.max(0, Math.min(100, progress));

        if (decision.implementationProgress >= 100 && decision.status === 'decided') {
          decision.status = 'implemented';

          // 将已实施的决策移至历史记录
          const index = this.currentDecisions.findIndex((d) => d.id === decisionId);
          if (index !== -1) {
            const [implementedDecision] = this.currentDecisions.splice(index, 1);
            this.historicalDecisions.push(implementedDecision);
          }
        }
      }
    },

    // 记录决策实际影响
    recordDecisionImpact(decisionId: string, optionId: string, actualImpact: Decision['options'][0]['impact']) {
      this.decisionImpacts.push({
        decisionId,
        optionId,
        timestamp: Date.now(),
        actualImpact,
      });
    },

    // 获取决策影响
    getDecisionImpact(decisionId: string) {
      return this.decisionImpacts.find((impact) => impact.decisionId === decisionId);
    },
  },

  // 持久化存储
  persist: {
    key: 'simulation-decision-making',
    storage: localStorage,
  },
});
