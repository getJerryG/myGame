import type { GameEvent, EventEffect } from '../types';

// 定义事件系统接口
export interface IEventSystem {
  // 获取所有事件
  getAllEvents(): GameEvent[];

  // 生成随机事件
  generateRandomEvent(): GameEvent | null;

  // 处理事件
  handleEvent(event: GameEvent): void;

  // 处理系统事件
  handleSystemEvent(event: GameEvent): void;

  // 处理随机事件
  handleRandomEvent(event: GameEvent): void;

  // 处理用户操作事件
  handleUserActionEvent(event: GameEvent): void;

  // 应用事件效果
  applyEventEffect(event: GameEvent, effect: EventEffect): void;

  // 获取系统事件的处理结果
  getSystemEventResult(event: GameEvent): any;

  // 应用用户操作效果
  applyUserActionResult(event: GameEvent, result: any): void;

  // 更新事件持续时间记录
  updateEventDuration(): void;

  // 记录用户操作
  recordUserAction(action: string, result: any): void;

  // 重置事件系统
  resetEventSystem(): void;

  // 初始化事件系统
  initializeEvents(): void;

  // 更新事件系统
  update(deltaTime: number): void;
}
