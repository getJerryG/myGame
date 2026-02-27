<template>
  <div class="advertising-config">
    <!-- 广告渠道选择 -->
    <div class="channel-section">
      <h5>广告渠道</h5>
      <div class="channels-grid">
        <div
          v-for="channel in channels"
          :key="channel.id"
          class="channel-card"
          :class="{ selected: isChannelSelected(channel.id) }"
          @click="toggleChannel(channel.id)"
        >
          <div class="channel-icon">{{ channel.icon }}</div>
          <div class="channel-info">
            <div class="channel-name">{{ channel.name }}</div>
            <div class="channel-desc">{{ channel.description }}</div>
            <div class="channel-stats">
              <div class="stat-item">
                <span class="stat-label">转化�?/span>
                <span class="stat-value"
                  >{{ channel.stats.conversionRate }}%</span
                >
              </div>
              <div class="stat-item">
                <span class="stat-label">成本</span>
                <span class="stat-value">{{ channel.stats.cost }}�?/span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 投放设置 -->
    <div class="settings-section">
      <h5>投放设置</h5>
      <div class="settings-grid">
        <!-- 预算设置 -->
        <div class="setting-item">
          <label class="setting-label">投放预算</label>
          <div class="budget-control">
            <input
              v-model.number="localSettings.budget"
              type="range"
              min="100000"
              max="1000000"
              step="50000"
              class="budget-slider"
            />
            <div class="budget-value">{{ localSettings.budget }}�?/div>
          </div>
        </div>

        <!-- 投放时长 -->
        <div class="setting-item">
          <label class="setting-label">投放时长</label>
          <select v-model="localSettings.duration" class="setting-select">
            <option value="7">7�?/option>
            <option value="14">14�?/option>
            <option value="30">30�?/option>
            <option value="60">60�?/option>
          </select>
        </div>

        <!-- 目标受众 -->
        <div class="setting-item">
          <label class="setting-label">目标受众</label>
          <select v-model="localSettings.targetAudience" class="setting-select">
            <option value="youngAdult">青少�?/option>
            <option value="adult">成年�?/option>
            <option value="senior">中老年</option>
            <option value="all">全部</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 投放效果预测 -->
    <div class="prediction-section">
      <h5>投放效果预测</h5>
      <div class="prediction-grid">
        <div class="prediction-card">
          <div class="prediction-label">预计新增用户</div>
          <div class="prediction-value">{{ getPredictedUsers() }}�?/div>
        </div>
        <div class="prediction-card">
          <div class="prediction-label">预计转化�?/div>
          <div class="prediction-value">
            {{ getPredictedConversionRate() }}%
          </div>
        </div>
        <div class="prediction-card">
          <div class="prediction-label">预计ROI</div>
          <div class="prediction-value">{{ getPredictedROI() }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
import { ref, watch } from 'vue';

const props = defineProps({
  channels: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
  selectedChannelIds: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:settings', 'update:selectedChannelIds']);

// 本地设置副本
const localSettings = ref({ ...props.settings });
const localSelectedChannelIds = ref([...props.selectedChannelIds]);

// 监听props变化，更新本地状�?watch(
  () => props.settings,
  (newSettings) => {
    localSettings.value = { ...newSettings };
  },
  { deep: true }
);

watch(
  () => props.selectedChannelIds,
  (newIds) => {
    localSelectedChannelIds.value = [...newIds];
  },
  { deep: true }
);

// 监听本地状态变化，通知父组�?watch(
  localSettings,
  (newSettings) => {
    emit('update:settings', { ...newSettings });
  },
  { deep: true }
);

watch(
  localSelectedChannelIds,
  (newIds) => {
    emit('update:selectedChannelIds', [...newIds]);
  },
  { deep: true }
);

// 检查渠道是否被选中
function isChannelSelected(channelId: string): boolean {
  return localSelectedChannelIds.value.includes(channelId);
}

// 切换渠道选择
function toggleChannel(channelId: string): void {
  const index = localSelectedChannelIds.value.indexOf(channelId);
  if (index > -1) {
    localSelectedChannelIds.value.splice(index, 1);
  } else {
    localSelectedChannelIds.value.push(channelId);
  }
}

// 计算预计新增用户
function getPredictedUsers(): number {
  const budget = localSettings.value.budget;
  const selectedChannelsCount = localSelectedChannelIds.value.length;
  // 简单估�?  return Math.round((budget / 10000) * selectedChannelsCount * 50);
}

// 计算预计转化�?function getPredictedConversionRate(): string {
  if (localSelectedChannelIds.value.length === 0) return '0';
  const totalRate = localSelectedChannelIds.value.reduce((sum, channelId) => {
    const channel = props.channels.find((c) => c.id === channelId);
    return sum + channel.stats.conversionRate;
  }, 0);
  return (totalRate / localSelectedChannelIds.value.length).toFixed(1);
}

// 计算预计ROI
function getPredictedROI(): string {
  // 简单估�?  return '185';
}
</script>

<style lang=scss scoped>
.advertising-config {
  padding: 0;
}

/* 投放渠道 */
.channel-section {
  margin-bottom: 30px;
}

.channel-section h5,
.settings-section h5,
.prediction-section h5 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
  margin: 0 0 15px;
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.channel-card {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 15px;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  display: flex;
  gap: 15px;
}

.channel-card:hover {
  background-color: rgb(255 255 255 / 10%);
  border-color: var(--border-light);
}

.channel-card.selected {
  background-color: rgb(59 130 246 / 20%);
  border-color: var(--primary-blue);
  box-shadow: 0 2px 8px rgb(59 130 246 / 30%);
}

.channel-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.channel-info {
  flex: 1;
}

.channel-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 4px;
}

.channel-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.channel-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.stat-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
}

/* 投放设置 */
.settings-section {
  margin-bottom: 30px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.budget-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.budget-slider {
  width: 100%;
  height: 6px;
  background-color: rgb(255 255 255 / 10%);
  border-radius: 3px;
  outline: none;
  appearance: none;
}

.budget-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--primary-gold);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgb(251 191 36 / 40%);
}

.budget-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--primary-gold);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgb(251 191 36 / 40%);
}

.budget-value {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--primary-gold);
  text-align: center;
}

.setting-select {
  padding: 10px 12px;
  background-color: rgb(255 255 255 / 5%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.setting-select:focus {
  outline: none;
  border-color: var(--primary-gold);
  box-shadow: 0 0 0 3px rgb(251 191 36 / 10%);
}

/* 投放效果预测 */
.prediction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.prediction-card {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prediction-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.prediction-value {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--primary-gold);
}
</style>




