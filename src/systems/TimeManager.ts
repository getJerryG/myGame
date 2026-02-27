// 游戏时间接口定义
export interface GameDate {
  year: number;
  month: number;
  day: number;
}

// 时间阶段类型
export type TimePhase = 'new_day' | 'auto_settlement' | 'player_operation' | 'waiting_next_day';

// 时间管理系统类
export class TimeManager {
  private currentDate: GameDate;
  private startTime: GameDate;
  private isPlayerTurn: boolean;
  private currentPhase: TimePhase;
  private timeUpdateCallback: ((date: GameDate, phase: TimePhase) => void) | null = null;

  // 构造函数
  constructor() {
    // 初始化默认时间（根据PRD第1年1月1日00:00开启）
    this.currentDate = {
      year: 1,
      month: 1,
      day: 1
    };

    this.startTime = { ...this.currentDate };
    this.isPlayerTurn = true;
    this.currentPhase = 'player_operation';
  }

  // 初始化时间管理器
  public init() {
    this.currentDate = { ...this.startTime };
    this.isPlayerTurn = true;
    this.currentPhase = 'player_operation';
    this.notifyTimeUpdate();
  }

  // 设置时间更新回调
  public setTimeUpdateCallback(callback: (date: GameDate, phase: TimePhase) => void): void {
    this.timeUpdateCallback = callback;
  }

  // 获取当前时间
  public getCurrentDate(): GameDate {
    return { ...this.currentDate };
  }

  // 获取当前是否是玩家回合
  public getIsPlayerTurn(): boolean {
    return this.isPlayerTurn;
  }

  // 获取当前时间阶段
  public getCurrentPhase(): TimePhase {
    return this.currentPhase;
  }

  // 获取开始时间
  public getStartTime(): GameDate {
    return { ...this.startTime };
  }

  // 推进到下一天
  public nextDay(): void {
    // 执行4个阶段的时间流程
    
    // 1. 新一天00:00开始
    this.currentPhase = 'new_day';
    this.notifyTimeUpdate();
    
    // 2. 自动运行至24:00（系统自动结算）
    this.currentPhase = 'auto_settlement';
    this.notifyTimeUpdate();
    
    // 3. 推进日期
    this.advanceDate();
    
    // 4. 玩家操作阶段
    this.currentPhase = 'player_operation';
    this.isPlayerTurn = true;
    this.notifyTimeUpdate();
  }

  // 手动结束当天，进入下一天
  public endCurrentDay(): void {
    this.currentPhase = 'waiting_next_day';
    this.isPlayerTurn = false;
    this.notifyTimeUpdate();
    
    // 调用nextDay完成时间推进
    this.nextDay();
  }

  // 推进日期
  private advanceDate(): void {
    this.currentDate.day++;
    
    // 每月固定30天（根据PRD）
    if (this.currentDate.day > 30) {
      this.currentDate.day = 1;
      this.currentDate.month++;
      
      if (this.currentDate.month > 12) {
        this.currentDate.month = 1;
        this.currentDate.year++;
      }
    }
  }

  // 通知时间更新
  private notifyTimeUpdate(): void {
    if (this.timeUpdateCallback) {
      this.timeUpdateCallback(this.currentDate, this.currentPhase);
    }
  }

  // 格式化日期为字符串
  public formatDate(date: GameDate): string {
    return `${date.year}年${date.month}月${date.day}日`;
  }

  // 获取当前日期的字符串表示
  public getCurrentDateString(): string {
    return this.formatDate(this.currentDate);
  }

  // 重置时间
  public reset(): void {
    this.currentDate = { ...this.startTime };
    this.isPlayerTurn = true;
    this.currentPhase = 'player_operation';
    this.notifyTimeUpdate();
  }
}

// 导出时间管理器实例
const timeManager = new TimeManager();
export default timeManager;
