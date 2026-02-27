<template>
  <div class="collab-center-app">
    <!-- 应用标题 -->
    <div class="app-header">
      <h2>联动中心</h2>
      <button
        class="create-collab-btn"
        @click="showCreateModal = true"
      >
        创建联动
      </button>
    </div>

    <!-- 标签页导航 -->
    <div class="tab-nav">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'ongoing' }"
        @click="activeTab = 'ongoing'"
      >
        进行中
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'completed' }"
        @click="activeTab = 'completed'"
      >
        已完成
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        全部
      </button>
    </div>

    <!-- 标签页内容 -->
    <div class="app-content">
      <!-- 联动项目列表 -->
      <div class="collab-list">
        <div
          v-for="collab in currentCollabs"
          :key="collab.id"
          class="collab-item"
          :class="{ ongoing: collab.status === '进行中', completed: collab.status === '已结束' }"
        >
          <div class="collab-info">
            <div class="collab-header">
              <div class="collab-name">{{ collab.name }}</div>
              <div
                class="collab-status"
                :class="collab.status"
              >
                {{ collab.status }}
              </div>
            </div>
            <div class="collab-description">{{ collab.description }}</div>
            <div class="collab-meta">
              <span class="meta-item">开始时间: {{ collab.startTime }}</span>
              <span class="meta-item">结束时间: {{ collab.endTime }}</span>
              <span class="meta-item">预期收益: {{ collab.expectedRevenue }}</span>
            </div>
          </div>
          <div class="collab-actions">
            <button
              class="action-btn view-detail"
              @click="viewCollabDetail(collab.id)"
            >
              查看详情
            </button>
            <button
              class="action-btn end-collab"
              @click="endCollab(collab.id)"
              v-if="collab.status === '进行中'"
            >
              结束联动
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="currentCollabs.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">📊</div>
        <div class="empty-text">暂无联动项目</div>
        <button
          class="create-first-btn"
          @click="showCreateModal = true"
        >
          创建第一个联动
        </button>
      </div>
    </div>

    <!-- 创建联动模态框 -->
    <div
      v-if="showCreateModal"
      class="modal-overlay"
      @click="showCreateModal = false"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <div class="modal-header">
          <h3>创建新联动</h3>
          <button
            class="close-btn"
            @click="showCreateModal = false"
          >
            ×
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createCollab">
            <div class="form-group">
              <label for="collab-name">联动名称</label>
              <input
                type="text"
                id="collab-name"
                v-model="newCollab.name"
                required
                placeholder="输入联动名称"
              />
            </div>
            <div class="form-group">
              <label for="collab-description">联动描述</label>
              <textarea
                id="collab-description"
                v-model="newCollab.description"
                required
                placeholder="输入联动描述"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="collab-revenue">预期收益</label>
              <input
                type="number"
                id="collab-revenue"
                v-model.number="newCollab.expectedRevenue"
                required
                placeholder="输入预期收益"
                min="0"
              />
            </div>
            <div class="form-actions">
              <button
                type="button"
                class="btn-cancel"
                @click="showCreateModal = false"
              >
                取消
              </button>
              <button
                type="submit"
                class="btn-create"
              >
                创建
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 定义联动项目类型
interface Collab {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: '进行中' | '已结束';
  expectedRevenue: number;
  actualRevenue?: number;
}

// 活跃标签页
const activeTab = ref('all');

// 模拟联动数据
const collabs = ref<Collab[]>([
  {
    id: 'collab-1',
    name: '与知名IP联动活动',
    description: '与某知名动漫IP进行联动，推出限定皮肤和活动',
    startTime: '2024-01-01',
    endTime: '2024-01-31',
    status: '进行中',
    expectedRevenue: 500000,
  },
  {
    id: 'collab-2',
    name: '节日主题联动',
    description: '春节主题联动活动，推出限定英雄和皮肤',
    startTime: '2023-12-01',
    endTime: '2024-01-15',
    status: '已结束',
    expectedRevenue: 300000,
    actualRevenue: 350000,
  },
]);

// 计算当前显示的联动项目
const currentCollabs = computed(() => {
  if (activeTab.value === 'ongoing') {
    return collabs.value.filter((collab) => collab.status === '进行中');
  } else if (activeTab.value === 'completed') {
    return collabs.value.filter((collab) => collab.status === '已结束');
  } else {
    return collabs.value;
  }
});

// 创建联动模态框
const showCreateModal = ref(false);
const newCollab = ref<Omit<Collab, 'id' | 'startTime' | 'endTime' | 'status'>>({
  name: '',
  description: '',
  expectedRevenue: 0,
});

