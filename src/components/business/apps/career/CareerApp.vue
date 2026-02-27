<template>
  <ApplicationWindow
    title="策划成长"
    title-icon="📊"
    :sidebar-items="sidebarItems"
    :active-item-id="activeModule"
    @update:active-item-id="activeModule = $event"
  >
    <!-- 等级信息 -->
    <section
      v-if="activeModule === 'level-info'"
      class="module-section"
    >
      <div class="section-header">
        <h2>等级信息</h2>
        <p>当前职级: {{ currentRankDisplay }}</p>
      </div>

      <div class="level-section">
        <div class="level-card">
          <div class="level-info">
            <div class="rank-badge">{{ currentRank }}</div>
            <div class="text-gold sub-level">{{ currentSubLevel }}</div>
          </div>
          <div class="level-progress">
            <div class="progress-title">升级进度</div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progress + '%' }"
              ></div>
            </div>
            <div class="progress-text">
              <span class="text-gold">{{ progress }}%</span> 完成
            </div>
          </div>
        </div>
      </div>

      <!-- 升级条件 -->
      <div class="conditions-section">
        <h3>升级条件</h3>
        <div class="conditions-grid">
          <div
            class="condition-card"
            v-for="condition in upgradeConditions"
            :key="condition.id"
            :class="{ completed: condition.completed }"
          >
            <div class="condition-icon">{{ condition.icon }}</div>
            <div class="condition-content">
              <div class="condition-title">{{ condition.title }}</div>
              <div class="condition-desc">{{ condition.description }}</div>
              <div class="condition-progress">
                <div class="progress-text">
                  <span class="text-gold">{{ condition.current }}</span> / {{ condition.required }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 已解锁权限 -->
      <div class="permissions-section">
        <h3>已解锁权限</h3>
        <div class="permissions-grid">
          <div
            class="permission-card"
            v-for="permission in unlockedPermissions"
            :key="permission.id"
          >
            <div class="permission-icon">{{ permission.icon }}</div>
            <div class="permission-content">
              <div class="permission-title">{{ permission.title }}</div>
              <div class="permission-desc">{{ permission.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 历史奖励记录 -->
      <div class="rewards-section">
        <h3>历史奖励记录</h3>
        <button
          class="rewards-btn"
          @click="showRewards = !showRewards"
        >
          {{ showRewards ? '收起奖励记录' : '查看奖励记录' }}
          <span class="arrow">{{ showRewards ? '↑' : '↓' }}</span>
        </button>
        <div
          class="rewards-list"
          v-if="showRewards"
        >
          <div
            class="reward-item"
            v-for="reward in rewardsHistory"
            :key="reward.id"
          >
            <div class="reward-date">{{ reward.date }}</div>
            <div class="reward-content">
              <div class="reward-title">{{ reward.title }}</div>
              <div class="reward-desc">{{ reward.description }}</div>
            </div>
            <div class="reward-amounts">
              <div
                class="amount-item"
                v-if="reward.money > 0"
              >
                <span class="amount-icon">💰</span>
                <span class="text-gold amount-value">+{{ reward.money }}</span>
              </div>
              <div
                class="amount-item"
                v-if="reward.reputation > 0"
              >
                <span class="amount-icon">🏆</span>
                <span class="text-gold amount-value">+{{ reward.reputation }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';
import type { SidebarItem } from '@/components/common/window/ApplicationWindow.vue';

// 侧边栏配�?const sidebarItems: SidebarItem[] = [{ id: 'level-info', name: '等级信息', icon: '📊' }];

const activeModule = ref('level-info');

// 职级数据
const currentRank = ref('见习策划');
const currentSubLevel = ref('III');
const progress = ref(75);

// 计算当前职级显示
const currentRankDisplay = computed(() => {
  return `${currentRank.value} ${currentSubLevel.value}`;
});

// 升级条件
const upgradeConditions = ref([
  {
    id: 'wordOfMouth',
    title: '口碑要求',
    description: '游戏口碑达到要求',
    icon: '👍',
    current: 115,
    required: 120,
    completed: false,
  },
  {
    id: 'totalMoney',
    title: '流水要求',
    description: '累计总流水达到要求',
    icon: '💸',
    current: 0,
    required: 0,
    completed: true,
  },
  {
    id: 'heroCount',
    title: '英雄要求',
    description: '已上线英雄数量达到要求',
    icon: '🦸',
    current: 2,
    required: 0,
    completed: true,
  },
  {
    id: 'skinCount',
    title: '皮肤要求',
    description: '已上线皮肤数量达到要求',
    icon: '👗',
    current: 3,
    required: 0,
    completed: true,
  },
]);

// 已解锁权限
const unlockedPermissions = ref([
  {
    id: 'createHeroes',
    title: '英雄立项',
    description: '可立项射手类英雄',
    icon: '🏹',
  },
  {
    id: 'createSkins',
    title: '皮肤制作',
    description: '可制作伴生皮肤',
    icon: '👗',
  },
  {
    id: 'launchEvents',
    title: '活动开启',
    description: '可开启英雄折扣活动',
    icon: '🎉',
  },
  {
    id: 'viewData',
    title: '数据查看',
    description: '可查看游戏核心数据',
    icon: '📊',
  },
]);

// 历史奖励记录
const showRewards = ref(false);
const rewardsHistory = ref([
  {
    id: '1',
    date: '2026-02-14',
    title: '见习策划 III 晋升奖励',
    description: '成功晋升为见习策�?III',
    money: 1000,
    reputation: 0,
  },
]);
</script>

<style lang="scss" scoped>
.module-section {
  background-color: rgb(26 26 46 / 95%);
  border-radius: var(--app-radius-md);
  padding: 1.5rem;
  box-shadow: var(--app-shadow-secondary);
  border: 1px solid var(--app-border-secondary);
  color: var(--app-text-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--app-border-secondary);
}

.section-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--app-text-primary);
}

.section-header p {
  margin: 0;
  color: var(--app-text-secondary);
  font-size: 0.9rem;
}

/* 等级信息�? */
.level-section {
  margin-bottom: 24px;
}

.level-card {
  background-color: rgb(26 26 46 / 95%);
  border-radius: var(--app-radius-md);
  padding: 20px;
  box-shadow: var(--app-shadow-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border: 1px solid var(--app-border-secondary);
}

.level-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.rank-badge {
  font-size: 32px;
  font-weight: bold;
  color: #4a9eff;
  text-align: center;
}

.sub-level {
  font-size: 48px;
  font-weight: bold;
  line-height: 1;
}

.level-progress {
  width: 100%;
  max-width: 400px;
}

.progress-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--app-text-primary);
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: rgb(0 0 0 / 30%);
  border-radius: var(--app-radius-sm);
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background-color: #4a9eff;
  border-radius: var(--app-radius-sm);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--app-text-secondary);
  text-align: right;
}

