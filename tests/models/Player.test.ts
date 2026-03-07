import { describe, it, expect, vi } from 'vitest';
import { Player } from '@/models/Player';

// Mock Date
const mockDate = new Date('2026-03-07T12:00:00.000Z');
const originalDate = global.Date;

describe('Player', () => {
  let player: Player;
  
  beforeEach(() => {
    // Mock Date
    global.Date = vi.fn().mockImplementation(() => mockDate) as any;
    (Date.prototype as any).getTime = vi.fn(() => mockDate.getTime());
    
    // Create a new player for each test
    player = new Player('player-1', 'Test Player');
  });
  
  afterEach(() => {
    // Restore original Date
    global.Date = originalDate;
  });
  
  describe('constructor', () => {
    it('should create a player with default values', () => {
      expect(player.getId()).toBe('player-1');
      expect(player.getName()).toBe('Test Player');
      expect(player.getLevel()).toBe(1);
      expect(player.getExperience()).toBe(0);
      expect(player.getFunds()).toBe(0);
      expect(player.getStatus()).toBe('active');
    });
    
    it('should create a player with custom values', () => {
      const customPlayer = new Player('player-2', 'Custom Player', 5, 1000, 5000);
      
      expect(customPlayer.getLevel()).toBe(5);
      expect(customPlayer.getExperience()).toBe(1000);
      expect(customPlayer.getFunds()).toBe(5000);
    });
  });
  
  describe('player state management', () => {
    it('should get player state', () => {
      const state = player.getPlayerState();
      
      expect(state.id).toBe('player-1');
      expect(state.name).toBe('Test Player');
      expect(state.isAlive).toBe(true);
      expect(state.attributes).toBeDefined();
      expect(state.stats).toBeDefined();
    });
    
    it('should update player state', () => {
      const newState = {
        name: 'Updated Player',
        isAlive: false
      };
      
      player.updatePlayerState(newState);
      const updatedState = player.getPlayerState();
      
      expect(updatedState.name).toBe('Updated Player');
      expect(updatedState.isAlive).toBe(false);
    });
  });
  
  describe('player attributes', () => {
    it('should get and set player attributes', () => {
      const attributes = player.getPlayerAttributes();
      expect(attributes.strength).toBe(10);
      expect(attributes.intelligence).toBe(10);
      
      player.setPlayerAttributes({ strength: 15, intelligence: 12 });
      const updatedAttributes = player.getPlayerAttributes();
      expect(updatedAttributes.strength).toBe(15);
      expect(updatedAttributes.intelligence).toBe(12);
    });
  });
  
  describe('inventory management', () => {
    it('should add items to inventory', () => {
      player.addItem('item-1');
      expect(player.getItemQuantity('item-1')).toBe(1);
      
      player.addItem('item-1', 5);
      expect(player.getItemQuantity('item-1')).toBe(6);
      
      player.addItem('item-2', 3);
      expect(player.getItemQuantity('item-2')).toBe(3);
    });
    
    it('should remove items from inventory', () => {
      player.addItem('item-1', 10);
      expect(player.removeItem('item-1', 3)).toBe(true);
      expect(player.getItemQuantity('item-1')).toBe(7);
      
      expect(player.removeItem('item-1', 7)).toBe(true);
      expect(player.getItemQuantity('item-1')).toBe(0);
      
      expect(player.removeItem('item-1')).toBe(false);
      expect(player.removeItem('non-existent-item')).toBe(false);
    });
    
    it('should check if player has items', () => {
      player.addItem('item-1', 5);
      
      expect(player.hasItem('item-1')).toBe(true);
      expect(player.hasItem('item-1', 5)).toBe(true);
      expect(player.hasItem('item-1', 6)).toBe(false);
      expect(player.hasItem('non-existent-item')).toBe(false);
    });
    
    it('should get inventory', () => {
      player.addItem('item-1', 5);
      player.addItem('item-2', 3);
      
      const inventory = player.getInventory();
      expect(inventory.size).toBe(2);
      expect(inventory.get('item-1')).toBe(5);
      expect(inventory.get('item-2')).toBe(3);
    });
    
    it('should clear inventory', () => {
      player.addItem('item-1', 5);
      player.addItem('item-2', 3);
      
      player.clearInventory();
      const inventory = player.getInventory();
      expect(inventory.size).toBe(0);
      expect(player.getItemQuantity('item-1')).toBe(0);
    });
  });
  
  describe('achievement management', () => {
    it('should add and check achievements', () => {
      player.addAchievement('achievement-1');
      expect(player.hasAchievement('achievement-1')).toBe(true);
      expect(player.hasAchievement('achievement-2')).toBe(false);
    });
    
    it('should get all achievements', () => {
      player.addAchievement('achievement-1');
      player.addAchievement('achievement-2');
      
      const achievements = player.getAchievements();
      expect(achievements.size).toBe(2);
      expect(achievements.has('achievement-1')).toBe(true);
      expect(achievements.has('achievement-2')).toBe(true);
    });
  });
  
  describe('objective management', () => {
    it('should set and get current objective', () => {
      player.setCurrentObjective('objective-1');
      expect(player.getCurrentObjective()).toBe('objective-1');
    });
    
    it('should complete objectives', () => {
      player.setCurrentObjective('objective-1');
      player.completeObjective('objective-1');
      
      expect(player.getCurrentObjective()).toBeNull();
      expect(player.isObjectiveCompleted('objective-1')).toBe(true);
      expect(player.isObjectiveCompleted('objective-2')).toBe(false);
    });
    
    it('should get completed objectives', () => {
      player.completeObjective('objective-1');
      player.completeObjective('objective-2');
      
      const completed = player.getCompletedObjectives();
      expect(completed.size).toBe(2);
      expect(completed.has('objective-1')).toBe(true);
      expect(completed.has('objective-2')).toBe(true);
    });
    
    it('should not clear current objective if completing different objective', () => {
      player.setCurrentObjective('objective-1');
      player.completeObjective('objective-2');
      
      expect(player.getCurrentObjective()).toBe('objective-1');
      expect(player.isObjectiveCompleted('objective-2')).toBe(true);
    });
  });
  
  describe('getFullState', () => {
    it('should return complete player state', () => {
      player.addItem('item-1', 5);
      player.addAchievement('achievement-1');
      player.setCurrentObjective('objective-1');
      player.completeObjective('objective-2');
      
      const fullState = player.getFullState();
      
      expect(fullState.id).toBe('player-1');
      expect(fullState.name).toBe('Test Player');
      expect(fullState.inventory).toEqual({ 'item-1': 5 });
      expect(fullState.achievements).toEqual(['achievement-1']);
      expect(fullState.currentObjective).toBe('objective-1');
      expect(fullState.completedObjectives).toEqual(['objective-2']);
    });
  });
  
  describe('update', () => {
    it('should update player state', () => {
      // Just test that the method doesn't throw an error
      expect(() => {
        player.update(1000);
      }).not.toThrow();
    });
  });
  
  describe('initPlayer', () => {
    it('should initialize player data', () => {
      player.addItem('item-1', 5);
      player.addAchievement('achievement-1');
      player.setCurrentObjective('objective-1');
      player.completeObjective('objective-1');
      
      player.initPlayer();
      
      expect(player.getItemQuantity('item-1')).toBe(0);
      expect(player.hasAchievement('achievement-1')).toBe(false);
      expect(player.getCurrentObjective()).toBeNull();
      expect(player.isObjectiveCompleted('objective-1')).toBe(false);
      expect(player.getLevel()).toBe(1);
      expect(player.getExperience()).toBe(0);
      expect(player.getFunds()).toBe(0);
    });
  });
  
  describe('experience and funds management', () => {
    it('should gain experience', () => {
      const result = player.gainExp(100);
      expect(player.getExperience()).toBe(100);
    });
    
    it('should gain funds', () => {
      player.gainFunds(500);
      expect(player.getFunds()).toBe(500);
    });
    
    it('should spend funds', () => {
      player.gainFunds(1000);
      expect(player.spendFunds(300)).toBe(true);
      expect(player.getFunds()).toBe(700);
      
      expect(player.spendFunds(1000)).toBe(false);
      expect(player.getFunds()).toBe(700);
    });
  });
  
  describe('progress calculations', () => {
    it('should calculate current HP percentage', () => {
      expect(player.getCurrentHpPercent()).toBe(100);
    });
    
    it('should calculate experience progress', () => {
      const nextLevelExp = player.getNextLevelExperience();
      player.gainExp(nextLevelExp / 2);
      
      const expProgress = player.getExpProgress();
      expect(expProgress).toBe(50);
    });
  });
});
