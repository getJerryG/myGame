<template>
  <div class="skin-release-panel">
    <!-- 面板头部 -->
    <div class="panel-header">
      <h3 class="panel-title">皮肤发布</h3>
      <button
        class="collapse-btn"
        aria-expanded="!isCollapsed"
        @click="toggleCollapse"
      >
        <span class="collapse-icon">{{ isCollapsed ? "▶️" : "▼" }}</span>
      </button>
    </div>

    <!-- 面板内容 -->
    <div class="panel-content" :class="{ collapsed: isCollapsed }">
      <!-- 皮肤库 -->
      <div class="skin-showcase">
        <h4 class="section-subtitle">皮肤库</h4>
        <SkinLibrary
          :skins="skins"
          :qualities="qualities"
          :selected-skin-id="selectedSkin?.id"
          @select-skin="selectSkin"
          @quality-change="handleQualityChange"
        />
      </div>

      <!-- 皮肤详情和发布设置 -->
      <div class="skin-publish-area">
        <h4 class="section-subtitle">发布设置</h4>
        <SkinDetail
          :skin="selectedSkin"
          :predicted-trend="predictedTrend"
          @skin-released="handleSkinReleased"
        />

        <!-- 皮肤特色展示 -->
        <div class="skin-features" v-if="selectedSkin">
          <h4 class="section-subtitle">特色技能展示</h4>
          <div class="features-grid">
            <div
              class="feature-item"
              v-for="(effect, index) in selectedSkin.effects"
              :key="index"
              :class="'feature-item-' + (index + 1)"
            >
              <div class="feature-icon">{{ effect.icon }}</div>
              <div class="feature-desc">{{ effect.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkinLibrary from "./SkinLibrary.vue";
import SkinDetail from "./SkinDetail.vue";

// 定义皮肤效果接口
interface SkinEffect {
  icon: string;
  description: string;
}

// 定义皮肤接口
interface Skin {
  id: number;
  name: string;
  avatar: string;
  heroName: string;
  quality: string;
  price: number;
  expected: {
    sales: number;
    satisfaction: number;
  };
  effects: SkinEffect[];
}

// 定义品质选项接口
interface QualityOption {
  value: string;
  label: string;
  icon: string;
}

// 定义发布配置接口
interface ReleaseConfig {
  discount: number;
  isLimited: boolean;
}

// 定义发布数据接口
interface ReleaseData {
  skin: Skin;
  config: ReleaseConfig;
}

// 定义事件
const emit = defineEmits<{
  "skin-released": [data: ReleaseData];
}>();

// 响应式数据
const isCollapsed = ref(false);
const selectedSkin = ref<Skin | null>(null);
const selectedQuality = ref("all");

// 品质选项
const qualities: QualityOption[] = [
  { value: "all", label: "全部", icon: "🎯" },
  { value: "brave", label: "勇者", icon: "⚔️" },
  { value: "epic", label: "史诗", icon: "🔮" },
  { value: "legend", label: "传说", icon: "👑" },
  { value: "limited", label: "限定", icon: "🔒" },
];

// 皮肤数据
const skins = ref<Skin[]>([
  {
    id: 1,
    name: "凤求凰",
    avatar: "🔥",
    heroName: "李白",
    quality: "legend",
    price: 1688,
    expected: {
      sales: 120,
      satisfaction: 95,
    },
    effects: [
      { icon: "🔥", description: "技能特效：凤凰环绕" },
      { icon: "🎵", description: "专属音效" },
      { icon: "💫", description: "回城特效" },
      { icon: "🌟", description: "头像框" },
    ],
  },
  {
    id: 2,
    name: "圣诞恋歌",
    avatar: "🎄",
    heroName: "貂蝉",
    quality: "epic",
    price: 888,
    expected: {
      sales: 85,
      satisfaction: 90,
    },
    effects: [
      { icon: "❄️", description: "技能特效：雪花飞舞" },
      { icon: "🎵", description: "专属音效" },
      { icon: "🎁", description: "回城特效" },
    ],
  },
  {
    id: 3,
    name: "街头霸王",
    avatar: "🥊",
    heroName: "韩信",
    quality: "epic",
    price: 888,
    expected: {
      sales: 75,
      satisfaction: 88,
    },
    effects: [
      { icon: "🔥", description: "技能特效：街头风格" },
      { icon: "🎵", description: "专属音效" },
    ],
  },
  {
    id: 4,
    name: "爱与和平",
    avatar: "🕊️",
    heroName: "程咬金",
    quality: "brave",
    price: 488,
    expected: {
      sales: 35,
      satisfaction: 82,
    },
    effects: [{ icon: "💚", description: "技能特效：绿色主题" }],
  },
  {
    id: 5,
    name: "黄金射手座",
    avatar: "🏹",
    heroName: "后羿",
    quality: "legend",
    price: 1688,
    expected: {
      sales: 105,
      satisfaction: 92,
    },
    effects: [
      { icon: "✨", description: "技能特效：金色光芒" },
      { icon: "🎵", description: "专属音效" },
      { icon: "💫", description: "回城特效" },
      { icon: "🌟", description: "头像框" },
      { icon: "🦅", description: "击败特效" },
    ],
  },
  {
    id: 6,
    name: "KPL限定",
    avatar: "🏆",
    heroName: "貂蝉",
    quality: "limited",
    price: 888,
    expected: {
      sales: 95,
      satisfaction: 94,
    },
    effects: [
      { icon: "⚡", description: "技能特效：电光特效" },
      { icon: "🎵", description: "专属音效" },
      { icon: "🏆", description: "回城特效" },
    ],
  },
]);

// 预测趋势数据
const predictedTrend = ref([10, 30, 60, 85, 95, 80, 60, 40, 25, 15]);

// 切换折叠状态
const toggleCollapse = (): void => {
  isCollapsed.value = !isCollapsed.value;
};

// 选择皮肤
const selectSkin = (skin: Skin): void => {
  selectedSkin.value = skin;
};

// 处理品质变化
const handleQualityChange = (quality: string): void => {
  selectedQuality.value = quality;
};

// 处理皮肤发布
const handleSkinReleased = (data: ReleaseData): void => {
  emit("skin-released", data);
};
</script>

<style lang="scss" scoped>
.skin-release-panel {
  @include utils.panel-base;
}

/* 面板头部 */
.panel-header {
  @include utils.panel-header;
}

.panel-title {
  @include utils.panel-title;
}

.collapse-btn {
  @include utils.collapse-btn;
}

.collapse-icon {
  font-size: tokens.$font-size-sm;
}

/* 面板内容 */
.panel-content {
  @include utils.panel-content;
  @include utils.flex-col(tokens.$spacing-xl, stretch);

  height: calc(100vh - 400px);
  min-height: 600px;

  &.collapsed {
    max-height: 0;
    padding: 0;
    overflow: hidden;
  }
}

/* 小节标题 */
.section-subtitle {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$primary-gold;
  margin: 0 0 tokens.$spacing-md;
}

/* 皮肤展示区域 */
.skin-showcase {
  @include utils.flex-col(tokens.$spacing-md, stretch);

  height: 100%;
  overflow: hidden;
}

.skin-publish-area {
  @include utils.flex-col(tokens.$spacing-md, stretch);

  height: 100%;
  overflow: hidden;
}

/* 皮肤特色展示 */
.skin-features {
  margin-top: tokens.$spacing-md;
  background: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  border: 1px solid rgb(255 255 255 / 10%);
}

.features-grid {
  @include utils.grid-auto-fill(150px, tokens.$spacing-md);

  margin-top: tokens.$spacing-sm;
}

.feature-item {
  background: rgb(0 0 0 / 20%);
  border-radius: tokens.$radius-sm;
  padding: tokens.$spacing-md;
  text-align: center;
  transition: all tokens.$transition-normal;
  border: 1px solid rgb(255 255 255 / 10%);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      tokens.$primary-gold,
      tokens.$success-green,
      tokens.$primary-blue,
      tokens.$lottery-purple
    );
    transform: scaleX(0);
    transition: transform tokens.$transition-normal;
  }

  &:hover {
    background: rgb(251 191 36 / 10%);
    border-color: tokens.$primary-gold;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(251 191 36 / 20%);

    &::before {
      transform: scaleX(1);
    }

    .feature-icon {
      transform: scale(1.1) rotate(10deg);
    }
  }
}

