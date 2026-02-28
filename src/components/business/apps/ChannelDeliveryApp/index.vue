<template>
  <div class="channel-delivery-app">
    <div class="app-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        全部渠道
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'online' }"
        @click="activeTab = 'online'"
      >
        线上渠道
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'offline' }"
        @click="activeTab = 'offline'"
      >
        线下渠道
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'cooperation' }"
        @click="activeTab = 'cooperation'"
      >
        合作渠道
      </button>
    </div>

    <div class="channels-container">
      <div
        v-for="channel in filteredChannels"
        :key="channel.id"
        class="channel-card"
      >
        <div class="channel-header">
          <h3>{{ channel.name }}</h3>
          <span class="channel-type">{{ getChannelTypeName(channel.type) }}</span>
        </div>

        <div class="channel-stats">
          <div class="stat-item">
            <span class="stat-label">投放效果:</span>
            <span class="stat-value">{{ channel.effect }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">投放成本:</span>
            <span class="stat-value">{{ channel.cost }} 资金</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">状�?</span>
            <span
              class="stat-value"
              :class="channel.status"
              >{{ channel.status === 'active' ? '投放�? : '未投�? }}</span
            >
          </div>
        </div>

        <div class="channel-actions">
          <button
            v-if="channel.status === 'inactive'"
            class="action-btn primary"
            @click="openIntensityModal(channel)"
          >
            开启投�?          </button>
          <button
            v-else
            class="action-btn secondary"
            @click="stopDelivery(channel)"
          >
            停止投放
          </button>
        </div>
      </div>
    </div>

    <div class="app-footer">
      <button
        class="report-btn"
        @click="viewReport"
      >
        查看投放报告
      </button>
    </div>

    <div
      v-if="showIntensityModal"
      class="modal-overlay"
      @click="closeIntensityModal"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <h3>选择投放力度</h3>
        <div class="intensity-options">
          <button
            class="intensity-btn"
            @click="confirmIntensity('light')"
          >
            轻度投放
            <span class="intensity-desc">成本低，效果稳定</span>
          </button>
          <button
            class="intensity-btn"
            @click="confirmIntensity('medium')"
          >
            中度投放
            <span class="intensity-desc">成本适中，效果显�?/span>
          </button>
          <button
            class="intensity-btn"
            @click="confirmIntensity('heavy')"
          >
            重磅投放
            <span class="intensity-desc">成本高，效果爆发</span>
          </button>
        </div>
        <button
          class="cancel-btn"
          @click="closeIntensityModal"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getChannelTypeName } from '@/utils/appUtils';

interface Channel {
  id: string;
  name: string;
  type: 'online' | 'offline' | 'cooperation';
  effect: string;
  cost: number;
  status: 'active' | 'inactive';
}

const activeTab = ref<'all' | 'online' | 'offline' | 'cooperation'>('all');
const showIntensityModal = ref(false);
const selectedChannel = ref<Channel | null>(null);

