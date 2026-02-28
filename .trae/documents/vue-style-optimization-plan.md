# Vue 文件样式审查与优化计划

## 项目概述

本项目是一个基于 Vue 3 + TypeScript + SCSS 的游戏管理系统，需要对所有 Vue 文件的样式进行系统性审查与优化，确保样式规范统一、代码复用性高、维护性好。

## 现状分析

### 1. 已有样式系统

**变量文件**: `src/styles/_variables.scss`

* 完整的颜色系统（主色、辅助色、功能色、灰度、背景色、文本色、边框色）

* 间距系统（$spacing-xs 到 $spacing-2xl）

* 字体系统（大小、权重、行高）

* 圆角系统（$radius-sm 到 $radius-full）

* 阴影系统

* 过渡动画

* Z轴层级

* 布局尺寸

* 断点系统

* CSS 自定义属性导出

**混入文件**: `src/styles/_mixins.scss`

* Flexbox 布局混入（flex-center, flex-row, flex-col, flex-between）

* 面板/卡片样式混入（panel-base, panel-header, panel-title 等）

* 按钮样式混入（btn-base, btn-primary, btn-secondary, btn-danger）

* 表单元素混入（input-base, select-base, slider-base）

* 标签页混入

* 卡片/列表项混入

* 文本样式混入

* 响应式混入

* 动画混入

* 工具混入

### 2. 当前问题

通过抽样检查发现以下问题：

**A. 硬编码样式值**

* `LotteryDrawButtons/index.vue`: 使用 `#f5f5f5`, `#2196f3`, `20px`, `8px` 等硬编码值

* `DesktopAppIcon/index.vue`: 使用 `rgb(74 158 255 / 10%)`, `#ff6b6b`, `10px` 等硬编码值

* `SimulationHeader.vue`: 部分使用 CSS 变量但混合了固定值

**B. 样式层级结构不规范**

* 部分组件选择器嵌套层级过浅，容易出现全局样式冲突

* 子元素样式未完全嵌套在父元素选择器内

**C. 代码复用不足**

* 未充分利用已有的 mixins

* 重复定义相似的样式模式

**D. 导入方式不一致**

* 部分组件使用 `@use '@/styles/variables' as v;`

* 部分组件完全未导入样式系统

* 部分组件混合使用 CSS 变量和 SCSS 变量

## 优化目标

1. **样式统一规范实施**: 100% 使用主题变量，移除所有硬编码值
2. **样式层级结构优化**: 重构 CSS 选择器，确保嵌套层级清晰
3. **代码复用与模块化**: 充分利用 mixins，创建新的可复用样式模块
4. **保持一致性**: 所有组件遵循相同的样式导入和使用模式

## 实施步骤

### 阶段一：建立样式审查清单（第1步）

创建样式审查检查清单，用于系统化检查每个 Vue 文件：

**检查项**：

* [ ] 是否导入 `@use '@/styles/variables' as v;`

* [ ] 是否导入 `@use '@/styles/mixins' as m;`

* [ ] 是否使用硬编码颜色值（#xxx, rgb(), rgba()）

* [ ] 是否使用硬编码尺寸值（px, rem 等未使用变量）

* [ ] 选择器是否嵌套在父元素内

* [ ] 是否有重复代码可抽取为 mixin

* [ ] 是否使用了 CSS 变量而非 SCSS 变量

* [ ] 响应式样式是否使用 mixins

### 阶段二：识别需要新增的样式工具（第2步）

根据现有 Vue 文件分析，可能需要新增的 mixins：

1. **模态框混入**: `modal-overlay`, `modal-content`
2. **进度条混入**: `progress-bar`, `progress-fill`
3. **徽章混入**: `badge-base`, `badge-notification`
4. **图标容器混入**: `icon-container`, `icon-circle`
5. **网格布局混入**: `grid-layout`

### 阶段三：按优先级分批优化（第3-8步）

**批次划分原则**：

* P0: 核心公共组件（common 目录）

* P1: 业务组件（business 目录）

* P2: 页面视图（views 目录）

* P3: 模块组件（modules 目录）

**具体批次**：

#### 批次 1: 核心公共组件（P0）

* `components/common/NotchBar/index.vue` ✓ (已优化)

* `components/common/DesktopSystem/index.vue`

* `components/common/DesktopModal/index.vue`

