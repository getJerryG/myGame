<template>
  <div class="save-management-tab">
    <h3 class="text-gold">存档管理</h3>
    <div class="save-list">
      <div
        v-for="save in saveFiles"
        :key="save.id"
        class="save-item"
        :class="{ active: save.isCurrent }"
      >
        <div class="save-info">
          <div class="save-name">{{ save.name }}</div>
          <div class="save-date">{{ save.date }}</div>
          <div class="save-progress">{{ save.progress }}</div>
        </div>
        <div class="save-actions">
          <button
            class="action-btn load"
            @click="$emit('load', save.id)"
            :disabled="save.isCurrent"
          >
            {{ save.isCurrent ? "当前存档" : "加载" }}
          </button>
          <button
            class="action-btn delete"
            @click="$emit('delete', save.id)"
          >
            删除
          </button>
        </div>
      </div>
    </div>
    <button
      class="save-btn"
      @click="$emit('create')"
    >
      新建存档
    </button>
  </div>
</template>

<script setup lang="ts">
export interface SaveFile {
  id: string;
  name: string;
  date: string;
  progress: string;
  isCurrent: boolean;
}

defineProps<{
  saveFiles: SaveFile[];
}>();

const emit = defineEmits<{
  load: [id: string];
  delete: [id: string];
  create: [];
}>();
</script>

<style lang="scss" scoped>
.save-management-tab {
  padding: tokens.$spacing-lg;
}

.text-gold {
  color: tokens.$primary-gold;
  margin: 0 0 tokens.$spacing-xl 0;
  font-size: tokens.$font-size-xl;
}

.save-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-md;
  max-height: 400px;
  overflow-y: auto;
}

.save-item {
  background: tokens.$bg-light;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all tokens.$transition-fast;

  &:hover {
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  }

  &.active {
    border-color: tokens.$primary-gold;
    background: rgb(255 193 7 / 10%);
  }
}

.save-info {
  flex: 1;

  .save-name {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
    margin-bottom: tokens.$spacing-xs;
  }

  .save-date,
  .save-progress {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
    margin-bottom: tokens.$spacing-xs;
  }
}

.save-actions {
  display: flex;
  gap: tokens.$spacing-sm;
}

.action-btn {
  padding: tokens.$spacing-xs tokens.$spacing-md;
  border: none;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &.load {
    background: tokens.$primary-blue;
    color: #fff;

    &:hover {
      &:not(:disabled) {
        background: color.adjust(tokens.$primary-blue, $lightness: -10%);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &.delete {
    background: tokens.$error;
    color: #fff;

    &:hover {
      background: color.adjust(tokens.$error, $lightness: -10%);
    }
  }
}

.save-btn {
  margin-top: tokens.$spacing-lg;
  width: 100%;
  padding: tokens.$spacing-md;
  background: linear-gradient(
    135deg,
    tokens.$primary-gold 0%,
    color.adjust(tokens.$primary-gold, $lightness: -10%) 100%
  );
  border: none;
  border-radius: tokens.$radius-md;
  color: #fff;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(255 193 7 / 40%);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
