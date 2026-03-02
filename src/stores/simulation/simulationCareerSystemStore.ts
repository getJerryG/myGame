import { defineStore } from 'pinia';

// 定义职业系统状态类型
interface CareerSystemState {
  // 职业等级信息
  levelIndex: number;
  subLevelIndex: number;
  exp: number;
  currentLevelExpRequired: number;
  // 职业等级数据
  careerLevels: Array<{
    name: string;
    subLevels: Array<{
      name: string;
      expRequired: number;
    }>;
  }>;
}

// 定义职业提升结果类型
interface CareerPromotionResult {
  promoted: boolean;
  fundsEarned: number;
  message: string;
}

// 创建并导出职业系统store
export const useSimulationCareerSystemStore = defineStore(
  'simulationCareerSystem',
  {
    state: (): CareerSystemState => ({
      // 初始为第0个等级（初级策划）
      levelIndex: 0,
      // 初始为第0个等级的第0个小等级
      subLevelIndex: 0,
      // 初始经验值
      exp: 0,
      // 初始小等级升级经验
      currentLevelExpRequired: 100,
      // 职业等级数据
      careerLevels: [
        {
          name: '初级策划',
          subLevels: [
            { name: 'I', expRequired: 100 },
            { name: 'II', expRequired: 200 },
            { name: 'III', expRequired: 300 },
          ],
        },
        {
          name: '中级策划',
          subLevels: [
            { name: 'I', expRequired: 400 },
            { name: 'II', expRequired: 500 },
            { name: 'III', expRequired: 600 },
          ],
        },
        {
          name: '高级策划',
          subLevels: [
            { name: 'I', expRequired: 800 },
            { name: 'II', expRequired: 1000 },
            { name: 'III', expRequired: 1200 },
          ],
        },
        {
          name: '资深策划',
          subLevels: [
            { name: 'I', expRequired: 1500 },
            { name: 'II', expRequired: 1800 },
            { name: 'III', expRequired: 2100 },
          ],
        },
        {
          name: '首席策划',
          subLevels: [
            { name: 'I', expRequired: 2500 },
            { name: 'II', expRequired: 3000 },
            { name: 'III', expRequired: 3500 },
          ],
        },
      ],
    }),

    getters: {
      // 获取当前职业信息
      getCurrentCareerLevel: (state) => {
        return state.careerLevels[state.levelIndex];
      },

      // 获取当前小等级信息
      getCurrentSubLevel: (state) => {
        return state.careerLevels[state.levelIndex].subLevels[
          state.subLevelIndex
        ];
      },

      // 获取下一级职业信息，如果已经是最高级则返回null
      getNextCareerLevel: (state) => {
        if (state.levelIndex < state.careerLevels.length - 1) {
          return state.careerLevels[state.levelIndex + 1];
        }
        return null;
      },

      // 获取当前职业等级名称
      getCurrentCareerName: (state) => {
        return `${state.careerLevels[state.levelIndex].name} ${state.careerLevels[state.levelIndex].subLevels[state.subLevelIndex].name}`;
      },
    },

    actions: {
      // 添加经验值
      addExp(amount: number): CareerPromotionResult {
        let promoted = false;
        let fundsEarned = 0;
        let message = '';

        // 增加经验值
        this.exp += amount;

        // 检查是否可以升级
        while (this.exp >= this.currentLevelExpRequired) {
          // 减去当前等级所需经验
          this.exp -= this.currentLevelExpRequired;
          promoted = true;

          // 检查是否可以升级到下一个小等级
          if (
            this.subLevelIndex <
            this.careerLevels[this.levelIndex].subLevels.length - 1
          ) {
            // 升级到下一个小等级
            this.subLevelIndex++;
            this.currentLevelExpRequired =
              this.careerLevels[this.levelIndex].subLevels[
                this.subLevelIndex
              ].expRequired;
            fundsEarned += 500; // 小等级升级获得500资金
            message = `职业等级提升：${this.careerLevels[this.levelIndex].name} ${this.careerLevels[this.levelIndex].subLevels[this.subLevelIndex].name}！获得500资金。`;
          } else if (this.levelIndex < this.careerLevels.length - 1) {
            // 升级到下一个等级的第一个小等级
            this.levelIndex++;
            this.subLevelIndex = 0;
            this.currentLevelExpRequired =
              this.careerLevels[this.levelIndex].subLevels[
                this.subLevelIndex
              ].expRequired;
            fundsEarned += 10000; // 等级升级获得10000资金
            message = `职业等级提升：${this.careerLevels[this.levelIndex].name} ${this.careerLevels[this.levelIndex].subLevels[this.subLevelIndex].name}！获得10000资金。`;
          } else {
            // 已经是最高等级，不再继续升级
            this.exp = this.currentLevelExpRequired - 1;
            message = `已达到最高职业等级：${this.careerLevels[this.levelIndex].name} ${this.careerLevels[this.levelIndex].subLevels[this.subLevelIndex].name}！`;
            break;
          }
        }

        return { promoted, fundsEarned, message };
      },

      // 检查是否可以升级
      canPromote(): boolean {
        return this.exp >= this.currentLevelExpRequired;
      },

      // 重置职业系统
      resetCareerSystem() {
        this.levelIndex = 0;
        this.subLevelIndex = 0;
        this.exp = 0;
        this.currentLevelExpRequired =
          this.careerLevels[0].subLevels[0].expRequired;
      },

      // 获取职业提升进度
      getCareerProgress(): number {
        if (this.currentLevelExpRequired === 0) return 0;
        return Math.floor((this.exp / this.currentLevelExpRequired) * 100);
      },
    },

    // 持久化存储
    persist: {
      key: 'simulation-career-system',
      storage: localStorage,
    },
  },
);
