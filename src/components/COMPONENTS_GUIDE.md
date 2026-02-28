# 组件架构指南

## 📐 组件拆分原则

### 核心目标
在**组件粒度**和**职责清晰度**之间找到平衡点，避免过度拆分和粒度过大。

---

## 🎯 什么时候应该拆分？

### 1. 行数阈值

| 行数范围 | 状态 | 行动 |
|---------|------|------|
| < 100 行 | ✅ 简洁 | 保持 |
| 100-300 行 | ✅ 合理 | 保持 |
| 300-500 行 | ⚠️ 关注 | 考虑拆分 |
| > 500 行 | 🔴 过大 | **必须拆分** |
| > 700 行 | 🔴 紧急 | **立即拆分** |

### 2. 职责判断标准

**✅ 应该拆分的情况：**
- 组件承担多个独立功能（如：同时处理列表、筛选、详情）
- 模板嵌套超过 3 层
- Props 数量超过 10 个
- 导入的依赖超过 10 个
- 组件内有明显的功能区块（可通过注释分隔）

**❌ 不应该拆分的情况：**
- 功能总是成对出现（如：标签页和对应的内容）
- 子组件离开父组件就无法独立使用
- 拆分后需要传递大量 props 给子组件
- 功能高度相关，拆分后降低可读性

---

## 📦 组件分类

### 1. 通用基础组件（common/）

**特点：**
- 高复用性
- 无业务逻辑或极少业务逻辑
- 通过 props 和 slots 定制行为
- 行数通常 < 300 行

**示例：**
```
Button.vue          # 按钮
Modal.vue           # 模态框
Card.vue            # 卡片
Input.vue           # 输入框
Table.vue           # 表格
```

### 2. 业务组件（business/）

**特点：**
- 包含特定业务逻辑
- 与具体功能模块绑定
- 可调用 services 和 stores
- 行数可接受 300-500 行

**示例：**
```
HeroList.vue        # 英雄列表（可接受）
LotteryDraw.vue     # 抽奖功能
GameRelease.vue     # 游戏发布
```

### 3. 容器组件（Container Components）

**特点：**
- 负责数据获取和状态管理
- 组合多个子组件
- 处理业务逻辑
- 行数可接受 400-600 行

**示例：**
```
HeroApp.vue         # 英雄管理容器
├── HeroCreation.vue
└── HeroManagement.vue
```

### 4. 展示组件（Presentational Components）

**特点：**
- 只负责渲染 UI
- 通过 props 接收数据
- 通过 events 触发行为
- 保持简洁 < 200 行

**示例：**
```
HeroCard.vue        # 英雄卡片展示
MetricCard.vue      # 数据指标卡片
```

---

## 🔧 拆分模式

### 模式 1：垂直拆分（按职责）

**适用场景：** 组件承担多个独立功能

```vue
<!-- ❌ 拆分前：OperationsApp.vue (957 行) -->
<template>
  <div>
    <!-- 创建活动 -->
    <div v-if="activeTab === 'create'">...</div>
    <!-- 活动管理 -->
    <div v-if="activeTab === 'manage'">...</div>
    <!-- 活动统计 -->
    <div v-if="activeTab === 'stats'">...</div>
  </div>
</template>
```

```vue
<!-- ✅ 拆分后 -->
<!-- OperationsApp.vue (容器，~100 行) -->
<template>
  <ApplicationWindow title="运营活动管理">
    <Tabs v-model="activeTab">
      <Tab name="create" label="创建活动">
        <CreateActivityTab />
      </Tab>
      <Tab name="manage" label="活动管理">
        <ActivityManagementTab />
      </Tab>
      <Tab name="stats" label="活动统计">
        <ActivityStatisticsTab />
      </Tab>
    </Tabs>
  </ApplicationWindow>
</template>
```

**子组件：**
- `CreateActivityTab.vue` (~300 行)
- `ActivityManagementTab.vue` (~300 行)
- `ActivityStatisticsTab.vue` (~300 行)

---

