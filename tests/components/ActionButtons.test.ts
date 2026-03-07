import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ActionButtons from '@/components/common/ActionButtons/index.vue';
import { createRouter, createWebHistory } from 'vue-router';

// 创建模拟路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/lottery', component: { template: '<div>Lottery</div>' } }
  ]
});

describe('ActionButtons Component', () => {
  let wrapper: any;
  
  beforeEach(() => {
    // 每次测试前重置路由
    router.push('/');
    
    wrapper = mount(ActionButtons, {
      global: {
        plugins: [router]
      }
    });
  });
  
  it('should render correctly with all buttons', () => {
    // 检查组件是否正确渲染
    expect(wrapper.exists()).toBe(true);
    
    // 检查标题
    expect(wrapper.find('.section-title').text()).toBe('游戏功能');
    
    // 检查所有按钮是否存在
    const buttons = wrapper.findAll('.action-btn');
    expect(buttons.length).toBe(3);
    
    // 检查每个按钮的文本
    expect(wrapper.find('.inventory-btn .btn-text').text()).toBe('背包');
    expect(wrapper.find('.achievement-btn .btn-text').text()).toBe('成就');
    expect(wrapper.find('.lottery-btn .btn-text').text()).toBe('抽奖');
  });
  
  it('should emit toggle-inventory event when inventory button is clicked', async () => {
    // 点击背包按钮
    await wrapper.find('.inventory-btn').trigger('click');
    
    // 检查是否发出了正确的事件
    expect(wrapper.emitted('toggle-inventory')).toBeTruthy();
    expect(wrapper.emitted('toggle-inventory')?.length).toBe(1);
  });
  
  it('should emit show-achievements event when achievement button is clicked', async () => {
    // 点击成就按钮
    await wrapper.find('.achievement-btn').trigger('click');
    
    // 检查是否发出了正确的事件
    expect(wrapper.emitted('show-achievements')).toBeTruthy();
    expect(wrapper.emitted('show-achievements')?.length).toBe(1);
  });
  
  it('should navigate to lottery page when lottery button is clicked', async () => {
    // 模拟router.push方法
    const pushSpy = vi.spyOn(router, 'push');
    
    // 点击抽奖按钮
    await wrapper.find('.lottery-btn').trigger('click');
    
    // 检查是否调用了正确的路由方法
    expect(pushSpy).toHaveBeenCalledWith('/lottery');
    pushSpy.mockRestore();
  });
  
  it('should have correct button titles and icons', () => {
    // 检查按钮标题
    expect(wrapper.find('.inventory-btn').attributes('title')).toBe('打开背包');
    expect(wrapper.find('.achievement-btn').attributes('title')).toBe('查看成就');
    expect(wrapper.find('.lottery-btn').attributes('title')).toBe('进入抽奖界面');
    
    // 检查按钮图标
    expect(wrapper.find('.inventory-btn .btn-icon').text()).toBe('🎒');
    expect(wrapper.find('.achievement-btn .btn-icon').text()).toBe('🏆');
    expect(wrapper.find('.lottery-btn .btn-icon').text()).toBe('🎲');
  });
  
  it('should apply correct CSS classes to buttons', () => {
    // 检查按钮是否有正确的CSS类
    expect(wrapper.find('.inventory-btn').classes()).toContain('action-btn');
    expect(wrapper.find('.inventory-btn').classes()).toContain('inventory-btn');
    
    expect(wrapper.find('.achievement-btn').classes()).toContain('action-btn');
    expect(wrapper.find('.achievement-btn').classes()).toContain('achievement-btn');
    
    expect(wrapper.find('.lottery-btn').classes()).toContain('action-btn');
    expect(wrapper.find('.lottery-btn').classes()).toContain('lottery-btn');
  });
});
