// 内容服务，负责处理内容管理相关的业务逻辑
export class ContentService {
  // 获取模块图标
  static getModuleIcon(moduleId: string): string {
    const icons = {
      "hero-management": "🦸",
      "skin-release": "🎨",
      "game-optimization": "⚙️",
    };
    return icons[moduleId as keyof typeof icons] || "📦";
  }

  // 获取核心数据标签
  static getCoreDataLabel(key: string): string {
    const labels = {
      totalHeroes: "总英雄数",
      totalSkins: "总皮肤数",
      activeEvents: "活跃活动数",
      contentQuality: "内容质量评分",
    };
    return labels[key as keyof typeof labels] || key;
  }

  // 获取当前激活的模块
  static getCurrentModule(modules: any[], activeModuleId: string) {
    return modules.find((module) => module.id === activeModuleId) || modules[0];
  }
}
