# 样式系统使用指南

## 概述

本项目采用统一的 SASS 样式系统，通过变量、混入（Mixins）和工具类来实现样式的复用和一致性。

## 文件结构

```
src/styles/
├── _variables.scss    # 主题变量定义
├── _mixins.scss       # 公共样式混入
├── index.scss         # 样式系统主入口
└── README.md          # 使用指南
```

## 快速开始

### 1. 全局引入

在 `main.ts` 中引入样式系统：

```typescript
import "@/styles/index.scss";
```

### 2. 在组件中使用

在 Vue 单文件组件的 `<style>` 块中使用：

```vue
<style scoped lang="scss">
@use "@/styles/variables" as v;
@use "@/styles/mixins" as m;

.my-component {
  // 使用变量
  background-color: v.$bg-secondary;
  padding: v.$spacing-md;

  // 使用混入
  @include m.flex-between;
  @include m.panel-base;
}
</style>
```

## 变量系统

### 颜色变量

```scss
// 主色调
$primary: #4a90e2;
$primary-gold: #fbbf24;
$primary-blue: #3b82f6;

// 功能色
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;

// 背景色
$bg-primary: #0f172a;
$bg-secondary: #1e293b;
$bg-light: rgb(255 255 255 / 5%);

// 文本色
$text-primary: #f8fafc;
$text-secondary: #cbd5e1;
$text-muted: #94a3b8;
```

### 间距变量

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
```

### 字体变量

```scss
$font-size-xs: 0.75rem; // 12px
$font-size-sm: 0.875rem; // 14px
$font-size-base: 1rem; // 16px
$font-size-lg: 1.125rem; // 18px
$font-size-xl: 1.25rem; // 20px
```

## 混入（Mixins）

### 布局混入

```scss
// Flexbox 布局
@include m.flex-center; // 水平垂直居中
@include m.flex-row($gap, $align, $justify); // 水平排列
@include m.flex-col($gap, $align, $justify); // 垂直排列
@include m.flex-between($align); // 两端对齐
```

### 面板混入

```scss
// 面板样式
@include m.panel-base; // 基础面板样式
@include m.panel-header; // 面板头部
@include m.panel-title; // 面板标题
@include m.panel-content; // 面板内容区域
@include m.config-section; // 配置区块
@include m.section-title; // 区块标题
@include m.subsection-title; // 子区块标题（金色）
```

### 按钮混入

```scss
// 按钮样式
@include m.btn-base; // 基础按钮
@include m.btn-primary; // 主要按钮（金色主题）
@include m.btn-secondary; // 次要按钮
@include m.btn-danger; // 危险按钮
@include m.collapse-btn; // 折叠按钮
```

### 表单混入

```scss
// 表单元素
@include m.input-base; // 输入框
@include m.select-base; // 选择框
@include m.slider-base; // 滑块
```

### 标签页混入

```scss
// 标签页
@include m.tabs-container; // 标签容器
@include m.tab-item; // 标签项
@include m.tab-label; // 标签文字
```

### 卡片混入

```scss
// 卡片/列表
@include m.interactive-card; // 可交互卡片
@include m.list-item; // 列表项
@include m.stat-item; // 统计项
@include m.stat-label; // 统计标签
@include m.stat-value($color); // 统计值
```

### 响应式混入

```scss
// 响应式
@include m.mobile { ... }           // 移动端
@include m.tablet { ... }           // 平板
@include m.desktop { ... }          // 桌面
@include m.wide { ... }             // 大屏幕
@include m.landscape-mobile { ... } // 横屏手机
```

### 动画混入

```scss
// 动画
@include m.fade-in($duration); // 淡入
@include m.pulse; // 脉冲
@include m.bounce; // 弹跳
@include m.float; // 悬浮
```

## 工具类

全局可用的 CSS 工具类：

### Flexbox

```html
<div class="flex flex-center">...</div>
<div class="flex flex-between">...</div>
<div class="flex flex-col gap-md">...</div>
```

### 间距

```html
<div class="p-md">...</div>
<!-- padding: 16px -->
<div class="m-sm">...</div>
<!-- margin: 8px -->
<div class="gap-lg">...</div>
<!-- gap: 24px -->
```

### 文本

```html
<span class="text-gold font-bold">...</span>
<span class="text-muted text-sm">...</span>
<p class="truncate">...</p>
<!-- 单行截断 -->
```

### 组件

```html
<div class="card">...</div>
<button class="btn btn-primary">...</button>
<input class="input" />
```

## 最佳实践

### 1. 始终使用变量

❌ 错误：

```scss
.my-component {
  color: #fbbf24;
  padding: 16px;
}
```

✅ 正确：

```scss
@use "@/styles/variables" as v;

.my-component {
  color: v.$primary-gold;
  padding: v.$spacing-md;
}
```

### 2. 合理使用混入

❌ 错误：

```scss
.panel {
  background-color: v.$bg-secondary;
  border-radius: v.$radius-lg;
  box-shadow: v.$shadow-md;
  // ... 重复定义
}
```

✅ 正确：

```scss
.panel {
  @include m.panel-base;
}
```

### 3. 保持嵌套层级清晰

❌ 错误：

```scss
.parent {
  .child {
    .grandchild {
      .great-grandchild {
        // 嵌套太深
      }
    }
  }
}
```

✅ 正确：

```scss
.parent {
  // 父级样式
}

.parent__child {
  // 子级样式
}

.parent__grandchild {
  // 孙级样式
}
```

### 4. 组件样式分离

将样式拆分为独立的 `.scss` 文件：

```
MyComponent/
├── index.vue
└── index.scss
```

```vue
<!-- index.vue -->
<template>...</template>
<script setup>
...
</script>
<style scoped lang="scss" src="./index.scss"></style>
```

### 5. 响应式设计

使用混入处理响应式：

```scss
.my-component {
  padding: v.$spacing-lg;

  @include m.mobile {
    padding: v.$spacing-md;
  }
}
```

## 重构检查清单

重构组件样式时，请检查以下项目：

- [ ] 所有颜色值都使用变量
- [ ] 所有间距都使用变量
- [ ] 所有字体大小都使用变量
- [ ] 重复的样式已提取为混入
- [ ] 嵌套层级不超过3层
- [ ] 使用了合适的工具类
- [ ] 响应式样式使用混入
- [ ] 动画使用预定义混入

## 常见问题

### Q: 如何添加新的变量？

A: 在 `_variables.scss` 中添加，并确保同时导出 CSS 自定义属性。

### Q: 如何创建新的混入？

A: 在 `_mixins.scss` 中添加，参考现有混入的格式。

### Q: 可以在 JS 中使用这些变量吗？

A: 可以，通过 CSS 自定义属性：

```javascript
const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary-gold");
```

### Q: 如何处理组件特有的样式？

A: 组件特有样式保留在组件的 `<style>` 块中，通用的样式使用混入。

## 迁移指南

### 从旧样式迁移

1. 替换所有固定值为变量
2. 提取重复样式为混入
3. 简化嵌套结构
4. 使用工具类替换简单样式

### 示例迁移

**迁移前：**

```scss
.skin-release-panel {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  // ...
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  // ...
}
```

**迁移后：**

```scss
@use "@/styles/variables" as v;
@use "@/styles/mixins" as m;

.skin-release-panel {
  @include m.panel-base;
}

.panel-header {
  @include m.panel-header;
}
```
