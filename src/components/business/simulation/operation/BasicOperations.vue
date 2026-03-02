<template>
  <div class="basic-operations-container">
    <h2 class="page-title">首次基础策划操作</h2>

    <div class="operations-grid">
      <!-- 发布普通皮肤 -->
      <div class="operation-card skin-release">
        <h3 class="card-title">发布普通皮肤</h3>
        <p class="card-description">
          为英雄发布一款普通皮肤，提升玩家活跃度和收入
        </p>

        <div class="form-group">
          <label class="form-label">选择英雄</label>
          <select class="form-select">
            <option value="hero1">英雄1</option>
            <option value="hero2">英雄2</option>
            <option value="hero3">英雄3</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">皮肤名称</label>
          <input type="text" placeholder="请输入皮肤名称" class="form-input" />
        </div>

        <button @click="releaseCommonSkin" class="action-btn primary">
          发布皮肤
        </button>

        <div class="effect-preview">
          <div><strong>预期效果：</strong></div>
          <div>• 登录率 +5%</div>
          <div>• 收入 +10%</div>
          <div>• 市场情绪 +2</div>
        </div>
      </div>

      <!-- 设置日常登录奖励 -->
      <div class="operation-card daily-reward">
        <h3 class="card-title">设置日常登录奖励</h3>
        <p class="card-description">设置连续登录奖励，提高用户留存率</p>

        <div class="rewards-list">
          <div
            v-for="(reward, index) in loginRewards"
            :key="index"
            class="reward-item"
          >
            <span class="reward-day">第{{ index + 1 }}天</span>
            <div class="reward-inputs">
              <select class="form-select small">
                <option value="coins">金币</option>
                <option value="diamonds">钻石</option>
                <option value="items">道具</option>
              </select>
              <input
                type="number"
                min="0"
                placeholder="数量"
                class="form-input small"
              />
            </div>
          </div>
        </div>

        <button @click="setDailyLoginRewards" class="action-btn success">
          保存设置
        </button>

        <div class="effect-preview success">
          <div><strong>预期效果：</strong></div>
          <div>• 登录率 +8%</div>
          <div>• 7日留存 +5%</div>
          <div>• 市场情绪 +3</div>
        </div>
      </div>

      <!-- 修复基础BUG -->
      <div class="operation-card bug-fix">
        <h3 class="card-title">修复基础BUG</h3>
        <p class="card-description">修复游戏中的基础BUG，提升游戏体验</p>

        <div class="bugs-list">
          <div v-for="(bug, index) in bugs" :key="index" class="bug-item">
            <input type="checkbox" :id="`bug-${index}`" class="bug-checkbox" />
            <label :for="`bug-${index}`" class="bug-label">
              <div class="bug-title">{{ bug.title }}</div>
              <div class="bug-description">{{ bug.description }}</div>
            </label>
          </div>
        </div>

        <button @click="fixBasicBugs" class="action-btn warning">
          修复选中BUG
        </button>

        <div class="effect-preview warning">
          <div><strong>预期效果：</strong></div>
          <div>• 登录率 +3%</div>
          <div>• 用户投诉 -10%</div>
          <div>• 市场情绪 +2</div>
        </div>
      </div>
    </div>

    <!-- 导师引导 -->
    <div class="mentor-tips">
      <div class="tips-content">
        <div class="tips-icon">👨‍🏫</div>
        <div class="tips-text">
          <strong class="tips-title">导师提示</strong>
          <p class="tips-description">
            完成以上三个基础操作，即可解锁核心数据面板，开始正式运营游戏。建议按照顺序依次完成这些操作。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

const simulationStore = useSimulationStore();

// 登录奖励数据
const loginRewards = ref([
  { type: 'coins', amount: 100 },
  { type: 'coins', amount: 200 },
  { type: 'diamonds', amount: 10 },
  { type: 'items', amount: 1 },
  { type: 'coins', amount: 300 },
  { type: 'diamonds', amount: 15 },
  { type: 'items', amount: 2 },
]);

// BUG列表
const bugs = ref([
  { id: 1, title: '登录失败问题', description: '部分用户登录时出现网络错误' },
  { id: 2, title: '界面显示异常', description: '某些设备上界面元素重叠' },
  { id: 3, title: '音效缺失', description: '游戏音效偶尔无法播放' },
  { id: 4, title: '数据同步问题', description: '部分数据无法及时同步' },
]);

