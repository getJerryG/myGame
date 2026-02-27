import { defineStore } from 'pinia';
import type { Hero, Skin } from '../utils/HeroSkinManager';
import {
  getHeroesFromStorage,
  getSkinsFromStorage,
  saveHeroesToStorage,
  saveSkinsToStorage,
} from '../utils/HeroSkinManager';

// 定义英雄皮肤状态类型
interface HeroSkinState {
  // 英雄列表
  heroes: Hero[];
  // 皮肤列表
  skins: Skin[];
  // 加载状态
  loading: boolean;
  // 错误信息
  error: string | null;
}

// 创建并导出英雄皮肤store
export const useHeroSkinStore = defineStore('heroSkin', {
  state: (): HeroSkinState => ({
    // 英雄列表
    heroes: [],
    // 皮肤列表
    skins: [],
    // 加载状态
    loading: false,
    // 错误信息
    error: null,
  }),

  getters: {
    // 获取所有英雄
    getAllHeroes: (state) => state.heroes,

    // 获取所有皮肤
    getAllSkins: (state) => state.skins,

    // 根据英雄ID获取英雄
    getHeroById: (state) => (id: string) => {
      return state.heroes.find((hero) => hero.id === id);
    },

    // 根据英雄名称获取英雄
    getHeroByName: (state) => (name: string) => {
      return state.heroes.find((hero) => hero.name === name);
    },

    // 根据皮肤ID获取皮肤
    getSkinById: (state) => (id: string) => {
      return state.skins.find((skin) => skin.id === id);
    },

    // 根据英雄ID获取该英雄的所有皮肤
    getSkinsByHeroId: (state) => (heroId: string) => {
      const hero = state.heroes.find((h) => h.id === heroId);
      if (hero) {
        return state.skins.filter((skin) => skin.heroName === hero.name);
      }
      return [];
    },

    // 根据英雄名称获取该英雄的所有皮肤
    getSkinsByHeroName: (state) => (heroName: string) => {
      return state.skins.filter((skin) => skin.heroName === heroName);
    },

    // 获取皮肤的所属英雄
    getSkinHero: (state) => (skin: Skin) => {
      return state.heroes.find((hero) => hero.name === skin.heroName);
    },

    // 获取皮肤数量
    getSkinCount: (state) => state.skins.length,

    // 获取英雄数量
    getHeroCount: (state) => state.heroes.length,
  },

  actions: {
    // 初始化数据
    async initializeData() {
      this.loading = true;
      this.error = null;

      try {
        // 从本地存储加载数据
        await this.loadDataFromStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '加载数据失败';
        console.error('加载英雄皮肤数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 从本地存储加载数据
    async loadDataFromStorage() {
      try {
        // 从本地存储获取数据
        const heroes = getHeroesFromStorage();
        const skins = getSkinsFromStorage();

        // 更新状态
        this.heroes = heroes;
        this.skins = skins;
      } catch (error) {
        throw new Error('从本地存储加载数据失败');
      }
    },

    // 保存数据到本地存储
    async saveDataToStorage() {
      try {
        // 保存到本地存储
        saveHeroesToStorage(this.heroes);
        saveSkinsToStorage(this.skins);
      } catch (error) {
        throw new Error('保存数据到本地存储失败');
      }
    },

    // 添加英雄
    async addHero(hero: Hero) {
      try {
        // 添加到英雄列表
        this.heroes.push(hero);

        // 保存到本地存储
        await this.saveDataToStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '添加英雄失败';
        // 回滚操作
        this.heroes.pop();
        throw error;
      }
    },

    // 更新英雄
    async updateHero(updatedHero: Hero) {
      try {
        // 查找英雄索引
        const index = this.heroes.findIndex((hero) => hero.id === updatedHero.id);
        if (index === -1) {
          throw new Error('英雄不存在');
        }

        // 更新英雄
        this.heroes[index] = updatedHero;

        // 保存到本地存储
        await this.saveDataToStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新英雄失败';
        throw error;
      }
    },

    // 删除英雄及其所有皮肤
    async deleteHero(heroId: string) {
      try {
        // 查找英雄
        const hero = this.getHeroById(heroId);
        if (!hero) {
          throw new Error('英雄不存在');
        }

        // 删除英雄
        this.heroes = this.heroes.filter((h) => h.id !== heroId);

        // 删除该英雄的所有皮肤
        this.skins = this.skins.filter((skin) => skin.heroName !== hero.name);

        // 保存到本地存储
        await this.saveDataToStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除英雄失败';
        throw error;
      }
    },

    // 添加皮肤
    async addSkin(skin: Skin) {
      try {
        // 添加到皮肤列表
        this.skins.push(skin);

        // 保存到本地存储
        await this.saveDataToStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '添加皮肤失败';
        // 回滚操作
        this.skins.pop();
        throw error;
      }
    },

    // 更新皮肤
    async updateSkin(updatedSkin: Skin) {
      try {
        // 查找皮肤索引
        const index = this.skins.findIndex((skin) => skin.id === updatedSkin.id);
        if (index === -1) {
          throw new Error('皮肤不存在');
        }

        // 更新皮肤
        this.skins[index] = updatedSkin;

        // 保存到本地存储
        await this.saveDataToStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新皮肤失败';
        throw error;
      }
    },

    // 更新皮肤的市场表现模拟数据
    async updateSkinMarketData(skinId: string, marketData: any) {
      try {
        // 查找皮肤
        const skin = this.getSkinById(skinId);
        if (!skin) {
          throw new Error('皮肤不存在');
        }

        // 更新皮肤的市场表现模拟数据
        skin.marketSimulation = marketData;

        // 保存到本地存储
        await this.saveDataToStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新皮肤市场数据失败';
        throw error;
      }
    },

    // 删除皮肤
    async deleteSkin(skinId: string) {
      try {
        // 删除皮肤
        this.skins = this.skins.filter((skin) => skin.id !== skinId);

        // 保存到本地存储
        await this.saveDataToStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除皮肤失败';
        throw error;
      }
    },

    // 批量删除皮肤
    async deleteSkins(skinIds: string[]) {
      try {
        // 删除皮肤
        this.skins = this.skins.filter((skin) => !skinIds.includes(skin.id));

        // 保存到本地存储
        await this.saveDataToStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '批量删除皮肤失败';
        throw error;
      }
    },

    // 清除所有数据
    async clearAllData() {
      try {
        // 清除数据
        this.heroes = [];
        this.skins = [];

        // 保存到本地存储
        await this.saveDataToStorage();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '清除数据失败';
        throw error;
      }
    },

    // 验证英雄是否存在
    isHeroExists(heroName: string): boolean {
      return this.heroes.some((hero) => hero.name === heroName);
    },

    // 验证皮肤是否存在
    isSkinExists(skinId: string): boolean {
      return this.skins.some((skin) => skin.id === skinId);
    },
  },

  // 持久化存储
  persist: {
    key: 'hero-skin-data',
    storage: localStorage,
  },
});
