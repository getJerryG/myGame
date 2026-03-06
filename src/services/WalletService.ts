// 交易记录类型
export interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
}

// 余额详情类型
export interface BalanceDetails {
  available: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

// 钱包服务类
export class WalletService {
  // 获取模拟交易记录
  static getTransactionHistory(): Transaction[] {
    return [
      {
        id: 1,
        type: "收入",
        amount: 5000,
        date: "2026-02-03 10:00",
      },
      {
        id: 2,
        type: "支出",
        amount: -2000,
        date: "2026-02-02 15:30",
      },
      {
        id: 3,
        type: "收入",
        amount: 8000,
        date: "2026-02-01 09:15",
      },
    ];
  }

  // 计算余额详情
  static getBalanceDetails(gameData: any, appBalance: number): BalanceDetails {
    const availableBalance = gameData?.gameState?.plannerFunds || appBalance;
    const monthlyIncome = gameData?.businessData?.totalRevenue || 0;
    const monthlyExpense = 0; // 目前固定为0，后续可从gameData获取

    return {
      available: availableBalance,
      monthlyIncome,
      monthlyExpense
    };
  }

  // 格式化交易金额
  static formatAmount(amount: number): string {
    const prefix = amount >= 0 ? '+' : '';
    return `${prefix}${amount}`;
  }

  // 获取交易类型样式
  static getTransactionTypeClass(type: string): string {
    return type === '收入' ? 'positive' : 'negative';
  }

  // 生成新的交易记录
  static addTransaction(type: string, amount: number): Transaction {
    return {
      id: Date.now(),
      type,
      amount,
      date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
  }
}
