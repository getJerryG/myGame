<template>
  <div class="game-release-container">
    <h2 class="page-title">游戏公开发布</h2>

    <div class="release-grid">
      <!-- 发布信息 -->
      <div class="release-card">
        <h3 class="card-title">发布准备</h3>

        <div class="info-list">
          <div class="info-item">
            <label class="info-label">游戏名称</label>
            <div class="info-value">
              {{ simulationStore.gameSetup.gameName }}
            </div>
          </div>

          <div class="info-item">
            <label class="info-label">游戏类型</label>
            <div class="info-value">
              {{ gameTypeLabels[simulationStore.gameSetup.gameType] }}
            </div>
          </div>

          <div class="info-item">
            <label class="info-label">发布日期</label>
            <div class="info-value">
              第{{ simulationStore.gameState.year }}年{{
                simulationStore.gameState.month
              }}月{{ simulationStore.gameState.day }}日
            </div>
          </div>

          <div class="info-item">
            <label class="info-label">初始下载渠道</label>
            <div class="channels-grid">
              <div
                v-for="channel in initialChannels"
                :key="channel"
                class="channel-item"
              >
                <input
                  type="checkbox"
                  :id="`channel-${channel}`"
                  :checked="true"
                  disabled
                  class="channel-checkbox"
                />
                <label :for="`channel-${channel}`" class="channel-label">{{
                  channel
                }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="release-action">
          <button
            @click="releaseGame"
            :disabled="isReleasing"
            class="btn-release"
          >
            <span v-if="!isReleasing">🚀 发布游戏</span>
            <span v-else>⏳ 发布中...</span>
          </button>
        </div>
      </div>

      <!-- 发布公告 -->
      <div class="release-card">
        <h3 class="card-title">发布公告</h3>

        <div class="announcement-box">
          <div class="announcement-title">
            🎉 {{ simulationStore.gameSetup.gameName }} 正式发布 🎉
          </div>

          <div class="announcement-content">
            <p>亲爱的玩家们：</p>
            <p>
              经过精心策划和开发，{{
                gameTypeLabels[simulationStore.gameSetup.gameType]
              }}游戏《{{
                simulationStore.gameSetup.gameName
              }}》正式与大家见面了！
            </p>
            <p>游戏特色：</p>
            <ul class="feature-list">
              <li>独特的游戏玩法设计</li>
              <li>精美的游戏画面</li>
              <li>丰富的英雄/卡牌/休闲内容</li>
              <li>公平的竞技环境</li>
            </ul>
            <p>我们将持续更新内容，为大家带来更好的游戏体验。</p>
            <p>感谢大家的支持与期待！</p>
            <p class="announcement-footer">
              ——《{{ simulationStore.gameSetup.gameName }}》开发团队
            </p>
          </div>
        </div>

        <div class="regenerate-action">
          <button @click="generateNewAnnouncement" class="btn-regenerate">
            🔄 重新生成公告
          </button>
        </div>
      </div>
    </div>

    <!-- 发布结果 -->
    <div v-if="releaseResult" class="result-card">
      <h3 class="result-title">发布成功！</h3>

      <div class="result-stats">
        <div class="stat-box stat-downloads">
          <div class="stat-number">{{ releaseResult.initialDownloads }}</div>
          <div class="stat-label">初始下载量</div>
        </div>

        <div class="stat-box stat-revenue">
          <div class="stat-number">{{ releaseResult.initialRevenue }}</div>
          <div class="stat-label">初始收入</div>
        </div>

        <div class="stat-box stat-sentiment">
          <div class="stat-number">{{ releaseResult.initialSentiment }}</div>
          <div class="stat-label">初始市场情绪</div>
        </div>
      </div>

      <div class="result-analysis">
        <h4 class="analysis-title">发布效果分析</h4>
        <ul class="analysis-list">
          <li>游戏已成功发布到{{ initialChannels.length }}个初始渠道</li>
          <li>预计首周下载量将达到{{ releaseResult.initialDownloads * 7 }}+</li>
          <li>市场情绪良好，玩家反馈积极</li>
          <li>核心数据面板已解锁，可开始监控游戏运营数据</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSimulationStore } from "../../stores/simulationStore";

const simulationStore = useSimulationStore();
const isReleasing = ref(false);
const releaseResult = ref(null);

// 游戏类型标签
const gameTypeLabels = {
  moba: "MOBA",
  card: "卡牌",
  casual: "休闲竞技",
};

// 初始下载渠道
const initialChannels = ["官方网站", "应用商店", "游戏平台", "社交媒体"];

