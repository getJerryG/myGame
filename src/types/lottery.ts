// 抽奖系统类型定义

export interface LotteryDrawResult {
  id: string;
  prizeId: string;
  prizeName: string;
  prizeType: 'skin' | 'currency' | 'item';
  prizeValue: number | string;
  timestamp: Date;
  isSpecial: boolean;
}

export interface LotteryPrize {
  id: string;
  name: string;
  type: 'skin' | 'currency' | 'item';
  value: number | string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  probability: number;
  imageUrl: string;
}

export interface LotteryRotation {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  prizes: LotteryPrize[];
}

export interface LotteryStorageItem {
  id: string;
  prizeId: string;
  prizeName: string;
  prizeType: 'skin' | 'currency' | 'item';
  prizeValue: number | string;
  acquiredAt: Date;
  isUsed: boolean;
}

export interface LotteryDrawCount {
  totalDraws: number;
  consecutiveDraws: number;
  lastDrawDate: Date;
}

export interface LotteryState {
  currentRotationId: string;
  freeDrawRemaining: number;
  freeDrawCooldown: number;
  totalDraws: number;
  storage: LotteryStorageItem[];
  recentResults: LotteryDrawResult[];
}
