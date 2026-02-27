<template>
  <div class="season-reward-config">
    <div class="config-section">
      <h4 class="section-title">赛季奖励配置</h4>
      <p class="section-description">
        设置不同段位的赛季结算奖�?/p>

        <!-- 段位奖励配置 -->
      </p>

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
/* 段位奖励配置 */
.rank-rewards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.rank-item {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 15px;
  transition: all var(--transition-fast);
}

.rank-item:hover {
  background-color: rgb(255 255 255 / 10%);
}

.rank-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.rank-icon {
  font-size: 20px;
}

.rank-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.rank-rewards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.rank-reward-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.rank-reward-item .reward-name {
  color: var(--text-secondary);
}

.rank-reward-item .reward-amount {
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
}

.edit-btn {
  padding: 6px 12px;
  background-color: rgb(255 255 255 / 10%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.edit-btn:hover {
  background-color: rgb(59 130 246 / 20%);
  color: var(--text-primary);
}
</style>