// 发布普通皮肤
const releaseCommonSkin = (): void => {
  simulationStore.recordAction('releaseCommonSkin', {
    heroId: 'hero1',
    skinName: '新皮肤',
    quality: 'common',
  });
};

// 设置日常登录奖励
const setDailyLoginRewards = (): void => {
  simulationStore.recordAction('improveDailyReward', {
    rewards: loginRewards.value,
  });
};

// 修复基础BUG
const fixBasicBugs = (): void => {
  simulationStore.recordAction('fixBug', {
    bugIds: bugs.value.map((_, index) => index + 1),
  });
};
</script>

<style lang="scss" scoped>
.basic-operations-container {
  max-width: tokens.$max-content-width;
  margin: 0 auto;
  padding: tokens.$spacing-lg;
}

.page-title {
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  margin-bottom: tokens.$spacing-xl;
  color: tokens.$text-primary;
}

.operations-grid {
  @include utils.grid-layout(3, tokens.$spacing-lg);

  margin-bottom: tokens.$spacing-xl;

  @include utils.tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include utils.mobile {
    grid-template-columns: 1fr;
  }
}

.operation-card {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
  border: 1px solid tokens.$border-light;

  @include utils.flex-col(tokens.$spacing-md, stretch);

  &.skin-release {
    border-top: 4px solid tokens.$primary-blue;

    .card-title {
      color: tokens.$primary-blue;
    }
  }

  &.daily-reward {
    border-top: 4px solid tokens.$success;

    .card-title {
      color: tokens.$success;
    }
  }

  &.bug-fix {
    border-top: 4px solid tokens.$warning;

    .card-title {
      color: tokens.$warning;
    }
  }
}

.card-title {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-semibold;
  margin: 0;
}

.card-description {
  color: tokens.$text-secondary;
  margin: 0;
  font-size: tokens.$font-size-sm;
}

.form-group {
  @include utils.flex-col(tokens.$spacing-xs, stretch);
}

.form-label {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-secondary;
}

.form-input,
.form-select {
  @include utils.input-base;

  &.small {
    padding: tokens.$spacing-xs tokens.$spacing-sm;
    font-size: tokens.$font-size-xs;
  }
}

.action-btn {
  @include utils.btn-base;

  width: 100%;

  &.primary {
    background-color: tokens.$primary-blue;
    color: white;

    &:hover {
      background-color: tokens.$primary-dark;
    }
  }

  &.success {
    background-color: tokens.$success;
    color: white;

    &:hover {
      background-color: tokens.$secondary-dark;
    }
  }

  &.warning {
    background-color: tokens.$warning;
    color: white;

    &:hover {
      background-color: #d97706;
    }
  }
}

.effect-preview {
  padding: tokens.$spacing-sm;
  border-radius: tokens.$radius-md;
  font-size: tokens.$font-size-sm;

  &.success {
    background-color: rgb(16 185 129 / 10%);
    color: tokens.$success;
  }

  &.warning {
    background-color: rgb(245 158 11 / 10%);
    color: tokens.$warning;
  }

  &:not(.success, .warning) {
    background-color: rgb(59 130 246 / 10%);
    color: tokens.$primary-blue;
  }
}

.rewards-list {
  @include utils.flex-col(tokens.$spacing-sm, stretch);
}

.reward-item {
  @include utils.flex-between(center);
}

.reward-day {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
}

.reward-inputs {
  @include utils.flex-row(tokens.$spacing-xs, center);
}

.bugs-list {
  @include utils.flex-col(tokens.$spacing-sm, stretch);
}

.bug-item {
  @include utils.flex-row(tokens.$spacing-sm, flex-start);
}

.bug-checkbox {
  margin-top: tokens.$spacing-xs;
}

.bug-label {
  flex: 1;
  cursor: pointer;
}

.bug-title {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.bug-description {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

.mentor-tips {
  background-color: rgb(245 158 11 / 10%);
  border-left: 4px solid tokens.$warning;
  border-radius: 0 tokens.$radius-md tokens.$radius-md 0;
  padding: tokens.$spacing-md;
}

.tips-content {
  @include utils.flex-row(tokens.$spacing-md, flex-start);
}

.tips-icon {
  font-size: tokens.$font-size-xl;
  flex-shrink: 0;
}

.tips-text {
  flex: 1;
}

.tips-title {
  color: tokens.$warning;
  font-weight: tokens.$font-weight-semibold;
}

.tips-description {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-sm;
  margin: tokens.$spacing-xs 0 0;
}
</style>