### 模式 2：水平拆分（按功能模块）

**适用场景：** 大型列表、复杂表单

```vue
<!-- ❌ 拆分前：HeroList.vue (771 行) -->
<template>
  <div>
    <!-- 筛选器 -->
    <div class="filters">...</div>
    <!-- 列表 -->
    <div class="list">
      <!-- 英雄卡片 -->
      <div v-for="hero in heroes" class="hero-card">...</div>
    </div>
    <!-- 详情侧边栏 -->
    <div class="sidebar" v-if="selectedHero">...</div>
  </div>
</template>
```

```vue
<!-- ✅ 拆分后 -->
<!-- HeroList.vue (主组件，~200 行) -->
<template>
  <div class="hero-list">
    <HeroFilters v-model="filters" />
    <HeroCard 
      v-for="hero in filteredHeroes" 
      :key="hero.id"
      :hero="hero"
      @select="handleSelect"
    />
    <HeroDetailSidebar 
      v-if="selectedHero" 
      :hero="selectedHero"
      @close="selectedHero = null"
    />
    <HeroEmptyState v-if="filteredHeroes.length === 0" />
  </div>
</template>
```

**子组件：**
- `HeroFilters.vue` (~200 行)
- `HeroCard.vue` (~150 行，可复用)
- `HeroDetailSidebar.vue` (~250 行)
- `HeroEmptyState.vue` (~50 行)

---

### 模式 3：逻辑抽离（使用 Composables）

**适用场景：** 组件内有复杂的业务逻辑

```vue
<!-- ❌ 拆分前：组件内包含大量逻辑 -->
<script setup lang="ts">
const heroes = ref([])
const filters = ref({})
const isLoading = ref(false)

// 100 行数据获取逻辑
async function fetchHeroes() {
  // ...
}

// 50 行筛选逻辑
function filterHeroes() {
  // ...
}

// 50 行排序逻辑
function sortHeroes() {
  // ...
}
</script>
```

```vue
<!-- ✅ 拆分后 -->
<script setup lang="ts">
import { useHeroList } from '@/composables/useHeroList'

const { heroes, filters, isLoading, fetchHeroes, filteredHeroes } = useHeroList()
</script>
```

**Composable：**
```typescript
// composables/useHeroList.ts
export function useHeroList() {
  const heroes = ref([])
  const filters = ref({})
  const isLoading = ref(false)
  
  async function fetchHeroes() {
    // 数据获取逻辑
  }
  
  function filterHeroes() {
    // 筛选逻辑
  }
  
  return { heroes, filters, isLoading, fetchHeroes, filteredHeroes }
}
```

---

### 模式 4：组合式组件（推荐）

**适用场景：** 多个相关功能组合

```vue
<!-- ✅ 优秀示例：CharacterInfo.vue (77 行) -->
<template>
  <div class="character-info">
    <CharacterCoreInfo :character="character" />
    <CharacterActionButtons @attack="handleAttack" />
    <InventoryModal v-model="showInventory" />
  </div>
</template>

<script setup lang="ts">
import CharacterCoreInfo from './CharacterCoreInfo/index.vue'
import CharacterActionButtons from './CharacterActionButtons/index.vue'
import InventoryModal from './InventoryModal/index.vue'
</script>
```

**优点：**
- 父组件保持简洁（< 100 行）
- 子组件职责清晰
- 易于理解和维护
- 子组件可独立测试

---

## 📏 组件健康度检查清单

在提交组件前，检查以下项目：

### 基础检查
- [ ] 组件行数 < 300 行（业务组件可放宽至 500 行）
- [ ] Props 数量 < 10 个
- [ ] Events 数量 < 10 个
- [ ] 导入依赖 < 10 个
- [ ] 模板嵌套 < 3 层

### 职责检查
- [ ] 组件只做一件事
- [ ] 组件名称准确描述职责
- [ ] 没有"万能组件"（什么都能做）
- [ ] 子组件可以独立理解

