import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePlayerStore } from '@/stores/playerStore';

describe('PlayerStore', () => {
  beforeEach(() => {
    // 创建一个新的 Pinia 实例用于测试
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('状态初始化', () => {
    it('应该使用正确的默认值初始化', () => {
      const playerStore = usePlayerStore();
      
      expect(playerStore.id).toBe('player_001');
      expect(playerStore.name).toBe('默认玩家');
      expect(playerStore.level).toBe(1);
      expect(playerStore.experience).toBe(0);
      expect(playerStore.gold).toBe(1000);
      expect(playerStore.diamonds).toBe(100);
      expect(playerStore.energy).toBe(100);
      expect(playerStore.maxEnergy).toBe(100);
      expect(playerStore.vipLevel).toBe(0);
    });
  });

  describe('计算属性', () => {
    it('levelExperienceCap 应该返回正确的经验上限', () => {
      const playerStore = usePlayerStore();
      
      expect(playerStore.levelExperienceCap).toBe(100);
      
      // 升级后经验上限应该增加
      playerStore.level = 2;
      expect(playerStore.levelExperienceCap).toBe(200);
    });

    it('canLevelUp 应该正确判断是否可以升级', () => {
      const playerStore = usePlayerStore();
      
      // 初始状态下不能升级
      expect(playerStore.canLevelUp).toBe(false);
      
      // 达到经验上限可以升级
      playerStore.experience = 100;
      expect(playerStore.canLevelUp).toBe(true);
    });

    it('energyPercentage 应该返回正确的能量百分比', () => {
      const playerStore = usePlayerStore();
      
      // 满能量
      expect(playerStore.energyPercentage).toBe(100);
      
      // 50% 能量
      playerStore.energy = 50;
      expect(playerStore.energyPercentage).toBe(50);
      
      // 空能量
      playerStore.energy = 0;
      expect(playerStore.energyPercentage).toBe(0);
    });
  });

  describe('经验管理', () => {
    it('addExperience 应该正确增加经验值并触发升级', () => {
      const playerStore = usePlayerStore();
      
      playerStore.addExperience(150);
      
      // 应该升级到 2 级，剩余 50 经验
      expect(playerStore.level).toBe(2);
      expect(playerStore.experience).toBe(50);
      // 升级应该获得奖励
      expect(playerStore.gold).toBeGreaterThan(1000);
      expect(playerStore.diamonds).toBeGreaterThan(100);
    });

    it('reduceExperience 应该正确减少经验值，不低于 0', () => {
      const playerStore = usePlayerStore();
      playerStore.experience = 50;
      
      playerStore.reduceExperience(30);
      expect(playerStore.experience).toBe(20);
      
      // 减少超过当前经验值，应该变为 0
      playerStore.reduceExperience(30);
      expect(playerStore.experience).toBe(0);
    });

    it('checkLevelUp 应该正确处理多级升级', () => {
      const playerStore = usePlayerStore();
      
      // 一次性获得足够升级多级的经验
      playerStore.experience = 550;
      playerStore.checkLevelUp();
      
      // 1级: 100经验 -> 2级: 200经验 -> 3级: 300经验
      // 总共需要 600 经验，550 经验应该到 3 级，剩余 550 - 300 = 250? 不对，让我们重新计算
      // 1级升2级需要100，剩余450
      // 2级升3级需要200，剩余250
      // 3级升4级需要300，不够
      expect(playerStore.level).toBe(3);
      expect(playerStore.experience).toBe(250);
    });
  });

  describe('资源管理', () => {
    it('addGold 和 reduceGold 应该正确管理金币', () => {
      const playerStore = usePlayerStore();
      const initialGold = playerStore.gold;
      
      // 增加金币
      playerStore.addGold(500);
      expect(playerStore.gold).toBe(initialGold + 500);
      
      // 减少金币，足够的情况下
      const reduceAmount = 300;
      const result = playerStore.reduceGold(reduceAmount);
      expect(result).toBe(true);
      expect(playerStore.gold).toBe(initialGold + 500 - reduceAmount);
      
      // 减少金币，不足的情况下
      const insufficientResult = playerStore.reduceGold(2000);
      expect(insufficientResult).toBe(false);
      // 金币应该保持不变
      expect(playerStore.gold).toBe(initialGold + 500 - reduceAmount);
    });

    it('addDiamonds 和 reduceDiamonds 应该正确管理钻石', () => {
      const playerStore = usePlayerStore();
      const initialDiamonds = playerStore.diamonds;
      
      // 增加钻石
      playerStore.addDiamonds(50);
      expect(playerStore.diamonds).toBe(initialDiamonds + 50);
      
      // 减少钻石，足够的情况下
      const reduceAmount = 30;
      const result = playerStore.reduceDiamonds(reduceAmount);
      expect(result).toBe(true);
      expect(playerStore.diamonds).toBe(initialDiamonds + 50 - reduceAmount);
      
      // 减少钻石，不足的情况下
      const insufficientResult = playerStore.reduceDiamonds(200);
      expect(insufficientResult).toBe(false);
      // 钻石应该保持不变
      expect(playerStore.diamonds).toBe(initialDiamonds + 50 - reduceAmount);
    });

    it('addEnergy 和 reduceEnergy 应该正确管理能量', () => {
      const playerStore = usePlayerStore();
      
      // 增加能量，不超过最大值
      playerStore.energy = 50;
      playerStore.addEnergy(30);
      expect(playerStore.energy).toBe(80);
      
      // 增加能量，超过最大值，应该被限制
      playerStore.addEnergy(50);
      expect(playerStore.energy).toBe(playerStore.maxEnergy);
      
      // 减少能量，足够的情况下
      const reduceAmount = 30;
      const result = playerStore.reduceEnergy(reduceAmount);
      expect(result).toBe(true);
      expect(playerStore.energy).toBe(playerStore.maxEnergy - reduceAmount);
      
      // 减少能量，不足的情况下
      const insufficientResult = playerStore.reduceEnergy(200);
      expect(insufficientResult).toBe(false);
      // 能量应该保持不变
      expect(playerStore.energy).toBe(playerStore.maxEnergy - reduceAmount);
    });
  });

  describe('VIP 管理', () => {
    it('setVipLevel 应该正确设置 VIP 等级，不低于 0', () => {
      const playerStore = usePlayerStore();
      
      // 设置正常 VIP 等级
      playerStore.setVipLevel(5);
      expect(playerStore.vipLevel).toBe(5);
      
      // 设置负数 VIP 等级，应该被限制为 0
      playerStore.setVipLevel(-1);
      expect(playerStore.vipLevel).toBe(0);
    });
  });

  describe('玩家信息管理', () => {
    it('setPlayerInfo 应该正确更新玩家信息', () => {
      const playerStore = usePlayerStore();
      
      const newInfo = {
        name: '测试玩家',
        level: 10,
        vipLevel: 3
      };
      
      playerStore.setPlayerInfo(newInfo);
      
      expect(playerStore.name).toBe(newInfo.name);
      expect(playerStore.level).toBe(newInfo.level);
      expect(playerStore.vipLevel).toBe(newInfo.vipLevel);
      // 未更新的属性应该保持不变
      expect(playerStore.gold).toBe(1000);
    });

    it('updateLastLoginTime 应该更新最后登录时间', () => {
      const playerStore = usePlayerStore();
      const initialTime = playerStore.lastLoginTime;
      
      // 等待 10ms 确保时间变化
      setTimeout(() => {
        playerStore.updateLastLoginTime();
        expect(playerStore.lastLoginTime).toBeGreaterThan(initialTime);
      }, 10);
    });

    it('resetPlayer 应该重置玩家数据到默认值', () => {
      const playerStore = usePlayerStore();
      
      // 修改一些数据
      playerStore.name = '测试玩家';
      playerStore.level = 10;
      playerStore.gold = 5000;
      playerStore.diamonds = 500;
      
      // 重置玩家数据
      playerStore.resetPlayer();
      
      // 应该恢复到默认值
      expect(playerStore.name).toBe('默认玩家');
      expect(playerStore.level).toBe(1);
      expect(playerStore.gold).toBe(1000);
      expect(playerStore.diamonds).toBe(100);
    });
  });
});