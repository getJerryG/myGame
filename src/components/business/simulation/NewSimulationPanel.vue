<template>
  <div class="new-simulation-panel">
    <!-- 面板标题 -->
    <div class="panel-header">
      <h2 class="panel-title">模拟设置</h2>
      <p class="panel-subtitle">配置游戏模拟参数</p>
    </div>

    <!-- 模拟参数配置 -->
    <div class="simulation-config">
      <!-- 模拟速度 -->
      <div class="config-item">
        <label class="config-label">模拟速度</label>
        <div class="config-control">
          <input
            type="range"
            v-model="simulationSpeed"
            min="1"
            max="10"
            class="config-slider"
          />
          <span class="config-value">{{ simulationSpeed }}x</span>
        </div>
      </div>

      <!-- 初始资金 -->
      <div class="config-item">
        <label class="config-label">初始资金</label>
        <div class="config-control">
          <input
            type="number"
            v-model="initialFunds"
            class="config-input"
            placeholder="输入初始资金"
          />
          <span class="config-unit">元</span>
        </div>
      </div>

      <!-- 市场难度 -->
      <div class="config-item">
        <label class="config-label">市场难度</label>
        <div class="config-control">
          <select v-model="marketDifficulty" class="config-select">
            <option value="easy">简单</option>
            <option value="normal">普通</option>
            <option value="hard">困难</option>
            <option value="expert">专家</option>
          </select>
        </div>
      </div>

      <!-- 模拟天数 -->
      <div class="config-item">
        <label class="config-label">模拟天数</label>
        <div class="config-control">
          <input
            type="number"
            v-model="simulationDays"
            class="config-input"
            min="1"
            max="365"
          />
          <span class="config-unit">天</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="panel-actions">
      <button class="action-button secondary" @click="resetConfig">重置</button>
      <button class="action-button primary" @click="startSimulation">
        开始模拟
      </button>
    </div>

    <!-- 模拟状态显示 -->
    <div v-if="isSimulating" class="simulation-status">
      <div class="status-header">
        <span class="status-icon">⏳</span>
        <span class="status-text">模拟进行中...</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
      <div class="status-details">
        <span>第 {{ currentDay }} / {{ simulationDays }} 天</span>
        <span>{{ progressPercent }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 模拟参数
const simulationSpeed = ref(5);
const initialFunds = ref(100000);
const marketDifficulty = ref("normal");
const simulationDays = ref(30);

// 模拟状态
const isSimulating = ref(false);
const currentDay = ref(0);

// 进度百分比
const progressPercent = computed(() => {
  if (simulationDays.value === 0) return 0;
  return Math.round((currentDay.value / simulationDays.value) * 100);
});

// 重置配置
const resetConfig = (): void => {
  simulationSpeed.value = 5;
  initialFunds.value = 100000;
  marketDifficulty.value = "normal";
  simulationDays.value = 30;
};

// 开始模拟
const startSimulation = (): void => {
  isSimulating.value = true;
  currentDay.value = 0;

  // 模拟进度
  const interval = setInterval(() => {
    currentDay.value++;
    if (currentDay.value >= simulationDays.value) {
      clearInterval(interval);
      isSimulating.value = false;
    }
  }, 1000 / simulationSpeed.value);
};
</script>

<style lang="scss" scoped>
.new-simulation-panel {
  @include utils.flex-col(tokens.$spacing-lg, stretch, flex-start);

  padding: tokens.$spacing-xl;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  border: 2px solid tokens.$border-light;
}

.panel-header {
  text-align: center;
  margin-bottom: tokens.$spacing-lg;

  .panel-title {
    font-size: tokens.$font-size-2xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
    margin: 0 0 tokens.$spacing-sm;
  }

  .panel-subtitle {
    font-size: tokens.$font-size-base;
    color: tokens.$text-muted;
    margin: 0;
  }
}

.simulation-config {
  @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);
}

