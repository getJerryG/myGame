import { defineStore } from 'pinia';

// 定义活动类型
interface Activity {
  id: string;
  name: string;
  type: 'event' | 'campaign' | 'collaboration';
  startTime: number;
  endTime: number;
  status: 'upcoming' | 'active' | 'completed';
  description: string;
  rewards: Array<{
    type: string;
    amount: number;
  }>;
  participationCount: number;
}

// 定义活动状态类型
interface SimulationActivityState {
  // 当前活动列表
  currentActivities: Activity[];
  // 历史活动记录
  historicalActivities: Activity[];
  // 活动参与记录
  participationRecords: Array<{
    activityId: string;
    timestamp: number;
    rewardsClaimed: boolean;
  }>;
  // 活动配置
  activityConfig: {
    maxConcurrentActivities: number;
    autoExpireDays: number;
  };
}

// 创建并导出活动store
export const useSimulationActivityStore = defineStore('simulationActivity', {
  state: (): SimulationActivityState => ({
    // 初始当前活动为空数组
    currentActivities: [],
    // 初始历史活动为空数组
    historicalActivities: [],
    // 初始参与记录为空数组
    participationRecords: [],
    // 初始活动配置
    activityConfig: {
      maxConcurrentActivities: 5,
      autoExpireDays: 7,
    },
  }),

  getters: {
    // 获取活跃活动
    activeActivities: (state) => {
      return state.currentActivities.filter(
        (activity) => activity.status === 'active',
      );
    },

    // 获取即将开始的活动
    upcomingActivities: (state) => {
      return state.currentActivities.filter(
        (activity) => activity.status === 'upcoming',
      );
    },

    // 获取已完成的活动
    completedActivities: (state) => {
      return [
        ...state.currentActivities.filter(
          (activity) => activity.status === 'completed',
        ),
        ...state.historicalActivities,
      ];
    },

    // 根据ID获取活动
    getActivityById: (state) => (activityId: string) => {
      return [...state.currentActivities, ...state.historicalActivities].find(
        (activity) => activity.id === activityId,
      );
    },
  },

  actions: {
    // 创建新活动
    createActivity(activityData: Omit<Activity, 'id' | 'participationCount'>) {
      if (
        this.currentActivities.length >=
        this.activityConfig.maxConcurrentActivities
      ) {
        throw new Error('已达到最大活动数量限制');
      }

      const newActivity: Activity = {
        ...activityData,
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        participationCount: 0,
      };

      this.currentActivities.push(newActivity);
      return newActivity;
    },

    // 更新活动状态
    updateActivityStatus(
      activityId: string,
      status: 'upcoming' | 'active' | 'completed',
    ) {
      const activity = this.getActivityById(activityId);
      if (activity) {
        activity.status = status;

        // 如果活动已完成，将其移至历史活动
        if (status === 'completed') {
          const currentIndex = this.currentActivities.findIndex(
            (a) => a.id === activityId,
          );
          if (currentIndex !== -1) {
            const [completedActivity] = this.currentActivities.splice(
              currentIndex,
              1,
            );
            this.historicalActivities.push(completedActivity);
          }
        }
      }
    },

    // 参与活动
    participateInActivity(activityId: string) {
      const activity = this.getActivityById(activityId);
      if (activity?.status === 'active') {
        activity.participationCount++;

        // 记录参与
        this.participationRecords.push({
          activityId,
          timestamp: Date.now(),
          rewardsClaimed: false,
        });
      }
    },

    // 领取活动奖励
    claimActivityRewards(activityId: string) {
      const recordIndex = this.participationRecords.findIndex(
        (record) => record.activityId === activityId && !record.rewardsClaimed,
      );

      if (recordIndex !== -1) {
        this.participationRecords[recordIndex].rewardsClaimed = true;
        return true;
      }
      return false;
    },

    // 清理过期活动
    cleanExpiredActivities() {
      const now = Date.now();
      const expiredDays =
        this.activityConfig.autoExpireDays * 24 * 60 * 60 * 1000;

      // 清理历史活动中超过过期天数的活动
      this.historicalActivities = this.historicalActivities.filter(
        (activity) => now - activity.endTime < expiredDays,
      );
    },
  },

  // 持久化存储
  persist: {
    key: 'simulation-activity',
    storage: localStorage,
  },
});
