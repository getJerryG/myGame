<template>
  <div
    class="window-manager"
    @click="handleBackgroundClick"
  >
    <!-- 窗口容器 -->
    <div class="windows-container">
      <SystemWindow
        v-for="window in windowManagerStore.sortedWindows"
        :key="window.id"
        :window-id="window.id"
      >
        <!-- 动态插槽内�?-->
        <component
          v-for="tab in window.tabs || []"
          :key="tab.id"
          :is="getWindowContentComponent(tab.content)"
          v-bind="tab.content.props || {}"
          :slot="tab.id"
        />
        <!-- 单个窗口内容 -->
        <component
          v-if="!window.tabs || window.tabs.length === 0"
          :is="getWindowContentComponent(window.content)"
          v-bind="window.content.props || {}"
        />
      </SystemWindow>
    </div>

    <!-- 创建窗口按钮 -->
    <button
      class="create-window-btn"
      @click="createNewWindow"
      title="创建新窗口"
    >
      + 新建窗口
    </button>

    <!-- 合并预览指示�?-->
    <div
      v-if="windowManagerStore.mergePreview"
      class="merge-preview-indicator"
    >
      <div class="merge-preview-arrow"></div>
      <div class="merge-preview-text">释放鼠标合并窗口</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useWindowManagerStore } from '@/stores/windowManagerStore';
import SystemWindow from './SystemWindow.vue';
// 导入实际应用组件
import HeroDevelopmentApp from '../../modules/game/views/HeroDevelopmentApp.vue';
import GameReleaseApp from '../../modules/game/views/GameReleaseApp.vue';
// 导入应用中心组件
import AppStore from '../../components/business/apps/AppStore/AppStore.vue';

const windowManagerStore = useWindowManagerStore();

// 类型定义
interface WindowComponentProps {
  title?: string;
  imageUrl?: string;
}

interface WindowComponent {
  template?: string;
  props?: string[];
  name?: string;
}

interface WindowContent {
  type: string;
  props?: {
    title?: string;
    imageUrl?: string;
    app?: {
      id: string;
    };
  };
}

// 窗口内容组件映射
const windowContentComponents: Record<
  string,
  WindowComponent | typeof HeroDevelopmentApp | typeof GameReleaseApp | typeof AppStore
> = {
  // 这里注册不同类型的窗口内容组件
  default: {
    template: '<div class="default-window-content">{{ props.title || "窗口内容" }}</div>',
    props: ['title'],
  },
  // 英雄开发应用
  heroDevelopment: HeroDevelopmentApp,
  // 游戏发布应用
  gameRelease: GameReleaseApp,
  // 应用中心
  appStore: AppStore,
  // 示例：文本编辑窗口
  textEditor: {
    template:
      '<div class="text-editor-window"><h3>{{ props.title }}</h3><textarea class="text-editor" placeholder="在这里输入文字..."></textarea></div>',
    props: ['title'],
  },
  // 示例：图片查看窗口
  imageViewer: {
    template:
      '<div class="image-viewer-window"><h3>{{ props.title }}</h3><img :src="props.imageUrl" alt="Image" class="viewer-image"></div>',
    props: ['title', 'imageUrl'],
  },
};

// 获取窗口内容组件
const getWindowContentComponent = (content: string | WindowContent): typeof windowContentComponents[keyof typeof windowContentComponents] => {
  if (typeof content === 'string') {
    return windowContentComponents[content] || windowContentComponents.default;
  }
  if (content?.type) {
    // 处理 app 类型的窗口内容
    if (content.type === 'app') {
      const appId = content.props?.app?.id;
      if (appId) {
        // 根据应用ID返回对应的组件
        switch (appId) {
          case 'app-store':
            return windowContentComponents.appStore;
          case 'hero-development':
            return windowContentComponents.heroDevelopment;
          case 'game-release':
            return windowContentComponents.gameRelease;
          // 可以根据需要添加更多应用类�?          default:
            return windowContentComponents.default;
        }
      }
    }
    return windowContentComponents[content.type] || windowContentComponents.default;
  }
  return windowContentComponents.default;
};

