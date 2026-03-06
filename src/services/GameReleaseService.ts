// 定义游戏发布相关类型
export interface ReleaseChannel {
  id: string;
  name: string;
}

export interface Release {
  id: number;
  version: string;
  date: string;
  channels: string[];
  changelog: string;
}

export interface ReleaseConfig {
  version: string;
  changelog: string;
  selectedChannels: string[];
}

export type ReleaseStatus = "idle" | "releasing" | "success" | "failed";

// 定义游戏发布服务类
export class GameReleaseService {
  // 发布渠道数据
  private channels: ReleaseChannel[] = [
    { id: "appstore", name: "App Store" },
    { id: "googleplay", name: "Google Play" },
    { id: "steam", name: "Steam" },
    { id: "epic", name: "Epic Games" },
    { id: "tap", name: "TapTap" },
  ];

  // 发布历史数据（实际应用中应从后端获取）
  private releaseHistory: Release[] = [
    {
      id: 1,
      version: "0.9.0",
      date: "2024-01-15",
      channels: ["App Store", "Google Play"],
      changelog: "Beta版本发布，包含基础游戏功能",
    },
    {
      id: 2,
      version: "0.8.0",
      date: "2024-01-01",
      channels: ["TestFlight"],
      changelog: "Alpha测试版本",
    },
  ];

  // 获取发布渠道
  public getChannels(): ReleaseChannel[] {
    return [...this.channels];
  }

  // 获取发布历史
  public getReleaseHistory(): Release[] {
    return [...this.releaseHistory];
  }

  // 开始发布游戏
  public async startRelease(config: ReleaseConfig): Promise<Release> {
    // 验证发布配置
    if (config.selectedChannels.length === 0) {
      throw new Error("请至少选择一个发布渠道");
    }

    // 模拟发布过程
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 获取选中的渠道名称
    const selectedChannelNames = this.channels
      .filter((c) => config.selectedChannels.includes(c.id))
      .map((c) => c.name);

    // 创建新的发布记录
    const newRelease: Release = {
      id: Date.now(),
      version: config.version,
      date: new Date().toISOString().split("T")[0],
      channels: selectedChannelNames,
      changelog: config.changelog || "无更新说明",
    };

    // 添加到发布历史
    this.releaseHistory.unshift(newRelease);

    return newRelease;
  }

  // 获取状态图标
  public getStatusIcon(status: ReleaseStatus): string {
    const icons: Record<ReleaseStatus, string> = {
      idle: "📦",
      releasing: "🚀",
      success: "✅",
      failed: "❌",
    };
    return icons[status] || "📦";
  }

  // 获取状态文本
  public getStatusText(status: ReleaseStatus): string {
    const texts: Record<ReleaseStatus, string> = {
      idle: "准备发布",
      releasing: "正在发布...",
      success: "发布成功",
      failed: "发布失败",
    };
    return texts[status] || "准备发布";
  }
}

// 创建并导出游戏发布服务实例
export const gameReleaseService: GameReleaseService = new GameReleaseService(); 