<template>
  <div class="game-release-app">
    <!-- 应用头部 -->
    <div class="app-header">
      <h2 class="app-title">游戏发布</h2>
      <button
        class="close-btn"
        @click="closeApp"
      >
        ×
      </button>
    </div>

    <!-- 应用内容 -->
    <div class="app-content">
      <!-- 发布状态 -->
      <div class="release-status">
        <div
          class="status-card"
          :class="releaseStatus"
        >
          <div class="status-icon">{{ getStatusIcon() }}</div>
          <div class="status-text">{{ getStatusText() }}</div>
        </div>
      </div>

      <!-- 发布配置 -->
      <div class="release-config">
        <h3 class="section-title">发布配置</h3>

        <div class="config-form">
          <div class="form-group">
            <label class="form-label">游戏版本</label>
            <input
              v-model="releaseConfig.version"
              type="text"
              class="form-input"
              placeholder="例如: 1.0.0"
            />
          </div>

          <div class="form-group">
            <label class="form-label">更新说明</label>
            <textarea
              v-model="releaseConfig.changelog"
              class="form-textarea"
              rows="4"
              placeholder="输入本次更新的说明..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">发布渠道</label>
            <div class="channel-list">
              <label
                v-for="channel in channels"
                :key="channel.id"
                class="channel-item"
              >
                <input
                  v-model="releaseConfig.selectedChannels"
                  type="checkbox"
                  :value="channel.id"
                  class="channel-checkbox"
                />
                <span class="channel-name">{{ channel.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 发布历史 -->
      <div class="release-history">
        <h3 class="section-title">发布历史</h3>
        <div class="history-list">
          <div
            v-for="release in releaseHistory"
            :key="release.id"
            class="history-item"
          >
            <div class="history-header">
              <span class="history-version">v{{ release.version }}</span>
              <span class="history-date">{{ release.date }}</span>
            </div>
            <div class="history-channels">
              <span
                v-for="channel in release.channels"
                :key="channel"
                class="channel-tag"
              >
                {{ channel }}
              </span>
            </div>
            <div class="history-changelog">{{ release.changelog }}</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="app-actions">
        <button
          class="action-btn primary"
          :disabled="isReleasing"
          @click="startRelease"
        >
          {{ isReleasing ? '发布中...' : '开始发布' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 发布状态
const releaseStatus = ref<'idle' | 'releasing' | 'success' | 'failed'>('idle');
const isReleasing = ref(false);

// 发布配置
const releaseConfig = ref({
  version: '1.0.0',
  changelog: '',
  selectedChannels: [] as string[],
});

// 发布渠道
const channels = ref([
  { id: 'appstore', name: 'App Store' },
  { id: 'googleplay', name: 'Google Play' },
  { id: 'steam', name: 'Steam' },
  { id: 'epic', name: 'Epic Games' },
  { id: 'tap', name: 'TapTap' },
]);

// 发布历史
interface Release {
  id: number;
  version: string;
  date: string;
  channels: string[];
  changelog: string;
}

const releaseHistory = ref<Release[]>([
  {
    id: 1,
    version: '0.9.0',
    date: '2024-01-15',
    channels: ['App Store', 'Google Play'],
    changelog: 'Beta版本发布，包含基础游戏功能',
  },
  {
    id: 2,
    version: '0.8.0',
    date: '2024-01-01',
    channels: ['TestFlight'],
    changelog: 'Alpha测试版本',
  },
]);

// 获取状态图标
const getStatusIcon = (): string => {
  const icons: Record<string, string> = {
    idle: '📦',
    releasing: '🚀',
    success: '✅',
    failed: '❌',
  };
  return icons[releaseStatus.value] || '📦';
};

// 获取状态文本
const getStatusText = (): string => {
  const texts: Record<string, string> = {
    idle: '准备发布',
    releasing: '正在发布...',
    success: '发布成功',
    failed: '发布失败',
  };
  return texts[releaseStatus.value] || '准备发布';
};

// 开始发布
const startRelease = () => {
  if (releaseConfig.value.selectedChannels.length === 0) {
    alert('请至少选择一个发布渠道');
    return;
  }

  isReleasing.value = true;
  releaseStatus.value = 'releasing';

  // 模拟发布过程
  setTimeout(() => {
    isReleasing.value = false;
    releaseStatus.value = 'success';

    // 添加到历史记录
    const selectedChannelNames = channels.value
      .filter((c) => releaseConfig.value.selectedChannels.includes(c.id))
      .map((c) => c.name);

    releaseHistory.value.unshift({
      id: Date.now(),
      version: releaseConfig.value.version,
      date: new Date().toISOString().split('T')[0],
      channels: selectedChannelNames,
      changelog: releaseConfig.value.changelog || '无更新说明',
    });

    // 重置状态
    setTimeout(() => {
      releaseStatus.value = 'idle';
    }, 3000);
  }, 3000);
};

// 关闭应用
const closeApp = () => {
  window.history.back();
};
</script>

<style lang="scss" scoped>

.game-release-app {
  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);
  height: 100%;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-lg;
  overflow: hidden;
}

.app-header {
  @include utils.flex-between;
  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: linear-gradient(135deg, tokens.$success 0%, #059669 100%);
  color: tokens.$text-primary;

  .app-title {
    margin: 0;
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-bold;
  }

  .close-btn {
    background: none;
    border: none;
    color: tokens.$text-primary;
    font-size: tokens.$font-size-2xl;
    cursor: pointer;
    width: 32px;
    height: 32px;
    @include utils.flex-center;
    border-radius: 50%;
    transition: all tokens.$transition-normal;

    &:hover {
      background-color: rgb(255 255 255 / 20%);
    }
  }
}

.app-content {
  @include utils.flex-col(tokens.$spacing-lg, stretch, flex-start);
  flex: 1;
  padding: tokens.$spacing-xl;
  overflow-y: auto;
}

.release-status {
  @include utils.flex-center;

  .status-card {
    @include utils.flex-col(tokens.$spacing-md, center, center);
    padding: tokens.$spacing-xl;
    border-radius: tokens.$radius-xl;
    min-width: 200px;
    transition: all tokens.$transition-normal;

    &.idle {
      background: linear-gradient(135deg, tokens.$bg-light 0%, tokens.$bg-lighter 100%);
      border: 2px solid tokens.$border-light;
    }

    &.releasing {
      background: linear-gradient(135deg, tokens.$primary 0%, tokens.$primary-dark 100%);
      animation: pulse 1.5s ease-in-out infinite;
    }

    &.success {
      background: linear-gradient(135deg, tokens.$success 0%, #059669 100%);
    }

    &.failed {
      background: linear-gradient(135deg, tokens.$error 0%, #dc2626 100%);
    }

    .status-icon {
      font-size: 48px;
    }

    .status-text {
      font-size: tokens.$font-size-lg;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgb(74 158 255 / 40%);
  }

  50% {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgb(74 158 255 / 60%);
  }
}

.release-config {
  .section-title {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }
}

.config-form {
  @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);
}

.form-group {
  @include utils.flex-col(tokens.$spacing-sm, stretch, flex-start);
}

.form-label {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

.form-input,
.form-textarea {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  font-size: tokens.$font-size-base;
  border: 2px solid tokens.$border-light;
  border-radius: tokens.$radius-md;
  background-color: tokens.$bg-light;
  color: tokens.$text-primary;
  outline: none;
  transition: all tokens.$transition-normal;

  &:focus {
    border-color: tokens.$success;
    box-shadow: 0 0 0 3px rgb(16 185 129 / 20%);
  }

  &::placeholder {
    color: tokens.$text-muted;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.channel-list {
  @include utils.flex-row(tokens.$spacing-sm, center, flex-start);
  flex-wrap: wrap;
}

.channel-item {
  @include utils.flex-row(tokens.$spacing-sm, center, flex-start);
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border: 2px solid tokens.$border-light;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-normal;

  &:hover {
    border-color: tokens.$success;
  }

  &:has(.channel-checkbox:checked) {
    background-color: rgb(16 185 129 / 20%);
    border-color: tokens.$success;
  }

  .channel-checkbox {
    width: 18px;
    height: 18px;
    accent-color: tokens.$success;
  }

  .channel-name {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-primary;
  }
}

.release-history {
  .section-title {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }
}

.history-list {
  @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);
}

.history-item {
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  border: 1px solid tokens.$border-light;
  transition: all tokens.$transition-normal;

  &:hover {
    border-color: tokens.$success;
    box-shadow: 0 4px 15px rgb(16 185 129 / 20%);
  }

  .history-header {
    @include utils.flex-between;
    margin-bottom: tokens.$spacing-sm;

    .history-version {
      font-size: tokens.$font-size-lg;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$success;
    }

    .history-date {
      font-size: tokens.$font-size-sm;
      color: tokens.$text-muted;
    }
  }

  .history-channels {
    @include utils.flex-row(tokens.$spacing-xs, center, flex-start);
    margin-bottom: tokens.$spacing-sm;

    .channel-tag {
      padding: tokens.$spacing-xs tokens.$spacing-sm;
      background-color: tokens.$bg-lighter;
      border-radius: tokens.$radius-sm;
      font-size: tokens.$font-size-xs;
      color: tokens.$text-muted;
    }
  }

  .history-changelog {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-primary;
    line-height: tokens.$line-height-normal;
  }
}

.app-actions {
  margin-top: auto;

  .action-btn {
    width: 100%;
    padding: tokens.$spacing-md tokens.$spacing-xl;
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
    background: linear-gradient(135deg, tokens.$success 0%, #059669 100%);
    border: none;
    border-radius: tokens.$radius-md;
    cursor: pointer;
    transition: all tokens.$transition-normal;
    box-shadow: 0 4px 15px rgb(16 185 129 / 40%);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgb(16 185 129 / 60%);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
}

/* 响应式设计 */
@media (width <= 768px) {
  .app-content {
    padding: tokens.$spacing-lg tokens.$spacing-md;
  }

  .channel-list {
    flex-direction: column;
    align-items: stretch;
  }

  .channel-item {
    width: 100%;
  }
}
</style>
