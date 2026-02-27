import { defineStore } from 'pinia';

export interface PlayerState {
  id: string;
  name: string;
  level: number;
  experience: number;
  gold: number;
  diamonds: number;
  energy: number;
  maxEnergy: number;
  vipLevel: number;
  lastLoginTime: number;
  createTime: number;
}

export const usePlayerStore = defineStore('player', {
  state: (): PlayerState => ({
    id: 'player_001',
    name: '默认玩家',
    level: 1,
    experience: 0,
    gold: 1000,
    diamonds: 100,
    energy: 100,
    maxEnergy: 100,
    vipLevel: 0,
    lastLoginTime: Date.now(),
    createTime: Date.now(),
  }),

  getters: {
    /**
     * 获取玩家当前等级的经验上限
     */
    levelExperienceCap(): number {
      return this.level * 100;
    },

    /**
     * 检查玩家是否可以升级
     */
    canLevelUp(): boolean {
      return this.experience >= this.levelExperienceCap;
    },

    /**
     * 获取玩家能量恢复百分比
     */
    energyPercentage(): number {
      return Math.round((this.energy / this.maxEnergy) * 100);
    },
  },

  actions: {
    /**
     * 设置玩家信息
     */
    setPlayerInfo(info: Partial<PlayerState>) {
      Object.assign(this, info);
    },

    /**
     * 增加经验值
     */
    addExperience(amount: number) {
      this.experience += amount;
      this.checkLevelUp();
    },

    /**
     * 减少经验值
     */
    reduceExperience(amount: number) {
      this.experience = Math.max(0, this.experience - amount);
    },

    /**
     * 检查并执行升级
     */
    checkLevelUp() {
      while (this.canLevelUp) {
        this.experience -= this.levelExperienceCap;
        this.level++;
        // 升级奖励
        this.gold += this.level * 500;
        this.diamonds += this.level * 10;
      }
    },

    /**
     * 增加金币
     */
    addGold(amount: number) {
      this.gold += amount;
    },

    /**
     * 减少金币
     */
    reduceGold(amount: number): boolean {
      if (this.gold >= amount) {
        this.gold -= amount;
        return true;
      }
      return false;
    },

    /**
     * 增加钻石
     */
    addDiamonds(amount: number) {
      this.diamonds += amount;
    },

    /**
     * 减少钻石
     */
    reduceDiamonds(amount: number): boolean {
      if (this.diamonds >= amount) {
        this.diamonds -= amount;
        return true;
      }
      return false;
    },

    /**
     * 增加能量
     */
    addEnergy(amount: number) {
      this.energy = Math.min(this.maxEnergy, this.energy + amount);
    },

    /**
     * 减少能量
     */
    reduceEnergy(amount: number): boolean {
      if (this.energy >= amount) {
        this.energy -= amount;
        return true;
      }
      return false;
    },

    /**
     * 设置VIP等级
     */
    setVipLevel(level: number) {
      this.vipLevel = Math.max(0, level);
    },

    /**
     * 更新最后登录时间
     */
    updateLastLoginTime() {
      this.lastLoginTime = Date.now();
    },

    /**
     * 重置玩家数据
     */
    resetPlayer() {
      this.$reset();
    },
  },
});
