<template>
  <div class="crisis-config">
    <div class="config-section">
      <h4 class="section-title">危机应对配置</h4>
      <p class="section-description">预设危机处理方案，及时应对突发情�?/p>

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

<script setup lang=ts>
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

// 选中的危�?const selectedCrisis = ref(null);

// 选中的解决方�?const selectedSolution = ref(null);

// 当前危机的解决方�?const currentCrisisSolutions = computed(() => {
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

<style lang=scss scoped>
.crisis-config {
  padding: 0;
}

/* 配置区块 */
.config-section {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 20px;
}

.section-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 8px;
}

.section-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 20px;
}

/* 危机类型 */
.crisis-section {
  margin-bottom: 30px;
}

.crisis-section h5,
.solution-section h5 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
  margin: 0 0 15px;
}

.crisis-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.crisis-card {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 15px;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  display: flex;
  gap: 12px;
}

.crisis-card:hover {
  background-color: rgb(255 255 255 / 10%);
  border-color: var(--border-light);
}

.crisis-card.selected {
  background-color: rgb(239 68 68 / 20%);
  border-color: var(--danger-red);
  box-shadow: 0 2px 8px rgb(239 68 68 / 30%);
}

.crisis-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.crisis-info {
  flex: 1;
}

.crisis-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 4px;
}

.crisis-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

/* 解决方案 */
.solution-section {
  margin-bottom: 20px;
}

.solutions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.solution-item {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 15px;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.solution-item:hover {
  background-color: rgb(255 255 255 / 10%);
  border-color: var(--border-light);
}

.solution-item.selected {
  background-color: rgb(59 130 246 / 20%);
  border-color: var(--primary-blue);
  box-shadow: 0 2px 8px rgb(59 130 246 / 30%);
}

.solution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.solution-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.solution-cost {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--danger-red);
}

.solution-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.solution-effects {
  display: flex;
  gap: 15px;
}

.effect-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.effect-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.effect-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
}

/* 响应式设�? */
@media (width <= 768px) {
  .crisis-types {
    grid-template-columns: 1fr;
  }

  .solution-effects {
    flex-direction: column;
    gap: 8px;
  }
}
</style>




