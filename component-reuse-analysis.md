# Vue组件复用分析报告

## 1. 发现的可复用问题

### 1.1 任务系统组件重复
- **文件1**: `components/business/simulation/task/TaskSystemPanel.vue` (Options API)
- **文件2**: `components/common/TaskSystemPanel/index.vue` (Composition API)

**问题**: 两个组件功能类似，都是任务系统面板，但实现方式不同，导致代码重复。

**相似点**:
- 都包含任务列表展示
- 都有任务分类（每日、每周、每月任务 vs 成长、日常任务）
- 都有折叠/展开功能
- 都有任务状态展示

**差异点**:
- 使用不同的API风格（Options vs Composition）
- 数据来源不同（props vs store）
- 样式设计不同

### 1.2 累抽奖励组件重复
- **文件1**: `components/business/lottery/LotteryCumulativeRewards/index.vue`
- **文件2**: `components/business/lottery/CumulativeRewards/index.vue`

**问题**: 两个组件结构和功能几乎完全相同，都是累抽奖励面板。

**相似点**:
- 相同的UI结构（标题栏、进度条、奖励列表）
- 相同的奖励分类（可领取、未达到）
- 相同的交互逻辑（领取奖励）
- 相似的样式设计

**差异点**:
- 数据来源不同（store vs props/emit）
- 进度计算方式不同
- 样式细节略有差异

### 1.3 通用面板结构重复
多个组件都包含类似的面板结构：
- 任务系统面板
- 累抽奖励面板
- 英雄管理面板

**共同结构**:
```
<div class="panel">
  <div class="panel-header">
    <h2>标题</h2>
    <button @click="toggleCollapse">折叠/展开</button>
  </div>
  <div class="panel-content" v-if="!isCollapsed">
    <!-- 内容 -->
  </div>
</div>
```

### 1.4 窗口系统组件可进一步抽象
窗口相关组件：
- `ApplicationWindow.vue`
- `SystemWindow.vue`
- `WindowManager.vue`
- `WindowResizeHandle.vue`
- `WindowSidebar.vue`
- `WindowTitleBar.vue`

**问题**: 窗口组件之间的依赖关系不够清晰，可能存在重复逻辑。

## 2. 重构建议

### 2.1 任务系统组件重构
**方案**: 将两个任务系统组件合并为一个通用的任务面板组件

- 使用Composition API重写
- 支持通过props或store获取数据
- 支持自定义任务分类
- 提供灵活的样式配置

**重构后组件结构**:
```vue
<!-- components/common/TaskSystemPanel/index.vue -->
<template>
  <div class="task-system-panel" :class="customClass">
    <!-- 标题栏 -->
    <!-- 任务列表 -->
    <!-- 空状态 -->
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: string;
  title: string;
  description?: string;
  progress: number;
  target: number;
  status: 'pending' | 'in_progress' | 'completed';
  rewards?: Reward[];
}

interface TaskSection {
  title: string;
  tasks: Task[];
}

const props = withDefaults(defineProps<{
  sections: TaskSection[];
  title?: string;
  customClass?: string;
  collapsible?: boolean;
}>(), {
  title: '任务系统',
  collapsible: true
});

// 事件和逻辑...
</script>
```

### 2.2 累抽奖励组件重构
**方案**: 将两个累抽奖励组件合并为一个通用的累抽奖励面板组件

- 支持props驱动和store驱动两种模式
- 提供灵活的进度计算方式
- 支持自定义样式和动画

**重构后组件结构**:
```vue
<!-- components/common/CumulativeRewards/index.vue -->
<template>
  <div class="cumulative-rewards-panel" :class="layout">
    <!-- 标题栏 -->
    <!-- 进度条 -->
    <!-- 奖励列表 -->
  </div>
</template>

<script setup lang="ts">
interface Reward {
  name: string;
  amount: number;
  type: string;
}

interface CumulativeReward {
  threshold: number;
  reward: Reward;
}

const props = withDefaults(defineProps<{
  drawCount: number;
  rewards: CumulativeReward[];
  claimedRewards: number[];
  layout?: 'horizontal' | 'vertical';
  title?: string;
}>(), {
  layout: 'vertical',
  title: '累抽奖励'
});

// 事件和逻辑...
</script>
```

