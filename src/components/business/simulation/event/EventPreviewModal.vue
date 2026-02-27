<template>
  <!-- 活动预览弹窗 -->
  <div v-if="showPreview" class="preview-modal">
    <div class="preview-content">
      <div class="preview-header">
        <h4>活动预览</h4>
        <button class="preview-close" @click="closePreview">�?/button>
      </div>
      <div class="preview-body">
        <div class="preview-section">
          <h5>活动信息</h5>
          <p><strong>名称�?/strong>{{ previewConfig.name || '未设�? }}</p>
          <p>
            <strong>类型�?/strong>{{ getEventTypeLabel(previewConfig.type) }}
          </p>
          <p>
            <strong>时间�?/strong>{{ previewConfig.startDate }} �?            {{ previewConfig.endDate }}
          </p>
        </div>
        <div class="preview-section">
          <h5>奖励设置</h5>
          <ul>
            <li v-for="(reward, index) in previewConfig.rewards" :key="index">
              {{ reward.name }} ({{ reward.quantity }}�?
            </li>
            <li v-if="previewConfig.rewards.length === 0">暂无奖励</li>
          </ul>
        </div>
        <div class="preview-section">
          <h5>参与条件</h5>
          <ul>
            <li v-if="previewConfig.conditions.level">
              等级 �?{{ previewConfig.levelRequirement }}
            </li>
            <li v-if="previewConfig.conditions.rank">
              段位 �?{{ previewConfig.rankRequirement }}
            </li>
            <li
              v-if="
                !previewConfig.conditions.level &&
                !previewConfig.conditions.rank
              "
            >
              无特殊条�?            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
// 接收父组件传递的属�?const props = defineProps({
  showPreview: {
    type: Boolean,
    default: false,
  },
  previewConfig: {
    type: Object,
    default: () => ({
      name: '',
      startDate: '',
      endDate: '',
      type: 'limited',
      rewards: [{ type: 'skin', name: '', quantity: 1 }],
      conditions: {
        level: false,
        rank: false,
      },
      levelRequirement: 10,
      rankRequirement: '钻石',
    }),
  },
  eventTypes: {
    type: Array,
    default: () => [
      { label: '限时活动', value: 'limited', icon: '�? },
      { label: '节日活动', value: 'holiday', icon: '🎄' },
      { label: '社区活动', value: 'community', icon: '👥' },
    ],
  },
});

// 向父组件传递事�?const emit = defineEmits(['preview-closed']);

// 获取活动类型标签
const getEventTypeLabel = (value: string): string => {
  const type = props.eventTypes.find((t) => t.value === value);
  return type ? type.label : value;
};

// 关闭预览
const closePreview = (): void => {
  emit('preview-closed');
};
</script>

<style lang=scss scoped>
/* 预览弹窗 */
.preview-modal {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 80%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.preview-content {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid var(--border-light);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid var(--border-light);
  background-color: rgb(255 255 255 / 5%);
}

.preview-header h4 {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.preview-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 5px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.preview-close:hover {
  background-color: rgb(255 255 255 / 10%);
  color: var(--text-primary);
}

.preview-body {
  padding: 25px;
}

.preview-section {
  margin-bottom: 20px;
}

.preview-section h5 {
  margin: 0 0 10px;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
}

.preview-section p {
  margin: 5px 0;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.preview-section ul {
  margin: 5px 0;
  padding-left: 20px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.preview-section li {
  margin: 3px 0;
}

/* 响应式设�? */
@media (width <= 768px) {
  .preview-content {
    margin: 10px;
  }
}

/* 横屏手机适配 */
@media (orientation: landscape) and (height <= 600px) {
  .preview-content {
    max-height: 90vh;
  }

  .preview-header {
    padding: 15px 20px;
  }

  .preview-body {
    padding: 20px;
  }
}
</style>




