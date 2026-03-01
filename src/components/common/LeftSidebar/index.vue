<template>
  <aside class="left-sidebar">
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h4 class="nav-section-title">核心系统</h4>
        <ul class="nav-menu">
          <li
            class="nav-item"
            :class="{ active: activeSystem === 'dashboard' }"
            @click="changeSystem('dashboard')"
          >
            <span class="nav-icon">📋</span>
            <span class="nav-text">仪表�?/span>
          </li>
          <li
            class="nav-item"
            :class="{ active: activeSystem === 'hero' }"
            @click="changeSystem('hero')"
          >
            <span class="nav-icon">⚔️</span>
            <span class="nav-text">英雄管理</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: activeSystem === 'skin' }"
            @click="changeSystem('skin')"
          >
            <span class="nav-icon">🎨</span>
            <span class="nav-text">皮肤系统</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: activeSystem === 'data' }"
            @click="changeSystem('data')"
          >
            <span class="nav-icon">📈</span>
            <span class="nav-text">数据反馈</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: activeSystem === 'feedback' }"
            @click="changeSystem('feedback')"
          >
            <span class="nav-icon">💬</span>
            <span class="nav-text">玩家反馈</span>
          </li>
        </ul>
      </div>
      <div class="nav-section">
        <h4 class="nav-section-title">高级功能</h4>
        <ul class="nav-menu">
          <li
            class="nav-item"
            :class="{ active: activeSystem === 'lifecycle' }"
            @click="changeSystem('lifecycle')"
          >
            <span class="nav-icon">�?/span>
            <span class="nav-text">生命周期</span>
          </li>
          <li
            class="nav-item"
            :class="{ active: activeSystem === 'market' }"
            @click="changeSystem('market')"
          >
            <span class="nav-icon">🏪</span>
            <span class="nav-text">市场竞争</span>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script lang=ts>
export default {
  name: 'LeftSidebar',
  props: {
    activeSystem: {
      type: String,
      default: 'dashboard',
    },
  },
  emits: ['update:activeSystem'],
  methods: {
    changeSystem(newSystem: string): void {
      this.$emit('update:activeSystem', newSystem);
    },
  },
};
</script>

<style lang=scss scoped>
.left-sidebar {
  width: 220px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  padding: 20px 0;
}

.sidebar-nav {
  padding: 0 10px;
}

.nav-section {
  margin-bottom: 30px;
}

.nav-section-title {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  padding: 0 15px;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;

    a {
      color: #007bff;
    }
  }

  &.active {
    background-color: #007bff;

    .nav-text {
      color: white;
    }

    .nav-icon {
      color: white;
    }

    a {
      color: white;
    }
  }

  a {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    color: #495057;
    text-decoration: none;
    transition: all 0.2s ease;
  }
}

.nav-icon {
  font-size: 16px;
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}
</style>
