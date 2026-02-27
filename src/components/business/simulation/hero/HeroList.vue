<template>
  <div class="hero-list-container">
    <!-- 英雄列表 -->
    <div class="hero-list">
      <div
        v-for="hero in filteredHeroes"
        :key="hero.id"
        class="hero-card"
        :class="{
          selected: selectedHero?.id === hero.id,
          [hero.category]: true,
          [`strength-${hero.strength}`]: true,
        }"
        @click="selectHero(hero)"
      >
        <div class="hero-card-header">
          <div class="hero-name-rank">
            <h4 class="hero-name">{{ hero.name }}</h4>
            <div class="hero-rank" :class="`rank-${hero.strength}`">
              {{ hero.strength }}
            </div>
          </div>
          <div class="hero-category-badge" :class="hero.category">
            {{ hero.category }}
          </div>
        </div>

        <div class="hero-card-body">
          <!-- 英雄头像占位�?-->
          <div class="hero-avatar-placeholder">
            <span class="hero-avatar-icon">👤</span>
          </div>

          <!-- 英雄属性概�?-->
          <div class="hero-stats-overview">
            <div class="stat-item">
              <span class="stat-label">胜率</span>
              <span class="stat-value">{{ hero.winRate }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">出场�?/span>
              <span class="stat-value">{{ hero.pickRate }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Ban�?/span>
              <span class="stat-value">{{ hero.banRate }}%</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="hero-card-actions">
          <button
            class="action-btn view-btn"
            @click.stop="viewHeroDetails(hero)"
          >
            详情
          </button>
          <button class="action-btn add-btn" @click.stop="addHeroToTeam(hero)">
            加入队伍
          </button>
        </div>
      </div>

      <!-- 空状�?-->
      <div v-if="filteredHeroes.length === 0" class="empty-state">
        <div class="empty-icon">👥</div>
        <p>没有符合条件的英�?/p>
        <button class="reset-btn" @click="resetFilters">重置筛选条�?/button>
      </div>
    </div>

    <!-- 英雄详情侧边�?-->
    <div v-if="selectedHero" class="hero-detail-sidebar">
      <div class="sidebar-header">
        <h4>英雄详情</h4>
        <button class="close-detail-btn" @click="closeHeroDetail">�?/button>
      </div>
      <div class="sidebar-content">
        <!-- 英雄基本信息 -->
        <div class="hero-basic-info">
          <div class="hero-detail-avatar">
            <span class="hero-detail-icon">👤</span>
          </div>
          <div class="hero-detail-header">
            <h3>{{ selectedHero.name }}</h3>
            <div class="hero-detail-categories">
              <span
                class="detail-category-badge"
                :class="selectedHero.category"
              >
                {{ selectedHero.category }}
              </span>
              <span
                class="detail-strength-badge"
                :class="`rank-${selectedHero.strength}`"
              >
                {{ selectedHero.strength }}
              </span>
            </div>
          </div>
        </div>

        <!-- 英雄详细属�?-->
        <div class="hero-detail-stats">
          <h5>详细属�?/h5>
          <div class="stats-grid">
            <div class="stat-detail-item">
              <span class="stat-detail-label">胜率</span>
              <div class="stat-bar-container">
                <div
                  class="stat-bar"
                  :style="{ width: selectedHero.winRate + '%' }"
                ></div>
                <span class="stat-detail-value"
                  >{{ selectedHero.winRate }}%</span
                >
              </div>
            </div>
            <div class="stat-detail-item">
              <span class="stat-detail-label">出场�?/span>
              <div class="stat-bar-container">
                <div
                  class="stat-bar pick-rate-bar"
                  :style="{ width: selectedHero.pickRate + '%' }"
                ></div>
                <span class="stat-detail-value"
                  >{{ selectedHero.pickRate }}%</span
                >
              </div>
            </div>
            <div class="stat-detail-item">
              <span class="stat-detail-label">Ban�?/span>
              <div class="stat-bar-container">
                <div
                  class="stat-bar ban-rate-bar"
                  :style="{ width: selectedHero.banRate + '%' }"
                ></div>
                <span class="stat-detail-value"
                  >{{ selectedHero.banRate }}%</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 英雄技能概�?-->
        <div class="hero-skills-overview">
          <h5>技能概�?/h5>
          <div class="skills-list">
            <div
              v-for="skill in selectedHero.skills"
              :key="skill.id"
              class="skill-item"
            >
              <div class="skill-icon-placeholder">
                <span class="skill-icon">�?/span>
              </div>
              <div class="skill-info">
                <div class="skill-name-cooldown">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-cooldown">{{ skill.cooldown }}s</span>
                </div>
                <p class="skill-description">{{ skill.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
import { computed } from 'vue';

const props = defineProps({
  heroes: {
    type: Array,
    required: true,
  },
  filters: {
    type: Object,
    required: true,
  },
  selectedHero: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  'select-hero',
  'view-hero-details',
  'add-hero-to-team',
  'reset-filters',
  'update:selectedHero',
]);

// 英雄类型定义
interface Hero {
  id: string;
  name: string;
  category: string;
  strength: string;
  winRate: number;
  pickRate: number;
  banRate: number;
  skills: Array<{
    id: string;
    name: string;
    cooldown: number;
    description: string;
  }>;
}

// 关闭英雄详情
function closeHeroDetail(): void {
  emit('select-hero', null);
}

// 分类筛�?function matchesCategory(hero: Hero): boolean {
  return (
    props.filters.category === 'all' || hero.category === props.filters.category
  );
}

// 强度筛�?function matchesStrength(hero: Hero): boolean {
  return (
    props.filters.strength === 'all' || hero.strength === props.filters.strength
  );
}

// 搜索筛�?function matchesSearch(hero: Hero): boolean {
  if (!props.filters.search) return true;
  const searchLower = props.filters.search.toLowerCase();
  return hero.name.toLowerCase().includes(searchLower);
}

// 胜率筛�?function matchesWinRate(hero: Hero): boolean {
  if (props.filters.winRate === 'all') return true;
  if (props.filters.winRate === 'high') return hero.winRate > 55;
  if (props.filters.winRate === 'medium')
    return hero.winRate >= 50 && hero.winRate <= 55;
  if (props.filters.winRate === 'low') return hero.winRate < 50;
  return true;
}

