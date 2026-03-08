<template>
  <div class="collab-center-app">
    <!-- 应用标题 -->
    <div class="app-header">
      <h2>联动中心</h2>
      <button class="create-collab-btn" @click="showCreateModal = true">
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
          :class="{
            ongoing: collab.status === '进行中',
            completed: collab.status === '已结束',
          }"
        >
          <div class="collab-info">
            <div class="collab-header">
              <div class="collab-name">{{ collab.name }}</div>
              <div class="collab-status" :class="collab.status">
                {{ collab.status }}
              </div>
            </div>
            <div class="collab-description">{{ collab.description }}</div>
            <div class="collab-meta">
              <span class="meta-item">开始时间: {{ collab.startTime }}</span>
              <span class="meta-item">结束时间: {{ collab.endTime }}</span>
              <span class="meta-item"
                >预期收益: {{ collab.expectedRevenue }}</span
              >
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
      <div v-if="currentCollabs.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <div class="empty-text">暂无联动项目</div>
        <button class="create-first-btn" @click="showCreateModal = true">
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
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>创建新联动</h3>
          <button class="close-btn" @click="showCreateModal = false">×</button>
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
              <button type="submit" class="btn-create">创建</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入联动服务
import { CollabService, type Collab, type CreateCollabParams } from '@/services/app/CollabService';

// 活跃标签页
const activeTab = ref("all");

// 联动数据
const collabs = ref<Collab[]>(CollabService.getCollabs());

// 计算当前显示的联动项目
const currentCollabs = computed(() => {
  return CollabService.filterCollabsByStatus(collabs.value, activeTab.value);
});

// 创建联动模态框
const showCreateModal = ref(false);
const newCollab = ref<CreateCollabParams>({
  name: "",
  description: "",
  expectedRevenue: 0,
});

// 创建联动
const createCollab = (): void => {
  const createdCollab = CollabService.createCollab(newCollab.value);
  collabs.value.push(createdCollab);
  showCreateModal.value = false;
  // 重置表单
  newCollab.value = {
    name: "",
    description: "",
    expectedRevenue: 0,
  };
};

// 查看联动详情
const viewCollabDetail = (collabId: string): void => {
  const collab = CollabService.getCollabDetail(collabId, collabs.value);
  // 查看联动详情的逻辑
};

// 结束联动
const endCollab = (collabId: string): void => {
  collabs.value = CollabService.endCollab(collabId, collabs.value);
};
</script>

<style lang="scss" scoped>
.collab-center-app {
  width: 100%;
  height: 100%;

  @include utils.flex-col(0, stretch, flex-start);

  background-color: tokens.$bg-secondary;
  color: tokens.$text-primary;
}

.app-header {
  @include utils.flex-between;

  padding: tokens.$spacing-md tokens.$spacing-lg;
  background-color: rgba(tokens.$primary-blue, 0.1);
  border-bottom: 1px solid rgba(tokens.$primary-blue, 0.3);

  h2 {
    margin: 0;
    color: tokens.$primary-blue;
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
  }
}

.create-collab-btn {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$primary-blue;
  color: tokens.$text-primary;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$primary-dark;
  }
}

/* 标签页导航 */
.tab-nav {
  @include utils.flex-row(0, center, flex-start);

  padding: 0 tokens.$spacing-lg;
  background-color: tokens.$bg-light;
  border-bottom: 1px solid rgba(tokens.$primary-blue, 0.3);
}

.tab-btn {
  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: none;
  border: none;
  color: tokens.$text-muted;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  transition: all tokens.$transition-fast;
  border-bottom: 3px solid transparent;

  &:hover {
    color: tokens.$text-primary;
  }

  &.active {
    color: tokens.$primary-blue;
    border-bottom-color: tokens.$primary-blue;
  }
}

/* 应用内容 */
.app-content {
  flex: 1;
  padding: tokens.$spacing-lg;
  overflow-y: auto;

  @include utils.custom-scrollbar;
}

/* 联动列表 */
.collab-list {
  @include utils.flex-col(tokens.$spacing-md);
}

