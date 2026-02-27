<template>
  <div class="home-page">
    <!-- 背景 -->
    <div class="home-background"></div>

    <!-- 主要内容 -->
    <div class="home-content">
      <!-- 左侧：游戏标题和游戏描述 -->
      <div class="left-column">
        <!-- 游戏标题 -->
        <div class="game-title">
          <h1>策划大师：王者经营</h1>
          <p class="subtitle">游戏开发模拟</p>
        </div>

        <!-- 游戏描述 -->
        <div class="game-description">
          <p>在这个游戏中，你将扮演一名游戏策划师，从无到有创建属于自己的游戏帝国！</p>
          <p>设计游戏玩法、管理团队、制定营销策略，最终成为游戏行业的王者！</p>
          <p>体验真实的游戏开发流程，感受策划大师的成长之路！</p>
        </div>
      </div>

      <!-- 右侧：功能按钮区 -->
      <div class="right-column">
        <div class="button-container">
          <!-- 主要按钮 -->
          <button
            class="main-button"
            @click="startNewGame"
          >
            开始新游戏
          </button>

          <button
            class="main-button"
            @click="showSaveModal = true"
          >
            继续游戏
          </button>

          <!-- 次要按钮 -->
          <button
            class="secondary-button"
            @click="openSettings"
          >
            设置
          </button>

          <button
            class="secondary-button"
            @click="openAbout"
          >
            关于
          </button>
        </div>
      </div>
    </div>

    <!-- 存档弹窗 -->
    <div
      v-if="showSaveModal"
      class="modal-overlay"
      @click="showSaveModal = false"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <div class="modal-header">
          <h2>选择存档</h2>
          <button
            class="close-button"
            @click="showSaveModal = false"
          >
            ×
          </button>
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

            <div
              v-if="saveGames.length === 0"
              class="no-saves"
            >
              暂无存档
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
  const saved = localStorage.getItem('game-snapshots');
  if (saved) {
    const snapshots: GameSnapshot[] = JSON.parse(saved);
    saveGames.value = snapshots
      .map((snapshot) => ({
        timestamp: snapshot.timestamp,
        level: snapshot.playerStore?.player?.level || 1,
        progress: Math.min(100, Math.floor(((snapshot.playerStore?.player?.exp || 0) / 100) * 100)),
      }))
      .reverse(); // 最新的存档在最前面
  }
};

// 格式化日期
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 开始新游戏
const startNewGame = (): void => {
  // 清除可能存在的临时数据，开始全新游戏
  localStorage.removeItem('current-game-state');
  router.push('/desktop/1'); // 新游戏从第1天开始
};

// 加载存档
const loadGame = (save: SaveGame): void => {
  // 这里可以添加加载存档的逻辑
  // 例如：将选中的存档ID存储到localStorage
  localStorage.setItem('current-save-id', save.timestamp.toString());
  showSaveModal.value = false;
  router.push('/desktop/1'); // 加载存档后从第1天开始，实际项目中可以从存档中读取天数
};

// 打开设置
const openSettings = (): void => {
  router.push('/app/settings'); // 使用应用页面路由
};

// 打开关于
const openAbout = (): void => {
  // 关于页面暂未实现，跳转到首页
  router.push('/');
};

// 组件挂载时加载存档
onMounted(() => {
  loadSaveGames();
});
</script>

<style lang="scss" scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.home-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  background-size: cover;
  background-position: center;
  opacity: 0.9;

  /* 添加装饰性元�? */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(circle at 20% 50%, rgb(74 158 255 / 10%) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgb(255 215 0 / 10%) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgb(255 107 107 / 10%) 0%, transparent 50%);
    animation: backgroundPulse 4s ease-in-out infinite alternate;
  }
}

@keyframes backgroundPulse {
  from {
    opacity: 0.8;
  }

  to {
    opacity: 1;
  }
}

.home-content {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 60px;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
  padding: 20px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  width: 50%;
  min-width: 300px;
  max-width: 500px;
  padding: 40px;
}

.left-column {
  align-items: flex-start;
  text-align: left;
}

.right-column {
  align-items: center;
}

