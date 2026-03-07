import { describe, it, expect, vi } from 'vitest';
import { Character, CharacterStatus } from '@/models/Character';

// Mock Date
const mockDate = new Date('2026-03-07T12:00:00.000Z');
const originalDate = global.Date;

describe('Character', () => {
  let character: Character;
  const mockSkill = {
    id: 'skill-1',
    name: '测试技能',
    description: '这是一个测试技能',
    level: 1,
    experience: 0,
    type: 'technical',
    effect: '增加10%的设计效率',
    isActive: true
  };
  
  beforeEach(() => {
    // Mock Date
    global.Date = vi.fn().mockImplementation(() => mockDate) as any;
    (Date.prototype as any).getTime = vi.fn(() => mockDate.getTime());
    
    // Create a new character for each test
    character = new Character('char-1', 'Test Character');
  });
  
  afterEach(() => {
    // Restore original Date
    global.Date = originalDate;
  });
  
  describe('constructor', () => {
    it('should create a character with default values', () => {
      expect(character.getId()).toBe('char-1');
      expect(character.getName()).toBe('Test Character');
      expect(character.getLevel()).toBe(1);
      expect(character.getExperience()).toBe(0);
      expect(character.getFunds()).toBe(0);
      expect(character.getStatus()).toBe('active');
    });
    
    it('should create a character with custom values', () => {
      const customChar = new Character('char-2', 'Custom Character', 5, 1000, 5000);
      
      expect(customChar.getLevel()).toBe(5);
      expect(customChar.getExperience()).toBe(1000);
      expect(customChar.getFunds()).toBe(5000);
    });
  });
  
  describe('getName/setName', () => {
    it('should get and set the character name', () => {
      expect(character.getName()).toBe('Test Character');
      
      character.setName('New Name');
      expect(character.getName()).toBe('New Name');
    });
  });
  
  describe('getLevel', () => {
    it('should return the character level', () => {
      expect(character.getLevel()).toBe(1);
    });
  });
  
  describe('getExperience/getNextLevelExperience', () => {
    it('should return the correct experience values', () => {
      expect(character.getExperience()).toBe(0);
      expect(character.getNextLevelExperience()).toBeGreaterThan(0);
    });
  });
  
  describe('getAttributes/setAttributes', () => {
    it('should get and set attributes correctly', () => {
      const attributes = character.getAttributes();
      expect(attributes.strength).toBe(10);
      expect(attributes.intelligence).toBe(10);
      expect(attributes.agility).toBe(10);
      expect(attributes.charisma).toBe(10);
      
      character.setAttributes({ strength: 15, intelligence: 12 });
      const updatedAttributes = character.getAttributes();
      expect(updatedAttributes.strength).toBe(15);
      expect(updatedAttributes.intelligence).toBe(12);
      expect(updatedAttributes.agility).toBe(10); // Should remain unchanged
    });
  });
  
  describe('getStats', () => {
    it('should return the character stats', () => {
      const stats = character.getStats();
      expect(stats.level).toBe(1);
      expect(stats.exp).toBe(0);
      expect(stats.funds).toBe(0);
      expect(stats.health).toBe(100);
      expect(stats.maxHealth).toBe(100);
    });
  });
  
  describe('getCareer/setCareer', () => {
    it('should get and set career correctly', () => {
      const career = character.getCareer();
      expect(career.title).toBe('初级策划');
      expect(career.level).toBe(1);
      
      const newCareer = {
        title: '高级策划',
        level: 2,
        subLevel: 1,
        titleName: '策划',
        subLevelName: '高级'
      };
      
      character.setCareer(newCareer);
      const updatedCareer = character.getCareer();
      expect(updatedCareer.title).toBe('高级策划');
      expect(updatedCareer.level).toBe(2);
    });
  });
  
  describe('skill management', () => {
    it('should add and get skills', () => {
      character.addSkill(mockSkill);
      
      const skills = character.getSkills();
      expect(skills).toHaveLength(1);
      expect(skills[0].id).toBe('skill-1');
      
      const skill = character.getSkill('skill-1');
      expect(skill).not.toBeUndefined();
      expect(skill?.name).toBe('测试技能');
    });
    
    it('should remove skills', () => {
      character.addSkill(mockSkill);
      expect(character.getSkills()).toHaveLength(1);
      
      character.removeSkill('skill-1');
      expect(character.getSkills()).toHaveLength(0);
      expect(character.getSkill('skill-1')).toBeUndefined();
    });
    
    it('should return empty array when no skills', () => {
      const skills = character.getSkills();
      expect(skills).toEqual([]);
    });
  });
  
  describe('getStatus/setStatus', () => {
    it('should get and set character status', () => {
      expect(character.getStatus()).toBe('active');
      
      character.setStatus('resting');
      expect(character.getStatus()).toBe('resting');
      
      character.setStatus('injured');
      expect(character.getStatus()).toBe('injured');
    });
    
    it('should handle all status types', () => {
      const statuses: CharacterStatus[] = ['active', 'resting', 'injured', 'dead', 'retired'];
      
      statuses.forEach(status => {
        character.setStatus(status);
        expect(character.getStatus()).toBe(status);
      });
    });
  });
  
  describe('funds management', () => {
    it('should get and set funds', () => {
      expect(character.getFunds()).toBe(0);
      
      character.setFunds(1000);
      expect(character.getFunds()).toBe(1000);
      expect(character.getStats().funds).toBe(1000);
    });
    
    it('should add funds', () => {
      character.setFunds(500);
      character.addFunds(300);
      
      expect(character.getFunds()).toBe(800);
    });
    
    it('should reduce funds when enough funds are available', () => {
      character.setFunds(1000);
      const result = character.reduceFunds(600);
      
      expect(result).toBe(true);
      expect(character.getFunds()).toBe(400);
    });
    
    it('should not reduce funds when insufficient funds', () => {
      character.setFunds(500);
      const result = character.reduceFunds(1000);
      
      expect(result).toBe(false);
      expect(character.getFunds()).toBe(500);
    });
  });
  
  describe('experience and level up', () => {
    it('should add experience correctly', () => {
      character.addExperience(100);
      expect(character.getExperience()).toBe(100);
      expect(character.getStats().exp).toBe(100);
    });
    
    it('should level up when enough experience is added', () => {
      // Get the required experience for next level
      const nextLevelExp = character.getNextLevelExperience();
      
      // Add enough experience to level up
      const result = character.addExperience(nextLevelExp + 50);
      
      expect(result).toBe(true);
      expect(character.getLevel()).toBe(2);
      expect(character.getExperience()).toBe(50); // Remaining experience after level up
      expect(character.getStats().level).toBe(2);
      expect(character.getStats().maxHealth).toBe(110); // Should increase by 10
    });
    
    it('should not level up when insufficient experience', () => {
      // Add less than required experience
      const nextLevelExp = character.getNextLevelExperience();
      const result = character.addExperience(nextLevelExp - 50);
      
      expect(result).toBe(false);
      expect(character.getLevel()).toBe(1);
    });
  });
  
  describe('isAlive/isActive', () => {
    it('should return true for alive characters', () => {
      expect(character.isAlive()).toBe(true);
      
      character.setStatus('resting');
      expect(character.isAlive()).toBe(true);
      
      character.setStatus('injured');
      expect(character.isAlive()).toBe(true);
    });
    
    it('should return false for dead characters', () => {
      character.setStatus('dead');
      expect(character.isAlive()).toBe(false);
    });
    
    it('should return true for active characters', () => {
      expect(character.isActive()).toBe(true);
    });
    
    it('should return false for inactive characters', () => {
      character.setStatus('resting');
      expect(character.isActive()).toBe(false);
      
      character.setStatus('injured');
      expect(character.isActive()).toBe(false);
    });
  });
  
  describe('reset', () => {
    it('should reset character to default values', () => {
      // Modify the character
      character.setName('Modified Name');
      character.setAttributes({ strength: 20, intelligence: 18 });
      character.setFunds(5000);
      character.addExperience(1000);
      character.setStatus('resting');
      character.addSkill(mockSkill);
      
      // Reset the character
      character.reset();
      
      // Check if reset to default values
      expect(character.getName()).toBe('Modified Name'); // Name should not reset
      expect(character.getLevel()).toBe(1);
      expect(character.getExperience()).toBe(0);
      expect(character.getFunds()).toBe(0);
      expect(character.getStatus()).toBe('active');
      expect(character.getSkills()).toHaveLength(0);
      
      const attributes = character.getAttributes();
      expect(attributes.strength).toBe(10);
      expect(attributes.intelligence).toBe(10);
      expect(attributes.agility).toBe(10);
      expect(attributes.charisma).toBe(10);
    });
  });
  
  describe('getCurrentState', () => {
    it('should return the complete character state', () => {
      const state = character.getCurrentState();
      
      expect(state.id).toBe('char-1');
      expect(state.name).toBe('Test Character');
      expect(state.level).toBe(1);
      expect(state.experience).toBe(0);
      expect(state.attributes).toBeDefined();
      expect(state.stats).toBeDefined();
      expect(state.career).toBeDefined();
      expect(state.skills).toEqual([]);
      expect(state.status).toBe('active');
      expect(state.funds).toBe(0);
      expect(state.createdAt).toBeDefined();
      expect(state.updatedAt).toBeDefined();
    });
    
    it('should include skills in the state', () => {
      character.addSkill(mockSkill);
      const state = character.getCurrentState();
      
      expect(state.skills).toHaveLength(1);
      expect(state.skills[0].id).toBe('skill-1');
    });
  });
  
  describe('update', () => {
    it('should update the character', () => {
      // Just test that the method doesn't throw an error
      expect(() => {
        character.update(1000);
      }).not.toThrow();
    });
  });
});
