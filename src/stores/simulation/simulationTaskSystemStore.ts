import { defineStore } from 'pinia';

// 定义任务奖励类型
export interface TaskReward {
  type: 'funds' | 'exp' | 'items' | 'unlock' | 'other';
  amount: number;
  description: string;
  itemId?: string;
}

// 定义任务状态类型
export type TaskStatus = 'pending' | 'completed' | 'rewarded' | 'expired';

// 定义任务类型
export type TaskType = 'growth' | 'daily' | 'random' | 'special';

// 定义任务触发条件类型
export interface TaskTrigger {
  type: 'event' | 'stat' | 'time' | 'action';
  condition: string;
  threshold: number;
  eventType?: string;
}

// 定义任务类型
export interface Task {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  triggers: TaskTrigger[];
  rewards: TaskReward[];
  progress: number;
  targetProgress: number;
  createdAt: number;
  expiredAt?: number;
  completedAt?: number;
  rewardedAt?: number;
  priority: number;
  isVisible: boolean;
  relatedModule?: string;
  relatedId?: string;
}

// 定义任务系统状态类型
interface TaskSystemState {
  // 所有任务数据
  tasks: Task[];
  // 任务类型配置
  taskTypeConfig: Record<
    TaskType,
    {
      maxConcurrentTasks: number;
      refreshInterval: number;
      autoGenerate: boolean;
    }
  >;
  // 统计数据
  statistics: {
    totalTasksCompleted: number;
    totalRewardsClaimed: number;
    averageCompletionTime: number;
    activeTaskCount: number;
  };
  // 最后刷新时间
  lastRefreshTime: {
    daily: number;
    random: number;
    growth: number;
  };
  // 任务生成计数器
  taskGenerationCounters: {
    growth: number;
    daily: number;
    random: number;
  };
}