### 2.3 通用面板组件抽象
**方案**: 创建一个通用的面板组件，供其他组件复用

```vue
<!-- components/common/Panel/index.vue -->
<template>
  <div class="panel" :class="customClass">
    <div class="panel-header" v-if="$slots.header || title">
      <h2 v-if="title" class="panel-title">{{ title }}</h2>
      <slot name="header"></slot>
      <button 
        v-if="collapsible" 
        class="collapse-btn" 
        @click="toggleCollapse"
      >
        {{ isCollapsed ? '展开' : '收起' }}
      </button>
    </div>
    <div class="panel-content" :class="{ collapsed: isCollapsed }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  customClass?: string;
}>(), {
  collapsible: false,
  collapsed: false
});

const emit = defineEmits<{
  'collapse-change': [collapsed: boolean];
}>();

const isCollapsed = ref(props.collapsed);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('collapse-change', isCollapsed.value);
};
</script>
```

### 2.4 窗口系统组件优化
**方案**: 重新设计窗口系统组件的依赖关系，创建一个核心的Window组件，其他组件作为其子组件

```vue
<!-- components/common/Window/index.vue -->
<template>
  <div class="window" :class="windowClass">
    <WindowTitleBar 
      :title="title" 
      :closable="closable"
      @close="handleClose"
    />
    <div class="window-content">
      <slot></slot>
    </div>
    <WindowResizeHandle v-if="resizable" @resize="handleResize" />
  </div>
</template>

<script setup lang="ts">
// 窗口组件逻辑...
</script>
```

## 3. 重构收益

### 3.1 代码复用
- 减少代码重复，提高代码维护性
- 统一组件风格和交互逻辑
- 降低新功能开发成本

### 3.2 性能优化
- 减少组件数量，降低内存占用
- 统一渲染逻辑，提高渲染性能
- 减少样式冲突，提高样式渲染效率

### 3.3 开发效率
- 开发者可以更快地创建新功能
- 组件API统一，降低学习成本
- 更容易进行测试和调试

### 3.4 可维护性
- 集中管理组件逻辑，便于bug修复
- 统一组件风格，便于设计规范落地
- 更容易进行版本升级和功能扩展

## 4. 重构优先级

| 优先级 | 组件 | 重构内容 | 预期收益 |
|--------|------|----------|----------|
| 高 | 累抽奖励组件 | 合并为一个通用组件 | 减少代码重复，统一功能逻辑 |
| 高 | 任务系统组件 | 合并为一个通用组件 | 减少代码重复，统一API风格 |
| 中 | 通用面板组件 | 抽象出通用面板组件 | 提高组件复用率，统一面板样式 |
| 中 | 窗口系统组件 | 优化依赖关系，创建核心组件 | 提高窗口系统的可维护性和扩展性 |
| 低 | 其他重复组件 | 逐步重构和优化 | 持续提高代码质量 |

## 5. 重构实施建议

1. **分阶段实施**: 先重构高优先级组件，再逐步重构其他组件
2. **保持向后兼容**: 重构过程中要确保现有功能不受影响
3. **编写测试**: 为重构后的组件编写单元测试和集成测试
4. **文档更新**: 及时更新组件文档，确保开发者了解如何使用新组件
5. **培训和推广**: 向团队成员介绍重构后的组件，鼓励使用新组件

## 6. 总结

通过对Vue组件的复用分析，我们发现了多个可以重构和优化的组件。重构这些组件将有助于提高代码质量、减少维护成本、提高开发效率。建议按照优先级逐步实施重构计划，持续优化组件结构和功能。