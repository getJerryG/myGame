# 项目开发规则

## 1. 目录结构

### 标准目录
```
src/
├── components/          # 组件
│   ├── common/         # 通用基础组件
│   └── business/       # 业务组件
├── modules/            # 功能模块（按业务划分）
├── services/           # 业务逻辑服务层
├── stores/             # Pinia状态管理
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
├── views/              # 页面视图
├── router/             # 路由配置
└── main.ts             # 应用入口
```

### 核心要求
- 目录层级不超过4层
- 每个文件/目录只负责一个功能
- 按功能模块组织代码，避免功能重叠

## 2. 代码分层

| 层级 | 职责 | 实现方式 |
|------|------|----------|
| UI层 | 渲染界面、处理交互 | Vue组件（.vue） |
| 服务层 | 封装业务逻辑、API调用 | TypeScript类/函数（services/） |
| 数据层 | 管理应用状态 | Pinia Store（stores/） |
| 类型层 | 定义数据结构 | TypeScript类型/接口（types/） |
| 工具层 | 通用工具 | 函数（utils/） |

### 核心原则
- **业务逻辑与UI分离**：组件只做渲染和交互，业务逻辑放services
- **数据与视图分离**：状态管理集中在stores，组件通过store获取数据
- **类型优先**：所有数据必须有明确的类型定义

## 3. 组件开发

### 设计原则
- **单一职责**：每个组件只负责一个功能
- **高内聚低耦合**：组件内部紧密相关，对外依赖最少
- **可复用性**：通用组件考虑复用场景

### 开发规范
- 单个组件不超过300行，超过必须拆分
- 使用Vue 3 Composition API + TypeScript
- 使用`<script setup>`语法糖
- 组件命名：PascalCase（如`GameReleaseApp.vue`）

### 组件通信
- 父→子：Props传递
- 子→父：emit事件
- 跨组件：Pinia状态管理
- 复杂逻辑：调用Services

## 4. 状态管理

### 设计原则
- **集中管理**：所有状态放在stores目录
- **模块划分**：按功能模块拆分store
- **最小化状态**：只存储必要的全局状态

### Store规范
- 使用Pinia，按功能创建独立store文件
- 状态命名：camelCase（如`pendingContent`）
- Action命名：动词开头的camelCase（如`getPendingContent`）
- Getter命名：名词/形容词开头的camelCase（如`pendingContentCount`）
- 明确配置持久化状态

## 5. 业务逻辑

### 实现方式
- 业务逻辑封装在services目录
- 使用TypeScript类，命名后缀为Service（如`GameReleaseService`）
- 静态方法：无状态逻辑
- 实例方法：有状态逻辑

### 核心要求
- 异步操作使用async/await
- 所有异步操作必须有错误处理
- 避免在组件内直接编写复杂业务逻辑

## 6. 类型定义

### 设计原则
- **集中管理**：所有类型放在types目录
- **单一来源**：避免重复定义，使用import复用
- **明确命名**：PascalCase（如`GameData`）

### 类型规范
- 基础类型：app.ts、game.ts、player.ts等
- 模块类型：按模块创建子目录（如types/lottery/）
- 合理使用接口继承，减少重复代码

## 7. 命名规范

| 类型 | 规则 | 示例 |
|------|------|------|
| 文件 | 小写+连字符 | game-service.ts |
| 组件 | PascalCase | GameReleaseApp.vue |
| 类 | PascalCase | GameReleaseService |
| 方法 | 动词开头camelCase | getPendingContent() |
| 变量 | camelCase | pendingContent |
| 常量 | UPPER_CASE+下划线 | MAX_CONTENT_LENGTH |
| 类型 | PascalCase | GameData |
| 接口 | PascalCase（I前缀可选） | IGameData |

## 8. 代码复用

### 核心原则
- **DRY原则**：Don't Repeat Yourself
- 重复代码抽成函数或组件
- 通用逻辑放utils或services

### 复用方式
- 通用组件：components/common/
- 工具函数：utils/
- 业务逻辑：services/
- 类型定义：types/

## 9. 性能优化

- 合理使用v-if/v-for，避免不必要的渲染
- 组件和路由使用懒加载
- 避免重复请求和计算，使用缓存
- 减少全局状态数量，避免不必要的响应式数据
- 大型列表使用虚拟滚动

## 10. 测试规范

- 核心功能必须有测试覆盖
- 单元测试：测试函数和组件的单一功能
- 集成测试：测试模块间的交互
- E2E测试：测试完整的用户流程
- 测试文件与被测试文件同名，后缀.test.ts

## 11. 开发流程

1. 确保安装了Node.js和pnpm
2. 克隆仓库后执行 `pnpm install` 安装依赖
3. 使用 `pnpm dev` 启动开发服务器
4. 代码开发遵循上述规则
5. 提交代码前执行：
   - `pnpm lint` 检查代码规范
   - `pnpm typecheck` 类型检查
   - `pnpm test` 运行测试
6. 确保所有检查通过后提交代码

## 12. 代码审核要求

- 代码必须符合上述规则
- 禁止硬编码数据（使用配置或服务获取）
- 禁止在组件内编写复杂业务逻辑
- 禁止重复代码
- 确保类型定义完整

## 总结

- 遵循模块化、分层架构
- 业务逻辑与UI分离
- 类型定义集中管理
- 组件和函数保持小而专注
- 状态管理集中清晰
- 代码复用优先
- 命名规范一致
- 注重性能优化
- 编写测试用例

---

**注**：以上规则是项目的基础开发规范，所有开发人员必须严格遵守。特殊情况需经架构师批准。
