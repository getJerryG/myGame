<template>
  <div
    class="desktop-app-icon"
    :class="{ downloading: isDownloading, 'download-completed': isDownloadCompleted }"
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
      <div
        class="app-badge"
        v-if="hasCoreData"
      >
        <span>{{ coreDataDisplay }}</span>
      </div>

      <!-- 下载进度条（居中显示在图标上） -->
      <div
        v-if="isDownloading"
        class="download-progress-overlay"
      >
        <div class="progress-circle">
          <svg viewBox="0 0 100 100">
            <circle
              class="progress-bg"
              cx="50"
              cy="50"
              r="45"
            ></circle>
            <circle
              class="progress-fill"
              cx="50"
              cy="50"
              r="45"
              :style="{ strokeDashoffset: 283 - (283 * downloadProgress) / 100 }"
            ></circle>
          </svg>
          <div class="progress-text">{{ downloadProgress }}%</div>
        </div>
      </div>
    </div>

    <div class="app-name">{{ app.name }}</div>

    <!-- 操作菜单（鼠标悬停时显示） -->
    <div
      v-if="isHovered && isDownloading"
      class="app-context-menu"
      @click.stop
    >
      <button
        class="menu-item"
        @click="handleDelete"
      >
        取消下载
      </button>
    </div>

    <!-- 删除确认模态框 -->
    <div
      v-if="showDeleteConfirm"
      class="delete-confirm-overlay"
      @click="showDeleteConfirm = false"
    >
      <div
        class="confirm-modal"
        @click.stop
      >
        <div class="confirm-modal-header">
          <h3>确认删除</h3>
        </div>
        <div class="confirm-modal-content">
          <p>确定要取消下载「{{ app.name }}」吗？</p>
        </div>
        <div class="confirm-modal-footer">
          <button
            class="btn-cancel"
            @click="showDeleteConfirm = false"
          >
            取消
          </button>
          <button
            class="btn-delete"
            @click="handleCancelDownload"
          >
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
.desktop-app-icon {
  position: absolute;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  padding: 10px;
  border-radius: 8px;
}

.desktop-app-icon:hover {
  background-color: rgb(74 158 255 / 10%);
}

.icon-container {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.app-icon {
  font-size: 32px;
  text-shadow: 0 0 10px rgb(0 0 0 / 50%);
}

.app-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background-color: #ff6b6b;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgb(0 0 0 / 30%);
}

.app-name {
  color: white;
  font-size: 12px;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 下载进度覆盖层 */
.download-progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 50%);
  border-radius: 50%;
}

.progress-circle {
  position: relative;
  width: 50px;
  height: 50px;
}

.progress-circle svg {
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
  stroke: #4a9eff;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283;
  stroke-dashoffset: 283;
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* 下载状态样式 */
.downloading {
  cursor: wait;
}

.download-completed {
  /* 移除了边框动画效果 */
}

/* 上下文菜单样式 */
.app-context-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 5px;
  background-color: rgb(26 26 46 / 95%);
  border-radius: 6px;
  box-shadow: 0 0 20px rgb(0 0 0 / 50%);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  color: white;
  text-align: left;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: rgb(74 158 255 / 30%);
}

/* 删除确认模态框样式 */
.delete-confirm-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 80%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.confirm-modal {
  background-color: rgb(26 26 46 / 95%);
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 30px rgb(0 0 0 / 50%);
}

.confirm-modal-header {
  margin-bottom: 15px;
}

.confirm-modal-header h3 {
  margin: 0;
  color: #4a9eff;
  font-size: 16px;
  font-weight: bold;
}

.confirm-modal-content {
  margin-bottom: 20px;
}

.confirm-modal-content p {
  margin: 0;
  color: white;
  font-size: 14px;
  line-height: 1.5;
}

.confirm-modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: rgb(255 255 255 / 20%);
  color: white;
}

.btn-cancel:hover {
  background-color: rgb(255 255 255 / 30%);
}

.btn-delete {
  background-color: #ff6b6b;
  color: white;
}

.btn-delete:hover {
  background-color: #ff5252;
}
</style>
