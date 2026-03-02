<template>
  <div
    class="desktop-app-icon"
    :class="{
      downloading: isDownloading,
      'download-completed': isDownloadCompleted,
    }"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      opacity: isDownloading ? 0.5 : 1,
    }"
    @click="handleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="icon-container">
      <div class="app-icon">{{ app.icon }}</div>
      <div class="app-badge" v-if="hasCoreData">
        <span>{{ coreDataDisplay }}</span>
      </div>

      <!-- 下载进度条（居中显示在图标上） -->
      <div v-if="isDownloading" class="download-progress-overlay">
        <div class="progress-circle">
          <svg viewBox="0 0 100 100">
            <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
            <circle
              class="progress-fill"
              cx="50"
              cy="50"
              r="45"
              :style="{
                strokeDashoffset: 283 - (283 * downloadProgress) / 100,
              }"
            ></circle>
          </svg>
          <div class="progress-text">{{ downloadProgress }}%</div>
        </div>
      </div>
    </div>

    <div class="app-name">{{ app.name }}</div>

    <!-- 操作菜单（鼠标悬停时显示） -->
    <div v-if="isHovered && isDownloading" class="app-context-menu" @click.stop>
      <button class="menu-item" @click="handleDelete">取消下载</button>
    </div>

    <!-- 删除确认模态框 -->
    <div
      v-if="showDeleteConfirm"
      class="delete-confirm-overlay"
      @click="showDeleteConfirm = false"
    >
      <div class="confirm-modal" @click.stop>
        <div class="confirm-modal-header">
          <h3>确认删除</h3>
        </div>
        <div class="confirm-modal-content">
          <p>确定要取消下载「{{ app.name }}」吗？</p>
        </div>
        <div class="confirm-modal-footer">
          <button class="btn-cancel" @click="showDeleteConfirm = false">
            取消
          </button>
          <button class="btn-delete" @click="handleCancelDownload">
            确定删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWindowManagerStore } from '@/stores/windowManagerStore';

// 定义应用类型
interface App {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  coreData: Record<string, any>;
  modules: Array<{
    id: string;
    name: string;
  }>;
}

// Props定义
const props = defineProps<{
  app: App;
  position: { x: number; y: number };
}>();

// Emits定义
const emit = defineEmits<{
  click: [app: App];
}>();

// 获取窗口管理器store
const windowManagerStore = useWindowManagerStore();

// 状态管理
const isHovered = ref(false);
const showDeleteConfirm = ref(false);

// 计算属性：是否有核心数据
const hasCoreData = computed(() => {
  return Object.keys(props.app.coreData).length > 0;
});

// 计算属性：核心数据显示
const coreDataDisplay = computed(() => {
  if (props.app.id === 'wallet') {
    return `￥${props.app.coreData.balance || 0}`;
  }
  return '';
});

// 计算属性：是否正在下载
const isDownloading = computed(() => {
  return windowManagerStore.isDownloading(props.app.id);
});

// 计算属性：下载进度
const downloadProgress = computed(() => {
  const progress = windowManagerStore.getDownloadProgress(props.app.id);
  return progress || 0;
});

// 计算属性：是否下载完成
const isDownloadCompleted = computed(() => {
  return windowManagerStore.isDownloadCompleted(props.app.id);
});

// 处理点击事件
const handleClick = () => {
  emit('click', props.app);
};

// 处理打开应用
const handleOpen = () => {
  emit('click', props.app);
  isHovered.value = false;
};

// 处理删除应用
const handleDelete = () => {
  showDeleteConfirm.value = true;
};

// 处理取消下载
const handleCancelDownload = () => {
  windowManagerStore.cancelDownload(props.app.id);
  showDeleteConfirm.value = false;
  isHovered.value = false;
};
</script>

<style lang="scss" scoped>
// ============================================
// DesktopAppIcon 组件样式
// ============================================

