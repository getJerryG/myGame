import { defineStore } from "pinia";
import type { Hero, Skin } from "../utils/HeroSkinManager";
import {
  getMaxExp,
  checkPromotionRequirements,
  getNextLevelInfo,
  getSubLevelIndex,
} from "../utils/levelUtils";

// 定义项目类型
interface Project {
  id: string;
  name: string;
  type: "hero" | "skin";
  progress: number;
  dailyProgress: number;
  status: "in_progress" | "completed";
  details: Partial<Hero> | Partial<Skin>;
  heroName?: string;
  startDate?: {
    year: number;
    month: number;
    day: number;
  };
}

// 定义事件选项类型
interface EventOption {
  id: string;
  text: string;
  effects: {
    money?: number;
    reputation?: number;
    popularity?: number;
    wordOfMouth?: number;
    exp?: number;
  };
}

// 定义事件类型
interface GameEvent {
  id: string;
  name: string;
  type: string;
  description: string;
  startTime?: number;
  endTime?: number;
  active?: boolean;
  options: EventOption[];
  title?: string;
}

// 定义游戏状态类型
interface GameState {
  // 时间系统
  currentDate: {
    year: number;
    month: number;
    day: number;
  };
  isPlayerTurn: boolean;

  // 核心数值
  money: number;
  reputation: number;
  popularity: number;
  wordOfMouth: number;
  totalMoney: number;

  // 统计
  heroCount: number;
  skinCount: number;

  // 策划等级
  plannerLevel: string;
  plannerSubLevel: string;
  levelInRank: number; // 每个子等级内的等级（1-2）
  plannerExp: number;

  // 进行中的项目
  ongoingProjects: Project[];

  // 已上线内容
  onlineHeroes: Hero[];
  onlineSkins: Skin[];
  activeEvents: GameEvent[];
}

// 导入英雄皮肤管理工具
import {
  getInDevelopmentProjects,
  advanceDevelopment,
} from "../utils/HeroSkinManager";