* `components/common/DesktopAppContainer/index.vue`

* `components/common/DesktopAppIcon/index.vue`

* `components/common/AppNavbar/index.vue`

* `components/common/LeftSidebar/index.vue`

* `components/common/GameModal/index.vue`

* `components/common/TaskSystemPanel/index.vue`

* `components/common/ActionButtons/index.vue`

* `components/common/ResourceList/index.vue`

* `components/common/NewbieGuide/index.vue`

* `components/common/window/WindowManager.vue`

* `components/common/window/SystemWindow.vue`

* `components/common/window/ApplicationWindow.vue`

* `components/common/layouts/SidebarLayout.vue`

* `components/common/dialogs/ExitConfirmDialog.vue`

#### 批次 2: 业务组件 - 抽奖系统（P1）

* `components/business/lottery/LotteryStorageBox/index.vue`

* `components/business/lottery/StorageBox/index.vue`

* `components/business/lottery/LotteryDrawButtons/index.vue`

* `components/business/lottery/LotteryCumulativeRewards/index.vue`

* `components/business/lottery/CumulativeRewards/index.vue`

* `components/business/lottery/LotteryResultPanel/index.vue`

* `components/business/lottery/DrawResult/index.vue`

* `components/business/lottery/LotteryDataPanel/index.vue`

#### 批次 3: 业务组件 - 角色系统（P1）

* `components/business/character/SkillPanel/index.vue`

* `components/business/character/ItemDetailModal/index.vue`

* `components/business/character/InventoryModal/index.vue`

* `components/business/character/CharacterInfo/index.vue`

* `components/business/character/CharacterCoreInfo/index.vue`

* `components/business/character/CharacterAttributes/index.vue`

* `components/business/character/CharacterActionButtons/index.vue`

#### 批次 4: 业务组件 - 模拟系统核心（P1）

* `components/business/simulation/core/SimulationSidebar.vue`

* `components/business/simulation/core/SimulationHeader.vue`

* `components/business/simulation/core/TopCoreData.vue`

* `components/business/simulation/hero/HeroDetail.vue`

* `components/business/simulation/hero/HeroManagementHeader.vue`

* `components/business/simulation/hero/HeroList.vue`

* `components/business/simulation/hero/HeroFilters.vue`

* `components/business/simulation/hero/HeroManagementPanel.vue`

#### 批次 5: 业务组件 - 模拟系统其他（P1）

* `components/business/simulation/skin/SkinDetail.vue`

* `components/business/simulation/skin/SkinLibrary.vue`

* `components/business/simulation/skin/SkinReleasePanel.vue`

* `components/business/simulation/operation/AdvertisingConfig.vue`

* `components/business/simulation/operation/CollaborationConfig.vue`

* `components/business/simulation/operation/OperationStrategyPanel.vue`

* `components/business/simulation/operation/OperationPermissions.vue`

* `components/business/simulation/operation/BasicOperations.vue`

* `components/business/simulation/reward/TaskRewardConfig.vue`

* `components/business/simulation/reward/SeasonRewardConfig.vue`

* `components/business/simulation/reward/LoginRewardConfig.vue`

* `components/business/simulation/reward/RewardSystemPanel.vue`

* `components/business/simulation/task/TaskSystemPanel.vue`

* `components/business/simulation/task/NewbieGoals.vue`

* `components/business/simulation/task/CoreGoals.vue`

* `components/business/simulation/game/GameSetup.vue`

* `components/business/simulation/game/GameOverPanel.vue`

* `components/business/simulation/game/GameRelease.vue`

* `components/business/simulation/game/DecisionMaking.vue`

* `components/business/simulation/game/CareerPromotion.vue`

* `components/business/simulation/event/EventTypeSelector.vue`

* `components/business/simulation/event/EventPlanningPanel.vue`

* `components/business/simulation/event/EventHistoryList.vue`

* `components/business/simulation/event/EventPreviewModal.vue`

* `components/business/simulation/event/EventConfigForm.vue`

* `components/business/simulation/event/CrisisConfig.vue`

* `components/business/simulation/event/DynamicEvents.vue`

* `components/business/simulation/data/MarketSentimentPanel.vue`

* `components/business/simulation/data/DataTrendsPanel.vue`

* `components/business/simulation/data/AssessmentPanel.vue`

* `components/business/simulation/notification/RandomEventNotification.vue`

