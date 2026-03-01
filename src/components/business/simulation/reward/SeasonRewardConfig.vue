<template>
  <div class="season-reward-config">
    <div class="config-section">
      <h4 class="section-title">赛季奖励配置</h4>
      <p class="section-description">设置不同段位的赛季结算奖励</p>

      <!-- 段位奖励配置 -->
      <div class="rank-rewards">
        <div
          v-for="rank in ranks"
          :key="rank.id"
          class="rank-item"
        >
          <div class="rank-header">
            <span class="rank-icon">{{ rank.icon }}</span>
            <span class="rank-name">{{ rank.name }}</span>
          </div>
          <div class="rank-rewards-list">
            <div
              v-for="(reward, index) in rank.rewards"
              :key="index"
              class="rank-reward-item"
            >
              <span class="reward-icon">{{ reward.icon }}</span>
              <span class="reward-name">{{ reward.name }}</span>
              <span class="reward-amount">{{ reward.amount }}</span>
            </div>
          </div>
          <button
            class="edit-btn"
            @click="editRankReward(rank)"
          >
            编辑奖励
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  ranks: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['edit-rank-reward']);

const editRankReward = (rank) => {
  emit('edit-rank-reward', rank);
};
</script>

<style lang="scss" scoped>

.season-reward-config {
  padding: 0;
}

/* 配置区块 */
.config-section {
  @include utils.config-section;
}

.section-title {
  @include utils.section-title;
}

.section-description {
  @include utils.section-description;
}

/* 段位奖励配置 */
.rank-rewards {
  @include utils.flex-col(tokens.$spacing-md, stretch);
}

.rank-item {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$bg-lighter;
  }
}

.rank-header {
  @include utils.flex-row(tokens.$spacing-sm, center);

  margin-bottom: tokens.$spacing-md;
}

.rank-icon {
  font-size: tokens.$font-size-xl;
}

.rank-name {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

.rank-rewards-list {
  display: flex;
  flex-wrap: wrap;
  gap: tokens.$spacing-sm;
  margin-bottom: tokens.$spacing-md;
}

.rank-reward-item {
  @include utils.flex-row(tokens.$spacing-sm, center);

  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;

  .reward-name {
    color: tokens.$text-secondary;
  }

  .reward-amount {
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$primary-gold;
  }
}

.edit-btn {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  background-color: tokens.$bg-lighter;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: rgb(59 130 246 / 20%);
    color: tokens.$text-primary;
  }
}
</style>
