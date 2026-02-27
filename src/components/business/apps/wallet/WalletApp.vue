<template>
  <ApplicationWindow windowTitle="钱包">
    <template #sidebar>
      <div class="sidebar-menu">
        <button
          v-for="item in sidebarItems"
          :key="item.id"
          class="menu-item"
          :class="{ active: activeModule === item.id }"
          @click="handleItemChange(item.id)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-name">{{ item.name }}</span>
        </button>
      </div>
    </template>

    <template #content>
      <div class="wallet-content">
        <!-- 余额信息模块 -->
        <div
          v-if="activeModule === 'balance-info'"
          class="module-content"
        >
          <h3 class="text-gold">余额信息</h3>
          <div class="balance-container">
            <div class="balance-card">
              <div class="balance-header">
                <h4>当前余额</h4>
              </div>
              <div class="balance-amount text-gold">
                {{ gameData?.gameState?.plannerFunds || app.coreData.balance }}
              </div>
              <div class="balance-details">
                <div class="detail-item">
                  <span class="detail-label">可用余额</span>
                  <span class="detail-value">{{ gameData?.gameState?.plannerFunds || app.coreData.balance }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">本月收入</span>
                  <span class="detail-value positive">{{ gameData?.businessData?.totalRevenue || 0 }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">本月支出</span>
                  <span class="detail-value negative">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 交易记录模块 -->
        <div
          v-else-if="activeModule === 'transaction-history'"
          class="module-content"
        >
          <h3 class="text-gold">交易记录</h3>
          <div class="transaction-history">
            <div
              class="transaction-item"
              v-for="(transaction, index) in transactionHistory"
              :key="index"
            >
              <div class="transaction-info">
                <div class="transaction-type">{{ transaction.type }}</div>
                <div class="transaction-date">{{ transaction.date }}</div>
              </div>
              <div
                class="transaction-amount"
                :class="transaction.amount >= 0 ? 'positive' : 'negative'"
              >
                {{ transaction.amount >= 0 ? '+' : '' }}{{ transaction.amount }}
              </div>
            </div>
            <div
              class="no-transactions"
              v-if="transactionHistory.length === 0"
            >
              <p>暂无交易记录</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';
import { getModuleIcon } from '@/utils/appUtils';

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

// 活跃模块状�?const activeModule = ref(props.app.modules[0].id);

// 格式化侧边栏项，添加图标
const sidebarItems = computed(() => {
  return props.app.modules.map((module) => ({
    id: module.id,
    name: module.name,
    icon: getModuleIcon(module.id),
  }));
});

// 模拟交易记录数据
const transactionHistory = ref([
  {
    id: 1,
    type: '收入',
    amount: 5000,
    date: '2026-02-03 10:00',
  },
  {
    id: 2,
    type: '支出',
    amount: -2000,
    date: '2026-02-02 15:30',
  },
  {
    id: 3,
    type: '收入',
    amount: 8000,
    date: '2026-02-01 09:15',
  },
]);

// 当前激活的模块（暂未使用，保留以备后续扩展�?// const currentModule = computed(() => {
//   return props.app.modules.find((m) => m.id === activeModule.value) || props.app.modules[0];
// });

// 处理侧边栏项点击
const handleItemChange = (itemId: string): void => {
  activeModule.value = itemId;
  emit('update:activeModule', itemId);
};
</script>

<style lang="scss" scoped>
/* 侧边栏菜�? */
.sidebar-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--sidebar-bg, #2a2a3a);
  padding: 16px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: none;
  border: none;
  color: var(--sidebar-text, #aaa);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 16px;
  font-weight: var(--font-semibold, 600);
}

.menu-item:hover {
  background-color: var(--sidebar-hover, rgb(74 158 255 / 10%));
  color: var(--sidebar-hover-text, #4a9eff);
}

.menu-item.active {
  background-color: var(--sidebar-active, rgb(74 158 255 / 20%));
  color: var(--sidebar-active-text, #4a9eff);
  border-right: 3px solid var(--sidebar-active-border, #4a9eff);
}

.menu-icon {
  font-size: 20px;
}

/* 钱包内容区域 */
.wallet-content {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: var(--content-bg, #1e1e2e);
  color: var(--text-primary, #fff);
  overflow-y: auto;
}

.module-content {
  background-color: var(--card-bg, #2a2a3a);
  border-radius: 8px;
  padding: 24px;
  min-height: 200px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
}

.module-content h3 {
  margin: 0 0 20px;
  font-size: 20px;
  color: var(--primary-gold, #ffd700);
  font-weight: var(--font-bold, 700);
}

.module-content h4 {
  margin: 0 0 12px;
  font-size: 16px;
  color: var(--text-primary, #fff);
}

.module-content p {
  margin: 0 0 16px;
  color: var(--text-secondary, #b0b0b0);
  line-height: 1.6;
}

/* 钱包应用样式 */
.balance-container {
  margin-top: 16px;
}

.balance-card {
  background-color: var(--card-hover, rgb(0 0 0 / 20%));
  border-radius: 8px;
  padding: 28px;
  border: 1px solid var(--border-color, rgb(74 158 255 / 20%));
  transition: all 0.2s ease;
  text-align: center;
  box-shadow: 0 2px 8px rgb(0 0 0 / 30%);
}

.balance-card:hover {
  border-color: var(--primary-color, rgb(74 158 255 / 50%));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(0 0 0 / 40%);
}

.balance-amount {
  font-size: 52px;
  font-weight: var(--font-bold, 700);
  color: var(--primary-gold, #ffd700);
  margin: 20px 0;
}

.balance-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--border-color, rgb(74 158 255 / 20%));
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  color: var(--text-secondary, #b0b0b0);
  font-size: 14px;
}

.detail-value {
  color: var(--text-primary, #fff);
  font-weight: var(--font-bold, 700);
  font-size: 20px;
}

.detail-value.positive {
  color: var(--success-color, #2ed573);
}

.detail-value.negative {
  color: var(--danger-color, #ff4757);
}

/* 交易记录样式 */
.transaction-history {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card-bg, #2a2a3a);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color, rgb(74 158 255 / 20%));
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgb(0 0 0 / 30%);
}

.transaction-item:hover {
  border-color: var(--primary-color, rgb(74 158 255 / 50%));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(0 0 0 / 40%);
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.transaction-type {
  font-weight: var(--font-bold, 700);
  color: var(--text-primary, #fff);
  font-size: 16px;
}

.transaction-date {
  color: var(--text-secondary, #b0b0b0);
  font-size: 13px;
}

.transaction-amount {
  font-weight: var(--font-bold, 700);
  font-size: 20px;
}

.transaction-amount.positive {
  color: var(--success-color, #2ed573);
}

.transaction-amount.negative {
  color: var(--danger-color, #ff4757);
}

.no-transactions {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary, #b0b0b0);
  background-color: var(--card-hover, rgb(0 0 0 / 20%));
  border: 1px dashed var(--border-color, rgb(74 158 255 / 20%));
  border-radius: 8px;
}

/* 滚动条样�? */
.wallet-content::-webkit-scrollbar {
  width: 8px;
}

.wallet-content::-webkit-scrollbar-track {
  background: var(--scrollbar-track, rgb(0 0 0 / 10%));
  border-radius: 4px;
}

.wallet-content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, rgb(74 158 255 / 50%));
  border-radius: 4px;
}

.wallet-content::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover, rgb(74 158 255 / 70%));
}

/* 响应式设�? */
@media (width <= 768px) {
  .wallet-content {
    padding: 16px;
  }

  .module-content {
    padding: 20px;
  }

  .balance-card {
    padding: 20px;
  }

  .balance-amount {
    font-size: 36px;
  }

  .balance-details {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .transaction-amount {
    align-self: flex-end;
  }
}
</style>
