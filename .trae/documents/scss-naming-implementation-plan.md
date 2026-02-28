# SCSS 命名规范实施计划

## 当前问题分析

### 现有命名模式的问题

1. **别名含义不明**：`v` 和 `m` 过于简短，新团队成员难以理解
   ```scss
   @use '@/styles/variables' as v;  // v = ?
   @use '@/styles/mixins' as m;     // m = ?
   ```

2. **文件名不够描述性**：
   - `variables` 过于通用
   - `mixins` 没有体现文件实际内容（工具函数）

3. **缺乏命名空间标准**：不同组件可能使用不同的别名

## 实施目标

1. 建立清晰、直观的命名规范
2. 统一全项目的命名空间别名
3. 提高代码可读性和可维护性
4. 便于新团队成员快速上手

## 具体实施步骤

### 阶段一：创建新命名文件（第1-2天）

#### 1.1 创建 `_tokens.scss`

复制 `_variables.scss` 内容到新文件，并更新文件头注释：

```scss
// ============================================
// _tokens.scss - 设计令牌系统
// ============================================
// 用途: 定义项目的颜色、间距、字体、阴影等基础设计变量
// 命名空间: tokens
// 使用方式: @use '@/styles/tokens' as tokens;
// ============================================

// ... (原 _variables.scss 内容)
```

#### 1.2 创建 `_utilities.scss`

复制 `_mixins.scss` 内容到新文件，并更新文件头注释：

```scss
// ============================================
// _utilities.scss - 样式工具库
// ============================================
// 用途: 提供常用的 SCSS mixins 和辅助函数
// 命名空间: utils
// 使用方式: @use '@/styles/utilities' as utils;
// ============================================

// ... (原 _mixins.scss 内容)
```

#### 1.3 更新 `index.scss`

```scss
// ============================================
// main.scss - 样式系统入口
// ============================================
// 导出所有公共样式变量和工具
// ============================================

@forward 'tokens';
@forward 'utilities';

// 全局工具类
@use 'tokens' as tokens;
@use 'utilities' as utils;

// ... 现有内容
```

#### 1.4 标记旧文件为弃用

更新 `_variables.scss`：

```scss
// ============================================
// ⚠️ 已弃用 (DEPRECATED)
// ============================================
// 此文件已弃用，请使用 _tokens.scss
// 将在未来版本中移除
// ============================================

@warn "_variables.scss 已弃用，请迁移到 _tokens.scss，使用 'tokens' 作为命名空间";
@forward 'tokens';
```

更新 `_mixins.scss`：

```scss
// ============================================
// ⚠️ 已弃用 (DEPRECATED)
// ============================================
// 此文件已弃用，请使用 _utilities.scss
// 将在未来版本中移除
// ============================================

@warn "_mixins.scss 已弃用，请迁移到 _utilities.scss，使用 'utils' 作为命名空间";
@forward 'utilities';
```

### 阶段二：更新组件导入（第3-5天）

#### 2.1 制定批量替换规则

**替换模式**：

| 旧代码 | 新代码 |
|-------|-------|
| `@use '@/styles/variables' as v;` | `@use '@/styles/tokens' as tokens;` |
| `@use '@/styles/mixins' as m;` | `@use '@/styles/utilities' as utils;` |
| `v.$` | `tokens.$` |
| `@include m.` | `@include utils.` |

#### 2.2 批量替换脚本

创建替换脚本 `scripts/migrate-scss-imports.js`：

```javascript
/**
 * SCSS 导入迁移脚本
 * 将旧的 'v' 和 'm' 命名空间替换为 'tokens' 和 'utils'
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const VUE_FILES_PATTERN = 'src/**/*.vue';

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let hasChanges = false;

  // 替换导入语句
  if (content.includes("@use '@/styles/variables' as v")) {
    content = content.replace(
      /@use '@\/styles\/variables' as v;/g,
      "@use '@/styles/tokens' as tokens;"
    );
    hasChanges = true;
  }

  if (content.includes("@use '@/styles/mixins' as m")) {
    content = content.replace(
      /@use '@\/styles\/mixins' as m;/g,
      "@use '@/styles/utilities' as utils;"
    );
    hasChanges = true;
  }

  // 替换变量使用
  if (content.includes('v.$')) {
    content = content.replace(/v\.\$/g, 'tokens.$');
    hasChanges = true;
  }

  // 替换 mixin 使用
  if (content.includes('@include m.')) {
    content = content.replace(/@include m\./g, '@include utils.');
    hasChanges = true;
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ 已更新: ${filePath}`);
    return true;
  }

  return false;
}

function main() {
  const files = glob.sync(VUE_FILES_PATTERN);
  let updatedCount = 0;

  console.log(`找到 ${files.length} 个 Vue 文件\n`);

  files.forEach(file => {
    if (migrateFile(file)) {
      updatedCount++;
    }
  });

  console.log(`\n✨ 完成！共更新了 ${updatedCount} 个文件`);
}

main();
```

#### 2.3 执行批量替换

```bash
# 安装依赖
npm install glob