.game-title {
  margin-bottom: 40px;

  h1 {
    font-size: 3.5rem;
    font-weight: bold;
    color: #4a9eff;
    text-shadow: 0 0 20px rgb(74 158 255 / 50%);
    margin: 0;
    animation: titleGlow 2s ease-in-out infinite alternate;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 1.3rem;
    color: #fff;
    margin: 15px 0 0;
    opacity: 0.9;
    font-weight: 500;
  }
}

.game-description {
  color: #fff;
  opacity: 0.85;
  font-size: 1.1rem;
  line-height: 1.8;

  p {
    margin: 0 0 15px;

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
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 350px;
}

/* 主要按钮 */
.main-button {
  padding: 18px 40px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #4a9eff 0%, #357abd 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgb(74 158 255 / 40%);
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgb(74 158 255 / 60%);
    background: linear-gradient(135deg, #357abd 0%, #4a9eff 100%);
  }

  &:active {
    transform: translateY(-1px);
  }
}

/* 次要按钮 */
.secondary-button {
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
  background-color: rgb(255 255 255 / 15%);
  border: 2px solid rgb(255 255 255 / 30%);
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgb(255 255 255 / 25%);
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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: rgb(26 26 46 / 95%);
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgb(0 0 0 / 50%);
  animation: slideUp 0.3s ease;
  border: 1px solid rgb(74 158 255 / 30%);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: rgb(74 158 255 / 10%);
  border-bottom: 1px solid rgb(74 158 255 / 20%);

  h2 {
    margin: 0;
    color: #fff;
    font-size: 1.5rem;
  }

  .close-button {
    background: none;
    border: none;
    color: #fff;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgb(255 255 255 / 10%);
      transform: rotate(90deg);
    }
  }
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
  max-height: calc(80vh - 100px);
}

.save-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.save-item {
  background-color: rgb(255 255 255 / 15%);
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    background-color: rgb(255 255 255 / 25%);
    border-color: #4a9eff;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgb(74 158 255 / 30%);
  }
}

.save-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  .save-name {
    font-weight: bold;
    color: #fff;
    font-size: 1.2rem;
  }

  .save-date {
    color: #aaa;
    font-size: 0.9rem;
  }
}

.save-progress {
  .save-level {
    color: #4a9eff;
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .save-progress-bar {
    width: 100%;
    height: 10px;
    background-color: rgb(255 255 255 / 20%);
    border-radius: 5px;
    overflow: hidden;

    .save-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4a9eff 0%, #357abd 100%);
      border-radius: 5px;
      transition: width 0.3s ease;
    }
  }
}

.no-saves {
  text-align: center;
  color: #aaa;
  padding: 40px 20px;
  font-style: italic;
  font-size: 1.1rem;
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

/* 响应式设�? */
@media (width <= 992px) {
  .home-content {
    flex-direction: column;
    gap: 40px;
  }

  .left-column,
  .right-column {
    width: 100%;
    max-width: 600px;
    padding: 30px 20px;
  }

  .left-column {
    align-items: center;
    text-align: center;
  }
}

@media (width <= 768px) {
  .game-title h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .game-description {
    font-size: 1rem;
    line-height: 1.6;
  }

  .button-container {
    max-width: 100%;
  }

  .main-button {
    padding: 15px 30px;
    font-size: 1.1rem;
    min-height: 55px;
  }

  .secondary-button {
    padding: 12px 30px;
    font-size: 1rem;
    min-height: 45px;
  }

  /* 弹窗响应�? */
  .modal-content {
    width: 95%;
    max-width: 95%;
    max-height: 90vh;
  }

  .modal-header {
    padding: 15px 20px;

    h2 {
      font-size: 1.3rem;
    }

    .close-button {
      font-size: 1.8rem;
      width: 25px;
      height: 25px;
    }
  }

  .modal-body {
    padding: 20px;
    max-height: calc(90vh - 80px);
  }

  .save-item {
    padding: 15px;
  }

  .save-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
  }

  .save-name {
    font-size: 1.1rem !important;
  }

  .save-date {
    font-size: 0.85rem !important;
  }
}

@media (width <= 480px) {
  .game-title h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .left-column,
  .right-column {
    padding: 20px 15px;
  }

  .main-button {
    padding: 12px 25px;
    font-size: 1rem;
    min-height: 50px;
  }

  .secondary-button {
    padding: 10px 25px;
    font-size: 0.9rem;
    min-height: 40px;
  }
}
</style>
