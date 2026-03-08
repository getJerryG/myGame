// 定义抽奖相关类型
export interface Prize {
  icon: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  probability: number;
}

export interface DrawHistoryItem {
  prize: { icon: string; name: string };
  time: string;
}

export interface LotteryState {
  tickets: number;
  isSpinning: boolean;
  currentIndex: number;
  lastPrize: { icon: string; name: string } | null;
}

export interface LotteryConfig {
  prizes: Prize[];
  initialTickets: number;
}

// 定义抽奖服务类
export class LotteryService {
  private prizes: Prize[];
  private tickets: number;
  private drawHistory: DrawHistoryItem[];

  constructor(config: LotteryConfig) {
    this.prizes = config.prizes;
    this.tickets = config.initialTickets;
    this.drawHistory = [];
  }

  // 获取奖品列表
  public getPrizes(): Prize[] {
    return [...this.prizes];
  }

  // 获取抽奖记录
  public getDrawHistory(): DrawHistoryItem[] {
    return [...this.drawHistory];
  }

  // 获取当前抽奖券数量
  public getTickets(): number {
    return this.tickets;
  }

  // 开始抽奖
  public async startDraw(): Promise<{
    selectedPrize: Prize;
    spinCount: number;
  }> {
    if (this.tickets <= 0) {
      throw new Error('抽奖券不足');
    }

    // 消耗抽奖券
    this.tickets--;

    // 模拟抽奖过程
    const spinCount = 20 + Math.floor(Math.random() * 10);
    
    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, spinCount * 100));

    // 确定奖品
    const selectedPrize = this.determinePrize();

    // 添加到历史记录
    this.drawHistory.unshift({
      prize: selectedPrize,
      time: new Date().toLocaleString('zh-CN'),
    });

    return { selectedPrize, spinCount };
  }

  // 确定奖品
  private determinePrize(): Prize {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    let selectedPrize = this.prizes[0];

    for (const prize of this.prizes) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability) {
        selectedPrize = prize;
        break;
      }
    }

    return selectedPrize;
  }

  // 购买抽奖券
  public buyTickets(amount: number): void {
    if (amount <= 0) {
      throw new Error('购买数量必须大于0');
    }
    this.tickets += amount;
  }

  // 获取稀有度标签
  public getRarityLabel(rarity: string): string {
    const rarityMap: Record<string, string> = {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说',
    };
    return rarityMap[rarity] || '未知';
  }

  // 获取转盘项目样式
  public getWheelItemStyle(index: number, totalItems: number): Record<string, string> {
    const angle = (360 / totalItems) * index;
    return {
      transform: `rotate(${angle}deg) translateY(-120px)`,
    };
  }
}

// 默认奖品配置
const defaultPrizes: Prize[] = [
  { icon: '💎', name: '钻石x1000', rarity: 'legendary', probability: 1 },
  { icon: '👑', name: '皇冠', rarity: 'epic', probability: 5 },
  { icon: '💰', name: '金币x500', rarity: 'rare', probability: 15 },
  { icon: '🎁', name: '神秘礼包', rarity: 'rare', probability: 20 },
  { icon: '⭐', name: '星星x50', rarity: 'common', probability: 25 },
  { icon: '💎', name: '钻石x100', rarity: 'common', probability: 34 },
];

// 创建并导出抽奖服务实例
export const lotteryService = new LotteryService({
  prizes: defaultPrizes,
  initialTickets: 10,
});