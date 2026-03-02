<template>
  <div class="home-page">
    <!-- 背景 - 使用CSS而非图片，避免LCP延迟 -->
    <div class="home-background" aria-hidden="true"></div>

    <!-- 主要内容 -->
    <div class="home-content">
      <!-- 左侧：游戏标题和游戏描述 -->
      <div class="left-column">
        <!-- 游戏标题 - LCP元素，确保快速渲染 -->
        <div class="game-title" data-lcp-element>
          <h1>策划大师：王者经营</h1>
          <p class="subtitle">游戏开发模拟</p>
        </div>

        <!-- 游戏描述 -->
        <div class="game-description">
          <p>
            在这个游戏中，你将扮演一名游戏策划师，从无到有创建属于自己的游戏帝国！
          </p>
          <p>设计游戏玩法、管理团队、制定营销策略，最终成为游戏行业的王者！</p>
          <p>体验真实的游戏开发流程，感受策划大师的成长之路！</p>
        </div>
      </div>

      <!-- 右侧：功能按钮区 -->
      <div class="right-column">
        <div class="button-container">
          <!-- 主要按钮 -->
          <button class="main-button" @click="startNewGame">开始新游戏</button>

          <button class="main-button" @click="showSaveModal = true">
            继续游戏
          </button>

          <!-- 次要按钮 -->
          <button class="secondary-button" @click="openSettings">设置</button>

          <button class="secondary-button" @click="openAbout">关于</button>
        </div>
      </div>
    </div>

    <!-- 存档弹窗 -->
    <div
      v-if="showSaveModal"
      class="modal-overlay"
      @click="showSaveModal = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>选择存档</h2>
          <button class="close-button" @click="showSaveModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="save-list">
            <div
              v-for="save in saveGames"
              :key="save.timestamp"
              class="save-item"
              @click="loadGame(save)"
            >
              <div class="save-info">
                <div class="save-name">存档 {{ save.timestamp }}</div>
                <div class="save-date">{{ formatDate(save.timestamp) }}</div>
              </div>
              <div class="save-progress">
                <div class="save-level">等级: {{ save.level || 1 }}</div>
                <div class="save-progress-bar">
                  <div
                    class="save-progress-fill"
                    :style="{ width: `${save.progress || 0}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div v-if="saveGames.length === 0" class="no-saves">暂无存档</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 存档列表
interface SaveGame {
  timestamp: number;
  level?: number;
  progress?: number;
}

const saveGames = ref<SaveGame[]>([]);
// 存档弹窗显示状态
const showSaveModal = ref(false);

// 存档快照类型
interface GameSnapshot {
  timestamp: number;
  playerStore?: {
    player?: {
      level?: number;
      exp?: number;
    };
  };
}

// 加载存档
const loadSaveGames = (): void => {
  const saved = localStorage.getItem("game-snapshots");
  if (saved) {
    const snapshots: GameSnapshot[] = JSON.parse(saved);
    saveGames.value = snapshots
      .map((snapshot) => ({
        timestamp: snapshot.timestamp,
        level: snapshot.playerStore?.player?.level || 1,
        progress: Math.min(
          100,
          Math.floor(((snapshot.playerStore?.player?.exp || 0) / 100) * 100),
        ),
      }))
      .reverse(); // 最新的存档在最前面
  }
};

// 格式化日期
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 预加载 DesktopSystem 组件
const preloadDesktopSystem = (): void => {
  // 使用 requestIdleCallback 在浏览器空闲时预加载
  if ("requestIdleCallback" in window) {
    requestIdleCallback(
      () => {
        import("@/components/common/DesktopSystem/index.vue");
        import("@/views/main/DesktopPage.vue");
      },
      { timeout: 2000 },
    );
  } else {
    // 降级方案：使用 setTimeout
    setTimeout(() => {
      import("@/components/common/DesktopSystem/index.vue");
      import("@/views/main/DesktopPage.vue");
    }, 1000);
  }
};

// 组件挂载时开始预加载
onMounted(() => {
  loadSaveGames();
  preloadDesktopSystem(); // 预加载桌面组件
});

// 开始新游戏
const startNewGame = (): void => {
  // 清除可能存在的临时数据，开始全新游戏
  localStorage.removeItem("current-game-state");
  router.push("/desktop/1"); // 新游戏从第1天开始
};

// 加载存档
const loadGame = (save: SaveGame): void => {
  // 这里可以添加加载存档的逻辑
  // 例如：将选中的存档ID存储到localStorage
  localStorage.setItem("current-save-id", save.timestamp.toString());
  showSaveModal.value = false;
  router.push("/desktop/1"); // 加载存档后从第1天开始，实际项目中可以从存档中读取天数
};

// 打开设置
const openSettings = (): void => {
  router.push("/app/settings"); // 使用应用页面路由
};

