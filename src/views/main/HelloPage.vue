<template>
  <div class="hello-modal">
    <!-- 主要内容 -->
    <div class="hello-content">
      <!-- 关闭按钮 -->
      <button class="close-button" @click="emit('close')">×</button>

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
          <form @submit.prevent="handleSubmit" class="user-form">
            <!-- 策划名输入 -->
            <div class="form-group">
              <label for="plannerName" class="form-label">策划名</label>
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
              <div v-if="errors.plannerName" class="error-message">
                {{ errors.plannerName }}
              </div>
              <div class="char-count">{{ formData.plannerName.length }}/15</div>
            </div>

            <!-- 游戏名输入 -->
            <div class="form-group">
              <label for="gameName" class="form-label">游戏名</label>
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
              <div v-if="errors.gameName" class="error-message">
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
              {{ submitting ? "提交中..." : "开始游戏" }}
            </button>

            <!-- 提交结果反馈 -->
            <div
              v-if="submitResult"
              :class="[
                'submit-result',
                submitResult.success ? 'success' : 'error',
              ]"
            >
              {{ submitResult.message }}
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 新手引导系统 -->
    <NewbieGuide :is-visible="showGuide" @close="showGuide = false" />
  </div>
</template>

<script setup lang="ts">
import NewbieGuide from "@/components/common/NewbieGuide/index.vue";

// const router = useRouter();

// 表单数据
const formData = ref({
  plannerName: "",
  gameName: "",
});

// 表单验证错误
const errors = ref({
  plannerName: "",
  gameName: "",
});

// 提交状态
const submitting = ref(false);
const submitResult = ref<{ success: boolean; message: string } | null>(null);

// 新手引导显示状态
const showGuide = ref(false);

// 验证单个字段
const validateField = (field: "plannerName" | "gameName"): void => {
  const value = formData.value[field];
  errors.value[field] = "";

  if (!value.trim()) {
    errors.value[field] =
      field === "plannerName" ? "请输入策划名" : "请输入游戏名";
    return;
  }

  if (field === "plannerName" && (value.length < 1 || value.length > 15)) {
    errors.value.plannerName = "策划名长度必须在1-15个字符之间";
  } else if (field === "gameName" && (value.length < 1 || value.length > 20)) {
    errors.value.gameName = "游戏名长度必须在1-20个字符之间";
  }
};

// 验证整个表单
const validateForm = (): boolean => {
  validateField("plannerName");
  validateField("gameName");
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
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return;

  submitting.value = true;
  submitResult.value = null;

  try {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 保存用户信息到localStorage
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        plannerName: formData.value.plannerName,
        gameName: formData.value.gameName,
      }),
    );

    // 显示成功消息
    submitResult.value = {
      success: true,
      message: "游戏创建成功！即将进入新手引导...",
    };

    // 延迟显示新手引导
    setTimeout(() => {
      showGuide.value = true;
    }, 1500);
  } catch {
    // 显示错误消息
    submitResult.value = {
      success: false,
      message: "提交失败，请重试",
    };
  } finally {
    submitting.value = false;
  }
};

// 定义事件
const emit = defineEmits(["close"]);

// 监听新手引导关闭，触发关闭事件
watch(showGuide, (newVal) => {
  if (!newVal) {
    // 新手引导关闭后触发关闭事件
    emit("close");
  }
});
</script>

<style lang="scss" scoped>
.hello-modal {
  width: 100%;
  height: 100%;

  @include utils.flex-center;

  font-family: tokens.$font-family-base;
  position: relative;
  background: linear-gradient(
    135deg,
    tokens.$bg-dark 0%,
    tokens.$bg-secondary 50%,
    tokens.$bg-tertiary 100%
  );
  border-radius: tokens.$radius-xl;
  overflow: hidden;
  box-shadow: tokens.$shadow-xl;
  max-width: tokens.$max-content-width;
  max-height: 90vh;
}

/* 关闭按钮样式 */
.close-button {
  position: absolute;
  top: tokens.$spacing-md;
  right: tokens.$spacing-md;
  background: tokens.$bg-lighter;
  border: 2px solid rgb(255 255 255 / 30%);
  color: tokens.$text-primary;
  font-size: tokens.$font-size-2xl;
  width: 40px;
  height: 40px;
  border-radius: 50%;

  @include utils.flex-center;

  cursor: pointer;
  transition: all tokens.$transition-normal;
  z-index: 10;
  backdrop-filter: blur(tokens.$spacing-xs);

  &:hover {
    background: tokens.$bg-light;
    border-color: tokens.$primary;
    transform: rotate(90deg);
  }
}

.hello-content {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: tokens.$spacing-2xl;
  z-index: 1;
  max-width: tokens.$max-content-width;
  width: 100%;
  padding: tokens.$spacing-md;
}

.left-column,
.right-column {
  @include utils.flex-col(tokens.$spacing-md, stretch, center);

  flex: 1;
  width: 50%;
  min-width: 300px;
  max-width: 500px;
  padding: tokens.$spacing-xl;
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
  color: tokens.$text-primary;
}

.welcome-title {
  font-size: tokens.$font-size-4xl;
  font-weight: tokens.$font-weight-bold;
  margin: 0 0 tokens.$spacing-sm;
  opacity: 0.9;
}

.game-name {
  font-size: tokens.$font-size-5xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary;
  text-shadow: 0 0 20px rgb(74 158 255 / 50%);
  margin: 0 0 tokens.$spacing-sm;
  animation: titleGlow 2s ease-in-out infinite alternate;
  line-height: tokens.$line-height-tight;
}

