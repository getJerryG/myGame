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

// 活跃模块状态
const activeModule = ref(props.app.modules[0].id);

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

// 处理侧边栏项点击
const handleItemChange = (itemId: string): void => {
  activeModule.value = itemId;
  emit('update:activeModule', itemId);
};
</script>

<style lang="scss" scoped>

/* 侧边栏菜单 */
.sidebar-menu {
  @include utils.flex-col(0, stretch);

  width: 100%;
  height: 100%;
  background-color: tokens.$bg-secondary;
  padding: tokens.$spacing-md 0;
  overflow-y: auto;
}

.menu-item {
  @include utils.flex-row(tokens.$spacing-md, center);

  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: none;
  border: none;
  color: tokens.$text-secondary;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  text-align: left;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;

  &:hover {
    background-color: tokens.$bg-light;
    color: tokens.$primary-blue;
  }

  &.active {
    background-color: rgb(59 130 246 / 20%);
    color: tokens.$primary-blue;
    border-right: 3px solid tokens.$primary-blue;
  }
}

.menu-icon {
  font-size: 20px;
}

/* 钱包内容区域 */
.wallet-content {
  width: 100%;
  height: 100%;
  padding: tokens.$spacing-lg;
  background-color: tokens.$bg-primary;
  color: tokens.$text-primary;
  overflow-y: auto;

  @include utils.custom-scrollbar;
}

.module-content {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  min-height: 200px;
  box-shadow: tokens.$shadow-md;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-xl;
    color: tokens.$primary-gold;
    font-weight: tokens.$font-weight-bold;
  }

  h4 {
    margin: 0 0 tokens.$space-3;
    font-size: tokens.$font-size-base;
    color: tokens.$text-primary;
  }

  p {
    margin: 0 0 tokens.$space-4;
    color: tokens.$text-secondary;
    line-height: tokens.$line-height-normal;
  }
}

/* 钱包应用样式 */
.balance-container {
  margin-top: tokens.$spacing-md;
}

.balance-card {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-xl;
  border: 1px solid tokens.$border-light;
  transition: all tokens.$transition-fast;
  text-align: center;
  box-shadow: tokens.$shadow-md;

  &:hover {
    border-color: tokens.$primary-blue;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }
}

.balance-amount {
  font-size: 52px;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary-gold;
  margin: tokens.$spacing-md 0;
}

.balance-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: tokens.$spacing-lg;
  margin-top: tokens.$spacing-xl;
  padding-top: tokens.$spacing-xl;
  border-top: 1px solid tokens.$border-light;
}

.detail-item {
  @include utils.flex-col(tokens.$space-1, center);
}

.detail-label {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-sm;
}

.detail-value {
  color: tokens.$text-primary;
  font-weight: tokens.$font-weight-bold;
  font-size: tokens.$font-size-xl;

  &.positive {
    color: tokens.$success;
  }

  &.negative {
    color: tokens.$error;
  }
}

/* 交易记录样式 */
.transaction-history {
  margin-top: tokens.$spacing-md;

  @include utils.flex-col(tokens.$spacing-md);
}

.transaction-item {
  @include utils.flex-between;

  background-color: tokens.$bg-secondary;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  border: 1px solid tokens.$border-light;
  transition: all tokens.$transition-fast;
  box-shadow: tokens.$shadow-sm;

  &:hover {
    border-color: tokens.$primary-blue;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-md;
  }
}

.transaction-info {
  @include utils.flex-col(tokens.$space-1);
}

.transaction-type {
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-base;
}

.transaction-date {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-xs;
}

.transaction-amount {
  font-weight: tokens.$font-weight-bold;
  font-size: tokens.$font-size-xl;

  &.positive {
    color: tokens.$success;
  }

  &.negative {
    color: tokens.$error;
  }
}

.no-transactions {
  text-align: center;
  padding: tokens.$spacing-2xl;
  color: tokens.$text-secondary;
  background-color: tokens.$bg-light;
  border: 1px dashed tokens.$border-light;
  border-radius: tokens.$radius-md;
}

/* 响应式设计 */
@include utils.mobile {
  .wallet-content {
    padding: tokens.$spacing-md;
  }

  .module-content {
    padding: tokens.$spacing-md;
  }

  .balance-card {
    padding: tokens.$spacing-lg;
  }

  .balance-amount {
    font-size: 36px;
  }

  .balance-details {
    grid-template-columns: 1fr;
    gap: tokens.$spacing-md;
  }

  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: tokens.$space-3;
  }

  .transaction-amount {
    align-self: flex-end;
  }
}
</style>
