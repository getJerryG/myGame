<template>
  <ApplicationWindow windowTitle="皮肤开发">
    <template #sidebar>
      <div class="sidebar-menu">
        <button
          class="menu-item"
          :class="{ active: activeTab === 'new' }"
          @click="activeTab = 'new'"
        >
          <span class="menu-icon">📝</span>
          <span class="menu-name">新建皮肤</span>
        </button>
        <button
          class="menu-item"
          :class="{ active: activeTab === 'manage' }"
          @click="activeTab = 'manage'"
        >
          <span class="menu-icon">📋</span>
          <span class="menu-name">皮肤管理</span>
        </button>
      </div>
    </template>

    <template #content>
      <div class="skin-development-content">
        <!-- 新建皮肤标签页 -->
        <div
          v-if="activeTab === 'new'"
          class="tab-content"
        >
          <div class="section-card">
            <h3 class="text-gold">皮肤立项</h3>

            <!-- 绑定英雄选择 -->
            <div class="form-section">
              <h4>绑定英雄</h4>
              <div
                v-if="heroSkinStore.getAllHeroes.length > 0"
                class="option-buttons"
              >
                <button
                  v-for="hero in heroSkinStore.getAllHeroes"
                  :key="hero.id"
                  class="option-btn hero-btn"
                  :class="{ active: selectedHeroId === hero.id }"
                  @click="selectedHeroId = hero.id"
                >
                  <span class="option-icon">{{ hero.icon }}</span>
                  <span class="option-name">{{ hero.name }}</span>
                </button>
              </div>
              <div
                v-else
                class="no-heroes-message"
              >
                <p>暂无可用英雄，请先创建英雄</p>
              </div>
            </div>

            <!-- 皮肤品质选择 -->
            <div class="form-section">
              <h4>品质</h4>
              <div class="option-buttons">
                <button
                  v-for="quality in skinQualities"
                  :key="quality.id"
                  class="option-btn"
                  :class="{ active: selectedQuality === quality.id }"
                  :style="{
                    backgroundColor: selectedQuality === quality.id ? quality.color : 'rgba(74, 158, 255, 0.2)',
                  }"
                  @click="selectedQuality = quality.id"
                >
                  <span class="option-name">{{ quality.name }}</span>
                </button>
              </div>
            </div>

            <!-- 皮肤风格选择 -->
            <div class="form-section">
              <h4>风格</h4>
              <div class="option-buttons">
                <button
                  v-for="style in skinStyles"
                  :key="style.id"
                  class="option-btn"
                  :class="{ active: selectedStyle === style.id }"
                  @click="selectedStyle = style.id"
                >
                  <span class="option-icon">{{ style.icon }}</span>
                  <span class="option-name">{{ style.name }}</span>
                </button>
              </div>
            </div>

            <!-- 研发方式选择 -->
            <div class="form-section">
              <h4>研发方式</h4>
              <div class="option-buttons">
                <button
                  v-for="method in developmentMethods"
                  :key="method.id"
                  class="option-btn"
                  :class="{ active: selectedMethod === method.id }"
                  @click="selectedMethod = method.id"
                >
                  <span class="option-name">{{ method.name }}</span>
                </button>
              </div>
            </div>

            <!-- 确认立项按钮 -->
            <div class="action-section">
              <button
                class="confirm-btn"
                @click="confirmSkinCreation"
                :disabled="!selectedHeroId"
              >
                确认立项
              </button>
            </div>
          </div>
        </div>

        <!-- 皮肤管理标签页 -->
        <div
          v-else-if="activeTab === 'manage'"
          class="tab-content"
        >
          <h3
            class="text-gold"
            style="margin-bottom: 20px"
          >
            皮肤管理
          </h3>
          <div class="skin-list">
            <div
              v-for="skin in heroSkinStore.getAllSkins"
              :key="skin.id"
              class="skin-card"
            >
              <div class="skin-header">
                <div class="skin-icon">{{ skin.icon }}</div>
                <div class="skin-info">
                  <h4 class="text-gold">{{ skin.name }}</h4>
                  <p class="skin-hero">所属英雄：{{ getHeroName(skin.heroName) }}</p>
                </div>
                <div class="skin-status">
                  <span
                    class="status-badge"
                    :style="{ backgroundColor: getQualityColor(skin.rarity) }"
                  >
                    {{ skin.rarity }}
                  </span>
                  <span
                    v-if="skin.isDeveloping"
                    class="status developing"
                    >研发中</span
                  >
                  <span
                    v-else
                    class="status online"
                    >已上线</span
                  >
                </div>
              </div>

              <!-- 研发进度 -->
              <div
                v-if="skin.isDeveloping"
                class="development-progress"
              >
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${skin.progress}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ skin.progress }}% 完成</span>
              </div>

              <!-- 已上线皮肤数据 -->
              <div
                v-else
                class="skin-stats"
              >
                <div class="stat-item">
                  <span class="stat-label">销量</span>
                  <span class="stat-value text-gold">{{ skin.sales }} 份</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">价格</span>
                  <span class="stat-value text-gold">{{ skin.price }} 点券</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">特效</span>
                  <span class="stat-value text-gold">{{ skin.effects }} 种</span>
                </div>
              </div>

              <!-- 风格和研发方式 -->
              <div class="skin-meta">
                <div class="meta-item">
                  <span class="meta-label">风格:</span>
                  <span class="meta-value">{{ getStyleName(skin.style) }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">研发方式:</span>
                  <span class="meta-value">{{ skin.developmentMethod }}</span>
                </div>
              </div>
            </div>

            <div
              v-if="heroSkinStore.getAllSkins.length === 0"
              class="empty-state"
            >
              <p>暂无皮肤，前往"新建皮肤"页创建</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHeroSkinStore } from '@/stores/heroSkinStore';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';

