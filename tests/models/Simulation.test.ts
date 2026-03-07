import { describe, it, expect, vi } from 'vitest';
import { Simulation } from '@/models/Simulation';

// Mock Date
const mockDate = new Date('2026-03-07T12:00:00.000Z');
const originalDate = global.Date;

describe('Simulation', () => {
  let simulation: Simulation;
  
  // Mock event system and time manager dependencies
  vi.mock('@/systems/EventSystem', () => ({
    EventSystem: vi.fn().mockImplementation(() => ({
      init: vi.fn(),
      update: vi.fn()
    }))
  }));
  
  vi.mock('@/systems/TimeManager', () => ({
    TimeManager: vi.fn().mockImplementation(() => ({
      init: vi.fn()
    }))
  }));
  
  beforeEach(() => {
    // Mock Date
    global.Date = vi.fn().mockImplementation(() => mockDate) as any;
    (Date.prototype as any).getTime = vi.fn(() => mockDate.getTime());
    (Date.prototype as any).getMonth = vi.fn(() => 0);
    (Date.prototype as any).getDate = vi.fn(() => 1);
    (Date.prototype as any).getFullYear = vi.fn(() => 2024);
    
    // Create a new simulation for each test
    simulation = new Simulation('sim-1', 'Test Simulation');
  });
  
  afterEach(() => {
    // Restore original Date
    global.Date = originalDate;
  });
  
  describe('constructor', () => {
    it('should create a simulation with default values', () => {
      expect(simulation.getId()).toBe('sim-1');
      expect(simulation.getName()).toBe('Test Simulation');
      expect(simulation.isActive()).toBe(false);
      expect(simulation.isSimPaused()).toBe(false);
      
      const state = simulation.getState();
      expect(state.id).toBe('sim-1');
      expect(state.name).toBe('Test Simulation');
      expect(state.isActive).toBe(false);
      expect(state.isPaused).toBe(false);
    });
    
    it('should create a simulation with custom config', () => {
      const customConfig = {
        timeScale: 2,
        difficulty: 'hard',
        startingFunds: 50000,
        startingLevel: 5,
        enableRandomEvents: false,
        eventFrequency: 0.8
      };
      
      const customSimulation = new Simulation('sim-2', 'Custom Simulation', customConfig);
      expect(customSimulation.getTimeScale()).toBe(2);
      
      const customState = customSimulation.getState();
      expect(customState.config.difficulty).toBe('hard');
      expect(customState.config.startingFunds).toBe(50000);
      expect(customState.config.startingLevel).toBe(5);
      expect(customState.config.enableRandomEvents).toBe(false);
      expect(customState.config.eventFrequency).toBe(0.8);
    });
  });
  
  describe('simulation lifecycle', () => {
    it('should start, pause, resume and stop correctly', () => {
      // Start simulation
      simulation.start();
      expect(simulation.isActive()).toBe(true);
      expect(simulation.isSimPaused()).toBe(false);
      expect(simulation.getState().isActive).toBe(true);
      expect(simulation.getState().isPaused).toBe(false);
      
      // Pause simulation
      simulation.pause();
      expect(simulation.isActive()).toBe(true);
      expect(simulation.isSimPaused()).toBe(true);
      expect(simulation.getState().isActive).toBe(true);
      expect(simulation.getState().isPaused).toBe(true);
      
      // Resume simulation
      simulation.resume();
      expect(simulation.isActive()).toBe(true);
      expect(simulation.isSimPaused()).toBe(false);
      expect(simulation.getState().isActive).toBe(true);
      expect(simulation.getState().isPaused).toBe(false);
      
      // Stop simulation
      simulation.stop();
      expect(simulation.isActive()).toBe(false);
      expect(simulation.isSimPaused()).toBe(false);
      expect(simulation.getState().isActive).toBe(false);
      expect(simulation.getState().isPaused).toBe(false);
    });
  });
  
  describe('time management', () => {
    it('should set and get time scale', () => {
      expect(simulation.getTimeScale()).toBe(1);
      
      simulation.setTimeScale(3);
      expect(simulation.getTimeScale()).toBe(3);
      expect(simulation.getState().config.timeScale).toBe(3);
    });
    
    it('should get current time', () => {
      const currentTime = simulation.getCurrentTime();
      expect(currentTime.year).toBe(2024);
      expect(currentTime.month).toBe(1);
      expect(currentTime.day).toBe(1);
      expect(currentTime.hour).toBe(0);
      expect(currentTime.minute).toBe(0);
      expect(currentTime.second).toBe(0);
    });
  });
  
  describe('decision management', () => {
    const mockDecision = {
      id: 'decision-1',
      title: 'Test Decision',
      description: 'A test decision',
      options: [
        { id: 'option-1', text: 'Option 1', effect: 'effect-1' },
        { id: 'option-2', text: 'Option 2', effect: 'effect-2' }
      ],
      createdAt: new Date(),
      isResolved: false
    };
    
    it('should add and get decisions', () => {
      simulation.addDecision(mockDecision);
      
      const decision = simulation.getDecision('decision-1');
      expect(decision).not.toBeUndefined();
      expect(decision?.id).toBe('decision-1');
      
      const allDecisions = simulation.getAllDecisions();
      expect(allDecisions).toHaveLength(1);
      expect(allDecisions[0].id).toBe('decision-1');
      
      const stats = simulation.getStats();
      expect(stats.totalDecisions).toBe(1);
    });
    
    it('should remove decisions', () => {
      simulation.addDecision(mockDecision);
      expect(simulation.getAllDecisions()).toHaveLength(1);
      
      simulation.removeDecision('decision-1');
      expect(simulation.getAllDecisions()).toHaveLength(0);
      expect(simulation.getDecision('decision-1')).toBeUndefined();
    });
    
    it('should execute decisions', () => {
      simulation.addDecision(mockDecision);
      expect(simulation.getAllDecisions()).toHaveLength(1);
      
      const result = simulation.executeDecision('decision-1', 'option-1');
      expect(result).toBe(true);
      expect(simulation.getAllDecisions()).toHaveLength(0);
    });
    
    it('should return false for executing non-existent decision', () => {
      const result = simulation.executeDecision('non-existent-decision', 'option-1');
      expect(result).toBe(false);
    });
    
    it('should return false for executing non-existent option', () => {
      simulation.addDecision(mockDecision);
      const result = simulation.executeDecision('decision-1', 'non-existent-option');
      expect(result).toBe(false);
      expect(simulation.getAllDecisions()).toHaveLength(1);
    });
  });
  
  describe('event management', () => {
    const mockEvent = {
      id: 'event-1',
      title: 'Test Event',
      description: 'A test event',
      type: 'random',
      severity: 'normal',
      effects: [],
      createdAt: new Date(),
      isResolved: false
    };
    
    it('should add and get events', () => {
      simulation.addEvent(mockEvent);
      
      const event = simulation.getEvent('event-1');
      expect(event).not.toBeUndefined();
      expect(event?.id).toBe('event-1');
      
      const allEvents = simulation.getAllEvents();
      expect(allEvents).toHaveLength(1);
      expect(allEvents[0].id).toBe('event-1');
      
      const stats = simulation.getStats();
      expect(stats.totalEvents).toBe(1);
    });
    
    it('should remove events', () => {
      simulation.addEvent(mockEvent);
      expect(simulation.getAllEvents()).toHaveLength(1);
      
      simulation.removeEvent('event-1');
      expect(simulation.getAllEvents()).toHaveLength(0);
      expect(simulation.getEvent('event-1')).toBeUndefined();
    });
  });
  
  describe('hero management', () => {
    const mockHero = {
      id: 'hero-1',
      name: 'Test Hero',
      level: 1,
      experience: 0,
      attributes: { strength: 10, intelligence: 10, agility: 10, charisma: 10 },
      skills: [],
      status: 'active',
      createdAt: new Date()
    };
    
    it('should add and get heroes', () => {
      simulation.addHero(mockHero);
      
      const hero = simulation.getHero('hero-1');
      expect(hero).not.toBeUndefined();
      expect(hero?.id).toBe('hero-1');
      
      const allHeroes = simulation.getAllHeroes();
      expect(allHeroes).toHaveLength(1);
      expect(allHeroes[0].id).toBe('hero-1');
    });
    
    it('should remove heroes', () => {
      simulation.addHero(mockHero);
      expect(simulation.getAllHeroes()).toHaveLength(1);
      
      simulation.removeHero('hero-1');
      expect(simulation.getAllHeroes()).toHaveLength(0);
      expect(simulation.getHero('hero-1')).toBeUndefined();
    });
  });
  
  describe('stats and progress', () => {
    it('should get initial stats', () => {
      const stats = simulation.getStats();
      expect(stats.totalEvents).toBe(0);
      expect(stats.totalDecisions).toBe(0);
      expect(stats.totalRevenue).toBe(0);
      expect(stats.totalExpenses).toBe(0);
      expect(stats.netProfit).toBe(0);
      expect(stats.averageDailyRevenue).toBe(0);
      expect(stats.currentFunds).toBe(10000);
      expect(stats.currentLevel).toBe(1);
    });
    
    it('should calculate progress', () => {
      const progress = simulation.getProgress();
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });
  });
  
  describe('update', () => {
    it('should update simulation when running', () => {
      simulation.start();
      
      // Just test that the method doesn't throw an error
      expect(() => {
        simulation.update(1000);
      }).not.toThrow();
    });
    
    it('should not update simulation when not running', () => {
      // Just test that the method doesn't throw an error
      expect(() => {
        simulation.update(1000);
      }).not.toThrow();
    });
    
    it('should not update simulation when paused', () => {
      simulation.start();
      simulation.pause();
      
      // Just test that the method doesn't throw an error
      expect(() => {
        simulation.update(1000);
      }).not.toThrow();
    });
  });
  
  describe('reset', () => {
    it('should reset simulation to initial state', () => {
      // Modify the simulation
      simulation.start();
      simulation.setTimeScale(3);
      simulation.setName('Modified Simulation');
      
      const mockDecision = {
        id: 'decision-1',
        title: 'Test Decision',
        description: 'A test decision',
        options: [{ id: 'option-1', text: 'Option 1', effect: 'effect-1' }],
        createdAt: new Date(),
        isResolved: false
      };
      
      const mockEvent = {
        id: 'event-1',
        title: 'Test Event',
        description: 'A test event',
        type: 'random',
        severity: 'normal',
        effects: [],
        createdAt: new Date(),
        isResolved: false
      };
      
      simulation.addDecision(mockDecision);
      simulation.addEvent(mockEvent);
      
      // Reset the simulation
      simulation.reset();
      
      // Check if reset to initial state
      expect(simulation.isActive()).toBe(false);
      expect(simulation.isSimPaused()).toBe(false);
      expect(simulation.getTimeScale()).toBe(3); // Time scale should not reset
      expect(simulation.getName()).toBe('Modified Simulation'); // Name should not reset
      expect(simulation.getAllDecisions()).toHaveLength(0);
      expect(simulation.getAllEvents()).toHaveLength(0);
      
      const stats = simulation.getStats();
      expect(stats.totalDecisions).toBe(0);
      expect(stats.totalEvents).toBe(0);
      expect(stats.currentFunds).toBe(10000);
      expect(stats.currentLevel).toBe(1);
    });
  });
  
  describe('getFullState', () => {
    it('should return complete simulation state', () => {
      const fullState = simulation.getFullState();
      
      expect(fullState.id).toBe('sim-1');
      expect(fullState.name).toBe('Test Simulation');
      expect(fullState.state).toBeDefined();
      expect(fullState.config).toBeDefined();
      expect(fullState.stats).toBeDefined();
      expect(fullState.currentTime).toBeDefined();
      expect(fullState.startTime).toBeDefined();
      expect(fullState.endTime).toBeDefined();
      expect(fullState.isRunning).toBe(false);
      expect(fullState.isPaused).toBe(false);
      expect(fullState.decisions).toEqual([]);
      expect(fullState.events).toEqual([]);
      expect(fullState.heroes).toEqual([]);
    });
  });
});