/* 升级条件�? */
.conditions-section {
  margin-bottom: 24px;
}

.conditions-section h3 {
  margin: 0 0 16px;
  font-size: 20px;
  color: var(--app-text-primary);
}

.conditions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.condition-card {
  background-color: rgb(26 26 46 / 95%);
  border-radius: var(--app-radius-md);
  padding: 16px;
  box-shadow: var(--app-shadow-secondary);
  display: flex;
  gap: 12px;
  transition: all 0.2s ease;
  border-left: 4px solid rgb(74 158 255 / 30%);
  border: 1px solid var(--app-border-secondary);
}

.condition-card.completed {
  border-left-color: #4caf50;
  background-color: rgb(76 175 80 / 10%);
}

.condition-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-primary);
}

.condition-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgb(74 158 255 / 20%);
  border-radius: 50%;
  flex-shrink: 0;
}

.condition-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.condition-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--app-text-primary);
}

.condition-desc {
  font-size: 14px;
  color: var(--app-text-secondary);
  margin-bottom: 8px;
}

.condition-progress {
  margin-top: auto;
}

/* 已解锁权限区 */
.permissions-section {
  margin-bottom: 24px;
}

.permissions-section h3 {
  margin: 0 0 16px;
  font-size: 20px;
  color: var(--app-text-primary);
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.permission-card {
  background-color: rgb(26 26 46 / 95%);
  border-radius: var(--app-radius-md);
  padding: 16px;
  box-shadow: var(--app-shadow-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  text-align: center;
  border: 1px solid var(--app-border-secondary);
}

.permission-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-primary);
}

.permission-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgb(74 158 255 / 20%);
  border-radius: 50%;
}

.permission-content {
  flex: 1;
}

.permission-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--app-text-primary);
  margin-bottom: 4px;
}

.permission-desc {
  font-size: 14px;
  color: var(--app-text-secondary);
}

/* 奖励记录�? */
.rewards-section {
  margin-bottom: 24px;
}

.rewards-section h3 {
  margin: 0 0 16px;
  font-size: 20px;
  color: var(--app-text-primary);
}

.rewards-btn {
  width: 100%;
  padding: 12px;
  background-color: rgb(26 26 46 / 95%);
  border: 2px solid rgb(74 158 255 / 20%);
  color: #4a9eff;
  font-size: 16px;
  font-weight: bold;
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.rewards-btn:hover {
  background-color: rgb(74 158 255 / 10%);
  border-color: #4a9eff;
  transform: translateY(-1px);
}

.rewards-list {
  margin-top: 16px;
  background-color: rgb(26 26 46 / 95%);
  border-radius: var(--app-radius-md);
  overflow: hidden;
  box-shadow: var(--app-shadow-secondary);
  border: 1px solid var(--app-border-secondary);
}

.reward-item {
  padding: 16px;
  border-bottom: 1px solid var(--app-border-secondary);
  display: flex;
  gap: 16px;
  align-items: center;
  transition: background-color 0.2s ease;
}

.reward-item:last-child {
  border-bottom: none;
}

.reward-item:hover {
  background-color: rgb(0 0 0 / 20%);
}

.reward-date {
  font-size: 12px;
  color: var(--app-text-secondary);
  flex-shrink: 0;
  width: 100px;
}

.reward-content {
  flex: 1;
}

.reward-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--app-text-primary);
  margin-bottom: 4px;
}

.reward-desc {
  font-size: 14px;
  color: var(--app-text-secondary);
}

.reward-amounts {
  display: flex;
  gap: 12px;
  align-items: center;
}

.amount-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: bold;
}

.amount-icon {
  font-size: 16px;
}

.amount-value {
  color: #4caf50;
}

/* 响应式设�? */
@media (width <= 768px) {
  .conditions-grid,
  .permissions-grid {
    grid-template-columns: 1fr;
  }

  .condition-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .reward-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .reward-date {
    width: auto;
  }
}
</style>
