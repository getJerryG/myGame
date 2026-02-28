# SCSS 样式表命名规范

## 1. 命名原则

### 1.1 清晰性
- 文件名应准确反映文件内容和用途
- 避免使用无意义的缩写（如 `v`, `m` 等）
- 使用描述性词汇，让人一眼理解文件作用

### 1.2 一致性
- 全项目使用统一的命名模式
- 相同类型的文件使用相同的后缀/前缀
- 保持命名风格统一

### 1.3 可维护性
- 命名应便于后期维护和扩展
- 考虑文件之间的依赖关系
- 便于团队成员快速定位和理解

## 2. 文件命名规范

### 2.1 核心样式文件（src/styles/）

| 原文件名 | 新文件名 | 命名说明 |
|---------|---------|---------|
| `_variables.scss` | `_tokens.scss` 或 `_design-tokens.scss` | 设计令牌/主题变量 |
| `_mixins.scss` | `_utilities.scss` 或 `_helpers.scss` | 工具函数/辅助类 |
| `index.scss` | `main.scss` 或 `index.scss` | 入口文件（保持index） |

**命名模式**：`_<功能>.scss`
- 下划线前缀表示这是一个 partial 文件（不单独编译）
- 使用小写字母
- 单词间用连字符分隔

### 2.2 组件样式文件

#### 2.2.1 Vue 单文件组件（推荐）
样式直接写在 `.vue` 文件的 `<style>` 标签中，无需单独文件。

#### 2.2.2 独立样式文件（特殊情况）
当组件样式过于复杂需要分离时：

| 场景 | 命名模式 | 示例 |
|-----|---------|------|
| 组件基础样式 | `<ComponentName>.module.scss` | `TopCoreData.module.scss` |
| 组件主题变体 | `<ComponentName>.theme.scss` | `SkinReleasePanel.theme.scss` |
| 组件响应式样式 | `<ComponentName>.responsive.scss` | `GameBoard.responsive.scss` |

**命名规则**：
- 使用 PascalCase 与组件名保持一致
- 添加后缀说明文件用途
- 放置在组件同级目录

### 2.3 命名空间别名规范

在 Vue 组件中导入样式时，使用以下标准别名：

```scss
// 推荐命名方式
@use '@/styles/tokens' as tokens;
@use '@/styles/utilities' as utils;
@use '@/styles/helpers' as helpers;

// 不推荐（过于简短，含义不明）
@use '@/styles/variables' as v;
@use '@/styles/mixins' as m;
```

**别名命名原则**：
1. **完整单词优先**：使用 `tokens` 而非 `t`，使用 `utils` 而非 `u`
2. **语义清晰**：别名应反映文件内容
3. **团队约定**：全项目使用统一的别名

## 3. 推荐的新命名体系

### 3.1 核心文件重命名建议

```
src/styles/
├── _tokens.scss          # 原 _variables.scss - 设计令牌/主题变量
├── _utilities.scss       # 原 _mixins.scss - 工具混入
├── _functions.scss       # （可选）SCSS 函数
├── _placeholders.scss    # （可选）占位符选择器
└── main.scss             # 入口文件
```

### 3.2 使用示例

**旧方式（不推荐）**：
```scss
@use '@/styles/variables' as v;
@use '@/styles/mixins' as m;

.my-component {
  color: v.$primary;
  @include m.flex-center;
}
```

**新方式（推荐）**：
```scss
@use '@/styles/tokens' as tokens;
@use '@/styles/utilities' as utils;

.my-component {
  color: tokens.$primary;
  @include utils.flex-center;
}
```

## 4. 命名空间别名对照表

| 文件类型 | 推荐别名 | 说明 |
|---------|---------|------|
| `_tokens.scss` | `tokens` | 设计令牌，包含颜色、间距、字体等变量 |
| `_utilities.scss` | `utils` | 工具混入，包含布局、动画等辅助函数 |
| `_functions.scss` | `fn` 或 `funcs` | SCSS 自定义函数 |
| `_placeholders.scss` | `placeholders` 或 `ph` | 占位符选择器（%placeholder） |

