import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SidebarLayout from '@/components/common/SidebarLayout.vue';

describe('SidebarLayout Component', () => {
  const mockSidebarItems = [
    { id: 'item1', name: 'Item 1', icon: '📊' },
    { id: 'item2', name: 'Item 2', icon: '💰' },
    { id: 'item3', name: 'Item 3', icon: '👥' }
  ];

  const mockCoreData = {
    money: 10000,
    reputation: 500,
    popularity: 85
  };

  const mockLabelMap = {
    money: '当前资金',
    reputation: '声望',
    popularity: '游戏热度'
  };

  it('renders with correct sidebar items', () => {
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item1'
      }
    });

    const sidebarItems = wrapper.findAll('.sidebar-item');
    expect(sidebarItems.length).toBe(mockSidebarItems.length);

    sidebarItems.forEach((item, index) => {
      expect(item.find('.sidebar-item-name').text()).toBe(mockSidebarItems[index].name);
      expect(item.find('.sidebar-item-icon').text()).toBe(mockSidebarItems[index].icon);
    });
  });

  it('highlights the active sidebar item', () => {
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item2'
      }
    });

    const sidebarItems = wrapper.findAll('.sidebar-item');
    expect(sidebarItems[0].classes('active')).toBe(false);
    expect(sidebarItems[1].classes('active')).toBe(true);
    expect(sidebarItems[2].classes('active')).toBe(false);
  });

  it('emits update:activeItemId when sidebar item is clicked', () => {
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item1'
      }
    });

    const sidebarItems = wrapper.findAll('.sidebar-item');
    sidebarItems[2].trigger('click');

    expect(wrapper.emitted('update:activeItemId')).toHaveLength(1);
    expect(wrapper.emitted('update:activeItemId')?.[0]).toEqual(['item3']);
  });

  it('emits item-click when sidebar item is clicked', () => {
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item1'
      }
    });

    const sidebarItems = wrapper.findAll('.sidebar-item');
    sidebarItems[1].trigger('click');

    expect(wrapper.emitted('item-click')).toHaveLength(1);
    expect(wrapper.emitted('item-click')?.[0]?.[0]).toEqual(mockSidebarItems[1]);
  });

  it('renders core data in header when provided', () => {
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item1',
        coreData: mockCoreData,
        labelMap: mockLabelMap
      }
    });

    const coreDataItems = wrapper.findAll('.core-data-item');
    expect(coreDataItems.length).toBe(Object.keys(mockCoreData).length);

    coreDataItems.forEach((item) => {
      const label = item.find('.core-data-label').text();
      const value = item.find('.core-data-value').text();
      
      // Check if the label and value match any of the mock data
      const found = Object.entries(mockCoreData).some(([key, val]) => {
        return label === `${mockLabelMap[key]}:` && value === val.toString();
      });
      
      expect(found).toBe(true);
    });
  });

  it('renders with dark theme when darkTheme prop is true', () => {
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item1',
        darkTheme: true
      }
    });

    expect(wrapper.classes('dark-theme')).toBe(true);
  });

  it('does not display header when showHeader is false', () => {
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item1',
        showHeader: false
      }
    });

    expect(wrapper.find('.content-header').exists()).toBe(false);
  });

  it('renders slot content correctly', () => {
    const slotContent = '<div class="test-content">Test Slot Content</div>';
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item1'
      },
      slots: {
        default: slotContent
      }
    });

    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.find('.test-content').text()).toBe('Test Slot Content');
  });

  it('updates active item when activeItemId prop changes', async () => {
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item1'
      }
    });

    // Initial state
    let sidebarItems = wrapper.findAll('.sidebar-item');
    expect(sidebarItems[0].classes('active')).toBe(true);
    expect(sidebarItems[1].classes('active')).toBe(false);

    // Update activeItemId
    await wrapper.setProps({ activeItemId: 'item2' });

    // Check updated state
    sidebarItems = wrapper.findAll('.sidebar-item');
    expect(sidebarItems[0].classes('active')).toBe(false);
    expect(sidebarItems[1].classes('active')).toBe(true);
  });

  it('displays current item name in header', () => {
    const wrapper = mount(SidebarLayout, {
      props: {
        sidebarItems: mockSidebarItems,
        activeItemId: 'item3'
      }
    });

    expect(wrapper.find('.content-header h2').text()).toBe(mockSidebarItems[2].name);
  });
});
