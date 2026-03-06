// 定义事件类型
export interface EventType {
  label: string;
  value: string;
}

// 定义事件力度类型
export interface EventIntensity {
  label: string;
  value: string;
}

// 定义事件类型
export interface Event {
  id: number;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  heatBoost: number;
  revenueBoost: number;
}

// 事件服务，负责处理事件相关的业务逻辑
export class EventService {
  // 获取事件类型选项
  static getEventTypes(): EventType[] {
    return [
      { label: "新英雄折扣", value: "hero_discount" },
      { label: "英雄+皮肤礼包", value: "hero_skin_bundle" },
      { label: "排位加成", value: "rank_boost" },
      { label: "充值返还", value: "recharge_bonus" },
      { label: "限定返场", value: "limited_return" },
      { label: "联动主题活动", value: "collab_theme" },
      { label: "炸服补偿", value: "server_crash_compensation" },
    ];
  }

  // 获取事件力度选项
  static getEventIntensities(): EventIntensity[] {
    return [
      { label: "轻度", value: "light" },
      { label: "中度", value: "moderate" },
      { label: "重磅", value: "heavy" },
    ];
  }

  // 根据活动力度获取活动持续天数
  static getEventDuration(intensity: string): number {
    const durationMap: Record<string, number> = {
      light: 3,
      moderate: 5,
      heavy: 7,
    };
    return durationMap[intensity] || 5;
  }

  // 获取所有活动
  static getEvents(): Event[] {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return [
      {
        id: 1,
        name: "新英雄李白折扣活动",
        type: "新英雄折扣",
        status: "进行中",
        startDate: "2024/1/1",
        endDate: "2024/1/7",
        heatBoost: 10,
        revenueBoost: 5,
      },
      {
        id: 2,
        name: "春节限定皮肤返场",
        type: "限定返场",
        status: "已结束",
        startDate: "2024/2/1",
        endDate: "2024/2/15",
        heatBoost: 30,
        revenueBoost: 15,
      },
    ];
  }

  // 创建活动
  static createEvent(_eventData: any): void {
    // 这里应该调用API或更新store，目前使用模拟实现
    alert("活动创建成功");
  }
}
