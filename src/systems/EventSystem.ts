import type {
  SimulationEvent,
  SimulationState,
  SimulationEventOption,
  SimulationEventEffect,
  SimulationEventRequirement,
} from '../types/simulation';

// 导入事件相关类型
export type EventType =
  | 'market'
  | 'player'
  | 'system'
  | 'story'
  | 'random'
  | 'achievement';
export type EventCategory =
  | 'finance'
  | 'reputation'
  | 'popularity'
  | 'development'
  | 'player'
  | 'system'
  | 'story'
  | 'achievement';

// 事件系统类
export class EventSystem {
  private events: SimulationEvent[] = [];
  private activeEvents: Set<string> = new Set();
  private eventHistory: SimulationEvent[] = [];
  private eventHandlers: Map<
    EventType,
    Array<(event: SimulationEvent) => Promise<SimulationEventOption[]>>
  > = new Map();
  private state: SimulationState | null = null;
  private eventEffects: Map<string, SimulationEventEffect[]> = new Map(); // 存储事件效果
  private eventCategories: Map<EventCategory, EventType[]> = new Map(); // 事件分类映射

  // 初始化事件系统
  public init(state: SimulationState): void {
    this.state = state;
    this.events = [];
    this.activeEvents.clear();
    this.eventHistory = [];
    this.eventHandlers.clear();
    this.eventEffects.clear();

    // 初始化事件分类映射
    this.eventCategories.set('finance', ['market']);
    this.eventCategories.set('reputation', ['market', 'player']);
    this.eventCategories.set('popularity', ['player', 'system', 'random']);
    this.eventCategories.set('development', ['system', 'random']);
    this.eventCategories.set('player', ['player', 'story']);
    this.eventCategories.set('system', ['system']);
    this.eventCategories.set('story', ['story']);
    this.eventCategories.set('achievement', ['achievement']);
  }