.welcome-subtitle {
  font-size: tokens.$font-size-xl;
  color: tokens.$text-primary;
  margin: 0 0 tokens.$spacing-xl;
  opacity: 0.9;
  font-weight: tokens.$font-weight-medium;
}

.welcome-description {
  color: tokens.$text-primary;
  opacity: 0.85;
  font-size: tokens.$font-size-lg;
  line-height: tokens.$line-height-relaxed;

  p {
    margin: 0 0 tokens.$spacing-sm;

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
  background-color: tokens.$bg-lighter;
  backdrop-filter: blur(10px);
  border-radius: tokens.$radius-xl;
  padding: tokens.$spacing-xl;
  width: 100%;
  box-shadow: tokens.$shadow-lg;
  border: 1px solid rgb(255 255 255 / 20%);
}

.form-title {
  color: tokens.$text-primary;
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  margin: 0 0 tokens.$spacing-xl;
  text-align: center;
  text-shadow: 0 2px 10px rgb(0 0 0 / 30%);
}

/* 表单样式 */
.user-form {
  @include utils.flex-col(tokens.$spacing-lg);
}

.form-group {
  @include utils.flex-col(tokens.$spacing-xs);
}

.form-label {
  color: tokens.$text-primary;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;
  opacity: 0.9;
}

.form-input {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  font-size: tokens.$font-size-base;
  border: 2px solid rgb(255 255 255 / 20%);
  border-radius: tokens.$radius-md;
  background-color: tokens.$bg-lighter;
  color: tokens.$text-primary;
  transition: all tokens.$transition-normal;
  outline: none;
  backdrop-filter: blur(tokens.$spacing-xs);

  &::placeholder {
    color: tokens.$text-muted;
  }

  &:focus {
    border-color: tokens.$primary;
    background-color: tokens.$bg-light;
    box-shadow: 0 0 0 3px rgb(74 158 255 / 20%);
  }

  &.error {
    border-color: tokens.$error;
    background-color: rgb(239 68 68 / 10%);
  }
}

.char-count {
  align-self: flex-end;
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
  margin-top: -5px;
}

.error-message {
  color: tokens.$error;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
}

/* 提交按钮样式 */
.submit-button {
  padding: tokens.$spacing-md tokens.$spacing-xl;
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  background: linear-gradient(
    135deg,
    tokens.$primary 0%,
    tokens.$primary-dark 100%
  );
  border: none;
  border-radius: tokens.$radius-full;
  cursor: pointer;
  transition: all tokens.$transition-normal;
  box-shadow: 0 4px 15px rgb(74 158 255 / 40%);
  width: 100%;
  min-height: 60px;

  @include utils.flex-center;

  margin-top: tokens.$spacing-sm;

  &:hover {
    &:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgb(74 158 255 / 60%);
      background: linear-gradient(
        135deg,
        tokens.$primary-dark 0%,
        tokens.$primary 100%
      );
    }
  }

  &:active {
    &:not(:disabled) {
      transform: translateY(-1px);
    }
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
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  text-align: center;
  margin-top: tokens.$spacing-sm;
  transition: all tokens.$transition-normal;
  animation: fadeIn 0.5s ease;

  &.success {
    background-color: rgb(16 185 129 / 20%);
    color: tokens.$success;
    border: 1px solid rgb(16 185 129 / 40%);
  }

  &.error {
    background-color: rgb(239 68 68 / 20%);
    color: tokens.$error;
    border: 1px solid rgb(239 68 68 / 40%);
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
@media (width <=992px) {
  .hello-content {
    flex-direction: column;
    gap: tokens.$spacing-xl;
  }

  .left-column,
  .right-column {
    width: 100%;
    max-width: 600px;
    padding: tokens.$spacing-lg tokens.$spacing-md;
  }

  .left-column {
    align-items: center;
    text-align: center;
  }
}

@media (width <=768px) {
  .welcome-title {
    font-size: tokens.$font-size-3xl;
  }

  .game-name {
    font-size: tokens.$font-size-4xl;
  }

  .welcome-subtitle {
    font-size: tokens.$font-size-lg;
  }

  .welcome-description {
    font-size: tokens.$font-size-base;
    line-height: tokens.$line-height-normal;
  }

  .form-container {
    padding: tokens.$spacing-lg tokens.$spacing-md;
  }

  .form-title {
    font-size: tokens.$font-size-xl;
  }

  .form-input {
    padding: tokens.$spacing-sm;
    font-size: tokens.$font-size-sm;
  }

  .submit-button {
    padding: tokens.$spacing-sm tokens.$spacing-xl;
    font-size: tokens.$font-size-lg;
    min-height: 55px;
  }
}

@media (width <=480px) {
  .welcome-title {
    font-size: tokens.$font-size-2xl;
  }

  .game-name {
    font-size: tokens.$font-size-3xl;
  }

  .welcome-subtitle {
    font-size: tokens.$font-size-base;
  }

  .left-column,
  .right-column {
    padding: tokens.$spacing-md tokens.$spacing-xs;
  }

  .form-container {
    padding: tokens.$spacing-lg tokens.$spacing-xs;
  }

  .form-title {
    font-size: tokens.$font-size-lg;
  }

  .form-input {
    padding: tokens.$spacing-xs tokens.$spacing-sm;
    font-size: tokens.$font-size-sm;
  }

  .submit-button {
    padding: tokens.$spacing-xs tokens.$spacing-lg;
    font-size: tokens.$font-size-base;
    min-height: 50px;
  }
}
</style>
