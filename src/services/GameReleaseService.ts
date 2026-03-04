// 定义游戏发布服务相关类型
interface ReleaseContentItem {
  id: string;
  type: string;
  name: string;
}

interface ReleaseFeedback {
  positiveRate: number;
  bugReports: number;
  suggestions: number;
}

interface VersionHistoryItem {
  id: string;
  version: string;
  releaseDate: string;
  status: string;
  content: ReleaseContentItem[];
  feedback: ReleaseFeedback;
}

interface PendingContentItem {
  id: string;
  type: string;
  name: string;
  status: string;
  createdDate: string;
  releaseChannel: string;
}

// 定义游戏发布服务类
export class GameReleaseService {
  // 获取项目类型标签
  public getItemTypeLabel(type: string): string {
    const typeLabels: Record<string, string> = {
      hero: "英雄",
      skin: "皮肤",
      activity: "活动",
      event: "事件",
    };
    return typeLabels[type] || "未知类型";
  }

  // 获取待发布内容
  public getPendingContent(): PendingContentItem[] {
    // 这里可以添加实际的API调用，获取待发布内容
    // 现在返回模拟数据
    return [
      {
        id: "1",
        type: "hero",
        name: "新英雄 - 曙光战士",
        status: "待审核",
        createdDate: "2024-01-15",
        releaseChannel: "experience",
      },
      {
        id: "2",
        type: "skin",
        name: "曙光战士 - 星辰之铠",
        status: "已审核",
        createdDate: "2024-01-14",
        releaseChannel: "official",
      },
      {
        id: "3",
        type: "activity",
        name: "春节活动 - 龙年庆典",
        status: "待审核",
        createdDate: "2024-01-13",
        releaseChannel: "official",
      },
    ];
  }

  // 获取版本历史
  public getVersionHistory(): VersionHistoryItem[] {
    // 这里可以添加实际的API调用，获取版本历史
    // 现在返回模拟数据
    return [
      {
        id: "1",
        version: "1.0.0",
        releaseDate: "2024-01-10",
        status: "已发布",
        content: [
          { id: "1", type: "hero", name: "初始英雄 - 勇者" },
          { id: "2", type: "skin", name: "勇者 - 初始皮肤" },
        ],
        feedback: {
          positiveRate: 85,
          bugReports: 12,
          suggestions: 25,
        },
      },
      {
        id: "2",
        version: "1.1.0",
        releaseDate: "2024-01-12",
        status: "已发布",
        content: [
          { id: "3", type: "hero", name: "法师 - 元素使者" },
          { id: "4", type: "activity", name: "新手引导优化" },
        ],
        feedback: {
          positiveRate: 90,
          bugReports: 8,
          suggestions: 18,
        },
      },
    ];
  }

  // 确认发布
  public async confirmRelease(
    _content: PendingContentItem[],
  ): Promise<boolean> {
    // 这里可以添加实际的发布逻辑
    // 模拟发布操作
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
}

// 创建并导出游戏发布服务实例
export const gameReleaseService = new GameReleaseService();
