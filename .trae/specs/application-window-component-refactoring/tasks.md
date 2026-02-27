# 应用窗口公共组件抽离与全局规范统一 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 分析现有组件并定义全局设计Token
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 分析现有SidebarLayout、DesktopAppContainer、GameReleaseApp、DataCenterApp、AppStore等组件的实现
  - 基于现有styles/variables.css，完善全局设计Token体系
  - 定义主色、背景色、文字色、边框色、字号体系、字重、行高、间距规范、圆角、阴影、图标尺寸等Token
- **Acceptance Criteria Addressed**: [AC-3, AC-5]
- **Test Requirements**:
  - `programmatic` TR-1.1: 全局设计Token文件完整，包含所有必需的设计变量
  - `human-judgement` TR-1.2: Token命名规范清晰，易于理解和使用
- **Notes**: 优先复用现有styles/variables.css中的变量

## [x] Task 2: 设计并实现公共窗口组件接口定义
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 定义公共窗口组件的Props接口（标题、图标、导航菜单、自定义操作按钮等）
  - 定义插槽接口（内容主体区、头部扩展等）
  - 定义事件接口（导航切换、窗口操作等）
  - 编写完整的TypeScript类型定义
- **Acceptance Criteria Addressed**: [AC-4, AC-5]
- **Test Requirements**:
  - `programmatic` TR-2.1: TypeScript类型定义完整，无类型错误
  - `human-judgement` TR-2.2: 接口设计合理，易于使用和扩展
- **Notes**: 参考现有SidebarLayout组件的接口设计

## [x] Task 3: 实现公共窗口组件 - 顶部标题栏
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 实现顶部标题栏的固定高度、背景色、字体规范
  - 实现窗口控制按钮（最小化/最大化/关闭）的位置/尺寸/交互
  - 实现图标与标题的间距规范
  - 支持自定义标题文本+图标
  - 支持右上角自定义操作按钮
- **Acceptance Criteria Addressed**: [AC-2, AC-4]
- **Test Requirements**:
  - `programmatic` TR-3.1: 顶部标题栏样式符合全局设计Token
  - `human-judgement` TR-3.2: 窗口控制按钮交互正常
- **Notes**: 参考现有DesktopAppContainer组件的标题栏实现

## [x] Task 4: 实现公共窗口组件 - 左侧导航栏
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 实现左侧导航栏的固定宽度、背景色
  - 实现菜单项的高度/字体/间距规范
  - 实现选中态/hover态/禁用态的视觉样式
  - 实现滚动条规范
  - 支持导航菜单数据源配置（图标、文本、跳转标识、禁用状态、高亮状态）
  - 支持菜单层级（一级/二级菜单）
- **Acceptance Criteria Addressed**: [AC-2, AC-4]
- **Test Requirements**:
  - `programmatic` TR-4.1: 左侧导航栏样式符合全局设计Token
  - `human-judgement` TR-4.2: 导航菜单交互正常，支持选中、hover、禁用状态
- **Notes**: 参考现有SidebarLayout组件的导航栏实现

## [x] Task 5: 实现公共窗口组件 - 右侧内容主体区
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 实现内容主体区的固定内边距、背景色
  - 实现滚动条样式
  - 实现内容区最小/最大宽度适配规范
  - 支持自定义内容插槽
- **Acceptance Criteria Addressed**: [AC-2, AC-4]
- **Test Requirements**:
  - `programmatic` TR-5.1: 内容主体区样式符合全局设计Token
  - `human-judgement` TR-5.2: 内容插槽正常工作，支持传入任意业务内容
- **Notes**: 确保内容区域有足够的弹性，适应不同应用的需求

## [x] Task 6: 整合公共窗口组件并完善文档
- **Priority**: P0
- **Depends On**: Task 3, Task 4, Task 5
- **Description**: 
  - 整合顶部标题栏、左侧导航栏、右侧内容主体区为完整组件
  - 实现组件的三段式固定结构
  - 编写完整的组件注释
  - 编写使用示例和文档
- **Acceptance Criteria Addressed**: [AC-1, AC-4, AC-5]
- **Test Requirements**:
  - `programmatic` TR-6.1: 组件完整集成，三段式结构正常工作
  - `human-judgement` TR-6.2: 组件注释完整，使用文档清晰
- **Notes**: 确保组件易于使用，文档详细

## [x] Task 7: 重构数据中心应用（DataCenterApp）
- **Priority**: P1
- **Depends On**: Task 6
- **Description**: 
  - 移除DataCenterApp中重复的布局、样式代码
  - 基于公共组件重构DataCenterApp
  - 只保留业务相关的配置项与个性化内容
  - 确保重构后功能完全正常
- **Acceptance Criteria Addressed**: [AC-2, AC-3]
- **Test Requirements**:
  - `programmatic` TR-7.1: 数据中心应用功能完全正常
  - `human-judgement` TR-7.2: 数据中心应用视觉符合统一规范
- **Notes**: 确保业务逻辑不受影响

## [x] Task 8: 重构应用中心应用（AppStore）
- **Priority**: P1
- **Depends On**: Task 6
- **Description**: 
  - 移除AppStore中重复的布局、样式代码
  - 基于公共组件重构AppStore
  - 只保留业务相关的配置项与个性化内容
  - 确保重构后功能完全正常
- **Acceptance Criteria Addressed**: [AC-2, AC-3]
- **Test Requirements**:
  - `programmatic` TR-8.1: 应用中心应用功能完全正常
  - `human-judgement` TR-8.2: 应用中心应用视觉符合统一规范
- **Notes**: 确保业务逻辑不受影响

## [x] Task 9: 重构游戏发布应用（GameReleaseApp）
- **Priority**: P1
- **Depends On**: Task 6
- **Description**: 
  - 移除GameReleaseApp中重复的布局、样式代码
  - 基于公共组件重构GameReleaseApp
  - 只保留业务相关的配置项与个性化内容
  - 确保重构后功能完全正常
- **Acceptance Criteria Addressed**: [AC-2, AC-3]
- **Test Requirements**:
  - `programmatic` TR-9.1: 游戏发布应用功能完全正常
  - `human-judgement` TR-9.2: 游戏发布应用视觉符合统一规范
- **Notes**: 确保业务逻辑不受影响

## [x] Task 10: 统一代码质量检查和测试
- **Priority**: P2
- **Depends On**: Task 7, Task 8, Task 9
- **Description**: 
  - 运行ESLint检查，确保所有代码符合规范
  - 运行TypeScript类型检查，确保无类型错误
  - 运行测试，确保所有功能正常
  - 清理冗余的样式和布局代码
- **Acceptance Criteria Addressed**: [AC-3, AC-5, AC-6]
- **Test Requirements**:
  - `programmatic` TR-10.1: ESLint检查通过，无错误
  - `programmatic` TR-10.2: TypeScript类型检查通过，无错误
  - `programmatic` TR-10.3: 所有测试通过
- **Notes**: 确保最终代码质量高，无冗余代码

## [x] Task 11: 最终验收和文档更新
- **Priority**: P2
- **Depends On**: Task 10
- **Description**: 
  - 对比3个应用的视觉、布局、交互是否完全统一
  - 验证新增应用接入是否便捷
  - 更新项目文档，记录公共组件的使用方法
- **Acceptance Criteria Addressed**: [AC-1, AC-2]
- **Test Requirements**:
  - `human-judgement` TR-11.1: 3个应用视觉、布局、交互完全统一
  - `human-judgement` TR-11.2: 公共组件文档完整，易于理解
- **Notes**: 确保最终成果符合所有验收标准