// 发布游戏
const releaseGame = async (): Promise<void> => {
  isReleasing.value = true;

  // 模拟发布过程
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 记录发布操作
  simulationStore.recordAction("releaseGame", {
    channels: initialChannels,
    date: simulationStore.gameState.currentDate,
  });

  // 生成初始数据
  const initialDownloads = Math.floor(5000 + Math.random() * 5000);
  const initialRevenue = Math.floor(initialDownloads * 0.1 * 100) / 100;
  const initialSentiment = Math.floor(60 + Math.random() * 20);

  // 保存发布结果
  releaseResult.value = {
    initialDownloads,
    initialRevenue,
    initialSentiment,
  };

  // 更新游戏状态
  simulationStore.gameState.currentPhase = "growth";

  // 发布新版本后更新游戏日期
  simulationStore.nextDay();

  isReleasing.value = false;
};

// 重新生成公告
const generateNewAnnouncement = (): void => {
  // 这里可以添加重新生成公告的逻辑
  // console.log('重新生成公告');
};
</script>

<style lang="scss" scoped>
.game-release-container {
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

.release-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: tokens.$spacing-xl;

  @include utils.mobile {
    grid-template-columns: 1fr;
  }
}

.release-card {
  background: tokens.$bg-secondary;
  padding: tokens.$spacing-xl;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  border: 1px solid tokens.$border-light;
}

.card-title {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-semibold;
  margin-bottom: tokens.$spacing-lg;
  color: tokens.$text-primary;
}

/* 信息列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-md;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
}

.info-label {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-secondary;
}

.info-value {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: tokens.$spacing-sm;
}

.channel-item {
  @include utils.flex-row(tokens.$spacing-sm, center);
}

.channel-checkbox {
  margin-right: tokens.$spacing-sm;
}

.channel-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

/* 发布按钮 */
.release-action {
  margin-top: tokens.$spacing-xl;
}

.btn-release {
  width: 100%;
  padding: tokens.$spacing-md;
  background: linear-gradient(
    135deg,
    tokens.$primary-blue 0%,
    tokens.$lottery-purple 100%
  );
  color: white;
  font-weight: tokens.$font-weight-medium;
  border-radius: tokens.$radius-md;
  border: none;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    &:not(:disabled) {
      box-shadow: tokens.$shadow-lg;
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* 公告 */
.announcement-box {
  background: tokens.$bg-light;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  border-left: 4px solid tokens.$primary-blue;
}

.announcement-title {
  text-align: center;
  font-weight: tokens.$font-weight-bold;
  font-size: tokens.$font-size-xl;
  margin-bottom: tokens.$spacing-md;
  color: tokens.$primary-blue;
}

.announcement-content {
  color: tokens.$text-secondary;

  p {
    margin-bottom: tokens.$spacing-sm;
  }
}

.feature-list {
  list-style: disc;
  padding-left: tokens.$spacing-lg;
  margin-bottom: tokens.$spacing-sm;

  li {
    margin-bottom: tokens.$spacing-xs;
  }
}

.announcement-footer {
  text-align: right;
  color: tokens.$text-muted;
  margin-top: tokens.$spacing-md;
  margin-bottom: 0;
}

/* 重新生成按钮 */
.regenerate-action {
  margin-top: tokens.$spacing-md;
}

.btn-regenerate {
  font-size: tokens.$font-size-sm;
  color: tokens.$primary-blue;
  background: none;
  border: none;
  cursor: pointer;
  transition: color tokens.$transition-fast;

  &:hover {
    color: tokens.$primary-light;
  }
}

/* 发布结果 */
.result-card {
  margin-top: tokens.$spacing-xl;
  background: tokens.$bg-secondary;
  padding: tokens.$spacing-xl;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  border: 2px solid tokens.$success;
}

.result-title {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-semibold;
  margin-bottom: tokens.$spacing-lg;
  color: tokens.$success;
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: tokens.$spacing-md;
  margin-bottom: tokens.$spacing-lg;

  @include utils.mobile {
    grid-template-columns: 1fr;
  }
}

.stat-box {
  text-align: center;
  padding: tokens.$spacing-lg;
  border-radius: tokens.$radius-md;

  &.stat-downloads {
    background: rgb(16 185 129 / 10%);
  }

  &.stat-revenue {
    background: rgb(59 130 246 / 10%);
  }

  &.stat-sentiment {
    background: rgb(139 92 246 / 10%);
  }

  .stat-number {
    font-size: tokens.$font-size-3xl;
    font-weight: tokens.$font-weight-bold;
    margin-bottom: tokens.$spacing-xs;

    .stat-downloads & {
      color: tokens.$success;
    }

    .stat-revenue & {
      color: tokens.$primary-blue;
    }

    .stat-sentiment & {
      color: tokens.$lottery-purple;
    }
  }

  .stat-label {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }
}

/* 效果分析 */
.result-analysis {
  background: tokens.$bg-light;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
}

.analysis-title {
  font-weight: tokens.$font-weight-semibold;
  margin-bottom: tokens.$spacing-sm;
  color: tokens.$text-primary;
}

.analysis-list {
  list-style: disc;
  padding-left: tokens.$spacing-lg;
  color: tokens.$text-secondary;

  li {
    margin-bottom: tokens.$spacing-xs;
  }
}
</style>
