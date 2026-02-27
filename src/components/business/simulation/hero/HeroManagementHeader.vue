<template>
  <div class="panel-header">
    <h3 class="panel-title">英雄管理</h3>
    <button
      class="collapse-btn"
      aria-expanded="!isCollapsed"
      @click="toggleCollapse"
    >
      <span class="collapse-icon">{{ isCollapsed ? '▶️' : '◀�? }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isCollapsed: Boolean,
});

const emit = defineEmits(['toggle-collapse']);

function toggleCollapse(): void {
  emit('toggle-collapse');
}
</script>

<style lang="scss" scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px 10px 0 0;
  color: white;
  box-shadow: 0 4px 15px rgb(102 126 234 / 30%);
}

.panel-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.collapse-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background: rgb(255 255 255 / 20%);
  transform: scale(1.1);
}

.collapse-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}
</style>
