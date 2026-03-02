import { defineStore } from 'pinia';

// 定义新手目标类型
interface NewbieGoal {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  progress: number;
  status: 'active' | 'completed' | 'skipped';
  type: 'tutorial' | 'milestone' | 'achievement';
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  completedAt?: number;
  order: number;
  isRequired: boolean;
}

// 定义新手目标状态类型
interface SimulationNewbieGoalsState {
  // 新手目标列表
  newbieGoals: NewbieGoal[];
  // 已完成的新手目标
  completedNewbieGoals: NewbieGoal[];
  // 新手目标配置
  goalsConfig: {
    maxActiveGoals: number;
    completionBonus: number;
    showProgressNotification: boolean;
  };
  // 新手进度统计
  progressStats: {
    totalGoals: number;
    completedGoals: number;
    completionPercentage: number;
    totalRewardsEarned: number;
  };
}

// 创建并导出新手目标store
export const useSimulationNewbieGoalsStore = defineStore(
  'simulationNewbieGoals',
  {
    state: (): SimulationNewbieGoalsState => ({
      // 初始新手目标
      newbieGoals: [
        {
          id: 'goal_create_hero',
          name: '创建第一个英雄',
          description: '招募你的第一个游戏开发团队成员',
          target: 1,
          current: 0,
          progress: 0,
          status: 'active',
          type: 'tutorial',
          difficulty: 'easy',
          rewards: [
            {
              type: 'gold',
              amount: 1000,
              description: '获得1000金币',
            },
          ],
          order: 1,
          isRequired: true,
        },
        {
          id: 'goal_reach_level_2',
          name: '达到2级',
          description: '将任意英雄提升到2级',
          target: 1,
          current: 0,
          progress: 0,
          status: 'active',
          type: 'milestone',
          difficulty: 'medium',
          rewards: [
            {
              type: 'skill_points',
              amount: 5,
              description: '获得5点技能点',
            },
          ],
          order: 2,
          isRequired: true,
        },
        {
          id: 'goal_complete_first_project',
          name: '完成第一个项目',
          description: '成功发布你的第一个游戏项目',
          target: 1,
          current: 0,
          progress: 0,
          status: 'active',
          type: 'achievement',
          difficulty: 'hard',
          rewards: [
            {
              type: 'gold',
              amount: 5000,
              description: '获得5000金币',
            },
            {
              type: 'reputation',
              amount: 100,
              description: '获得100点声望',
            },
          ],
          order: 3,
          isRequired: true,
        },
      ],
      // 初始已完成新手目标为空数组
      completedNewbieGoals: [],
      // 初始新手目标配置
      goalsConfig: {
        maxActiveGoals: 5,
        completionBonus: 100,
        showProgressNotification: true,
      },
      // 初始新手进度统计
      progressStats: {
        totalGoals: 3,
        completedGoals: 0,
        completionPercentage: 0,
        totalRewardsEarned: 0,
      },
    }),

    getters: {
      // 获取活跃新手目标
      activeNewbieGoals: (state) => {
        return state.newbieGoals
          .filter((goal) => goal.status === 'active')
          .sort((a, b) => a.order - b.order);
      },

      // 获取即将完成的新手目标
      nearCompletionGoals: (state) => {
        return state.newbieGoals.filter(
          (goal) => goal.status === 'active' && goal.progress >= 80,
        );
      },

      // 获取已完成新手目标数量
      completedGoalsCount: (state) => state.completedNewbieGoals.length,

      // 根据类型获取新手目标
      getGoalsByType: (state) => (type: NewbieGoal['type']) => {
        return [...state.newbieGoals, ...state.completedNewbieGoals].filter(
          (goal) => goal.type === type,
        );
      },
    },

    actions: {
      // 更新新手目标进度
      updateGoalProgress(goalId: string, currentValue: number) {
        const goal = this.newbieGoals.find((g) => g.id === goalId);
        if (goal?.status === 'active') {
          goal.current = currentValue;
          goal.progress = Math.min(
            100,
            Math.round((currentValue / goal.target) * 100),
          );

          // 检查是否完成
          if (goal.progress >= 100) {
            goal.status = 'completed';
            goal.completedAt = Date.now();

            // 将完成的目标移至已完成列表
            const index = this.newbieGoals.findIndex((g) => g.id === goalId);
            if (index !== -1) {
              const [completedGoal] = this.newbieGoals.splice(index, 1);
              this.completedNewbieGoals.push(completedGoal);

              // 更新进度统计
              this.updateProgressStats();
            }
          }
        }
      },

      // 跳过新手目标
      skipGoal(goalId: string) {
        const goal = this.newbieGoals.find((g) => g.id === goalId);
        if (goal && !goal.isRequired) {
          goal.status = 'skipped';
        }
      },

      // 更新进度统计
      updateProgressStats() {
        const totalGoals =
          this.newbieGoals.length + this.completedNewbieGoals.length;
        const completedGoals = this.completedNewbieGoals.length;
        const completionPercentage =
          totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

        // 计算总奖励
        let totalRewards = 0;
        this.completedNewbieGoals.forEach((goal) => {
          goal.rewards.forEach((reward) => {
            if (reward.type === 'gold') {
              totalRewards += reward.amount;
            }
          });
        });

        this.progressStats = {
          totalGoals,
          completedGoals,
          completionPercentage,
          totalRewardsEarned: totalRewards,
        };
      },

      // 添加新的新手目标
      addNewbieGoal(
        goalData: Omit<
          NewbieGoal,
          'id' | 'progress' | 'status' | 'completedAt'
        >,
      ) {
        const newGoal: NewbieGoal = {
          ...goalData,
          id: `newbie_goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          progress: 0,
          status: 'active',
        };

        this.newbieGoals.push(newGoal);
        this.updateProgressStats();
        return newGoal;
      },

      // 重置新手目标
      resetNewbieGoals() {
        this.newbieGoals.forEach((goal) => {
          goal.current = 0;
          goal.progress = 0;
          goal.status = 'active';
          delete goal.completedAt;
        });

        this.completedNewbieGoals = [];
        this.updateProgressStats();
      },
    },

    // 持久化存储
    persist: {
      key: 'simulation-newbie-goals',
      storage: localStorage,
    },
  },
);
