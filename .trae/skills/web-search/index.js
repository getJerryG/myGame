/**
 * 网页搜索技能实现
 * 基于MCP（Microsoft Copilot Platform）的网页搜索功能
 */

// 注意：在实际使用中，工具将通过MCP平台注入
// 实际部署时，将使用平台提供的search工具

/**
 * 网页搜索技能主函数
 * @param {Object} params - 搜索参数
 * @param {string} params.query - 用户的搜索查询
 * @param {number} [params.numResults=5] - 返回结果数量，默认5
 * @returns {Promise<Object>} 搜索结果
 */
async function webSearch(params) {
  try {
    // 1. 用户查询接收与解析
    const { query, numResults = 5 } = params;

    if (!query || typeof query !== 'string') {
      throw new Error('搜索查询不能为空，且必须为字符串类型');
    }

    if (typeof numResults !== 'number' || numResults < 1 || numResults > 50) {
      throw new Error('返回结果数量必须为1-50之间的数字');
    }

    // 2. 网页搜索执行
    // 注意：在实际部署时，将使用MCP平台提供的search工具执行真实搜索
    // 此处为本地测试，使用模拟数据
    const searchResults = await mockSearch(query, numResults);

    // 3. 结果过滤与排序
    const filteredResults = filterAndSortResults(searchResults);

    // 4. 结果格式化展示
    const formattedResults = formatResults(filteredResults, query);

    return formattedResults;
  } catch (error) {
    console.error('网页搜索技能执行失败:', error);
    throw new Error(`网页搜索失败: ${error.message}`);
  }
}

/**
 * 模拟搜索函数（实际部署时将替换为真实搜索API）
 * @param {string} query - 搜索查询
 * @param {number} num - 结果数量
 * @returns {Promise<Array>} 模拟搜索结果
 */
async function mockSearch(query, num) {
  // 模拟搜索结果
  const mockResults = [
    {
      title: `${query} - 维基百科`,
      url: `https://zh.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      snippet: `${query}（英语：${query}）是一个广泛使用的技术/概念。`,
      rank: 1,
    },
    {
      title: `${query} 官方网站`,
      url: `https://www.${query.toLowerCase().replace(/\s+/g, '')}.com`,
      snippet: `${query}官方网站，提供最新资讯、文档和下载。`,
      rank: 2,
    },
    {
      title: `${query} - 百度百科`,
      url: `https://baike.baidu.com/item/${encodeURIComponent(query)}`,
      snippet: `${query}是一种重要的技术/概念，具有广泛的应用场景。`,
      rank: 3,
    },
    {
      title: `${query} 教程`,
      url: `https://www.runoob.com/${query.toLowerCase().replace(/\s+/g, '')}/${query.toLowerCase().replace(/\s+/g, '')}-tutorial.html`,
      snippet: `零基础学习${query}，包含详细的教程和示例。`,
      rank: 4,
    },
    {
      title: `${query} GitHub`,
      url: `https://github.com/${query.toLowerCase().replace(/\s+/g, '')}`,
      snippet: `${query}的GitHub仓库，包含源代码和贡献指南。`,
      rank: 5,
    },
  ];

  // 返回指定数量的结果
  return mockResults.slice(0, num);
}

/**
 * 过滤和排序搜索结果
 * @param {Array} results - 原始搜索结果
 * @returns {Array} 过滤和排序后的结果
 */
function filterAndSortResults(results) {
  // 过滤掉无效结果
  const validResults = results.filter((result) => {
    return (
      result.title &&
      result.url &&
      (result.snippet || result.body || result.content)
    );
  });

  // 真实搜索结果通常已经按相关性排序，这里只需要确保过滤即可
  return validResults;
}

/**
 * 格式化搜索结果
 * @param {Array} results - 过滤和排序后的结果
 * @param {string} query - 搜索查询
 * @returns {Object} 格式化后的结果
 */
function formatResults(results, query) {
  const formattedResults = {
    query,
    totalResults: results.length,
    results: results.map((result, index) => ({
      rank: index + 1,
      title: result.title,
      url: result.url,
      snippet: result.snippet || result.body || result.content || '无摘要信息',
    })),
  };

  return formattedResults;
}

/**
 * 技能元数据
 */
const skillMetadata = {
  name: 'web-search',
  description:
    '基于MCP的网页搜索技能，能够接收用户的搜索查询，通过可靠的网页搜索API执行搜索操作，并以结构化、易读的格式返回相关搜索结果。',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '用户的搜索查询',
        required: true,
      },
      numResults: {
        type: 'number',
        description: '返回结果数量，默认5',
        minimum: 1,
        maximum: 50,
        default: 5,
      },
    },
  },
  returnType: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '搜索查询',
      },
      totalResults: {
        type: 'number',
        description: '返回结果数量',
      },
      results: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            rank: {
              type: 'number',
              description: '搜索结果排名',
            },
            title: {
              type: 'string',
              description: '搜索结果标题',
            },
            url: {
              type: 'string',
              description: '搜索结果URL',
            },
            snippet: {
              type: 'string',
              description: '搜索结果摘要',
            },
          },
        },
      },
    },
  },
};

export { webSearch, skillMetadata };
