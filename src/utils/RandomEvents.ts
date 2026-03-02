/**
 * 随机事件系统
 * 用于每两周为每个职业推荐强度英雄
 */

import skinSimulationConfig from "../config/SkinSimulateConfig";

// 随机事件类型
export enum RandomEventType {
  HERO_STRENGTH_RECOMMENDATION = "hero_strength_recommendation",
  MARKET_TREND_CHANGE = "market_trend_change",
  COMMUNITY_EVENT = "community_event",
}

// 随机事件数据结构
export interface RandomEventData {
  id: string;
  type: RandomEventType;
  title: string;
  description: string;
  profession: string;
  strengthScore: number;
  reason: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isRead: boolean;
}

// 随机事件配置
export interface RandomEventConfig {
  intervalDays: number;
  recommendProfessionCount: number;
  strengthRange: { min: number; max: number };
  professions: string[];
  eventDurations: Record<string, number>;
}

// 默认事件配置
const defaultEventConfig: RandomEventConfig = {
  intervalDays: skinSimulationConfig.randomEvents.intervalDays,
  recommendProfessionCount:
    skinSimulationConfig.randomEvents.recommendProfessionCount,
  strengthRange: skinSimulationConfig.randomEvents.strengthRange,
  professions: skinSimulationConfig.professions,
  eventDurations: {
    heroStrengthRecommendation:
      skinSimulationConfig.randomEvents.intervalDays * 24 * 60 * 60 * 1000, // 事件持续时间与间隔相同
  },
};

// 推荐理由模板
const RecommendationReasons = [
  "版本强势英雄，出场率极高",
  "操作简单易上手，适合新手玩家",
  "团战能力出色，能改变战局走向",
  "对线能力强劲，压制力十足",
  "打野效率高，节奏带动能力强",
  "辅助能力全面，保护队友出色",
  "坦克身板硬朗，能承受大量伤害",
  "法师爆发伤害高，秒人能力强",
  "射手持续输出稳定，后期核心",
  "刺客机动性强，收割能力出色",
];

