import type { BusinessData } from '../types';
import { eventBus } from '../infrastructure/event-bus';

// 定义业务数据服务类
export class BusinessDataService {
  // 当前业务数据
  private currentData: BusinessData;
  // 历史业务数据
  private historicalData: BusinessData[] = [];
  // 初始业务数据配置
  private initialDataConfig = {
    downloads: 0,
    activeUsers: 0,
    revenue: 0,
    marketShare: 5,
    retentionRate: 10,
    averagePlayTime: 5,
    dailyGrowthRate: 0.5,
    rating: 0,
    feedbackCount: 0,
  };

  // 构造函数
  constructor() {
    // 初始化业务数据
    this.currentData = this.initializeBusinessData();
    // 初始化历史数据
    this.historicalData.push({ ...this.currentData });
  }

  // 初始化业务数据
  private initializeBusinessData(): BusinessData {
    return {
      ...this.initialDataConfig,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    };
  }

  // 获取当前业务数据
  getCurrentBusinessData(): BusinessData {
    return { ...this.currentData };
  }

  // 获取历史业务数据
  getHistoricalBusinessData(startDate: number, endDate: number): BusinessData[] {
    return this.historicalData.filter((data) => data.timestamp >= startDate && data.timestamp <= endDate);
  }

  // 更新业务数据
  updateBusinessData(data: Partial<BusinessData>): void {
    this.currentData = {
      ...this.currentData,
      ...data,
      timestamp: Date.now(),
    };

    // 确保数据在合理范围内
    this.ensureDataInRange();

    // 记录历史数据
    this.recordHistoricalData();

    // 发布业务数据更新事件
    this.publishBusinessDataUpdateEvent();
  }

  // 记录历史数据
  private recordHistoricalData(): void {
    this.historicalData.push({ ...this.currentData });
    // 限制历史数据长度，只保留最近30天的数据
    this.limitHistoricalDataLength();
  }

  // 重置业务数据
  resetBusinessData(): void {
    this.currentData = this.initializeBusinessData();
    this.historicalData = [{ ...this.currentData }];
    this.publishBusinessDataUpdateEvent();
  }

  // 计算每小时数据增长
  calculateHourlyGrowth(): void {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // 计算自然增长（基于当前数据和增长率）
    const naturalGrowth = {
      downloads: Math.floor((this.currentData.downloads * (this.currentData.dailyGrowthRate / 24)) / 100),
      activeUsers: Math.floor((this.currentData.activeUsers * (this.currentData.dailyGrowthRate / 24)) / 100),
      revenue: (this.currentData.revenue * (this.currentData.dailyGrowthRate / 24)) / 100,
    };

    // 更新下载量
    this.currentData.downloads += naturalGrowth.downloads;
    // 更新活跃用户
    this.currentData.activeUsers += naturalGrowth.activeUsers;
    // 更新收入
    this.currentData.revenue += naturalGrowth.revenue;

    // 更新时间戳
    this.currentData.timestamp = Date.now();
    this.currentData.hour = currentHour;
    this.currentData.minute = currentMinute;

    // 确保数据在合理范围内
    this.ensureDataInRange();

    // 记录历史数据
    this.recordHistoricalData();

    // 发布业务数据更新事件
    this.publishBusinessDataUpdateEvent();
  }

  // 更新下载量
  updateDownloads(): void {
    // 基于当前下载量和保留率计算新的下载量
    const newDownloads = Math.floor(this.currentData.downloads * (1 + this.currentData.dailyGrowthRate / 24 / 100));
    this.currentData.downloads = newDownloads;
    this.currentData.timestamp = Date.now();
    this.ensureDataInRange();
    this.recordHistoricalData();
    this.publishBusinessDataUpdateEvent();
  }

