<template>
  <!-- 活动预览弹窗 -->
  <div v-if="showPreview" class="preview-modal">
    <div class="preview-content">
      <div class="preview-header">
        <h4>活动预览</h4>
        <button class="preview-close" @click="closePreview">✕</button>
      </div>
      <div class="preview-body">
        <div class="preview-section">
          <h5>活动信息</h5>
          <p><strong>名称：</strong>{{ previewConfig.name || '未设置' }}</p>
          <p>
            <strong>类型：</strong>{{ getEventTypeLabel(previewConfig.type) }}
          </p>
          <p>
            <strong>时间：</strong>{{ previewConfig.startDate }} ~
            {{ previewConfig.endDate }}
          </p>
        </div>
        <div class="preview-section">
          <h5>奖励设置</h5>
          <ul>
            <li v-for="(reward, index) in previewConfig.rewards" :key="index">
              {{ reward.name }} ({{ reward.quantity }}个)
            </li>
            <li v-if="previewConfig.rewards.length === 0">暂无奖励</li>
          </ul>
        </div>
        <div class="preview-section">
          <h5>参与条件</h5>
          <ul>
            <li v-if="previewConfig.conditions.level">
              等级 ≥ {{ previewConfig.levelRequirement }}
            </li>
            <li v-if="previewConfig.conditions.rank">
              段位 ≥ {{ previewConfig.rankRequirement }}
            </li>
            <li
              v-if="
                !previewConfig.conditions.level &&
                !previewConfig.conditions.rank
              "
            >
              无特殊条件
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
      { label: '限时活动', value: 'limited', icon: '⏱️' },
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

<style lang="scss" scoped>

.preview-modal {
  @include utils.modal-overlay;

  backdrop-filter: blur(10px);

  .preview-content {
    @include utils.modal-content;

    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid tokens.$border-light;
  }

  .preview-header {
    @include utils.modal-header;

    h4 {
      margin: 0;
      font-size: tokens.$font-size-lg;
      font-weight: tokens.$font-weight-semibold;
      color: tokens.$text-primary;
    }
  }

  .preview-close {
    background: none;
    border: none;
    font-size: tokens.$font-size-xl;
    color: tokens.$text-muted;
    cursor: pointer;
    padding: tokens.$spacing-xs;
    border-radius: tokens.$radius-sm;
    transition: all tokens.$transition-fast;

    &:hover {
      background-color: tokens.$bg-lighter;
      color: tokens.$text-primary;
    }
  }

  .preview-body {
    padding: tokens.$spacing-lg;
  }

  .preview-section {
    margin-bottom: tokens.$spacing-lg;

    &:last-child {
      margin-bottom: 0;
    }

    h5 {
      margin: 0 0 tokens.$spacing-sm;
      font-size: tokens.$font-size-base;
      font-weight: tokens.$font-weight-semibold;
      color: tokens.$primary-gold;
    }

    p {
      margin: tokens.$spacing-xs 0;
      font-size: tokens.$font-size-sm;
      color: tokens.$text-secondary;
    }

    ul {
      margin: tokens.$spacing-xs 0;
      padding-left: tokens.$spacing-lg;
      font-size: tokens.$font-size-sm;
      color: tokens.$text-secondary;
    }

    li {
      margin: 3px 0;
    }
  }
}

/* 响应式设�? */
@include utils.mobile {
  .preview-modal {
    .preview-content {
      margin: tokens.$spacing-sm;
    }
  }
}

/* 横屏手机适配 */
@include utils.landscape-mobile {
  .preview-modal {
    .preview-content {
      max-height: 90vh;
    }

    .preview-header {
      padding: tokens.$spacing-md tokens.$spacing-lg;
    }

    .preview-body {
      padding: tokens.$spacing-lg;
    }
  }
}
</style>
