---
name: "js-doc-generator"
description: "用于生成详细的JavaScript/TypeScript文档注释（JSDoc），包括函数/类的用途说明、参数类型及描述、返回值类型及说明、异常情况说明和示例用法等关键信息，提升代码的可读性和可维护性。"
---

# JS文档生成技能

## 功能介绍

该技能用于自动生成符合JSDoc标准的JavaScript/TypeScript文档注释，帮助开发者提高代码的可读性和可维护性。

### 核心功能

1. **函数文档生成**
   - 生成函数用途说明
   - 生成参数类型及描述
   - 生成返回值类型及说明
   - 生成异常情况说明
   - 生成示例用法

2. **类文档生成**
   - 生成类的用途说明
   - 生成类的属性文档
   - 生成类的方法文档
   - 生成类的构造函数文档

3. **模块文档生成**
   - 生成模块用途说明
   - 生成模块导出内容说明

4. **TypeScript支持**
   - 支持TypeScript类型语法
   - 支持泛型类型文档
   - 支持接口和类型别名文档

## 使用指南

### 何时调用

- 当需要为JavaScript/TypeScript代码添加文档注释时
- 当代码缺少或需要更新文档注释时
- 当需要确保文档注释符合JSDoc标准时

### 调用方式

直接使用 `js-doc-generator` 技能，后跟需要生成文档的代码或文件路径。

## 示例

### 示例 1：为函数生成文档

```
js-doc-generator <<EOF
function calculateTotal(prices, discount = 0) {
  return prices.reduce((total, price) => total + price, 0) * (1 - discount);
}
EOF
```

输出：
```javascript
/**
 * 计算商品总价，支持折扣
 * 
 * @param {number[]} prices - 商品价格数组
 * @param {number} [discount=0] - 折扣比例（0-1之间）
 * @returns {number} 计算后的总价
 * @example
 * // 计算总价
 * calculateTotal([100, 200, 300]); // 返回 600
 * 
 * // 计算总价并应用10%折扣
 * calculateTotal([100, 200, 300], 0.1); // 返回 540
 */
function calculateTotal(prices, discount = 0) {
  return prices.reduce((total, price) => total + price, 0) * (1 - discount);
}

// 单行注释示例
/** 这是一个单行注释 */
const singleLineComment = "示例";
```

### 示例 2：为类生成文档

```
js-doc-generator <<EOF
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.isActive = true;
  }
  
  sendEmail(subject, content) {
    console.log(`Sending email to ${this.email} with subject: ${subject}`);
  }
  
  deactivate() {
    this.isActive = false;
  }
}
EOF
```

输出：
```javascript
/**
 * 用户管理
 */
class User {
  /** 姓名 */
  name;
  
  /** 邮箱地址 */
  email;
  
  /** 是否激活 */
  isActive;
  
  /**
   * 创建用户实例
   * 
   * @param {string} name - 姓名
   * @param {string} email - 邮箱地址
   * @example
   * // 创建新用户
   * const user = new User('John Doe', 'john@example.com');
   */
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.isActive = true;
  }
  
  /**
   * 发送邮件
   * 
   * @param {string} subject - 主题
   * @param {string} content - 内容
   * @example
   * // 发送邮件
   * user.sendEmail('Welcome', 'Thank you for joining our service!');
   */
  sendEmail(subject, content) {
    console.log(`Sending email to ${this.email} with subject: ${subject}`);
  }
  
  /**
   * 停用账号
   * 
   * @example
   * // 停用用户
   * user.deactivate();
   */
  deactivate() {
    this.isActive = false;
  }
}
```

### 示例 3：为TypeScript接口生成文档

```
js-doc-generator <<EOF
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}
EOF
```

输出：
```typescript
/**
 * 产品属性定义
 */
interface Product {
  /** 唯一标识符 */
  id: string;
  
  /** 名称 */
  name: string;
  
  /** 价格 */
  price: number;
  
  /** 分类 */
  category: string;
  
  /** 是否有库存 */
  inStock: boolean;
}
```