// 使用Pinia store
const heroSkinStore = useHeroSkinStore();

// 状态管理
const activeTab = ref<string>('new');
const selectedHeroId = ref<string>('');
const selectedQuality = ref<string>('伴生');
const selectedStyle = ref<string>('古风');
const selectedMethod = ref<string>('自研');

// 皮肤品质列表
const skinQualities = [
  { id: '伴生', name: '伴生', color: '#9E9E9E' },
  { id: '勇者', name: '勇者', color: '#4CAF50' },
  { id: '史诗', name: '史诗', color: '#2196F3' },
  { id: '传说', name: '传说', color: '#FF9800' },
  { id: '限定', name: '限定', color: '#F44336' },
  { id: '荣耀典藏', name: '荣耀典藏', color: '#9C27B0' },
];

// 皮肤风格列表
const skinStyles = [
  { id: '古风', name: '古风', icon: '🏮' },
  { id: '未来科技', name: '未来科技', icon: '🤖' },
  { id: '机甲', name: '机甲', icon: '🤖' },
  { id: '二次元', name: '二次元', icon: '🧚' },
  { id: '运动', name: '运动', icon: '⚽' },
  { id: '暗黑', name: '暗黑', icon: '🌑' },
];

// 研发方式列表
const developmentMethods = [
  { id: '自研', name: '自研' },
  { id: '联动', name: '联动' },
];

// 随机皮肤名称列表
const skinNames = [
  '金色传说',
  '暗影刺客',
  '皇家骑士',
  '魔法少女',
  '星际旅行',
  '深海之灵',
  '火焰使者',
  '冰霜女王',
  '光明守护者',
  '黑暗领主',
  '雷霆战将',
  '风之游侠',
  '地之守护者',
  '水之精灵',
  '火之魔王',
];

// 生成随机皮肤名称
const generateRandomSkinName = (): string => {
  return skinNames[Math.floor(Math.random() * skinNames.length)];
};

// 生成随机皮肤图标
const generateRandomIcon = (): string => {
  const icons = ['🎨', '🧵', '🎭', '🌟', '🎪', '🎯', '🎮', '🎰', '🎲', '🎳'];
  return icons[Math.floor(Math.random() * icons.length)];
};

// 根据英雄id获取英雄名称
const getHeroName = (heroId: string): string => {
  const hero = heroSkinStore.getHeroById(heroId);
  return hero ? hero.name : '未知英雄';
};

// 根据风格id获取风格名称
const getStyleName = (styleId: string): string => {
  const style = skinStyles.find((s) => s.id === styleId);
  return style ? style.name : '未知风格';
};

// 根据品质获取颜色
const getQualityColor = (quality: string): string => {
  const qualityItem = skinQualities.find((q) => q.id === quality);
  return qualityItem ? qualityItem.color : 'rgba(74, 158, 255, 0.2)';
};

