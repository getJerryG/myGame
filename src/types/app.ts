// 应用相关类型定义

export interface AppConfig {
  name: string;
  version: string;
  debug: boolean;
}

export interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AppTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}