* `components/business/simulation/notification/NotificationSystem.vue`

#### 批次 6: 业务组件 - 应用系统（P1）

* `components/business/apps/AppStore/AppStore.vue`

* `components/business/apps/wallet/WalletApp.vue`

* `components/business/apps/TaskCenter/TaskCenterApp.vue`

* `components/business/apps/SystemSettings/SystemSettingsApp.vue`

* `components/business/apps/skin/SkinApp.vue`

* `components/business/apps/SentimentCenter/SentimentCenterApp.vue`

* `components/business/apps/rewards/RewardsApp.vue`

* `components/business/apps/operations/OperationsApp.vue`

* `components/business/apps/hero/HeroApp.vue`

* `components/business/apps/lottery/LotteryApp.vue`

* `components/business/apps/GameRelease/GameReleaseApp.vue`

* `components/business/apps/EventLog/EventLogApp.vue`

* `components/business/apps/event/EventApp.vue`

* `components/business/apps/DataCenter/DataCenterApp.vue`

* `components/business/apps/CollabCenter/CollabCenterApp.vue`

* `components/business/apps/content/ContentApp.vue`

* `components/business/apps/chat/ChatApp.vue`

* `components/business/apps/ChannelDeliveryApp/index.vue`

* `components/business/apps/career/CareerApp.vue`

* `components/business/apps/TestApp/index.vue`

* `components/business/sections/DashboardSection/index.vue`

#### 批次 7: 页面视图（P2）

* `views/main/DesktopPage.vue`

* `views/main/HomePage.vue`

* `views/main/AppPage.vue`

* `views/main/NotFoundPage.vue`

* `views/main/HelloPage.vue`

* `views/game/SettlementPage.vue`

* `views/player/PlayerCoreInfo.vue`

* `views/test/WindowManagerTest.vue`

* `views/test/WindowManagerTestStandalone.vue`

#### 批次 8: 模块视图（P2）

* `modules/simulation/views/NewSimulationPanel.vue`

* `modules/lottery/views/LotteryPage.vue`

* `modules/game/views/HeroDevelopmentApp.vue`

* `modules/game/views/GameReleaseApp.vue`

* `modules/game/views/GameSettingsApp.vue`

* `components/apps/skin/SkinDevelopmentApp.vue`

* `App.vue`

* `RootApp.vue`

### 阶段四：样式变量补充（第9步）

根据优化过程中发现的需求，补充 `_variables.scss` 中的变量：

可能需要补充的变量：

* 更多半透明颜色值

* 特定组件的固定尺寸

* 特殊的过渡时间

* 额外的阴影变体

### 阶段五：Mixins 补充（第10步）

根据优化过程中发现的需求，补充 `_mixins.scss` 中的 mixins：

需要新增的 mixins：

1. **模态框相关**:

   ```scss
   @mixin modal-overlay { ... }
   @mixin modal-content { ... }
   @mixin modal-header { ... }
   @mixin modal-footer { ... }
   ```

2. **进度条相关**:

   ```scss
   @mixin progress-bar { ... }
   @mixin progress-fill { ... }
   ```

3. **徽章相关**:

   ```scss
   @mixin badge-base { ... }
   @mixin badge-notification { ... }
   ```

4. **图标容器**:

   ```scss
   @mixin icon-container { ... }
   @mixin icon-circle { ... }
   ```

5. **网格布局**:

   ```scss
   @mixin grid-layout($columns, $gap) { ... }
   ```

### 阶段六：验证与测试（第11步）

1. **样式一致性检查**:

   * 运行 `pnpm lint` 检查代码规范

   * 运行 `pnpm typecheck` 检查类型错误

   * 确保所有 Vue 文件样式格式统一

2. **视觉回归测试**:

   * 启动开发服务器

   * 逐一检查各页面渲染效果

   * 对比优化前后的视觉效果

3. **响应式测试**:

   * 测试不同屏幕尺寸下的显示效果

   * 确保响应式 mixins 正常工作

### 阶段七：文档更新（第12步）

更新样式系统文档：

1. 在 `_variables.scss` 中添加新变量的使用说明
2. 在 `_mixins.scss` 中添加新 mixins 的使用示例
3. 更新 `index.scss` 中的工具类说明

## 优化规范

### 样式导入规范