// 创建新窗�?const createNewWindow = (): void => {
  // 可用的窗口类型，排除default
  const availableTypes = ['heroDevelopment', 'gameRelease', 'textEditor', 'imageViewer'];
  const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

  let title = '';
  const windowConfig: WindowContent = { type: randomType };

  // 根据类型配置窗口
  switch (randomType) {
    case 'heroDevelopment':
      title = '英雄开发';
      break;
    case 'gameRelease':
      title = '游戏发布';
      break;
    case 'textEditor':
      title = '文本编辑器';
      windowConfig.props = { title: '文本编辑器' };
      break;
    case 'imageViewer':
      title = '图片查看器';
      windowConfig.props = {
        title: '图片查看器',
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
      };
      break;
    default:
      title = '默认窗口';
      windowConfig.props = { title: '默认窗口' };
  }

  windowManagerStore.createWindow(title, windowConfig, {
    x: 100 + Math.random() * 200,
    y: 100 + Math.random() * 200,
    width: randomType === 'heroDevelopment' ? 800 : 600,
    height: randomType === 'heroDevelopment' ? 600 : 400,
  });
};

// 处理背景点击
const handleBackgroundClick = (): void => {
  // 点击背景时可以取消某些操作或关闭菜单
};

// 全局键盘事件处理
const handleGlobalKeyDown = (event: KeyboardEvent): void => {
  // Ctrl+Tab 切换到下一个窗口
  if (event.ctrlKey && event.key === 'Tab') {
    event.preventDefault();
    windowManagerStore.nextWindow();
  }

  // Ctrl+Shift+Tab 切换到上一个窗口
  if (event.ctrlKey && event.shiftKey && event.key === 'Tab') {
    event.preventDefault();
    windowManagerStore.prevWindow();
  }

  // Ctrl+N 创建新窗口
  if (event.ctrlKey && event.key === 'n') {
    event.preventDefault();
    createNewWindow();
  }
};

// 组件挂载时添加全局事件监听
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeyDown);

  // 初始化创建英雄开发窗口和其他示例窗口
  setTimeout(() => {
    // 首先创建英雄开发窗�?    windowManagerStore.createWindow(
      '英雄开�?,
      { type: 'heroDevelopment' },
      {
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      }
    );
    // 创建游戏发布窗口
    windowManagerStore.createWindow(
      '游戏发布',
      { type: 'gameRelease' },
      {
        x: 200,
        y: 150,
        width: 600,
        height: 400,
      }
    );
    // 创建一个示例窗�?    setTimeout(() => createNewWindow(), 100);
  }, 100);
});

// 组件卸载时移除全局事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown);
});
</script>

<style lang="scss" scoped>
.window-manager {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f5f5f5;

  /* 背景网格效果 */
  background-image:
    linear-gradient(rgb(0 0 0 / 5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(0 0 0 / 5%) 1px, transparent 1px);
  background-size: 20px 20px;
}

.windows-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.create-window-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #0078d7;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgb(0 120 215 / 30%);
  transition: all 0.3s ease;
  z-index: 1000; /* 确保按钮始终可见 */

  &:hover {
    background: #005a9e;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgb(0 120 215 / 40%);
  }

  &:active {
    transform: translateY(0);
  }
}

.merge-preview-indicator {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: rgb(0 0 0 / 80%);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1001;
  animation: fadeInOut 2s ease-in-out infinite;
}

.merge-preview-arrow {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 12px solid white;
  transform: rotate(45deg);
}

.merge-preview-text {
  font-weight: bold;
}

/* 示例窗口内容样式 */
.default-window-content {
  padding: 20px;
  text-align: center;
  color: #666;
}

.text-editor-window {
  padding: 20px;

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #444;
  }

  .text-editor {
    width: 100%;
    height: 200px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: monospace;
    font-size: 14px;
    resize: vertical;
    outline: none;

    &:focus {
      border-color: #0078d7;
      box-shadow: 0 0 0 2px rgb(0 120 215 / 20%);
    }
  }
}

.image-viewer-window {
  padding: 20px;

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #444;
  }

  .viewer-image {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  }
}

/* 动画效果 */
@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.7;
    transform: translateY(10px);
  }

  50% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


