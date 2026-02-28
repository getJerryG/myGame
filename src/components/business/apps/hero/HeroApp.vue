<template>
  <ApplicationWindow windowTitle="英雄开发">
    <template #sidebar>
      <div class="sidebar-menu">
        <button
          class="menu-item"
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          <span class="menu-icon">📝</span>
          <span class="menu-name">新建英雄</span>
        </button>
        <button
          class="menu-item"
          :class="{ active: activeTab === 'manage' }"
          @click="activeTab = 'manage'"
        >
          <span class="menu-icon">📋</span>
          <span class="menu-name">英雄管理</span>
        </button>
      </div>
    </template>

    <template #content>
      <div class="hero-development-content">
        <!-- 新建英雄标签页 -->
        <div
          v-if="activeTab === 'create'"
          class="tab-content"
        >
          <div class="section-card">
            <h3 class="text-gold">英雄立项</h3>

            <!-- 英雄定位选择 -->
            <div class="form-section">
              <h4>英雄定位</h4>
              <div class="option-buttons">
                <button
                  v-for="role in heroRoles"
                  :key="role.id"
                  class="option-btn"
                  :class="{ active: selectedRole === role.id }"
                  @click="selectedRole = role.id"
                >
                  <span class="option-icon">{{ role.icon }}</span>
                  <span class="option-name">{{ role.name }}</span>
                </button>
              </div>
            </div>

            <!-- 英雄类型选择 -->
            <div class="form-section">
              <h4>英雄类型</h4>
              <div class="option-buttons">
                <button
                  v-for="type in heroTypes"
                  :key="type.id"
                  class="option-btn"
                  :class="{ active: selectedType === type.id }"
                  @click="selectedType = type.id"
                >
                  <span class="option-name">{{ type.name }}</span>
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
                @click="confirmHeroCreation"
              >
                确认立项
              </button>
            </div>
          </div>
        </div>

        <!-- 英雄管理标签页 -->
        <div
          v-else-if="activeTab === 'manage'"
          class="tab-content"
        >
          <h3
            class="text-gold"
            style="margin-bottom: 20px"
          >
            英雄管理
          </h3>
          <div class="hero-list">
            <div
              v-for="hero in heroSkinStore.getAllHeroes"
              :key="hero.id"
              class="hero-card"
            >
              <div class="hero-header">
                <div class="hero-icon">{{ hero.icon }}</div>
                <div class="hero-info">
                  <h4 class="text-gold">{{ hero.name }}</h4>
                  <p class="hero-role">{{ getRoleName(hero.role) }}</p>
                </div>
                <div class="hero-status">
                  <span
                    v-if="hero.isDeveloping"
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
                v-if="hero.isDeveloping"
                class="development-progress"
              >
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${hero.progress}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ hero.progress }}% 完成</span>
              </div>

              <!-- 已上线英雄数据 -->
              <div
                v-else
                class="hero-stats"
              >
                <div class="stat-item">
                  <span class="stat-label">胜率</span>
                  <span class="stat-value text-gold">{{ hero.winRate }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">出场率</span>
                  <span class="stat-value text-gold">{{ hero.pickRate }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Ban率</span>
                  <span class="stat-value text-gold">{{ hero.banRate }}%</span>
                </div>
              </div>

              <!-- 英雄类型和研发方式 -->
              <div class="hero-meta">
                <div class="meta-item">
                  <span class="meta-label">类型:</span>
                  <span class="meta-value">{{ getTypeName(hero.type) }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">研发方式:</span>
                  <span class="meta-value">{{ hero.developmentMethod }}</span>
                </div>
              </div>
            </div>

            <div
              v-if="heroSkinStore.getAllHeroes.length === 0"
              class="empty-state"
            >
              <p>暂无英雄，前往"新建英雄"页创建</p>
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
const activeTab = ref<string>('create');
const selectedRole = ref<string>('warrior');
const selectedType = ref<string>('physical');
const selectedMethod = ref<string>('self');

// 英雄定位列表
const heroRoles = [
  { id: 'warrior', name: '战士', icon: '⚔️' },
  { id: 'mage', name: '法师', icon: '🔮' },
  { id: 'archer', name: '射手', icon: '🏹' },
  { id: 'assassin', name: '刺客', icon: '🗡️' },
  { id: 'tank', name: '坦克', icon: '🛡️' },
  { id: 'support', name: '辅助', icon: '💚' },
];

// 英雄类型列表
const heroTypes = [
  { id: 'physical', name: '物理' },
  { id: 'magic', name: '法术' },
  { id: 'hybrid', name: '混合' },
];

// 研发方式列表
const developmentMethods = [
  { id: 'self', name: '自研' },
  { id: 'cooperation', name: '联动' },
];

// 随机英雄名称列表
const heroNames = [
  '李白',
  '韩信',
  '赵云',
  '孙悟空',
  '后羿',
  '鲁班七号',
  '妲己',
  '王昭君',
  '貂蝉',
  '吕布',
  '关羽',
  '张飞',
  '刘备',
  '曹操',
  '孙权',
];

// 生成随机英雄名称
const generateRandomHeroName = (): string => {
  return heroNames[Math.floor(Math.random() * heroNames.length)];
};

// 生成随机英雄图标
const generateRandomIcon = (): string => {
  const icons = ['⚔️', '🛡️', '🔮', '🏹', '🗡️', '💚', '🦸', '🦹', '🧙', '🧝', '🧛', '🧟'];
  return icons[Math.floor(Math.random() * icons.length)];
};

// 根据定位id获取定位名称
const getRoleName = (roleId: string): string => {
  const role = heroRoles.find((r) => r.id === roleId);
  return role ? role.name : '未知定位';
};

// 根据类型id获取类型名称
const getTypeName = (typeId: string): string => {
  const type = heroTypes.find((t) => t.id === typeId);
  return type ? type.name : '未知类型';
};

// 确认英雄立项
const confirmHeroCreation = (): void => {
  // 创建英雄对象
  const newHero: any = {
    id: Date.now().toString(),
    name: generateRandomHeroName(),
    icon: generateRandomIcon(),
    role: selectedRole.value,
    type: selectedType.value,
    developmentMethod: selectedMethod.value === 'self' ? '自研' : '联动',
    isDeveloping: true,
    progress: 0,
    winRate: 0,
    pickRate: 0,
    banRate: 0,
  };

  // 添加到store
  heroSkinStore.addHero(newHero);

  // 重置选择
  selectedRole.value = 'warrior';
  selectedType.value = 'physical';
  selectedMethod.value = 'self';

  alert(`英雄"${newHero.name}"立项成功！`);
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

/* 英雄开发内容区域 */
.hero-development-content {
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
  border: 2px solid tokens.$border-light;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  color: tokens.$text-primary;
  font-weight: tokens.$font-weight-bold;

  &:hover {
    background-color: tokens.$bg-lighter;
    border-color: tokens.$primary-blue;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-sm;
  }

  &.active {
    background-color: rgb(59 130 246 / 30%);
    border-color: tokens.$primary-blue;
    box-shadow: tokens.$shadow-blue;
  }
}

.option-icon {
  font-size: 24px;
  margin-bottom: tokens.$space-2;
}

.option-name {
  font-size: tokens.$font-size-sm;
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
    background-color: tokens.$primary-dark;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-blue;
  }
}

/* 英雄列表样式 */
.hero-list {
  @include utils.grid-auto-fill(300px, tokens.$spacing-lg);
}

/* 英雄卡片样式 */
.hero-card {
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

.hero-header {
  @include utils.flex-row(tokens.$spacing-md, center);
  margin-bottom: tokens.$spacing-md;
}

.hero-icon {
  font-size: 44px;
  margin-right: tokens.$spacing-md;
  background-color: rgb(59 130 246 / 20%);
  border-radius: 50%;
  width: 68px;
  height: 68px;
  @include utils.flex-center;
}

.hero-info {
  flex: 1;

  h4 {
    margin: 0 0 tokens.$space-1;
    font-size: tokens.$font-size-base;
    color: tokens.$primary-gold;
    font-weight: tokens.$font-weight-bold;
  }
}

.hero-role {
  margin: 0;
  font-size: tokens.$font-size-xs;
  color: tokens.$primary-blue;
  font-weight: tokens.$font-weight-semibold;
}

.hero-status {
  text-align: right;
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

/* 英雄数据样式 */
.hero-stats {
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

/* 英雄元数据样式 */
.hero-meta {
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

  .hero-list {
    grid-template-columns: 1fr;
  }

  .hero-development-content {
    padding: tokens.$spacing-md;
  }

  .section-card {
    padding: tokens.$spacing-md;
  }
}
</style>
