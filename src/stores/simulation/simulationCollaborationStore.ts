import { defineStore } from "pinia";

// 定义合作项目类型
interface Collaboration {
  id: string;
  name: string;
  partner: string;
  type: "game" | "character" | "content" | "event";
  startTime: number;
  endTime: number;
  status: "negotiating" | "active" | "completed" | "canceled";
  objectives: string[];
  requirements: {
    funding: number;
    time: number;
    teamSize: number;
  };
  benefits: {
    revenueShare: number;
    userGrowth: number;
    brandExposure: number;
  };
  progress: number;
  currentPhase: string;
}

// 定义合作状态类型
interface SimulationCollaborationState {
  // 当前合作项目
  currentCollaborations: Collaboration[];
  // 历史合作记录
  historicalCollaborations: Collaboration[];
  // 合作请求
  collaborationRequests: Array<{
    id: string;
    partner: string;
    type: "game" | "character" | "content" | "event";
    timestamp: number;
    status: "pending" | "accepted" | "rejected";
  }>;
  // 合作配置
  collaborationConfig: {
    maxActiveCollaborations: number;
    negotiationPeriodDays: number;
    successRate: number;
  };
}

// 创建并导出合作store
export const useSimulationCollaborationStore = defineStore(
  "simulationCollaboration",
  {
    state: (): SimulationCollaborationState => ({
      // 初始当前合作项目为空数组
      currentCollaborations: [],
      // 初始历史合作记录为空数组
      historicalCollaborations: [],
      // 初始合作请求为空数组
      collaborationRequests: [],
      // 初始合作配置
      collaborationConfig: {
        maxActiveCollaborations: 3,
        negotiationPeriodDays: 14,
        successRate: 0.7,
      },
    }),

    getters: {
      // 获取活跃合作项目
      activeCollaborations: (state) => {
        return state.currentCollaborations.filter(
          (collab) => collab.status === "active",
        );
      },

      // 获取谈判中的合作项目
      negotiatingCollaborations: (state) => {
        return state.currentCollaborations.filter(
          (collab) => collab.status === "negotiating",
        );
      },

      // 获取待处理的合作请求
      pendingRequests: (state) => {
        return state.collaborationRequests.filter(
          (request) => request.status === "pending",
        );
      },

      // 根据ID获取合作项目
      getCollaborationById: (state) => (collabId: string) => {
        return [
          ...state.currentCollaborations,
          ...state.historicalCollaborations,
        ].find((collab) => collab.id === collabId);
      },
    },

    actions: {
      // 创建合作项目
      createCollaboration(
        collabData: Omit<Collaboration, "id" | "progress" | "currentPhase">,
      ) {
        if (
          this.activeCollaborations.length >=
          this.collaborationConfig.maxActiveCollaborations
        ) {
          throw new Error("已达到最大活跃合作项目数量限制");
        }

        const newCollaboration: Collaboration = {
          ...collabData,
          id: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          progress: 0,
          currentPhase: "planning",
        };

        this.currentCollaborations.push(newCollaboration);
        return newCollaboration;
      },

      // 更新合作状态
      updateCollaborationStatus(
        collabId: string,
        status: "negotiating" | "active" | "completed" | "canceled",
      ) {
        const collaboration = this.getCollaborationById(collabId);
        if (collaboration) {
          collaboration.status = status;

          // 如果合作已完成或取消，将其移至历史记录
          if (status === "completed" || status === "canceled") {
            const currentIndex = this.currentCollaborations.findIndex(
              (c) => c.id === collabId,
            );
            if (currentIndex !== -1) {
              const [completedCollab] = this.currentCollaborations.splice(
                currentIndex,
                1,
              );
              this.historicalCollaborations.push(completedCollab);
            }
          }
        }
      },

      // 更新合作进度
      updateCollaborationProgress(
        collabId: string,
        progress: number,
        phase?: string,
      ) {
        const collaboration = this.getCollaborationById(collabId);
        if (collaboration) {
          collaboration.progress = Math.max(0, Math.min(100, progress));

          if (phase) {
            collaboration.currentPhase = phase;
          }

          // 如果进度达到100%，自动标记为完成
          if (
            collaboration.progress >= 100 &&
            collaboration.status === "active"
          ) {
            this.updateCollaborationStatus(collabId, "completed");
          }
        }
      },

      // 处理合作请求
      handleCollaborationRequest(requestId: string, accepted: boolean) {
        const request = this.collaborationRequests.find(
          (r) => r.id === requestId,
        );
        if (request) {
          request.status = accepted ? "accepted" : "rejected";
        }
      },

      // 生成新的合作请求
      generateCollaborationRequest() {
        const types = ["game", "character", "content", "event"] as const;
        const newRequest = {
          id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          partner: `Partner_${Math.floor(Math.random() * 1000)}`,
          type: types[Math.floor(Math.random() * types.length)],
          timestamp: Date.now(),
          status: "pending" as const,
        };

        this.collaborationRequests.push(newRequest);
        return newRequest;
      },
    },

    // 持久化存储
    persist: {
      key: "simulation-collaboration",
      storage: localStorage,
    },
  },
);
