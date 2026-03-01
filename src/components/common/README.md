# 通用组件库

本目录包含项目中使用的通用组件，这些组件具有高度的可复用性和可定制性，可用于各种场景。

## 组件列表

| 组件名称 | 描述 | 文件路径 |
|---------|------|----------|
| Button | 通用按钮组件，支持多种样式变体和交互状态 | `Button/index.vue` |
| List | 通用列表组件，支持不同布局和交互模式 | `List/index.vue` |
| Card | 通用卡片组件，支持不同卡片样式和内容布局 | `Card/index.vue` |
| Panel | 通用面板组件，支持折叠/展开功能和自定义标题 | `Panel/index.vue` |

## Button 组件

### 基本用法

```vue
<template>
  <Button variant="primary" size="medium">
    主要按钮
  </Button>
  
  <Button variant="secondary" size="small">
    次要按钮
  </Button>
  
  <Button variant="success" loading>
    加载中...
  </Button>
  
  <Button variant="danger" disabled>
    禁用按钮
  </Button>
</template>

<script setup lang="ts">
import Button from './Button/index.vue';
</script>
```

### API

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| type | `button`  `submit`  `reset` | `button` | 按钮类型 |
| variant | `primary`  `secondary`  `success`  `warning`  `danger`  `info` | `primary` | 按钮样式变体 |
| size | `small`  `medium`  `large` | `medium` | 按钮尺寸 |
| shape | `square`  `round`  `circle` | `square` | 按钮形状 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 是否显示加载状态 |
| block | `boolean` | `false` | 是否为块级按钮 |
| icon | `string` | `''` | 按钮图标 |
| iconPosition | `left`  `right` | `left` | 图标位置 |
| customClass | `string` | `''` | 自定义类名 |

### 事件

| 事件名称 | 描述 | 回调参数 |
|---------|------|----------|
| click | 点击事件 | `event: MouseEvent` |

## List 组件

### 基本用法

```vue
<template>
  <List
    :items="items"
    layout="vertical"
    :selectable="true"
    :selectedKeys="selectedKeys"
    @item-select="handleItemSelect"
  >
    <template #item="{ item }">
      <div class="list-item-content">
        <h4>{{ item.title }}</h4>
        <p>{{ item.description }}</p>
      </div>
    </template>
  </List>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import List from './List/index.vue';

const items = ref([
  { id: 1, title: '列表项1', description: '列表项1的描述' },
  { id: 2, title: '列表项2', description: '列表项2的描述' },
  { id: 3, title: '列表项3', description: '列表项3的描述' }
]);

const selectedKeys = ref([1]);

const handleItemSelect = (keys: number[], item: any, index: number) => {
  selectedKeys.value = keys;
};
</script>
```

### API

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| items | `Array` | `[]` | 列表数据 |
| layout | `vertical`  `grid`  `flow` | `vertical` | 列表布局 |
| selectable | `boolean` | `false` | 是否可选择 |
| draggable | `boolean` | `false` | 是否可拖拽 |
| loading | `boolean` | `false` | 是否显示加载状态 |
| pagination | `boolean` | `false` | 是否显示分页 |
| keyField | `string` | `id` | 数据项的唯一标识字段 |
| titleField | `string` | `title` | 数据项的标题字段 |
| subtitleField | `string` | `subtitle` | 数据项的副标题字段 |
| selectedKeys | `Array` | `[]` | 已选择的键值列表 |
| loadingText | `string` | `加载中...` | 加载状态文本 |
| emptyText | `string` | `暂无数据` | 空状态文本 |
| emptyIcon | `string` | `📭` | 空状态图标 |
| dragHandleIcon | `string` | `☰` | 拖拽手柄图标 |
| gridColumns | `number` | `3` | 网格布局的列数 |
| gridGap | `string` | `16px` | 网格布局的间距 |
| customClass | `string` | `''` | 自定义类名 |

### 事件

| 事件名称 | 描述 | 回调参数 |
|---------|------|----------|
| item-click | 列表项点击事件 | `item: ListItem, index: number` |
| item-select | 列表项选择事件 | `selectedKeys: any[], item: ListItem, index: number` |
| drag-start | 列表项拖拽开始事件 | `item: ListItem, index: number` |
| drag-end | 列表项拖拽结束事件 | `item: ListItem  null, index: number  null` |
| drag-drop | 列表项拖拽放置事件 | `fromIndex: number, toIndex: number` |
| drop | 列表拖拽放置事件 | `fromIndex: number, toIndex: number` |

### 插槽

| 插槽名称 | 描述 |
|---------|------|
| default | 列表项内容 |
| empty-actions | 空状态的操作区域 |
| pagination | 分页器 |

## Card 组件

### 基本用法

