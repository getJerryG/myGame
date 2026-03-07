import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '@/components/common/Button/index.vue';

describe('Button Component', () => {
  describe('基本渲染', () => {
    it('should render with default props', () => {
      const wrapper = mount(Button, {
        slots: {
          default: 'Button Text'
        }
      });
      
      expect(wrapper.text()).toBe('Button Text');
      expect(wrapper.classes()).toContain('btn--primary');
      expect(wrapper.classes()).toContain('btn--medium');
      expect(wrapper.classes()).toContain('btn--square');
      expect(wrapper.attributes('type')).toBe('button');
      expect(wrapper.attributes('disabled')).toBeUndefined();
    });

    it('should render with slot content', () => {
      const wrapper = mount(Button, {
        slots: {
          default: 'Custom Button'
        }
      });
      
      expect(wrapper.text()).toBe('Custom Button');
    });
  });

  describe('按钮类型', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
    
    variants.forEach(variant => {
      it(`should render ${variant} variant correctly`, () => {
        const wrapper = mount(Button, {
          props: {
            variant
          },
          slots: {
            default: `${variant} button`
          }
        });
        
        expect(wrapper.classes()).toContain(`btn--${variant}`);
      });
    });
  });

  describe('按钮尺寸', () => {
    const sizes = ['small', 'medium', 'large'];
    
    sizes.forEach(size => {
      it(`should render ${size} size correctly`, () => {
        const wrapper = mount(Button, {
          props: {
            size
          },
          slots: {
            default: `${size} button`
          }
        });
        
        expect(wrapper.classes()).toContain(`btn--${size}`);
      });
    });
  });

  describe('按钮形状', () => {
    const shapes = ['square', 'round', 'circle'];
    
    shapes.forEach(shape => {
      it(`should render ${shape} shape correctly`, () => {
        const wrapper = mount(Button, {
          props: {
            shape,
            icon: '📦'
          },
          slots: {
            default: `${shape} button`
          }
        });
        
        expect(wrapper.classes()).toContain(`btn--${shape}`);
      });
    });
  });

  describe('禁用状态', () => {
    it('should render disabled state correctly', () => {
      const wrapper = mount(Button, {
        props: {
          disabled: true
        },
        slots: {
          default: 'Disabled Button'
        }
      });
      
      expect(wrapper.classes()).toContain('btn--disabled');
      expect(wrapper.attributes('disabled')).toBe('');
    });

    it('should not emit click event when disabled', () => {
      const wrapper = mount(Button, {
        props: {
          disabled: true
        },
        slots: {
          default: 'Disabled Button'
        }
      });
      
      wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    });
  });

  describe('加载状态', () => {
    it('should render loading state correctly', () => {
      const wrapper = mount(Button, {
        props: {
          loading: true
        },
        slots: {
          default: 'Loading Button'
        }
      });
      
      expect(wrapper.classes()).toContain('btn--loading');
      expect(wrapper.classes()).toContain('btn--disabled');
      expect(wrapper.attributes('disabled')).toBe('');
      expect(wrapper.find('.btn__spinner').exists()).toBe(true);
    });

    it('should not emit click event when loading', () => {
      const wrapper = mount(Button, {
        props: {
          loading: true
        },
        slots: {
          default: 'Loading Button'
        }
      });
      
      wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    });
  });

  describe('块级按钮', () => {
    it('should render block button correctly', () => {
      const wrapper = mount(Button, {
        props: {
          block: true
        },
        slots: {
          default: 'Block Button'
        }
      });
      
      expect(wrapper.classes()).toContain('btn--block');
    });
  });

  describe('图标按钮', () => {
    it('should render button with left icon correctly', () => {
      const wrapper = mount(Button, {
        props: {
          icon: '📦',
          iconPosition: 'left'
        },
        slots: {
          default: 'Button with left icon'
        }
      });
      
      expect(wrapper.find('.btn__icon').exists()).toBe(true);
      expect(wrapper.find('.btn__icon').text()).toBe('📦');
      expect(wrapper.find('.btn__icon--right').exists()).toBe(false);
    });

    it('should render button with right icon correctly', () => {
      const wrapper = mount(Button, {
        props: {
          icon: '📦',
          iconPosition: 'right'
        },
        slots: {
          default: 'Button with right icon'
        }
      });
      
      expect(wrapper.find('.btn__icon').exists()).toBe(true);
      expect(wrapper.find('.btn__icon').text()).toBe('📦');
      expect(wrapper.find('.btn__icon--right').exists()).toBe(true);
    });

    it('should render icon only button correctly', () => {
      const wrapper = mount(Button, {
        props: {
          icon: '📦',
          shape: 'circle'
        }
      });
      
      expect(wrapper.find('.btn__icon').exists()).toBe(true);
      expect(wrapper.find('.btn__icon').text()).toBe('📦');
    });
  });

  describe('点击事件', () => {
    it('should emit click event when clicked', () => {
      const wrapper = mount(Button, {
        slots: {
          default: 'Clickable Button'
        }
      });
      
      wrapper.trigger('click');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });
  });

  describe('自定义类名', () => {
    it('should add custom class correctly', () => {
      const wrapper = mount(Button, {
        props: {
          customClass: 'custom-btn-class'
        },
        slots: {
          default: 'Button with custom class'
        }
      });
      
      expect(wrapper.classes()).toContain('custom-btn-class');
    });
  });

  describe('按钮type属性', () => {
    const types = ['button', 'submit', 'reset'];
    
    types.forEach(type => {
      it(`should render with ${type} type correctly`, () => {
        const wrapper = mount(Button, {
          props: {
            type
          },
          slots: {
            default: `${type} button`
          }
        });
        
        expect(wrapper.attributes('type')).toBe(type);
      });
    });
  });
});
