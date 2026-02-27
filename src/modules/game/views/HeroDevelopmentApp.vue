<template>
  <ApplicationWindow
    title="英雄开发"
    title-icon="🦸"
    :sidebar-items="sidebarItems"
    :active-item-id="activeModule"
    @update:active-item-id="activeModule = $event"
  >
    <template #header-actions>
      <button
        class="btn-primary"
        @click="showCreateForm = true"
      >
        创建英雄
      </button>
    </template>

    <!-- 英雄列表 -->
    <section
      v-if="activeModule === 'hero-list'"
      class="module-section"
    >
      <div class="section-header">
        <h2>英雄列表</h2>
      </div>

      <div class="hero-grid">
        <div
          v-for="hero in heroSkinStore.getAllHeroes"
          :key="hero.id"
          class="hero-card"
        >
          <div class="hero-icon">{{ hero.icon }}</div>
          <h4>{{ hero.name }}</h4>
          <p class="hero-class">{{ hero.class }}</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-label">生命值</span>
              <span class="text-gold">{{ hero.stats.health }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">攻击力</span>
              <span class="text-gold">{{ hero.stats.attack }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">防御力</span>
              <span class="text-gold">{{ hero.stats.defense }}</span>
            </div>
          </div>
          <!-- 模拟相关数据 -->
          <div class="hero-simulation-stats">
            <div class="stat-item">
              <span class="stat-label">出场率</span>
              <span class="text-gold">{{ (hero.pickRate * 100).toFixed(1) }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">用户基数:</span>
              <span class="text-gold">{{ (hero.userBase * 100).toFixed(1) }}%</span>
            </div>
          </div>
          <!-- 皮肤数量显示 -->
          <div class="hero-skins-count">
            <span class="skins-label">皮肤数量:</span>
            <span class="skins-value text-gold">{{ getHeroSkinCount(hero.id) }}</span>
          </div>
          <div class="hero-actions">
            <button
              class="edit-btn"
              @click="editHero(hero)"
            >
              编辑
            </button>
            <button
              class="delete-btn"
              @click="deleteHero(hero.id)"
            >
              删除
            </button>
          </div>
        </div>

        <div
          v-if="heroSkinStore.getAllHeroes.length === 0"
          class="empty-state"
        >
          <p>暂无英雄，点击"创建英雄"按钮添加</p>
        </div>
      </div>
    </section>

    <!-- 创建/编辑英雄表单 -->
    <div
      v-if="showCreateForm"
      class="form-overlay"
    >
      <div class="form-container">
        <div class="form-header">
          <h3>{{ isEditing ? '编辑英雄' : '创建英雄' }}</h3>
          <button
            class="close-btn"
            @click="cancelForm"
          >
            ×
          </button>
        </div>

        <form
          @submit.prevent="submitForm"
          class="hero-form"
        >
          <!-- 英雄职业选择（按钮形式） -->
          <div class="form-section">
            <h4>英雄职业</h4>
            <div class="class-buttons">
              <button
                v-for="cls in heroClasses"
                :key="cls.id"
                type="button"
                class="class-btn"
                :class="{ active: formData.class === cls.id }"
                :style="{
                  backgroundColor: formData.class === cls.id ? cls.color : 'rgba(74, 158, 255, 0.2)',
                }"
                @click="selectClass(cls.id)"
              >
                <span class="class-icon">{{ cls.icon }}</span>
                <span class="class-name">{{ cls.name }}</span>
              </button>
            </div>
          </div>

          <!-- 创作类型选择 -->
          <div class="form-section">
            <h4>创作类型</h4>
            <div class="creation-type-buttons">
              <button
                v-for="type in creationTypes"
                :key="type.id"
                type="button"
                class="creation-type-btn"
                :class="{ active: formData.creationType === type.id }"
                :style="{
                  backgroundColor: formData.creationType === type.id ? type.color : 'rgba(74, 158, 255, 0.2)',
                }"
                @click="formData.creationType = type.id"
              >
                <span class="creation-type-name">{{ type.name }}</span>
                <span
                  class="creation-type-cost"
                  v-if="type.cost > 0"
                  >₹{{ type.cost }}</span
                >
              </button>
            </div>
            <div
              class="cost-display"
              v-if="currentCost > 0"
            >
              <span class="cost-label">创作成本:</span>
              <span class="text-gold">₹{{ currentCost }}</span>
            </div>
          </div>

          <!-- 风格选择 -->
          <div class="form-section">
            <h4>风格选择</h4>
            <div class="style-buttons">
              <button
                v-for="style in styles"
                :key="style.id"
                type="button"
                class="style-btn"
                :class="{ active: formData.style === style.id }"
                @click="formData.style = style.id"
              >
                <span class="style-icon">{{ style.icon }}</span>
                <span class="style-name">{{ style.name }}</span>
              </button>
            </div>
          </div>

          <!-- 英雄基本信息 -->
          <div class="form-section">
            <h4>英雄信息</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="hero-name">英雄名称</label>
                <input
                  type="text"
                  id="hero-name"
                  v-model="formData.name"
                  readonly
                />
                <button
                  type="button"
                  class="random-btn"
                  @click="generateHeroName"
                >
                  随机名称
                </button>
              </div>

              <div class="form-group">
                <label for="hero-icon">英雄图标</label>
                <input
                  type="text"
                  id="hero-icon"
                  v-model="formData.icon"
                  readonly
                />
                <button
                  type="button"
                  class="random-btn"
                  @click="generateIcon"
                >
                  随机图标
                </button>
              </div>
            </div>
          </div>

          <!-- 生成的英雄属性-->
          <div class="form-section">
            <h4>英雄属性</h4>
            <div class="generated-stats">
              <div class="stat-item">
                <span class="stat-label">生命值</span>
                <span class="text-gold">{{ formData.stats.health }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">攻击力</span>
                <span class="text-gold">{{ formData.stats.attack }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">防御力</span>
                <span class="text-gold">{{ formData.stats.defense }}</span>
              </div>
            </div>
            <button
              type="button"
              class="regenerate-btn"
              @click="regenerateStats"
            >
              重新生成属�?
            </button>
          </div>

          <!-- 模拟数据配置 -->
          <div class="form-section">
            <h4>模拟数据</h4>
            <div class="simulation-data">
              <div class="form-row">
                <div class="form-group">
                  <label for="pick-rate">出场�?0-100%)</label>
                  <input
                    type="range"
                    id="pick-rate"
                    v-model.number="formData.pickRate"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                  <span class="range-value text-gold">{{ (formData.pickRate * 100).toFixed(1) }}%</span>
                </div>
                <div class="form-group">
                  <label for="user-base">用户基数 (0-100%)</label>
                  <input
                    type="range"
                    id="user-base"
                    v-model.number="formData.userBase"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                  <span class="range-value text-gold">{{ (formData.userBase * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="hero-description">英雄描述</label>
              <textarea
                id="hero-description"
                v-model="formData.description"
                rows="3"
                placeholder="英雄的背景故事或特点描述..."
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="cancel-btn"
              @click="cancelForm"
            >
              取消
            </button>
            <button
              type="submit"
              class="submit-btn"
            >
              {{ isEditing ? '保存修改' : '创建英雄' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHeroSkinStore } from '@/stores/heroSkinStore';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';
import type { SidebarItem } from '@/components/common/window/ApplicationWindow.vue';

// 类型定义
interface HeroStats {
  health: number;
  attack: number;
  defense: number;
}

interface Hero {
  id: string;
  name: string;
  icon: string;
  class: string;
  stats: HeroStats;
  description: string;
  createdAt: string;
  creationType: string;
  style: string;
  pickRate: number;
  userBase: number;
}

interface HeroFormData {
  name: string;
  icon: string;
  class: string;
  stats: HeroStats;
  description: string;
  creationType: string;
  style: string;
  pickRate: number;
  userBase: number;
}

// 随机英雄名称列表
const heroNames = [
  '亚瑟',
  '孙悟空',
  '李白',
  '韩信',
  '诸葛亮',
  '貂蝉',
  '赵云',
  '吕布',
  '花木兰',
  '哪吒',
  '宫本武藏',
  '典韦',
  '夏侯惇',
  '项羽',
  '虞姬',
  '鲁班七号',
  '后羿',
  '伽罗',
  '孙尚香',
  '马可波罗',
  '不知火舞',
  '娜可露露',
  '橘右京',
  '甄姬',
  '王昭君',
  '武则天',
  '嬴政',
  '干将莫邪',
  '墨子',
  '钟馗',
  '安琪拉',
];

// 英雄职业列表
const heroClasses = [
  { id: '坦克', name: '坦克', icon: '🛡️', color: '#4CAF50' },
  { id: '战士', name: '战士', icon: '⚔️', color: '#FF9800' },
  { id: '刺客', name: '刺客', icon: '🗡️', color: '#F44336' },
  { id: '法师', name: '法师', icon: '🧙', color: '#9C27B0' },
  { id: '射手', name: '射手', icon: '🏹', color: '#2196F3' },
  { id: '辅助', name: '辅助', icon: '💫', color: '#00BCD4' },
];

// 创作类型列表
const creationTypes = [
  { id: 'self', name: '自己创作', cost: 0, color: '#4CAF50' },
  { id: 'master', name: '大师创作', cost: 200, color: '#2196F3' },
  { id: 'senior', name: '资深创作', cost: 1000, color: '#FF9800' },
];

// 风格列表
const styles = [
  { id: 'ancient', name: '古风', icon: '🏮' },
  { id: 'historical', name: '历史', icon: '📜' },
  { id: 'modern', name: '现代', icon: '🏙️' },
  { id: 'tech', name: '科技', icon: '🤖' },
  { id: 'fantasy', name: '奇幻', icon: '🧚' },
  { id: 'mythical', name: '神话', icon: '🐉' },
];

// 根据职业生成属性范围
const generateStatsByClass = (heroClass: string): HeroStats => {
  const baseStats = {
    坦克: { health: [150, 200], attack: [5, 10], defense: [15, 25] },
    战士: { health: [120, 160], attack: [15, 25], defense: [10, 18] },
    刺客: { health: [80, 120], attack: [25, 40], defense: [5, 12] },
    法师: { health: [80, 120], attack: [20, 35], defense: [5, 10] },
    射手: { health: [70, 110], attack: [25, 45], defense: [3, 8] },
    辅助: { health: [100, 150], attack: [5, 15], defense: [10, 20] },
  };

  const statsRange = baseStats[heroClass as keyof typeof baseStats] || baseStats.战士;

  return {
    health: Math.floor(Math.random() * (statsRange.health[1] - statsRange.health[0] + 1)) + statsRange.health[0],
    attack: Math.floor(Math.random() * (statsRange.attack[1] - statsRange.attack[0] + 1)) + statsRange.attack[0],
    defense: Math.floor(Math.random() * (statsRange.defense[1] - statsRange.defense[0] + 1)) + statsRange.defense[0],
  };
};

// 生成随机英雄名称
const generateRandomHeroName = (): string => {
  return heroNames[Math.floor(Math.random() * heroNames.length)];
};

// 生成随机英雄图标
const generateRandomIcon = (): string => {
  const icons = ['🦸', '🦹', '⚔️', '🛡️', '🗡️', '🧙‍♂️', '🏹', '🤝', '🔥', '💧', '🌪️', '🌱', '🌟', '💀', '👻'];
  return icons[Math.floor(Math.random() * icons.length)];
};

// 使用Pinia store
const heroSkinStore = useHeroSkinStore();

// 侧边栏配置const sidebarItems: SidebarItem[] = [{ id: 'hero-list', name: '英雄列表', icon: '🦸' }];

const activeModule = ref('hero-list');

// 状态管理const showCreateForm = ref(false);
const isEditing = ref(false);
const editingHeroId = ref<string>('');
const formData = ref<HeroFormData>({
  name: '',
  icon: '',
  class: '战士',
  stats: {
    health: 100,
    attack: 10,
    defense: 5,
  },
  description: '',
  creationType: 'self',
  style: 'ancient',
  pickRate: 0.5,
  userBase: 0.5,
});

// 计算当前选择的创作成本
const currentCost = computed(() => {
  const creationType = creationTypes.find((type) => type.id === formData.value.creationType);
  return creationType?.cost || 0;
});

// 选择职业
const selectClass = (heroClass: string): void => {
  formData.value.class = heroClass;
  // 自动根据职业生成属�?  formData.value.stats = generateStatsByClass(heroClass);
};

// 生成随机英雄名称
const generateHeroName = (): void => {
  formData.value.name = generateRandomHeroName();
  // 同时生成随机图标
  formData.value.icon = generateRandomIcon();
};

// 生成随机图标
const generateIcon = (): void => {
  formData.value.icon = generateRandomIcon();
};

// 重新生成属性
const regenerateStats = (): void => {
  formData.value.stats = generateStatsByClass(formData.value.class);
};

// 创建英雄
const createHero = (): void => {
  heroSkinStore.addHero({
    ...formData.value,
  });
  resetForm();
};

// 编辑英雄
const editHero = (hero: Hero): void => {
  isEditing.value = true;
  editingHeroId.value = hero.id;
  formData.value = {
    name: hero.name,
    icon: hero.icon,
    class: hero.class,
    stats: {
      health: hero.stats.health,
      attack: hero.stats.attack,
      defense: hero.stats.defense,
    },
    description: hero.description,
    creationType: hero.creationType || 'self',
    style: hero.style || 'ancient',
    pickRate: hero.pickRate || 0.5,
    userBase: hero.userBase || 0.5,
  };
  showCreateForm.value = true;
};

// 更新英雄
const updateHero = (): void => {
  const hero = heroSkinStore.getHeroById(editingHeroId.value);
  if (hero) {
    heroSkinStore.updateHero({
      ...hero,
      ...formData.value,
    });
    resetForm();
  }
};

// 获取英雄皮肤数量
const getHeroSkinCount = (heroId: string): number => {
  return heroSkinStore.getHeroSkinCount(heroId);
};

// 删除英雄
const deleteHero = (id: string): void => {
  const skinCount = getHeroSkinCount(id);
  const confirmMessage = skinCount > 0 ? `确定要删除这个英雄及${skinCount}个皮肤吗？` : '确定要删除这个英雄吗？';

  if (confirm(confirmMessage)) {
    heroSkinStore.deleteHero(id);
  }
};

// 提交表单
const submitForm = (): void => {
  if (isEditing.value) {
    updateHero();
  } else {
    createHero();
  }
};

// 重置表单
const resetForm = (): void => {
  showCreateForm.value = false;
  isEditing.value = false;
  editingHeroId.value = '';
  // 生成随机名称和图�?  const randomName = generateRandomHeroName();
  const randomIcon = generateRandomIcon();

  formData.value = {
    name: randomName,
    icon: randomIcon,
    class: '战士',
    stats: generateStatsByClass('战士'),
    description: '',
    creationType: 'self',
    style: 'ancient',
    pickRate: 0.5,
    userBase: 0.5,
  };
};

// 取消表单
const cancelForm = (): void => {
  resetForm();
};

// 初始化
onMounted(() => {
  heroSkinStore.initData();
});
</script>

<style lang="scss" scoped>
.module-section {
  background-color: rgb(26 26 46 / 95%);
  border-radius: var(--app-radius-md);
  padding: 1.5rem;
  box-shadow: var(--app-shadow-secondary);
  border: 1px solid var(--app-border-secondary);
  color: var(--app-text-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--app-border-secondary);
}

.section-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--app-text-primary);
}

.btn-primary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  background-color: #4a9eff;
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.hero-card {
  background-color: rgb(26 26 46 / 95%);
  border: 1px solid var(--app-border-secondary);
  border-radius: var(--app-radius-md);
  padding: 16px;
  text-align: center;
  box-shadow: var(--app-shadow-secondary);
  transition: all 0.2s ease;
}

.hero-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-primary);
}

.hero-icon {
  font-size: 48px;
  background-color: rgb(74 158 255 / 20%);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.hero-card h4 {
  margin: 0 0 8px;
  font-size: 18px;
  color: var(--app-text-primary);
}

.hero-class {
  margin: 0 0 12px;
  font-size: 14px;
  color: #4a9eff;
  font-weight: bold;
}

.hero-stats {
  background-color: rgb(0 0 0 / 20%);
  border-radius: var(--app-radius-sm);
  padding: 12px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  color: var(--app-text-secondary);
}

/* 英雄模拟数据样式 */
.hero-simulation-stats {
  background-color: rgb(156 39 176 / 10%);
  border-radius: var(--app-radius-sm);
  padding: 12px;
  margin-bottom: 12px;
  text-align: center;
}

/* 英雄皮肤数量样式 */
.hero-skins-count {
  background-color: rgb(74 158 255 / 10%);
  border-radius: var(--app-radius-sm);
  padding: 8px;
  margin-bottom: 12px;
  text-align: center;
  font-size: 14px;
}

.skins-label {
  color: #4a9eff;
  margin-right: 8px;
}

.skins-value {
  background-color: rgb(74 158 255 / 30%);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.hero-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.edit-btn {
  flex: 1;
  padding: 8px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background-color: #357abd;
}

.delete-btn {
  flex: 1;
  padding: 8px;
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: #e84118;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  background-color: rgb(0 0 0 / 10%);
  border-radius: var(--app-radius-md);
  color: var(--app-text-secondary);
}

/* 表单样式 */
.form-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.form-container {
  background-color: var(--app-bg-secondary);
  border-radius: var(--app-radius-md);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--app-shadow-primary);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--app-border-secondary);
}

.form-header h3 {
  margin: 0;
  font-size: 20px;
  color: var(--app-text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--app-text-secondary);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--app-text-primary);
}

.hero-form {
  padding: 20px;
}

/* 表单分组样式 */
.form-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: rgb(0 0 0 / 20%);
  border-radius: var(--app-radius-md);
}