// 创建联动
const createCollab = () => {
  const now = new Date();
  const collab: Collab = {
    id: `collab-${Date.now()}`,
    name: newCollab.value.name,
    description: newCollab.value.description,
    startTime: now.toISOString().split('T')[0],
    endTime: new Date(now.setMonth(now.getMonth() + 1)).toISOString().split('T')[0],
    status: '进行中',
    expectedRevenue: newCollab.value.expectedRevenue,
  };
  collabs.value.push(collab);
  showCreateModal.value = false;
  // 重置表单
  newCollab.value = {
    name: '',
    description: '',
    expectedRevenue: 0,
  };
};

// 查看联动详情
const viewCollabDetail = (collabId: string) => {
  console.log('查看联动详情:', collabId);
  // 这里可以跳转到详情页或显示详情模态框
};

// 结束联动
const endCollab = (collabId: string) => {
  const collab = collabs.value.find((c) => c.id === collabId);
  if (collab) {
    collab.status = '已结束';
    // 模拟实际收益
    collab.actualRevenue = Math.floor(collab.expectedRevenue * (0.8 + Math.random() * 0.4));
  }
};
</script>

<style lang="scss" scoped>
.collab-center-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgb(26 26 46 / 95%);
  color: #fff;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: rgb(74 158 255 / 10%);
  border-bottom: 1px solid rgb(74 158 255 / 30%);
}

.app-header h2 {
  margin: 0;
  color: #4a9eff;
  font-size: 18px;
  font-weight: bold;
}

.create-collab-btn {
  padding: 8px 16px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.create-collab-btn:hover {
  background-color: #357abd;
}

/* 标签页导航 */
.tab-nav {
  display: flex;
  padding: 0 20px;
  background-color: rgb(0 0 0 / 20%);
  border-bottom: 1px solid rgb(74 158 255 / 30%);
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  color: #4a9eff;
  border-bottom-color: #4a9eff;
}

/* 应用内容 */
.app-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 联动列表 */
.collab-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.collab-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.collab-item:hover {
  background-color: rgb(0 0 0 / 30%);
  transform: translateY(-2px);
}

.collab-item.ongoing {
  border-left: 4px solid #4a9eff;
}

.collab-item.completed {
  border-left: 4px solid #52c41a;
  opacity: 0.8;
}

.collab-info {
  flex: 1;
}

.collab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.collab-name {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.collab-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.collab-status.进行中 {
  background-color: rgb(74 158 255 / 20%);
  color: #4a9eff;
}

.collab-status.已结束 {
  background-color: rgb(82 196 26 / 20%);
  color: #52c41a;
}

.collab-description {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 12px;
  line-height: 1.4;
}

.collab-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #888;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.collab-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.view-detail {
  background-color: rgb(74 158 255 / 20%);
  color: #4a9eff;
}

.view-detail:hover {
  background-color: rgb(74 158 255 / 40%);
}

.end-collab {
  background-color: rgb(255 107 107 / 20%);
  color: #ff6b6b;
}

.end-collab:hover {
  background-color: rgb(255 107 107 / 40%);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #aaa;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 20px;
}

.create-first-btn {
  padding: 10px 20px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.create-first-btn:hover {
  background-color: #357abd;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 80%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgb(26 26 46 / 95%);
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 30px rgb(0 0 0 / 50%);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  color: #4a9eff;
  font-size: 18px;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #fff;
}

.modal-body {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  background-color: rgb(0 0 0 / 30%);
  border: 1px solid rgb(74 158 255 / 30%);
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4a9eff;
  box-shadow: 0 0 0 2px rgb(74 158 255 / 20%);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel,
.btn-create {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: rgb(255 255 255 / 20%);
  color: white;
}

.btn-cancel:hover {
  background-color: rgb(255 255 255 / 30%);
}

.btn-create {
  background-color: #4a9eff;
  color: white;
}

.btn-create:hover {
  background-color: #357abd;
}

/* 滚动条样式 */
.app-content::-webkit-scrollbar {
  width: 8px;
}

.app-content::-webkit-scrollbar-track {
  background: rgb(0 0 0 / 20%);
}

.app-content::-webkit-scrollbar-thumb {
  background: rgb(74 158 255 / 50%);
  border-radius: 4px;
}

.app-content::-webkit-scrollbar-thumb:hover {
  background: rgb(74 158 255 / 80%);
}
</style>
