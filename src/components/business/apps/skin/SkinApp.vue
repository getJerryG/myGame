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
        <!-- 新建皮肤标签�?-->
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

        <!-- 皮肤管理标签�?-->
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

              <!-- 已上线皮肤数�?-->
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

              <!-- 风格和研发方�?-->
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

// 状态管�?const activeTab = ref<string>('new');
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
/* 侧边栏菜�? */
.sidebar-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--sidebar-bg, #2a2a3a);
  padding: 16px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: none;
  border: none;
  color: var(--sidebar-text, #aaa);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 16px;
  font-weight: var(--font-semibold, 600);
}

.menu-item:hover {
  background-color: var(--sidebar-hover, rgb(74 158 255 / 10%));
  color: var(--sidebar-hover-text, #4a9eff);
}

.menu-item.active {
  background-color: var(--sidebar-active, rgb(74 158 255 / 20%));
  color: var(--sidebar-active-text, #4a9eff);
  border-right: 3px solid var(--sidebar-active-border, #4a9eff);
}

.menu-icon {
  font-size: 20px;
}

/* 皮肤开发内容区�? */
.skin-development-content {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: var(--content-bg, #1e1e2e);
  color: var(--text-primary, #fff);
  overflow-y: auto;
}

/* 标签页内容样�? */
.tab-content {
  width: 100%;
}

/* 卡片样式 */
.section-card {
  background-color: var(--card-bg, #2a2a3a);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
}

.section-card h3 {
  margin: 0 0 24px;
  font-size: 22px;
  color: var(--primary-gold, #ffd700);
  font-weight: var(--font-bold, 700);
}

/* 表单分组样式 */
.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background-color: var(--card-hover, rgb(0 0 0 / 20%));
  border-radius: 8px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section h4 {
  margin: 0 0 16px;
  font-size: 16px;
  color: var(--primary-color, #4a9eff);
  font-weight: var(--font-bold, 700);
}

/* 选项按钮组样�? */
.option-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-primary, #fff);
  font-weight: var(--font-bold, 700);
}

.option-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 30%);
}

.option-btn.active {
  box-shadow: 0 4px 12px rgb(0 0 0 / 40%);
  transform: translateY(-2px);
}

.option-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.option-name {
  font-size: 14px;
}

/* 英雄按钮样式 */
.hero-btn {
  border: 2px solid var(--border-color, rgb(74 158 255 / 20%));
  background-color: var(--button-bg, rgb(74 158 255 / 10%));
}

.hero-btn.active {
  background-color: var(--button-active, rgb(74 158 255 / 30%));
  border-color: var(--primary-color, #4a9eff);
}

/* 暂无英雄提示 */
.no-heroes-message {
  text-align: center;
  color: var(--danger-color, #ff6b6b);
  font-size: 14px;
  padding: 20px;
  background-color: var(--danger-bg, rgb(255 107 107 / 10%));
  border: 1px solid var(--danger-border, rgb(255 107 107 / 30%));
  border-radius: 8px;
  margin: 10px 0;
}

/* 操作区域样式 */
.action-section {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.confirm-btn {
  padding: 14px 36px;
  background-color: var(--primary-color, #4a9eff);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: var(--font-bold, 700);
  transition: all 0.2s ease;
}

.confirm-btn:hover:not(:disabled) {
  background-color: var(--primary-hover, #357abd);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(74 158 255 / 40%);
}

.confirm-btn:disabled {
  background-color: var(--disabled-bg, #666);
  cursor: not-allowed;
  opacity: 0.7;
}

/* 皮肤列表样式 */
.skin-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 皮肤卡片样式 */
.skin-card {
  background-color: var(--card-bg, #2a2a3a);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
  transition: all 0.2s ease;
}

.skin-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(0 0 0 / 40%);
}

.skin-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.skin-icon {
  font-size: 44px;
  margin-right: 16px;
  background-color: var(--primary-color, rgb(74 158 255 / 20%));
  border-radius: 50%;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skin-info {
  flex: 1;
}

.skin-info h4 {
  margin: 0 0 4px;
  font-size: 16px;
  color: var(--primary-gold, #ffd700);
  font-weight: var(--font-bold, 700);
}

.skin-hero {
  margin: 0;
  font-size: 13px;
  color: var(--primary-color, #4a9eff);
  font-weight: var(--font-semibold, 600);
}

.skin-status {
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: var(--font-bold, 700);
  color: white;
  margin-bottom: 4px;
}

.status {
  display: block;
  font-size: 12px;
  font-weight: var(--font-bold, 700);
  padding: 2px 6px;
  border-radius: 12px;
}

.status.developing {
  background-color: var(--warning-bg, rgb(255 217 61 / 20%));
  color: var(--warning-color, #ffd93d);
}

.status.online {
  background-color: var(--success-bg, rgb(76 175 80 / 20%));
  color: var(--success-color, #4caf50);
}

/* 研发进度样式 */
.development-progress {
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--border-color, rgb(0 0 0 / 30%));
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color, #4a9eff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  text-align: right;
  font-size: 12px;
  color: var(--text-secondary, #aaa);
}

/* 皮肤数据样式 */
.skin-stats {
  background-color: var(--card-hover, rgb(0 0 0 / 20%));
  border-radius: 6px;
  padding: 14px;
  margin-bottom: 16px;
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
  color: var(--text-secondary, #aaa);
}

.stat-value {
  color: var(--primary-gold, #ffd700);
  font-weight: var(--font-bold, 700);
}

/* 皮肤元数据样�? */
.skin-meta {
  background-color: var(--card-hover, rgb(156 39 176 / 10%));
  border-radius: 8px;
  padding: 14px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.meta-item:last-child {
  margin-bottom: 0;
}

.meta-label {
  color: var(--text-secondary, #aaa);
}

.meta-value {
  color: var(--text-primary, #fff);
  font-weight: var(--font-semibold, 600);
}

/* 空状态样�? */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px;
  background-color: var(--card-hover, rgb(0 0 0 / 10%));
  border-radius: 8px;
  color: var(--text-secondary, #aaa);
}

/* 滚动条样�? */
.skin-development-content::-webkit-scrollbar {
  width: 8px;
}

.skin-development-content::-webkit-scrollbar-track {
  background: var(--scrollbar-track, rgb(0 0 0 / 10%));
  border-radius: 4px;
}

.skin-development-content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, rgb(74 158 255 / 50%));
  border-radius: 4px;
}

.skin-development-content::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover, rgb(74 158 255 / 70%));
}

/* 响应式设�? */
@media (width <= 768px) {
  .option-buttons {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .skin-list {
    grid-template-columns: 1fr;
  }

  .skin-development-content {
    padding: 16px;
  }

  .section-card {
    padding: 20px;
  }
}
</style>
