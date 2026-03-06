// 定义渠道类型
export interface Channel {
  id: string;
  name: string;
  type: "online" | "offline" | "cooperation";
  effect: string;
  cost: number;
  status: "active" | "inactive";
}

// 定义投放力度类型
export type DeliveryIntensity = "light" | "medium" | "heavy";

// 渠道投放服务，负责处理渠道投放相关的业务逻辑
export class ChannelDeliveryService {
  // 获取所有渠道
  static getChannels(): Channel[] {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return [
      {
        id: "1",
        name: "应用商店推广",
        type: "online",
        effect: "medium",
        cost: 1000,
        status: "inactive",
      },
      {
        id: "2",
        name: "社交媒体广告",
        type: "online",
        effect: "medium",
        cost: 800,
        status: "active",
      },
      {
        id: "3",
        name: "KOL 合作",
        type: "online",
        effect: "high",
        cost: 1500,
        status: "inactive",
      },
      {
        id: "4",
        name: "线下展会",
        type: "offline",
        effect: "high",
        cost: 2000,
        status: "inactive",
      },
      {
        id: "5",
        name: "网吧推广",
        type: "offline",
        effect: "low",
        cost: 600,
        status: "inactive",
      },
      {
        id: "6",
        name: "游戏平台联动",
        type: "cooperation",
        effect: "very-high",
        cost: 2500,
        status: "inactive",
      },
      {
        id: "7",
        name: "直播平台合作",
        type: "online",
        effect: "very-high",
        cost: 1800,
        status: "inactive",
      },
      {
        id: "8",
        name: "校园推广",
        type: "offline",
        effect: "low",
        cost: 700,
        status: "inactive",
      },
    ];
  }

  // 按类型筛选渠道
  static filterChannelsByType(channels: Channel[], type: string): Channel[] {
    if (type === "all") {
      return channels;
    }
    return channels.filter((channel) => channel.type === type);
  }

  // 开启渠道投放
  static startDelivery(channels: Channel[], channelId: string): Channel[] {
    return channels.map(channel => {
      if (channel.id === channelId) {
        return {
          ...channel,
          status: "active",
        };
      }
      return channel;
    });
  }

  // 停止渠道投放
  static stopDelivery(channels: Channel[], channelId: string): Channel[] {
    return channels.map(channel => {
      if (channel.id === channelId) {
        return {
          ...channel,
          status: "inactive",
        };
      }
      return channel;
    });
  }

  // 确认投放力度
  static confirmIntensity(channels: Channel[], channelId: string, _intensity: DeliveryIntensity): Channel[] {
    // 这里可以根据投放力度调整渠道的效果和成本
    // 目前简化处理，只更新状态
    return this.startDelivery(channels, channelId);
  }

  // 生成投放报告
  static generateReport(): void {
    // 这里应该调用API生成报告，目前使用模拟实现
    alert("投放报告已生成，可在数据中心查看详细数据");
  }
}
