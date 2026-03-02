<template>
  <div class="hero-management-panel">
    <!-- 面板头部 -->
    <HeroManagementHeader
      :is-collapsed="isCollapsed"
      @toggle-collapse="toggleCollapse"
    />

    <!-- 面板内容 -->
    <div class="panel-content" :class="{ collapsed: isCollapsed }">
      <!-- 筛选器 -->
      <HeroFilters
        :filters="filters"
        @update:filters="filters = $event"
        @reset-filters="resetFilters"
      />

      <!-- 英雄列表 -->
      <HeroList
        :filtered-heroes="filteredHeroes"
        :selected-hero="selectedHero"
        @select-hero="selectHero"
        @reset-filters="resetFilters"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import HeroManagementHeader from "./HeroManagementHeader.vue";
import HeroFilters from "./HeroFilters.vue";
import HeroList from "./HeroList.vue";

// 英雄相关类型定义
interface AdjustableStat {
  value: number;
  min: number;
  max: number;
  step: number;
  impact: number;
}

interface HeroStats {
  winRate: number;
  pickRate: number;
  banRate: number;
  winRateTrend: number[];
  adjustable: Record<string, AdjustableStat>;
}

interface Hero {
  id: number;
  name: string;
  avatar: string;
  category: string;
  strength: string;
  stats: HeroStats;
}

// 面板折叠状�?const isCollapsed = ref(false);

// 筛选器
const filters = ref({
  category: "all",
  strength: "all",
  search: "",
});

// 选中的英�?const selectedHero = ref<Hero | null>(null);

// 英雄数据
const heroes = ref<Hero[]>([
  {
    id: 1,
    name: "李白",
    avatar: "🏮",
    category: "assassin",
    strength: "T1",
    stats: {
      winRate: 48.5,
      pickRate: 15.2,
      banRate: 8.7,
      winRateTrend: [47.2, 47.8, 48.1, 48.5, 48.3, 48.5, 48.5],
      adjustable: {
        attack: { value: 180, min: 150, max: 220, step: 5, impact: 0.2 },
        skill1: { value: 250, min: 200, max: 300, step: 10, impact: 0.3 },
        skill2: {
          value: 180,
          min: 150,
          max: 220,
          step: 10,
          impact: 0.25,
        },
        skill3: {
          value: 800,
          min: 600,
          max: 1000,
          step: 50,
          impact: 0.4,
        },
      },
    },
  },
  {
    id: 2,
    name: "貂蝉",
    avatar: "🌸",
    category: "mage",
    strength: "T0",
    stats: {
      winRate: 53.2,
      pickRate: 22.5,
      banRate: 45.8,
      winRateTrend: [51.8, 52.3, 52.7, 53.0, 53.1, 53.2, 53.2],
      adjustable: {
        attack: { value: 160, min: 130, max: 190, step: 5, impact: 0.15 },
        skill1: {
          value: 200,
          min: 150,
          max: 250,
          step: 10,
          impact: 0.25,
        },
        skill2: { value: 150, min: 120, max: 180, step: 10, impact: 0.2 },
        skill3: {
          value: 600,
          min: 400,
          max: 800,
          step: 50,
          impact: 0.35,
        },
      },
    },
  },
  {
    id: 3,
    name: "韩信",
    avatar: "⚔️",
    category: "assassin",
    strength: "T2",
    stats: {
      winRate: 46.8,
      pickRate: 12.3,
      banRate: 5.2,
      winRateTrend: [47.5, 47.2, 47.0, 46.9, 46.8, 46.8, 46.8],
      adjustable: {
        attack: { value: 190, min: 160, max: 230, step: 5, impact: 0.2 },
        skill1: {
          value: 220,
          min: 180,
          max: 260,
          step: 10,
          impact: 0.25,
        },
        skill2: {
          value: 200,
          min: 160,
          max: 240,
          step: 10,
          impact: 0.25,
        },
        skill3: { value: 700, min: 500, max: 900, step: 50, impact: 0.3 },
      },
    },
  },
  {
    id: 4,
    name: "程咬金",
    avatar: "🛡️",
    category: "tank",
    strength: "T1",
    stats: {
      winRate: 50.2,
      pickRate: 8.7,
      banRate: 1.2,
      winRateTrend: [49.8, 49.9, 50.0, 50.1, 50.2, 50.2, 50.2],
      adjustable: {
        health: {
          value: 3500,
          min: 3000,
          max: 4000,
          step: 100,
          impact: 0.15,
        },
        defense: {
          value: 200,
          min: 150,
          max: 250,
          step: 10,
          impact: 0.1,
        },
        skill1: { value: 300, min: 250, max: 350, step: 10, impact: 0.2 },
        skill2: {
          value: 150,
          min: 120,
          max: 180,
          step: 10,
          impact: 0.15,
        },
      },
    },
  },
  {
    id: 5,
    name: "后羿",
    avatar: "🏹",
    category: "marksman",
    strength: "T1",
    stats: {
      winRate: 49.5,
      pickRate: 28.6,
      banRate: 3.5,
      winRateTrend: [49.2, 49.3, 49.4, 49.4, 49.5, 49.5, 49.5],
      adjustable: {
        attack: { value: 200, min: 170, max: 230, step: 5, impact: 0.25 },
        attackSpeed: {
          value: 0.8,
          min: 0.6,
          max: 1.0,
          step: 0.05,
          impact: 0.3,
        },
        skill1: { value: 150, min: 120, max: 180, step: 10, impact: 0.2 },
        skill2: {
          value: 200,
          min: 160,
          max: 240,
          step: 10,
          impact: 0.25,
        },
      },
    },
  },
]);

// 筛选后的英雄列表
const filteredHeroes = computed(() => {
  return heroes.value.filter((hero) => {
    const matchesCategory =
      filters.value.category === "all" ||
      hero.category === filters.value.category;
    const matchesStrength =
      filters.value.strength === "all" ||
      hero.strength === filters.value.strength;
    const matchesSearch =
      filters.value.search === "" ||
      hero.name.toLowerCase().includes(filters.value.search.toLowerCase());
    return matchesCategory && matchesStrength && matchesSearch;
  });
});

// 切换折叠状态
const toggleCollapse = (): void => {
  isCollapsed.value = !isCollapsed.value;
};

// 选择英雄
const selectHero = (hero: Hero): void => {
  selectedHero.value = hero;
};

// 重置筛选
const resetFilters = (): void => {
  filters.value = {
    category: "all",
    strength: "all",
    search: "",
  };
};
</script>

<style lang="scss" scoped>
.hero-management-panel {
  @include utils.panel-base;
}

.panel-content {
  @include utils.panel-content;

  max-height: 1000px;

  &.collapsed {
    max-height: 0;
    padding: 0 tokens.$spacing-lg;
  }
}
</style>
