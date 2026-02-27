<template>
  <div class="lottery-container">
    <!-- 导航�?-->
    <AppNavbar />

    <h1 class="title">无相抽签系统</h1>

    <!-- 通知组件 -->
    <div
      v-if="notification.show"
      class="notification"
      :class="notification.type"
    >
      <div class="notification-content">{{ notification.message }}</div>
      <button
        class="notification-close"
        @click="notification.show = false"
      >
        ×
      </button>
    </div>

    <div class="main-content">
      <!-- 左栏：收纳盒 -->
      <div class="left-column">
        <div class="left-content">
          <LotteryStorageBox />
        </div>

        <!-- 抽奖历史入口按钮 -->
        <div class="history-button-container">
          <button
            class="history-button"
            @click="showHistoryModal = true"
          >
            抽奖历史
            <span
              v-if="lotteryStore.history.length > 0"
              class="history-count"
              >{{ lotteryStore.history.length }}</span
            >
          </button>
        </div>
      </div>

      <!-- 中间栏：主要抽奖功能 -->
      <div class="middle-column">
        <div class="middle-content">
          <!-- 数据展示 -->
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
                    <span class="rule-label">10�?=</span>
                    <span class="rule-value">10祈愿券</span>
                  </div>
                  <div class="rule-item">
                    <span class="rule-label">初始赠送：</span>
                    <span class="rule-value">9祈愿券</span>
                  </div>
                  <div class="rule-item">
                    <span class="rule-label">首次单抽</span>
                    <span class="rule-value">1券</span>
                  </div>
                  <div class="rule-item">
                    <span class="rule-label">10连抽</span>
                    <span class="rule-value">91券</span>
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
              @click="showResetConfirm = true"
            >
              重置数据
            </button>
            <button
              class="back-button"
              @click="$router.push('/')"
            >
              返回游戏
            </button>
          </div>

          <!-- 开发调试：充值祈愿石 -->
          <div class="debug-panel">
            <input
              v-model.number="addStones"
              type="number"
              placeholder="充值祈愿石数量"
              min="1"
            />
            <button
              @click="handleAddStones"
              :disabled="addStones <= 0"
            >
              充�?
            </button>
          </div>

          <!-- 抽奖结果展示 -->
          <LotteryResultPanel
            :last-result="lastResult"
            :is-animating="isAnimating"
          />
        </div>

        <!-- 抽奖按钮 -->
        <LotteryDrawButtons
          @single-draw="handleSingleDraw"
          @ten-draws="handleTenDraws"
        />
      </div>

      <!-- 右栏：累抽奖�?-->
      <div class="right-column">
        <LotteryCumulativeRewards />
      </div>
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
              @click="showClearHistoryConfirm = true"
            >
              清空历史
            </button>
            <span class="history-count-info">{{ lotteryStore.history.length }}条记录</span>
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

    <!-- 确认弹窗 -->
    <div
      v-if="showResetConfirm || showClearHistoryConfirm"
      class="modal-overlay"
      @click="cancelConfirm"
    >
      <div
        class="modal-content confirm-modal"
        @click.stop
      >
        <div class="modal-header">
          <h3>{{ showResetConfirm ? '重置数据' : '清空抽奖历史' }}</h3>
          <button
            class="close-button"
            @click="cancelConfirm"
          >
            ×
          </button>
        </div>
        <div class="modal-body">
          <p>
            {{ showResetConfirm ? '确定要重置所有数据吗？此操作不可恢复？' : '确定要清空抽奖历史吗？此操作不可恢复？' }}
          </p>
        </div>
        <div class="modal-footer">
          <button
            class="cancel-button"
            @click="cancelConfirm"
          >
            取消
          </button>
          <button
            class="confirm-button"
            @click="confirmAction"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLotteryStore } from '@/stores/lotteryStore';
import AppNavbar from '@/components/common/AppNavbar/index.vue';
import LotteryStorageBox from '@/components/business/lottery/LotteryStorageBox/index.vue';
import LotteryDataPanel from '@/components/business/lottery/LotteryDataPanel/index.vue';
import LotteryDrawButtons from '@/components/business/lottery/LotteryDrawButtons/index.vue';
import LotteryResultPanel from '@/components/business/lottery/LotteryResultPanel/index.vue';
import LotteryCumulativeRewards from '@/components/business/lottery/LotteryCumulativeRewards/index.vue';

const lotteryStore = useLotteryStore();
const lastResult = ref(null);
const addStones = ref(0);
const isAnimating = ref(false); // 抽奖结果动画状态
const showHistoryModal = ref(false); // 抽奖历史弹窗显示状态
const showConsumptionInfo = ref(false); // 消费说明弹窗显示状态
const showResetConfirm = ref(false); // 重置数据确认弹窗
const showClearHistoryConfirm = ref(false); // 清空历史确认弹窗

