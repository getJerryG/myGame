import type { BusinessData } from "../types";

// 定义业务数据服务接口
export interface IBusinessDataService {
  // 获取当前业务数据
  getCurrentBusinessData(): BusinessData;

  // 获取历史业务数据
  getHistoricalBusinessData(startDate: number, endDate: number): BusinessData[];

  // 更新业务数据
  updateBusinessData(data: Partial<BusinessData>): void;

  // 记录历史数据
  recordHistoricalData(): void;

  // 重置业务数据
  resetBusinessData(): void;

  // 初始化业务数据
  initializeBusinessData(): void;

  // 计算每小时数据增长
  calculateHourlyGrowth(): void;

  // 更新下载量
  updateDownloads(): void;

  // 更新活跃用户
  updateActiveUsers(): void;

  // 更新收入
  updateRevenue(): void;

  // 生成随机评价和反馈
  generateRandomFeedback(): void;

  // 发布业务数据更新事件
  publishBusinessDataUpdateEvent(): void;

  // 限制历史数据长度
  limitHistoricalDataLength(): void;
}
