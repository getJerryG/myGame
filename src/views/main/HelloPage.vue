<template>
  <div class="hello-modal">
    <!-- 主要内容 -->
    <div class="hello-content">
      <!-- 关闭按钮 -->
      <button
        class="close-button"
        @click="emit('close')"
      >
        ×
      </button>

      <!-- 左侧：欢迎信息 -->
      <div class="left-column">
        <div class="welcome-section">
          <h1 class="welcome-title">欢迎来到</h1>
          <h2 class="game-name">策划大师：王者经营</h2>
          <p class="welcome-subtitle">开始你的游戏开发之旅</p>
          <div class="welcome-description">
            <p>在这个游戏中，你将扮演一名游戏策划师</p>
            <p>从无到有创建属于自己的游戏帝国</p>
            <p>设计游戏玩法、管理团队、制定营销策略</p>
            <p>最终成为游戏行业的王者！</p>
          </div>
        </div>
      </div>

      <!-- 右侧：用户信息表单 -->
      <div class="right-column">
        <div class="form-container">
          <h3 class="form-title">开始新游戏</h3>
          <form
            @submit.prevent="handleSubmit"
            class="user-form"
          >
            <!-- 策划名输入 -->
            <div class="form-group">
              <label
                for="plannerName"
                class="form-label"
                >策划名</label
              >
              <input
                type="text"
                id="plannerName"
                v-model="formData.plannerName"
                class="form-input"
                placeholder="请输入你的策划名（1-15字符）"
                :class="{ error: errors.plannerName }"
                maxlength="15"
                @input="validateField('plannerName')"
              />
              <div
                v-if="errors.plannerName"
                class="error-message"
              >
                {{ errors.plannerName }}
              </div>
              <div class="char-count">{{ formData.plannerName.length }}/15</div>
            </div>

            <!-- 游戏名输入 -->
            <div class="form-group">
              <label
                for="gameName"
                class="form-label"
                >游戏名</label
              >
              <input
                type="text"
                id="gameName"
                v-model="formData.gameName"
                class="form-input"
                placeholder="请输入你要创建的游戏名（1-20字符）"
                :class="{ error: errors.gameName }"
                maxlength="20"
                @input="validateField('gameName')"
              />
              <div
                v-if="errors.gameName"
                class="error-message"
              >
                {{ errors.gameName }}
              </div>
              <div class="char-count">{{ formData.gameName.length }}/20</div>
            </div>

            <!-- 提交按钮 -->
            <button
              type="submit"
              class="submit-button"
              :disabled="!isFormValid"
            >
              {{ submitting ? '提交中...' : '开始游戏' }}
            </button>

            <!-- 提交结果反馈 -->
            <div
              v-if="submitResult"
              :class="['submit-result', submitResult.success ? 'success' : 'error']"
            >
              {{ submitResult.message }}
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 新手引导系统 -->
    <NewbieGuide
      :is-visible="showGuide"
      @close="showGuide = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import NewbieGuide from '@/components/common/NewbieGuide/index.vue';

const router = useRouter();

// 表单数据
const formData = ref({
  plannerName: '',
  gameName: '',
});

// 表单验证错误
const errors = ref({
  plannerName: '',
  gameName: '',
});

// 提交状态
const submitting = ref(false);
const submitResult = ref<{ success: boolean; message: string } | null>(null);

// 新手引导显示状态
const showGuide = ref(false);

// 验证单个字段
const validateField = (field: 'plannerName' | 'gameName') => {
  const value = formData.value[field];
  errors.value[field] = '';

  if (!value.trim()) {
    errors.value[field] = field === 'plannerName' ? '请输入策划名' : '请输入游戏名';
    return;
  }

  if (field === 'plannerName' && (value.length < 1 || value.length > 15)) {
    errors.value.plannerName = '策划名长度必须在1-15个字符之间';
  } else if (field === 'gameName' && (value.length < 1 || value.length > 20)) {
    errors.value.gameName = '游戏名长度必须在1-20个字符之间';
  }
};

// 验证整个表单
const validateForm = () => {
  validateField('plannerName');
  validateField('gameName');
  return !errors.value.plannerName && !errors.value.gameName;
};

// 表单是否有效
const isFormValid = computed(() => {
  return (
    formData.value.plannerName.trim() &&
    formData.value.gameName.trim() &&
    !errors.value.plannerName &&
    !errors.value.gameName
  );
});

// 处理表单提交
const handleSubmit = async () => {
  if (!validateForm()) return;

  submitting.value = true;
  submitResult.value = null;

  try {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 保存用户信息到localStorage
    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        plannerName: formData.value.plannerName,
        gameName: formData.value.gameName,
      })
    );

    // 显示成功消息
    submitResult.value = {
      success: true,
      message: '游戏创建成功！即将进入新手引导...',
    };

    // 延迟显示新手引导
    setTimeout(() => {
      showGuide.value = true;
    }, 1500);
  } catch (error) {
    // 显示错误消息
    submitResult.value = {
      success: false,
      message: '提交失败，请重试',
    };
  } finally {
    submitting.value = false;
  }
};

// 定义事件
const emit = defineEmits(['close']);