# 执行迁移脚本
node scripts/migrate-scss-imports.js
```

#### 2.4 手动检查关键文件

批量替换后，手动检查以下文件确保替换正确：
- [ ] `src/components/common/NotchBar/index.vue`
- [ ] `src/components/business/lottery/LotteryDrawButtons/index.vue`
- [ ] `src/views/main/DesktopPage.vue`
- [ ] `src/App.vue`

### 阶段三：验证和测试（第6天）

#### 3.1 运行类型检查

```bash
pnpm typecheck
```

#### 3.2 运行 Lint 检查

```bash
pnpm lint
```

#### 3.3 构建测试

```bash
pnpm build
```

#### 3.4 视觉回归测试

启动开发服务器，检查关键页面：
- [ ] 桌面首页
- [ ] 抽奖页面
- [ ] 角色系统页面
- [ ] 模拟系统页面

### 阶段四：清理旧文件（第7天）

确认所有组件都已迁移后，删除旧文件：

```bash
# 删除旧文件
rm src/styles/_variables.scss
rm src/styles/_mixins.scss

# 或者重命名为 .bak 备份
mv src/styles/_variables.scss src/styles/_variables.scss.bak
mv src/styles/_mixins.scss src/styles/_mixins.scss.bak
```

## 文件结构变更

### 变更前

```
src/styles/
├── _variables.scss      # 主题变量
├── _mixins.scss         # SCSS mixins
└── index.scss           # 入口
```

### 变更后

```
src/styles/
├── _tokens.scss         # 设计令牌（新）
├── _utilities.scss      # 工具混入（新）
├── _variables.scss      # 转发到 _tokens（弃用）
├── _mixins.scss         # 转发到 _utilities（弃用）
└── index.scss           # 入口
```

### 最终结构（清理后）

```
src/styles/
├── _tokens.scss         # 设计令牌
├── _utilities.scss      # 工具混入
└── index.scss           # 入口
```

## 命名空间对照表

| 文件 | 旧别名 | 新别名 | 使用示例 |
|-----|-------|-------|---------|
| `_tokens.scss` | `v` | `tokens` | `tokens.$primary` |
| `_utilities.scss` | `m` | `utils` | `@include utils.flex-center` |

## 迁移检查清单

### 实施前
- [ ] 团队讨论并确认命名规范
- [ ] 备份现有代码
- [ ] 创建功能分支 `feature/scss-naming-convention`

### 实施中
- [ ] 创建新命名文件
- [ ] 标记旧文件为弃用
- [ ] 执行批量替换脚本
- [ ] 手动检查关键文件

### 实施后
- [ ] 类型检查通过
- [ ] Lint 检查通过
- [ ] 构建成功
- [ ] 视觉回归测试通过
- [ ] 代码审查通过
- [ ] 合并到主分支

### 清理阶段
- [ ] 确认所有组件已迁移
- [ ] 删除旧文件
- [ ] 更新项目文档

## 风险与应对措施

| 风险 | 影响 | 应对措施 |
|-----|------|---------|
| 批量替换出错 | 高 | 先备份代码，小范围测试后再全面执行 |
| 团队成员不适应 | 中 | 提供详细的迁移指南和示例 |
| 旧代码冲突 | 中 | 使用转发机制保持兼容性 |
| 构建失败 | 高 | 在每个阶段后都进行构建测试 |

## 时间线

| 阶段 | 时间 | 负责人 | 产出 |
|-----|------|-------|------|
| 创建新文件 | 1天 | 前端负责人 | _tokens.scss, _utilities.scss |
| 批量替换 | 2天 | 开发人员 | 更新后的 Vue 文件 |
| 验证测试 | 1天 | QA/开发人员 | 测试报告 |
| 清理旧文件 | 0.5天 | 前端负责人 | 清理后的代码库 |
| 文档更新 | 0.5天 | 前端负责人 | 更新后的项目文档 |
| **总计** | **5天** | - | - |

## 示例代码对比

### 变更前

```vue
<template>
  <div class="my-component">
    <button class="btn-primary">点击</button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as v;
@use '@/styles/mixins' as m;

.my-component {
  padding: v.$spacing-md;
  background-color: v.$bg-secondary;
  
  .btn-primary {
    @include m.btn-primary;
    color: v.$text-primary;
  }
}
</style>
```

### 变更后

```vue
<template>
  <div class="my-component">
    <button class="btn-primary">点击</button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/tokens' as tokens;
@use '@/styles/utilities' as utils;

.my-component {
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-secondary;
  
  .btn-primary {
    @include utils.btn-primary;
    color: tokens.$text-primary;
  }
}
</style>
```

## 附录

### A. 推荐的 IDE 配置

在 `.vscode/settings.json` 中添加代码片段：

```json
{
  "scss.validate": true,
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

### B. 代码片段

创建 `.vscode/snippets/scss.json`：

```json
{
  "SCSS Import Tokens": {
    "prefix": "scscss-tokens",
    "body": ["@use '@/styles/tokens' as tokens;"],
    "description": "导入设计令牌"
  },
  "SCSS Import Utilities": {
    "prefix": "scscss-utils",
    "body": ["@use '@/styles/utilities' as utils;"],
    "description": "导入工具混入"
  },
  "SCSS Import Both": {
    "prefix": "scscss-import",
    "body": [
      "@use '@/styles/tokens' as tokens;",
      "@use '@/styles/utilities' as utils;"
    ],
    "description": "导入样式系统"
  }
}
```

---

**制定日期**: 2024年
**版本**: v1.0
**状态**: 待团队评审
