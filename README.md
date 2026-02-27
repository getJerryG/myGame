# 游戏项目开发文档

## 项目简介

这是一个游戏开发项目，包含游戏核心逻辑、UI组件、状态管理等模块。项目使用Vue 3框架开发，采用现代化的前端技术栈。

## 技术栈

- **框架**：Vue 3
- **构建工具**：Vite
- **包管理器**：pnpm
- **编程语言**：JavaScript/TypeScript
- **状态管理**：Pinia
- **路由**：Vue Router

## 项目结构

```
myGame/
├── src/
│   ├── assets/          # 静态资源文件
│   ├── components/      # Vue组件
│   │   ├── sections/    # 页面区块组件
│   │   └── simulation/  # 模拟相关组件
│   ├── constants/       # 常量定义
│   ├── generators/      # 生成器
│   ├── managers/        # 管理器
│   ├── models/          # 数据模型
│   ├── router/          # 路由配置
│   ├── stores/          # 状态管理
│   ├── styles/          # 样式文件
│   ├── utils/           # 工具函数
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   ├── RootApp.vue      # 应用根组件
│   └── style.css        # 全局样式
├── docs/                # 文档目录
├── dist/                # 构建输出目录
├── node_modules/        # 依赖包
├── scripts/             # 脚本文件
├── index.html           # HTML模板
├── package.json         # 项目配置
├── pnpm-lock.yaml       # 依赖锁定文件
└── vite.config.ts       # Vite配置
```

## 安装和运行

### 安装依赖

```bash
pnpm install
```

### 开发模式运行

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

## 核心功能模块

### 1. 游戏模型

- **Character.js**：角色基类，定义了角色的基本属性和方法
- **Player.js**：玩家角色类，继承自Character
- **Monster.js**：怪物角色类，继承自Character
- **Simulation.js**：游戏模拟核心类，负责处理游戏的核心逻辑和数据变化

### 2. UI组件

- **BattleUI.vue**：战斗界面组件
- **CharacterInfo.vue**：角色信息组件
- **LotteryPage.vue**：抽奖页面组件
- **SimulationPanel.vue**：模拟面板组件
- **WorldMap.vue**：世界地图组件

### 3. 状态管理

- **battleStore.js**：战斗状态管理
- **gameStore.js**：游戏状态管理
- **lotteryStore.js**：抽奖状态管理
- **mapStore.js**：地图状态管理
- **playerStore.js**：玩家状态管理

## 开发文档

### API文档

项目使用JSDoc注释生成API文档，核心模块的API文档如下：

- **Character API**：角色基类的API文档
- **Player API**：玩家角色的API文档
- **Simulation API**：游戏模拟的API文档

### 设计文档

- **GAME_UI_DESIGN.md**：游戏UI设计文档

## 贡献指南

1. 克隆项目到本地
2. 创建分支进行开发
3. 提交代码前运行测试
4. 提交Pull Request

## 许可证

MIT License
