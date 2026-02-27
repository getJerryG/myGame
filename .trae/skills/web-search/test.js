/**
 * 网页搜索技能测试文件
 */

import { webSearch } from './index.js';

/**
 * 测试网页搜索技能
 */
async function testWebSearch() {
  console.log('=== 网页搜索技能测试开始 ===\n');

  try {
    // 测试用例1: 基本搜索
    console.log('测试用例1: 基本搜索');
    const result1 = await webSearch({
      query: 'Microsoft Copilot Platform',
    });
    console.log('结果:', JSON.stringify(result1, null, 2));
    console.log('测试通过: 基本搜索功能正常\n');

    // 测试用例2: 指定结果数量
    console.log('测试用例2: 指定结果数量');
    const result2 = await webSearch({
      query: 'JavaScript',
      numResults: 3,
    });
    console.log('结果:', JSON.stringify(result2, null, 2));
    if (result2.results.length === 3) {
      console.log('测试通过: 结果数量符合预期\n');
    } else {
      console.log('测试失败: 结果数量不符合预期\n');
    }

    // 测试用例3: 验证结果格式
    console.log('测试用例3: 验证结果格式');
    const result3 = await webSearch({
      query: 'Node.js',
      numResults: 2,
    });

    const hasRequiredFields = result3.results.every((result) => {
      return result.rank && result.title && result.url && result.snippet;
    });

    if (hasRequiredFields) {
      console.log('测试通过: 结果格式符合预期\n');
    } else {
      console.log('测试失败: 结果格式不符合预期\n');
    }

    console.log('=== 网页搜索技能测试完成 ===');
    console.log('所有测试用例执行完毕');
  } catch (error) {
    console.error('测试失败:', error.message);
    console.log('=== 网页搜索技能测试失败 ===');
  }
}

// 执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testWebSearch();
}

export { testWebSearch };
