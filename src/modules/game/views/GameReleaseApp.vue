<template>
  <ApplicationWindow
    title="游戏发布"
    title-icon="📦"
    :sidebar-items="sidebarItems"
    :active-item-id="activeModule"
    @update:active-item-id="activeModule = $event"
    @item-click="handleModuleClick"
  >
    <template #header-actions>
      <button
        class="btn-primary"
        @click="createNewVersion"
      >
        发布新版本      </button>
    </template>

    <!-- 版本管理 -->
    <section
      v-if="activeModule === 'version-management'"
      class="module-section"
    >
      <div class="section-header">
        <h2>版本管理</h2>
      </div>

      <div class="version-info">
        <div class="version-details">
          <p class="version-change">
              <strong>发布版本</strong>{{ currentVersion.oldVersion }} →
              <span class="text-gold">{{ currentVersion.newVersion }}</span>
            </p>
          <p><strong>游戏时间</strong>{{ currentVersion.gameDate }}</p>
          <p class="update-description-title">
            <strong>更新说明</strong>
          </p>
          <div class="update-description-list">
            <span class="update-description-item">
              <span class="text-gold">{{ currentVersion.description.heroes }}</span>
              个英雄            </span>
            <span class="update-description-item">
              <span class="text-gold">{{ currentVersion.description.skins }}</span>
              个皮肤            </span>
            <span class="update-description-item">
              <span class="text-gold">{{ currentVersion.description.activities }}</span>
              个活动            </span>
            <span class="update-description-item">
              <span class="text-gold">{{ currentVersion.description.optimizations }}</span>
              项优化            </span>
          </div>
        </div>
      </div>

      <div class="version-history">
        <h3>历史版本</h3>
        <table class="version-table">
          <thead>
            <tr>
              <th>版本号</th>
              <th>版本变更</th>
              <th>游戏时间</th>
              <th>更新说明</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="versionHistory.length > 0">
              <td>{{ versionHistory[0].version }}</td>
              <td>
                {{ versionHistory[0].oldVersion }} →
                {{ versionHistory[0].newVersion }}
              </td>
              <td>{{ versionHistory[0].gameDate }}</td>
              <td>
                <div class="compact-description">
                  {{ versionHistory[0].description.heroes }}英雄 / {{ versionHistory[0].description.skins }}皮肤 /
                  {{ versionHistory[0].description.activities }}活动 /
                  {{ versionHistory[0].description.optimizations }}优化
                </div>
              </td>
              <td>
                <button
                  class="btn-compare"
                  @click="compareVersion(versionHistory[0])"
                >
                  对比
                </button>
                <button
                  class="btn-rollback"
                  @click="rollbackVersion(versionHistory[0])"
                >
                  回滚
                </button>
              </td>
            </tr>
            <tr v-else>
              <td
                colspan="5"
                style="text-align: center; color: var(--app-text-secondary)"
              >
                暂无历史版本
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 发布结果展示 -->
    <section
      v-if="activeModule === 'release-results'"
      class="module-section"
    >
      <div class="section-header">
        <h2>发布结果展示</h2>
        <select
          class="select-filter"
          v-model="releaseFilter"
        >
          <option value="all">全部</option>
          <option value="success">成功</option>
          <option value="failed">失败</option>
          <option value="pending">待发布</option>
        </select>
      </div>

      <div class="release-stats">
        <div class="stat-card">
          <h3>{{ releaseStats.total }}</h3>
          <p>总发布项</p>
        </div>
        <div class="stat-card success">
          <h3>{{ releaseStats.success }}</h3>
          <p>成功</p>
        </div>
        <div class="stat-card failed">
          <h3>{{ releaseStats.failed }}</h3>
          <p>失败</p>
        </div>
        <div class="stat-card pending">
          <h3>{{ releaseStats.pending }}</h3>
          <p>待发布</p>
        </div>
      </div>

      <div class="release-history">
        <table class="release-table">
          <thead>
            <tr>
              <th>项目类型</th>
              <th>项目名称</th>
              <th>版本</th>
              <th>状态</th>
              <th>发布时间</th>
              <th>操作员</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="release in filteredReleases"
              :key="release.id"
            >
              <td>{{ release.type }}</td>
              <td>{{ release.name }}</td>
              <td>{{ release.version }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="release.status"
                  >{{ release.status }}</span
                >
              </td>
              <td>{{ release.releaseTime }}</td>
              <td>{{ release.operator }}</td>
              <td>
                <button
                  class="btn-preview"
                  @click="viewReleaseDetail(release)"
                >
                  详情
                </button>
                <button
                  class="btn-logs"
                  @click="viewReleaseLogs(release)"
                >
                  日志
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue';
import { useHeroSkinStore } from '@/stores/heroSkinStore';
import { useSimulationCareerSystemStore } from '@/stores/simulation/simulationCareerSystemStore';
import { useSimulationStore } from '@/stores/simulationStore';
import { useSimulationGameStateStore } from '@/stores/simulation/simulationGameStateStore';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';
import type { SidebarItem } from '@/components/common/window/ApplicationWindow.vue';

interface Version {
  version: string;
  oldVersion: string;
  newVersion: string;
  gameDate: string;
  description: {
    heroes: number;
    skins: number;
    activities: number;
    optimizations: number;
  };
}

interface ReleaseItem {
  id: string;
  type: string;
  name: string;
  version: string;
  status: 'success' | 'failed' | 'pending';
  releaseTime: string;
  operator: string;
}

const heroSkinStore = useHeroSkinStore();
const _careerSystemStore = useSimulationCareerSystemStore();

const sidebarItems: SidebarItem[] = [
  { id: 'version-management', name: '版本管理', icon: '📦' },
  { id: 'release-results', name: '发布结果展示', icon: '📊' },
];

const activeModule = ref('version-management');
const releaseFilter = ref('all');

const updateDescription = computed(() => {
  return {
    heroes: heroSkinStore.heroes.length,
    skins: heroSkinStore.skins.length,
    activities: 0,
    optimizations: 0,
  };
});

const currentVersion = ref<Version>({
  version: '1.1.0',
  oldVersion: '1.0.1',
  newVersion: '1.1.0',
  gameDate: '2024-01-01',
  description: updateDescription.value,
});

watch(
  updateDescription,
  (newDescription) => {
    currentVersion.value.description = newDescription;
  },
  { deep: true }
);

const nextVersionInfo = computed(() => {
  const currentVer = currentVersion.value.newVersion;
  const parts = currentVer.split('.').map(Number);

  parts[2] = (parts[2] || 0) + 1;
  const nextVer = parts.join('.');

  return {
    version: nextVer,
    newVersion: nextVer,
    oldVersion: currentVer,
  };
});

const versionHistory = ref<Version[]>([]);

const releaseHistory = ref<ReleaseItem[]>([
  { id: '1',
    type: '英雄',
    name: '弓箭手',
    version: '1.1.0',
    status: 'success',
    releaseTime: '2024-02-01 10:00:00',
    operator: '管理员',
  },
  {
    id: '2',
    type: '皮肤',
    name: '剑圣-传说皮肤',
    version: '1.0.0',
    status: 'success',
    releaseTime: '2024-01-15 14:30:00',
    operator: '管理员',
  },
  {
    id: '3',
    type: '活动',
    name: '新版本更新活动',
    version: '1.1.0',
    status: 'failed',
    releaseTime: '2024-02-01 09:00:00',
    operator: '管理员',
  },
  {
    id: '4',
    type: '英雄',
    name: '法师',
    version: '1.0.0',
    status: 'success',
    releaseTime: '2024-01-15 10:00:00',
    operator: '管理员',
  },
  {
    id: '5',
    type: '活动',
    name: '春节活动',
    version: '1.0.0',
    status: 'pending',
    releaseTime: '2024-02-01 00:00:00',
    operator: '管理员',
  },
]);

const filteredReleases = computed(() => {
  if (releaseFilter.value === 'all') {
    return releaseHistory.value;
  }
  return releaseHistory.value.filter((release) => release.status === releaseFilter.value);
});

const releaseStats = computed(() => {
  return {
    total: releaseHistory.value.length,
    success: releaseHistory.value.filter((r) => r.status === 'success').length,
    failed: releaseHistory.value.filter((r) => r.status === 'failed').length,
    pending: releaseHistory.value.filter((r) => r.status === 'pending').length,
  };
});

const viewReleaseDetail = (release: ReleaseItem): void => {
  alert(
    `查看${release.name}的发布详情\n版本: ${release.version}\n状�? ${release.status}\n发布时间: ${release.releaseTime}`
  );
};

const viewReleaseLogs = (release: ReleaseItem): void => {
  alert(
    `查看${release.name}的发布日志\n发布时间: ${release.releaseTime}\n操作�? ${release.operator}\n状�? ${release.status}`
  );
};

const compareVersion = (version: Version): void => {
  alert(
    `对比版本\n当前版本: ${currentVersion.value.version}\n对比版本: ${version.version}\n\n当前版本变更: ${currentVersion.value.oldVersion} �?${currentVersion.value.newVersion}\n对比版本变更: ${version.oldVersion} �?${version.newVersion}\n\n当前版本游戏时间: ${currentVersion.value.gameDate}\n对比版本游戏时间: ${version.gameDate}\n\n当前版本更新说明:\n${currentVersion.value.description.heroes}个英�?/ ${currentVersion.value.description.skins}个皮�?/ ${currentVersion.value.description.activities}个活�?/ ${currentVersion.value.description.optimizations}项优化\n\n对比版本更新说明:\n${version.description.heroes}个英�?/ ${version.description.skins}个皮�?/ ${version.description.activities}个活�?/ ${version.description.optimizations}项优化`
  );
};

const rollbackVersion = (version: Version): void => {
  if (confirm(`确定要回滚到版本 ${version.version} 吗？`)) {
    currentVersion.value = { ...version };
    alert(`已回滚到版本 ${version.version}`);
  }
};

const addExp = inject('addExp', (_amount: number) => {});

const simulationStore = useSimulationStore();
const gameStateStore = useSimulationGameStateStore();

const createNewVersion = (): void => {
  simulationStore.nextDay();

  const gameDate = gameStateStore.currentDate;
  const formattedDate = `${gameDate.year}-${String(gameDate.month).padStart(2, '0')}-${String(gameDate.day).padStart(2, '0')}`;

  const newVersion: Version = {
    version: nextVersionInfo.value.version,
    oldVersion: nextVersionInfo.value.oldVersion,
    newVersion: nextVersionInfo.value.newVersion,
    gameDate: formattedDate,
    description: updateDescription.value,
  };

  currentVersion.value = newVersion;

  versionHistory.value.unshift(newVersion);

  addExp(100);
};

const handleModuleClick = (item: SidebarItem): void => {
  activeModule.value = item.id;
};
</script>

<style lang="scss" scoped>
.module-section {
  background-color: rgb(26 26 46 / 95%);
  border-radius: var(--app-radius-md);
  padding: 1.5rem;
  box-shadow: var(--app-shadow-secondary);
  border: 1px solid var(--app-border-secondary);
  color: var(--app-text-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--app-border-secondary);
}

.section-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--app-text-primary);
}

