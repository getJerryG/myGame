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
                <span class="stat-label">转化率</span>
                <span class="stat-value"
                  >{{ channel.stats.conversionRate }}%</span
                >
              </div>
              <div class="stat-item">
                <span class="stat-label">成本</span>
                <span class="stat-value">{{ channel.stats.cost }}万</span>
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
            <div class="budget-value">{{ localSettings.budget }}万</div>
          </div>
        </div>

        <!-- 投放时长 -->
        <div class="setting-item">
          <label class="setting-label">投放时长</label>
          <select v-model="localSettings.duration" class="setting-select">
            <option value="7">7天</option>
            <option value="14">14天</option>
            <option value="30">30天</option>
            <option value="60">60天</option>
          </select>
        </div>

        <!-- 目标受众 -->
        <div class="setting-item">
          <label class="setting-label">目标受众</label>
          <select v-model="localSettings.targetAudience" class="setting-select">
            <option value="youngAdult">青少年</option>
            <option value="adult">成年人</option>
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
          <div class="prediction-value">{{ getPredictedUsers() }}万</div>
        </div>
        <div class="prediction-card">
          <div class="prediction-label">预计转化率</div>
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

<script setup lang="ts">
import { ref, watch } from "vue";

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

const emit = defineEmits(["update:settings", "update:selectedChannelIds"]);

// 本地设置副本
const localSettings = ref({ ...props.settings });
const localSelectedChannelIds = ref([...props.selectedChannelIds]);

// 监听props变化，更新本地状态
watch(
  () => props.settings,
  (newSettings) => {
    localSettings.value = { ...newSettings };
  },
  { deep: true },
);

watch(
  () => props.selectedChannelIds,
  (newIds) => {
    localSelectedChannelIds.value = [...newIds];
  },
  { deep: true },
);

// 监听本地状态变化，通知父组件
watch(
  localSettings,
  (newSettings) => {
    emit("update:settings", { ...newSettings });
  },
  { deep: true },
);

watch(
  localSelectedChannelIds,
  (newIds) => {
    emit("update:selectedChannelIds", [...newIds]);
  },
  { deep: true },
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
  // 简单估算
  return Math.round((budget / 10000) * selectedChannelsCount * 50);
}

// 计算预计转化率
function getPredictedConversionRate(): string {
  if (localSelectedChannelIds.value.length === 0) return "0";
  const totalRate = localSelectedChannelIds.value.reduce((sum, channelId) => {
    const channel = props.channels.find((c) => c.id === channelId);
    return sum + channel.stats.conversionRate;
  }, 0);
  return (totalRate / localSelectedChannelIds.value.length).toFixed(1);
}

// 计算预计ROI
function getPredictedROI(): string {
  // 简单估算
  return "185";
}
</script>

<style lang="scss" scoped>
.advertising-config {
  padding: 0;
}

/* 投放渠道 */
.channel-section {
  margin-bottom: tokens.$spacing-xl;

  h5 {
    @include utils.subsection-title;
  }
}

.channels-grid {
  @include utils.grid-auto-fill(300px, tokens.$spacing-md);
}

.channel-card {
  @include utils.interactive-card;
  @include utils.flex-row(tokens.$spacing-md, center);

  &.selected {
    background-color: rgb(59 130 246 / 20%);
    border-color: tokens.$primary-blue;
    box-shadow: tokens.$shadow-blue;
  }
}

.channel-icon {
  font-size: tokens.$font-size-2xl;
  flex-shrink: 0;
}

.channel-info {
  flex: 1;
}

.channel-name {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin-bottom: tokens.$spacing-xs;
}

.channel-desc {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-sm;
}

.channel-stats {
  @include utils.flex-row(tokens.$spacing-md, center);
}

.stat-item {
  @include utils.stat-item;
}

.stat-label {
  @include utils.stat-label;
}

.stat-value {
  @include utils.stat-value;
}

/* 投放设置 */
.settings-section {
  margin-bottom: tokens.$spacing-xl;

  h5 {
    @include utils.subsection-title;
  }
}

.settings-grid {
  @include utils.grid-auto-fill(250px, tokens.$spacing-md);
}

.setting-item {
  @include utils.flex-col(tokens.$spacing-sm, stretch);
}

.setting-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  font-weight: tokens.$font-weight-medium;
}

.budget-control {
  @include utils.flex-col(tokens.$spacing-sm, stretch);
}

.budget-slider {
  @include utils.slider-base;
}

.budget-value {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary-gold;
  text-align: center;
}

.setting-select {
  @include utils.select-base;
}

/* 投放效果预测 */
.prediction-section {
  h5 {
    @include utils.subsection-title;
  }
}

.prediction-grid {
  @include utils.grid-auto-fill(200px, tokens.$spacing-md);
}

.prediction-card {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;

  @include utils.flex-col(tokens.$spacing-sm, stretch);
}

.prediction-label {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

.prediction-value {
  @include utils.value-text(tokens.$font-size-lg);
}
</style>
