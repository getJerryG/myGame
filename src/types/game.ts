// 游戏数据相关类型定义

export interface GameState {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameRelease {
  id: string;
  gameId: string;
  version: string;
  releaseDate: Date;
  changelog: string;
  status: "draft" | "published" | "archived";
}

export interface GameStats {
  downloads: number;
  activeUsers: number;
  rating: number;
  reviews: number;
}

export interface GameSettings {
  difficulty: "easy" | "normal" | "hard";
  volume: number;
  graphics: "low" | "medium" | "high";
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

// 游戏发布内容类型
export interface GameReleaseData {
  id: string;
  type: "hero" | "skin" | "activity" | "event";
  name: string;
  status: string;
  createdDate: string;
  releaseChannel: "experience" | "official";
}

// 游戏反馈数据类型
export interface GameFeedback {
  positiveRate: number;
  bugReports: number;
  suggestions: number;
}