.btn-primary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  background-color: #4a9eff;
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.version-info {
  background-color: rgb(26 26 46 / 95%);
  border: 1px solid var(--app-border-secondary);
  border-radius: var(--app-radius-md);
  padding: 1.5rem;
  margin-bottom: 0;
}

.version-info p {
  margin: 0.25rem 0;
  color: var(--app-text-secondary);
}

.version-change {
  font-weight: bold;
}

.update-description-title {
  margin: 0.75rem 0 0.5rem;
  font-weight: bold;
  color: var(--app-text-primary);
}

.update-description-list {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}

.update-description-item {
  display: inline-flex;
  align-items: center;
  color: var(--app-text-secondary);
  margin: 0.25rem 0;
}

.update-description-item .text-gold {
  margin-right: 0.25rem;
}

.version-history {
  margin-top: 1.5rem;
}

.version-history h3 {
  margin: 0 0 1rem;
  color: var(--app-text-primary);
}

.version-table {
  width: 100%;
  border-collapse: collapse;
}

.version-table th,
.version-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--app-border-secondary);
  color: var(--app-text-secondary);
}

.version-table th {
  background-color: rgb(26 26 46 / 95%);
  font-weight: bold;
  color: var(--app-text-primary);
}

.version-table td {
  background-color: rgb(26 26 46 / 95%);
}

