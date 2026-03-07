import { describe, it, expect } from 'vitest';
import { ActionEffects, ActionEffect } from '@/models/ActionEffects';

describe('ActionEffects', () => {
  let actionEffects: ActionEffects;
  
  beforeEach(() => {
    actionEffects = new ActionEffects();
  });
  
  describe('createEffect', () => {
    it('should create a valid effect with default values', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10
      );
      
      expect(effect.id).toBe('test-effect');
      expect(effect.name).toBe('Test Effect');
      expect(effect.description).toBe('A test effect');
      expect(effect.type).toBe('test');
      expect(effect.value).toBe(10);
      expect(effect.duration).toBe(0);
      expect(effect.isPositive).toBe(true);
      expect(effect.isStackable).toBe(false);
      expect(effect.stackCount).toBe(1);
      expect(effect.remainingDuration).toBe(0);
    });
    
    it('should create a valid effect with custom values', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10,
        30,
        false,
        true
      );
      
      expect(effect.id).toBe('test-effect');
      expect(effect.duration).toBe(30);
      expect(effect.isPositive).toBe(false);
      expect(effect.isStackable).toBe(true);
    });
  });
  
  describe('addEffect', () => {
    it('should add a non-stackable effect', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10
      );
      
      actionEffects.addEffect(effect);
      
      expect(actionEffects.hasEffect('test-effect')).toBe(true);
      expect(actionEffects.getEffect('test-effect')?.stackCount).toBe(1);
    });
    
    it('should stack a stackable effect', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10,
        0,
        true,
        true
      );
      
      actionEffects.addEffect(effect);
      actionEffects.addEffect(effect);
      
      expect(actionEffects.hasEffect('test-effect')).toBe(true);
      expect(actionEffects.getEffect('test-effect')?.stackCount).toBe(2);
    });
    
    it('should add duration effect to durationEffects map', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10,
        30
      );
      
      actionEffects.addEffect(effect);
      
      // Test that the effect can be updated (implies it's in durationEffects)
      actionEffects.update(5);
      expect(actionEffects.getEffect('test-effect')?.remainingDuration).toBe(25);
    });
  });
  
  describe('removeEffect', () => {
    it('should remove an existing effect', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10
      );
      
      actionEffects.addEffect(effect);
      expect(actionEffects.hasEffect('test-effect')).toBe(true);
      
      actionEffects.removeEffect('test-effect');
      expect(actionEffects.hasEffect('test-effect')).toBe(false);
    });
    
    it('should handle removing non-existent effect', () => {
      // This should not throw an error
      expect(() => {
        actionEffects.removeEffect('non-existent-effect');
      }).not.toThrow();
    });
  });
  
  describe('reduceStack', () => {
    it('should reduce stack count of effect', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10,
        0,
        true,
        true
      );
      
      actionEffects.addEffect(effect);
      actionEffects.addEffect(effect); // Stack count becomes 2
      
      actionEffects.reduceStack('test-effect');
      expect(actionEffects.getEffect('test-effect')?.stackCount).toBe(1);
    });
    
    it('should remove effect when stack count reaches 0', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10,
        0,
        true,
        true
      );
      
      actionEffects.addEffect(effect);
      
      actionEffects.reduceStack('test-effect');
      expect(actionEffects.hasEffect('test-effect')).toBe(false);
    });
    
    it('should handle reducing stack of non-existent effect', () => {
      // This should not throw an error
      expect(() => {
        actionEffects.reduceStack('non-existent-effect');
      }).not.toThrow();
    });
  });
  
  describe('update', () => {
    it('should decrease remaining duration of effects', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10,
        30
      );
      
      actionEffects.addEffect(effect);
      
      actionEffects.update(5);
      expect(actionEffects.getEffect('test-effect')?.remainingDuration).toBe(25);
      
      actionEffects.update(10);
      expect(actionEffects.getEffect('test-effect')?.remainingDuration).toBe(15);
    });
    
    it('should remove expired effects', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10,
        30
      );
      
      actionEffects.addEffect(effect);
      
      actionEffects.update(35); // More than duration
      expect(actionEffects.hasEffect('test-effect')).toBe(false);
    });
    
    it('should update multiple effects', () => {
      const effect1 = ActionEffects.createEffect(
        'effect-1',
        'Effect 1',
        'First effect',
        'test',
        10,
        30
      );
      
      const effect2 = ActionEffects.createEffect(
        'effect-2',
        'Effect 2',
        'Second effect',
        'test',
        20,
        60
      );
      
      actionEffects.addEffect(effect1);
      actionEffects.addEffect(effect2);
      
      actionEffects.update(15);
      
      expect(actionEffects.getEffect('effect-1')?.remainingDuration).toBe(15);
      expect(actionEffects.getEffect('effect-2')?.remainingDuration).toBe(45);
    });
  });
  
  describe('getAllEffects', () => {
    it('should return all effects', () => {
      const effect1 = ActionEffects.createEffect(
        'effect-1',
        'Effect 1',
        'First effect',
        'test',
        10
      );
      
      const effect2 = ActionEffects.createEffect(
        'effect-2',
        'Effect 2',
        'Second effect',
        'test',
        20
      );
      
      actionEffects.addEffect(effect1);
      actionEffects.addEffect(effect2);
      
      const effects = actionEffects.getAllEffects();
      
      expect(effects).toHaveLength(2);
      expect(effects.map(e => e.id)).toContain('effect-1');
      expect(effects.map(e => e.id)).toContain('effect-2');
    });
    
    it('should return empty array when no effects', () => {
      const effects = actionEffects.getAllEffects();
      expect(effects).toEqual([]);
    });
  });
  
  describe('getEffectsByType', () => {
    it('should return effects of a specific type', () => {
      const effect1 = ActionEffects.createEffect(
        'effect-1',
        'Effect 1',
        'First effect',
        'type1',
        10
      );
      
      const effect2 = ActionEffects.createEffect(
        'effect-2',
        'Effect 2',
        'Second effect',
        'type2',
        20
      );
      
      const effect3 = ActionEffects.createEffect(
        'effect-3',
        'Effect 3',
        'Third effect',
        'type1',
        30
      );
      
      actionEffects.addEffect(effect1);
      actionEffects.addEffect(effect2);
      actionEffects.addEffect(effect3);
      
      const type1Effects = actionEffects.getEffectsByType('type1');
      const type2Effects = actionEffects.getEffectsByType('type2');
      const type3Effects = actionEffects.getEffectsByType('type3');
      
      expect(type1Effects).toHaveLength(2);
      expect(type2Effects).toHaveLength(1);
      expect(type3Effects).toHaveLength(0);
      
      expect(type1Effects.map(e => e.id)).toContain('effect-1');
      expect(type1Effects.map(e => e.id)).toContain('effect-3');
      expect(type2Effects[0].id).toBe('effect-2');
    });
  });
  
  describe('hasEffect', () => {
    it('should return true for existing effect', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10
      );
      
      actionEffects.addEffect(effect);
      expect(actionEffects.hasEffect('test-effect')).toBe(true);
    });
    
    it('should return false for non-existent effect', () => {
      expect(actionEffects.hasEffect('non-existent-effect')).toBe(false);
    });
  });
  
  describe('getEffect', () => {
    it('should return the effect for existing id', () => {
      const effect = ActionEffects.createEffect(
        'test-effect',
        'Test Effect',
        'A test effect',
        'test',
        10
      );
      
      actionEffects.addEffect(effect);
      
      const retrievedEffect = actionEffects.getEffect('test-effect');
      
      expect(retrievedEffect).not.toBeUndefined();
      expect(retrievedEffect?.id).toBe('test-effect');
      expect(retrievedEffect?.name).toBe('Test Effect');
    });
    
    it('should return undefined for non-existent id', () => {
      const effect = actionEffects.getEffect('non-existent-effect');
      expect(effect).toBeUndefined();
    });
  });
  
  describe('clearAllEffects', () => {
    it('should clear all effects', () => {
      const effect1 = ActionEffects.createEffect(
        'effect-1',
        'Effect 1',
        'First effect',
        'test',
        10
      );
      
      const effect2 = ActionEffects.createEffect(
        'effect-2',
        'Effect 2',
        'Second effect',
        'test',
        20
      );
      
      actionEffects.addEffect(effect1);
      actionEffects.addEffect(effect2);
      
      expect(actionEffects.getAllEffects()).toHaveLength(2);
      
      actionEffects.clearAllEffects();
      
      expect(actionEffects.getAllEffects()).toHaveLength(0);
      expect(actionEffects.hasEffect('effect-1')).toBe(false);
      expect(actionEffects.hasEffect('effect-2')).toBe(false);
    });
  });
  
  describe('clearEffectsByType', () => {
    it('should clear effects of a specific type', () => {
      const effect1 = ActionEffects.createEffect(
        'effect-1',
        'Effect 1',
        'First effect',
        'type1',
        10
      );
      
      const effect2 = ActionEffects.createEffect(
        'effect-2',
        'Effect 2',
        'Second effect',
        'type2',
        20
      );
      
      const effect3 = ActionEffects.createEffect(
        'effect-3',
        'Effect 3',
        'Third effect',
        'type1',
        30
      );
      
      actionEffects.addEffect(effect1);
      actionEffects.addEffect(effect2);
      actionEffects.addEffect(effect3);
      
      actionEffects.clearEffectsByType('type1');
      
      expect(actionEffects.getAllEffects()).toHaveLength(1);
      expect(actionEffects.hasEffect('effect-1')).toBe(false);
      expect(actionEffects.hasEffect('effect-3')).toBe(false);
      expect(actionEffects.hasEffect('effect-2')).toBe(true);
    });
    
    it('should do nothing for non-existent type', () => {
      const effect1 = ActionEffects.createEffect(
        'effect-1',
        'Effect 1',
        'First effect',
        'type1',
        10
      );
      
      actionEffects.addEffect(effect1);
      
      actionEffects.clearEffectsByType('non-existent-type');
      
      expect(actionEffects.getAllEffects()).toHaveLength(1);
      expect(actionEffects.hasEffect('effect-1')).toBe(true);
    });
  });
  
  describe('getPositiveEffects', () => {
    it('should return only positive effects', () => {
      const positiveEffect = ActionEffects.createEffect(
        'positive-effect',
        'Positive Effect',
        'A positive effect',
        'test',
        10,
        0,
        true
      );
      
      const negativeEffect = ActionEffects.createEffect(
        'negative-effect',
        'Negative Effect',
        'A negative effect',
        'test',
        -10,
        0,
        false
      );
      
      actionEffects.addEffect(positiveEffect);
      actionEffects.addEffect(negativeEffect);
      
      const positiveEffects = actionEffects.getPositiveEffects();
      
      expect(positiveEffects).toHaveLength(1);
      expect(positiveEffects[0].id).toBe('positive-effect');
      expect(positiveEffects[0].isPositive).toBe(true);
    });
  });
  
  describe('getNegativeEffects', () => {
    it('should return only negative effects', () => {
      const positiveEffect = ActionEffects.createEffect(
        'positive-effect',
        'Positive Effect',
        'A positive effect',
        'test',
        10,
        0,
        true
      );
      
      const negativeEffect = ActionEffects.createEffect(
        'negative-effect',
        'Negative Effect',
        'A negative effect',
        'test',
        -10,
        0,
        false
      );
      
      actionEffects.addEffect(positiveEffect);
      actionEffects.addEffect(negativeEffect);
      
      const negativeEffects = actionEffects.getNegativeEffects();
      
      expect(negativeEffects).toHaveLength(1);
      expect(negativeEffects[0].id).toBe('negative-effect');
      expect(negativeEffects[0].isPositive).toBe(false);
    });
  });
});
