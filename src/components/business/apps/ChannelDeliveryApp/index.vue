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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(0 0 0 / 20%);
  color: #fff;
}

.app-tabs {
  display: flex;
  background-color: rgb(0 0 0 / 30%);
  border-bottom: 1px solid rgb(74 158 255 / 20%);

  button {
    padding: 10px 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    color: #b0b0b0;
    transition: all 0.2s;

    &.active {
      background-color: rgb(74 158 255 / 20%);
      border-bottom: 2px solid #4a9eff;
      font-weight: bold;
      color: #fff;
    }

    &:hover {
      background-color: rgb(74 158 255 / 10%);
    }
  }
}

.channels-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.channel-card {
  background-color: rgb(0 0 0 / 20%);
  border: 1px solid rgb(74 158 255 / 20%);
  border-radius: 8px;
  padding: 15px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 10px rgb(74 158 255 / 20%);
  }

  .channel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    h3 {
      margin: 0;
      font-size: 16px;
      color: #fff;
    }

    .channel-type {
      background-color: #4a9eff;
      color: white;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
    }
  }

  .channel-stats {
    margin-bottom: 15px;

    .stat-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;

      .stat-label {
        color: #b0b0b0;
        font-size: 14px;
      }

      .stat-value {
        font-weight: bold;
        font-size: 14px;

        &.active {
          color: #2ed573;
        }

        &.inactive {
          color: #999;
        }
      }
    }
  }

  .channel-actions {
    display: flex;
    justify-content: center;
  }
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &.primary {
    background-color: #4a9eff;
    color: white;

    &:hover {
      background-color: #3a8bd5;
    }
  }

  &.secondary {
    background-color: rgb(0 0 0 / 30%);
    color: #fff;
    border: 1px solid rgb(74 158 255 / 30%);

    &:hover {
      background-color: rgb(0 0 0 / 40%);
    }
  }
}

.app-footer {
  padding: 15px 20px;
  border-top: 1px solid rgb(74 158 255 / 20%);
  display: flex;
  justify-content: center;
}

.report-btn {
  padding: 10px 24px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3a8bd5;
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgb(26 26 46 / 95%);
  border: 1px solid rgb(74 158 255 / 30%);
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;

  h3 {
    margin-bottom: 20px;
    color: #fff;
  }
}

.intensity-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.intensity-btn {
  padding: 15px;
  background-color: rgb(0 0 0 / 20%);
  border: 1px solid rgb(74 158 255 / 20%);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  color: #fff;

  &:hover {
    background-color: rgb(74 158 255 / 20%);
    border-color: #4a9eff;
  }

  .intensity-desc {
    display: block;
    font-size: 12px;
    color: #b0b0b0;
    margin-top: 5px;
  }
}

.cancel-btn {
  padding: 10px 24px;
  background-color: rgb(0 0 0 / 30%);
  color: #fff;
  border: 1px solid rgb(74 158 255 / 30%);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgb(0 0 0 / 40%);
  }
}
</style>


