// 移除未使用的导入

// 行动效果类型
export interface ActionEffect {
  id: string;
  name: string;
  description: string;
  type: string;
  value: number;
  duration: number;
  isPositive: boolean;
  isStackable: boolean;
  stackCount: number;
  remainingDuration: number;
}

// 行动效果管理器类
export class ActionEffects {
  private effects: Map<string, ActionEffect> = new Map();
  private durationEffects: Map<string, ActionEffect> = new Map();

  // 添加效果
  public addEffect(effect: ActionEffect): void {
    // 如果效果可堆叠，增加堆叠次数
    if (effect.isStackable && this.effects.has(effect.id)) {
      const existingEffect = this.effects.get(effect.id)!;
      existingEffect.stackCount++;
      existingEffect.remainingDuration = effect.duration;
      this.effects.set(effect.id, existingEffect);
      if (effect.duration > 0) {
        this.durationEffects.set(effect.id, existingEffect);
      }
    } else {
      // 否则替换现有效果
      this.effects.set(effect.id, {
        ...effect,
        stackCount: 1,
        remainingDuration: effect.duration,
      });
      if (effect.duration > 0) {
        this.durationEffects.set(effect.id, this.effects.get(effect.id)!);
      }
    }
  }

  // 移除效果
  public removeEffect(effectId: string): void {
    this.effects.delete(effectId);
    this.durationEffects.delete(effectId);
  }

  // 减少效果堆叠次数
  public reduceStack(effectId: string): void {
    if (this.effects.has(effectId)) {
      const effect = this.effects.get(effectId)!;
      effect.stackCount--;
      if (effect.stackCount <= 0) {
        this.removeEffect(effectId);
      } else {
        this.effects.set(effectId, effect);
      }
    }
  }

  // 更新效果持续时间
  public update(deltaTime: number): void {
    const effectsToRemove: string[] = [];

    // 更新所有持续效果的剩余时间
    this.durationEffects.forEach((effect, effectId) => {
      effect.remainingDuration -= deltaTime;

      if (effect.remainingDuration <= 0) {
        effectsToRemove.push(effectId);
      } else {
        this.effects.set(effectId, effect);
        this.durationEffects.set(effectId, effect);
      }
    });

    // 移除过期效果
    for (const effectId of effectsToRemove) {
      this.removeEffect(effectId);
    }
  }

  // 获取所有效果
  public getAllEffects(): ActionEffect[] {
    return Array.from(this.effects.values());
  }

  // 获取特定类型的效果
  public getEffectsByType(type: string): ActionEffect[] {
    return Array.from(this.effects.values()).filter((effect) => effect.type === type);
  }

  // 检查是否有特定效果
  public hasEffect(effectId: string): boolean {
    return this.effects.has(effectId);
  }

  // 获取特定效果
  public getEffect(effectId: string): ActionEffect | undefined {
    return this.effects.get(effectId);
  }

  // 清除所有效果
  public clearAllEffects(): void {
    this.effects.clear();
    this.durationEffects.clear();
  }

  // 清除特定类型的效果
  public clearEffectsByType(type: string): void {
    const effectsToRemove: string[] = [];
    this.effects.forEach((effect, effectId) => {
      if (effect.type === type) {
        effectsToRemove.push(effectId);
      }
    });
    for (const effectId of effectsToRemove) {
      this.removeEffect(effectId);
    }
  }

  // 获取所有正面效果
  public getPositiveEffects(): ActionEffect[] {
    return Array.from(this.effects.values()).filter((effect) => effect.isPositive);
  }

  // 获取所有负面效果
  public getNegativeEffects(): ActionEffect[] {
    return Array.from(this.effects.values()).filter((effect) => !effect.isPositive);
  }

  // 创建效果实例
  public static createEffect(
    id: string,
    name: string,
    description: string,
    type: string,
    value: number,
    duration = 0,
    isPositive = true,
    isStackable = false
  ): ActionEffect {
    return {
      id,
      name,
      description,
      type,
      value,
      duration,
      isPositive,
      isStackable,
      stackCount: 1,
      remainingDuration: duration,
    };
  }
}