// 创建并导出任务系统store
export const useSimulationTaskSystemStore = defineStore(
  'simulationTaskSystem',
  {
    state: (): TaskSystemState => ({
      // 所有任务数据
      tasks: [],
      // 任务类型配置
      taskTypeConfig: {
        growth: {
          maxConcurrentTasks: 5,
          refreshInterval: 0, // 成长任务不自动刷新
          autoGenerate: true,
        },
        daily: {
          maxConcurrentTasks: 3,
          refreshInterval: 24 * 60 * 60 * 1000, // 24小时
          autoGenerate: true,
        },
        random: {
          maxConcurrentTasks: 2,
          refreshInterval: 12 * 60 * 60 * 1000, // 12小时
          autoGenerate: true,
        },
        special: {
          maxConcurrentTasks: 1,
          refreshInterval: 0, // 特殊任务不自动刷新
          autoGenerate: false,
        },
      },
      // 统计数据
      statistics: {
        totalTasksCompleted: 0,
        totalRewardsClaimed: 0,
        averageCompletionTime: 0,
        activeTaskCount: 0,
      },
      // 最后刷新时间
      lastRefreshTime: {
        daily: Date.now(),
        random: Date.now(),
        growth: Date.now(),
      },
      // 任务生成计数器
      taskGenerationCounters: {
        growth: 0,
        daily: 0,
        random: 0,
      },
    }),

    getters: {
      // 获取所有任务
      getAllTasks: (state) => state.tasks,

      // 获取成长任务
      getGrowthTasks: (state) =>
        state.tasks.filter((task) => task.type === 'growth'),

      // 获取日常任务
      getDailyTasks: (state) =>
        state.tasks.filter((task) => task.type === 'daily'),

      // 获取随机任务
      getRandomTasks: (state) =>
        state.tasks.filter((task) => task.type === 'random'),

      // 获取特殊任务
      getSpecialTasks: (state) =>
        state.tasks.filter((task) => task.type === 'special'),

      // 获取已完成待领取奖励的任务
      getCompletedTasksWithReward: (state) =>
        state.tasks.filter((task) => task.status === 'completed'),

      // 获取已领取奖励的任务
      getRewardedTasks: (state) =>
        state.tasks.filter((task) => task.status === 'rewarded'),

      // 根据ID获取任务
      getTaskById: (state) => (taskId: string) => {
        return state.tasks.find((task) => task.id === taskId);
      },

      // 获取任务类型列表
      getTaskTypeList: () => {
        return ['growth', 'daily', 'random', 'special'] as TaskType[];
      },
    },

    actions: {
      // 初始化任务系统
      initTaskSystem() {
        // 生成初始任务
        this.generateInitialTasks();
        // 生成成长任务（基于游戏等级）
        this.generateGrowthTasks();
        // 生成日常任务
        this.generateDailyTasks();
        // 生成随机任务
        this.generateRandomTasks();
      },

      // 生成初始任务
      generateInitialTasks() {
        // 这里可以添加游戏开始时的初始任务
        const initialTasks: Task[] = [
          {
            id: 'task-initial-1',
            name: '创建第一个项目',
            description: '创建你的第一个游戏项目，开始你的游戏开发之旅',
            type: 'growth',
            status: 'pending',
            triggers: [
              {
                type: 'action',
                condition: 'project_created',
                threshold: 1,
                eventType: 'project',
              },
            ],
            rewards: [
              {
                type: 'funds',
                amount: 1000,
                description: '1000资金',
              },
              {
                type: 'exp',
                amount: 50,
                description: '50经验值',
              },
            ],
            progress: 0,
            targetProgress: 1,
            createdAt: Date.now(),
            priority: 1,
            isVisible: true,
            relatedModule: 'project',
          },
        ];

        this.tasks.push(...initialTasks);
        this.updateActiveTaskCount();
      },

      // 生成成长任务（基于游戏等级）
      generateGrowthTasks(_level = 1) {
        // 根据游戏等级生成成长任务
        // 避免生成重复任务
        const existingGrowthTasks = this.tasks.filter(
          (task) => task.type === 'growth' && task.status === 'pending',
        );
        const maxGrowthTasks = this.taskTypeConfig.growth.maxConcurrentTasks;

        // 如果已经有足够的成长任务，就不再生成
        if (existingGrowthTasks.length >= maxGrowthTasks) {
          return;
        }

        // 生成新的成长任务
        const growthTaskTemplates: Array<{
          name: string;
          description: string;
          triggers: Array<{
            type: 'event' | 'time' | 'stat' | 'action';
            condition: string;
            threshold: number;
            eventType?: string;
          }>;
          rewards: Array<{
            type: 'exp' | 'funds' | 'items' | 'unlock' | 'other';
            amount: number;
            description: string;
          }>;
          targetProgress: number;
        }> = [
          {
            name: '完成项目开发',
            description: '完成一个游戏项目的开发和发布',
            triggers: [
              {
                type: 'action',
                condition: 'project_released',
                threshold: 1,
                eventType: 'project',
              },
            ],
            rewards: [
              {
                type: 'funds',
                amount: 5000,
                description: '5000资金',
              },
              {
                type: 'exp',
                amount: 200,
                description: '200经验值',
              },
            ],
            targetProgress: 1,
          },
          {
            name: '提升团队规模',
            description: '将团队规模提升到5人',
            triggers: [
              {
                type: 'stat',
                condition: 'team_size',
                threshold: 5,
              },
            ],
            rewards: [
              {
                type: 'funds',
                amount: 3000,
                description: '3000资金',
              },
              {
                type: 'exp',
                amount: 150,
                description: '150经验值',
              },
            ],
            targetProgress: 5,
          },
        ];

        // 遍历所有模板，生成尚未存在的成长任务
        growthTaskTemplates.forEach((template) => {
          // 检查是否已经有相同类型的未完成任务
          const hasSameTypeTask = this.tasks.some(
            (task) =>
              task.type === 'growth' &&
              task.status === 'pending' &&
              task.name === template.name,
          );

          if (!hasSameTypeTask) {
            const newTask: Task = {
              id: `task-growth-${this.taskGenerationCounters.growth++}-${Date.now()}`,
              name: template.name,
              description: template.description,
              type: 'growth',
              status: 'pending',
              triggers: template.triggers,
              rewards: template.rewards,
              progress: 0,
              targetProgress: template.targetProgress,
              createdAt: Date.now(),
              priority: 2,
              isVisible: true,
              relatedModule: 'growth',
            };

            this.tasks.push(newTask);
            this.updateActiveTaskCount();
          }
        });
      },

      // 生成日常任务
      generateDailyTasks(force = false) {
        // 检查是否需要刷新日常任务
        const now = Date.now();
        const timeSinceLastDailyRefresh = now - this.lastRefreshTime.daily;

        if (
          !force &&
          timeSinceLastDailyRefresh < this.taskTypeConfig.daily.refreshInterval
        ) {
          return;
        }

        // 清理过期的日常任务
        this.cleanupExpiredTasks('daily');

        // 生成新的日常任务
        const dailyTaskTemplates: Array<{
          name: string;
          description: string;
          triggers: Array<{
            type: 'event' | 'time' | 'stat' | 'action';
            condition: string;
            threshold: number;
            eventType?: string;
          }>;
          rewards: Array<{
            type: 'exp' | 'funds' | 'items' | 'unlock' | 'other';
            amount: number;
            description: string;
          }>;
          targetProgress: number;
        }> = [
          {
            name: '日常开发',
            description: '进行游戏开发，累计开发时间达到8小时',
            triggers: [
              {
                type: 'time',
                condition: 'development_time',
                threshold: 8 * 60 * 60 * 1000,
              },
            ],
            rewards: [
              {
                type: 'funds',
                amount: 2000,
                description: '2000资金',
              },
              {
                type: 'exp',
                amount: 100,
                description: '100经验值',
              },
            ],
            targetProgress: 8,
          },
          {
            name: '市场调研',
            description: '进行市场调研，了解玩家需求',
            triggers: [
              {
                type: 'action',
                condition: 'market_research',
                threshold: 3,
                eventType: 'research',
              },
            ],
            rewards: [
              {
                type: 'funds',
                amount: 1500,
                description: '1500资金',
              },
              {
                type: 'exp',
                amount: 80,
                description: '80经验值',
              },
            ],
            targetProgress: 3,
          },
        ];

        // 生成所有日常任务模板
        const selectedTemplates = [...dailyTaskTemplates];

        // 生成新的日常任务
        const newDailyTasks: Task[] = selectedTemplates.map((template) => ({
          id: `task-daily-${this.taskGenerationCounters.daily++}-${Date.now()}`,
          name: template.name,
          description: template.description,
          type: 'daily',
          status: 'pending',
          triggers: template.triggers,
          rewards: template.rewards,
          progress: 0,
          targetProgress: template.targetProgress,
          createdAt: Date.now(),
          expiredAt: now + this.taskTypeConfig.daily.refreshInterval,
          priority: 3,
          isVisible: true,
          relatedModule: 'daily',
        }));

        this.tasks.push(...newDailyTasks);
        this.lastRefreshTime.daily = now;
        this.updateActiveTaskCount();
      },

      // 生成随机任务
      generateRandomTasks() {
        // 检查是否需要刷新随机任务
        const now = Date.now();
        const timeSinceLastRandomRefresh = now - this.lastRefreshTime.random;

        if (
          timeSinceLastRandomRefresh <
          this.taskTypeConfig.random.refreshInterval
        ) {
          return;
        }

        // 50%概率生成随机任务
        if (Math.random() > 0.5) {
          return;
        }

        // 清理过期的随机任务
        this.cleanupExpiredTasks('random');

        // 生成新的随机任务
        const randomTaskTemplates: Array<{
          name: string;
          description: string;
          triggers: Array<{
            type: 'event' | 'time' | 'stat' | 'action';
            condition: string;
            threshold: number;
            eventType?: string;
          }>;
          rewards: Array<{
            type: 'exp' | 'funds' | 'items' | 'unlock' | 'other';
            amount: number;
            description: string;
          }>;
          targetProgress: number;
        }> = [
          {
            name: '紧急修复',
            description: '修复游戏中的紧急bug，24小时内完成',
            triggers: [
              {
                type: 'action',
                condition: 'bug_fixed',
                threshold: 5,
                eventType: 'bug',
              },
            ],
            rewards: [
              {
                type: 'funds',
                amount: 3000,
                description: '3000资金',
              },
              {
                type: 'exp',
                amount: 150,
                description: '150经验值',
              },
            ],
            targetProgress: 5,
          },
          {
            name: '合作机会',
            description: '与其他游戏公司合作开发项目',
            triggers: [
              {
                type: 'action',
                condition: 'collaboration_established',
                threshold: 1,
                eventType: 'collaboration',
              },
            ],
            rewards: [
              {
                type: 'funds',
                amount: 10000,
                description: '10000资金',
              },
              {
                type: 'exp',
                amount: 300,
                description: '300经验值',
              },
            ],
            targetProgress: 1,
          },
        ];

        // 随机选择一个随机任务模板生成任务
        const randomTemplate =
          randomTaskTemplates[
            Math.floor(Math.random() * randomTaskTemplates.length)
          ];

        const newRandomTask: Task = {
          id: `task-random-${this.taskGenerationCounters.random++}-${Date.now()}`,
          name: randomTemplate.name,
          description: randomTemplate.description,
          type: 'random',
          status: 'pending',
          triggers: randomTemplate.triggers,
          rewards: randomTemplate.rewards,
          progress: 0,
          targetProgress: randomTemplate.targetProgress,
          createdAt: now,
          expiredAt: now + 24 * 60 * 60 * 1000, // 24小时过期
          priority: 4,
          isVisible: true,
          relatedModule: 'random',
        };

        this.tasks.push(newRandomTask);
        this.lastRefreshTime.random = now;
        this.updateActiveTaskCount();
      },

      // 更新任务进度
      updateTaskProgress(taskId: string, progress: number) {
        const task = this.tasks.find((t) => t.id === taskId);
        if (!task) return;

        // 更新任务进度
        task.progress = Math.min(progress, task.targetProgress);

        // 检查任务是否完成
        if (task.progress >= task.targetProgress && task.status === 'pending') {
          task.status = 'completed';
          task.completedAt = Date.now();
          this.statistics.totalTasksCompleted++;
          this.updateActiveTaskCount();
        }
      },

      // 处理用户活动事件，更新相关任务进度
      handleUserActivity(eventType: string, eventData: any) {
        // 遍历所有任务，检查是否有任务需要更新
        this.tasks.forEach((task) => {
          if (task.status !== 'pending') return;

          task.triggers.forEach((trigger) => {
            if (trigger.type === 'event' && trigger.eventType === eventType) {
              // 事件触发的任务
              this.updateTaskProgress(task.id, task.progress + 1);
            } else if (
              trigger.type === 'action' &&
              trigger.eventType === eventType
            ) {
              // 动作触发的任务
              this.updateTaskProgress(task.id, task.progress + 1);
            }
          });
        });

        // 根据活动类型生成新任务
        if (eventType === 'level_up') {
          this.generateGrowthTasks(eventData.level);
        }
      },

      // 清理过期任务
      cleanupExpiredTasks(type?: TaskType) {
        const now = Date.now();
        let expiredTasksCount = 0;

        this.tasks = this.tasks.filter((task) => {
          // 检查任务是否过期
          const isExpired =
            task.expiredAt && now > task.expiredAt && task.status === 'pending';

          if (isExpired) {
            expiredTasksCount++;
            return false;
          }

          // 如果指定了类型，只保留该类型的任务
          return !type || task.type === type;
        });

        if (expiredTasksCount > 0) {
          this.updateActiveTaskCount();
        }
      },

      // 领取任务奖励
      claimTaskReward(taskId: string): TaskReward[] | null {
        const task = this.tasks.find((t) => t.id === taskId);
        if (task?.status !== 'completed') {
          return null;
        }

        // 标记任务为已领取奖励
        task.status = 'rewarded';
        task.rewardedAt = Date.now();

        // 更新统计数据
        this.statistics.totalRewardsClaimed++;

        // 计算平均完成时间
        if (task.completedAt && task.createdAt) {
          const completionTime = task.completedAt - task.createdAt;
          this.statistics.averageCompletionTime =
            (this.statistics.averageCompletionTime *
              (this.statistics.totalTasksCompleted - 1) +
              completionTime) /
            this.statistics.totalTasksCompleted;
        }

        this.updateActiveTaskCount();

        return task.rewards;
      },

      // 刷新任务列表
      refreshTasks() {
        // 生成新的日常任务
        this.generateDailyTasks();
        // 生成新的随机任务
        this.generateRandomTasks();
        // 清理过期任务
        this.cleanupExpiredTasks();
      },

      // 更新活跃任务计数
      updateActiveTaskCount() {
        this.statistics.activeTaskCount = this.tasks.filter(
          (task) => task.status === 'pending' || task.status === 'completed',
        ).length;
      },

      // 重置任务系统
      resetTaskSystem() {
        this.tasks = [];
        this.statistics = {
          totalTasksCompleted: 0,
          totalRewardsClaimed: 0,
          averageCompletionTime: 0,
          activeTaskCount: 0,
        };
        this.lastRefreshTime = {
          daily: 0, // 设置为0，确保generateDailyTasks会生成新任务
          random: Date.now(),
          growth: Date.now(),
        };
        this.taskGenerationCounters = {
          growth: 0,
          daily: 0,
          random: 0,
        };

        // 重新初始化任务系统
        this.initTaskSystem();
        // 强制生成日常任务
        this.generateDailyTasks(true);
      },
    },

    // 持久化存储
    persist: {
      key: 'simulation-task-system',
      storage: localStorage,
    },
  },
);