所有 Vue 文件的 `<style>` 部分必须遵循以下格式：

```scss
<style scoped lang="scss">
// ============================================
// 组件名 组件样式
// ============================================

@use '@/styles/variables' as v;
@use '@/styles/mixins' as m;

// 组件根元素
.component-name {
  // 使用变量
  background-color: v.$bg-secondary;
  padding: v.$spacing-md;
  
  // 子元素嵌套
  .child-element {
    color: v.$text-primary;
    
    &:hover {
      color: v.$primary-gold;
    }
  }
}

// 响应式样式
@include m.mobile {
  .component-name {
    padding: v.$spacing-sm;
  }
}
</style>
```

### 硬编码值替换规则

| 硬编码值类型         | 替换方式             | 示例                                       |
| -------------- | ---------------- | ---------------------------------------- |
| 颜色值 (#xxx)     | 使用 SCSS 变量       | `#f5f5f5` → `v.$gray-100`                |
| 颜色值 (rgb/rgba) | 使用 SCSS 变量或计算    | `rgb(255 255 255 / 10%)` → `v.$bg-light` |
| 间距 (px)        | 使用 spacing 变量    | `20px` → `v.$spacing-lg`                 |
| 字体大小 (px/rem)  | 使用 font-size 变量  | `16px` → `v.$font-size-base`             |
| 圆角 (px)        | 使用 radius 变量     | `8px` → `v.$radius-md`                   |
| 阴影             | 使用 shadow 变量     | 自定义阴影 → `v.$shadow-md`                   |
| 过渡时间           | 使用 transition 变量 | `0.3s` → `v.$transition-normal`          |
| z-index        | 使用 z 变量          | `1000` → `v.$z-dropdown`                 |

### 选择器嵌套规范

1. **最大嵌套层级**: 不超过 4 层
2. **父元素包裹**: 所有子元素样式必须嵌套在父元素选择器内
3. **& 符号使用**: 合理使用 `&` 表示父选择器
4. **避免全局选择器**: 不使用裸标签选择器（如 `div { ... }`）

### 代码复用规范

1. **优先使用 mixins**: 对于重复出现的样式模式，优先使用已有的 mixins
2. **创建新 mixins**: 如果某个样式模式在 3 个以上组件中出现，考虑创建新的 mixin
3. **继承与组合**: 合理使用 SCSS 的 `@extend` 和 mixins

## 预期成果

1. **所有 Vue 文件样式统一使用主题变量**

   * 无硬编码颜色值

   * 无硬编码尺寸值

   * 一致的导入方式

2. **样式层级结构清晰**

   * 选择器嵌套规范

   * 无全局样式污染风险

   * 易于维护的代码结构

3. **代码复用率提升**

   * 充分利用 mixins

   * 减少重复代码

   * 提高开发效率

4. **视觉一致性**

   * 所有组件遵循相同的设计语言

   * 颜色、间距、字体大小统一

   * 响应式表现一致

## 风险与注意事项

1. **视觉回归风险**: 优化过程中可能引入视觉差异，需要仔细对比
2. **性能影响**: SCSS 变量和 mixins 编译后的 CSS 应该与之前等效
3. **兼容性**: 确保所有浏览器都能正常解析生成的 CSS
4. **团队协作**: 优化后的规范需要团队成员共同遵守

## 时间安排

| 阶段            | 预计时间      | 产出                    |
| ------------- | --------- | --------------------- |
| 阶段一：建立审查清单    | 0.5 天     | 审查检查清单                |
| 阶段二：识别新增工具    | 0.5 天     | 新增 mixins 清单          |
| 阶段三：分批优化      | 4 天       | 优化后的 Vue 文件           |
| 阶段四：样式变量补充    | 0.5 天     | 更新后的 \_variables.scss |
| 阶段五：Mixins 补充 | 0.5 天     | 更新后的 \_mixins.scss    |
| 阶段六：验证与测试     | 1 天       | 测试报告                  |
| 阶段七：文档更新      | 0.5 天     | 更新后的文档                |
| **总计**        | **7.5 天** | -                     |

## 成功标准

1. 所有 Vue 文件通过样式审查检查清单
2. `pnpm lint` 和 `pnpm typecheck` 无错误
3. 视觉表现与优化前保持一致或更优
4. 代码重复率降低 30% 以上
5. 样式文件平均行数减少 20%

