<template>
  <div class="game-release-app">
    <!-- 应用头部 -->
    <div class="app-header">
      <h2>游戏发布</h2>
    </div>

    <!-- 标签页导�?-->
    <div class="app-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'pending' }"
        @click="activeTab = 'pending'"
      >
        待发布内容
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'history' }"
        @click="activeTab = 'history'"
      >
        版本历史
      </button>
    </div>

    <!-- 标签页内容-->
    <div class="app-content">
      <!-- 待发布内容-->
      <div
        v-if="activeTab === 'pending'"
        class="tab-content"
      >
        <div class="content-list">
          <div
            v-for="item in pendingContent"
            :key="item.id"
            class="content-item"
          >
            <div class="content-info">
              <div class="content-type">{{ GameReleaseService.getItemTypeLabel(item.type) }}</div>
              <div class="content-name">{{ item.name }}</div>
              <div class="content-meta">
                <span class="content-status">{{ item.status }}</span>
                <span class="content-date">{{ item.createdDate }}</span>
              </div>
            </div>

            <div class="content-release-options">
              <div class="release-option">
                <span class="option-label">发布渠道</span>
                <div class="radio-group">
                  <label class="radio-option">
                    <input
                      type="radio"
                      v-model="item.releaseChannel"
                      value="experience"
                    />
                    <span>体验服</span>
                  </label>
                  <label class="radio-option">
                    <input
                      type="radio"
                      v-model="item.releaseChannel"
                      value="official"
                    />
                    <span>正式服</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="pendingContent.length === 0"
            class="empty-state"
          >
            <p>暂无待发布内容</p>
          </div>
        </div>

        <div class="action-section">
          <button
            class="confirm-btn"
            @click="confirmRelease"
          >
            确认发布
          </button>
        </div>
      </div>

      <!-- 版本历史 -->
      <div
        v-else-if="activeTab === 'history'"
        class="tab-content"
      >
        <div class="version-list">
          <div
            v-for="version in versionHistory"
            :key="version.id"
            class="version-item"
          >
            <div class="version-header">
              <div class="version-info">
                <div class="version-name">版本 {{ version.version }}</div>
                <div class="version-date">{{ version.releaseDate }}</div>
              </div>
              <div
                class="version-status"
                :class="version.status"
              >
                {{ version.status }}
              </div>
            </div>

            <div class="version-content">
              <div class="content-section">
                <h4>更新内容</h4>
                <ul class="update-list">
                  <li
                    v-for="(item, index) in version.content"
                    :key="index"
                  >
                    {{ GameReleaseService.getItemTypeLabel(item.type) }}：{{ item.name }}
                  </li>
                </ul>
              </div>

              <div class="content-section">
                <h4>玩家反馈</h4>
                <div class="feedback-stats">
                  <div class="feedback-item">
                    <span class="feedback-label">好评率：</span>
                    <span class="feedback-value">{{ version.feedback.positiveRate }}%</span>
                  </div>
                  <div class="feedback-item">
                    <span class="feedback-label">BUG报告：</span>
                    <span class="feedback-value">{{ version.feedback.bugReports }}</span>
                  </div>
                  <div class="feedback-item">
                    <span class="feedback-label">建议数量：</span>
                    <span class="feedback-value">{{ version.feedback.suggestions }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="versionHistory.length === 0"
            class="empty-state"
          >
            <p>暂无版本历史</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 导入类型
import type { App } from '../../../types/app';
import type { GameData } from '../../../types/game';
import type { Modal } from '../../../types/modal';

// 导入服务
import { GameReleaseService } from '../../../../services/GameReleaseService';

// Props定义
defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// 活跃标签页
const activeTab = ref('pending');

// 待发布内容
const pendingContent = ref<any[]>([]);

// 版本历史
const versionHistory = ref<any[]>([]);

// 加载数据
const loadData = () => {
  pendingContent.value = GameReleaseService.getPendingContent();
  versionHistory.value = GameReleaseService.getVersionHistory();
};

// 确认发布
const confirmRelease = async () => {
  try {
    const result = await GameReleaseService.confirmRelease(pendingContent.value);
    if (result) {
      alert('发布成功');
      // 重新加载数据
      loadData();
    }
  } catch (error) {
    console.error('发布失败:', error);
    alert('发布失败');
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.game-release-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgb(26 26 46 / 50%);
  color: var(--text-primary);
}

// 待发布内容样式
.content-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: rgb(0 0 0 / 10%);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgb(74 158 255 / 20%);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgb(74 158 255 / 50%);
    transform: translateY(-2px);
  }
}

.content-info {
  flex: 1;

  .content-type {
    display: inline-block;
    padding: 4px 8px;
    background-color: rgb(74 158 255 / 20%);
    border-radius: 4px;
    font-size: 12px;
    color: #4a9eff;
    margin-bottom: 8px;
  }

  .content-name {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 4px;
  }

  .content-meta {
    display: flex;
    gap: 12px;

    .content-status {
      font-size: 12px;
      color: #2ed573;
    }

    .content-date {
      font-size: 12px;
      color: #b0b0b0;
    }
  }
}

.content-release-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.release-option {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .option-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  input[type='radio'] {
    accent-color: #4a9eff;
  }

  span {
    font-size: var(--text-sm);
    color: var(--text-primary);
  }
}

.action-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
}

.confirm-btn {
  padding: 12px 32px;
  background-color: #4a9eff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #357abd;
    transform: translateY(-1px);
  }
}

// 版本历史样式
.version-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.version-item {
  background-color: rgb(0 0 0 / 10%);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgb(74 158 255 / 20%);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgb(74 158 255 / 50%);
    transform: translateY(-2px);
  }
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .version-info {
    .version-name {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 4px;
    }

    .version-date {
      font-size: 12px;
      color: #b0b0b0;
    }
  }

  .version-status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: bold;

    &.已发布 {
      background-color: rgb(46 213 115 / 20%);
      color: #2ed573;
    }

    &.测试中 {
      background-color: rgb(255 215 0 / 20%);
      color: #ffd700;
    }

    &.已撤回 {
      background-color: rgb(255 71 87 / 20%);
      color: #ff4757;
    }
  }
}

.version-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-section {
  h4 {
    margin: 0 0 12px;
    font-size: 16px;
    color: #4a9eff;
  }
}

.update-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    font-size: 14px;
    color: #fff;
    padding-left: 16px;
    position: relative;

    &::before {
      content: '•';
      color: #4a9eff;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
  }
}

.feedback-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.feedback-item {
  display: flex;
  gap: 8px;

  .feedback-label {
    font-size: 14px;
    color: #b0b0b0;
  }

  .feedback-value {
    font-size: 14px;
    font-weight: bold;
    color: #4a9eff;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: rgb(0 0 0 / 10%);
  border: 1px dashed rgb(74 158 255 / 20%);
  border-radius: 8px;

  p {
    margin: 0;
    color: #b0b0b0;
    font-size: 16px;
  }
}
</style>