// 通知状态
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
});

/**
 * 显示通知
 * @param message 通知消息
 * @param type 通知类型
 */
const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): void => {
  notification.value = { show: true, message, type };
  // 3秒后自动关闭
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

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
      showNotification('抽奖成功');
    }, 100);
  } else {
    showNotification(result.message, 'error');
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
      showNotification('10连抽成功');
    }, 100);
  } else {
    showNotification(result.message, 'error');
  }
};

/**
 * 处理兑换皮肤
 */
const handleExchange = (): void => {
  const success = lotteryStore.exchangeSkin();
  if (success) {
    showNotification('兑换成功');
  } else {
    showNotification('兑换失败，积分不足！', 'error');
  }
};

/**
 * 处理充值祈愿石（按1:10比例�? */
const handleAddStones = (): void => {
  if (addStones.value > 0) {
    lotteryStore.stones += addStones.value * 10;
    showNotification('成功充�?{addStones.value * 10}祈愿石！');
    addStones.value = 0;
  }
};

/**
 * 取消确认操作
 */
const cancelConfirm = (): void => {
  showResetConfirm.value = false;
  showClearHistoryConfirm.value = false;
};

/**
 * 确认操作
 */
const confirmAction = (): void => {
  if (showResetConfirm.value) {
    lotteryStore.resetData();
    lastResult.value = null;
    showNotification('数据重置成功');
  } else if (showClearHistoryConfirm.value) {
    lotteryStore.history = [];
    showNotification('抽奖历史清空成功');
  }
  cancelConfirm();
};
</script>

<style lang="scss" scoped>
/* 主内�? */
.lottery-container {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 0;
  font-family: Arial, sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 通知样式 */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: #52c41a;
}

.notification.error {
  background-color: #f5222d;
}

.notification.warning {
  background-color: #faad14;
}

.notification.info {
  background-color: #1890ff;
}