// 打开关于
const openAbout = (): void => {
  // 关于页面暂未实现，跳转到首页
  router.push("/");
};
</script>

<style lang="scss" scoped>
.home-page {
  width: 100vw;
  height: 100vh;

  @include utils.flex-center;

  overflow: hidden;
  position: relative;
  font-family: tokens.$font-family-base;
}

.home-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    tokens.$bg-dark 0%,
    tokens.$bg-secondary 50%,
    tokens.$bg-tertiary 100%
  );
  background-size: cover;
  background-position: center;
  opacity: 0.9;

  /* 使用contain优化渲染 */
  contain: strict;

  /* 添加装饰性元素 - 移除动画以提升性能 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(
        circle at 20% 50%,
        rgb(74 158 255 / 10%) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgb(255 215 0 / 10%) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 80%,
        rgb(255 107 107 / 10%) 0%,
        transparent 50%
      );

    /* 移除动画，使用静态效果 */
    opacity: 0.9;
  }
}

.home-content {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: tokens.$spacing-2xl;
  z-index: 1;
  max-width: tokens.$max-content-width;
  width: 100%;
  padding: tokens.$spacing-md;
}

.left-column,
.right-column {
  @include utils.flex-col(tokens.$spacing-md, stretch, center);

  flex: 1;
  width: 50%;
  min-width: 300px;
  max-width: 500px;
  padding: tokens.$spacing-xl;
}

.left-column {
  align-items: flex-start;
  text-align: left;
}

.right-column {
  align-items: center;
}

.game-title {
  margin-bottom: tokens.$spacing-xl;
  contain: layout style paint; /* 优化渲染性能 */
  content-visibility: auto; /* 延迟渲染优化 */

  h1 {
    font-size: tokens.$font-size-5xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary;
    text-shadow: 0 0 20px rgb(74 158 255 / 50%);
    margin: 0;

    /* 使用更高效的动画 */
    animation: titleGlow 2s ease-in-out infinite alternate;
    line-height: tokens.$line-height-tight;

    /* 确保文字快速渲染 */
    font-display: swap;
    will-change: text-shadow;

    @media (width <= 768px) {
      font-size: tokens.$font-size-4xl;
    }

    @media (width <= 480px) {
      font-size: tokens.$font-size-3xl;
    }
  }

  .subtitle {
    font-size: tokens.$font-size-xl;
    color: tokens.$text-primary;
    margin: tokens.$spacing-sm 0 0;
    opacity: 0.9;
    font-weight: tokens.$font-weight-medium;
    font-display: swap;

    @media (width <= 768px) {
      font-size: tokens.$font-size-lg;
    }

    @media (width <= 480px) {
      font-size: tokens.$font-size-base;
    }
  }
}

