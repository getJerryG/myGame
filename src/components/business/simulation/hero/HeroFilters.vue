<template>
  <div class="filters">
    <div class="filter-row">
      <!-- 英雄分类筛�?-->
      <div class="filter-group">
        <label class="filter-label">分类</label>
        <select
          v-model="localFilters.category"
          class="filter-select"
          @change="updateFilters"
        >
          <option value="all">全部</option>
          <option value="tank">坦克</option>
          <option value="warrior">战士</option>
          <option value="assassin">刺客</option>
          <option value="mage">法师</option>
          <option value="marksman">射手</option>
          <option value="support">辅助</option>
        </select>
      </div>

      <!-- 强度分级筛�?-->
      <div class="filter-group">
        <label class="filter-label">强度</label>
        <select
          v-model="localFilters.strength"
          class="filter-select"
          @change="updateFilters"
        >
          <option value="all">全部</option>
          <option value="T0">T0</option>
          <option value="T1">T1</option>
          <option value="T2">T2</option>
          <option value="T3">T3</option>
        </select>
      </div>

      <!-- 搜索�?-->
      <div class="filter-group search">
        <label class="filter-label">搜索</label>
        <input
          v-model="localFilters.search"
          type="text"
          class="search-input"
          placeholder="搜索英雄..."
          @input="updateFilters"
        />
      </div>
    </div>

    <!-- 额外筛选选项 -->
    <div class="filter-row">
      <!-- 胜率排序 -->
      <div class="filter-group">
        <label class="filter-label">胜率</label>
        <select
          v-model="localFilters.winRate"
          class="filter-select"
          @change="updateFilters"
        >
          <option value="all">全部</option>
          <option value="high">> 55%</option>
          <option value="medium">50% - 55%</option>
          <option value="low">&lt; 50%</option>
        </select>
      </div>

      <!-- 出场率排�?-->
      <div class="filter-group">
        <label class="filter-label">出场�?/label>
        <select
          v-model="localFilters.pickRate"
          class="filter-select"
          @change="updateFilters"
        >
          <option value="all">全部</option>
          <option value="high">> 10%</option>
          <option value="medium">5% - 10%</option>
          <option value="low">&lt; 5%</option>
        </select>
      </div>

      <!-- 重置按钮 -->
      <button class="reset-btn" @click="resetFilters">
        <span class="reset-icon">🔄</span>
        重置筛�?      </button>
    </div>
  </div>
</template>

<script setup lang=ts>
import { ref, watch } from 'vue';

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:filters', 'reset-filters']);

// 创建本地副本以避免直接修改props
const localFilters = ref({ ...props.filters });

// 监听props变化，更新本地副�?watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters };
  },
  { deep: true }
);

// 更新筛选条�?function updateFilters(): void {
  emit('update:filters', { ...localFilters.value });
}

// 重置筛�?function resetFilters(): void {
  emit('reset-filters');
}
</script>

<style lang=scss scoped>
.filters {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 150px;
}

.filter-group.search {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  font-size: 12px;
  font-weight: bold;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select,
.search-input {
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

.filter-select:focus,
.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgb(102 126 234 / 10%);
}

.search-input {
  width: 100%;
  background: #f8fafc;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgb(239 68 68 / 40%);
}

.reset-btn:active {
  transform: translateY(0);
}

.reset-icon {
  font-size: 16px;
}
</style>




