import type {
  SimulationState,
  SimulationTime,
  SimulationConfig,
  SimulationStats,
  SimulationDecision,
  SimulationEvent,
  SimulationHero,
} from '../types/simulation';
import { EventSystem } from '../systems/EventSystem';
import { TimeManager } from '../systems/TimeManager';

// 模拟游戏核心类
export class Simulation {
  private id: string;
  private name: string;
  private state: SimulationState;
  private config: SimulationConfig;
  private stats: SimulationStats;
  private startTime: SimulationTime;
  private endTime: SimulationTime;
  private currentTime: SimulationTime;
  private isRunning = false;
  private isPaused = false;
  private eventSystem: EventSystem;
  private timeManager: TimeManager;
  private decisions: Map<string, SimulationDecision> = new Map();
  private events: Map<string, SimulationEvent> = new Map();
  private heroes: Map<string, SimulationHero> = new Map();
  private createdAt: Date;
  private updatedAt: Date;

  // 构造函数
  constructor(
    id: string,
    name: string,
    config: SimulationConfig = {
      timeScale: 1,
      difficulty: 'normal',
      startingFunds: 10000,
      startingLevel: 1,
      enableRandomEvents: true,
      eventFrequency: 0.5,
    },
  ) {
    this.id = id;
    this.name = name;
    this.config = config;

    // 初始化时间
    this.startTime = {
      year: 2024,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    };

    this.endTime = {
      year: 2025,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
      second: 59,
    };

    this.currentTime = { ...this.startTime };

    // 初始化状态
    this.state = {
      id: id,
      name: name,
      description: '游戏模拟',
      isActive: false,
      isPaused: false,
      currentTime: this.currentTime,
      startTime: this.startTime,
      endTime: this.endTime,
      durationDays: 365,
      config: config,
      stats: {
        totalEvents: 0,
        totalDecisions: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        averageDailyRevenue: 0,
        currentFunds: config.startingFunds,
        currentLevel: config.startingLevel,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 初始化统计数据
    this.stats = {
      ...this.state.stats,
    };

    // 初始化系统
    this.eventSystem = new EventSystem();
    this.timeManager = new TimeManager();

    // 初始化时间管理器
    this.timeManager.init();

    // 初始化事件系统
    this.eventSystem.init(this.state);

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 开始模拟
  public start(): void {
    this.isRunning = true;
    this.isPaused = false;
    this.state.isActive = true;
    this.state.isPaused = false;
  }

  // 暂停模拟
  public pause(): void {
    this.isPaused = true;
    this.state.isPaused = true;
  }

  // 恢复模拟
  public resume(): void {
    this.isPaused = false;
    this.state.isPaused = false;
  }

  // 停止模拟
  public stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    this.state.isActive = false;
    this.state.isPaused = false;
  }

  // 设置时间流速
  public setTimeScale(scale: number): void {
    this.config.timeScale = scale;
    this.state.config.timeScale = scale;
  }

  // 获取当前时间流速
  public getTimeScale(): number {
    return this.config.timeScale;
  }

  // 获取当前状态
  public getState(): SimulationState {
    return { ...this.state };
  }

  // 获取当前时间
  public getCurrentTime(): SimulationTime {
    return { ...this.currentTime };
  }

  // 获取模拟统计数据
  public getStats(): SimulationStats {
    return { ...this.stats };
  }

  // 添加决策
  public addDecision(decision: SimulationDecision): void {
    this.decisions.set(decision.id, decision);
    this.state.stats.totalDecisions++;
    this.stats.totalDecisions++;
  }

  // 获取决策
  public getDecision(decisionId: string): SimulationDecision | undefined {
    return this.decisions.get(decisionId);
  }

  // 移除决策
  public removeDecision(decisionId: string): void {
    this.decisions.delete(decisionId);
  }

  // 获取所有决策
  public getAllDecisions(): SimulationDecision[] {
    return Array.from(this.decisions.values());
  }

  // 添加事件
  public addEvent(event: SimulationEvent): void {
    this.events.set(event.id, event);
    this.state.stats.totalEvents++;
    this.stats.totalEvents++;
  }

  // 获取事件
  public getEvent(eventId: string): SimulationEvent | undefined {
    return this.events.get(eventId);
  }

  // 移除事件
  public removeEvent(eventId: string): void {
    this.events.delete(eventId);
  }

  // 获取所有事件
  public getAllEvents(): SimulationEvent[] {
    return Array.from(this.events.values());
  }

  // 添加英雄
  public addHero(hero: SimulationHero): void {
    this.heroes.set(hero.id, hero);
  }

  // 获取英雄
  public getHero(heroId: string): SimulationHero | undefined {
    return this.heroes.get(heroId);
  }

  // 移除英雄
  public removeHero(heroId: string): void {
    this.heroes.delete(heroId);
  }

  // 获取所有英雄
  public getAllHeroes(): SimulationHero[] {
    return Array.from(this.heroes.values());
  }

  // 更新模拟
  public update(deltaTime: number): void {
    if (!this.isRunning || this.isPaused) return;

    // 更新事件系统
    this.eventSystem.update(deltaTime);

    // 更新统计数据
    this.updateStats();

    // 更新时间戳
    this.updatedAt = new Date();
    this.state.updatedAt = this.updatedAt;
  }

  // 更新统计数据
  private updateStats(): void {
    // 计算总收入、总支出、净利润等统计数据
    // 这里可以根据实际游戏逻辑进行更新

    // 计算平均每日收入
    const daysElapsed = this.calculateDaysElapsed();
    if (daysElapsed > 0) {
      this.stats.averageDailyRevenue = Math.floor(
        this.stats.totalRevenue / daysElapsed,
      );
    }

    // 更新状态中的统计数据
    this.state.stats = { ...this.stats };
  }

  // 计算已过天数
  private calculateDaysElapsed(): number {
    const start = new Date(
      this.startTime.year,
      this.startTime.month - 1,
      this.startTime.day,
    );
    const current = new Date(
      this.currentTime.year,
      this.currentTime.month - 1,
      this.currentTime.day,
    );

    const diffTime = Math.abs(current.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 执行决策
  public executeDecision(decisionId: string, optionId: string): boolean {
    const decision = this.decisions.get(decisionId);
    if (!decision) return false;

    const option = decision.options.find((opt) => opt.id === optionId);
    if (!option) return false;

    // 执行决策的逻辑
    // 这里可以根据决策选项的效果更新游戏状态

    // 移除已执行的决策
    this.decisions.delete(decisionId);

    return true;
  }

  // 获取模拟进度百分比
  public getProgress(): number {
    const totalDays = this.calculateTotalDays();
    const daysElapsed = this.calculateDaysElapsed();

    if (totalDays === 0) return 0;
    return Math.min(100, Math.floor((daysElapsed / totalDays) * 100));
  }

  // 计算总天数
  private calculateTotalDays(): number {
    const start = new Date(
      this.startTime.year,
      this.startTime.month - 1,
      this.startTime.day,
    );
    const end = new Date(
      this.endTime.year,
      this.endTime.month - 1,
      this.endTime.day,
    );

    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 重置模拟
  public reset(): void {
    // 重置时间
    this.currentTime = { ...this.startTime };
    this.state.currentTime = { ...this.startTime };

    // 重置状态
    this.isRunning = false;
    this.isPaused = false;
    this.state.isActive = false;
    this.state.isPaused = false;

    // 重置统计数据
    this.stats = {
      totalEvents: 0,
      totalDecisions: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      averageDailyRevenue: 0,
      currentFunds: this.config.startingFunds,
      currentLevel: this.config.startingLevel,
    };
    this.state.stats = { ...this.stats };

    // 重置系统
    this.eventSystem.init(this.state);
    this.timeManager.init();

    // 重置集合
    this.decisions.clear();
    this.events.clear();
    this.heroes.clear();

    // 更新时间戳
    this.updatedAt = new Date();
    this.state.updatedAt = this.updatedAt;
  }

  // 获取模拟ID
  public getId(): string {
    return this.id;
  }

  // 获取模拟名称
  public getName(): string {
    return this.name;
  }

  // 设置模拟名称
  public setName(name: string): void {
    this.name = name;
    this.state.name = name;
    this.updatedAt = new Date();
    this.state.updatedAt = this.updatedAt;
  }

  // 获取创建时间
  public getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  // 获取更新时间
  public getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  // 检查模拟是否正在运行
  public isActive(): boolean {
    return this.isRunning;
  }

  // 检查模拟是否已暂停
  public isSimPaused(): boolean {
    return this.isPaused;
  }

  // 获取模拟的完整状态
  public getFullState(): any {
    return {
      id: this.id,
      name: this.name,
      state: this.getState(),
      config: this.config,
      stats: this.getStats(),
      currentTime: this.getCurrentTime(),
      startTime: this.startTime,
      endTime: this.endTime,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      decisions: Array.from(this.decisions.values()),
      events: Array.from(this.events.values()),
      heroes: Array.from(this.heroes.values()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
