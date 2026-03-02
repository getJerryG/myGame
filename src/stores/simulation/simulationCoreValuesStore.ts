import { defineStore } from 'pinia';

// 定义核心价值观类型
interface CoreValue {
  id: string;
  name: string;
  description: string;
  category:
    | 'innovation'
    | 'quality'
    | 'user-centric'
    | 'teamwork'
    | 'integrity';
  influenceScore: number; // 0-100，价值观影响力评分
  implementationLevel: number; // 0-100，价值观实施程度
  relatedPolicies: string[];
  examples: string[];
  status: 'active' | 'reviewed' | 'updated';
  lastReviewed: number;
}

// 定义核心价值观状态类型
interface SimulationCoreValuesState {
  // 核心价值观列表
  coreValues: CoreValue[];
  // 价值观影响力趋势
  influenceTrend: Array<{
    timestamp: number;
    values: Record<string, number>;
  }>;
  // 价值观配置
  valuesConfig: {
    reviewPeriodDays: number;
    influenceMeasurementFrequency: number;
    minimumImplementationLevel: number;
  };
}

// 创建并导出核心价值观store
export const useSimulationCoreValuesStore = defineStore(
  'simulationCoreValues',
  {
    state: (): SimulationCoreValuesState => ({
      // 初始核心价值观
      coreValues: [
        {
          id: 'value_innovation',
          name: '创新',
          description:
            '不断探索新的游戏机制和设计理念，保持产品的竞争力和吸引力',
          category: 'innovation',
          influenceScore: 85,
          implementationLevel: 75,
          relatedPolicies: ['每周创新 brainstorm', '鼓励实验性项目'],
          examples: ['引入动态事件系统', '开发独特的游戏玩法'],
          status: 'active',
          lastReviewed: Date.now(),
        },
        {
          id: 'value_quality',
          name: '品质',
          description: '追求卓越的游戏品质，确保每个细节都经过精心设计和测试',
          category: 'quality',
          influenceScore: 90,
          implementationLevel: 85,
          relatedPolicies: ['严格的质量控制流程', '用户反馈优先处理'],
          examples: ['优化游戏性能', '修复所有关键bug'],
          status: 'active',
          lastReviewed: Date.now(),
        },
        {
          id: 'value_user_centric',
          name: '用户中心',
          description: '以用户需求为导向，不断优化游戏体验',
          category: 'user-centric',
          influenceScore: 80,
          implementationLevel: 80,
          relatedPolicies: ['定期用户调研', '用户反馈响应机制'],
          examples: ['根据用户反馈调整游戏平衡', '优化界面易用性'],
          status: 'active',
          lastReviewed: Date.now(),
        },
        {
          id: 'value_teamwork',
          name: '团队合作',
          description: '鼓励跨团队协作，共同实现游戏的成功',
          category: 'teamwork',
          influenceScore: 75,
          implementationLevel: 70,
          relatedPolicies: ['跨团队项目机制', '定期团队建设活动'],
          examples: ['设计和开发团队紧密合作', '定期跨团队沟通会议'],
          status: 'active',
          lastReviewed: Date.now(),
        },
        {
          id: 'value_integrity',
          name: '诚信',
          description: '在游戏开发和运营中保持诚实和透明',
          category: 'integrity',
          influenceScore: 95,
          implementationLevel: 90,
          relatedPolicies: ['透明的运营政策', '公平的游戏机制'],
          examples: ['公开游戏更新日志', '确保抽奖机制公平'],
          status: 'active',
          lastReviewed: Date.now(),
        },
      ],
      // 初始影响力趋势为空数组
      influenceTrend: [],
      // 初始价值观配置
      valuesConfig: {
        reviewPeriodDays: 90,
        influenceMeasurementFrequency: 30,
        minimumImplementationLevel: 60,
      },
    }),

    getters: {
      // 获取核心价值观评分
      valuesScore: (state) => {
        if (state.coreValues.length === 0) return 0;
        const totalScore = state.coreValues.reduce(
          (sum, value) => sum + value.influenceScore,
          0,
        );
        return Math.round(totalScore / state.coreValues.length);
      },

      // 获取实施程度评分
      implementationScore: (state) => {
        if (state.coreValues.length === 0) return 0;
        const totalScore = state.coreValues.reduce(
          (sum, value) => sum + value.implementationLevel,
          0,
        );
        return Math.round(totalScore / state.coreValues.length);
      },

      // 获取需要审查的价值观
      valuesNeedingReview: (state) => {
        const reviewThreshold =
          Date.now() -
          state.valuesConfig.reviewPeriodDays * 24 * 60 * 60 * 1000;
        return state.coreValues.filter(
          (value) => value.lastReviewed < reviewThreshold,
        );
      },

      // 根据类别获取价值观
      getValuesByCategory: (state) => (category: CoreValue['category']) => {
        return state.coreValues.filter((value) => value.category === category);
      },
    },

    actions: {
      // 更新价值观影响力评分
      updateInfluenceScore(valueId: string, score: number) {
        const value = this.coreValues.find((v) => v.id === valueId);
        if (value) {
          value.influenceScore = Math.max(0, Math.min(100, score));

          // 记录影响力趋势
          this.influenceTrend.push({
            timestamp: Date.now(),
            values: {
              [valueId]: score,
            },
          });
        }
      },

      // 更新价值观实施程度
      updateImplementationLevel(valueId: string, level: number) {
        const value = this.coreValues.find((v) => v.id === valueId);
        if (value) {
          value.implementationLevel = Math.max(0, Math.min(100, level));
        }
      },

      // 审查价值观
      reviewValue(
        valueId: string,
        updates?: Partial<Omit<CoreValue, 'id' | 'lastReviewed' | 'status'>>,
      ) {
        const value = this.coreValues.find((v) => v.id === valueId);
        if (value) {
          if (updates) {
            Object.assign(value, updates);
          }
          value.lastReviewed = Date.now();
          value.status = 'reviewed';
        }
      },

      // 添加新的核心价值观
      addCoreValue(value: Omit<CoreValue, 'id' | 'lastReviewed' | 'status'>) {
        const newValue: CoreValue = {
          ...value,
          id: `value_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          lastReviewed: Date.now(),
          status: 'active',
        };

        this.coreValues.push(newValue);
        return newValue;
      },

      // 更新价值观状态
      updateValueStatus(valueId: string, status: CoreValue['status']) {
        const value = this.coreValues.find((v) => v.id === valueId);
        if (value) {
          value.status = status;
        }
      },
    },

    // 持久化存储
    persist: {
      key: 'simulation-core-values',
      storage: localStorage,
    },
  },
);
