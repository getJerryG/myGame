import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import WindowFrame from '@/components/common/WindowFrame.vue';

describe('WindowFrame Component', () => {
  it('renders with correct title', () => {
    const title = 'Test Window';
    const wrapper = mount(WindowFrame, {
      props: {
        title
      }
    });

    expect(wrapper.find('.window-header h2').text()).toBe(title);
  });

  it('renders with custom class name', () => {
    const className = 'custom-window';
    const wrapper = mount(WindowFrame, {
      props: {
        title: 'Test Window',
        className
      }
    });

    expect(wrapper.classes()).toContain(className);
  });

  it('renders all control buttons by default', () => {
    const wrapper = mount(WindowFrame, {
      props: {
        title: 'Test Window'
      }
    });

    expect(wrapper.find('.minimize-btn').exists()).toBe(true);
    expect(wrapper.find('.maximize-btn').exists()).toBe(true);
    expect(wrapper.find('.close-btn').exists()).toBe(true);
  });

  it('renders only specified control buttons', () => {
    const wrapper = mount(WindowFrame, {
      props: {
        title: 'Test Window',
        showControls: {
          minimize: true,
          maximize: false,
          close: false
        }
      }
    });

    expect(wrapper.find('.minimize-btn').exists()).toBe(true);
    expect(wrapper.find('.maximize-btn').exists()).toBe(false);
    expect(wrapper.find('.close-btn').exists()).toBe(false);
  });

  it('emits minimize event when minimize button is clicked', () => {
    const wrapper = mount(WindowFrame, {
      props: {
        title: 'Test Window'
      }
    });

    wrapper.find('.minimize-btn').trigger('click');
    expect(wrapper.emitted('minimize')).toHaveLength(1);
  });

  it('emits maximize event when maximize button is clicked', () => {
    const wrapper = mount(WindowFrame, {
      props: {
        title: 'Test Window'
      }
    });

    wrapper.find('.maximize-btn').trigger('click');
    expect(wrapper.emitted('maximize')).toHaveLength(1);
  });

  it('emits close event when close button is clicked', () => {
    const wrapper = mount(WindowFrame, {
      props: {
        title: 'Test Window'
      }
    });

    wrapper.find('.close-btn').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('renders slot content correctly', () => {
    const slotContent = '<div class="test-content">Test Slot Content</div>';
    const wrapper = mount(WindowFrame, {
      props: {
        title: 'Test Window'
      },
      slots: {
        default: slotContent
      }
    });

    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.find('.test-content').text()).toBe('Test Slot Content');
  });
});