// 生成随机ID
const generateId = (): string => {
  return `event-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// 生成随机强度评分
const generateRandomStrength = (min: number, max: number): number => {
  return Number((Math.random() * (max - min) + min).toFixed(1));
};

// 从数组中随机选择一个元素
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// 本地存储键
const RandomEventsStorageKey = "random-events";

// 从本地存储获取随机事件
const getRandomEventsFromStorage = (): RandomEventData[] => {
  try {
    const eventsJson = localStorage.getItem(RandomEventsStorageKey);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch {
    return [];
  }
};

// 保存随机事件到本地存储
const saveRandomEventsToStorage = (events: RandomEventData[]): void => {
  try {
    localStorage.setItem(RandomEventsStorageKey, JSON.stringify(events));
  } catch {
    // console.error("Failed to save random events to storage:", error);
  }
};

// 处理过期事件
const processExpiredEvents = (): RandomEventData[] => {
  const now = new Date().toISOString();
  const events = getRandomEventsFromStorage();

  // 更新过期事件状态
  const updatedEvents = events.map((event) => {
    if (event.isActive && event.endDate < now) {
      return { ...event, isActive: false };
    }
    return event;
  });

  // 如果有变化，保存到本地存储
  if (JSON.stringify(updatedEvents) !== JSON.stringify(events)) {
    saveRandomEventsToStorage(updatedEvents);
  }

  return updatedEvents;
};

// 获取当前活跃事件
const getActiveEvents = (): RandomEventData[] => {
  const events = processExpiredEvents();
  return events.filter((event) => event.isActive);
};

// 生成英雄强度推荐事件
const generateHeroStrengthRecommendationEvent = (
  profession: string,
  eventDuration: number,
): RandomEventData => {
  const now = new Date();
  const startDate = now.toISOString();
  const endDate = new Date(now.getTime() + eventDuration).toISOString();

  return {
    id: generateId(),
    type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
    title: `${profession}英雄强度推荐`,
    description: `当前版本${profession}英雄强度推荐，请查看详情了解推荐理由`,
    profession,
    strengthScore: generateRandomStrength(
      defaultEventConfig.strengthRange.min,
      defaultEventConfig.strengthRange.max,
    ),
    reason: getRandomElement(RecommendationReasons),
    createdAt: now.toISOString(),
    startDate,
    endDate,
    isActive: true,
    isRead: false,
  };
};

// 更新每两周的英雄强度推荐
const updateBiweeklyHeroStrengthRecommendations = (): void => {
  const events = processExpiredEvents();
  const now = new Date();

  // 检查是否需要生成新事件
  const lastEvent = events
    .filter(
      (event) => event.type === RandomEventType.HERO_STRENGTH_RECOMMENDATION,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

  // 计算是否需要生成新事件
  let shouldGenerateNewEvents = !lastEvent;
  if (!shouldGenerateNewEvents) {
    // 计算距离上次事件的天数
    const daysSinceLastEvent = Math.ceil(
      (now.getTime() - new Date(lastEvent.createdAt).getTime()) /
        (1000 * 3600 * 24),
    );
    shouldGenerateNewEvents =
      daysSinceLastEvent >= defaultEventConfig.intervalDays;
  }

  if (!shouldGenerateNewEvents) {
    return;
  }

  // 生成新事件
  const newEvents: RandomEventData[] = [];
  const selectedProfessions = new Set<string>();

  // 选择要推荐的职业
  while (
    selectedProfessions.size < defaultEventConfig.recommendProfessionCount
  ) {
    const randomProfession = getRandomElement(defaultEventConfig.professions);
    selectedProfessions.add(randomProfession);
  }

  // 为每个选定的职业生成事件
  for (const profession of selectedProfessions) {
    const event = generateHeroStrengthRecommendationEvent(
      profession,
      defaultEventConfig.eventDurations[
        RandomEventType.HERO_STRENGTH_RECOMMENDATION
      ],
    );
    newEvents.push(event);
  }

  // 保存新事件
  const updatedEvents = [...events, ...newEvents];
  saveRandomEventsToStorage(updatedEvents);

  // console.log("Generated new hero strength recommendation events:", newEvents);
};

/**
 * 获取最新的英雄强度推荐
 */
export const getLatestHeroStrengthRecommendations = (): RandomEventData[] => {
  // 确保事件系统已更新
  updateBiweeklyHeroStrengthRecommendations();

  // 获取所有活跃的英雄强度推荐事件
  const activeEvents = getActiveEvents();
  return activeEvents.filter(
    (event) => event.type === RandomEventType.HERO_STRENGTH_RECOMMENDATION,
  );
};

/**
 * 激活事件
 * @param eventId 事件ID
 */
export const activateEvent = (eventId: string): void => {
  const events = processExpiredEvents();
  const updatedEvents = events.map((event) => {
    if (event.id === eventId) {
      return { ...event, isActive: true };
    }
    return event;
  });
  saveRandomEventsToStorage(updatedEvents);
};

/**
 * 停用事件
 * @param eventId 事件ID
 */
export const deactivateEvent = (eventId: string): void => {
  const events = processExpiredEvents();
  const updatedEvents = events.map((event) => {
    if (event.id === eventId) {
      return { ...event, isActive: false };
    }
    return event;
  });
  saveRandomEventsToStorage(updatedEvents);
};

/**
 * 删除事件
 * @param eventId 事件ID
 */
export const deleteEvent = (eventId: string): void => {
  const events = processExpiredEvents();
  const updatedEvents = events.filter((event) => event.id !== eventId);
  saveRandomEventsToStorage(updatedEvents);
};

/**
 * 标记事件为已读
 * @param eventId 事件ID
 */
export const markEventAsRead = (eventId: string): void => {
  const events = processExpiredEvents();
  const updatedEvents = events.map((event) => {
    if (event.id === eventId) {
      return { ...event, isRead: true };
    }
    return event;
  });
  saveRandomEventsToStorage(updatedEvents);
};

/**
 * 批量生成测试事件
 * @param count 事件数量
 */
export const batchGenerateTestEvents = (count: number): void => {
  const events = processExpiredEvents();
  const newEvents: RandomEventData[] = [];

  for (let i = 0; i < count; i++) {
    const profession = getRandomElement(defaultEventConfig.professions);
    const event = generateHeroStrengthRecommendationEvent(
      profession,
      defaultEventConfig.eventDurations[
        RandomEventType.HERO_STRENGTH_RECOMMENDATION
      ],
    );
    newEvents.push(event);
  }

  const updatedEvents = [...events, ...newEvents];
  saveRandomEventsToStorage(updatedEvents);

  // console.log(`Generated ${count} test events`);
};

/**
 * 清除所有事件
 */
export const clearAllEvents = (): void => {
  localStorage.removeItem(RANDOM_EVENTS_STORAGE_KEY);
  // console.log("Cleared all random events");
};

/**
 * 模拟过去的事件（用于测试）
 * @param count 事件数量
 */
export const simulatePastEvents = (count: number): void => {
  const events = processExpiredEvents();
  const newEvents: RandomEventData[] = [];

  for (let i = 0; i < count; i++) {
    const profession = getRandomElement(defaultEventConfig.professions);
    const now = new Date();
    // 随机生成过去的日期
    const pastDate = new Date(
      now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    );
    const eventDuration =
      defaultEventConfig.eventDurations[
        RandomEventType.HERO_STRENGTH_RECOMMENDATION
      ];

    const event = {
      id: generateId(),
      type: RandomEventType.HERO_STRENGTH_RECOMMENDATION,
      title: `${profession}英雄强度推荐`,
      description: `当前版本${profession}英雄强度推荐，请查看详情了解推荐理由`,
      profession,
      strengthScore: generateRandomStrength(
        defaultEventConfig.strengthRange.min,
        defaultEventConfig.strengthRange.max,
      ),
      reason: getRandomElement(RecommendationReasons),
      createdAt: pastDate.toISOString(),
      startDate: pastDate.toISOString(),
      endDate: new Date(pastDate.getTime() + eventDuration).toISOString(),
      isActive: false, // 过去的事件已过期
      isRead: Math.random() > 0.5, // 随机标记为已读或未读
    };

    newEvents.push(event);
  }

  const updatedEvents = [...events, ...newEvents];
  saveRandomEventsToStorage(updatedEvents);

  // console.log(`Generated ${count} past events`);
};

/**
 * 导出随机事件管理对象
 */
export const randomEventsManager = {
  getLatestHeroStrengthRecommendations,
  activateEvent,
  deactivateEvent,
  deleteEvent,
  markEventAsRead,
  batchGenerateTestEvents,
  clearAllEvents,
  simulatePastEvents,
};
