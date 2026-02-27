# 应用窗口公共组件抽离与全局规范统一 - Product Requirement Document

## Overview
- **Summary**: 抽离一个可复用的应用窗口公共抽象组件，统一所有应用的视觉规范、布局结构、交互逻辑，解决当前数据中心、应用中心、游戏发布等应用窗口存在的布局结构不统一、样式规范不统一、重复代码冗余问题。
- **Purpose**: 提升代码可维护性，实现一处修改全量生效，降低后续新增应用的开发成本，确保用户体验一致性。
- **Target Users**: 游戏策划模拟经营游戏的开发者和玩家用户。

## Goals
- 抽离一个可复用的「应用窗口公共抽象组件」，收敛所有通用布局、样式、交互逻辑
- 统一全量应用窗口的设计规范，实现一处修改全量生效，提升可维护性
- 支持灵活配置与扩展，既保证全局统一，又能兼容不同应用的个性化业务需求
- 对存量3个应用（数据中心、应用中心、游戏发布）完成重构，使其完全符合统一规范

## Non-Goals (Out of Scope)
- 不修改现有应用的业务逻辑和功能
- 不重构其他未提及的应用组件
- 不引入新的第三方依赖库
- 不修改游戏核心玩法逻辑

## Background & Context
- 当前项目中存在多个应用窗口组件（数据中心、应用中心、游戏发布等）
- 这些组件各自实现了类似的布局结构，但样式、交互逻辑不统一
- 已有SidebarLayout和DesktopAppContainer组件，但功能不完整，未能覆盖所有需求
- 后续需要新增更多应用窗口，统一组件可大幅降低开发成本

## Functional Requirements
- **FR-1**: 公共组件固定结构分层（顶部标题栏、左侧导航栏、右侧内容主体区）
- **FR-2**: 顶部标题栏统一规范与可配置能力（固定高度、背景色、字体规范、窗口控制按钮，支持自定义标题文本+图标、右上角自定义操作按钮）
- **FR-3**: 左侧导航栏统一规范与可配置能力（固定宽度、背景色、菜单项样式，支持导航菜单数据源配置、菜单层级）
- **FR-4**: 内容主体区统一规范与可配置能力（固定内边距、背景色、滚动条样式，支持自定义内容插槽）
- **FR-5**: 全局设计规范收敛（统一定义全局设计Token、统一交互规范）
- **FR-6**: 组件复用与扩展（props配置+插槽设计模式、预留插槽扩展入口、完整类型定义与组件注释）
- **FR-7**: 存量应用改造（移除重复代码、3个应用改造后视觉无差异）

## Non-Functional Requirements
- **NFR-1**: 公共组件必须兼容TypeScript，提供完整的类型定义
- **NFR-2**: 重构后的代码必须通过ESLint和TypeScript检查
- **NFR-3**: 组件加载性能无明显下降，首次渲染时间 < 100ms
- **NFR-4**: 代码复用率提升50%以上，减少重复样式和布局代码
- **NFR-5**: 新增应用接入时间从2小时减少到30分钟以内

## Constraints
- **Technical**: 必须使用Vue 3 Composition API、TypeScript、SCSS，不能引入新的第三方UI框架
- **Business**: 保持现有业务功能不变，只重构UI层
- **Dependencies**: 必须兼容现有的Pinia store体系和路由系统

## Assumptions
- 现有的3个应用（数据中心、应用中心、游戏发布）是主要的改造对象
- 现有的SidebarLayout和DesktopAppContainer组件可以作为参考，但不完全复用
- 项目现有的CSS变量（styles/variables.css）可以作为全局设计Token的基础

## Acceptance Criteria

### AC-1: 公共组件可独立复用
- **Given**: 公共组件已开发完成
- **When**: 开发者需要新增一个应用窗口
- **Then**: 仅需传入配置项与业务内容，即可快速生成符合规范的窗口，接入时间 < 30分钟
- **Verification**: `human-judgment`
- **Notes**: 需要开发者实际尝试创建新应用来验证

### AC-2: 3个存量应用改造完成
- **Given**: 公共组件已开发完成
- **When**: 3个存量应用（数据中心、应用中心、游戏发布）完成基于公共组件的重构
- **Then**: 视觉、布局、交互完全统一，无样式错乱、交互不一致的问题
- **Verification**: `human-judgment`
- **Notes**: 需要人工对比3个应用的界面效果

### AC-3: 全局样式收敛
- **Given**: 公共组件和全局设计Token已实现
- **When**: 检查项目中所有应用窗口的代码
- **Then**: 无冗余的重复样式代码，所有样式统一使用全局设计Token
- **Verification**: `programmatic`
- **Notes**: 通过代码审查和搜索检查是否还有硬编码的样式值

### AC-4: 公共组件功能完整
- **Given**: 公共组件已开发完成
- **When**: 测试公共组件的所有功能
- **Then**: 顶部标题栏、左侧导航栏、右侧内容主体区功能正常，支持所有可配置项
- **Verification**: `programmatic`
- **Notes**: 通过单元测试验证所有功能

### AC-5: TypeScript类型安全
- **Given**: 公共组件已开发完成
- **When**: 运行TypeScript类型检查
- **Then**: 无类型错误，所有props、插槽、事件都有完整的类型定义
- **Verification**: `programmatic`
- **Notes**: 运行pnpm typecheck验证

### AC-6: ESLint检查通过
- **Given**: 所有代码已完成
- **When**: 运行ESLint检查
- **Then**: 无ESLint错误，代码符合项目规范
- **Verification**: `programmatic`
- **Notes**: 运行pnpm lint验证

## Open Questions
- [ ] 是否需要支持多级导航菜单（三级及以上）？
- [ ] 是否需要支持窗口拖拽功能？（现有DesktopAppContainer已有）
- [ ] 是否需要支持窗口最小化/最大化/关闭功能？（现有DesktopAppContainer已有）
- [ ] 除了数据中心、应用中心、游戏发布，是否还有其他应用需要立即改造？
