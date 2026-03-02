import { defineStore } from "pinia";

// 定义操作权限类型
interface OperationPermission {
  id: string;
  name: string;
  description: string;
  type:
    | "game_operation"
    | "user_management"
    | "financial"
    | "content_management";
  requiredLevel: number;
  isGranted: boolean;
  grantedAt?: number;
  grantedBy?: string;
  isRevocable: boolean;
  usageCount: number;
  lastUsed?: number;
}

// 定义操作权限状态类型
interface SimulationOperationPermissionsState {
  // 操作权限列表
  operationPermissions: OperationPermission[];
  // 权限配置
  permissionConfig: {
    defaultPermissions: string[];
    permissionGrantDelayDays: number;
    maxUsagePerDay: number;
  };
  // 权限使用记录
  usageRecords: Array<{
    permissionId: string;
    timestamp: number;
    userId: string;
    success: boolean;
  }>;
}

// 创建并导出操作权限store
export const useSimulationOperationPermissionsStore = defineStore(
  "simulationOperationPermissions",
  {
    state: (): SimulationOperationPermissionsState => ({
      // 初始操作权限列表
      operationPermissions: [
        {
          id: "permission_publish_game",
          name: "发布游戏",
          description: "允许发布新游戏或游戏更新",
          type: "game_operation",
          requiredLevel: 3,
          isGranted: false,
          isRevocable: true,
          usageCount: 0,
        },
        {
          id: "permission_manage_users",
          name: "管理用户",
          description: "允许管理游戏用户账号",
          type: "user_management",
          requiredLevel: 4,
          isGranted: false,
          isRevocable: true,
          usageCount: 0,
        },
        {
          id: "permission_manage_finances",
          name: "管理财务",
          description: "允许管理游戏财务和收入",
          type: "financial",
          requiredLevel: 5,
          isGranted: false,
          isRevocable: true,
          usageCount: 0,
        },
        {
          id: "permission_manage_content",
          name: "管理内容",
          description: "允许管理游戏内内容",
          type: "content_management",
          requiredLevel: 2,
          isGranted: false,
          isRevocable: true,
          usageCount: 0,
        },
      ],
      // 初始权限配置
      permissionConfig: {
        defaultPermissions: [],
        permissionGrantDelayDays: 0,
        maxUsagePerDay: 100,
      },
      // 初始权限使用记录为空数组
      usageRecords: [],
    }),

    getters: {
      // 获取已授予的权限
      grantedPermissions: (state) => {
        return state.operationPermissions.filter(
          (permission) => permission.isGranted,
        );
      },

      // 根据类型获取权限
      getPermissionsByType: (state) => (type: OperationPermission["type"]) => {
        return state.operationPermissions.filter(
          (permission) => permission.type === type,
        );
      },

      // 获取可授予的权限
      grantablePermissions: (state) => (userLevel: number) => {
        return state.operationPermissions.filter(
          (permission) =>
            permission.requiredLevel <= userLevel && !permission.isGranted,
        );
      },

      // 根据ID获取权限
      getPermissionById: (state) => (permissionId: string) => {
        return state.operationPermissions.find(
          (permission) => permission.id === permissionId,
        );
      },
    },

    actions: {
      // 授予权限
      grantPermission(permissionId: string, grantedBy: string) {
        const permission = this.getPermissionById(permissionId);
        if (permission && !permission.isGranted) {
          permission.isGranted = true;
          permission.grantedAt = Date.now();
          permission.grantedBy = grantedBy;
        }
      },

      // 撤销权限
      revokePermission(permissionId: string) {
        const permission = this.getPermissionById(permissionId);
        if (permission?.isRevocable) {
          permission.isGranted = false;
          delete permission.grantedAt;
          delete permission.grantedBy;
        }
      },

      // 使用权限
      usePermission(permissionId: string, userId: string) {
        const permission = this.getPermissionById(permissionId);
        if (permission?.isGranted) {
          permission.usageCount++;
          permission.lastUsed = Date.now();

          // 记录权限使用
          this.usageRecords.push({
            permissionId,
            timestamp: Date.now(),
            userId,
            success: true,
          });

          return true;
        }

        // 记录失败的权限使用
        this.usageRecords.push({
          permissionId,
          timestamp: Date.now(),
          userId,
          success: false,
        });

        return false;
      },

      // 检查权限是否可用
      checkPermission(permissionId: string) {
        const permission = this.getPermissionById(permissionId);
        return permission ? permission.isGranted : false;
      },

      // 添加新权限
      addPermission(
        permissionData: Omit<
          OperationPermission,
          "id" | "usageCount" | "lastUsed"
        >,
      ) {
        const newPermission: OperationPermission = {
          ...permissionData,
          id: `permission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          usageCount: 0,
        };

        this.operationPermissions.push(newPermission);
        return newPermission;
      },
    },

    // 持久化存储
    persist: {
      key: "simulation-operation-permissions",
      storage: localStorage,
    },
  },
);
