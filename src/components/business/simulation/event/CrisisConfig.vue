<template>
  <div class="crisis-config">
    <div class="config-section">
      <h4 class="section-title">危机应对配置</h4>
      <p class="section-description">预设危机处理方案，及时应对突发情况</p>

      <!-- 危机类型选择 -->
      <div class="crisis-section">
        <h5>危机类型</h5>
        <div class="crisis-types">
          <div
            v-for="crisis in crisisTypes"
            :key="crisis.id"
            class="crisis-card"
            :class="{ selected: selectedCrisis === crisis.id }"
            @click="selectCrisis(crisis.id)"
          >
            <div class="crisis-icon">{{ crisis.icon }}</div>
            <div class="crisis-info">
              <div class="crisis-name">{{ crisis.name }}</div>
              <div class="crisis-desc">{{ crisis.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 应对方案 -->
      <div v-if="selectedCrisis" class="solution-section">
        <h5>应对方案</h5>
        <div class="solutions-list">
          <div
            v-for="(solution, index) in currentCrisisSolutions"
            :key="index"
            class="solution-item"
            :class="{ selected: selectedSolution === index }"
            @click="selectSolution(index)"
          >
            <div class="solution-header">
              <span class="solution-name">{{ solution.name }}</span>
              <span class="solution-cost">{{ solution.cost }}万元</span>
            </div>
            <div class="solution-desc">{{ solution.description }}</div>
            <div class="solution-effects">
              <div class="effect-item">
                <span class="effect-label">效果</span>
                <span class="effect-value">{{ solution.effect }}</span>
              </div>
              <div class="effect-item">
                <span class="effect-label">执行时间</span>
                <span class="effect-value">{{ solution.executionTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  crisisTypes: {
    type: Array,
    required: true,
  },
  crisisSolutions: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['select-crisis', 'select-solution']);

// 选中的危机
const selectedCrisis = ref(null);

// 选中的解决方案
const selectedSolution = ref(null);

// 当前危机的解决方案
const currentCrisisSolutions = computed(() => {
  if (!selectedCrisis.value) return [];
  return props.crisisSolutions[selectedCrisis.value] || [];
});

// 选择危机类型
function selectCrisis(crisisId: string | number): void {
  selectedCrisis.value = crisisId;
  selectedSolution.value = null;
  emit('select-crisis', crisisId);
}

// 选择解决方案
function selectSolution(index: number): void {
  selectedSolution.value = index;
  emit('select-solution', index);
}
</script>

<style lang="scss" scoped>
.crisis-config {
  padding: 0;

  .config-section {
    @include utils.config-section;
  }

  .section-title {
    @include utils.section-title;
  }

  .section-description {
    @include utils.section-description;
  }

  .crisis-section {
    margin-bottom: tokens.$spacing-xl;

    h5 {
      @include utils.subsection-title;
    }

    .crisis-types {
      @include utils.grid-auto-fill(250px, tokens.$spacing-md);
    }

    .crisis-card {
      @include utils.interactive-card;

      &.selected {
        background-color: rgb(239 68 68 / 20%);
        border-color: tokens.$danger-red;
        box-shadow: tokens.$shadow-red;
      }

      .crisis-icon {
        font-size: tokens.$font-size-2xl;
        flex-shrink: 0;
      }

      .crisis-info {
        flex: 1;

        .crisis-name {
          font-size: tokens.$font-size-sm;
          font-weight: tokens.$font-weight-semibold;
          color: tokens.$text-primary;
          margin-bottom: tokens.$spacing-xs;
        }

        .crisis-desc {
          font-size: tokens.$font-size-xs;
          color: tokens.$text-secondary;
        }
      }
    }
  }

  .solution-section {
    margin-bottom: tokens.$spacing-lg;

    .solutions-list {
      @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);
    }

    .solution-item {
      @include utils.interactive-card;

      &.selected {
        background-color: rgb(59 130 246 / 20%);
        border-color: tokens.$primary-blue;
        box-shadow: tokens.$shadow-blue;
      }

      .solution-header {
        @include utils.flex-between(center);

        margin-bottom: tokens.$spacing-sm;

        .solution-name {
          font-size: tokens.$font-size-sm;
          font-weight: tokens.$font-weight-semibold;
          color: tokens.$text-primary;
        }

        .solution-cost {
          font-size: tokens.$font-size-sm;
          font-weight: tokens.$font-weight-semibold;
          color: tokens.$danger-red;
        }
      }

      .solution-desc {
        font-size: tokens.$font-size-xs;
        color: tokens.$text-secondary;
        margin-bottom: tokens.$spacing-md;
        line-height: 1.4;
      }

      .solution-effects {
        @include utils.flex-row(tokens.$spacing-md, flex-start, flex-start);

        .effect-item {
          @include utils.stat-item;

          .effect-label {
            @include utils.stat-label;
          }

          .effect-value {
            font-size: tokens.$font-size-sm;
            font-weight: tokens.$font-weight-semibold;
            color: tokens.$text-secondary;
          }
        }
      }
    }
  }
}

/* 响应式设�? */
@include utils.mobile {
  .crisis-config {
    .crisis-types {
      grid-template-columns: 1fr;
    }

    .solution-effects {
      flex-direction: column;
      gap: tokens.$spacing-sm;
    }
  }
}
</style>
