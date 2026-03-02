<template>
  <div class="character-info-container">
    <!-- 默认显示区：核心信息 -->
    <CharacterCoreInfo />

    <!-- 功能入口 -->
    <ActionButtons
      @toggle-inventory="toggleFullInventory"
      @show-achievements="showAchievements"
    />

    <!-- 背包和物品详情弹窗 -->
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
import { ref } from "vue";
import CharacterCoreInfo from "./CharacterCoreInfo.vue";
import ActionButtons from "./ActionButtons.vue";
import InventoryModal from "../InventoryModal/index.vue";

// 弹窗状态
const isItemModalVisible = ref(false);
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

/* 主容器 */
.character-info-container {
  @include utils.flex-col(tokens.$spacing-lg, stretch, flex-start);

  padding: tokens.$spacing-lg;
  font-family: "Comic Sans MS", cursive, sans-serif;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(
    135deg,
    tokens.$panel-bg-start 0%,
    tokens.$panel-bg-end 100%
  );
  position: relative;
}
</style>
