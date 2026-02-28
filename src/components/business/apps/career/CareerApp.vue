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
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
  box-shadow: tokens.$shadow-md;
  border: 1px solid tokens.$border-light;
  color: tokens.$text-primary;
}

.section-header {
  @include utils.flex-between;
  margin-bottom: tokens.$spacing-lg;
  padding-bottom: tokens.$spacing-md;
  border-bottom: 1px solid tokens.$border-light;

  h2 {
    margin: 0;
    font-size: tokens.$font-size-xl;
    color: tokens.$text-primary;
  }

  p {
    margin: 0;
    color: tokens.$text-secondary;
    font-size: tokens.$font-size-sm;
  }
}

/* 等级信息区 */
.level-section {
  margin-bottom: tokens.$spacing-lg;
}

.level-card {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
  box-shadow: tokens.$shadow-md;
  @include utils.flex-col(tokens.$spacing-lg, center, center);
  border: 1px solid tokens.$border-light;
}

.level-info {
  @include utils.flex-row(tokens.$spacing-md);
}

.rank-badge {
  font-size: tokens.$font-size-3xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary-blue;
  text-align: center;
}

.sub-level {
  font-size: tokens.$font-size-4xl;
  font-weight: tokens.$font-weight-bold;
  line-height: 1;
}

.level-progress {
  width: 100%;
  max-width: 400px;
}

.progress-title {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  margin-bottom: tokens.$spacing-sm;
  color: tokens.$text-primary;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-sm;
  overflow: hidden;
  margin-bottom: tokens.$spacing-xs;
}

.progress-fill {
  height: 100%;
  background-color: tokens.$primary-blue;
  border-radius: tokens.$radius-sm;
  transition: width tokens.$transition-normal;
}

.progress-text {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  text-align: right;
}

/* 升级条件区 */
.conditions-section {
  margin-bottom: tokens.$spacing-lg;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-xl;
    color: tokens.$text-primary;
  }
}

.conditions-grid {
  @include utils.grid-auto-fill(280px, tokens.$spacing-md);
}

.condition-card {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-md;
  box-shadow: tokens.$shadow-md;
  @include utils.flex-row(tokens.$spacing-md);
  transition: all tokens.$transition-fast;
  border-left: 4px solid rgba(tokens.$primary-blue, 0.3);
  border: 1px solid tokens.$border-light;

  &.completed {
    border-left-color: tokens.$success;
    background-color: rgba(tokens.$success, 0.1);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }
}

.condition-icon {
  font-size: tokens.$font-size-3xl;
  @include utils.flex-center;
  width: 60px;
  height: 60px;
  background-color: rgba(tokens.$primary-blue, 0.2);
  border-radius: 50%;
  flex-shrink: 0;
}

.condition-content {
  flex: 1;
  @include utils.flex-col(tokens.$spacing-xs);
}

.condition-title {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
}

.condition-desc {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-sm;
}

.condition-progress {
  margin-top: auto;
}

/* 已解锁权限区 */
.permissions-section {
  margin-bottom: tokens.$spacing-lg;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-xl;
    color: tokens.$text-primary;
  }
}

.permissions-grid {
  @include utils.grid-auto-fill(200px, tokens.$spacing-md);
}

.permission-card {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-md;
  box-shadow: tokens.$shadow-md;
  @include utils.flex-col(tokens.$spacing-md, center, center);
  transition: all tokens.$transition-fast;
  text-align: center;
  border: 1px solid tokens.$border-light;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }
}

.permission-icon {
  font-size: tokens.$font-size-3xl;
  @include utils.flex-center;
  width: 60px;
  height: 60px;
  background-color: rgba(tokens.$primary-blue, 0.2);
  border-radius: 50%;
}

.permission-content {
  flex: 1;
}

.permission-title {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  margin-bottom: tokens.$spacing-xs;
}

.permission-desc {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

/* 奖励记录区 */
.rewards-section {
  margin-bottom: tokens.$spacing-lg;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-xl;
    color: tokens.$text-primary;
  }
}

.rewards-btn {
  width: 100%;
  padding: tokens.$spacing-sm;
  background-color: tokens.$bg-secondary;
  border: 2px solid rgba(tokens.$primary-blue, 0.2);
  color: tokens.$primary-blue;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  border-radius: tokens.$radius-lg;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  @include utils.flex-center;
  gap: tokens.$spacing-sm;

  &:hover {
    background-color: rgba(tokens.$primary-blue, 0.1);
    border-color: tokens.$primary-blue;
    transform: translateY(-1px);
  }
}

.rewards-list {
  margin-top: tokens.$spacing-md;
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  overflow: hidden;
  box-shadow: tokens.$shadow-md;
  border: 1px solid tokens.$border-light;
}

.reward-item {
  padding: tokens.$spacing-md;
  border-bottom: 1px solid tokens.$border-light;
  @include utils.flex-row(tokens.$spacing-md);
  align-items: center;
  transition: background-color tokens.$transition-fast;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: tokens.$bg-light;
  }
}

.reward-date {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  flex-shrink: 0;
  width: 100px;
}

.reward-content {
  flex: 1;
}

.reward-title {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  margin-bottom: tokens.$spacing-xs;
}

.reward-desc {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

.reward-amounts {
  @include utils.flex-row(tokens.$spacing-md);
  align-items: center;
}

.amount-item {
  @include utils.flex-row(tokens.$spacing-xs);
  align-items: center;
  font-weight: tokens.$font-weight-bold;
}

.amount-icon {
  font-size: tokens.$font-size-base;
}

.amount-value {
  color: tokens.$success;
}

/* 响应式设计 */
@include utils.mobile {
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
    gap: tokens.$spacing-sm;
  }

  .reward-date {
    width: auto;
  }
}
</style>