### 复用性检查
- [ ] 通用组件没有业务逻辑
- [ ] 业务组件没有硬编码数据
- [ ] Props 设计合理（避免过度定制）
- [ ] Slots 使用恰当

### 可维护性检查
- [ ] 代码结构清晰
- [ ] 复杂逻辑有注释说明
- [ ] 组件有明确的功能边界
- [ ] 易于单元测试

---

## 🚫 反模式（避免这样做）

### 反模式 1：过度拆分

```vue
<!-- ❌ 不要这样做 -->
<HeroName :name="hero.name" />
<HeroAvatar :avatar="hero.avatar" />
<HeroLevel :level="hero.level" />
<HeroCareer :career="hero.career" />
<HeroDescription :description="hero.description" />

<!-- ✅ 应该合并 -->
<HeroCard :hero="hero" />
```

**判断标准：**
- 如果这些"子组件"永远一起出现 → 合并
- 如果每个"子组件"只有 10-20 行 → 合并
- 如果需要传递大量 props → 合并

---

### 反模式 2：粒度过大

```vue
<!-- ❌ 不要这样做：GameManagementApp.vue (5000+ 行) -->
<template>
  <!-- 2000 行游戏逻辑 -->
  <!-- 1500 行 UI 渲染 -->
  <!-- 1500 行数据处理 -->
</template>

<!-- ✅ 应该拆分 -->
<GameHeader />
<GameSidebar />
<GameContent />
<GameModal />
```

**判断标准：**
- 超过 500 行 → 必须拆分
- 超过 700 行 → 立即拆分
- 包含多个独立功能区块 → 拆分

---

### 反模式 3：嵌套过深

```vue
<!-- ❌ 不要这样做：6-7 层嵌套 -->
<DesktopSystem>
  <DesktopAppContainer>
    <GameReleaseApp>
      <ApplicationWindow>
        <Sidebar>
          <MenuItem>
            <MenuItemContent>...</MenuItemContent>
          </MenuItem>
        </Sidebar>
      </ApplicationWindow>
    </GameReleaseApp>
  </DesktopAppContainer>
</DesktopSystem>

<!-- ✅ 优化目标：3-4 层 -->
<DesktopSystem>
  <DesktopAppContainer>
    <!-- 直接渲染应用，减少中间层 -->
    <GameReleaseWindow />
  </DesktopAppContainer>
  <Taskbar />
  <StartMenu />
</DesktopSystem>
```

---

## 📊 组件优先级矩阵

| 优先级 | 行数 | 组件示例 | 行动 |
|--------|------|----------|------|
| 🔴 P0 | > 700 行 | DesktopSystem, SystemWindow, OperationsApp | **立即拆分** |
| 🔴 P0 | 500-700 行 | HeroList, TopCoreData, CareerPromotion | **本周拆分** |
| 🟡 P1 | 400-500 行 | LotteryApp, HeroApp, ChatApp | **下周拆分** |
| 🟡 P2 | 300-400 行 | 其他中等复杂度组件 | **本月拆分** |
| 🟢 OK | < 300 行 | 大部分通用组件 | **保持** |

---

## 🎯 当前项目目标

### 第一阶段（本周）
- [ ] 拆分 6 个 P0 级别组件（> 700 行）
- [ ] 建立组件文档
- [ ] 统一命名规范

### 第二阶段（下周）
- [ ] 拆分 8 个 P1 级别组件（500-700 行）
- [ ] 提取可复用通用组件（MetricCard, HeroCard 等）
- [ ] 优化组件嵌套层级

### 第三阶段（本月）
- [ ] 系统性重构 P2 级别组件（300-500 行）
- [ ] 建立组件测试覆盖率
- [ ] 完善组件文档和示例

---

## 📚 参考资源

- [Vue 3 组合式 API 最佳实践](https://vuejs.org/guide/reusability/composables.html)
- [组件设计模式](https://vuejs.org/guide/essentials/component-basics.html)
- [代码复用指南](https://vuejs.org/guide/reusability/)

---

**最后更新**: 2026-02-28
**维护者**: 开发团队
