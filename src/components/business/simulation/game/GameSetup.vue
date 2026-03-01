<template>
  <div class="game-setup-container">
    <div class="game-setup-content">
      <h2 class="page-title">游戏基础设定</h2>

      <!-- 游戏类型选择 -->
      <div class="form-section">
        <label class="form-label">选择游戏类型</label>
        <div class="game-type-grid">
          <button
            v-for="gameType in gameTypes"
            :key="gameType.value"
            @click="selectedGameType = gameType.value"
            class="game-type-btn"
            :class="[selectedGameType === gameType.value ? 'type-selected' : 'type-default']"
          >
            <div class="type-label">{{ gameType.label }}</div>
            <div class="type-desc">{{ gameType.description }}</div>
          </button>
        </div>
      </div>

      <!-- 游戏名称输入 -->
      <div class="form-section">
        <label class="form-label">设定游戏名称</label>
        <input
          v-model="gameName"
          type="text"
          placeholder="请输入游戏名称（1-20个字符，不允许特殊字符）"
          class="form-input"
          :class="[gameNameError ? 'input-error' : '']"
          :maxlength="20"
          @input="validateGameName"
        />
        <div class="input-footer">
          <div
            v-if="gameNameError"
            class="error-text"
          >
            {{ gameNameError }}
          </div>
          <div class="char-count">{{ gameName.length }}/20</div>
        </div>
      </div>

      <!-- 发布按钮 -->
      <button
        @click="publishGame"
        :disabled="!canPublish"
        class="btn-publish"
      >
        发布游戏
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

const simulationStore = useSimulationStore();

// 游戏类型选项
const gameTypes = [
  { value: 'moba', label: 'MOBA', description: '多人在线战术竞技游戏' },
  { value: 'card', label: '卡牌', description: '策略卡牌收集游戏' },
  { value: 'casual', label: '休闲竞技', description: '轻松休闲的竞技游戏' },
];

// 类型定义
const GameTypeValues = ['moba', 'card', 'casual'] as const;
type GameType = (typeof GameTypeValues)[number];

// 选中的游戏类型
const selectedGameType = ref<GameType>('moba');

// 游戏名称
const gameName = ref('我的游戏');
// 游戏名称错误信息
const gameNameError = ref<string>('');

/**
 * 验证游戏名称
 * 1-20个字符，不允许特殊字符
 */
const validateGameName = (): void => {
  const name = gameName.value.trim();

  if (name.length === 0) {
    gameNameError.value = '';
    return;
  }

  if (name.length > 20) {
    gameNameError.value = '游戏名称不能超过20个字符';
    return;
  }

  if (name.length < 1) {
    gameNameError.value = '游戏名称不能为空';
    return;
  }

  // 检查是否包含特殊字符
  const specialCharRegex = /[^a-zA-Z0-9\u4e00-\u9fa5\s]/;
  if (specialCharRegex.test(name)) {
    gameNameError.value = '游戏名称不能包含特殊字符';
    return;
  }

  gameNameError.value = '';
};

/**
 * 安全的HTML编码函数
 * @param str 需要编码的字符串
 * @returns 编码后的字符串
 */
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// 计算是否可以发布
const canPublish = computed(() => {
  return gameName.value.trim().length > 0 && gameName.value.length <= 20 && !gameNameError.value;
});

// 发布游戏
const publishGame = (): void => {
  // 最后验证一次
  validateGameName();

  if (!canPublish.value) {
    return;
  }

  // 安全编码游戏名称，防止XSS攻击
  const safeGameName = escapeHtml(gameName.value.trim());

  // 创建游戏
  simulationStore.createGame(selectedGameType.value, safeGameName);

  // 记录游戏设定
  simulationStore.recordAction('gameSetup', {
    gameType: selectedGameType.value,
    gameName: safeGameName,
  });

  // 触发游戏发布事件
  // 这里可以根据需要添加更多逻辑，比如解锁核心数据面板
};
</script>

<style lang="scss" scoped>

.game-setup-container {
  @include utils.flex-center;

  min-height: 100vh;
  background-color: tokens.$bg-primary;
}

.game-setup-content {
  background: tokens.$bg-secondary;
  padding: tokens.$space-8;
  border-radius: tokens.$radius-xl;
  box-shadow: tokens.$shadow-lg;
  max-width: 500px;
  width: 100%;
  border: 1px solid tokens.$border-light;
}

.page-title {
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  margin-bottom: tokens.$spacing-xl;
  text-align: center;
  color: tokens.$text-primary;
}

/* 表单区域 */
.form-section {
  margin-bottom: tokens.$spacing-xl;
}

.form-label {
  display: block;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-sm;
}

/* 游戏类型选择 */
.game-type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: tokens.$spacing-md;
}

.game-type-btn {
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  border: 2px solid tokens.$border-light;
  background: tokens.$bg-light;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  @include utils.flex-col(tokens.$spacing-xs, center, center);

  &:hover {
    border-color: tokens.$primary-blue;
    background: tokens.$bg-lighter;
  }

  &.type-selected {
    border-color: tokens.$primary-blue;
    background: rgb(59 130 246 / 20%);

    .type-label {
      color: tokens.$primary-blue;
    }
  }

  &.type-default {
    .type-label {
      color: tokens.$text-primary;
    }
  }
}

.type-label {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;
  margin-bottom: tokens.$spacing-xs;
}

.type-desc {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
  text-align: center;
}

/* 输入框 */
.form-input {
  width: 100%;
  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-md;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-base;
  transition: all tokens.$transition-fast;

  &:focus {
    outline: none;
    border-color: tokens.$primary-blue;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 10%);
  }

  &::placeholder {
    color: tokens.$text-muted;
  }

  &.input-error {
    border-color: tokens.$error;
  }
}

.input-footer {
  @include utils.flex-between;

  margin-top: tokens.$spacing-xs;
}

.error-text {
  font-size: tokens.$font-size-xs;
  color: tokens.$error;
}

.char-count {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

/* 发布按钮 */
.btn-publish {
  width: 100%;
  padding: tokens.$spacing-md;
  background: tokens.$primary-blue;
  color: white;
  font-weight: tokens.$font-weight-medium;
  border-radius: tokens.$radius-md;
  border: none;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover:not(:disabled) {
    background: tokens.$primary-dark;
  }

  &:disabled {
    background: tokens.$bg-light;
    color: tokens.$text-muted;
    cursor: not-allowed;
  }
}

/* 响应式设计 */
@include utils.mobile {
  .game-setup-content {
    padding: tokens.$spacing-lg;
    margin: tokens.$spacing-md;
  }

  .game-type-grid {
    grid-template-columns: 1fr;
  }
}
</style>
