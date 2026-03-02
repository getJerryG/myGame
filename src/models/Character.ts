import type {
  PlayerAttributes,
  PlayerStats,
  PlayerCareer,
  CharacterState,
} from "../types/player";
import type { Skill } from "../types/skill";

// 角色状态类型
export type CharacterStatus =
  | "active"
  | "resting"
  | "injured"
  | "dead"
  | "retired";

// 角色类
export class Character {
  private id: string;
  private name: string;
  private level: number;
  private experience: number;
  private nextLevelExperience: number;
  private attributes: PlayerAttributes;
  private stats: PlayerStats;
  private career: PlayerCareer;
  private skills: Map<string, Skill> = new Map();
  private status: CharacterStatus;
  private funds: number;
  private createdAt: Date;
  private updatedAt: Date;

  // 构造函数
  constructor(id: string, name: string, level = 1, experience = 0, funds = 0) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.experience = experience;
    this.nextLevelExperience = this.calculateNextLevelExperience(level);
    this.attributes = {
      strength: 10,
      intelligence: 10,
      agility: 10,
      charisma: 10,
    };
    this.stats = {
      level: level,
      exp: experience,
      nextLevelExp: this.nextLevelExperience,
      funds: funds,
      health: 100,
      maxHealth: 100,
    };
    this.career = {
      title: "初级策划",
      level: 1,
      subLevel: 1,
      titleName: "策划",
      subLevelName: "初级",
    };
    this.status = "active";
    this.funds = funds;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 计算升级所需经验，改为protected以便子类访问
  protected calculateNextLevelExperience(level: number): number {
    // 简单的经验计算公式：100 * level^1.5
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  // 获取角色ID
  public getId(): string {
    return this.id;
  }

  // 获取角色名称
  public getName(): string {
    return this.name;
  }

  // 设置角色名称
  public setName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  // 获取角色等级
  public getLevel(): number {
    return this.level;
  }

  // 获取角色经验
  public getExperience(): number {
    return this.experience;
  }

  // 获取升级所需经验
  public getNextLevelExperience(): number {
    return this.nextLevelExperience;
  }

  // 获取角色属性
  public getAttributes(): PlayerAttributes {
    return { ...this.attributes };
  }

  // 设置角色属性
  public setAttributes(attributes: Partial<PlayerAttributes>): void {
    this.attributes = { ...this.attributes, ...attributes };
    this.updatedAt = new Date();
  }

  // 获取角色状态
  public getStats(): PlayerStats {
    return { ...this.stats };
  }

  // 获取角色职业
  public getCareer(): PlayerCareer {
    return { ...this.career };
  }

  // 设置角色职业
  public setCareer(career: PlayerCareer): void {
    this.career = career;
    this.updatedAt = new Date();
  }

  // 获取角色技能
  public getSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  // 添加技能
  public addSkill(skill: Skill): void {
    this.skills.set(skill.id, skill);
    this.updatedAt = new Date();
  }

  // 移除技能
  public removeSkill(skillId: string): void {
    this.skills.delete(skillId);
    this.updatedAt = new Date();
  }

  // 获取特定技能
  public getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  // 获取角色状态
  public getStatus(): CharacterStatus {
    return this.status;
  }

  // 设置角色状态
  public setStatus(status: CharacterStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  // 获取角色资金
  public getFunds(): number {
    return this.funds;
  }

  // 设置角色资金
  public setFunds(funds: number): void {
    this.funds = funds;
    this.stats.funds = funds;
    this.updatedAt = new Date();
  }

  // 添加资金
  public addFunds(amount: number): void {
    this.funds += amount;
    this.stats.funds = this.funds;
    this.updatedAt = new Date();
  }

  // 减少资金
  public reduceFunds(amount: number): boolean {
    if (this.funds >= amount) {
      this.funds -= amount;
      this.stats.funds = this.funds;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  // 添加经验值
  public addExperience(amount: number): boolean {
    this.experience += amount;
    this.stats.exp = this.experience;
    this.updatedAt = new Date();

    // 检查是否可以升级
    return this.checkLevelUp();
  }

  // 检查升级
  private checkLevelUp(): boolean {
    if (this.experience >= this.nextLevelExperience) {
      // 升级
      this.level++;
      this.experience -= this.nextLevelExperience;
      this.nextLevelExperience = this.calculateNextLevelExperience(this.level);

      // 更新角色属性（每次升级增加2点属性点）
      this.attributes.strength += 1;
      this.attributes.intelligence += 1;

      // 更新角色状态
      this.stats.level = this.level;
      this.stats.exp = this.experience;
      this.stats.nextLevelExp = this.nextLevelExperience;
      this.stats.maxHealth += 10;
      this.stats.health = this.stats.maxHealth;

      return true;
    }
    return false;
  }

  // 获取创建时间
  public getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  // 获取更新时间
  public getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  // 获取角色当前状态
  public getCurrentState(): CharacterState {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      experience: this.experience,
      nextLevelExperience: this.nextLevelExperience,
      attributes: this.attributes,
      stats: this.stats,
      career: this.career,
      skills: this.getSkills(),
      status: this.status,
      funds: this.funds,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // 更新角色
  public update(_deltaTime: number): void {
    // 这里可以添加角色状态更新逻辑
    // 例如：恢复生命值、更新持续效果等
    this.updatedAt = new Date();
  }

  // 检查角色是否存活
  public isAlive(): boolean {
    return this.status !== "dead";
  }

  // 检查角色是否活跃
  public isActive(): boolean {
    return this.status === "active";
  }

  // 重置角色
  public reset(): void {
    this.level = 1;
    this.experience = 0;
    this.nextLevelExperience = this.calculateNextLevelExperience(1);
    this.attributes = {
      strength: 10,
      intelligence: 10,
      agility: 10,
      charisma: 10,
    };
    this.stats = {
      level: 1,
      exp: 0,
      nextLevelExp: this.nextLevelExperience,
      funds: 0,
      health: 100,
      maxHealth: 100,
    };
    this.career = {
      title: "初级策划",
      level: 1,
      subLevel: 1,
      titleName: "策划",
      subLevelName: "初级",
    };
    this.status = "active";
    this.funds = 0;
    this.updatedAt = new Date();
  }
}
