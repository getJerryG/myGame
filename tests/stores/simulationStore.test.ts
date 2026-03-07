import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSimulationStore } from '@/stores/simulationStore';

describe('simulationStore', () => {
  beforeEach(() => {
    // 重置Pinia状态
    const pinia = createPinia();
    setActivePinia(pinia);
  });
  
  describe('状态初始化', () => {
    it('应该初始化正确的默认状态', () => {
      const simulationStore = useSimulationStore();
      
      expect(simulationStore.simulationData).toBeNull();
      expect(simulationStore.isSimulating).toBe(false);
      expect(simulationStore.simulationSpeed).toBe(1);
    });
  });
  
  describe('getters', () => {
    it('isRunning应该返回当前模拟状态', () => {
      const simulationStore = useSimulationStore();
      
      expect(simulationStore.isRunning).toBe(false);
      
      simulationStore.isSimulating = true;
      expect(simulationStore.isRunning).toBe(true);
    });
    
    it('currentSpeed应该返回当前模拟速度', () => {
      const simulationStore = useSimulationStore();
      
      expect(simulationStore.currentSpeed).toBe(1);
      
      simulationStore.simulationSpeed = 3;
      expect(simulationStore.currentSpeed).toBe(3);
    });
  });
  
  describe('actions', () => {
    describe('startSimulation', () => {
      it('应该开始模拟并设置isSimulating为true', () => {
        const simulationStore = useSimulationStore();
        
        expect(simulationStore.isSimulating).toBe(false);
        expect(simulationStore.isRunning).toBe(false);
        
        simulationStore.startSimulation();
        
        expect(simulationStore.isSimulating).toBe(true);
        expect(simulationStore.isRunning).toBe(true);
      });
      
      it('多次调用startSimulation应该保持isSimulating为true', () => {
        const simulationStore = useSimulationStore();
        
        simulationStore.startSimulation();
        expect(simulationStore.isSimulating).toBe(true);
        
        simulationStore.startSimulation();
        expect(simulationStore.isSimulating).toBe(true);
      });
    });
    
    describe('stopSimulation', () => {
      it('应该停止模拟并设置isSimulating为false', () => {
        const simulationStore = useSimulationStore();
        
        // 先开始模拟
        simulationStore.startSimulation();
        expect(simulationStore.isSimulating).toBe(true);
        
        // 然后停止模拟
        simulationStore.stopSimulation();
        expect(simulationStore.isSimulating).toBe(false);
        expect(simulationStore.isRunning).toBe(false);
      });
      
      it('多次调用stopSimulation应该保持isSimulating为false', () => {
        const simulationStore = useSimulationStore();
        
        simulationStore.stopSimulation();
        expect(simulationStore.isSimulating).toBe(false);
        
        simulationStore.stopSimulation();
        expect(simulationStore.isSimulating).toBe(false);
      });
      
      it('在未开始模拟时调用stopSimulation应该没有影响', () => {
        const simulationStore = useSimulationStore();
        
        expect(simulationStore.isSimulating).toBe(false);
        
        simulationStore.stopSimulation();
        expect(simulationStore.isSimulating).toBe(false);
      });
    });
    
    describe('updateSimulationData', () => {
      it('应该更新模拟数据', () => {
        const simulationStore = useSimulationStore();
        
        const mockData = { key: 'value', count: 10 };
        
        simulationStore.updateSimulationData(mockData);
        expect(simulationStore.simulationData).toEqual(mockData);
      });
      
      it('应该接受null作为模拟数据', () => {
        const simulationStore = useSimulationStore();
        
        const mockData = { key: 'value' };
        simulationStore.updateSimulationData(mockData);
        expect(simulationStore.simulationData).toEqual(mockData);
        
        simulationStore.updateSimulationData(null);
        expect(simulationStore.simulationData).toBeNull();
      });
      
      it('应该正确更新不同类型的模拟数据', () => {
        const simulationStore = useSimulationStore();
        
        // 测试对象类型
        const objData = { name: 'test', value: 123 };
        simulationStore.updateSimulationData(objData);
        expect(simulationStore.simulationData).toEqual(objData);
        
        // 测试复杂对象类型
        const complexData = {
          nested: { level: 1, data: [1, 2, 3] },
          status: 'active',
          metrics: { cpu: 50, memory: 1024 }
        };
        simulationStore.updateSimulationData(complexData);
        expect(simulationStore.simulationData).toEqual(complexData);
      });
    });
    
    describe('setSimulationSpeed', () => {
      it('应该设置有效的模拟速度', () => {
        const simulationStore = useSimulationStore();
        
        simulationStore.setSimulationSpeed(3);
        expect(simulationStore.simulationSpeed).toBe(3);
        expect(simulationStore.currentSpeed).toBe(3);
      });
      
      it('应该限制速度在1-5之间', () => {
        const simulationStore = useSimulationStore();
        
        // 测试下限
        simulationStore.setSimulationSpeed(0);
        expect(simulationStore.simulationSpeed).toBe(1);
        
        // 测试上限
        simulationStore.setSimulationSpeed(6);
        expect(simulationStore.simulationSpeed).toBe(5);
        
        // 测试边界值
        simulationStore.setSimulationSpeed(1);
        expect(simulationStore.simulationSpeed).toBe(1);
        
        simulationStore.setSimulationSpeed(5);
        expect(simulationStore.simulationSpeed).toBe(5);
      });
      
      it('应该处理小数速度值', () => {
        const simulationStore = useSimulationStore();
        
        simulationStore.setSimulationSpeed(2.5);
        expect(simulationStore.simulationSpeed).toBe(2.5);
        
        simulationStore.setSimulationSpeed(4.9);
        expect(simulationStore.simulationSpeed).toBe(4.9);
        
        // 小数超过上限应该被限制
        simulationStore.setSimulationSpeed(5.1);
        expect(simulationStore.simulationSpeed).toBe(5);
      });
      
      it('应该处理负数速度值', () => {
        const simulationStore = useSimulationStore();
        
        simulationStore.setSimulationSpeed(-1);
        expect(simulationStore.simulationSpeed).toBe(1);
        
        simulationStore.setSimulationSpeed(-10);
        expect(simulationStore.simulationSpeed).toBe(1);
      });
    });
  });
});
