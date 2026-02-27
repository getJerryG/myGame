# ESLint错误修复计划

## 问题分析

项目中存在多个ESLint错误，主要是`@typescript-eslint/no-explicit-any`规则违反，即多处使用了`any`类型。这些any类型主要出现在以下场景：

1. `CoreData`类型定义中使用`Record<string, any>`
2. `GameData`接口中的嵌套数组使用`any[]`
3. 事件回调中的`app`参数使用`any`
4. 组件props中的`modal`使用`any`

## 修复方案

### 1. 创建通用类型定义

在src/types目录下创建通用类型定义文件，用于替换重复的类型定义：

* 创建`app.ts`文件，定义应用相关类型

* 创建`game.ts`文件，定义游戏数据相关类型

* 创建`modal.ts`文件，定义模态框相关类型

### 2. 修复具体文件

#### a. DesktopModal.vue

* 86: 将`CoreData`类型定义替换为通用类型

* 113: 将`revenueHistory?: any[]`替换为具体的收入历史类型

* 116-118: 将任务数组替换为具体的任务类型

* 123: 移除或替换索引签名中的`any`

* 139: 将事件回调中的`app`参数替换为具体的App类型

#### b. DesktopSystem.vue

* 123: 将`revenueHistory?: any[]`替换为具体的收入历史类型

* 127-129: 将任务数组替换为具体的任务类型

* 141: 移除或替换索引签名中的`any`

* 149: 将`CoreData`类型定义替换为通用类型

* 291: 将事件回调中的`app`参数替换为具体的App类型

#### c. ChatApp.vue

* 74: 将`CoreData`类型定义替换为通用类型

* 92: 将`revenueHistory?: any[]`替换为具体的收入历史类型

* 95-97: 将任务数组替换为具体的任务类型

* 102: 移除或替换索引签名中的`any`

* 109: 将`modal` prop替换为具体的Modal类型

#### d. 其他文件

按照相同的模式修复其他存在any类型的文件：

* InventoryModal.vue

* NewSimulationPanel.vue

* SimulationPanel.vue

* GameReleaseApp.vue

* OperationsApp.vue

* LotteryStorageBox.vue

* StorageBox.vue

### 3. 验证修复

修复完成后，运行`pnpm lint`验证所有ESLint错误是否已解决。

## 预期效果

* 所有`@typescript-eslint/no-explicit-any`错误被修复

* 代码类型更加安全和明确

* 提高代码的可维护性和可读性

* 符合项目的TypeScript最佳实践

