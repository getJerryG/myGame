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
      <div v-if="activeTab === 'pending'" class="tab-content">
        <div class="content-list">
          <div
            v-for="item in pendingContent"
            :key="item.id"
            class="content-item"
          >
            <div class="content-info">
              <div class="content-type">
                {{ GameReleaseService.getItemTypeLabel(item.type) }}
              </div>
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
          <div v-if="pendingContent.length === 0" class="empty-state">
            <p>暂无待发布内容</p>
          </div>
        </div>

        <div class="action-section">
          <button class="confirm-btn" @click="confirmRelease">确认发布</button>
        </div>
      </div>

      <!-- 版本历史 -->
      <div v-else-if="activeTab === 'history'" class="tab-content">
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
              <div class="version-status" :class="version.status">
                {{ version.status }}
              </div>
            </div>

            <div class="version-content">
              <div class="content-section">
                <h4>更新内容</h4>
                <ul class="update-list">
                  <li v-for="(item, index) in version.content" :key="index">
                    {{ GameReleaseService.getItemTypeLabel(item.type) }}：{{
                      item.name
                    }}
                  </li>
                </ul>
              </div>

              <div class="content-section">
                <h4>玩家反馈</h4>
                <div class="feedback-stats">
                  <div class="feedback-item">
                    <span class="feedback-label">好评率：</span>
                    <span class="feedback-value"
                      >{{ version.feedback.positiveRate }}%</span
                    >
                  </div>
                  <div class="feedback-item">
                    <span class="feedback-label">BUG报告：</span>
                    <span class="feedback-value">{{
                      version.feedback.bugReports
                    }}</span>
                  </div>
                  <div class="feedback-item">
                    <span class="feedback-label">建议数量：</span>
                    <span class="feedback-value">{{
                      version.feedback.suggestions
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="versionHistory.length === 0" class="empty-state">
            <p>暂无版本历史</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 导入类型
import type { App } from "../../../types/app";
import type { GameData } from "../../../types/game";
import type { Modal } from "../../../types/modal";

// 导入服务
import { GameReleaseService } from "../../../../services/GameReleaseService";

// Props定义
defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// 活跃标签页
const activeTab = ref("pending");

// 待发布内容
const pendingContent = ref<GameReleaseData[]>([]);

// 版本历史
const versionHistory = ref<GameReleaseData[]>([]);

// 加载数据
const loadData = (): void => {
  pendingContent.value = GameReleaseService.getPendingContent();
  versionHistory.value = GameReleaseService.getVersionHistory();
};

// 确认发布
const confirmRelease = async (): Promise<void> => {
  try {
    const result = await GameReleaseService.confirmRelease(
      pendingContent.value,
    );
    if (result) {
      alert("发布成功");
      loadData();
    }
  } catch (error) {
    console.error("发布失败:", error);
    alert("发布失败");
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.game-release-app {
  @include utils.flex-col(0, stretch, flex-start);

  height: 100%;
  background-color: tokens.$bg-light;
  color: tokens.$text-primary;

  .app-header {
    padding: tokens.$spacing-md;
    border-bottom: 1px solid rgba(tokens.$primary-blue, 0.2);
    background-color: tokens.$bg-light;

    h2 {
      margin: 0;
      font-size: tokens.$font-size-xl;
      color: tokens.$text-primary;
    }
  }

  .app-tabs {
    @include utils.flex-row(0, center, flex-start);

    background-color: tokens.$bg-light;
    border-bottom: 1px solid rgba(tokens.$primary-blue, 0.2);

    .tab-btn {
      flex: 1;
      padding: tokens.$spacing-md;
      background: transparent;
      border: none;
      color: tokens.$text-muted;
      font-size: tokens.$font-size-sm;
      font-weight: tokens.$font-weight-medium;
      cursor: pointer;
      transition: all tokens.$transition-fast;

      &:hover {
        background-color: rgba(tokens.$primary-blue, 0.2);
        color: tokens.$text-primary;
      }

      &.active {
        background-color: rgba(tokens.$primary-blue, 0.3);
        color: tokens.$text-primary;
        border-bottom: 2px solid tokens.$primary-blue;
      }
    }
  }

  .app-content {
    flex: 1;
    padding: tokens.$spacing-md;
    overflow-y: auto;

    .tab-content {
      height: 100%;
    }
  }

  // 待发布内容样式
  .content-list {
    @include utils.flex-col(tokens.$spacing-md);
  }

  .content-item {
    @include utils.flex-between(flex-start);

    background-color: tokens.$bg-light;
    padding: tokens.$spacing-md;
    border-radius: tokens.$radius-md;
    border: 1px solid rgba(tokens.$primary-blue, 0.2);
    transition: all tokens.$transition-fast;

    &:hover {
      border-color: rgba(tokens.$primary-blue, 0.5);
      transform: translateY(-2px);
    }

    .content-info {
      flex: 1;

      .content-type {
        display: inline-block;
        padding: tokens.$spacing-xs tokens.$spacing-sm;
        background-color: rgba(tokens.$primary-blue, 0.2);
        border-radius: tokens.$radius-sm;
        font-size: tokens.$font-size-xs;
        color: tokens.$primary-blue;
        margin-bottom: tokens.$spacing-sm;
      }

      .content-name {
        font-size: tokens.$font-size-base;
        font-weight: tokens.$font-weight-bold;
        color: tokens.$text-primary;
        margin-bottom: tokens.$spacing-xs;
      }

      .content-meta {
        @include utils.flex-row(tokens.$spacing-md, center, flex-start);

        .content-status {
          font-size: tokens.$font-size-xs;
          color: tokens.$success;
        }

        .content-date {
          font-size: tokens.$font-size-xs;
          color: tokens.$text-muted;
        }
      }
    }

    .content-release-options {
      @include utils.flex-col(tokens.$spacing-md, flex-end);

      .release-option {
        @include utils.flex-col(tokens.$spacing-sm);

        .option-label {
          font-size: tokens.$font-size-sm;
          color: tokens.$text-muted;
        }

        .radio-group {
          @include utils.flex-row(tokens.$spacing-lg);

          .radio-option {
            @include utils.flex-row(tokens.$spacing-xs);

            cursor: pointer;

            input {
              &[type="radio"] {
                accent-color: tokens.$primary-blue;
              }
            }

            span {
              font-size: tokens.$font-size-sm;
              color: tokens.$text-primary;
            }
          }
        }
      }
    }
  }

  .action-section {
    @include utils.flex-center;

    padding: tokens.$spacing-lg;
    background-color: tokens.$bg-light;
    border-radius: tokens.$radius-md;

    .confirm-btn {
      padding: tokens.$spacing-sm tokens.$spacing-xl;
      background-color: tokens.$primary-blue;
      border: none;
      border-radius: tokens.$radius-md;
      color: tokens.$text-primary;
      font-size: tokens.$font-size-base;
      font-weight: tokens.$font-weight-bold;
      cursor: pointer;
      transition: all tokens.$transition-fast;

      &:hover {
        background-color: tokens.$primary-dark;
        transform: translateY(-1px);
      }
    }
  }

  // 版本历史样式
  .version-list {
    @include utils.flex-col(tokens.$spacing-md);
  }

  .version-item {
    background-color: tokens.$bg-light;
    padding: tokens.$spacing-md;
    border-radius: tokens.$radius-md;
    border: 1px solid rgba(tokens.$primary-blue, 0.2);
    transition: all tokens.$transition-fast;

    &:hover {
      border-color: rgba(tokens.$primary-blue, 0.5);
      transform: translateY(-2px);
    }

    .version-header {
      @include utils.flex-between;

      margin-bottom: tokens.$spacing-md;

      .version-info {
        .version-name {
          font-size: tokens.$font-size-lg;
          font-weight: tokens.$font-weight-bold;
          color: tokens.$text-primary;
          margin-bottom: tokens.$spacing-xs;
        }

        .version-date {
          font-size: tokens.$font-size-xs;
          color: tokens.$text-muted;
        }
      }

      .version-status {
        padding: tokens.$spacing-xs tokens.$spacing-md;
        border-radius: tokens.$radius-full;
        font-size: tokens.$font-size-sm;
        font-weight: tokens.$font-weight-bold;

        &.已发布 {
          background-color: rgba(tokens.$success, 0.2);
          color: tokens.$success;
        }

        &.测试中 {
          background-color: rgba(tokens.$warning, 0.2);
          color: tokens.$warning;
        }

        &.已撤回 {
          background-color: rgba(tokens.$error, 0.2);
          color: tokens.$error;
        }
      }
    }

    .version-content {
      @include utils.flex-col(tokens.$spacing-md);

      .content-section {
        h4 {
          margin: 0 0 tokens.$spacing-sm;
          font-size: tokens.$font-size-base;
          color: tokens.$primary-blue;
        }
      }

      .update-list {
        list-style: none;
        padding: 0;
        margin: 0;

        @include utils.flex-col(tokens.$spacing-sm);

        li {
          font-size: tokens.$font-size-sm;
          color: tokens.$text-primary;
          padding-left: tokens.$spacing-md;
          position: relative;

          &::before {
            content: "•";
            color: tokens.$primary-blue;
            font-weight: tokens.$font-weight-bold;
            position: absolute;
            left: 0;
          }
        }
      }

      .feedback-stats {
        @include utils.flex-row(tokens.$spacing-xl, center, flex-start);

        flex-wrap: wrap;

        .feedback-item {
          @include utils.flex-row(tokens.$spacing-sm);

          .feedback-label {
            font-size: tokens.$font-size-sm;
            color: tokens.$text-muted;
          }

          .feedback-value {
            font-size: tokens.$font-size-sm;
            font-weight: tokens.$font-weight-bold;
            color: tokens.$primary-blue;
          }
        }
      }
    }
  }

  .empty-state {
    @include utils.flex-center;

    height: 200px;
    background-color: tokens.$bg-light;
    border: 1px dashed rgba(tokens.$primary-blue, 0.2);
    border-radius: tokens.$radius-md;

    p {
      margin: 0;
      color: tokens.$text-muted;
      font-size: tokens.$font-size-base;
    }
  }
}
</style>
