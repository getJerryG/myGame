<template>
  <div class="hero-development-app">
    <div class="app-header">
      <h2>英雄</h2>
      <p>英雄全生命周期管理</p>
    </div>

    <div class="app-content">
      <!-- 新建英雄 -->
      <div
        v-if="activeModule === 'hero-new'"
        class="tab-content"
      >
        <div class="section-card">
          <h3>英雄立项</h3>

          <!-- 英雄职业选择 -->
          <div class="form-section">
            <h4>职业</h4>
            <div class="option-buttons">
              <button
                v-for="heroClass in heroClasses"
                :key="heroClass.id"
                class="option-btn"
                :class="{ active: selectedClass.value === heroClass.id }"
                @click="selectedClass.value = heroClass.id"
              >
                <span class="option-icon">{{ heroClass.icon }}</span>
                <span class="option-label">{{ heroClass.name }}</span>
              </button>
            </div>
          </div>

          <!-- 英雄流派选择 -->
          <div class="form-section">
            <h4>流派</h4>
            <div class="option-buttons">
              <button
                v-for="genre in genres"
                :key="genre.id"
                class="option-btn"
                :class="{ active: selectedGenre.value === genre.id }"
                @click="selectedGenre.value = genre.id"
              >
                <span class="option-label">{{ genre.name }}</span>
              </button>
            </div>
          </div>

          <!-- 英雄难度选择 -->
          <div class="form-section">
            <h4>难度</h4>
            <div class="option-buttons">
              <button
                v-for="difficulty in difficulties"
                :key="difficulty.id"
                class="option-btn"
                :class="{ active: selectedDifficulty.value === difficulty.id }"
                @click="selectedDifficulty.value = difficulty.id"
              >
                <span class="option-label">{{ difficulty.name }}</span>
              </button>
            </div>
          </div>

          <!-- 英雄立项确认 -->
          <div class="form-actions">
            <button
              class="confirm-btn"
              @click="confirmHeroCreation"
            >
              确认立项
            </button>
          </div>
        </div>
      </div>

      <!-- 英雄列表 -->
      <div
        v-else-if="activeModule === 'hero-list'"
        class="tab-content"
      >
        <div class="section-card">
          <h3>英雄列表</h3>

          <div class="hero-grid">
            <div
              v-for="hero in heroSkinStore.getAllHeroes"
              :key="hero.id"
              class="hero-card"
            >
              <div class="hero-header">
                <div class="hero-info">
                  <div class="hero-icon">{{ hero.icon }}</div>
                  <div class="hero-details">
                    <h4>{{ hero.name }}</h4>
                    <p class="hero-class">{{ hero.class }}</p>
                  </div>
                </div>
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

              <!-- 研发进度 -->
              <div
                v-if="hero.isDeveloping"
                class="development-progress"
              >
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${hero.developmentProgress}%` }"
                  ></div>
                </div>
                <div class="progress-text">研发进度: {{ hero.developmentProgress }}%</div>
              </div>

              <!-- 英雄数据统计 -->
              <div
                v-else
                class="hero-stats"
              >
                <div class="stat-item">
                  <span class="stat-label">胜率</span>
                  <span class="stat-value">{{ hero.winRate }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Ban率</span>
                  <span class="stat-value">{{ hero.banRate }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">登场率</span>
                  <span class="stat-value">{{ hero.pickRate }}%</span>
                </div>
              </div>

              <!-- 体验服调整 -->
              <div
                v-if="!hero.isDeveloping"
                class="experience-adjustment"
              >
                <h5>体验服调整</h5>
                <div class="adjustment-buttons">
                  <button
                    class="adjust-btn"
                    @click="adjustHero(hero.id, 'buff')"
                  >
                    加强
                  </button>
                  <button
                    class="adjust-btn"
                    @click="adjustHero(hero.id, 'nerf')"
                  >
                    削弱
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div
            v-if="heroSkinStore.getAllHeroes.length === 0"
            class="empty-state"
          >
            <p>暂无英雄，前往"新建英雄"页创建</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHeroSkinStore } from '@/stores/heroSkinStore';

// 英雄职业列表
const heroClasses = [
  { id: '射手', name: '射手', icon: '🏹', color: '#2196F3' },
  { id: '法师', name: '法师', icon: '🧙', color: '#9C27B0' },
  { id: '坦克', name: '坦克', icon: '🛡️', color: '#4CAF50' },
  { id: '刺客', name: '刺客', icon: '🗡️', color: '#F44336' },
  { id: '辅助', name: '辅助', icon: '💫', color: '#00BCD4' },
  { id: '战士', name: '战士', icon: '⚔️', color: '#FF9800' },
];

// 流派列表
const genres = [
  { id: 'standalone', name: '站撸大核' },
  { id: 'poke', name: 'POKE 消耗' },
  { id: 'attack_speed', name: '攻速走 A' },
  { id: 'functional', name: '功能性' },
  { id: 'engage', name: '开团型' },
];

// 难度列表
const difficulties = [
  { id: 'easy', name: '简单' },
  { id: 'medium', name: '中等' },
  { id: 'hard', name: '高操作' },
];

// 使用Pinia store
const heroSkinStore = useHeroSkinStore();

// 状态管理
const activeModule = ref('hero-new');
const selectedClass = ref('射手');
const selectedGenre = ref('standalone');
const selectedDifficulty = ref('easy');

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
];

// 生成随机英雄名称
const generateRandomHeroName = (): string => {
  return heroNames[Math.floor(Math.random() * heroNames.length)];
};

// 生成随机英雄图标
const generateRandomIcon = (): string => {
  const icons = ['🦸', '🦹', '⚔️', '🛡️', '🗡️', '🧙‍♂️', '🏹', '🤝', '🔥', '💧', '🌪️', '🌱', '🌟', '💀', '👻'];
  return icons[Math.floor(Math.random() * icons.length)];
};

// 确认英雄立项
const confirmHeroCreation = (): void => {
  // 创建英雄对象
  const newHero = {
    id: Date.now().toString(),
    name: generateRandomHeroName(),
    icon: generateRandomIcon(),
    class: selectedClass.value,
    genre: selectedGenre.value,
    difficulty: selectedDifficulty.value,
    isDeveloping: true,
    developmentProgress: 0,
    winRate: 50,
    banRate: 0,
    pickRate: 0,
  };

  // 添加到store
  heroSkinStore.addHero(newHero);

  // 切换到英雄列表
  activeModule.value = 'hero-list';
};

// 体验服调整英雄
const adjustHero = (heroId: string, adjustment: string): void => {
  // 获取英雄
  const hero = heroSkinStore.getHeroById(heroId);
  if (hero) {
    let winRateChange = 0;

    // 根据调整类型计算胜率变化
    switch (adjustment) {
      case 'buff':
        winRateChange = Math.floor(Math.random() * 3) + 3; // +3%~5%
        break;
      case 'nerf':
        winRateChange = -(Math.floor(Math.random() * 3) + 3); // -3%~5%
        break;
      default:
        winRateChange = 0;
    }

    // 更新英雄胜率
    const updatedHero = {
      ...hero,
      winRate: Math.max(45, Math.min(55, hero.winRate + winRateChange)), // 保持在45-55%之间
    };

    heroSkinStore.updateHero(updatedHero);
  }
};

// 初始化
onMounted(() => {
  heroSkinStore.initData();
});
</script>

<style lang="scss" scoped>
.hero-development-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1e1e2e;
  color: #fff;
  overflow: hidden;
}

.app-header {
  padding: 16px;
  background-color: #2a2a3a;
  border-bottom: 1px solid #3a3a4a;

  h2 {
    margin: 0 0 4px;
    font-size: 24px;
    color: #fff;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #a0a0b0;
  }
}

.app-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #1e1e2e;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card {
  background-color: #2a2a3a;
  border: 1px solid #3a3a4a;
  border-radius: 8px;
  padding: 20px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section h4 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #fff;
}

.option-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #3a3a4a;
  border: 1px solid #4a4a5a;
  border-radius: 6px;
  color: #a0a0b0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4a4a5a;
    border-color: #5a5a6a;
    color: #fff;
  }

  &.active {
    background-color: #2196f3;
    border-color: #2196f3;
    color: #fff;
  }
}

.option-icon {
  font-size: 18px;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.confirm-btn {
  padding: 12px 24px;
  background-color: #2196f3;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1976d2;
  }
}

/* 英雄列表样式 */
.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.hero-card {
  background-color: #3a3a4a;
  border: 1px solid #4a4a5a;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #5a5a6a;
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
  }
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hero-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hero-icon {
  font-size: 32px;
}

.hero-details h4 {
  margin: 0 0 4px;
  font-size: 16px;
  color: #fff;
}

.hero-class {
  margin: 0;
  font-size: 12px;
  color: #a0a0b0;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &.developing {
    background-color: #ff9800;
    color: #fff;
  }

  &.online {
    background-color: #4caf50;
    color: #fff;
  }
}

.development-progress {
  margin-top: 12px;
}

.progress-bar {
  height: 8px;
  background-color: #4a4a5a;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #2196f3;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 4px;
  font-size: 12px;
  color: #a0a0b0;
  text-align: right;
}

.hero-stats {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #a0a0b0;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.experience-adjustment {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #4a4a5a;
}

.experience-adjustment h5 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #fff;
}

.adjustment-buttons {
  display: flex;
  gap: 12px;
}

.adjust-btn {
  flex: 1;
  padding: 8px 12px;
  background-color: #3a3a4a;
  border: 1px solid #4a4a5a;
  border-radius: 4px;
  color: #a0a0b0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4a4a5a;
    border-color: #5a5a6a;
    color: #fff;
  }
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #a0a0b0;
  font-size: 16px;
}
</style>