.form-section h4 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #4a9eff;
  font-weight: bold;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1;
  position: relative;
}

.form-group.full-width {
  flex: 1 1 100%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--app-text-primary);
  font-size: 14px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  background-color: var(--app-bg-quaternary);
  border: 1px solid var(--app-border-secondary);
  border-radius: var(--app-radius-sm);
  color: var(--app-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4a9eff;
  box-shadow: 0 0 0 2px rgb(74 158 255 / 20%);
}

/* 职业按钮样式 */
.class-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.class-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: none;
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-weight: bold;
}

.class-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-secondary);
}

.class-btn.active {
  box-shadow: var(--app-shadow-primary);
  transform: translateY(-2px);
}

.class-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.class-name {
  font-size: 14px;
}

/* 创作类型按钮样式 */
.creation-type-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.creation-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: none;
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-weight: bold;
}

.creation-type-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-secondary);
}

.creation-type-btn.active {
  box-shadow: var(--app-shadow-primary);
  transform: translateY(-2px);
}

.creation-type-name {
  font-size: 14px;
  margin-bottom: 4px;
}

.creation-type-cost {
  font-size: 12px;
  opacity: 0.9;
}

/* 成本显示 */
.cost-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: rgb(0 0 0 / 30%);
  border-radius: var(--app-radius-sm);
  color: var(--app-text-primary);
  font-weight: bold;
}

