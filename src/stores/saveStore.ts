import { defineStore } from "pinia";
import { useGameStore } from "./gameStore";
import type { Hero, Skin } from "../utils/HeroSkinManager";
import type { Project, GameEvent } from "./gameStore";

// 定义存档数据类型
export interface SaveData {
  currentDate: { year: number; month: number; day: number };
  isPlayerTurn: boolean;
  money: number;
  reputation: number;
  popularity: number;
  wordOfMouth: number;
  totalMoney: number;
  heroCount: number;
  skinCount: number;
  plannerLevel: string;
  plannerSubLevel: string;
  plannerExp: number;
  ongoingProjects: Project[];
  onlineHeroes: Hero[];
  onlineSkins: Skin[];
  activeEvents: GameEvent[];
}

// 定义存档类型
export interface Save {
  id: string;
  date: Date;
  preview: {
    currentDate: { year: number; month: number; day: number };
    money: number;
    plannerLevel: string;
    plannerSubLevel: string;
  };
}

// 定义存档状态类型
interface SaveState {
  saves: Save[];
  currentSaveId: string | null;
  autoSaveInterval: number | null;
}

// 创建并导出存档store
export const useSaveStore = defineStore("save", {
  state: (): SaveState => ({
    saves: [],
    currentSaveId: null,
    autoSaveInterval: null,
  }),

  getters: {
    // 获取所有存档
    getAllSaves: (state) => state.saves,
    // 获取当前存档
    getCurrentSave: (state) => {
      if (!state.currentSaveId) return null;
      return (
        state.saves.find((save) => save.id === state.currentSaveId) || null
      );
    },
  },

  actions: {
    // 初始化存档系统
    initialize() {
      this.loadSavesFromStorage();
      this.startAutoSave();
    },

    // 从本地存储加载存档
    loadSavesFromStorage() {
      const savedSaves = localStorage.getItem("game_saves");
      if (savedSaves) {
        try {
          const parsedSaves = JSON.parse(savedSaves);
          // 将字符串日期转换为Date对象
          this.saves = parsedSaves.map(
            (save: Omit<Save, "date"> & { date: string }) => ({
              ...save,
              date: new Date(save.date),
            }),
          );
        } catch {
          // console.error("Failed to load saves:", error);
          this.saves = [];
        }
      }
    },

    // 将存档保存到本地存储
    saveSavesToStorage() {
      localStorage.setItem("game_saves", JSON.stringify(this.saves));
    },

    // 创建存档
    createSave() {
      const gameStore = useGameStore();
      const saveData = this.serializeGameData(gameStore);
      const saveId = Date.now().toString();

      // 保存游戏数据
      localStorage.setItem(`game_save_${saveId}`, JSON.stringify(saveData));

      // 创建存档预览
      const savePreview = {
        currentDate: { ...gameStore.currentDate },
        money: gameStore.money,
        plannerLevel: gameStore.plannerLevel,
        plannerSubLevel: gameStore.plannerSubLevel,
      };

      // 添加到存档列表
      const newSave = {
        id: saveId,
        date: new Date(),
        preview: savePreview,
      };

      this.saves.push(newSave);
      this.currentSaveId = saveId;

      // 保存存档列表
      this.saveSavesToStorage();

      return saveId;
    },

    // 加载存档
    loadSave(saveId: string) {
      const saveData = localStorage.getItem(`game_save_${saveId}`);
      if (saveData) {
        const gameStore = useGameStore();
        this.deserializeGameData(gameStore, JSON.parse(saveData));
        this.currentSaveId = saveId;
        return true;
      }
      return false;
    },

    // 删除存档
    deleteSave(saveId: string) {
      // 删除游戏数据
      localStorage.removeItem(`game_save_${saveId}`);

      // 从存档列表中移除
      this.saves = this.saves.filter((save) => save.id !== saveId);

      // 如果删除的是当前存档，重置当前存档ID
      if (this.currentSaveId === saveId) {
        this.currentSaveId = null;
      }

      // 保存存档列表
      this.saveSavesToStorage();

      return true;
    },

    // 序列化游戏数据
    serializeGameData(gameStore: ReturnType<typeof useGameStore>): SaveData {
      return {
        currentDate: { ...gameStore.currentDate },
        isPlayerTurn: gameStore.isPlayerTurn,
        money: gameStore.money,
        reputation: gameStore.reputation,
        popularity: gameStore.popularity,
        wordOfMouth: gameStore.wordOfMouth,
        totalMoney: gameStore.totalMoney,
        heroCount: gameStore.heroCount,
        skinCount: gameStore.skinCount,
        plannerLevel: gameStore.plannerLevel,
        plannerSubLevel: gameStore.plannerSubLevel,
        plannerExp: gameStore.plannerExp,
        ongoingProjects: [...gameStore.ongoingProjects],
        onlineHeroes: [...gameStore.onlineHeroes],
        onlineSkins: [...gameStore.onlineSkins],
        activeEvents: [...gameStore.activeEvents],
      };
    },

    // 反序列化游戏数据
    deserializeGameData(
      gameStore: ReturnType<typeof useGameStore>,
      saveData: SaveData,
    ) {
      gameStore.currentDate = { ...saveData.currentDate };
      gameStore.isPlayerTurn = saveData.isPlayerTurn;
      gameStore.money = saveData.money;
      gameStore.reputation = saveData.reputation;
      gameStore.popularity = saveData.popularity;
      gameStore.wordOfMouth = saveData.wordOfMouth;
      gameStore.totalMoney = saveData.totalMoney;
      gameStore.heroCount = saveData.heroCount;
      gameStore.skinCount = saveData.skinCount;
      gameStore.plannerLevel = saveData.plannerLevel;
      gameStore.plannerSubLevel = saveData.plannerSubLevel;
      gameStore.plannerExp = saveData.plannerExp;
      gameStore.ongoingProjects = [...saveData.ongoingProjects];
      gameStore.onlineHeroes = [...saveData.onlineHeroes];
      gameStore.onlineSkins = [...saveData.onlineSkins];
      gameStore.activeEvents = [...saveData.activeEvents];
    },

    // 开始自动存档
    startAutoSave() {
      // 每5分钟自动存档一次
      const interval = 5 * 60 * 1000;
      this.autoSaveInterval = window.setInterval(() => {
        if (this.currentSaveId) {
          this.loadSave(this.currentSaveId); // 确保我们有最新的游戏数据
          this.createSave(); // 创建新存档
        }
      }, interval);
    },

    // 停止自动存档
    stopAutoSave() {
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
      }
    },
  },
});
