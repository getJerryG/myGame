<template>
  <div class="hero-list-container">
    <!-- 英雄列表 -->
    <div class="hero-list">
      <HeroCard
        v-for="hero in filteredHeroes"
        :key="hero.id"
        :hero="hero"
        :is-selected="selectedHero?.id === hero.id"
        @select="handleSelectHero"
        @view-details="handleViewDetails"
        @add-to-team="handleAddToTeam"
      />

      <!-- 空状态 -->
      <HeroEmptyState
        v-if="filteredHeroes.length === 0"
        @reset="$emit('reset-filters')"
      />
    </div>

    <!-- 英雄详情侧边栏 -->
    <HeroDetailSidebar
      v-if="selectedHero"
      :hero="selectedHero"
      @close="selectedHero = null"
      @add-to-team="handleAddToTeam"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import HeroCard from './HeroCard.vue';
import HeroDetailSidebar from './HeroDetailSidebar.vue';
import HeroEmptyState from './HeroEmptyState.vue';

import type { Hero } from './HeroCard.vue';
import type { HeroWithSkills } from './HeroDetailSidebar.vue';

const props = defineProps<{
  heroes: HeroWithSkills[];
  filters?: {
    category?: string;
    strength?: number;
  };
}>();

const emit = defineEmits<{
  'select-hero': [hero: HeroWithSkills];
  'add-to-team': [hero: HeroWithSkills];
  'reset-filters': [];
}>();

const selectedHero = ref<HeroWithSkills | null>(null);

const filteredHeroes = computed(() => {
  let result = props.heroes;

  if (props.filters?.category) {
    result = result.filter((h) => h.category === props.filters!.category);
  }

  if (props.filters?.strength) {
    result = result.filter((h) => h.strength === props.filters!.strength);
  }

  return result;
});

const handleSelectHero = (hero: HeroWithSkills) => {
  selectedHero.value = hero;
  emit('select-hero', hero);
};

const handleViewDetails = (hero: HeroWithSkills) => {
  selectedHero.value = hero;
};

const handleAddToTeam = (hero: HeroWithSkills) => {
  emit('add-to-team', hero);
  selectedHero.value = null;
};
</script>

<style lang="scss" scoped>
.hero-list-container {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.hero-list {
  flex: 1;
  padding: tokens.$spacing-lg;
  overflow-y: auto;
}

.hero-detail-sidebar {
  width: 400px;
  flex-shrink: 0;
}
</style>