.desktop-app-icon {
  @include utils.desktop-app-icon;

  &.downloading {
    cursor: wait;
  }

  &.download-completed {
    /* 移除了边框动画效果 */
  }

  .icon-container {
    @include utils.icon-container(60px);

    margin-bottom: tokens.$spacing-sm;

    .app-icon {
      font-size: 32px;
      text-shadow: 0 0 10px rgb(0 0 0 / 50%);
    }

    .app-badge {
      position: absolute;
      bottom: -5px;
      right: -5px;

      @include utils.badge-notification;

      box-shadow: tokens.$shadow-md;
    }
  }

  .app-name {
    color: tokens.$text-primary;
    font-size: tokens.$font-size-xs;
    text-align: center;
    max-width: 100%;

    @include utils.text-truncate;
  }

  /* 下载进度覆盖层 */
  .download-progress-overlay {
    position: absolute;
    inset: 0;

    @include utils.flex-center;

    background-color: rgb(0 0 0 / 50%);
    border-radius: 50%;

    .progress-circle {
      position: relative;
      width: 50px;
      height: 50px;

      svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .progress-bg {
        fill: none;
        stroke: rgb(255 255 255 / 30%);
        stroke-width: 8;
      }

      .progress-fill {
        fill: none;
        stroke: tokens.$primary-blue;
        stroke-width: 8;
        stroke-linecap: round;
        stroke-dasharray: 283;
        stroke-dashoffset: 283;
        transition: stroke-dashoffset tokens.$transition-normal;
      }

      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: tokens.$text-primary;
        font-size: tokens.$font-size-xs;
        font-weight: tokens.$font-weight-bold;
      }
    }
  }

  /* 上下文菜单样式 */
  .app-context-menu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: tokens.$spacing-xs;
    background-color: tokens.$bg-secondary;
    border-radius: tokens.$radius-md;
    box-shadow: tokens.$shadow-lg;
    z-index: tokens.$z-dropdown;
    min-width: 120px;
    overflow: hidden;

    .menu-item {
      display: block;
      width: 100%;
      padding: tokens.$spacing-sm tokens.$spacing-md;
      background: none;
      border: none;
      color: tokens.$text-primary;
      text-align: left;
      font-size: tokens.$font-size-sm;
      cursor: pointer;
      transition: all tokens.$transition-fast;

      &:hover {
        background-color: rgb(74 158 255 / 30%);
      }
    }
  }

  /* 删除确认模态框样式 */
  .delete-confirm-overlay {
    @include utils.modal-overlay;

    z-index: tokens.$z-max;

    .confirm-modal {
      background-color: tokens.$bg-secondary;
      border-radius: tokens.$radius-lg;
      padding: tokens.$spacing-lg;
      width: 90%;
      max-width: 400px;
      box-shadow: tokens.$shadow-xl;

      .confirm-modal-header {
        margin-bottom: tokens.$spacing-md;

        h3 {
          margin: 0;
          color: tokens.$primary-blue;
          font-size: tokens.$font-size-lg;
          font-weight: tokens.$font-weight-bold;
        }
      }

      .confirm-modal-content {
        margin-bottom: tokens.$spacing-lg;

        p {
          margin: 0;
          color: tokens.$text-primary;
          font-size: tokens.$font-size-sm;
          line-height: tokens.$line-height-normal;
        }
      }

      .confirm-modal-footer {
        display: flex;
        gap: tokens.$spacing-md;
        justify-content: flex-end;

        .btn-cancel,
        .btn-delete {
          padding: tokens.$spacing-sm tokens.$spacing-md;
          border: none;
          border-radius: tokens.$radius-sm;
          cursor: pointer;
          font-size: tokens.$font-size-sm;
          font-weight: tokens.$font-weight-bold;
          transition: all tokens.$transition-fast;
        }

        .btn-cancel {
          background-color: tokens.$bg-light;
          color: tokens.$text-primary;

          &:hover {
            background-color: tokens.$bg-lighter;
          }
        }

        .btn-delete {
          background-color: tokens.$error;
          color: white;

          &:hover {
            background-color: color.adjust(tokens.$error, $lightness: -10%);
          }
        }
      }
    }
  }
}
</style>
