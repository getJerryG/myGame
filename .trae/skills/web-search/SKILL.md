# 网页搜索技能

## 技能名称
web-search

## 技能描述
基于MCP（Microsoft Copilot Platform）的网页搜索技能，能够接收用户的搜索查询，通过可靠的网页搜索API执行搜索操作，并以结构化、易读的格式返回相关搜索结果。

## 核心功能
1. 用户查询接收与解析
2. 网页搜索执行
3. 结果过滤与排序
4. 结果格式化展示

## 参数
| 参数名 | 类型 | 描述 | 必填 |
|--------|------|------|------|
| query | string | 用户的搜索查询 | 是 |
| numResults | number | 返回结果数量，默认5 | 否 |

## 返回值
| 字段名 | 类型 | 描述 |
|--------|------|------|
| results | array | 搜索结果数组 |
| query | string | 搜索查询 |
| totalResults | number | 返回结果数量 |

### 搜索结果项
| 字段名 | 类型 | 描述 |
|--------|------|------|
| title | string | 搜索结果标题 |
| url | string | 搜索结果URL |
| snippet | string | 搜索结果摘要 |
| rank | number | 搜索结果排名 |

## 示例

### 请求
```json
{
  "query": "Microsoft Copilot Platform",
  "numResults": 3
}
```

### 响应
```json
{
  "query": "Microsoft Copilot Platform",
  "totalResults": 3,
  "results": [
    {
      "rank": 1,
      "title": "Microsoft Copilot Platform - Microsoft Learn",
      "url": "https://learn.microsoft.com/en-us/copilot-platform/",
      "snippet": "Microsoft Copilot Platform is a comprehensive platform for building, deploying, and managing AI-powered copilots."
    },
    {
      "rank": 2,
      "title": "Microsoft Copilot Platform Documentation",
      "url": "https://docs.microsoft.com/en-us/copilot-platform/",
      "snippet": "Explore documentation, tutorials, and API references for the Microsoft Copilot Platform."
    },
    {
      "rank": 3,
      "title": "Getting Started with Microsoft Copilot Platform",
      "url": "https://learn.microsoft.com/en-us/copilot-platform/get-started",
      "snippet": "Learn how to get started with the Microsoft Copilot Platform and build your first copilot."
    }
  ]
}
```

## 开发规范
1. 符合MCP平台的开发规范和安全要求
2. 实现高效的搜索结果获取与呈现流程
3. 确保搜索结果的准确性和相关性
4. 提供清晰、结构化的返回数据格式
5. 遵循项目的代码风格和命名规范

## 安全要求
1. 不泄露用户的搜索查询和个人信息
2. 不执行恶意搜索操作
3. 对搜索结果进行适当的过滤和验证
4. 遵循相关的隐私法规和政策