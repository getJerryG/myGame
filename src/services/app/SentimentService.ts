// 定义评论类型
export interface Comment {
  id: number;
  user: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  time: string;
}

// 定义实时舆情统计类型
export interface RealtimeStats {
  positive: number;
  neutral: number;
  negative: number;
}

// 定义满意度分布类型
export interface SatisfactionDistribution {
  verySatisfied: number;
  satisfied: number;
  neutral: number;
  dissatisfied: number;
  veryDissatisfied: number;
}

// 舆情服务，负责处理舆情相关的业务逻辑
export class SentimentService {
  // 获取舆情状态标签映射
  static getSentimentLabel(sentiment: string): string {
    const sentimentMap = {
      positive: "正面",
      neutral: "中性",
      negative: "负面",
    };
    return sentimentMap[sentiment as keyof typeof sentimentMap] || "未知";
  }

  // 获取实时舆情统计
  static getRealtimeStats(): RealtimeStats {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return {
      positive: 75,
      neutral: 15,
      negative: 10,
    };
  }

  // 获取最新评论
  static getLatestComments(): Comment[] {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return [
      {
        id: 1,
        user: "玩家123",
        content: "新英雄李白太好玩了！技能设计得很有创意，手感也很棒",
        sentiment: "positive",
        time: "今天 10:30",
      },
      {
        id: 2,
        user: "游戏爱好者",
        content: "这个版本的平衡做得还不错，各个英雄的出场率都比较均衡",
        sentiment: "neutral",
        time: "今天 09:15",
      },
      {
        id: 3,
        user: "资深玩家",
        content: "最近服务器有点不稳定，经常卡顿，希望能尽快修复",
        sentiment: "negative",
        time: "昨天 22:45",
      },
      {
        id: 4,
        user: "新手玩家",
        content: "游戏的新手引导很友好，让我很快就上手了",
        sentiment: "positive",
        time: "昨天 18:20",
      },
      {
        id: 5,
        user: "竞技玩家",
        content: "排位赛匹配机制还有待优化，经常遇到队友差距很大的情况",
        sentiment: "negative",
        time: "昨天 16:50",
      },
    ];
  }

  // 获取口碑趋势数据
  static getReputationTrend(): number[] {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return [
      65, 68, 70, 72, 75, 73, 76, 78, 80, 79, 82, 85, 83, 86, 88, 90, 89, 92, 94,
      93, 95, 97, 96, 98, 100, 99, 102, 105, 103, 106,
    ];
  }

  // 获取当前口碑
  static getCurrentReputation(): number {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return 106;
  }

  // 获取玩家满意度
  static getSatisfactionScore(): number {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return 85;
  }

  // 获取满意度分布
  static getSatisfactionDistribution(): SatisfactionDistribution {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return {
      verySatisfied: 45,
      satisfied: 30,
      neutral: 15,
      dissatisfied: 8,
      veryDissatisfied: 2,
    };
  }

  // 导出舆情报告
  static exportReport(): void {
    // 这里应该调用API导出报告，目前使用模拟实现
    alert("舆情报告导出成功");
  }
}
