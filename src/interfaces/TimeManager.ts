import type { GameTime } from '../types';

// 定义时间管理器接口
export interface ITimeManager {
  // 获取当前游戏时间
  getCurrentTime(): GameTime;

  // 获取总天数
  getTotalDays(): number;

  // 获取总月数
  getTotalMonths(): number;

  // 是否正在运行
  isRunning(): boolean;

  // 开始时间流动
  start(): void;

  // 暂停时间流动
  pause(): void;

  // 重置时间状态
  reset(): void;

  // 加载时间状态
  load(): void;

  // 保存时间状态
  save(): void;

  // 更新时间
  update(deltaTime: number): void;

  // 模拟时间流逝
  simulateTimePassage(days: number): void;

  // 触发时间更新事件
  triggerTimeUpdateEvent(): void;

  // 格式化时间为字符串
  formatTime(): string;

  // 格式化日期为字符串
  formatDate(): string;
}
