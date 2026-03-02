/**
 * 桌面应用接口定义
 */
export interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  coreData: Record<string, unknown>;
  modules: Array<{ id: string; name: string }>;
}

/**
 * 应用商店可用应用接口
 */
export interface AvailableApp {
  id: string;
  name: string;
  icon: string;
  description: string;
  memory: string;
  category: "system" | "core" | "advanced";
  requiredLevelId: string;
}