### 示例 4：为指定目录下的所有文件生成文档

```
js-doc-generator /path/to/your/project
```

输出：
- 会在每个文件的顶部添加JSDoc注释
- 会在每个类、接口、函数等定义前添加JSDoc注释
- 会在每个参数、返回值、异常等定义前添加JSDoc注释

## JSDoc标准规范

### 1. 基本规范

- 所有文档注释使用`/** */`格式，不使用`//`或`/* */`
- 多行注释每行以`*`开头，保持对齐
- 单行注释使用`/** 注释内容 */`格式
- 注释内容与`/**`之间留一个空格
- 注释内容与`*/`之间留一个空格

### 2. 类文档规范

#### 2.1 类描述
- 简洁明了，说明类的主要用途
- 避免冗余，不需要包含"类"或"Class"字样

#### 2.2 类字段注释
- **简洁性原则**：对于已知类型的类，字段注释应直接使用字段名称作为描述，无需额外添加类名暗示的信息
- 例如：在Product类中，`name`字段注释为"名称"，而非"产品名称"
- 避免使用重复的类名前缀
- 对于复杂字段，可适当添加额外说明

#### 2.3 构造函数注释
- 描述构造函数的主要用途
- 清晰说明每个参数的类型和用途
- 提供使用示例

#### 2.4 方法注释
- 描述方法的主要功能
- 说明参数类型和用途
- 说明返回值类型和含义
- 描述可能抛出的异常
- 提供使用示例

### 3. 函数文档规范

- 描述函数的主要功能
- 说明参数类型和用途
- 说明返回值类型和含义
- 描述可能抛出的异常
- 提供使用示例
- 对于异步函数，使用`@async`标签
- 对于生成器函数，使用`@generator`标签

### 4. 支持的常用标签

- `@param` - 描述函数参数
- `@returns` - 描述函数返回值
- `@throws` - 描述函数可能抛出的异常
- `@example` - 提供使用示例
- `@typedef` - 定义类型
- `@interface` - 定义接口
- `@class` - 定义类
- `@module` - 定义模块
- `@exports` - 定义导出内容
- `@private` - 标记私有成员
- `@public` - 标记公共成员
- `@static` - 标记静态成员
- `@async` - 标记异步函数
- `@generator` - 标记生成器函数
- `@property` - 描述类的属性
- `@method` - 描述类的方法
- `@constructor` - 标记构造函数

### 5. 示例规范

- 示例应简洁明了
- 包含典型使用场景
- 说明预期结果
- 使用代码高亮

### 6. 简洁性原则示例

**❌ 不推荐（冗余）：**
```javascript
/**
 * 产品类
 */
class Product {
  /**
   * 产品唯一标识符
   */
  id: string;
  
  /**
   * 产品名称
   */
  name: string;
  
  /**
   * 产品价格
   */
  price: number;
}
```

**✅ 推荐（简洁）：**
```javascript
/**
 * 产品类
 */
class Product {
  /** 唯一标识符 */
  id: string;
  
  /** 名称 */
  name: string;
  
  /** 价格 */
  price: number;
  
  /** 分类 */
  category: string;
  
  /** 是否有库存 */
  inStock: boolean;
}
```

## 输出格式

生成的文档注释将直接插入到相应的代码上方，保持代码的原始结构不变。

## 支持的语言

- JavaScript
- TypeScript

## 注意事项

1. 生成的文档注释仅供参考，建议根据实际情况进行调整
2. 对于复杂的代码，可能需要手动补充或修改部分文档内容
3. 支持ES6+和TypeScript语法
4. 对于已经有文档注释的代码，会覆盖原有注释
5. 生成的文档注释遵循项目的代码风格和缩进习惯
6. 多行注释使用标准JSDoc格式（每行换行），单行注释使用`/** 唯一标识符 */`格式
7. 单行注释适用于简单的变量、常量或函数说明
8. 多行注释适用于复杂的函数、类、接口或模块说明