```vue
<template>
  <Card
    title="卡片标题"
    subtitle="卡片副标题"
    variant="primary"
    size="medium"
  >
    <template #image>
      <img src="https://example.com/image.jpg" alt="卡片图片">
    </template>
    
    <p>卡片内容...</p>
    
    <template #tags>
      <span class="tag">标签1</span>
      <span class="tag">标签2</span>
    </template>
    
    <template #footer>
      <Button variant="primary" size="small">
        操作按钮
      </Button>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from './Card/index.vue';
import Button from './Button/index.vue';
</script>
```

### API

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| variant | `default`  `primary`  `secondary`  `success`  `warning`  `danger`  `info` | `default` | 卡片样式变体 |
| size | `small`  `medium`  `large` | `medium` | 卡片尺寸 |
| shape | `square`  `round` | `square` | 卡片形状 |
| elevated | `boolean` | `true` | 是否显示阴影 |
| hoverable | `boolean` | `true` | 是否可悬停 |
| title | `string` | `''` | 卡片标题 |
| subtitle | `string` | `''` | 卡片副标题 |
| tags | `Array<{ text: string, variant?: string }>` | `[]` | 卡片标签 |
| customClass | `string` | `''` | 自定义类名 |

### 插槽

| 插槽名称 | 描述 |
|---------|------|
| default | 卡片内容 |
| header | 卡片头部 |
| header-actions | 卡片头部操作区 |
| image | 卡片图片 |
| footer | 卡片底部 |

## Panel 组件

### 基本用法

```vue
<template>
  <Panel
    title="面板标题"
    collapsible
    default-collapsed
  >
    <p>面板内容...</p>
    
    <template #footer>
      <Button variant="primary" size="small">
        保存
      </Button>
      <Button variant="secondary" size="small">
        取消
      </Button>
    </template>
  </Panel>
</template>

<script setup lang="ts">
import Panel from './Panel/index.vue';
import Button from './Button/index.vue';
</script>
```

### API

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| variant | `default`  `primary`  `secondary`  `success`  `warning`  `danger`  `info` | `default` | 面板样式变体 |
| size | `small`  `medium`  `large` | `medium` | 面板尺寸 |
| collapsible | `boolean` | `false` | 是否可折叠 |
| defaultCollapsed | `boolean` | `false` | 是否默认折叠 |
| collapsed | `boolean` | `undefined` | 当前折叠状态（受控模式） |
| disabled | `boolean` | `false` | 是否禁用 |
| title | `string` | `''` | 面板标题 |
| customClass | `string` | `''` | 自定义类名 |

### 事件

| 事件名称 | 描述 | 回调参数 |
|---------|------|----------|
| collapse-change | 折叠状态变化事件 | `collapsed: boolean` |

### 插槽

| 插槽名称 | 描述 |
|---------|------|
| default | 面板内容 |
| header | 面板头部 |
| header-actions | 面板头部操作区 |
| footer | 面板底部 |

## 样式变量

所有组件都使用了项目中的设计变量，确保样式的一致性和可维护性。主要使用的样式变量包括：

- 颜色：`tokens.$primary`, `tokens.$success`, `tokens.$warning`, `tokens.$error`, `tokens.$info`
- 间距：`tokens.$spacing-xs`, `tokens.$spacing-sm`, `tokens.$spacing-md`, `tokens.$spacing-lg`
- 字体大小：`tokens.$font-size-xs`, `tokens.$font-size-sm`, `tokens.$font-size-base`, `tokens.$font-size-lg`
- 边框半径：`tokens.$radius-sm`, `tokens.$radius-md`, `tokens.$radius-lg`, `tokens.$radius-full`
- 阴影：`tokens.$shadow-sm`, `tokens.$shadow-md`, `tokens.$shadow-lg`

## 最佳实践

1. **组件复用**：在项目中优先使用这些通用组件，避免重复开发相似功能的组件
2. **样式定制**：通过 `customClass` 属性或插槽来自定义组件样式，避免修改组件内部样式
3. **数据驱动**：使用 `items` 属性来驱动列表组件，避免手动渲染列表项
4. **事件处理**：使用组件提供的事件来处理用户交互，避免直接操作DOM
5. **响应式设计**：组件已经内置了响应式设计，适应不同屏幕尺寸

## 浏览器兼容性

所有组件都支持现代浏览器，包括：

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 维护指南

1. **组件更新**：更新组件时要确保向后兼容，避免破坏现有功能
2. **文档更新**：组件更新后要及时更新文档，确保文档与组件代码一致
3. **测试**：添加组件测试，确保组件功能正常
4. **性能优化**：优化组件性能，避免不必要的渲染和计算

## 贡献指南

1. **提交代码**：提交代码前要确保代码符合项目的编码规范
2. **添加测试**：为新组件或修改的组件添加测试
3. **更新文档**：更新组件文档，确保文档与组件代码一致
4. **提交PR**：提交PR时要详细描述组件的功能和修改内容

## 许可证

所有组件都使用MIT许可证，可自由使用和修改。