.notification-content {
  margin-right: 16px;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.notification-close:hover {
  background-color: rgb(255 255 255 / 20%);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 标题样式 */
.title {
  text-align: center;
  color: #333;
  margin: 20px 0;
  height: 40px;
  line-height: 40px;
  flex-shrink: 0;
}

/* 三栏布局 */
.main-content {
  width: 95%;
  flex: 1;
  margin: 20px auto 30px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  min-height: 0;
  gap: 20px;
}

/* 左侧�? */
.left-column {
  width: 18%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* 中间�? */
.middle-column {
  width: 64%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.middle-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* 右侧�? */
.right-column {
  width: 18%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 按钮面板 */
.button-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  height: 50px;
  align-items: center;
  flex-shrink: 0;
}

.exchange-button,
.reset-button,
.back-button {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exchange-button {
  background-color: #ff9800;
  color: white;
}

.exchange-button:hover:not(:disabled) {
  background-color: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
}

.reset-button {
  background-color: #f44336;
  color: white;
}

.reset-button:hover:not(:disabled) {
  background-color: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
}

.back-button {
  background-color: #9e9e9e;
  color: white;
}

.back-button:hover {
  background-color: #757575;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 调试面板 */
.debug-panel {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
  flex-shrink: 0;
}

.debug-panel input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  width: 200px;
}

.debug-panel button {
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.debug-panel button:hover:not(:disabled) {
  background-color: #45a049;
}

/* 历史按钮样式 */
.history-button-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.history-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;
  position: relative;
}

.history-button:hover {
  background-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #e0e0e0;
}

.modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.modal-footer {
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button,
.confirm-button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #333;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

.confirm-button {
  background-color: #f5222d;
  color: white;
}

.confirm-button:hover {
  background-color: #d32f2f;
}

/* 消费说明弹窗 */
.consumption-rules {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.rule-label {
  font-weight: bold;
  color: #666;
}

.rule-value {
  color: #333;
  font-weight: bold;
}

/* 抽奖历史弹窗 */
.modal-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.clear-history {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.clear-history:hover {
  background-color: #d32f2f;
}

.history-count-info {
  color: #666;
  font-size: 14px;
}

.history-list-modal {
  max-height: 300px;
  overflow-y: auto;
}

.empty-message {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
  background-color: white;
  border-radius: 5px;
  margin-top: 15px;
}

.history-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.history-time {
  color: #666;
  font-size: 14px;
}

.history-type {
  background-color: #2196f3;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.history-rewards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-reward {
  background-color: white;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 响应式设�? */
@media (width <= 1024px) {
  .lottery-container {
    height: auto;
    overflow-y: auto;
    display: block;
  }

  .main-content {
    width: 95%;
    height: auto;
    margin: 20px auto;
    flex-direction: column;
    overflow-y: auto;
    flex: none;
  }

  .left-column,
  .middle-column,
  .right-column {
    width: 100%;
    height: auto;
    min-height: auto;
    overflow: visible;
    justify-content: flex-start;
  }

  .left-column,
  .right-column {
    margin-bottom: 20px;
  }

  .title {
    margin: 20px 0;
  }
}

/* 超小屏幕适配 */
@media (width <= 640px) {
  .lottery-container {
    padding: 0 10px;
  }

  .main-content {
    width: 100%;
    margin: 10px 0;
  }

  .title {
    font-size: 24px;
    height: auto;
    line-height: normal;
  }

  .exchange-button,
  .reset-button,
  .back-button {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }

  .button-panel {
    flex-direction: column;
    gap: 8px;
    height: auto;
  }

  .debug-panel {
    flex-direction: column;
    height: auto;
  }

  .debug-panel input {
    width: 100%;
  }

  .history-button {
    padding: 10px;
    font-size: 14px;
  }

  .notification {
    left: 20px;
    right: 20px;
  }
}
</style>

<style lang="scss" scoped>
/* 主内�? */
.lottery-container {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 0;
  font-family: Arial, sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 标题样式 */
.title {
  text-align: center;
  color: #333;
  margin: 20px 0;
  height: 40px;
  line-height: 40px;
  flex-shrink: 0;
}

/* 三栏布局 */
.main-content {
  width: 95%;
  flex: 1;
  margin: 20px auto 30px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  min-height: 0;
  gap: 20px;
}

/* 左侧�? */
.left-column {
  width: 18%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* 中间�? */
.middle-column {
  width: 64%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.middle-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* 右侧�? */
.right-column {
  width: 18%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* 按钮面板 */
.button-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  height: 50px;
  align-items: center;
  flex-shrink: 0;
}

.exchange-button,
.reset-button,
.back-button {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exchange-button {
  background-color: #ff9800;
  color: white;
}

.reset-button {
  background-color: #f44336;
  color: white;
}

.back-button {
  background-color: #9e9e9e;
  color: white;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 调试面板 */
.debug-panel {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
  flex-shrink: 0;
}

.debug-panel input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  width: 200px;
}

.debug-panel button {
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.debug-panel button:hover {
  background-color: #45a049;
}

/* 历史按钮样式 */
.history-button-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.history-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;
  position: relative;
}

.history-button:hover {
  background-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #e0e0e0;
}

.modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

/* 消费说明弹窗 */
.consumption-rules {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.rule-label {
  font-weight: bold;
  color: #666;
}

.rule-value {
  color: #333;
  font-weight: bold;
}

/* 抽奖历史弹窗 */
.modal-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.clear-history {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.clear-history:hover {
  background-color: #d32f2f;
}

.history-count-info {
  color: #666;
  font-size: 14px;
}

.history-list-modal {
  max-height: 300px;
  overflow-y: auto;
}

.empty-message {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
  background-color: white;
  border-radius: 5px;
  margin-top: 15px;
}

.history-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.history-time {
  color: #666;
  font-size: 14px;
}

.history-type {
  background-color: #2196f3;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.history-rewards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-reward {
  background-color: white;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 响应式设�? */
@media (width <= 1024px) {
  .lottery-container {
    height: auto;
    overflow-y: auto;
    display: block;
  }

  .main-content {
    width: 95%;
    height: auto;
    margin: 20px auto;
    flex-direction: column;
    overflow-y: auto;
    flex: none;
  }

  .left-column,
  .middle-column,
  .right-column {
    width: 100%;
    height: auto;
    min-height: auto;
    overflow: visible;
    justify-content: flex-start;
  }

  .left-column,
  .right-column {
    margin-bottom: 20px;
  }

  .title {
    margin: 20px 0;
  }
}

/* 超小屏幕适配 */
@media (width <= 640px) {
  .lottery-container {
    padding: 0 10px;
  }

  .main-content {
    width: 100%;
    margin: 10px 0;
  }

  .title {
    font-size: 24px;
    height: auto;
    line-height: normal;
  }

  .exchange-button,
  .reset-button,
  .back-button {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }

  .button-panel {
    flex-direction: column;
    gap: 8px;
    height: auto;
  }

  .debug-panel {
    flex-direction: column;
    height: auto;
  }

  .debug-panel input {
    width: 100%;
  }

  .history-button {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
