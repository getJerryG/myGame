<template>
  <div class="root-app">
    <!-- 导航�?-->
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>游戏工具�?/h1>
      </div>
      <div class="navbar-menu">
        <router-link
          to="/"
          class="nav-link"
          >首页</router-link
        >
        <router-link
          to="/lottery"
          class="nav-link"
          >无相抽奖</router-link
        >
        <router-link
          to="/simulation"
          class="nav-link"
          >策划模拟经营</router-link
        >
        <router-link
          to="/game-release"
          class="nav-link"
          >游戏发布管理</router-link
        >
      </div>
    </nav>

    <!-- 首页内容 -->
    <main class="main-content">
      <div class="home-content">
        <div class="welcome-section">
          <h2>欢迎使用游戏工具�?/h2>
          <p>本工具集提供以下功能�?/p>
        </div>

        <div class="feature-cards">
          <!-- 无相抽奖卡片 -->
          <div class="feature-card">
            <div class="card-icon">🎰</div>
            <h3>无相抽奖</h3>
            <p>
              体验随机抽签系统，测试你的运�?/p>
              <router-link
                to="/lottery"
                class="card-link"
                >进入</router-link
              >
            </p>
          </div>

          <!-- 策划模拟经营卡片 -->
          <div class="feature-card">
            <div class="card-icon">🎮</div>
            <h3>策划模拟经营</h3>
            <p>成为游戏策划，经营一款游戏，体验数值调整带来的影响</p>
            <router-link
              to="/simulation"
              class="card-link"
              >进入</router-link
            >
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 根组件，用于路由视图容器
</script>

<style lang="scss" scoped>
.root-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #333;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover {
  background: rgb(255 255 255 / 10%);
}

.nav-link.router-link-active {
  background: #4caf50;
}

.main-content {
  flex: 1;
  padding: 20px;
  background: #f0f0f0;
}

/* 首页内容样式 */
.home-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 60px;
}

.welcome-section h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

.welcome-section p {
  font-size: 1.2rem;
  color: #666;
}

.feature-cards {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  min-width: 300px;
  max-width: 400px;
  flex: 1;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 30px rgb(0 0 0 / 15%);
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

.feature-card p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.card-link {
  display: inline-block;
  background: #4caf50;
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition:
    background 0.3s,
    transform 0.3s;
}

.card-link:hover {
  background: #45a049;
  transform: scale(1.05);
}

@media (width <= 768px) {
  .navbar {
    flex-direction: column;
    gap: 10px;
    padding: 15px;
  }

  .navbar-menu {
    width: 100%;
    justify-content: center;
  }

  .main-content {
    padding: 10px;
  }

  .welcome-section h2 {
    font-size: 2rem;
  }

  .feature-cards {
    flex-direction: column;
    align-items: center;
  }

  .feature-card {
    max-width: 100%;
    margin: 0 20px;
  }
}
</style>