  // 注册事件处理器
  public registerEventHandler(
    type: EventType,
    handler: (event: SimulationEvent) => Promise<SimulationEventOption[]>,
  ): void {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, []);
    }
    this.eventHandlers.get(type)?.push(handler);
  }

  // 移除事件处理器
  public removeEventHandler(
    type: EventType,
    handler: (event: SimulationEvent) => Promise<SimulationEventOption[]>,
  ): void {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // 生成随机事件
  public generateRandomEvent(): SimulationEvent | null {
    if (!this.state) return null;

    // 简单的事件生成逻辑，实际项目中可以根据游戏状态和概率生成更复杂的事件
    const eventTypes: EventType[] = ['market', 'random', 'system'];
    const randomType =
      eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomId = `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 随机选择事件分类
    const eventCategories: EventCategory[] = [
      'finance',
      'reputation',
      'popularity',
      'development',
      'player',
      'system',
      'story',
    ];
    const randomCategory =
      eventCategories[Math.floor(Math.random() * eventCategories.length)];

    // 生成事件对象
    const newEvent: SimulationEvent = {
      id: randomId,
      type: randomType,
      title: this.generateEventTitle(randomType),
      description: this.generateEventDescription(randomType),
      timestamp: { ...this.state.currentTime },
      impact: this.getRandomImpact(),
      isActive: true,
      durationDays: Math.floor(Math.random() * 7) + 1,
      effect: this.generateEventEffect(randomType),
      category: randomCategory,
      severity: this.getRandomSeverity(),
      options: this.generateEventOptions(randomType, randomCategory),
      effects: this.generateEventEffects(randomType, randomCategory),
      isResolved: false,
    };

    this.events.push(newEvent);
    this.activeEvents.add(newEvent.id);
    return newEvent;
  }

  // 生成事件标题
  private generateEventTitle(type: EventType): string {
    const titles: Record<EventType, string[]> = {
      market: ['市场波动', '竞争对手动作', '新市场机会'],
      player: ['玩家反馈', '玩家活动', '玩家需求'],
      system: ['系统更新', '技术问题', '维护通知'],
      story: ['剧情发展', '角色事件', '故事转折'],
      random: ['随机事件', '意外情况', '突发状况'],
      achievement: ['成就解锁', '里程碑达成', '荣誉获得'],
    };
    const typeTitles = titles[type];
    return typeTitles[Math.floor(Math.random() * typeTitles.length)];
  }

  // 生成事件描述
  private generateEventDescription(type: EventType): string {
    const descriptions: Record<EventType, string[]> = {
      market: [
        '市场出现了新的趋势，可能会影响你的产品销售。',
        '竞争对手发布了新产品，对你的市场份额造成了威胁。',
        '发现了新的市场机会，值得考虑投资。',
      ],
      player: [
        '收到了玩家的大量反馈，需要及时处理。',
        '玩家活动异常活跃，可能需要增加服务器资源。',
        '玩家提出了新的需求，值得考虑加入到产品中。',
      ],
      system: [
        '系统需要进行定期更新，可能会影响服务。',
        '发现了一个技术问题，需要紧急修复。',
        '即将进行系统维护，预计会有短暂的服务中断。',
      ],
      story: [
        '剧情进入了新的阶段，需要做出重要决策。',
        '角色遇到了困难，需要你的帮助。',
        '故事出现了转折，可能会影响后续发展。',
      ],
      random: [
        '发生了一件意外的事情，需要及时应对。',
        '出现了一个突发状况，需要快速决策。',
        '遇到了一个随机事件，结果难以预测。',
      ],
      achievement: [
        '恭喜你解锁了新的成就！',
        '你达成了一个重要的里程碑，值得庆祝。',
        '获得了一项荣誉，继续保持！',
      ],
    };
    const typeDescriptions = descriptions[type];
    return typeDescriptions[
      Math.floor(Math.random() * typeDescriptions.length)
    ];
  }

  // 获取随机影响程度
  private getRandomImpact(): 'low' | 'medium' | 'high' {
    const impacts: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const weights = [0.5, 0.3, 0.2]; // 权重：低50%，中30%，高20%

    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < impacts.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return impacts[i];
      }
    }
    return 'low';
  }

  // 获取随机严重程度
  private getRandomSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    const severities: Array<'low' | 'medium' | 'high' | 'critical'> = [
      'low',
      'medium',
      'high',
      'critical',
    ];
    const weights = [0.5, 0.3, 0.15, 0.05]; // 权重：低50%，中30%，高15%，严重5%

    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < severities.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return severities[i];
      }
    }
    return 'low';
  }

  // 生成事件选项
  private generateEventOptions(
    type: EventType,
    category: EventCategory,
  ): SimulationEventOption[] {
    const options: SimulationEventOption[] = [];
    const optionCount = Math.floor(Math.random() * 2) + 2; // 2-3个选项

    for (let i = 0; i < optionCount; i++) {
      const optionId = `option-${Date.now()}-${i}`;
      let optionText = '';
      let optionDescription = '';
      const optionEffects = this.generateEventEffectForOption(
        type,
        category,
        i,
      );
      const optionCost = this.generateOptionCost(type, category);

      // 根据选项索引生成不同的选项文本
      switch (i) {
        case 0:
          optionText = '积极应对';
          optionDescription =
            '采取积极措施应对该事件，可能会带来较好的结果，但需要一定的成本。';
          break;
        case 1:
          optionText = '消极应对';
          optionDescription =
            '采取保守措施应对该事件，成本较低，但可能效果不佳。';
          break;
        case 2:
          optionText = '忽略';
          optionDescription =
            '完全忽略该事件，没有成本，但可能会带来负面效果。';
          break;
      }

      options.push({
        id: optionId,
        text: optionText,
        description: optionDescription,
        effects: optionEffects,
        cost: optionCost,
        risk: this.generateOptionRisk(i),
        successRate: this.generateOptionSuccessRate(i),
      });
    }

    return options;
  }

  // 生成选项的事件效果
  private generateEventEffectForOption(
    _type: EventType,
    category: EventCategory,
    optionIndex: number,
  ): SimulationEventEffect[] {
    const effects: SimulationEventEffect[] = [];

    // 根据事件类型和分类生成不同的效果
    switch (category) {
      case 'finance':
        effects.push({
          type: 'money',
          value:
            optionIndex === 0
              ? Math.random() * 10000 + 5000
              : optionIndex === 1
                ? Math.random() * 5000
                : -Math.random() * 10000,
          isPermanent: true,
        });
        break;
      case 'reputation':
        effects.push({
          type: 'reputation',
          value:
            optionIndex === 0
              ? Math.random() * 20 + 10
              : optionIndex === 1
                ? Math.random() * 10
                : -Math.random() * 20,
          isPermanent: true,
        });
        break;
      case 'popularity':
        effects.push({
          type: 'popularity',
          value:
            optionIndex === 0
              ? Math.random() * 20 + 10
              : optionIndex === 1
                ? Math.random() * 10
                : -Math.random() * 20,
          isPermanent: true,
        });
        break;
      case 'development':
        effects.push({
          type: 'popularity',
          value:
            optionIndex === 0
              ? Math.random() * 15 + 5
              : optionIndex === 1
                ? Math.random() * 5
                : -Math.random() * 15,
          duration:
            optionIndex === 0
              ? Math.floor(Math.random() * 30) + 15
              : Math.floor(Math.random() * 10) + 5,
        });
        break;
    }

    return effects;
  }

  // 生成选项成本
  private generateOptionCost(
    type: EventType,
    _category: EventCategory,
  ): SimulationEventOption['cost'] | undefined {
    // 只有积极应对的选项有成本
    if (type === 'random' || type === 'system') {
      return {
        money: Math.floor(Math.random() * 5000) + 2000,
      };
    }
    return undefined;
  }

  // 生成选项风险
  private generateOptionRisk(optionIndex: number): number {
    // 选项索引越小，风险越高，但潜在回报也越高
    return optionIndex === 0
      ? Math.random() * 0.3 + 0.2
      : optionIndex === 1
        ? Math.random() * 0.2
        : Math.random() * 0.5 + 0.3;
  }

  // 生成选项成功率
  private generateOptionSuccessRate(optionIndex: number): number {
    // 选项索引越小，成功率越高
    return optionIndex === 0
      ? Math.random() * 0.2 + 0.8
      : optionIndex === 1
        ? Math.random() * 0.3 + 0.5
        : Math.random() * 0.4 + 0.3;
  }

  // 生成事件效果
  private generateEventEffects(
    type: EventType,
    _category: EventCategory,
  ): SimulationEventEffect[] {
    const effects: SimulationEventEffect[] = [];

    // 根据事件类型和分类生成不同的效果
    switch (type) {
      case 'market':
        effects.push({
          type: 'money',
          value: Math.random() * 10000 - 5000, // -5000 到 +5000
          isPermanent: true,
        });
        effects.push({
          type: 'reputation',
          value: Math.random() * 20 - 10, // -10 到 +10
          isPermanent: true,
        });
        break;
      case 'player':
        effects.push({
          type: 'popularity',
          value: Math.random() * 30 - 15, // -15 到 +15
          duration: Math.floor(Math.random() * 30) + 15, // 15-45天
        });
        break;
      case 'system':
        effects.push({
          type: 'popularity',
          value: Math.random() * 20 - 10, // -10 到 +10
          duration: Math.floor(Math.random() * 20) + 10, // 10-30天
        });
        break;
      case 'random':
        effects.push({
          type: ['money', 'reputation', 'popularity'][
            Math.floor(Math.random() * 3)
          ] as any,
          value: Math.random() * 50 - 25, // -25 到 +25
          duration: Math.floor(Math.random() * 30) + 10, // 10-40天
        });
        break;
    }

    return effects;
  }

  // 生成事件效果
  private generateEventEffect(type: EventType): string {
    const effects: Record<EventType, string[]> = {
      market: ['影响市场份额', '改变销售趋势', '影响产品定价'],
      player: ['影响玩家满意度', '改变玩家行为', '影响玩家留存'],
      system: ['影响系统性能', '改变服务质量', '影响用户体验'],
      story: ['推进剧情发展', '改变角色关系', '影响故事结局'],
      random: ['产生随机影响', '改变当前状态', '触发连锁反应'],
      achievement: ['解锁新内容', '获得奖励', '提升声望'],
    };
    const typeEffects = effects[type];
    return typeEffects[Math.floor(Math.random() * typeEffects.length)];
  }

  // 触发事件
  public async triggerEvent(
    event: SimulationEvent,
  ): Promise<SimulationEventOption[]> {
    const handlers = this.eventHandlers.get(event.type as EventType) || [];
    const results: SimulationEventOption[][] = [];

    for (const handler of handlers) {
      const result = await handler(event);
      results.push(result);
    }

    // 记录事件历史
    this.eventHistory.push({ ...event });

    // 返回所有选项的合并结果
    return results.flat();
  }

  // 处理事件选项选择
  public resolveEvent(
    eventId: string,
    optionId: string,
  ): { success: boolean; effects: SimulationEventEffect[]; message: string } {
    const event = this.events.find((e) => e.id === eventId);
    if (!event || event.isResolved || !event.isActive) {
      return {
        success: false,
        effects: [],
        message: '事件不存在或已解决',
      };
    }

    // 查找选择的选项
    const selectedOption = event.options.find(
      (option) => option.id === optionId,
    );
    if (!selectedOption) {
      return {
        success: false,
        effects: [],
        message: '选项不存在',
      };
    }

    // 检查选项要求
    if (selectedOption.requirements) {
      const requirementsMet = this.checkRequirements(
        selectedOption.requirements,
      );
      if (!requirementsMet) {
        return {
          success: false,
          effects: [],
          message: '不满足选项要求',
        };
      }
    }

    // 检查成功率
    let success = true;
    if (selectedOption.successRate !== undefined) {
      success = Math.random() <= selectedOption.successRate;
    }

    // 如果成功，应用选项效果
    let appliedEffects: SimulationEventEffect[] = [];
    if (success) {
      appliedEffects = this.applyEventEffects(selectedOption.effects);
    } else {
      // 如果失败，应用部分效果或负面效果
      appliedEffects = this.applyEventEffects(
        selectedOption.effects.map((effect) => ({
          ...effect,
          value: effect.value * 0.5, // 失败时效果减半或变为负面
        })),
      );
    }

    // 标记事件为已解决
    event.isResolved = true;
    event.isActive = false;
    event.resolutionTime = this.state?.currentTime;
    event.resolution = selectedOption.text;

    // 从活动事件中移除
    this.activeEvents.delete(event.id);

    return {
      success,
      effects: appliedEffects,
      message: success ? '事件处理成功' : '事件处理失败',
    };
  }

  // 检查选项要求
  private checkRequirements(
    requirements: SimulationEventRequirement[],
  ): boolean {
    if (!this.state) return false;

    for (const requirement of requirements) {
      let currentValue = 0;

      // 获取当前值
      switch (requirement.type) {
        case 'money':
          currentValue = this.state.stats.currentFunds;
          break;
        case 'reputation':
          // 假设reputation在stats中有记录
          currentValue = this.state.stats.currentLevel * 10;
          break;
        case 'popularity':
          // 假设popularity在stats中有记录
          currentValue = this.state.stats.currentLevel * 5;
          break;
        case 'level':
          currentValue = this.state.stats.currentLevel;
          break;
        case 'heroCount':
          // 假设heroCount在stats中有记录
          currentValue = this.state.stats.totalEvents;
          break;
        case 'skinCount':
          // 假设skinCount在stats中有记录
          currentValue = this.state.stats.totalDecisions;
          break;
      }

      // 检查要求
      switch (requirement.operator) {
        case '>=':
          if (currentValue < requirement.value) return false;
          break;
        case '<=':
          if (currentValue > requirement.value) return false;
          break;
        case '>':
          if (currentValue <= requirement.value) return false;
          break;
        case '<':
          if (currentValue >= requirement.value) return false;
          break;
        case '==':
          if (currentValue !== requirement.value) return false;
          break;
      }
    }

    return true;
  }

  // 应用事件效果
  private applyEventEffects(
    effects: SimulationEventEffect[],
  ): SimulationEventEffect[] {
    const appliedEffects: SimulationEventEffect[] = [];
    if (!this.state) return appliedEffects;

    for (const effect of effects) {
      // 根据效果类型应用不同的影响
      switch (effect.type) {
        case 'money':
          this.state.stats.currentFunds += effect.value;
          this.state.stats.totalExpenses +=
            effect.value < 0 ? Math.abs(effect.value) : 0;
          this.state.stats.totalRevenue += effect.value > 0 ? effect.value : 0;
          break;
        case 'reputation':
          // 假设reputation会影响当前等级
          if (effect.value > 0) {
            this.state.stats.currentLevel += Math.floor(effect.value / 10);
          }
          break;
        case 'popularity':
          // 假设popularity会影响平均每日收入
          this.state.stats.averageDailyRevenue += effect.value;
          break;
        case 'exp':
          // 经验值效果
          this.state.stats.currentLevel += Math.floor(effect.value / 100);
          break;
      }

      appliedEffects.push(effect);
    }

    // 更新统计数据
    this.updateStats();

    return appliedEffects;
  }

  // 更新统计数据
  private updateStats(): void {
    if (!this.state) return;

    // 更新净利润
    this.state.stats.netProfit =
      this.state.stats.totalRevenue - this.state.stats.totalExpenses;

    // 更新平均每日收入
    const daysPassed = this.calculateDaysPassed();
    if (daysPassed > 0) {
      this.state.stats.averageDailyRevenue = Math.floor(
        this.state.stats.totalRevenue / daysPassed,
      );
    }
  }

  // 计算已过天数
  private calculateDaysPassed(): number {
    if (!this.state) return 0;

    const start = this.state.startTime;
    const current = this.state.currentTime;

    // 简单计算天数差（不考虑月份和年份的差异）
    return (
      (current.year - start.year) * 365 +
      (current.month - start.month) * 30 +
      (current.day - start.day)
    );
  }

  // 更新事件状态
  public update(_deltaTime: number): void {
    if (!this.state) return;

    // 检查活动事件是否结束
    for (const event of this.events) {
      if (event.isActive && !event.isResolved) {
        // 检查事件持续时间
        const eventTime = event.timestamp;
        const currentTime = this.state.currentTime;

        // 计算事件已经持续的天数
        const daysPassed =
          (currentTime.year - eventTime.year) * 365 +
          (currentTime.month - eventTime.month) * 30 +
          (currentTime.day - eventTime.day);

        // 如果事件持续时间已过，自动解析事件（选择默认选项）
        if (daysPassed >= event.durationDays) {
          // 自动选择最后一个选项（通常是忽略）
          const defaultOption = event.options[event.options.length - 1];
          if (defaultOption) {
            this.resolveEvent(event.id, defaultOption.id);
          }
        }
      }
    }

    // 随机生成新事件（概率性）
    const eventProbability = 0.05; // 5%的概率生成新事件
    if (Math.random() < eventProbability) {
      this.generateRandomEvent();
    }
  }

  // 按分类获取事件
  public getEventsByCategory(category: EventCategory): SimulationEvent[] {
    return this.events.filter((event) => event.category === category);
  }

  // 按类型获取事件
  public getEventsByType(type: EventType): SimulationEvent[] {
    return this.events.filter((event) => event.type === type);
  }

  // 获取未解决的事件
  public getUnresolvedEvents(): SimulationEvent[] {
    return this.events.filter((event) => !event.isResolved);
  }

  // 获取所有事件
  public getAllEvents(): SimulationEvent[] {
    return [...this.events];
  }

  // 获取活动事件
  public getActiveEvents(): SimulationEvent[] {
    return this.events.filter((event) => this.activeEvents.has(event.id));
  }

  // 获取事件历史
  public getEventHistory(): SimulationEvent[] {
    return [...this.eventHistory];
  }

  // 清除所有事件
  public clearEvents(): void {
    this.events = [];
    this.activeEvents.clear();
  }

  // 清除事件历史
  public clearEventHistory(): void {
    this.eventHistory = [];
  }
}

// 导出事件系统实例
const eventSystem = new EventSystem();
export default eventSystem;
