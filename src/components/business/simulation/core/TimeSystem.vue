<template>
  <div class="time-system">
    <div class="calendar-clock">
      <div class="calendar">
        <div class="calendar-date">
          {{ formattedDate }}
        </div>
        <div class="calendar-time">
          <span>{{ formattedTime }}</span>
        </div>
        <div class="calendar-phase">
          {{ phaseName }}
        </div>
      </div>

      <!-- 快捷操作按钮 -->
      <div class="quick-actions">
        <button
          class="next-day-btn"
          :disabled="isGameOver"
          aria-label="进入下一天"
          :aria-disabled="isGameOver"
          @click="$emit('next-day')"
        >
          <span class="btn-icon" aria-hidden="true">▶️</span>
          <span class="btn-text">下一天</span>
          <span class="btn-glow" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentDate?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
  currentPhase?: string;
  isGameOver?: boolean;
}>();

const emit = defineEmits<{
  'next-day': [];
}>();

const formatDate = (date?: { year: number; month: number; day: number }): string => {
  if (!date) return '加载中...';
  return `${date.year}年${date.month}月${date.day}日`;
};

const formatTime = (hour: number, minute: number): string => {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const getPhaseName = (phase?: string): string => {
  const phaseNames: Record<string, string> = {
    early: '早?',
    morning: '上午',
    afternoon: '下午',
    evening: '傍晚',
    night: '夜晚',
  };
  return phaseNames[phase || ''] || '未知';
};

const formattedDate = computed(() => formatDate(props.currentDate));
const formattedTime = computed(() => {
  if (!props.currentDate) return '--:--';
  return formatTime(Math.floor(props.currentDate.hour), Math.floor(props.currentDate.minute));
});
const phaseName = computed(() => getPhaseName(props.currentPhase));
</script>

<style lang="scss" scoped>
.time-system {
  background: tokens.$bg-light;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
}

.calendar-clock {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;

  .calendar-date {
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .calendar-time {
    font-size: tokens.$font-size-base;
    color: tokens.$text-secondary;
  }

  .calendar-phase {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
    font-weight: tokens.$font-weight-medium;
  }
}

.quick-actions {
  .next-day-btn {
    position: relative;
    padding: tokens.$spacing-md tokens.$spacing-xl;
    background: linear-gradient(135deg, tokens.$primary-blue 0%, color.adjust(tokens.$primary-blue, $lightness: -10%) 100%);
    border: none;
    border-radius: tokens.$radius-md;
    color: #fff;
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    cursor: pointer;
    transition: all tokens.$transition-fast;
    display: flex;
    align-items: center;
    gap: tokens.$spacing-sm;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgb(74 158 255 / 40%);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-icon {
      font-size: tokens.$font-size-lg;
    }

    .btn-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgb(255 255 255 / 30%) 0%, transparent 70%);
      border-radius: tokens.$radius-md;
      opacity: 0;
      transition: opacity tokens.$transition-fast;
    }

    &:hover:not(:disabled) .btn-glow {
      opacity: 1;
    }
  }
}
</style>