.cost-label {
  font-size: 14px;
  opacity: 0.8;
}

/* 风格按钮样式 */
.style-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.style-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 2px solid rgb(74 158 255 / 20%);
  background-color: rgb(74 158 255 / 10%);
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--app-text-primary);
  font-weight: bold;
}

.style-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-secondary);
  border-color: #4a9eff;
}

.style-btn.active {
  background-color: rgb(74 158 255 / 30%);
  border-color: #4a9eff;
  box-shadow: var(--app-shadow-primary);
  transform: translateY(-2px);
}

.style-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.style-name {
  font-size: 12px;
  text-align: center;
}

/* 随机按钮样式 */
.random-btn {
  position: absolute;
  right: 8px;
  top: 38px;
  background-color: rgb(74 158 255 / 30%);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: var(--app-radius-sm);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.random-btn:hover {
  background-color: rgb(74 158 255 / 50%);
}

/* 生成的属性样�? */
.generated-stats {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: rgb(0 0 0 / 30%);
  border-radius: var(--app-radius-md);
}

.regenerate-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: rgb(74 158 255 / 30%);
  border: none;
  border-radius: var(--app-radius-sm);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.regenerate-btn:hover {
  background-color: rgb(74 158 255 / 50%);
  transform: translateY(-1px);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: var(--app-bg-tertiary);
  color: var(--app-text-primary);
  border: none;
  border-radius: var(--app-radius-sm);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: var(--app-bg-quaternary);
}

.submit-btn {
  padding: 10px 20px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: var(--app-radius-sm);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background-color: #357abd;
  transform: translateY(-1px);
}

/* 滚动条样�? */
.form-container::-webkit-scrollbar {
  width: 8px;
}

.form-container::-webkit-scrollbar-track {
  background: rgb(0 0 0 / 10%);
}

.form-container::-webkit-scrollbar-thumb {
  background: rgb(74 158 255 / 50%);
  border-radius: 4px;
}

.form-container::-webkit-scrollbar-thumb:hover {
  background: rgb(74 158 255 / 70%);
}

/* 响应式设�? */
@media (width <= 768px) {
  .form-row {
    flex-direction: column;
  }

  .hero-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

/* 模拟数据样式 */
.simulation-data {
  background-color: rgb(0 0 0 / 20%);
  padding: 16px;
  border-radius: var(--app-radius-md);
}

.simulation-data .form-row {
  gap: 24px;
}

.simulation-data .form-group {
  flex: 1;
}

.simulation-data input[type='range'] {
  width: 100%;
  margin-bottom: 8px;
}

.range-value {
  display: inline-block;
  background-color: rgb(74 158 255 / 30%);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}
</style>
