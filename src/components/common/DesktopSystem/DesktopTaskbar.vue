<template>
  <div class="taskbar">
    <div class="taskbar-left">
      <div
        class="start-button"
        @click="toggleStartMenu"
      >
        <span>开始</span>
      </div>
    </div>
    <div class="taskbar-right">
      <div class="game-date">{{ gameDateDisplay }}</div>
    </div>

    <!-- 开始菜单 -->
    <div
      v-if="isStartMenuOpen"
      class="start-menu"
      @click.stop
    >
      <div class="start-menu-header">
        <h2>开始</h2>
      </div>
      <div class="start-menu-content">
        <div class="start-menu-buttons">
          <button
            class="start-menu-button"
            @click="handleSaveGame"
          >
            <span class="button-icon">💾</span>
            <span class="button-text">保存副本</span>
          </button>
          <button
            class="start-menu-button"
            @click="handleRestartGame"
          >
            <span class="button-icon">🔄</span>
            <span class="button-text">重新开始</span>
          </button>
          <button
            class="start-menu-button"
            @click="handleOpenSettings"
          >
            <span class="button-icon">⚙️</span>
            <span class="button-text">游戏设置</span>
          </button>
        </div>
      </div>
    </div>
    <!-- 点击外部关闭开始菜单 -->
    <div
      v-if="isStartMenuOpen"
      class="start-menu-backdrop"
      @click="closeStartMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { GameData } from '@/types/game';

// Props
const props = defineProps<{
  gameData: GameData;
}>();

// Emits
const emit = defineEmits<{
  saveGame: [];
  restartGame: [];
  openSettings: [];
}>();

// 开始菜单状态
const isStartMenuOpen = ref(false);

// 切换开始菜单显示/隐藏
const toggleStartMenu = (): void => {
  isStartMenuOpen.value = !isStartMenuOpen.value;
};

// 关闭开始菜单
const closeStartMenu = (): void => {
  isStartMenuOpen.value = false;
};

// 计算游戏日期对应的星期几
const getDayOfWeek = (year: number, month: number, day: number): string => {
  const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const totalDays = (year - 1) * 365 + (month - 1) * 30 + day;
  return daysOfWeek[totalDays % 7];
};

// 游戏日期显示，包含星期几
const gameDateDisplay = computed(() => {
  if (!props.gameData?.gameState?.currentDate) {
    return '加载中...';
  }

  const date = props.gameData.gameState.currentDate;
  const dayOfWeek = getDayOfWeek(date.year, date.month, date.day);
  return `${date.year}年${date.month}月${date.day}日 ${dayOfWeek} ${date.hour}:${String(date.minute).padStart(2, '0')}`;
});

// 事件处理函数
const handleSaveGame = () => {
  emit('saveGame');
  closeStartMenu();
};

const handleRestartGame = () => {
  emit('restartGame');
  closeStartMenu();
};

const handleOpenSettings = () => {
  emit('openSettings');
  closeStartMenu();
};
</script>

<style lang="scss" scoped>
.taskbar {
  @include utils.taskbar;

  .taskbar-left {
    @include utils.flex-row(tokens.$spacing-sm);

    .start-button {
      padding: tokens.$spacing-sm tokens.$spacing-md;
      background-color: tokens.$primary-blue;
      border-radius: tokens.$radius-sm;
      cursor: pointer;
      font-weight: tokens.$font-weight-bold;
      transition: all tokens.$transition-fast;

      &:hover {
        background-color: color.adjust(tokens.$primary-blue, $lightness: -10%);
        transform: translateY(-1px);
      }
    }
  }

  .taskbar-right {
    @include utils.flex-row(tokens.$spacing-sm);

    .game-date {
      padding: tokens.$spacing-sm tokens.$spacing-md;
      background-color: tokens.$bg-light;
      border-radius: tokens.$radius-sm;
      font-size: tokens.$font-size-sm;
      color: tokens.$primary-blue;
      font-weight: tokens.$font-weight-bold;
    }

    .system-time {
      padding: tokens.$spacing-sm tokens.$spacing-md;
      background-color: tokens.$bg-light;
      border-radius: tokens.$radius-sm;
      font-size: tokens.$font-size-sm;
    }
  }
}

.start-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 98;
  background-color: transparent;
}

.start-menu {
  @include utils.start-menu;

  animation: startMenuSlideUp 0.2s ease-out forwards;
  transform-origin: bottom left;

  .start-menu-header {
    padding: tokens.$spacing-md tokens.$spacing-lg;
    border-bottom: 1px solid tokens.$border-medium;
    background-color: rgb(74 158 255 / 10%);
    border-radius: tokens.$radius-lg tokens.$radius-lg 0 0;

    h2 {
      margin: 0;
      font-size: tokens.$font-size-xl;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$primary-blue;
    }
  }

  .start-menu-content {
    padding: tokens.$spacing-sm 0;
    flex: 1;
    overflow-y: auto;

    .start-menu-buttons {
      display: flex;
      flex-direction: column;

      .start-menu-button {
        @include utils.flex-row(tokens.$spacing-md);

        padding: tokens.$spacing-md;
        background: none;
        border: none;
        color: tokens.$text-primary;
        font-size: tokens.$font-size-base;
        cursor: pointer;
        transition: all tokens.$transition-fast;
        text-align: left;

        &:hover {
          background-color: rgb(74 158 255 / 30%);
        }

        &:active {
          background-color: rgb(74 158 255 / 50%);
        }

        .button-icon {
          font-size: tokens.$font-size-lg;
        }

        .button-text {
          flex: 1;
        }
      }
    }
  }
}

@keyframes startMenuSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