.game-description {
  color: tokens.$text-primary;
  opacity: 0.85;
  font-size: tokens.$font-size-lg;
  line-height: tokens.$line-height-relaxed;

  p {
    margin: 0 0 tokens.$spacing-sm;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

@keyframes titleGlow {
  from {
    text-shadow: 0 0 20px rgb(74 158 255 / 50%);
  }

  to {
    text-shadow:
      0 0 30px rgb(74 158 255 / 80%),
      0 0 40px rgb(74 158 255 / 30%);
  }
}

/* 按钮容器 */
.button-container {
  @include utils.flex-col(tokens.$spacing-md, stretch, center);

  width: 100%;
  max-width: 350px;
}

/* 主要按钮 */
.main-button {
  padding: tokens.$spacing-md tokens.$spacing-xl;
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  background: linear-gradient(
    135deg,
    tokens.$primary 0%,
    tokens.$primary-dark 100%
  );
  border: none;
  border-radius: tokens.$radius-full;
  cursor: pointer;
  transition: all tokens.$transition-normal;
  box-shadow: 0 4px 15px rgb(74 158 255 / 40%);
  width: 100%;
  min-height: 60px;

  @include utils.flex-center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgb(74 158 255 / 60%);
    background: linear-gradient(
      135deg,
      tokens.$primary-dark 0%,
      tokens.$primary 100%
    );
  }

  &:active {
    transform: translateY(-1px);
  }
}

/* 次要按钮 */
.secondary-button {
  padding: tokens.$spacing-sm tokens.$spacing-xl;
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
  background-color: tokens.$bg-lighter;
  border: 2px solid rgb(255 255 255 / 30%);
  border-radius: tokens.$radius-full;
  cursor: pointer;
  transition: all tokens.$transition-normal;
  width: 100%;
  min-height: 50px;

  @include utils.flex-center;

  &:hover {
    background-color: tokens.$bg-light;
    border-color: rgb(255 255 255 / 50%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
  }

  &:active {
    transform: translateY(0);
  }
}

/* 存档弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 80%);

  @include utils.flex-center;

  z-index: tokens.$z-modal;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: rgb(26 26 46 / 95%);
  border-radius: tokens.$radius-lg;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: tokens.$shadow-xl;
  animation: slideUp 0.3s ease;
  border: 1px solid rgb(74 158 255 / 30%);
}

.modal-header {
  @include utils.flex-between;

  padding: tokens.$spacing-md tokens.$spacing-xl;
  background-color: rgb(74 158 255 / 10%);
  border-bottom: 1px solid rgb(74 158 255 / 20%);

  h2 {
    margin: 0;
    color: tokens.$text-primary;
    font-size: tokens.$font-size-2xl;
  }

  .close-button {
    background: none;
    border: none;
    color: tokens.$text-primary;
    font-size: tokens.$font-size-3xl;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;

    @include utils.flex-center;

    border-radius: 50%;
    transition: all tokens.$transition-normal;

    &:hover {
      background-color: tokens.$bg-lighter;
      transform: rotate(90deg);
    }
  }
}

.modal-body {
  padding: tokens.$spacing-xl;
  overflow-y: auto;
  max-height: calc(80vh - 100px);
}

.save-list {
  @include utils.flex-col(tokens.$spacing-md);
}

.save-item {
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  cursor: pointer;
  transition: all tokens.$transition-normal;
  border: 2px solid transparent;

  &:hover {
    background-color: tokens.$bg-light;
    border-color: tokens.$primary;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgb(74 158 255 / 30%);
  }
}

.save-info {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-md;

  .save-name {
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
    font-size: tokens.$font-size-lg;
  }

  .save-date {
    color: tokens.$gray-400;
    font-size: tokens.$font-size-sm;
  }
}

.save-progress {
  .save-level {
    color: tokens.$primary;
    font-size: tokens.$font-size-base;
    margin-bottom: tokens.$spacing-sm;
  }

  .save-progress-bar {
    width: 100%;
    height: 10px;
    background-color: tokens.$bg-light;
    border-radius: tokens.$radius-sm;
    overflow: hidden;

    .save-progress-fill {
      height: 100%;
      background: linear-gradient(
        90deg,
        tokens.$primary 0%,
        tokens.$primary-dark 100%
      );
      border-radius: tokens.$radius-sm;
      transition: width tokens.$transition-normal;
    }
  }
}

.no-saves {
  text-align: center;
  color: tokens.$gray-400;
  padding: tokens.$spacing-xl tokens.$spacing-md;
  font-style: italic;
  font-size: tokens.$font-size-lg;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (width <= 992px) {
  .home-content {
    flex-direction: column;
    gap: tokens.$spacing-xl;
  }

  .left-column,
  .right-column {
    width: 100%;
    max-width: 600px;
    padding: tokens.$spacing-lg tokens.$spacing-md;
  }

  .left-column {
    align-items: center;
    text-align: center;
  }
}

@media (width <= 768px) {
  .game-description {
    font-size: tokens.$font-size-base;
    line-height: tokens.$line-height-normal;
  }

  .button-container {
    max-width: 100%;
  }

  .main-button {
    padding: tokens.$spacing-sm tokens.$spacing-xl;
    font-size: tokens.$font-size-lg;
    min-height: 55px;
  }

  .secondary-button {
    padding: tokens.$spacing-sm tokens.$spacing-xl;
    font-size: tokens.$font-size-base;
    min-height: 45px;
  }

  /* 弹窗响应式 */
  .modal-content {
    width: 95%;
    max-width: 95%;
    max-height: 90vh;
  }

  .modal-header {
    padding: tokens.$spacing-sm tokens.$spacing-md;

    h2 {
      font-size: tokens.$font-size-xl;
    }

    .close-button {
      font-size: tokens.$font-size-2xl;
      width: 25px;
      height: 25px;
    }
  }

  .modal-body {
    padding: tokens.$spacing-md;
    max-height: calc(90vh - 80px);
  }

  .save-item {
    padding: tokens.$spacing-sm;
  }

  .save-info {
    flex-direction: column;
    align-items: flex-start;
    gap: tokens.$spacing-xs;
    margin-bottom: tokens.$spacing-sm;
  }

  .save-name {
    font-size: tokens.$font-size-base !important;
  }

  .save-date {
    font-size: tokens.$font-size-xs !important;
  }
}

@media (width <= 480px) {
  .left-column,
  .right-column {
    padding: tokens.$spacing-md tokens.$spacing-xs;
  }

  .main-button {
    padding: tokens.$spacing-xs tokens.$spacing-lg;
    font-size: tokens.$font-size-base;
    min-height: 50px;
  }

  .secondary-button {
    padding: tokens.$spacing-xs tokens.$spacing-lg;
    font-size: tokens.$font-size-sm;
    min-height: 40px;
  }
}
</style>