// 出场率筛�?function matchesPickRate(hero: Hero): boolean {
  if (props.filters.pickRate === 'all') return true;
  if (props.filters.pickRate === 'high') return hero.pickRate > 10;
  if (props.filters.pickRate === 'medium')
    return hero.pickRate >= 5 && hero.pickRate <= 10;
  if (props.filters.pickRate === 'low') return hero.pickRate < 5;
  return true;
}

// 筛选英�?const filteredHeroes = computed(() => {
  return props.heroes.filter((hero: Hero) => {
    return (
      matchesCategory(hero) &&
      matchesStrength(hero) &&
      matchesSearch(hero) &&
      matchesWinRate(hero) &&
      matchesPickRate(hero)
    );
  });
});

// 选择英雄
function selectHero(hero: Hero): void {
  emit('select-hero', hero);
}

// 查看英雄详情
function viewHeroDetails(hero: Hero): void {
  emit('view-hero-details', hero);
}

// 加入队伍
function addHeroToTeam(hero: Hero): void {
  emit('add-hero-to-team', hero);
}

// 重置筛�?function resetFilters(): void {
  emit('reset-filters');
}
</script>

<style lang=scss scoped>
.hero-list-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

/* 英雄列表 */
.hero-list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  overflow-y: auto;
  max-height: 500px;
  padding-right: 10px;
}

/* 英雄卡片 */
.hero-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  position: relative;
  overflow: hidden;
}

.hero-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(102 126 234 / 10%),
    transparent
  );
  transition: left 0.5s ease;
}

.hero-card:hover::before {
  left: 100%;
}

.hero-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
  border-color: #667eea;
}

.hero-card.selected {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgb(102 126 234 / 20%);
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
}

/* 英雄卡片头部 */
.hero-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.hero-name-rank {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #475569;
}

.hero-rank {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgb(0 0 0 / 30%);
}

.rank-T0 {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.rank-T1 {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.rank-T2 {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.rank-T3 {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.hero-category-badge {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  letter-spacing: 0.5px;
}

/* 分类徽章样式 */
.tank {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.warrior {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.assassin {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.mage {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.marksman {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.support {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

/* 英雄卡片主体 */
.hero-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 英雄头像占位�? */
.hero-avatar-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border: 2px solid #cbd5e1;
}

.hero-avatar-icon {
  font-size: 24px;
  opacity: 0.6;
}

/* 英雄属性概�? */
.hero-stats-overview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: bold;
}

.stat-value {
  font-size: 14px;
  font-weight: bold;
  color: #475569;
}

/* 英雄卡片操作按钮 */
.hero-card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.add-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}

.action-btn:active {
  transform: translateY(0);
}

/* 空状�? */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 40px 20px;
  background: white;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  color: #94a3b8;
  font-size: 16px;
}

/* 英雄详情侧边�? */
.hero-detail-sidebar {
  width: 350px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 15%);
  display: flex;
  flex-direction: column;
  max-height: 500px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 8px 8px 0 0;
}

.sidebar-header h4 {
  margin: 0;
  color: #475569;
  font-size: 16px;
  font-weight: bold;
}

.close-detail-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.close-detail-btn:hover {
  background: #f1f5f9;
  color: #ef4444;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 英雄基本信息 */
.hero-basic-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.hero-detail-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #cbd5e1;
}

.hero-detail-icon {
  font-size: 32px;
  opacity: 0.7;
}

.hero-detail-header {
  flex: 1;
}

.hero-detail-header h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: bold;
  color: #475569;
}

.hero-detail-categories {
  display: flex;
  gap: 8px;
}

.detail-category-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  letter-spacing: 0.5px;
}

.detail-strength-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgb(0 0 0 / 30%);
}

/* 英雄详细属�? */
.hero-detail-stats h5 {
  margin: 0 0 15px;
  font-size: 14px;
  font-weight: bold;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-detail-label {
  font-size: 12px;
  font-weight: bold;
  color: #64748b;
}

.stat-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-bar {
  flex: 1;
  height: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.pick-rate-bar {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.ban-rate-bar {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.stat-detail-value {
  font-size: 14px;
  font-weight: bold;
  color: #475569;
  min-width: 50px;
  text-align: right;
}

/* 英雄技能概�? */
.hero-skills-overview h5 {
  margin: 0 0 15px;
  font-size: 14px;
  font-weight: bold;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skill-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.skill-icon-placeholder {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.skill-icon {
  color: white;
  font-size: 16px;
}

.skill-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.skill-name-cooldown {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-size: 13px;
  font-weight: bold;
  color: #475569;
}

.skill-cooldown {
  font-size: 11px;
  color: #94a3b8;
  font-weight: bold;
}

.skill-description {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

/* 滚动条样�? */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}
</style>