  // 更新活跃用户
  updateActiveUsers(): void {
    // 基于当前活跃用户和保留率计算新的活跃用户数
    const retentionFactor = this.currentData.retentionRate / 100;
    const newActiveUsers = Math.floor(
      this.currentData.activeUsers * retentionFactor + this.currentData.downloads * 0.1
    );
    this.currentData.activeUsers = newActiveUsers;
    this.currentData.timestamp = Date.now();
    this.ensureDataInRange();
    this.recordHistoricalData();
    this.publishBusinessDataUpdateEvent();
  }

  // 更新收入
  updateRevenue(): void {
    // 基于活跃用户和平均消费计算收入
    const averageSpending = 0.1; // 平均每用户消费
    const newRevenue = this.currentData.revenue + this.currentData.activeUsers * averageSpending * Math.random();
    this.currentData.revenue = newRevenue;
    this.currentData.timestamp = Date.now();
    this.ensureDataInRange();
    this.recordHistoricalData();
    this.publishBusinessDataUpdateEvent();
  }

  // 生成随机评价和反馈
  generateRandomFeedback(): void {
    // 随机生成评价和反馈
    const ratingChange = (Math.random() - 0.5) * 2;
    const feedbackChange = Math.floor(Math.random() * 5);

    this.currentData.rating = Math.max(0, Math.min(10, this.currentData.rating + ratingChange));
    this.currentData.feedbackCount += feedbackChange;

    this.currentData.timestamp = Date.now();
    this.ensureDataInRange();
    this.recordHistoricalData();
    this.publishBusinessDataUpdateEvent();
  }

  // 确保数据在合理范围内
  private ensureDataInRange(): void {
    // 确保下载量为非负
    this.currentData.downloads = Math.max(0, this.currentData.downloads);
    // 确保活跃用户不超过下载量
    this.currentData.activeUsers = Math.min(this.currentData.activeUsers, this.currentData.downloads);
    // 确保好评率为非负
    this.currentData.rating = Math.max(0, this.currentData.rating);
    // 确保收入为非负
    this.currentData.revenue = Math.max(0, this.currentData.revenue);
    // 确保市场份额在0-100之间
    this.currentData.marketShare = Math.max(0, Math.min(100, this.currentData.marketShare));
    // 确保留存率在0-100之间
    this.currentData.retentionRate = Math.max(0, Math.min(100, this.currentData.retentionRate));
    // 确保平均游戏时长为非负
    this.currentData.averagePlayTime = Math.max(0, this.currentData.averagePlayTime);
    // 确保日增长率在0-100之间
    this.currentData.dailyGrowthRate = Math.max(0, Math.min(100, this.currentData.dailyGrowthRate));
    // 确保反馈数为非负
    this.currentData.feedbackCount = Math.max(0, this.currentData.feedbackCount);
  }

  // 发布业务数据更新事件
  private publishBusinessDataUpdateEvent(): void {
    eventBus.emit('businessDataUpdate', this.currentData);
  }

  // 限制历史数据长度，只保留最近30天的数据
  private limitHistoricalDataLength(): void {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    this.historicalData = this.historicalData.filter((data) => data.timestamp >= thirtyDaysAgo);
  }

  // 重置每日数据
  resetDailyData(): void {
    // 这里可以添加每日数据重置逻辑
    this.currentData = {
      ...this.currentData,
      downloads: Math.floor(this.currentData.downloads * 0.95), // 每日下载量衰减
      activeUsers: Math.floor(this.currentData.activeUsers * 0.8), // 每日活跃用户衰减
      timestamp: Date.now(),
    };
    this.ensureDataInRange();
    this.recordHistoricalData();
    this.publishBusinessDataUpdateEvent();
  }

  // 监听新的一天到来，重置每日数据
  private listenForNewDay(): void {
    // 这里可以添加监听新一天到来的逻辑
    // 例如，通过事件总线监听时间管理器的新天事件
    eventBus.on('timeUpdate' as any, () => {
      this.resetDailyData();
    });
  }

  // 初始化服务
  initialize(): void {
    this.listenForNewDay();
  }
}

// 创建并导出业务数据服务实例
export const businessDataService = new BusinessDataService();