// 根据品质获取价格
const getPriceByQuality = (quality: string): number => {
  const priceMap: Record<string, number> = {
    伴生: 288,
    勇者: 488,
    史诗: 888,
    传说: 1688,
    限定: 1988,
    荣耀典藏: 2888,
  };
  return priceMap[quality] || 288;
};

// 根据品质获取特效数量
const getEffectsByQuality = (quality: string): number => {
  const effectsMap: Record<string, number> = {
    伴生: 0,
    勇者: 1,
    史诗: 3,
    传说: 5,
    限定: 6,
    荣耀典藏: 8,
  };
  return effectsMap[quality] || 0;
};

// 确认皮肤立项
const confirmSkinCreation = (): void => {
  if (!selectedHeroId.value) {
    return;
  }

  // 创建皮肤对象
  const newSkin: any = {
    id: Date.now().toString(),
    name: generateRandomSkinName(),
    icon: generateRandomIcon(),
    heroName: selectedHeroId.value,
    rarity: selectedQuality.value,
    price: getPriceByQuality(selectedQuality.value),
    effects: getEffectsByQuality(selectedQuality.value),
    description: '',
    createdAt: new Date().toISOString(),
    style: selectedStyle.value,
    developmentMethod: selectedMethod.value,
    isDeveloping: true,
    progress: 0,
    sales: 0,
  };

  // 添加到store
  heroSkinStore.addSkin(newSkin);

  // 重置选择
  selectedHeroId.value = '';
  selectedQuality.value = '伴生';
  selectedStyle.value = '古风';
  selectedMethod.value = '自研';
};

// 初始化数据
onMounted(() => {
  heroSkinStore.initData();
});
</script>

<style lang="scss" scoped>
/* 侧边栏菜单 */
.sidebar-menu {
  @include utils.flex-col(0, stretch);

  width: 100%;
  height: 100%;
  background-color: tokens.$bg-secondary;
  padding: tokens.$spacing-md 0;
  overflow-y: auto;
}

.menu-item {
  @include utils.flex-row(tokens.$spacing-md, center);

  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: none;
  border: none;
  color: tokens.$text-secondary;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  text-align: left;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;

  &:hover {
    background-color: tokens.$bg-light;
    color: tokens.$primary-blue;
  }

  &.active {
    background-color: rgb(59 130 246 / 20%);
    color: tokens.$primary-blue;
    border-right: 3px solid tokens.$primary-blue;
  }
}

.menu-icon {
  font-size: 20px;
}

/* 皮肤开发内容区域 */
.skin-development-content {
  width: 100%;
  height: 100%;
  padding: tokens.$spacing-lg;
  background-color: tokens.$bg-primary;
  color: tokens.$text-primary;
  overflow-y: auto;

  @include utils.custom-scrollbar;
}

/* 标签页内容样式 */
.tab-content {
  width: 100%;
}

/* 卡片样式 */
.section-card {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  box-shadow: tokens.$shadow-md;

  h3 {
    margin: 0 0 tokens.$spacing-lg;
    font-size: tokens.$font-size-xl;
    color: tokens.$primary-gold;
    font-weight: tokens.$font-weight-bold;
  }
}

/* 表单分组样式 */
.form-section {
  margin-bottom: tokens.$spacing-lg;
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-base;
    color: tokens.$primary-blue;
    font-weight: tokens.$font-weight-bold;
  }
}

/* 选项按钮组样式 */
.option-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: tokens.$spacing-md;
}

.option-btn {
  @include utils.flex-col(tokens.$space-2, center, center);

  padding: tokens.$spacing-md;
  border: none;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  color: tokens.$text-primary;
  font-weight: tokens.$font-weight-bold;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-md;
  }

  &.active {
    box-shadow: tokens.$shadow-lg;
    transform: translateY(-2px);
  }
}

.option-icon {
  font-size: 24px;
  margin-bottom: tokens.$space-2;
}

.option-name {
  font-size: tokens.$font-size-sm;
}

/* 英雄按钮样式 */
.hero-btn {
  border: 2px solid tokens.$border-light;
  background-color: tokens.$bg-light;

  &.active {
    background-color: rgb(59 130 246 / 30%);
    border-color: tokens.$primary-blue;
  }
}

