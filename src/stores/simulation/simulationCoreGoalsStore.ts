import { defineStore } from "pinia";

// 定义核心目标类型
interface CoreGoal {
  id: string;
  name: string;
  category: "business" | "user" | "product" | "team";
  description: string;
  targetValue: number;
  currentValue: number;
  progress: number;
  status: "active" | "completed" | "archived";
  deadline: number;
  priority: "high" | "medium" | "low";
  milestones: Array<{
    id: string;
    name: string;
    targetValue: number;
    achieved: boolean;
    achievedAt?: number;
  }>;
}

// 定义核心目标状态类型
interface SimulationCoreGoalsState {
  // 核心目标列表
  coreGoals: CoreGoal[];
  // 已完成的目标
  completedGoals: CoreGoal[];
  // 目标配置
  goalsConfig: {
    maxActiveGoals: number;
    goalReviewPeriodDays: number;
    defaultPriority: "high" | "medium" | "low";
  };
}

// 创建并导出核心目标store
export const useSimulationCoreGoalsStore = defineStore("simulationCoreGoals", {
  state: (): SimulationCoreGoalsState => ({
    // 初始核心目标为空数组
    coreGoals: [],
    // 初始已完成目标为空数组
    completedGoals: [],
    // 初始目标配置
    goalsConfig: {
      maxActiveGoals: 5,
      goalReviewPeriodDays: 30,
      defaultPriority: "medium",
    },
  }),

  getters: {
    // 获取活跃核心目标
    activeCoreGoals: (state) => {
      return state.coreGoals
        .filter((goal) => goal.status === "active")
        .sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    },

    // 获取高优先级目标
    highPriorityGoals: (state) => {
      return state.coreGoals.filter(
        (goal) => goal.status === "active" && goal.priority === "high",
      );
    },

    // 获取目标完成率
    goalsCompletionRate: (state) => {
      const totalGoals = state.coreGoals.length + state.completedGoals.length;
      if (totalGoals === 0) return 0;
      return Math.round((state.completedGoals.length / totalGoals) * 100);
    },

    // 根据ID获取目标
    getGoalById: (state) => (goalId: string) => {
      return [...state.coreGoals, ...state.completedGoals].find(
        (goal) => goal.id === goalId,
      );
    },
  },

  actions: {
    // 创建核心目标
    createCoreGoal(
      goalData: Omit<
        CoreGoal,
        "id" | "currentValue" | "progress" | "status" | "milestones"
      >,
    ) {
      if (this.activeCoreGoals.length >= this.goalsConfig.maxActiveGoals) {
        throw new Error("已达到最大活跃目标数量限制");
      }

      const newGoal: CoreGoal = {
        ...goalData,
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        currentValue: 0,
        progress: 0,
        status: "active",
        milestones: [],
      };

      this.coreGoals.push(newGoal);
      return newGoal;
    },

    // 更新目标进度
    updateGoalProgress(goalId: string, currentValue: number) {
      const goal = this.getGoalById(goalId);
      if (goal) {
        goal.currentValue = currentValue;
        goal.progress = Math.min(
          100,
          Math.round((currentValue / goal.targetValue) * 100),
        );

        // 检查是否完成
        if (goal.progress >= 100 && goal.status === "active") {
          goal.status = "completed";
          goal.deadline = Date.now();

          // 将完成的目标移至已完成列表
          const index = this.coreGoals.findIndex((g) => g.id === goalId);
          if (index !== -1) {
            const [completedGoal] = this.coreGoals.splice(index, 1);
            this.completedGoals.push(completedGoal);
          }
        }

        // 更新里程碑状态
        goal.milestones.forEach((milestone) => {
          if (!milestone.achieved && currentValue >= milestone.targetValue) {
            milestone.achieved = true;
            milestone.achievedAt = Date.now();
          }
        });
      }
    },

    // 添加里程碑
    addMilestone(
      goalId: string,
      milestone: Omit<
        CoreGoal["milestones"][0],
        "id" | "achieved" | "achievedAt"
      >,
    ) {
      const goal = this.getGoalById(goalId);
      if (goal) {
        goal.milestones.push({
          ...milestone,
          id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          achieved: goal.currentValue >= milestone.targetValue,
          achievedAt:
            goal.currentValue >= milestone.targetValue ? Date.now() : undefined,
        });
      }
    },

    // 归档目标
    archiveGoal(goalId: string) {
      const goal = this.getGoalById(goalId);
      if (goal) {
        goal.status = "archived";

        // 如果在活跃列表中，移至已完成列表
        const index = this.coreGoals.findIndex((g) => g.id === goalId);
        if (index !== -1) {
          const [archivedGoal] = this.coreGoals.splice(index, 1);
          this.completedGoals.push(archivedGoal);
        }
      }
    },

    // 重置目标
    resetGoal(goalId: string) {
      const goal = this.getGoalById(goalId);
      if (goal) {
        goal.currentValue = 0;
        goal.progress = 0;
        goal.status = "active";
        goal.milestones.forEach((milestone) => {
          milestone.achieved = false;
          delete milestone.achievedAt;
        });

        // 如果在已完成列表中，移回活跃列表
        const completedIndex = this.completedGoals.findIndex(
          (g) => g.id === goalId,
        );
        if (completedIndex !== -1) {
          const [resetGoal] = this.completedGoals.splice(completedIndex, 1);
          this.coreGoals.push(resetGoal);
        }
      }
    },
  },

  // 持久化存储
  persist: {
    key: "simulation-core-goals",
    storage: localStorage,
  },
});
