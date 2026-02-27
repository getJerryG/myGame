<template>
  <div class="dashboard-section">
    <div class="section-header">
      <div>
        <h3>游戏策划仪表�?/h3>
          <p>监控游戏关键指标，制定战略决�?/p>
      </div>
      <div class="time-range-selector">
        <select :value="timeRange" @change="handleTimeRangeChange($event)">
          <option value="day">今日</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="quarter">本季�?/option>
        </select>
      </div>
    </div>

    <!-- KPI卡片 -->
    <div class="kpi-cards">
      <div class="kpi-card">
        <div class="card-header">
          <span class="card-icon">⚖️</span>
          <h4>胜率平衡</h4>
        </div>
        <div class="card-body">
          <div class="kpi-value">
            {{
              numberFormat(
                (simulationResults?.kpi?.winRateBalance || 0.5) * 100
              )
            }}%
          </div>
          <div class="kpi-trend" :class="getKPITrendClass('winRateBalance')">
            <span class="trend-icon">{{
              getKPITrendIcon('winRateBalance')
              }}</span>
            <span>{{ getKPITrendValue('winRateBalance') }}%</span>
          </div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="card-header">
          <span class="card-icon">👥</span>
          <h4>用户留存</h4>
        </div>
        <div class="card-body">
          <div class="kpi-value">
            {{
              numberFormat(
                (simulationResults?.kpi?.playerRetention || 0.8) * 100
              )
            }}%
          </div>
          <div class="kpi-trend" :class="getKPITrendClass('playerRetention')">
            <span class="trend-icon">{{
              getKPITrendIcon('playerRetention')
              }}</span>
            <span>{{ getKPITrendValue('playerRetention') }}%</span>
          </div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="card-header">
          <span class="card-icon">💰</span>
          <h4>总收�?/h4>
        </div>
        <div class="card-body">
          <div class="kpi-value">
            ¥{{ numberFormat(simulationResults?.kpi?.totalRevenue || 0) }}
          </div>
          <div class="kpi-trend" :class="getKPITrendClass('totalRevenue')">
            <span class="trend-icon">{{
              getKPITrendIcon('totalRevenue')
              }}</span>
            <span>{{ getKPITrendValue('totalRevenue') }}%</span>
          </div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="card-header">
          <span class="card-icon">📈</span>
          <h4>市场份额</h4>
        </div>
        <div class="card-body">
          <div class="kpi-value">
            {{
              numberFormat((simulationResults?.kpi?.marketShare || 0.3) * 100)
            }}%
          </div>
          <div class="kpi-trend" :class="getKPITrendClass('marketShare')">
            <span class="trend-icon">{{ getKPITrendIcon('marketShare') }}</span>
            <span>{{ getKPITrendValue('marketShare') }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置部分 -->
    <div class="config-sections">
      <!-- 游戏配置 -->
      <div class="config-section">
        <h3>游戏配置</h3>
        <div class="config-item">
          <label>游戏模式:</label>
          <select :value="gameConfig.mode" @change="handleGameModeChange($event)">
            <option value="classic">经典模式</option>
            <option value="quick">快速模�?/option>
            <option value="ARAM">大乱�?/option>
          </select>
        </div>
        <div class="config-item">
          <label>模拟步数:</label>
          <input :value="gameConfig.steps" type="number" min="10" max="500" @input="handleStepsChange($event)" />
        </div>
      </div>

      <!-- 队伍配置 -->
      <div class="config-section">
        <h3>队伍配置</h3>
        <div class="teams-section">
          <div class="team-config">
            <h4>蓝色�?/h4>
              <div v-for="(player, index) in blueTeam" :key="index" class="player-config">
                <div class="player-slot">
                  <select v-model="player.heroId" @change="updatePlayerHero('blue', index, player.heroId)">
                    <option value="">选择英雄</option>
                    <option v-for="hero in allHeroes" :key="hero.id" :value="hero.id">
                      {{ hero.name }}
                    </option>
                  </select>
                  <select v-model="player.lane">
                    <option value="top">上路</option>
                    <option value="mid">中路</option>
                    <option value="bottom">下路</option>
                    <option value="jungle">打野</option>
                  </select>
                </div>
              </div>
          </div>
          <div class="team-config">
            <h4>红色�?/h4>
              <div v-for="(player, index) in redTeam" :key="index" class="player-config">
                <div class="player-slot">
                  <select v-model="player.heroId" @change="updatePlayerHero('red', index, player.heroId)">
                    <option value="">选择英雄</option>
                    <option v-for="hero in allHeroes" :key="hero.id" :value="hero.id">
                      {{ hero.name }}
                    </option>
                  </select>
                  <select v-model="player.lane">
                    <option value="top">上路</option>
                    <option value="mid">中路</option>
                    <option value="bottom">下路</option>
                    <option value="jungle">打野</option>
                  </select>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模拟结果 -->
    <div v-if="simulationResults" class="results-section">
      <h3>模拟结果</h3>
      <div class="winner-info">
        <h4>
          获胜�?
          {{ simulationResults.winner === 'blue' ? '蓝色�? : '红色�? }}
        </h4>
        <p>游戏时间: {{ simulationResults.time }}�?/p>
        <p>模拟步数: {{ simulationResults.steps }}</p>
      </div>
      <div class="teams-results">
        <div class="team-result">
          <h5>蓝色�?/h5>
            <p>击杀: {{ simulationResults.teams.blue.kills }}</p>
            <p>助攻: {{ simulationResults.teams.blue.assists }}</p>
            <p>推塔: {{ 9 - simulationResults.teams.blue.towers }}</p>
            <p>经济: {{ Math.round(simulationResults.teams.blue.gold) }}</p>
            <p>基地血�? {{ simulationResults.teams.blue.baseHealth }}</p>
        </div>
        <div class="team-result">
          <h5>红色�?/h5>
            <p>击杀: {{ simulationResults.teams.red.kills }}</p>
            <p>助攻: {{ simulationResults.teams.red.assists }}</p>
            <p>推塔: {{ 9 - simulationResults.teams.red.towers }}</p>
            <p>经济: {{ Math.round(simulationResults.teams.red.gold) }}</p>
            <p>基地血�? {{ simulationResults.teams.red.baseHealth }}</p>
        </div>
      </div>
    </div>

    <!-- 趋势分析 -->
    <div class="trend-analysis">
      <h4>趋势分析</h4>
      <div class="trend-charts">
        <!-- 趋势图表区域 -->
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>

defineProps({
  timeRange: {
    type: String,
    default: 'month',
  },
  gameConfig: {
    type: Object,
    default: () => ({
      mode: 'classic',
      steps: 100,
    }),
  },
  blueTeam: {
    type: Array,
    default: () => Array(5).fill({ heroId: '', lane: 'top' }),
  },
  redTeam: {
    type: Array,
    default: () => Array(5).fill({ heroId: '', lane: 'top' }),
  },
  simulationResults: {
    type: Object,
    default: null,
  },
  allHeroes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  'update:timeRange',
  'update:gameConfig',
  'update:blueTeam',
  'update:redTeam',
  'updatePlayerHero',
]);

// 方法
function numberFormat(value: number | string): string {
  return parseFloat(value).toFixed(1);
}

function getKPITrendClass(): string {
  return 'stable';
}

function getKPITrendIcon(): string {
  return '�?;
}

function getKPITrendValue(): string {
  return '0.0';
}

function handleTimeRangeChange(event: Event): void {
  emit('update:timeRange', (event.target as HTMLSelectElement).value);
}

function handleGameModeChange(event: Event): void {
  emit('update:gameConfig', {
    ...gameConfig,
    mode: (event.target as HTMLSelectElement).value,
  });
}

function handleStepsChange(event: Event): void {
  emit('update:gameConfig', {
    ...gameConfig,
    steps: parseInt((event.target as HTMLSelectElement).value, 10) || 100,
  });
}

function updatePlayerHero(team: string, index: number, heroId: string): void {
  emit('updatePlayerHero', team, index, heroId);
}
</script>


