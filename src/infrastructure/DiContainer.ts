// 移除未使用的导入，简化服务类型定义

// 定义服务类型
export type ServiceType =
  | 'EventSystem'
  | 'TimeManager'
  | 'CareerSystem'
  | 'BusinessDataService';

// 定义服务构造函数类型
type ServiceConstructor<T> = new (...args: any[]) => T;

// 定义服务注册选项
export interface ServiceRegistrationOptions {
  isSingleton: boolean;
  dependencies?: ServiceType[];
}

// 定义依赖注入容器类
export class DIContainer {
  // 服务注册映射
  private serviceRegistry: Map<
    ServiceType,
    {
      constructor: ServiceConstructor<any>;
      options: ServiceRegistrationOptions;
      instance?: any;
    }
  > = new Map();

  // 注册服务
  register<T>(
    serviceType: ServiceType,
    constructor: ServiceConstructor<T>,
    options: ServiceRegistrationOptions = { isSingleton: true },
  ): void {
    this.serviceRegistry.set(serviceType, {
      constructor,
      options,
    });
  }

  // 获取服务实例
  get<T>(serviceType: ServiceType): T {
    const registration = this.serviceRegistry.get(serviceType);
    if (!registration) {
      throw new Error(`Service ${serviceType} not registered`);
    }

    // 如果是单例且已有实例，直接返回
    if (registration.options.isSingleton && registration.instance) {
      return registration.instance as T;
    }

    // 解析依赖
    const dependencies = registration.options.dependencies || [];
    const resolvedDependencies = dependencies.map((dep) => this.get(dep));

    // 创建实例
    const instance = new registration.constructor(...resolvedDependencies);

    // 如果是单例，保存实例
    if (registration.options.isSingleton) {
      registration.instance = instance;
    }

    return instance as T;
  }

  // 检查服务是否已注册
  isRegistered(serviceType: ServiceType): boolean {
    return this.serviceRegistry.has(serviceType);
  }

  // 移除服务注册
  remove(serviceType: ServiceType): void {
    this.serviceRegistry.delete(serviceType);
  }

  // 清除所有服务注册
  clear(): void {
    this.serviceRegistry.clear();
  }

  // 获取所有已注册的服务类型
  getRegisteredServices(): ServiceType[] {
    return Array.from(this.serviceRegistry.keys());
  }
}

// 创建并导出全局DI容器实例
export const diContainer = new DIContainer();