.collab-item {
  @include utils.flex-between;

  padding: tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: rgba(tokens.$bg-light, 1.5);
    transform: translateY(-2px);
  }

  &.ongoing {
    border-left: 4px solid tokens.$primary-blue;
  }

  &.completed {
    border-left: 4px solid tokens.$success;
    opacity: 0.8;
  }
}

.collab-info {
  flex: 1;
}

.collab-header {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-sm;
}

.collab-name {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
}

.collab-status {
  padding: tokens.$spacing-xs tokens.$spacing-md;
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;

  &.进行中 {
    background-color: rgba(tokens.$primary-blue, 0.2);
    color: tokens.$primary-blue;
  }

  &.已结束 {
    background-color: rgba(tokens.$success, 0.2);
    color: tokens.$success;
  }
}

.collab-description {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
  margin-bottom: tokens.$spacing-md;
  line-height: tokens.$line-height-normal;
}

.collab-meta {
  @include utils.flex-row(tokens.$spacing-md, center, flex-start);

  font-size: tokens.$font-size-xs;
  color: tokens.$gray-500;
}

.meta-item {
  @include utils.flex-row(tokens.$spacing-xs);
}

.collab-actions {
  @include utils.flex-row(tokens.$spacing-sm);

  flex-shrink: 0;
}

.action-btn {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  transition: all tokens.$transition-fast;
}

.view-detail {
  background-color: rgba(tokens.$primary-blue, 0.2);
  color: tokens.$primary-blue;

  &:hover {
    background-color: rgba(tokens.$primary-blue, 0.4);
  }
}

.end-collab {
  background-color: rgba(tokens.$error, 0.2);
  color: tokens.$error;

  &:hover {
    background-color: rgba(tokens.$error, 0.4);
  }
}

/* 空状态 */
.empty-state {
  @include utils.flex-col(tokens.$spacing-md, center, center);

  height: 200px;
  color: tokens.$text-muted;
  text-align: center;
}

.empty-icon {
  font-size: tokens.$font-size-4xl;
  margin-bottom: tokens.$spacing-md;
}

.empty-text {
  font-size: tokens.$font-size-base;
  margin-bottom: tokens.$spacing-lg;
}

.create-first-btn {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$primary-blue;
  color: tokens.$text-primary;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$primary-dark;
  }
}

/* 模态框样式 */
.modal-overlay {
  @include utils.modal-overlay;
}

.modal-content {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  width: 90%;
  max-width: 500px;
  box-shadow: tokens.$shadow-xl;
}

.modal-header {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-lg;

  h3 {
    margin: 0;
    color: tokens.$primary-blue;
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
  }
}

.close-btn {
  background: none;
  border: none;
  color: tokens.$text-muted;
  font-size: tokens.$font-size-2xl;
  cursor: pointer;
  transition: color tokens.$transition-fast;

  &:hover {
    color: tokens.$text-primary;
  }
}

.modal-body {
  margin-bottom: tokens.$spacing-lg;
}

.form-group {
  margin-bottom: tokens.$spacing-md;

  label {
    display: block;
    margin-bottom: tokens.$spacing-sm;
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  input,
  textarea {
    width: 100%;
    padding: tokens.$spacing-sm;
    background-color: tokens.$bg-light;
    border: 1px solid rgba(tokens.$primary-blue, 0.3);
    border-radius: tokens.$radius-sm;
    color: tokens.$text-primary;
    font-size: tokens.$font-size-sm;
    transition: all tokens.$transition-fast;

    &:focus {
      outline: none;
      border-color: tokens.$primary-blue;
      box-shadow: 0 0 0 2px rgba(tokens.$primary-blue, 0.2);
    }
  }
}

.form-actions {
  @include utils.flex-row(tokens.$spacing-sm, center, flex-end);

  margin-top: tokens.$spacing-xl;
}

.btn-cancel,
.btn-create {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  transition: all tokens.$transition-fast;
}

.btn-cancel {
  background-color: tokens.$bg-lighter;
  color: tokens.$text-primary;

  &:hover {
    background-color: rgba(tokens.$bg-lighter, 1.5);
  }
}

.btn-create {
  background-color: tokens.$primary-blue;
  color: tokens.$text-primary;

  &:hover {
    background-color: tokens.$primary-dark;
  }
}
</style>
