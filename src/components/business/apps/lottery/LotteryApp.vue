<template>
  <div class="lottery-app">
    <!-- 左侧菜单 -->
    <div class="modal-sidebar">
      <div
        class="sidebar-item"
        v-for="module in app.modules"
        :key="module.id"
        :class="{ active: activeModule === module.id }"
        @click="switchModule(module.id)"
      >
        <span class="sidebar-item-icon">{{ getModuleIcon(module.id) }}</span>
        <span class="sidebar-item-name">{{ module.name }}</span>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="modal-main">
      <!-- 核心数据概览 -->
      <div class="content-header">
        <h2>{{ currentModule.name }}</h2>
        <div
          class="module-core-data"
          v-if="app.coreData"
        >
          <div
            class="core-data-item"
            v-for="(value, key) in app.coreData"
            :key="key"
          >
            <span class="core-data-label">{{ getCoreDataLabel(key) }}:</span>
            <span class="core-data-value">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- 模块内容 -->
      <div class="content-body">
        <!-- 抽奖主界�?-->
        <div
          v-if="activeModule === 'lottery-main'"
          class="module-content"
        >
          <div class="lottery-main-container">
            <!-- 顶部数据面板 -->
            <LotteryDataPanel @show-consumption-info="showConsumptionInfo = true" />

            <!-- 消费说明弹窗 -->
            <div
              v-if="showConsumptionInfo"
              class="modal-overlay"
              @click="showConsumptionInfo = false"
            >
              <div
                class="modal-content"
                @click.stop
              >
                <div class="modal-header">
                  <h3>消费说明</h3>
                  <button
                    class="close-button"
                    @click="showConsumptionInfo = false"
                  >
                    ×
                  </button>
                </div>
                <div class="modal-body">
                  <div class="consumption-rules">
                    <div class="rule-item">
                      <span class="rule-label">10连抽：</span>
                      <span class="rule-value">10祈愿币</span>
                    </div>
                    <div class="rule-item">
                      <span class="rule-label">初始赠送：</span>
                      <span class="rule-value">9祈愿币</span>
                    </div>
                    <div class="rule-item">
                      <span class="rule-label">首次单抽：</span>
                      <span class="rule-value">1币</span>
                    </div>
                    <div class="rule-item">
                      <span class="rule-label">10连抽：</span>
                      <span class="rule-value">91币</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="button-panel">
              <button
                class="exchange-button"
                :disabled="!lotteryStore.canExchange"
                @click="handleExchange"
              >
                兑换无相皮肤 (998积分)
              </button>
              <button
                class="reset-button"
                @click="handleReset"
              >
                重置数据
              </button>
            </div>

            <!-- 开发调试：充值祈愿石 -->
            <div class="debug-panel">
              <input
                v-model.number="addStones"
                type="number"
                placeholder="充值祈愿石数量"
              />
              <button @click="handleAddStones">充值</button>
            </div>

            <!-- 抽奖结果展示 -->
            <LotteryResultPanel
              :last-result="lastResult"
              :is-animating="isAnimating"
            />

            <!-- 抽奖按钮 -->
            <LotteryDrawButtons
              @single-draw="handleSingleDraw"
              @ten-draws="handleTenDraws"
            />
          </div>
        </div>

        <!-- 抽奖历史模块 -->
        <div
          v-else-if="activeModule === 'lottery-history'"
          class="module-content"
        >
          <div class="history-button-container">
            <button
              class="history-button"
              @click="showHistoryModal = true"
            >
              查看抽奖历史
              <span
                v-if="lotteryStore.history.length > 0"
                class="history-count"
                >{{ lotteryStore.history.length }}</span
              >
            </button>
          </div>

          <!-- 抽奖历史弹窗 -->
          <div
            v-if="showHistoryModal"
            class="modal-overlay"
            @click="showHistoryModal = false"
          >
            <div
              class="modal-content"
              @click.stop
            >
              <div class="modal-header">
                <h3>抽奖历史</h3>
                <button
                  class="close-button"
                  @click="showHistoryModal = false"
                >
                  ×
                </button>
              </div>
              <div class="modal-body">
                <div class="modal-action-bar">
                  <button
                    class="clear-history"
                    @click="clearHistory"
                  >
                    清空历史
                  </button>
                  <span class="history-count-info"> {{ lotteryStore.history.length }}条记�?</span>
                </div>
                <div class="history-list-modal">
                  <div
                    v-if="lotteryStore.history.length === 0"
                    class="empty-message"
                  >
                    暂无抽奖记录
                  </div>
                  <div
                    v-for="record in lotteryStore.history"
                    v-else
                    :key="record.id"
                    class="history-item"
                  >
                    <div class="history-header">
                      <span class="history-time">{{ formatTime(record.timestamp) }}</span>
                      <span class="history-type">{{ record.type === 'single' ? '单抽' : '10连抽' }}</span>
                    </div>
                    <div class="history-rewards">
                      <div
                        v-for="(reward, index) in record.rewards"
                        :key="index"
                        class="history-reward"
                      >
                        {{ reward.name }}{{ reward.type.includes('points') ? ` (+${reward.value}积分)` : '' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 累抽奖励模块 -->
        <div
          v-else-if="activeModule === 'lottery-rewards'"
          class="module-content"
        >
          <LotteryCumulativeRewards />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LotteryDataPanel from '@/components/business/lottery/LotteryDataPanel/index.vue';
import LotteryDrawButtons from '@/components/business/lottery/LotteryDrawButtons/index.vue';
import LotteryResultPanel from '@/components/business/lottery/LotteryResultPanel/index.vue';
import LotteryCumulativeRewards from '@/components/business/lottery/LotteryCumulativeRewards/index.vue';

const props = defineProps({
  app: {
    type: Object,
    required: true,
  },
  gameData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:activeModule']);

// 抽奖相关状�?const lotteryStore = useLotteryStore();
const lastResult = ref(null);
const addStones = ref(0);
const isAnimating = ref(false);
const showHistoryModal = ref(false);
const showConsumptionInfo = ref(false);

// 活跃模块状�?const activeModule = ref(props.app.modules[0].id);

// 当前激活的模块
const currentModule = computed(() => {
  return props.app.modules.find((m) => m.id === activeModule.value) || props.app.modules[0];
});

/**
 * 处理单抽
 */
const handleSingleDraw = (): void => {
  const result = lotteryStore.singleDraw();
  if (result.success) {
    isAnimating.value = false;
    setTimeout(() => {
      lastResult.value = { rewards: [result.reward] };
      isAnimating.value = true;
    }, 100);
  } else {
    alert(result.message);
  }
};

/**
 * 处理10连抽
 */
const handleTenDraws = (): void => {
  const result = lotteryStore.tenDraws();
  if (result.success) {
    isAnimating.value = false;
    setTimeout(() => {
      lastResult.value = { rewards: result.rewards };
      isAnimating.value = true;
    }, 100);
  } else {
    alert(result.message);
  }
};

/**
 * 处理兑换皮肤
 */
const handleExchange = (): void => {
  const success = lotteryStore.exchangeSkin();
  if (success) {
    alert('兑换成功！');
  }
};

/**
 * 处理重置数据
 */
const handleReset = (): void => {
  if (confirm('确定要重置所有数据吗？')) {
    lotteryStore.resetData();
    lastResult.value = null;
  }
};

/**
 * 处理充值祈愿石
 */
const handleAddStones = (): void => {
  if (addStones.value > 0) {
    lotteryStore.stones += addStones.value * 10;
    addStones.value = 0;
  }
};

/**
 * 清空抽奖历史
 */
const clearHistory = (): void => {
  if (confirm('确定要清空抽奖历史吗？')) {
    lotteryStore.history = [];
  }
};

/**
 * 格式化时�? */
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 切换模块
const switchModule = (moduleId: string): void => {
  activeModule.value = moduleId;
  emit('update:activeModule', moduleId);
};

// 获取模块图标
const getModuleIcon = (moduleId: string): string => {
  const icons = {
    'lottery-main': '🎰',
    'lottery-history': '📜',
    'lottery-rewards': '🎁',
  };
  return icons[moduleId] || '📦';
};

// 获取核心数据标签
const getCoreDataLabel = (key: string): string => {
  const labels = {
    stones: '祈愿石',
    points: '积分',
  };
  return labels[key] || key;
};
</script>

<style lang="scss" scoped>
.lottery-app {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 左侧菜单栏样�? */
.modal-sidebar {
  width: 200px;
  background-color: rgb(0 0 0 / 20%);
  border-right: 1px solid #333;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #b0b0b0;
  border-left: 3px solid transparent;
}

.sidebar-item:hover {
  background-color: rgb(74 158 255 / 20%);
  color: #fff;
}

.sidebar-item.active {
  background-color: rgb(74 158 255 / 30%);
  color: #fff;
  border-left-color: #4a9eff;
}

.sidebar-item-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.sidebar-item-name {
  font-size: 14px;
  font-weight: 500;
}

/* 右侧内容区域样式 */
.modal-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(26 26 46 / 50%);
}

.content-header {
  padding: 16px;
  border-bottom: 1px solid #333;
  background-color: rgb(0 0 0 / 10%);
}

.content-header h2 {
  margin: 0 0 12px;
  font-size: 20px;
  color: #fff;
}

.module-core-data {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.core-data-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.core-data-label {
  color: #b0b0b0;
}

.core-data-value {
  color: #4a9eff;
  font-weight: bold;
}

.content-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  color: #fff;
}

.module-content {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
}

.module-content h3 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #4a9eff;
}

.module-content h4 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #fff;
}

.module-content p {
  margin: 0 0 16px;
  color: #b0b0b0;
  line-height: 1.6;
}

/* 抽奖应用特定样式 */
.lottery-main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.button-panel {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.exchange-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.exchange-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.reset-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.debug-panel {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.debug-panel input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 150px;
}

.debug-panel button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
}

/* 历史记录按钮 */
.history-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.history-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  position: relative;
}

.history-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #f44336;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  color: #333;
}

.modal-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.clear-history {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
}

.history-count-info {
  color: #666;
}

/* 消费规则样式 */
.consumption-rules {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rule-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.rule-label {
  font-weight: bold;
  width: 120px;
}

.rule-value {
  color: #2196f3;
}

/* 历史记录样式 */
.history-list-modal {
  max-height: 400px;
  overflow-y: auto;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 20px;
}

.history-item {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.history-time {
  color: #666;
  font-size: 14px;
}

.history-type {
  font-weight: bold;
  color: #2196f3;
}

.history-rewards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-reward {
  background-color: #e3f2fd;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  color: #1976d2;
}
</style>