const channels = ref<Channel[]>([
  { id: '1', name: '应用商店推广', type: 'online', effect: '�?, cost: 1000, status: 'inactive' },
  { id: '2', name: '社交媒体广告', type: 'online', effect: '�?, cost: 800, status: 'active' },
  { id: '3', name: 'KOL 合作', type: 'online', effect: '�?, cost: 1500, status: 'inactive' },
  { id: '4', name: '线下展会', type: 'offline', effect: '�?, cost: 2000, status: 'inactive' },
  { id: '5', name: '网吧推广', type: 'offline', effect: '�?, cost: 600, status: 'inactive' },
  { id: '6', name: '游戏平台联动', type: 'cooperation', effect: '�?, cost: 2500, status: 'inactive' },
  { id: '7', name: '直播平台合作', type: 'online', effect: '�?, cost: 1800, status: 'inactive' },
  { id: '8', name: '校园推广', type: 'offline', effect: '�?, cost: 700, status: 'inactive' },
]);

const filteredChannels = computed(() => {
  if (activeTab.value === 'all') {
    return channels.value;
  }
  return channels.value.filter((channel) => channel.type === activeTab.value);
});

const openIntensityModal = (channel: Channel): void => {
  selectedChannel.value = channel;
  showIntensityModal.value = true;
};

const closeIntensityModal = (): void => {
  showIntensityModal.value = false;
  selectedChannel.value = null;
};

const confirmIntensity = (_intensity: 'light' | 'medium' | 'heavy'): void => {
  if (selectedChannel.value) {
    const index = channels.value.findIndex((c) => c.id === selectedChannel.value!.id);
    if (index !== -1) {
      channels.value[index].status = 'active';
    }
    closeIntensityModal();
  }
};

const stopDelivery = (channel: Channel): void => {
  const index = channels.value.findIndex((c) => c.id === channel.id);
  if (index !== -1) {
    channels.value[index].status = 'inactive';
  }
};

const viewReport = (): void => {
  alert('投放报告已生成，可在数据中心查看详细数据');
};
</script>

<style lang="scss" scoped>

.channel-delivery-app {
  @include utils.flex-col(0, stretch, flex-start);
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: tokens.$bg-light;
  color: tokens.$text-primary;
}

.app-tabs {
  @include utils.flex-row(0, center, flex-start);
  background-color: tokens.$bg-light;
  border-bottom: 1px solid rgba(tokens.$primary-blue, 0.2);

  button {
    padding: tokens.$spacing-sm tokens.$spacing-md;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: tokens.$font-size-sm;
    color: tokens.$text-muted;
    transition: all tokens.$transition-fast;

    &.active {
      background-color: rgba(tokens.$primary-blue, 0.2);
      border-bottom: 2px solid tokens.$primary-blue;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
    }

    &:hover {
      background-color: rgba(tokens.$primary-blue, 0.1);
    }
  }
}

.channels-container {
  flex: 1;
  padding: tokens.$spacing-lg;
  overflow-y: auto;
  @include utils.grid-auto-fill(280px, tokens.$spacing-lg);
  @include utils.custom-scrollbar;
}

.channel-card {
  background-color: tokens.$bg-light;
  border: 1px solid rgba(tokens.$primary-blue, 0.2);
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  transition: box-shadow tokens.$transition-fast;

  &:hover {
    box-shadow: tokens.$shadow-blue;
  }

  .channel-header {
    @include utils.flex-between;
    margin-bottom: tokens.$spacing-sm;

    h3 {
      margin: 0;
      font-size: tokens.$font-size-base;
      color: tokens.$text-primary;
    }

    .channel-type {
      background-color: tokens.$primary-blue;
      color: tokens.$text-primary;
      padding: 3px tokens.$spacing-sm;
      border-radius: tokens.$radius-full;
      font-size: tokens.$font-size-xs;
    }
  }

  .channel-stats {
    margin-bottom: tokens.$spacing-md;

    .stat-item {
      @include utils.flex-between;
      margin-bottom: 5px;

      .stat-label {
        color: tokens.$text-muted;
        font-size: tokens.$font-size-sm;
      }

      .stat-value {
        font-weight: tokens.$font-weight-bold;
        font-size: tokens.$font-size-sm;

        &.active {
          color: tokens.$success;
        }

        &.inactive {
          color: tokens.$gray-500;
        }
      }
    }
  }

  .channel-actions {
    @include utils.flex-center;
  }
}

.action-btn {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  transition: all tokens.$transition-fast;

  &.primary {
    background-color: tokens.$primary-blue;
    color: tokens.$text-primary;

    &:hover {
      background-color: tokens.$primary-dark;
    }
  }

  &.secondary {
    background-color: tokens.$bg-light;
    color: tokens.$text-primary;
    border: 1px solid rgba(tokens.$primary-blue, 0.3);

    &:hover {
      background-color: rgba(tokens.$bg-light, 1.5);
    }
  }
}

.app-footer {
  padding: tokens.$spacing-md tokens.$spacing-lg;
  border-top: 1px solid rgba(tokens.$primary-blue, 0.2);
  @include utils.flex-center;
}

.report-btn {
  padding: tokens.$spacing-sm tokens.$spacing-lg;
  background-color: tokens.$primary-blue;
  color: tokens.$text-primary;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  transition: background-color tokens.$transition-fast;

  &:hover {
    background-color: tokens.$primary-dark;
  }
}

.modal-overlay {
  @include utils.modal-overlay;
}

.modal-content {
  background-color: tokens.$bg-secondary;
  border: 1px solid rgba(tokens.$primary-blue, 0.3);
  padding: tokens.$spacing-lg;
  border-radius: tokens.$radius-md;
  width: 400px;
  text-align: center;

  h3 {
    margin-bottom: tokens.$spacing-lg;
    color: tokens.$text-primary;
  }
}

.intensity-options {
  @include utils.flex-col(tokens.$spacing-sm);
  margin-bottom: tokens.$spacing-lg;
}

.intensity-btn {
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border: 1px solid rgba(tokens.$primary-blue, 0.2);
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  text-align: left;
  color: tokens.$text-primary;

  &:hover {
    background-color: rgba(tokens.$primary-blue, 0.2);
    border-color: tokens.$primary-blue;
  }

  .intensity-desc {
    display: block;
    font-size: tokens.$font-size-xs;
    color: tokens.$text-muted;
    margin-top: 5px;
  }
}

.cancel-btn {
  padding: tokens.$spacing-sm tokens.$spacing-lg;
  background-color: tokens.$bg-light;
  color: tokens.$text-primary;
  border: 1px solid rgba(tokens.$primary-blue, 0.3);
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  transition: background-color tokens.$transition-fast;

  &:hover {
    background-color: rgba(tokens.$bg-light, 1.5);
  }
}
</style>