/* 暂无英雄提示 */
.no-heroes-message {
  text-align: center;
  color: tokens.$error;
  font-size: tokens.$font-size-sm;
  padding: tokens.$spacing-lg;
  background-color: rgb(239 68 68 / 10%);
  border: 1px solid rgb(239 68 68 / 30%);
  border-radius: tokens.$radius-md;
  margin: tokens.$space-2 0;
}

/* 操作区域样式 */
.action-section {
  margin-top: tokens.$spacing-lg;

  @include utils.flex-center;
}

.confirm-btn {
  padding: tokens.$space-3 tokens.$space-9;
  background-color: tokens.$primary-blue;
  color: white;
  border: none;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  transition: all tokens.$transition-fast;

  &:hover {
    &:not(:disabled) {
      background-color: tokens.$primary-dark;
      transform: translateY(-2px);
      box-shadow: tokens.$shadow-blue;
    }
  }

  &:disabled {
    background-color: tokens.$bg-tertiary;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

/* 皮肤列表样式 */
.skin-list {
  @include utils.grid-auto-fill(280px, tokens.$spacing-lg);
}

/* 皮肤卡片样式 */
.skin-card {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  box-shadow: tokens.$shadow-md;
  transition: all tokens.$transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }
}

.skin-header {
  @include utils.flex-row(tokens.$spacing-md, center);

  margin-bottom: tokens.$spacing-md;
}

.skin-icon {
  font-size: 44px;
  margin-right: tokens.$spacing-md;
  background-color: rgb(59 130 246 / 20%);
  border-radius: 50%;
  width: 68px;
  height: 68px;

  @include utils.flex-center;
}

.skin-info {
  flex: 1;

  h4 {
    margin: 0 0 tokens.$space-1;
    font-size: tokens.$font-size-base;
    color: tokens.$primary-gold;
    font-weight: tokens.$font-weight-bold;
  }
}

.skin-hero {
  margin: 0;
  font-size: tokens.$font-size-xs;
  color: tokens.$primary-blue;
  font-weight: tokens.$font-weight-semibold;
}

.skin-status {
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: tokens.$space-1 tokens.$space-2;
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;
  color: white;
  margin-bottom: tokens.$space-1;
}

.status {
  display: block;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;
  padding: tokens.$space-0 tokens.$space-1;
  border-radius: tokens.$radius-full;

  &.developing {
    background-color: rgb(245 158 11 / 20%);
    color: tokens.$warning;
  }

  &.online {
    background-color: rgb(16 185 129 / 20%);
    color: tokens.$success;
  }
}

/* 研发进度样式 */
.development-progress {
  margin-bottom: tokens.$spacing-md;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: tokens.$bg-tertiary;
  border-radius: tokens.$radius-sm;
  overflow: hidden;
  margin-bottom: tokens.$space-2;
}

.progress-fill {
  height: 100%;
  background-color: tokens.$primary-blue;
  border-radius: tokens.$radius-sm;
  transition: width tokens.$transition-normal;
}

.progress-text {
  display: block;
  text-align: right;
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

/* 皮肤数据样式 */
.skin-stats {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-sm;
  padding: tokens.$spacing-md;
  margin-bottom: tokens.$spacing-md;
}

.stat-item {
  @include utils.flex-between;

  margin-bottom: tokens.$space-2;
  font-size: tokens.$font-size-sm;

  &:last-child {
    margin-bottom: 0;
  }
}

.stat-label {
  color: tokens.$text-secondary;
}

.stat-value {
  color: tokens.$primary-gold;
  font-weight: tokens.$font-weight-bold;
}

/* 皮肤元数据样式 */
.skin-meta {
  background-color: rgb(139 92 246 / 10%);
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
}

.meta-item {
  @include utils.flex-between;

  margin-bottom: tokens.$space-2;
  font-size: tokens.$font-size-sm;

  &:last-child {
    margin-bottom: 0;
  }
}

.meta-label {
  color: tokens.$text-secondary;
}

.meta-value {
  color: tokens.$text-primary;
  font-weight: tokens.$font-weight-semibold;
}

/* 空状态样式 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: tokens.$spacing-2xl;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  color: tokens.$text-secondary;
}

/* 响应式设计 */
@include utils.mobile {
  .option-buttons {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .skin-list {
    grid-template-columns: 1fr;
  }

  .skin-development-content {
    padding: tokens.$spacing-md;
  }

  .section-card {
    padding: tokens.$spacing-md;
  }
}
</style>