## 5. 组件内样式组织规范

### 5.1 文件头注释
每个样式文件应有清晰的头部注释：

```scss
// ============================================
// 文件名: _tokens.scss
// 用途: 设计令牌系统 - 定义项目的颜色、间距、字体等基础变量
// 使用方式: @use '@/styles/tokens' as tokens;
// 更新记录:
//   - 2024-01-15: 创建文件
//   - 2024-02-20: 添加角色系统专用色
// ============================================
```

### 5.2 变量命名规范

**颜色变量**：
```scss
// 主色调
$color-primary: #4a90e2;
$color-primary-light: #6aa9f4;
$color-primary-dark: #357abd;

// 功能色
$color-success: #10b981;
$color-warning: #f59e0b;
$color-error: #ef4444;

// 背景色
$bg-primary: #0f172a;
$bg-secondary: #1e293b;

// 文本色
$text-primary: #f8fafc;
$text-secondary: #cbd5e1;
```

**间距变量**：
```scss
$space-xs: 4px;
$space-sm: 8px;
$space-md: 16px;
$space-lg: 24px;
$space-xl: 32px;
```

## 6. 迁移计划

### 6.1 逐步迁移策略

1. **第一阶段**：创建新命名文件（保持旧文件兼容）
   ```
   src/styles/
   ├── _variables.scss      # 旧文件（标记为 deprecated）
   ├── _tokens.scss         # 新文件
   ├── _mixins.scss         # 旧文件（标记为 deprecated）
   ├── _utilities.scss      # 新文件
   └── main.scss
   ```

2. **第二阶段**：新组件使用新命名
   - 所有新开发组件使用 `@use '@/styles/tokens' as tokens;`
   - 旧组件逐步更新

3. **第三阶段**：全面替换
   - 批量替换旧导入语句
   - 删除旧文件

### 6.2 兼容性处理

在旧文件中添加转发和警告：

```scss
// _variables.scss (deprecated)
@warn "_variables.scss 已弃用，请使用 _tokens.scss";
@forward 'tokens';
```

## 7. 最佳实践

### 7.1 导入顺序
```scss
// 1. 设计令牌（变量）
@use '@/styles/tokens' as tokens;

// 2. 工具函数
@use '@/styles/utilities' as utils;

// 3. 组件样式
.my-component {
  // ...
}
```

### 7.2 命名空间使用
```scss
// 好：使用有意义的别名
@use '@/styles/tokens' as tokens;
color: tokens.$primary;

// 好：使用 utils 作为 utilities 的缩写
@use '@/styles/utilities' as utils;
@include utils.flex-center;

// 避免：过于简短的别名
@use '@/styles/tokens' as t;
@use '@/styles/utilities' as u;
```

### 7.3 私有成员
使用 `-` 前缀标记私有变量/混入：
```scss
// _tokens.scss
$-private-var: 123;  // 仅在当前文件可用
$public-var: 456;     // 可外部访问
```

## 8. 检查清单

在创建或修改样式文件时，请确认：

- [ ] 文件名使用小写字母和连字符
- [ ] 文件名准确描述文件内容
- [ ] 使用了标准的命名空间别名
- [ ] 文件头部有清晰的注释说明
- [ ] 变量/混入命名遵循规范
- [ ] 私有成员使用 `-` 前缀

## 9. 示例重构

### 重构前
```scss
// _variables.scss
$primary: #4a90e2;
$spacing-md: 16px;

// 组件中使用
@use '@/styles/variables' as v;
@use '@/styles/mixins' as m;

.component {
  color: v.$primary;
  padding: v.$spacing-md;
  @include m.flex-center;
}
```

### 重构后
```scss
// _tokens.scss
$color-primary: #4a90e2;
$space-md: 16px;

// _utilities.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 组件中使用
@use '@/styles/tokens' as tokens;
@use '@/styles/utilities' as utils;

.component {
  color: tokens.$color-primary;
  padding: tokens.$space-md;
  @include utils.flex-center;
}
```

---

**注意**：此规范应与团队讨论后实施，确保所有成员理解并遵循。
