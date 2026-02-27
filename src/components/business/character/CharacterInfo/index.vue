<template>
  <div class="character-info-container">
    <!-- 默认显示区：核心信息 -->
    <CharacterCoreInfo />

    <!-- 功能入口 -->
    <ActionButtons
      @toggle-inventory="toggleFullInventory"
      @show-achievements="showAchievements"
    />

    <!-- 背包和物品详情弹�?-->
    <InventoryModal
      :is-item-modal-visible="isItemModalVisible"
      :is-inventory-modal-visible="isInventoryModalVisible"
      :selected-item="selectedItem"
      @close-item-modal="closeItemModal"
      @close-inventory-modal="closeInventoryModal"
      @update:selectedItem="selectedItem = $event"
      @open-item-modal="isItemModalVisible = true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CharacterCoreInfo from './CharacterCoreInfo.vue';
import ActionButtons from './ActionButtons.vue';
import InventoryModal from '../InventoryModal/index.vue';

// 弹窗状�?const isItemModalVisible = ref(false);
const selectedItem = ref(null);
const isInventoryModalVisible = ref(false);
const isAchievementsModalVisible = ref(false);

// 切换背包弹窗
const toggleFullInventory = (): void => {
  isInventoryModalVisible.value = !isInventoryModalVisible.value;
};

// 关闭物品详情弹窗
const closeItemModal = (): void => {
  isItemModalVisible.value = false;
  selectedItem.value = null;
};

// 关闭背包弹窗
const closeInventoryModal = (): void => {
  isInventoryModalVisible.value = false;
};

// 显示成就
const showAchievements = (): void => {
  isAchievementsModalVisible.value = true;
};
</script>

<style lang="scss" scoped>
/* 基础样式重置 */
* {
  box-sizing: border-box;
}

/* 主容�? */
.character-info-container {
  padding: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
}
</style>