.feature-icon {
  font-size: tokens.$font-size-2xl;
  margin-bottom: tokens.$spacing-sm;
  display: block;
  transition: transform tokens.$transition-normal;

  @include utils.bounce;
}

.feature-desc {
  font-size: tokens.$font-size-xs;
  color: rgb(255 255 255 / 80%);
  line-height: 1.4;
}

/* 不同特色项的颜色效果 */
.feature-item-1 {
  .feature-icon {
    color: tokens.$primary-gold;
  }
}

.feature-item-2 {
  .feature-icon {
    color: tokens.$success-green;
  }
}

.feature-item-3 {
  .feature-icon {
    color: tokens.$primary-blue;
  }
}

.feature-item-4 {
  .feature-icon {
    color: tokens.$lottery-purple;
  }
}

.feature-item-5 {
  .feature-icon {
    color: tokens.$danger-red;
  }
}

/* 响应式设计 */
@include utils.mobile {
  .panel-content {
    padding: tokens.$spacing-md;
    flex-direction: column;
    height: auto;
    min-height: auto;
  }

  .skin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: tokens.$spacing-md;
  }

  .skin-avatar-large {
    font-size: tokens.$font-size-3xl;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}

/* 横屏手机适配 */
@include utils.landscape-mobile {
  .panel-content {
    padding: tokens.$spacing-sm;
    gap: tokens.$spacing-md;
    height: calc(100vh - 350px);
    flex-direction: row;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: tokens.$spacing-sm;
  }

  .feature-item {
    padding: tokens.$spacing-sm;
  }

  .feature-icon {
    font-size: tokens.$font-size-xl;
  }
}
</style>
