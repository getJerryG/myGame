// 定义事件类型
export interface Event {
  id: number;
  name: string;
  description: string;
  type: "technical" | "operation" | "market";
  date: string;
  solution: string;
  impact: {
    status: "resolved" | "positive" | "negative" | "neutral";
    description: string;
  };
}

// 定义筛选条件类型
export interface EventFilters {
  timeRange: string;
  status: string;
}

// 事件日志服务，负责处理事件日志相关的业务逻辑
export class EventLogService {
  // 获取事件类型标签
  static getEventTypeLabel(type: string): string {
    const typeMap = {
      technical: "技术事件",
      operation: "运营事件",
      market: "市场事件",
    };
    return typeMap[type as keyof typeof typeMap] || "未知事件";
  }

  // 获取所有事件
  static getEvents(): Event[] {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return [
      {
        id: 1,
        name: "服务器卡顿问题",
        description: "部分玩家反映游戏服务器卡顿，影响游戏体验",
        type: "technical",
        date: "2024/3/10",
        solution: "紧急扩容服务器，优化网络连接",
        impact: {
          status: "resolved",
          description: "服务器恢复正常，玩家满意度提升",
        },
      },
      {
        id: 2,
        name: "新英雄上线热度爆发",
        description: "新英雄李白上线后，游戏热度大幅提升，超出预期",
        type: "operation",
        date: "2024/3/15",
        solution: "增加服务器资源，确保游戏稳定运行",
        impact: {
          status: "positive",
          description: "游戏热度+30，新增用户5000",
        },
      },
      {
        id: 3,
        name: "竞争对手发布新游戏",
        description: "主要竞争对手发布了一款新的MOBA游戏，可能影响我们的市场份额",
        type: "market",
        date: "2024/3/20",
        solution: "推出新活动和皮肤，增强玩家粘性",
        impact: {
          status: "neutral",
          description: "市场份额保持稳定，玩家流失率在可控范围内",
        },
      },
      {
        id: 4,
        name: "支付系统故障",
        description: "部分玩家无法正常进行支付，影响收入",
        type: "technical",
        date: "2024/3/25",
        solution: "修复支付系统漏洞，恢复支付功能",
        impact: {
          status: "resolved",
          description: "支付功能恢复正常，补偿受影响玩家",
        },
      },
      {
        id: 5,
        name: "玩家大规模投诉",
        description: "由于版本更新问题，导致大量玩家投诉",
        type: "operation",
        date: "2024/3/30",
        solution: "发布道歉公告，发放补偿奖励",
        impact: {
          status: "negative",
          description: "口碑-10，需加强版本测试",
        },
      },
    ];
  }

  // 获取标签页选项
  static getTabs() {
    return [
      { label: "全部事件", value: "all" },
      { label: "技术事件", value: "technical" },
      { label: "运营事件", value: "operation" },
      { label: "市场事件", value: "market" },
    ];
  }

  // 获取时间范围选项
  static getTimeRanges() {
    return [
      { label: "全部时间", value: "all" },
      { label: "最近7天", value: "7days" },
      { label: "最近30天", value: "30days" },
      { label: "最近90天", value: "90days" },
    ];
  }

  // 获取事件状态选项
  static getEventStatuses() {
    return [
      { label: "全部状态", value: "all" },
      { label: "已解决", value: "resolved" },
      { label: "正面影响", value: "positive" },
      { label: "负面影响", value: "negative" },
      { label: "中性", value: "neutral" },
    ];
  }

  // 获取默认筛选条件
  static getDefaultFilters(): EventFilters {
    return {
      timeRange: "all",
      status: "all",
    };
  }

  // 筛选事件
  static filterEvents(events: Event[], activeTab: string, filters: EventFilters): Event[] {
    let filteredEvents = [...events];

    // 根据标签页筛选事件类型
    if (activeTab !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.type === activeTab
      );
    }

    // 应用筛选条件
    if (filters.status !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.impact.status === filters.status
      );
    }

    return filteredEvents;
  }

  // 重置筛选条件
  static resetFilters(): EventFilters {
    return this.getDefaultFilters();
  }
}
