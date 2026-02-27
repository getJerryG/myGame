import type { PlayerState, PlayerAttributes, PlayerStats, PlayerCareer } from '../types/player';
// 移除未使用的导入

import { Character } from './Character';

// 玩家类
export class Player extends Character {
  private playerState: PlayerState;
  private inventory: Map<string, number> = new Map(); // 物品ID -> 数量
  private achievements: Set<string> = new Set(); // 成就ID集合
  private currentObjective: string | null = null;
  private completedObjectives: Set<string> = new Set();

  // 构造函数
  constructor(id: string, name: string, level = 1, experience = 0, funds = 0) {
    super(id, name, level, experience, funds);
    this.playerState = {
      id: id,
      name: name,
      attributes: {
        strength: 10,
        intelligence: 10,
        agility: 10,
        charisma: 10,
      },
      stats: {
        level: level,
        exp: experience,
        nextLevelExp: this.calculateNextLevelExperience(level),
        funds: funds,
        health: 100,
        maxHealth: 100,
      },
      isAlive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // 移除与父类冲突的私有方法，直接使用父类的方法

  // 获取玩家状态
  public getPlayerState(): PlayerState {
    return {
      ...this.playerState,
      attributes: this.getAttributes(),
      stats: this.getStats(),
      isAlive: this.isAlive(),
    };
  }

  // 更新玩家状态
  public updatePlayerState(state: Partial<PlayerState>): void {
    this.playerState = {
      ...this.playerState,
      ...state,
      updatedAt: new Date(),
    };
  }

  // 获取玩家属性
  public getPlayerAttributes(): PlayerAttributes {
    return this.getAttributes();
  }

  // 设置玩家属性
  public setPlayerAttributes(attributes: Partial<PlayerAttributes>): void {
    this.setAttributes(attributes);
    this.playerState.attributes = this.getAttributes();
    this.playerState.updatedAt = new Date();
  }

  // 获取玩家统计信息
  public getPlayerStats(): PlayerStats {
    return this.getStats();
  }

  // 获取玩家职业
  public getPlayerCareer(): PlayerCareer {
    return this.getCareer();
  }

  // 设置玩家职业
  public setPlayerCareer(career: PlayerCareer): void {
    this.setCareer(career);
    this.playerState.updatedAt = new Date();
  }

  // 添加物品到背包
  public addItem(itemId: string, quantity = 1): void {
    if (this.inventory.has(itemId)) {
      const currentQuantity = this.inventory.get(itemId)!;
      this.inventory.set(itemId, currentQuantity + quantity);
    } else {
      this.inventory.set(itemId, quantity);
    }
  }

  // 从背包移除物品
  public removeItem(itemId: string, quantity = 1): boolean {
    if (this.inventory.has(itemId)) {
      const currentQuantity = this.inventory.get(itemId)!;
      if (currentQuantity >= quantity) {
        const newQuantity = currentQuantity - quantity;
        if (newQuantity <= 0) {
          this.inventory.delete(itemId);
        } else {
          this.inventory.set(itemId, newQuantity);
        }
        return true;
      }
    }
    return false;
  }

  // 获取物品数量
  public getItemQuantity(itemId: string): number {
    return this.inventory.get(itemId) || 0;
  }

  // 获取背包所有物品
  public getInventory(): Map<string, number> {
    return new Map(this.inventory);
  }

  // 检查背包是否有物品
  public hasItem(itemId: string, quantity = 1): boolean {
    return (this.inventory.get(itemId) || 0) >= quantity;
  }

  // 清空背包
  public clearInventory(): void {
    this.inventory.clear();
  }

  // 添加成就
  public addAchievement(achievementId: string): void {
    this.achievements.add(achievementId);
  }

  // 检查是否拥有成就
  public hasAchievement(achievementId: string): boolean {
    return this.achievements.has(achievementId);
  }

  // 获取所有成就
  public getAchievements(): Set<string> {
    return new Set(this.achievements);
  }

  // 设置当前目标
  public setCurrentObjective(objectiveId: string): void {
    this.currentObjective = objectiveId;
  }

  // 获取当前目标
  public getCurrentObjective(): string | null {
    return this.currentObjective;
  }

  // 完成目标
  public completeObjective(objectiveId: string): void {
    this.completedObjectives.add(objectiveId);
    if (this.currentObjective === objectiveId) {
      this.currentObjective = null;
    }
  }

  // 检查目标是否已完成
  public isObjectiveCompleted(objectiveId: string): boolean {
    return this.completedObjectives.has(objectiveId);
  }

  // 获取已完成目标
  public getCompletedObjectives(): Set<string> {
    return new Set(this.completedObjectives);
  }

  // 获取玩家完整状态
  public getFullState(): any {
    return {
      ...super.getCurrentState(),
      playerState: this.getPlayerState(),
      inventory: Object.fromEntries(this.inventory),
      achievements: Array.from(this.achievements),
      currentObjective: this.currentObjective,
      completedObjectives: Array.from(this.completedObjectives),
    };
  }

  // 更新玩家
  public update(deltaTime: number): void {
    super.update(deltaTime);
    // 更新玩家状态
    this.playerState.updatedAt = new Date();
    this.playerState.isAlive = this.isAlive();
    this.playerState.stats = this.getStats();
    this.playerState.attributes = this.getAttributes();
  }

  // 初始化玩家
  public initPlayer(): void {
    // 初始化玩家数据
    this.reset();
    this.inventory.clear();
    this.achievements.clear();
    this.currentObjective = null;
    this.completedObjectives.clear();
  }

  // 获得经验值
  public gainExp(amount: number): boolean {
    return this.addExperience(amount);
  }

  // 获得资金
  public gainFunds(amount: number): void {
    this.addFunds(amount);
  }

  // 消耗资金
  public spendFunds(amount: number): boolean {
    return this.reduceFunds(amount);
  }

  // 获取当前生命值百分比
  public getCurrentHpPercent(): number {
    const stats = this.getStats();
    return Math.min(100, Math.floor((stats.health / stats.maxHealth) * 100));
  }

  // 获取经验进度百分比
  public getExpProgress(): number {
    const stats = this.getStats();
    return Math.min(100, Math.floor((stats.exp / stats.nextLevelExp) * 100));
  }
}