.btn-compare,
.btn-rollback,
.btn-preview,
.btn-logs {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  margin-right: 0.5rem;
}

.btn-compare {
  background-color: #4a9eff;
  color: white;
}

.btn-rollback {
  background-color: #ff6b6b;
  color: white;
}

.btn-preview {
  background-color: #95a5a6;
  color: white;
}

.btn-logs {
  background-color: #f39c12;
  color: white;
}

.btn-compare:hover,
.btn-rollback:hover,
.btn-preview:hover,
.btn-logs:hover {
  opacity: 0.9;
}

.select-filter {
  padding: 0.5rem;
  border: 1px solid var(--app-border-secondary);
  border-radius: var(--app-radius-sm);
  font-size: 0.9rem;
  background-color: var(--app-bg-quaternary);
  color: var(--app-text-primary);
  outline: none;
}

.select-filter:focus {
  border-color: var(--app-border-primary);
  box-shadow: 0 0 0 2px rgb(74 158 255 / 20%);
}

.release-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: rgb(26 26 46 / 95%);
  border: 1px solid var(--app-border-secondary);
  border-radius: var(--app-radius-md);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-secondary);
}

.stat-card.success {
  border-color: #67c23a;
}

.stat-card.failed {
  border-color: #ff6b6b;
}

.stat-card.pending {
  border-color: #f39c12;
}

.stat-card h3 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  color: var(--app-text-primary);
}

.stat-card p {
  margin: 0;
  color: var(--app-text-secondary);
  font-size: 0.9rem;
}

.release-history {
  margin-top: 1.5rem;
}

.release-table {
  width: 100%;
  border-collapse: collapse;
}

.release-table th,
.release-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--app-border-secondary);
  color: var(--app-text-secondary);
  background-color: rgb(26 26 46 / 95%);
}

.release-table th {
  background-color: rgb(26 26 46 / 95%);
  font-weight: bold;
  color: var(--app-text-primary);
}

.release-table tr:hover {
  background-color: rgb(74 158 255 / 20%);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.success {
  background-color: #67c23a;
  color: white;
}

.status-badge.failed {
  background-color: #ff6b6b;
  color: white;
}

.status-badge.pending {
  background-color: #f39c12;
  color: white;
}
</style>