.config-item {
  @include utils.flex-between;

  padding: tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  border: 1px solid tokens.$border-light;
  transition: all tokens.$transition-normal;

  &:hover {
    border-color: tokens.$primary;
    box-shadow: 0 0 0 2px rgb(74 158 255 / 20%);
  }
}

.config-label {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  min-width: 100px;
}

.config-control {
  @include utils.flex-row(tokens.$spacing-sm, center, flex-end);

  flex: 1;
}

.config-slider {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: tokens.$bg-light;
  outline: none;
  appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: tokens.$primary;
    cursor: pointer;
    box-shadow: 0 2px 6px rgb(74 158 255 / 40%);
    transition: all tokens.$transition-normal;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgb(74 158 255 / 60%);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: tokens.$primary;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgb(74 158 255 / 40%);
  }
}

.config-input,
.config-select {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  font-size: tokens.$font-size-base;
  border: 2px solid tokens.$border-light;
  border-radius: tokens.$radius-md;
  background-color: tokens.$bg-lighter;
  color: tokens.$text-primary;
  outline: none;
  transition: all tokens.$transition-normal;
  min-width: 150px;

  &:focus {
    border-color: tokens.$primary;
    box-shadow: 0 0 0 3px rgb(74 158 255 / 20%);
  }
}

.config-select {
  cursor: pointer;
}

.config-value,
.config-unit {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$primary;
  min-width: 50px;
  text-align: right;
}

.panel-actions {
  @include utils.flex-row(tokens.$spacing-md, center, center);

  margin-top: tokens.$spacing-lg;
}

.action-button {
  padding: tokens.$spacing-sm tokens.$spacing-xl;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;
  border: none;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-normal;
  min-width: 120px;

  &.primary {
    background: linear-gradient(
      135deg,
      tokens.$primary 0%,
      tokens.$primary-dark 100%
    );
    color: tokens.$text-primary;
    box-shadow: 0 4px 15px rgb(74 158 255 / 40%);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgb(74 158 255 / 60%);
    }
  }

  &.secondary {
    background-color: tokens.$bg-light;
    color: tokens.$text-primary;
    border: 2px solid tokens.$border-light;

    &:hover {
      background-color: tokens.$bg-lighter;
      border-color: tokens.$primary;
    }
  }
}

.simulation-status {
  margin-top: tokens.$spacing-lg;
  padding: tokens.$spacing-md;
  background: linear-gradient(
    135deg,
    tokens.$primary 0%,
    tokens.$primary-dark 100%
  );
  border-radius: tokens.$radius-md;
  color: tokens.$text-primary;

  .status-header {
    @include utils.flex-row(tokens.$spacing-sm, center, flex-start);

    margin-bottom: tokens.$spacing-sm;

    .status-icon {
      font-size: tokens.$font-size-xl;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .status-text {
      font-size: tokens.$font-size-base;
      font-weight: tokens.$font-weight-semibold;
    }
  }

  .progress-bar {
    width: 100%;
    height: 10px;
    background-color: rgb(255 255 255 / 20%);
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: tokens.$spacing-sm;

    .progress-fill {
      height: 100%;
      background-color: tokens.$text-primary;
      border-radius: 5px;
      transition: width tokens.$transition-normal;
      box-shadow: 0 0 10px rgb(255 255 255 / 50%);
    }
  }

  .status-details {
    @include utils.flex-between;

    font-size: tokens.$font-size-sm;
    opacity: 0.9;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

/* 响应式设计 */
@media (width <= 768px) {
  .new-simulation-panel {
    padding: tokens.$spacing-lg tokens.$spacing-md;
  }

  .config-item {
    flex-direction: column;
    align-items: flex-start;
    gap: tokens.$spacing-sm;
  }

  .config-control {
    width: 100%;
  }

  .config-input,
  .config-select {
    flex: 1;
    min-width: auto;
  }

  .panel-actions {
    flex-direction: column;
    width: 100%;

    .action-button {
      width: 100%;
    }
  }
}
</style>
