<template>
  <div class="dynamic-events-container">
    <h2 class="text-2xl font-bold mb-6">动态事件系�?/h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 当前事件 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4 flex items-center">
          <span class="text-blue-600 mr-2">⚠️</span> 当前事件
          <span class="text-sm text-gray-600 ml-2"
            >({{ simulationStore.dynamicEvents.currentEvents.length }}�?</span
          >
        </h3>

        <div
          v-if="simulationStore.dynamicEvents.currentEvents.length === 0"
          class="text-center py-8 text-gray-500"
        >
          暂无当前事件
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="event in simulationStore.dynamicEvents.currentEvents"
            :key="event.id"
            class="p-4 rounded-lg border transition-all duration-200"
            :class="[
              event.type === 'positive'
                ? 'border-green-300 bg-green-50'
                : event.type === 'negative'
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-gray-50',
            ]"
          >
            <div class="flex justify-between items-start mb-2">
              <div
                class="font-medium"
                :class="{
                  'text-green-800': event.type === 'positive',
                  'text-red-800': event.type === 'negative',
                  'text-gray-800': event.type === 'neutral',
                }"
              >
                {{ event.title }}
              </div>
              <div
                class="px-2 py-0.5 rounded text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': event.severity === 'low',
                  'bg-yellow-100 text-yellow-800': event.severity === 'medium',
                  'bg-red-100 text-red-800': event.severity === 'high',
                }"
              >
                {{
                  event.severity === 'low'
                    ? '�?
                    : event.severity === 'medium'
                      ? '�?
                      : '�?
                }}影响
              </div>
            </div>

            class="text-sm mb-3" :class="{ 'text-green-700': event.type ===
            'positive', 'text-red-700': event.type === 'negative',
            'text-gray-700': event.type === 'neutral', }" >
            {{ event.description }}
          </div>

          <!-- 效果信息 -->
          <div class="mb-3">
            <div
              class="text-xs font-medium mb-1"
              :class="{
                'text-green-700': event.type === 'positive',
                'text-red-700': event.type === 'negative',
                'text-gray-700': event.type === 'neutral',
              }"
            >
              效果
            </div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(value, key) in event.effects"
                :key="key"
                class="px-2 py-1 rounded text-xs"
                :class="{
                  'bg-green-100 text-green-800': value > 0,
                  'bg-red-100 text-red-800': value < 0,
                }"
              >
                {{ getEffectLabel(key) }}: {{ formatEffectValue(key, value) }}
              </div>
            </div>
          </div>

          <!-- 持续时间 -->
          <div class="mb-4">
            <div class="text-xs font-medium mb-1 text-gray-700">持续时间</div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div
                class="h-1.5 rounded-full transition-all duration-300"
                :class="{
                  'bg-green-600': event.type === 'positive',
                  'bg-red-600': event.type === 'negative',
                  'bg-gray-600': event.type === 'neutral',
                }"
                :style="{
                  width: `${(event.remainingDays / event.duration) * 100}%`,
                }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>剩余 {{ event.remainingDays }} �?/span>
              <span>�?{{ event.duration }} �?/span>
            </div>
          </div>

          <!-- 处理按钮 -->
          <button
            v-if="!event.handled && event.type === 'negative'"
            @click="handleEvent(event.id)"
            class="w-full py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 text-sm"
          >
            立即处理
          </button>
          <div
            v-else-if="event.handled"
            class="text-center py-2 text-green-600 text-sm"
          >
            �?已处�?          </div>
        </div>
      </div>
    </div>

    <!-- 历史事件 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-semibold mb-4 flex items-center">
        <span class="text-gray-600 mr-2">📜</span> 历史事件
        <span class="text-sm text-gray-600 ml-2"
          >({{ simulationStore.dynamicEvents.history.length }}�?</span
        >
      </h3>

      <div
        v-if="simulationStore.dynamicEvents.history.length === 0"
        class="text-center py-8 text-gray-500"
      >
        暂无历史事件
      </div>

      <div v-else class="space-y-4 max-h-[500px] overflow-y-auto">
        <div
          v-for="(event, index) in sortedHistory"
          :key="index"
          class="p-4 rounded-lg border border-gray-200 bg-gray-50"
        >
          <div class="flex justify-between items-start mb-2">
            <div
              class="font-medium"
              :class="{
                'text-green-800': event.type === 'positive',
                'text-red-800': event.type === 'negative',
                'text-gray-800': event.type === 'neutral',
              }"
            >
              {{ event.title }}
            </div>
            <div
              class="text-xs px-2 py-0.5 rounded"
              :class="{
                'bg-green-100 text-green-800': event.type === 'positive',
                'bg-red-100 text-red-800': event.type === 'negative',
                'bg-gray-100 text-gray-800': event.type === 'neutral',
              }"
            >
              {{
                event.type === 'positive'
                  ? '正面'
                  : event.type === 'negative'
                    ? '负面'
                    : '中�?
              }}
            </div>
          </div>

          <div class="text-sm text-gray-600 mb-3">
            {{ formatDate(event.date) }}

            <!-- 效果信息 -->
            <div>
              <div class="text-xs font-medium mb-1 text-gray-700">效果</div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(value, key) in event.effects"
                  :key="key"
                  class="px-2 py-1 rounded text-xs"
                  :class="{
                    'bg-green-100 text-green-800': value > 0,
                    'bg-red-100 text-red-800': value < 0,
                  }"
                >
                  {{ getEffectLabel(key) }}: {{ formatEffectValue(key, value) }}
                </div>
              </div>
            </div>

            <div v-if="event.handled" class="mt-2 text-xs text-green-600">
              �?已处�?            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 事件提示 -->
    <div class="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
      <div class="flex items-center">
        <div class="text-blue-600 mr-3">💡</div>
        <div>
          <strong class="text-blue-800">事件系统说明�?/strong>
          <p class="text-blue-700 text-sm mt-1">
            游戏每天�?0%的概率触发随机事件，事件可能带来正面或负面影响。负面事件可以立即处理以减轻其影响�?            事件持续一段时间后会自动结束，其效果也会随之消失�?          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

const simulationStore = useSimulationStore();

// 获取排序后的历史事件（最新的在前�?const sortedHistory = computed(() => {
  return [...simulationStore.dynamicEvents.history].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

// 获取效果标签
const getEffectLabel = (type: string): string => {
  const labels = {
    downloads: '下载�?,
    revenue: '收入',
    marketSentiment: '市场情绪',
    dau: '日活用户',
    sevenDayRetention: '7日留存率',
  };
  return labels[type as keyof typeof labels] || type;
};

// 格式化效果�?const formatEffectValue = (type: string, value: number): string => {
  if (type === 'sevenDayRetention') {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

// 处理事件
const handleEvent = (eventId: string): void => {
  simulationStore.handleEvent(eventId);
};

// 格式化日�?const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};
</script>

<style lang=scss scoped>
.dynamic-events-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>




