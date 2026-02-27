import { defineStore } from 'pinia';

// 定义模拟系统状态类型
interface SimulationState {
  // 模拟数据
  simulationData: any;
  isSimulating: boolean;
  simulationSpeed: number;
}

// 创建并导出模拟系统store
export const useSimulationStore = defineStore('simulation', {
  state: (): SimulationState => ({
    // 模拟数据
    simulationData: null,
    isSimulating: false,
    simulationSpeed: 1
  }),
  
  getters: {
    // 获取模拟状态
    isRunning: (state) => state.isSimulating,
    // 获取当前模拟速度
    currentSpeed: (state) => state.simulationSpeed
  },
  
  actions: {
    // 开始模拟
    startSimulation() {
      this.isSimulating = true;
    },
    
    // 停止模拟
    stopSimulation() {
      this.isSimulating = false;
    },
    
    // 更新模拟数据
    updateSimulationData(data: any) {
      this.simulationData = data;
    },
    
    // 设置模拟速度
    setSimulationSpeed(speed: number) {
      this.simulationSpeed = Math.max(1, Math.min(5, speed)); // 限制速度在1-5之间
    }
  }
});
