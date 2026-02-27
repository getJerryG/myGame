import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStore } from '@/stores/gameStore';

// 性能测试常量
const STATE_UPDATE_COUNT = 1000;
const PERFORMANCE_THRESHOLDS = {
  storeInit: 10, // Store 初始化时间阈值（ms）
  stateUpdate: 100, // 1000次状态更新时间阈值（ms）
  actionExecution: 50, // Action 执行时间阈值（ms）
};

describe('Pinia 性能基准测试', () => {
  beforeEach(() => {
    // 创建一个新的 Pinia 实例用于测试
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('Store 初始化性能', () => {
    it('playerStore 初始化时间应小于阈值', () => {
      const start = performance.now();
      const playerStore = usePlayerStore();
      playerStore.initPlayer();
      const end = performance.now();
      const initTime = end - start;
      console.log(`playerStore 初始化时间: ${initTime.toFixed(2)}ms`);
      expect(initTime).toBeLessThan(PERFORMANCE_THRESHOLDS.storeInit);
    });

    it('gameStore 初始化时间应小于阈值', () => {
      const start = performance.now();
      const gameStore = useGameStore();
      const end = performance.now();
      const initTime = end - start;
      console.log(`gameStore 初始化时间: ${initTime.toFixed(2)}ms`);
      expect(initTime).toBeLessThan(PERFORMANCE_THRESHOLDS.storeInit);
    });
  });

  describe('状态更新性能', () => {
    it('playerStore 大量状态更新应小于阈值', () => {
      const playerStore = usePlayerStore();
      playerStore.initPlayer();

      const start = performance.now();
      for (let i = 0; i < STATE_UPDATE_COUNT; i++) {
        playerStore.gainExp(100);
      }
      const end = performance.now();
      const updateTime = end - start;
      console.log(`playerStore ${STATE_UPDATE_COUNT}次状态更新时间: ${updateTime.toFixed(2)}ms`);
      expect(updateTime).toBeLessThan(PERFORMANCE_THRESHOLDS.stateUpdate);
    });

    it('gameStore 状态更新应小于阈值', () => {
      const gameStore = useGameStore();

      const start = performance.now();
      for (let i = 0; i < STATE_UPDATE_COUNT; i++) {
        gameStore.setGameMessage(`测试消息 ${i}`);
      }
      const end = performance.now();
      const updateTime = end - start;
      console.log(`gameStore ${STATE_UPDATE_COUNT}次状态更新时间: ${updateTime.toFixed(2)}ms`);
      expect(updateTime).toBeLessThan(PERFORMANCE_THRESHOLDS.stateUpdate);
    });
  });

  describe('Action 执行性能', () => {
    it('playerStore.initPlayer() 执行时间应小于阈值', () => {
      const playerStore = usePlayerStore();

      const start = performance.now();
      playerStore.initPlayer();
      const end = performance.now();
      const executionTime = end - start;
      console.log(`playerStore.initPlayer() 执行时间: ${executionTime.toFixed(2)}ms`);
      expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.actionExecution);
    });

    it('playerStore.gainExp() 执行时间应小于阈值', () => {
      const playerStore = usePlayerStore();
      playerStore.initPlayer();

      const start = performance.now();
      playerStore.gainExp(1000);
      const end = performance.now();
      const executionTime = end - start;
      console.log(`playerStore.gainExp() 执行时间: ${executionTime.toFixed(2)}ms`);
      expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.actionExecution);
    });

    it('gameStore.startGame() 执行时间应小于阈值', () => {
      const gameStore = useGameStore();

      const start = performance.now();
      gameStore.startGame();
      const end = performance.now();
      const executionTime = end - start;
      console.log(`gameStore.startGame() 执行时间: ${executionTime.toFixed(2)}ms`);
      expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.actionExecution);
    });

    it('gameStore.endGame() 执行时间应小于阈值', () => {
      const gameStore = useGameStore();

      const start = performance.now();
      gameStore.endGame();
      const end = performance.now();
      const executionTime = end - start;
      console.log(`gameStore.endGame() 执行时间: ${executionTime.toFixed(2)}ms`);
      expect(executionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.actionExecution);
    });
  });

  describe('计算属性性能', () => {
    it('playerStore.isAlive 访问时间应小于阈值', () => {
      const playerStore = usePlayerStore();
      playerStore.initPlayer();

      const start = performance.now();
      for (let i = 0; i < STATE_UPDATE_COUNT; i++) {
        // 访问计算属性
        const isAlive = playerStore.isAlive;
      }
      const end = performance.now();
      const accessTime = end - start;
      console.log(`playerStore.isAlive ${STATE_UPDATE_COUNT}次访问时间: ${accessTime.toFixed(2)}ms`);
      expect(accessTime).toBeLessThan(PERFORMANCE_THRESHOLDS.stateUpdate);
    });

    it('playerStore.currentHpPercent 访问时间应小于阈值', () => {
      const playerStore = usePlayerStore();
      playerStore.initPlayer();

      const start = performance.now();
      for (let i = 0; i < STATE_UPDATE_COUNT; i++) {
        // 访问计算属性
        const hpPercent = playerStore.currentHpPercent;
      }
      const end = performance.now();
      const accessTime = end - start;
      console.log(`playerStore.currentHpPercent ${STATE_UPDATE_COUNT}次访问时间: ${accessTime.toFixed(2)}ms`);
      expect(accessTime).toBeLessThan(PERFORMANCE_THRESHOLDS.stateUpdate);
    });

    it('playerStore.expProgress 访问时间应小于阈值', () => {
      const playerStore = usePlayerStore();
      playerStore.initPlayer();

      const start = performance.now();
      for (let i = 0; i < STATE_UPDATE_COUNT; i++) {
        // 访问计算属性
        const expProgress = playerStore.expProgress;
      }
      const end = performance.now();
      const accessTime = end - start;
      console.log(`playerStore.expProgress ${STATE_UPDATE_COUNT}次访问时间: ${accessTime.toFixed(2)}ms`);
      expect(accessTime).toBeLessThan(PERFORMANCE_THRESHOLDS.stateUpdate);
    });
  });
});
