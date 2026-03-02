import type { GameReleaseData, GameReleaseResult } from "../types";

// 定义游戏发布服务类
export class GameReleaseService {
  // 获取游戏发布的内部类型
  private getInternalReleaseTypes(): Array<{
    id: string;
    name: string;
    description: string;
  }> {
    return [
      {
        id: "major",
        name: "大版本更新",
        description: "包含重大功能和内容更新",
      },
      {
        id: "minor",
        name: "小版本更新",
        description: "包含bug修复和小功能改进",
      },
      { id: "hotfix", name: "热修复", description: "紧急修复重大问题" },
      {
        id: "content",
        name: "内容更新",
        description: "仅包含新内容，无核心功能变更",
      },
    ];
  }

  // 获取本地化的内部类型
  // 注释掉未使用的方法
  // private getLocalizedReleaseTypes(): { id: string; name: string; description: string }[] {
  //   return this.getInternalReleaseTypes();
  // }

  // 获取待发布的内部列表
  public async getPendingReleases(): Promise<GameReleaseData[]> {
    // 这里可以添加实际的API调用，获取待发布的游戏版本
    // 现在返回模拟数据
    return [
      {
        id: "1",
        name: "曙光英雄",
        version: "1.0.0",
        status: "pending",
        createdAt: Date.now() - 86400000 * 3, // 3天前
        plannedReleaseDate: Date.now() + 86400000,
        type: "major",
        description: "游戏正式上线版本",
      },
      {
        id: "2",
        name: "百年之约",
        version: "2.0.0",
        status: "pending",
        createdAt: Date.now() - 86400000 * 5,
        plannedReleaseDate: Date.now() + 86400000 * 2,
        type: "major",
        description: "周年庆典版本",
      },
      {
        id: "3",
        name: "新英雄联盟",
        version: "1.1.0",
        status: "pending",
        createdAt: Date.now() - 86400000 * 2,
        plannedReleaseDate: Date.now() + 86400000 * 3,
        type: "major",
        description: "全新英雄和地图更新",
      },
    ];
  }

  // 获取游戏数据
  public async getGameData(gameId: string): Promise<GameReleaseData> {
    // 这里可以添加实际的API调用，获取游戏数据
    // 现在返回模拟数据
    return {
      id: gameId,
      name: "游戏名称",
      version: "1.0.0",
      status: "active",
      createdAt: Date.now() - 86400000 * 30,
      type: "major",
      description: "游戏数据",
    };
  }

  // 执行游戏发布操作
  public async releaseGame(
    _releaseData: GameReleaseData,
  ): Promise<GameReleaseResult> {
    // 这里可以添加实际的发布逻辑
    // 模拟发布操作
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 模拟发布结果
    return {
      success: true,
      message: "游戏发布成功",
      releaseId: `release-${Date.now()}`,
      timestamp: Date.now(),
      details: {
        downloaded: 500,
        activeUsers: 200,
        revenue: 0,
      },
    };
  }

  // 获取版本历史
  public async getVersionHistory(_gameId: string): Promise<GameReleaseData[]> {
    // 这里可以添加实际的API调用，获取版本历史
    // 现在返回模拟数据
    return [
      {
        id: "1",
        name: "游戏名称",
        version: "1.0.0",
        releaseDate: Date.now() - 86400000 * 30,
        type: "major",
        description: "游戏正式上线",
        status: "released",
        createdAt: Date.now() - 86400000 * 30,
      },
      {
        id: "2",
        name: "游戏名称",
        version: "1.0.1",
        releaseDate: Date.now() - 86400000 * 25,
        type: "hotfix",
        description: "修复登录问题",
        status: "released",
        createdAt: Date.now() - 86400000 * 25,
      },
      {
        id: "3",
        name: "游戏名称",
        version: "1.1.0",
        releaseDate: Date.now() - 86400000 * 20,
        type: "minor",
        description: "添加新英雄",
        status: "released",
        createdAt: Date.now() - 86400000 * 20,
      },
    ];
  }

  // 检查游戏发布类型是否有效
  public validateReleaseType(type: string): boolean {
    const validTypes = this.getInternalReleaseTypes().map((t) => t.id);
    return validTypes.includes(type);
  }

  // 生成发布日志
  public generateReleaseNotes(releaseData: GameReleaseData): string {
    return `# ${releaseData.name} ${releaseData.version} 发布日志\n\n## 发布类型\n${this.getInternalReleaseTypes().find((t) => t.id === releaseData.type)?.name || "未知类型"}\n\n## 发布时间\n${new Date(releaseData.plannedReleaseDate || Date.now()).toLocaleString()}\n\n## 发布内容\n${releaseData.description || "暂无描述"}`;
  }
}

// 创建并导出游戏发布服务实例
export const gameReleaseService = new GameReleaseService();
