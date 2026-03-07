import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from '@/components/common/Card/index.vue';

describe('Card Component', () => {
  describe('基本渲染', () => {
    it('should render with default props', () => {
      const wrapper = mount(Card, {
        slots: {
          default: 'Card Content'
        }
      });
      
      expect(wrapper.text()).toContain('Card Content');
      expect(wrapper.classes()).toContain('card--default');
      expect(wrapper.classes()).toContain('card--medium');
      expect(wrapper.classes()).toContain('card--square');
      expect(wrapper.classes()).toContain('card--elevated');
      expect(wrapper.classes()).toContain('card--hoverable');
    });

    it('should render with custom class', () => {
      const wrapper = mount(Card, {
        props: {
          customClass: 'custom-card-class'
        },
        slots: {
          default: 'Card Content'
        }
      });
      
      expect(wrapper.classes()).toContain('custom-card-class');
    });
  });

  describe('卡片变体', () => {
    const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'];
    
    variants.forEach(variant => {
      it(`should render ${variant} variant correctly`, () => {
        const wrapper = mount(Card, {
          props: {
            variant
          },
          slots: {
            default: `${variant} card`
          }
        });
        
        expect(wrapper.classes()).toContain(`card--${variant}`);
      });
    });
  });

  describe('卡片尺寸', () => {
    const sizes = ['small', 'medium', 'large'];
    
    sizes.forEach(size => {
      it(`should render ${size} size correctly`, () => {
        const wrapper = mount(Card, {
          props: {
            size
          },
          slots: {
            default: `${size} card`
          }
        });
        
        expect(wrapper.classes()).toContain(`card--${size}`);
      });
    });
  });

  describe('卡片形状', () => {
    const shapes = ['square', 'round'];
    
    shapes.forEach(shape => {
      it(`should render ${shape} shape correctly`, () => {
        const wrapper = mount(Card, {
          props: {
            shape
          },
          slots: {
            default: `${shape} card`
          }
        });
        
        expect(wrapper.classes()).toContain(`card--${shape}`);
      });
    });
  });

  describe('阴影效果', () => {
    it('should render with shadow when elevated is true', () => {
      const wrapper = mount(Card, {
        props: {
          elevated: true
        },
        slots: {
          default: 'Card with shadow'
        }
      });
      
      expect(wrapper.classes()).toContain('card--elevated');
    });

    it('should render without shadow when elevated is false', () => {
      const wrapper = mount(Card, {
        props: {
          elevated: false
        },
        slots: {
          default: 'Card without shadow'
        }
      });
      
      expect(wrapper.classes()).not.toContain('card--elevated');
    });
  });

  describe('悬停效果', () => {
    it('should render with hoverable effect when hoverable is true', () => {
      const wrapper = mount(Card, {
        props: {
          hoverable: true
        },
        slots: {
          default: 'Hoverable card'
        }
      });
      
      expect(wrapper.classes()).toContain('card--hoverable');
    });

    it('should not render with hoverable effect when hoverable is false', () => {
      const wrapper = mount(Card, {
        props: {
          hoverable: false
        },
        slots: {
          default: 'Non-hoverable card'
        }
      });
      
      expect(wrapper.classes()).not.toContain('card--hoverable');
    });
  });

  describe('标题和副标题', () => {
    it('should render with title only', () => {
      const wrapper = mount(Card, {
        props: {
          title: 'Card Title'
        },
        slots: {
          default: 'Card Content'
        }
      });
      
      expect(wrapper.find('.card__title').text()).toBe('Card Title');
      expect(wrapper.find('.card__subtitle').exists()).toBe(false);
    });

    it('should render with subtitle only', () => {
      const wrapper = mount(Card, {
        props: {
          subtitle: 'Card Subtitle'
        },
        slots: {
          default: 'Card Content'
        }
      });
      
      expect(wrapper.find('.card__subtitle').text()).toBe('Card Subtitle');
      expect(wrapper.find('.card__title').exists()).toBe(false);
    });

    it('should render with both title and subtitle', () => {
      const wrapper = mount(Card, {
        props: {
          title: 'Card Title',
          subtitle: 'Card Subtitle'
        },
        slots: {
          default: 'Card Content'
        }
      });
      
      expect(wrapper.find('.card__title').text()).toBe('Card Title');
      expect(wrapper.find('.card__subtitle').text()).toBe('Card Subtitle');
    });

    it('should not render header when no title, subtitle or header slot', () => {
      const wrapper = mount(Card, {
        slots: {
          default: 'Card Content'
        }
      });
      
      expect(wrapper.find('.card__header').exists()).toBe(false);
    });
  });

  describe('标签', () => {
    it('should render tags correctly', () => {
      const tags = [
        { text: 'Tag 1', variant: 'primary' },
        { text: 'Tag 2', variant: 'success' },
        { text: 'Tag 3', variant: 'warning' }
      ];
      
      const wrapper = mount(Card, {
        props: {
          tags
        },
        slots: {
          default: 'Card with tags'
        }
      });
      
      const tagElements = wrapper.findAll('.card__tag');
      expect(tagElements.length).toBe(tags.length);
      
      tagElements.forEach((tagElement, index) => {
        expect(tagElement.text()).toBe(tags[index].text);
        expect(tagElement.classes()).toContain(`card__tag--${tags[index].variant}`);
      });
    });

    it('should render tags with default variant when not specified', () => {
      const tags = [
        { text: 'Default Tag' }
      ];
      
      const wrapper = mount(Card, {
        props: {
          tags
        },
        slots: {
          default: 'Card with default tags'
        }
      });
      
      const tagElement = wrapper.find('.card__tag');
      expect(tagElement.classes()).toContain('card__tag--default');
    });

    it('should not render tags container when no tags', () => {
      const wrapper = mount(Card, {
        props: {
          tags: []
        },
        slots: {
          default: 'Card without tags'
        }
      });
      
      expect(wrapper.find('.card__tags').exists()).toBe(false);
    });
  });

  describe('插槽', () => {
    it('should render default slot content', () => {
      const wrapper = mount(Card, {
        slots: {
          default: '<p class="test-content">Default Slot Content</p>'
        }
      });
      
      expect(wrapper.find('.test-content').exists()).toBe(true);
      expect(wrapper.find('.test-content').text()).toBe('Default Slot Content');
    });

    it('should render header-actions slot content', () => {
      const wrapper = mount(Card, {
        slots: {
          default: 'Card Content',
          'header-actions': '<button class="test-button">Action Button</button>'
        }
      });
      
      expect(wrapper.find('.test-button').exists()).toBe(true);
      expect(wrapper.find('.test-button').text()).toBe('Action Button');
    });

    it('should render image slot content', () => {
      const wrapper = mount(Card, {
        slots: {
          default: 'Card Content',
          image: '<img class="test-image" src="test.jpg" alt="Test Image">'
        }
      });
      
      expect(wrapper.find('.test-image').exists()).toBe(true);
      expect(wrapper.find('.card__image').exists()).toBe(true);
    });

    it('should render footer slot content', () => {
      const wrapper = mount(Card, {
        slots: {
          default: 'Card Content',
          footer: '<div class="test-footer">Footer Content</div>'
        }
      });
      
      expect(wrapper.find('.test-footer').exists()).toBe(true);
      expect(wrapper.find('.test-footer').text()).toBe('Footer Content');
      expect(wrapper.find('.card__footer').exists()).toBe(true);
    });

    it('should render all slots together', () => {
      const wrapper = mount(Card, {
        props: {
          title: 'Card Title',
          subtitle: 'Card Subtitle',
          tags: [{ text: 'Test Tag', variant: 'primary' }]
        },
        slots: {
          default: '<p>Card Content</p>',
          'header-actions': '<button>Action</button>',
          image: '<img src="test.jpg" alt="Test">',
          footer: '<div>Footer</div>'
        }
      });
      
      expect(wrapper.find('.card__header').exists()).toBe(true);
      expect(wrapper.find('.card__header-actions').exists()).toBe(true);
      expect(wrapper.find('.card__image').exists()).toBe(true);
      expect(wrapper.find('.card__content').exists()).toBe(true);
      expect(wrapper.find('.card__tags').exists()).toBe(true);
      expect(wrapper.find('.card__footer').exists()).toBe(true);
    });
  });

  describe('阴影和悬停效果', () => {
    it('should not render shadow when elevated is false', () => {
      const wrapper = mount(Card, {
        props: {
          elevated: false
        },
        slots: {
          default: 'Card without shadow'
        }
      });
      
      expect(wrapper.classes()).not.toContain('card--elevated');
    });

    it('should not render hover effect when hoverable is false', () => {
      const wrapper = mount(Card, {
        props: {
          hoverable: false
        },
        slots: {
          default: 'Card without hover effect'
        }
      });
      
      expect(wrapper.classes()).not.toContain('card--hoverable');
    });

    it('should render without shadow and hover effect when both are false', () => {
      const wrapper = mount(Card, {
        props: {
          elevated: false,
          hoverable: false
        },
        slots: {
          default: 'Card without shadow and hover effect'
        }
      });
      
      expect(wrapper.classes()).not.toContain('card--elevated');
      expect(wrapper.classes()).not.toContain('card--hoverable');
    });
  });
});