// 创建并导出游戏store
export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    // 时间系统
    currentDate: { year: 1, month: 1, day: 1 },
    isPlayerTurn: true,

    // 核心数值
    money: 10000,
    reputation: 0,
    popularity: 50,
    wordOfMouth: 100,
    totalMoney: 0,

    // 统计
    heroCount: 0,
    skinCount: 0,

    // 策划等级
    plannerLevel: "见习",
    plannerSubLevel: "III",
    levelInRank: 1,
    plannerExp: 0,

    // 进行中的项目
    ongoingProjects: [],

    // 已上线内容
    onlineHeroes: [],
    onlineSkins: [],
    activeEvents: [],
  }),

  getters: {
    // 计算经验进度百分比
    expProgressPercent: (state) => {
      return Math.floor(
        (state.plannerExp /
          getMaxExp(
            state.plannerLevel,
            state.plannerSubLevel,
            state.levelInRank,
          )) *
          100,
      );
    },

    // 检查是否可以升级
    canPromote: (state) => {
      return checkPromotionRequirements(
        state.plannerLevel,
        state.plannerSubLevel,
        state.levelInRank,
        state.plannerExp,
      );
    },
  },

  actions: {
    // 每日结算
    dailySettlement() {
      // 1. 项目进度自动推进（英雄、皮肤研发等）
      this.updateProjects();

      // 2. 推进研发项目进度（英雄和皮肤研发）
      this.advanceDevelopmentProjects();

      // 3. 活动倒计时更新
      this.updateActivities();

      // 4. 英雄数据更新
      this.updateHeroData();

      // 5. 皮肤销量计算
      this.calculateSkinSales();

      // 6. 计算每日收入和流水
      this.calculateIncome();

      // 7. 更新热度和口碑
      this.updatePopularityAndWordOfMouth();

      // 8. 检查随机事件
      this.checkRandomEvents();

      // 9. 检查升级条件
      this.checkPromotion();

      // 10. 生成数据报表
      this.generateDailyReport();
    },

    // 推进时间
    nextDay() {
      this.currentDate.day++;
      if (this.currentDate.day > 30) {
        this.currentDate.day = 1;
        this.currentDate.month++;
        if (this.currentDate.month > 12) {
          this.currentDate.month = 1;
          this.currentDate.year++;
        }
      }
      this.isPlayerTurn = false;
      this.dailySettlement();
      this.isPlayerTurn = true;
    },

    // 计算收入
    calculateIncome() {
      // 实现收入计算逻辑
      // 根据英雄数量、皮肤数量、热度、口碑等计算每日收入
      const dailyIncome = Math.floor(
        (this.popularity * this.wordOfMouth) / 100 +
          this.heroCount * 100 +
          this.skinCount * 50,
      );
      this.money += dailyIncome;
      this.totalMoney += dailyIncome;
    },

    // 更新项目进度
    updateProjects() {
      // 实现项目进度更新逻辑
      this.ongoingProjects.forEach((project) => {
        project.progress += project.dailyProgress;
        if (project.progress >= 100) {
          project.status = "completed";
          // 项目完成后的处理逻辑
          if (project.type === "hero") {
            this.onlineHeroes.push({
              id: project.id,
              name: project.name,
              ...project.details,
            } as Hero);
            this.heroCount++;
          } else if (project.type === "skin") {
            this.skinCount++;
          }
        }
      });
      // 移除已完成的项目
      this.ongoingProjects = this.ongoingProjects.filter(
        (project) => project.status !== "completed",
      );
    },

    // 检查随机事件
    checkRandomEvents() {
      // 实现随机事件检查逻辑
      const eventChance = 0.3; // 30%的概率触发事件
      if (Math.random() < eventChance) {
        // 这里可以根据事件系统生成随机事件
        this.activeEvents.push({
          id: Date.now().toString(),
          name: "随机事件",
          type: "random",
          title: "随机事件",
          description: "发生了一个随机事件",
          options: [
            { id: "1", text: "选项1", effects: { popularity: 10 } },
            { id: "2", text: "选项2", effects: { reputation: 5 } },
          ],
        });
      }
    },

    // 检查是否可以升级
    checkPromotion() {
      // 实现升级条件检查逻辑
      if (this.canPromote) {
        // 升级逻辑
        const currentMaxExp = getMaxExp(
          this.plannerLevel,
          this.plannerSubLevel,
          this.levelInRank,
        );

        // 扣除升级所需经验值
        this.plannerExp -= currentMaxExp;

        // 获取下一个等级信息
        const { nextLevel, nextSubLevel, nextLevelInRank } = getNextLevelInfo(
          this.plannerLevel,
          this.plannerSubLevel,
          this.levelInRank,
        );

        // 更新等级信息
        this.plannerLevel = nextLevel;
        this.plannerSubLevel = nextSubLevel;
        this.levelInRank = nextLevelInRank;

        // 根据职级提升给予奖励
        this.giveLevelUpReward();
        
        // 保存当前状态，避免无限递归
        const newLevel = this.plannerLevel;
        const newSubLevel = this.plannerSubLevel;
        const newLevelInRank = this.levelInRank;
        const newExp = this.plannerExp;
        
        // 检查是否可以连续升级
        // 使用新的状态值重新计算canPromote，避免基于旧状态的无限递归
        if (checkPromotionRequirements(newLevel, newSubLevel, newLevelInRank, newExp)) {
          this.checkPromotion();
        }
      }
    },

    // 添加进行中的项目
    addProject(project: Omit<Project, "progress" | "status" | "startDate">) {
      this.ongoingProjects.push({
        ...project,
        progress: 0,
        status: "in_progress",
        startDate: { ...this.currentDate },
      });
    },

    // 处理事件
    handleEvent(eventId: string, optionId: string) {
      const eventIndex = this.activeEvents.findIndex(
        (event) => event.id === eventId,
      );
      if (eventIndex !== -1) {
        const event = this.activeEvents[eventIndex];
        const selectedOption = event.options.find(
          (option) => option.id === optionId,
        );
        if (selectedOption) {
          // 应用事件效果
          if (selectedOption.effects.money)
            this.money += selectedOption.effects.money;
          if (selectedOption.effects.reputation)
            this.reputation += selectedOption.effects.reputation;
          if (selectedOption.effects.popularity)
            this.popularity += selectedOption.effects.popularity;
          if (selectedOption.effects.wordOfMouth)
            this.wordOfMouth += selectedOption.effects.wordOfMouth;
          if (selectedOption.effects.exp)
            this.plannerExp += selectedOption.effects.exp;
        }
        // 移除已处理的事件
        this.activeEvents.splice(eventIndex, 1);
      }
    },

    // 添加经验值
    addExp(amount: number) {
      this.plannerExp += amount;
      if (this.canPromote) {
        this.checkPromotion();
      }
    },

    // 给予升级奖励
    giveLevelUpReward() {
      // 根据不同的职级提升给予不同的奖励
      // 奖励可以包括资金、声望、解锁新功能等

      // 基础奖励
      let moneyReward = 0;
      let reputationReward = 0;

      // 根据职级设置奖励
      switch (this.plannerLevel) {
        case "见习":
          moneyReward = 1000;
          reputationReward = 10;
          break;
        case "初级":
          moneyReward = 2000;
          reputationReward = 20;
          break;
        case "中级":
          moneyReward = 4000;
          reputationReward = 40;
          break;
        case "高级":
          moneyReward = 8000;
          reputationReward = 80;
          break;
        case "资深":
          moneyReward = 16000;
          reputationReward = 160;
          break;
        case "专家":
          moneyReward = 32000;
          reputationReward = 320;
          break;
        case "经理":
          moneyReward = 64000;
          reputationReward = 640;
          break;
        case "总监":
          moneyReward = 128000;
          reputationReward = 1280;
          break;
      }

      // 子等级和等级内等级的额外奖励
      const subLevelIndex = getSubLevelIndex(this.plannerSubLevel);
      const extraMoney =
        (2 - subLevelIndex) * 500 + (this.levelInRank - 1) * 200;
      const extraReputation =
        (2 - subLevelIndex) * 5 + (this.levelInRank - 1) * 2;

      // 应用奖励
      this.money += moneyReward + extraMoney;
      this.reputation += reputationReward + extraReputation;

      // 根据职级解锁新功能
      // 例如高级解锁更多英雄类型，专家解锁更多皮肤品质等
      this.unlockFeaturesByLevel();
    },

    // 根据职级解锁新功能
    unlockFeaturesByLevel() {
      // 根据不同的职级解锁不同的功能
      // 这里可以根据PRD中的描述来实现具体的解锁逻辑
      // 例如：
      // - 高级策划：解锁更多英雄类型
      // - 专家策划：解锁史诗皮肤
      // - 经理策划：解锁传说皮肤
      // - 总监策划：解锁更多活动类型
      // 暂时只记录到控制台
      // 后续可以替换为系统通知或日志记录
    },

    // 更新活动倒计时
    updateActivities() {
      // 这里可以根据活动系统的实现来更新活动倒计时
      // 例如减少活动剩余天数，处理活动结束逻辑等
    },

    // 更新英雄数据
    updateHeroData() {
      // 更新英雄的使用率、胜率、Ban率等数据
      this.onlineHeroes.forEach((hero) => {
        // 这里可以根据英雄的使用情况和表现来更新数据
        // 例如随机波动或根据实际使用情况计算

        // 随机更新一些统计数据
        hero.usageRate = Math.max(
          0,
          Math.min(100, hero.usageRate + (Math.random() * 10 - 5)),
        );
        hero.winRate = Math.max(
          30,
          Math.min(70, hero.winRate + (Math.random() * 4 - 2)),
        );
        hero.banRate = Math.max(
          0,
          Math.min(30, hero.banRate + (Math.random() * 5 - 2.5)),
        );
      });
    },

    // 推进研发项目进度
    advanceDevelopmentProjects() {
      // 推进所有正在研发的英雄和皮肤项目
      const projects = getInDevelopmentProjects();

      projects.forEach((project) => {
        advanceDevelopment(project.item.id, project.type === "hero");
      });
    },

    // 计算皮肤销量
    calculateSkinSales() {
      // 根据PRD中描述的皮肤销量公式计算
      // 日销量 = 基础销量 × 品质系数 × 热度系数 × 职级加成
      this.onlineSkins.forEach((skin) => {
        if (!skin.sales) {
          skin.sales = {
            daily: 0,
            total: 0,
          };
        }

        // 基础销量（根据皮肤稀有度设置不同的基础销量）
        const baseSales =
          skin.rarity === "传说"
            ? 1000
            : skin.rarity === "史诗"
              ? 500
              : skin.rarity === "勇气"
                ? 200
                : 50;

        // 品质系数（根据皮肤稀有度设置不同的系数）
        const qualityCoeff =
          skin.rarity === "传说"
            ? 2.0
            : skin.rarity === "史诗"
              ? 1.5
              : skin.rarity === "勇气"
                ? 1.2
                : 1.0;

        // 热度系数（根据游戏热度计算）
        const popularityCoeff = Math.max(0.1, this.popularity / 100);

        // 职级加成（根据策划职级设置不同的加成）
        const levelCoeff =
          this.plannerLevel === "总监"
            ? 1.5
            : this.plannerLevel === "经理"
              ? 1.3
              : this.plannerLevel === "专家"
                ? 1.2
                : this.plannerLevel === "资深"
                  ? 1.1
                  : 1.0;

        // 计算当日销量
        const dailySales = Math.floor(
          baseSales * qualityCoeff * popularityCoeff * levelCoeff,
        );

        // 更新销量数据
        skin.sales.daily = dailySales;
        skin.sales.total += dailySales;

        // 将皮肤销售收入计入总流水和当前资金
        const skinPrice =
          skin.rarity === "传说"
            ? 1688
            : skin.rarity === "史诗"
              ? 888
              : skin.rarity === "勇气"
                ? 288
                : 188;

        const skinRevenue = dailySales * skinPrice;
        this.money += skinRevenue;
        this.totalMoney += skinRevenue;
      });
    },

    // 更新热度和口碑
    updatePopularityAndWordOfMouth() {
      // 根据各种因素更新热度和口碑

      // 基础热度变化（每天自然波动）
      let popularityChange = Math.random() * 4 - 2; // -2 到 +2 之间的随机变化

      // 基础口碑变化（每天自然波动）
      let wordOfMouthChange = Math.random() * 2 - 1; // -1 到 +1 之间的随机变化

      // 英雄数量影响（每10个英雄+1热度）
      popularityChange += this.heroCount / 10;

      // 皮肤数量影响（每20个皮肤+1热度和+1口碑）
      popularityChange += this.skinCount / 20;
      wordOfMouthChange += this.skinCount / 20;

      // 活动影响（这里可以根据实际活动情况调整）
      // 暂时假设每个活动+2热度
      popularityChange += this.activeEvents.length * 2;

      // 应用变化
      this.popularity = Math.max(
        0,
        Math.min(200, this.popularity + popularityChange),
      );
      this.wordOfMouth = Math.max(
        -100,
        Math.min(100, this.wordOfMouth + wordOfMouthChange),
      );
    },

    // 生成每日数据报表
    generateDailyReport() {
      // 生成当日的数据报表
      // 这里可以记录到一个报表系统中
      // 暂时只记录到控制台
      // 后续可以替换为系统报表或日志记录
    },
  },

  // 持久化存储
  persist: {
    key: "game-data",
    storage: localStorage,
  },
});
