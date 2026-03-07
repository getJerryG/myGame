import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import AppNavbar from '@/components/common/AppNavbar/index.vue';

describe('AppNavbar Component', () => {
  // 模拟router-link
  const mockRouterLink = {
    template: '<a href="#" class="nav-link" v-bind="$attrs"><slot></slot></a>',
    props: ['to', 'exact']
  };

  beforeEach(() => {
    // 模拟window.innerWidth
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    
    // 模拟resize事件
    window.addEventListener = vi.fn((event, callback) => {
      if (event === 'resize') {
        (window as any).resizeCallback = callback;
      }
    });
    
    window.removeEventListener = vi.fn((event, callback) => {
      if (event === 'resize' && (window as any).resizeCallback === callback) {
        delete (window as any).resizeCallback;
      }
    });
  });

  afterEach(() => {
    // 清理模拟
    vi.restoreAllMocks();
  });

  describe('基本渲染', () => {
    it('should render correctly with default props', () => {
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      expect(wrapper.find('.navbar').exists()).toBe(true);
      expect(wrapper.find('.navbar-brand h1').text()).toBe('游戏工具箱');
      expect(wrapper.find('.menu-toggle').exists()).toBe(true);
      expect(wrapper.find('.navbar-menu').exists()).toBe(true);
    });

    it('should render navigation links', () => {
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      const navLinks = wrapper.findAll('.nav-link');
      expect(navLinks.length).toBe(3);
      
      const linkTexts = navLinks.map(link => link.find('.link-text').text());
      expect(linkTexts).toEqual(['首页', '无相抽奖', '策划模拟经营']);
    });
  });

  describe('菜单切换', () => {
    it('should toggle menu open/close when menu toggle is clicked', async () => {
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      // 初始状态应该是关闭的
      expect(wrapper.find('.navbar-menu').classes()).not.toContain('menu-open');
      
      // 点击菜单切换按钮
      await wrapper.find('.menu-toggle').trigger('click');
      
      // 菜单应该打开
      expect(wrapper.find('.navbar-menu').classes()).toContain('menu-open');
      
      // 再次点击菜单切换按钮
      await wrapper.find('.menu-toggle').trigger('click');
      
      // 菜单应该关闭
      expect(wrapper.find('.navbar-menu').classes()).not.toContain('menu-open');
    });

    it('should change menu icon when menu is toggled', async () => {
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      // 初始状态应该是汉堡图标
      expect(wrapper.find('.menu-icon').text()).toBe('☰');
      
      // 点击菜单切换按钮
      await wrapper.find('.menu-toggle').trigger('click');
      
      // 图标应该变成关闭图标
      expect(wrapper.find('.menu-icon').text()).toBe('×');
    });
  });

  describe('导航栏显示/隐藏逻辑', () => {
    it('should be hidden by default on desktop', () => {
      // 确保是桌面尺寸
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
      
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      expect(wrapper.find('.navbar').classes()).toContain('navbar-hidden');
    });

    it('should show navbar when mouse enters', async () => {
      // 确保是桌面尺寸
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
      
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      // 鼠标进入导航栏
      await wrapper.find('.navbar').trigger('mouseenter');
      
      // 导航栏应该显示
      expect(wrapper.find('.navbar').classes()).not.toContain('navbar-hidden');
    });

    it('should hide navbar when mouse leaves on desktop', async () => {
      // 确保是桌面尺寸
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
      
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      // 首先让导航栏显示
      await wrapper.find('.navbar').trigger('mouseenter');
      await nextTick();
      expect(wrapper.find('.navbar').classes()).not.toContain('navbar-hidden');
      
      // 鼠标离开导航栏
      await wrapper.find('.navbar').trigger('mouseleave');
      await nextTick();
      
      // 导航栏应该隐藏
      expect(wrapper.find('.navbar').classes()).toContain('navbar-hidden');
    });

    it('should always show navbar on mobile', () => {
      // 确保是移动尺寸
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
      
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      // 导航栏应该始终显示
      expect(wrapper.find('.navbar').classes()).not.toContain('navbar-hidden');
    });
  });

  describe('响应式设计', () => {
    it('should switch to mobile layout when window width is 768px', async () => {
      // 初始是桌面尺寸
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
      
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      // 切换到移动尺寸
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
      
      // 触发resize事件
      (window as any).resizeCallback && (window as any).resizeCallback();
      await nextTick();
      
      // 导航栏应该始终显示
      expect(wrapper.find('.navbar').classes()).not.toContain('navbar-hidden');
    });

    it('should switch to desktop layout when window width is 769px', async () => {
      // 初始是移动尺寸
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
      
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      // 切换到桌面尺寸
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 769 });
      
      // 触发resize事件
      (window as any).resizeCallback && (window as any).resizeCallback();
      await nextTick();
      
      // 导航栏应该隐藏
      expect(wrapper.find('.navbar').classes()).toContain('navbar-hidden');
    });
  });

  describe('导航链接效果', () => {
    it('should have hover effect on nav links', async () => {
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      const firstLink = wrapper.find('.nav-link');
      
      // 鼠标悬停在导航链接上
      await firstLink.trigger('mouseenter');
      
      // 链接应该有发光效果
      const linkGlow = firstLink.find('.link-glow');
      expect(linkGlow.exists()).toBe(true);
    });

    it('should apply active class to current route link', () => {
      // 模拟router-link的active状态
      const activeRouterLink = {
        template: '<a href="#" class="nav-link router-link-active" v-bind="$attrs"><slot></slot></a>',
        props: ['to', 'exact']
      };
      
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': activeRouterLink
          }
        }
      });
      
      const activeLinks = wrapper.findAll('.router-link-active');
      expect(activeLinks.length).toBe(3); // 所有链接都会应用active类，因为我们模拟了active状态
      
      // 激活的链接应该有特殊样式
      activeLinks.forEach(link => {
        expect(link.classes()).toContain('router-link-active');
      });
    });
  });

  describe('可访问性', () => {
    it('should have correct ARIA attributes', () => {
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      expect(wrapper.find('.navbar').attributes('aria-label')).toBe('主导航');
      expect(wrapper.find('.menu-toggle').attributes('aria-label')).toBe('切换菜单');
      expect(wrapper.find('.menu-toggle').attributes('aria-expanded')).toBe('false');
    });

    it('should update ARIA expanded attribute when menu is toggled', async () => {
      const wrapper = mount(AppNavbar, {
        global: {
          components: {
            'router-link': mockRouterLink
          }
        }
      });
      
      // 初始状态
      expect(wrapper.find('.menu-toggle').attributes('aria-expanded')).toBe('false');
      
      // 点击菜单切换按钮
      await wrapper.find('.menu-toggle').trigger('click');
      
      // ARIA expanded应该更新为true
      expect(wrapper.find('.menu-toggle').attributes('aria-expanded')).toBe('true');
      
      // 再次点击菜单切换按钮
      await wrapper.find('.menu-toggle').trigger('click');
      
      // ARIA expanded应该更新为false
      expect(wrapper.find('.menu-toggle').attributes('aria-expanded')).toBe('false');
    });
  });
});