// 监听新手引导关闭，触发关闭事件
watch(showGuide, (newVal) => {
  if (!newVal) {
    // 新手引导关闭后触发关闭事件
    emit('close');
  }
});
</script>

<style lang="scss" scoped>
.hello-modal {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgb(0 0 0 / 50%);
  max-width: 1200px;
  max-height: 90vh;
}

/* 关闭按钮样式 */
.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgb(255 255 255 / 10%);
  border: 2px solid rgb(255 255 255 / 30%);
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgb(255 255 255 / 20%);
    border-color: #4a9eff;
    transform: rotate(90deg);
  }
}

@keyframes backgroundPulse {
  from {
    opacity: 0.8;
  }

  to {
    opacity: 1;
  }
}

.hello-content {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 60px;
  z-index: 1;
  max-width: 1200px;
  width: 100%;
  padding: 20px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  width: 50%;
  min-width: 300px;
  max-width: 500px;
  padding: 40px;
}

.left-column {
  align-items: flex-start;
  text-align: left;
}

.right-column {
  align-items: center;
}

/* 欢迎信息样式 */
.welcome-section {
  color: white;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 10px;
  opacity: 0.9;
}

.game-name {
  font-size: 3.5rem;
  font-weight: bold;
  color: #4a9eff;
  text-shadow: 0 0 20px rgb(74 158 255 / 50%);
  margin: 0 0 15px;
  animation: titleGlow 2s ease-in-out infinite alternate;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.3rem;
  color: #fff;
  margin: 0 0 30px;
  opacity: 0.9;
  font-weight: 500;
}

.welcome-description {
  color: #fff;
  opacity: 0.85;
  font-size: 1.1rem;
  line-height: 1.8;

  p {
    margin: 0 0 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

@keyframes titleGlow {
  from {
    text-shadow: 0 0 20px rgb(74 158 255 / 50%);
  }

  to {
    text-shadow:
      0 0 30px rgb(74 158 255 / 80%),
      0 0 40px rgb(74 158 255 / 30%);
  }
}

/* 表单容器样式 */
.form-container {
  background-color: rgb(255 255 255 / 10%);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  box-shadow: 0 10px 40px rgb(0 0 0 / 30%);
  border: 1px solid rgb(255 255 255 / 20%);
}

.form-title {
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 0 30px;
  text-align: center;
  text-shadow: 0 2px 10px rgb(0 0 0 / 30%);
}

/* 表单样式 */
.user-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
}

.form-input {
  padding: 15px 20px;
  font-size: 1rem;
  border: 2px solid rgb(255 255 255 / 20%);
  border-radius: 12px;
  background-color: rgb(255 255 255 / 15%);
  color: white;
  transition: all 0.3s ease;
  outline: none;
  backdrop-filter: blur(5px);

  &::placeholder {
    color: rgb(255 255 255 / 50%);
  }

  &:focus {
    border-color: #4a9eff;
    background-color: rgb(255 255 255 / 20%);
    box-shadow: 0 0 0 3px rgb(74 158 255 / 20%);
  }

  &.error {
    border-color: #ff4757;
    background-color: rgb(255 71 87 / 10%);
  }
}

.char-count {
  align-self: flex-end;
  font-size: 0.85rem;
  color: rgb(255 255 255 / 60%);
  margin-top: -5px;
}

.error-message {
  color: #ff4757;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 提交按钮样式 */
.submit-button {
  padding: 18px 40px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #4a9eff 0%, #357abd 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgb(74 158 255 / 40%);
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgb(74 158 255 / 60%);
    background: linear-gradient(135deg, #357abd 0%, #4a9eff 100%);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgb(74 158 255 / 20%);
  }
}

/* 提交结果反馈样式 */
.submit-result {
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease;

  &.success {
    background-color: rgb(46 204 113 / 20%);
    color: #2ecc71;
    border: 1px solid rgb(46 204 113 / 40%);
  }

  &.error {
    background-color: rgb(231 76 60 / 20%);
    color: #e74c3c;
    border: 1px solid rgb(231 76 60 / 40%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (width <= 992px) {
  .hello-content {
    flex-direction: column;
    gap: 40px;
  }

  .left-column,
  .right-column {
    width: 100%;
    max-width: 600px;
    padding: 30px 20px;
  }

  .left-column {
    align-items: center;
    text-align: center;
  }
}

@media (width <= 768px) {
  .welcome-title {
    font-size: 2rem;
  }

  .game-name {
    font-size: 2.5rem;
  }

  .welcome-subtitle {
    font-size: 1.1rem;
  }

  .welcome-description {
    font-size: 1rem;
    line-height: 1.6;
  }

  .form-container {
    padding: 30px 20px;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-input {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  .submit-button {
    padding: 15px 30px;
    font-size: 1.1rem;
    min-height: 55px;
  }
}

@media (width <= 480px) {
  .welcome-title {
    font-size: 1.8rem;
  }

  .game-name {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .left-column,
  .right-column {
    padding: 20px 15px;
  }

  .form-container {
    padding: 25px 15px;
  }

  .form-title {
    font-size: 1.3rem;
  }

  .form-input {
    padding: 10px 14px;
    font-size: 0.9rem;
  }

  .submit-button {
    padding: 12px 25px;
    font-size: 1rem;
    min-height: 50px;
  }
}
</style>
