// 定义联动项目类型
export interface Collab {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: "进行中" | "已结束";
  expectedRevenue: number;
  actualRevenue?: number;
}

// 定义创建联动时需要的参数类型
export interface CreateCollabParams {
  name: string;
  description: string;
  expectedRevenue: number;
}

// 联动服务，负责处理联动相关的业务逻辑
export class CollabService {
  // 获取所有联动项目
  static getCollabs(): Collab[] {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return [
      {
        id: "collab-1",
        name: "与知名IP联动活动",
        description: "与某知名动漫IP进行联动，推出限定皮肤和活动",
        startTime: "2024-01-01",
        endTime: "2024-01-31",
        status: "进行中",
        expectedRevenue: 500000,
      },
      {
        id: "collab-2",
        name: "节日主题联动",
        description: "春节主题联动活动，推出限定英雄和皮肤",
        startTime: "2023-12-01",
        endTime: "2024-01-15",
        status: "已结束",
        expectedRevenue: 300000,
        actualRevenue: 350000,
      },
    ];
  }

  // 创建联动项目
  static createCollab(params: CreateCollabParams): Collab {
    const now = new Date();
    const collab: Collab = {
      id: `collab-${Date.now()}`,
      name: params.name,
      description: params.description,
      startTime: now.toISOString().split("T")[0],
      endTime: new Date(now.setMonth(now.getMonth() + 1))
        .toISOString()
        .split("T")[0],
      status: "进行中",
      expectedRevenue: params.expectedRevenue,
    };
    
    // 这里应该保存到API或store，目前直接返回创建的联动
    return collab;
  }

  // 结束联动项目
  static endCollab(collabId: string, collabs: Collab[]): Collab[] {
    // 这里应该调用API或更新store，目前直接修改数组
    return collabs.map(collab => {
      if (collab.id === collabId && collab.status === "进行中") {
        // 模拟实际收益
        const actualRevenue = Math.floor(
          collab.expectedRevenue * (0.8 + Math.random() * 0.4),
        );
        
        return {
          ...collab,
          status: "已结束",
          actualRevenue,
        };
      }
      return collab;
    });
  }

  // 查看联动详情
  static getCollabDetail(collabId: string, collabs: Collab[]): Collab | undefined {
    return collabs.find(collab => collab.id === collabId);
  }

  // 按状态筛选联动项目
  static filterCollabsByStatus(collabs: Collab[], status: string): Collab[] {
    if (status === "ongoing") {
      return collabs.filter(collab => collab.status === "进行中");
    } else if (status === "completed") {
      return collabs.filter(collab => collab.status === "已结束");
    } else {
      return collabs;
    }
  }
}