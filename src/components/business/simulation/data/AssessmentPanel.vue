<template>
  <div v-if="showAssessment" class="assessment-panel">
    <div class="assessment-content">
      <h2 class="assessment-title">月度考核结果</h2>
      <div class="assessment-results">
        <div
          class="result-item"
          :class="{ passed: assessmentResult.downloads }"
        >
          <span class="result-label">下载量:</span>
          <span class="result-value"
            >{{ businessData.downloads }}/{{
              assessment.currentMonthTarget.downloads
            }}</span
          >
          <span class="result-status">{{
            assessmentResult.downloads ? "✓" : "✗"
          }}</span>
        </div>
        <div
          class="result-item"
          :class="{ passed: assessmentResult.activeUsers }"
        >
          <span class="result-label">活跃用户:</span>
          <span class="result-value"
            >{{ businessData.activeUsers }}/{{
              assessment.currentMonthTarget.activeUsers
            }}</span
          >
          <span class="result-status">{{
            assessmentResult.activeUsers ? "✓" : "✗"
          }}</span>
        </div>
        <div
          class="result-item"
          :class="{ passed: assessmentResult.positiveReviews }"
        >
          <span class="result-label">好评率:</span>
          <span class="result-value"
            >{{ businessData.positiveReviews }}/{{
              assessment.currentMonthTarget.positiveReviews
            }}</span
          >
          <span class="result-status">{{
            assessmentResult.positiveReviews ? "✓" : "✗"
          }}</span>
        </div>
        <div class="result-item" :class="{ passed: assessmentResult.revenue }">
          <span class="result-label">收入:</span>
          <span class="result-value"
            >¥{{ businessData.totalRevenue }}/¥{{
              assessment.currentMonthTarget.revenue
            }}</span
          >
          <span class="result-status">{{
            assessmentResult.revenue ? "✓" : "✗"
          }}</span>
        </div>
      </div>
      <div
        class="assessment-conclusion"
        :class="{ passed: assessmentResult.allPassed }"
      >
        <h3>{{ assessmentResult.allPassed ? "考核通过!" : "考核失败!" }}</h3>
        <p>
          {{ assessmentResult.allPassed ? "下个月目标已提高" : "游戏结束" }}
        </p>
      </div>
      <button class="assessment-close" @click="closeAssessment">关闭</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AssessmentPanel',
  props: {
    showAssessment: {
      type: Boolean,
      default: false,
    },
    businessData: {
      type: Object,
      required: true,
    },
    assessment: {
      type: Object,
      required: true,
    },
    assessmentResult: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeAssessment(): void {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
/* 考核面板 */
.assessment-panel {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 50%);

  @include utils.flex-center;

  z-index: tokens.$z-modal;
  animation: fadeIn 0.3s ease;

  .assessment-content {
    background: white;
    border-radius: tokens.$radius-xl;
    padding: tokens.$spacing-xl;
    max-width: 500px;
    width: 90%;
    box-shadow: tokens.$shadow-xl;
    animation: slideInUp 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .assessment-title {
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$gray-800;
    margin: 0 0 tokens.$spacing-lg;
    text-align: center;
  }

  .assessment-results {
    @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);

    margin-bottom: tokens.$spacing-lg;

    .result-item {
      @include utils.flex-between(center);

      padding: tokens.$spacing-sm;
      background: tokens.$gray-50;
      border-radius: tokens.$radius-md;
      border: 1px solid tokens.$gray-200;

      &.passed {
        background: rgb(16 185 129 / 5%);
        border-color: rgb(16 185 129 / 20%);
      }

      .result-label {
        font-size: tokens.$font-size-sm;
        color: tokens.$gray-500;
      }

      .result-value {
        font-size: tokens.$font-size-sm;
        font-weight: tokens.$font-weight-medium;
        color: tokens.$gray-800;
      }

      .result-status {
        font-size: tokens.$font-size-lg;
        font-weight: tokens.$font-weight-semibold;
      }

      &.passed {
        .result-status {
          color: tokens.$success-green;
        }
      }

      &:not(.passed) {
        .result-status {
          color: tokens.$danger-red;
        }
      }
    }
  }

  .assessment-conclusion {
    padding: tokens.$spacing-lg;
    border-radius: tokens.$radius-md;
    text-align: center;
    margin-bottom: tokens.$spacing-lg;

    &.passed {
      background: rgb(16 185 129 / 5%);
      color: tokens.$success-green;
    }

    &:not(.passed) {
      background: rgb(239 68 68 / 5%);
      color: tokens.$danger-red;
    }

    h3 {
      margin: 0 0 tokens.$spacing-xs;
      font-size: tokens.$font-size-lg;
      font-weight: tokens.$font-weight-semibold;
    }

    p {
      margin: 0;
      font-size: tokens.$font-size-sm;
    }
  }

  .assessment-close {
    width: 100%;
    padding: tokens.$spacing-sm;
    background: tokens.$primary-blue;
    color: white;
    border: none;
    border-radius: tokens.$radius-md;
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-medium;
    cursor: pointer;
    transition: background-color tokens.$transition-normal;

    &:hover {
      background: tokens.$primary-dark;
    }
  }
}

/* 响应式设�? */
@include utils.mobile {
  .assessment-panel {
    .assessment-content {
      padding: tokens.$spacing-lg;
      margin: tokens.$spacing-lg;
    }

    .assessment-title {
      font-size: tokens.$font-size-lg;
      margin-bottom: tokens.$spacing-md;
    }

    .result-item {
      padding: tokens.$spacing-sm;

      .result-label,
      .result-value {
        font-size: tokens.$font-size-xs;
      }
    }

    .assessment-conclusion {
      padding: tokens.$spacing-md;
      margin-bottom: tokens.$spacing-md;

      h3 {
        font-size: tokens.$font-size-base;
      }

      p {
        font-size: tokens.$font-size-xs;
      }
    }

    .assessment-close {
      padding: tokens.$spacing-sm;
      font-size: tokens.$font-size-xs;
    }
  }
}

/* 横屏手机适配 */
@include utils.landscape-mobile {
  .assessment-panel {
    .assessment-content {
      padding: tokens.$spacing-lg;
      margin: tokens.$spacing-sm;
    }

    .assessment-title {
      font-size: tokens.$font-size-lg;
      margin-bottom: tokens.$spacing-md;
    }

    .result-item {
      padding: tokens.$spacing-sm;

      .result-label,
      .result-value {
        font-size: tokens.$font-size-xs;
      }
    }

    .assessment-conclusion {
      padding: tokens.$spacing-md;
      margin-bottom: tokens.$spacing-md;

      h3 {
        font-size: tokens.$font-size-base;
      }

      p {
        font-size: tokens.$font-size-xs;
      }
    }

    .assessment-close {
      padding: tokens.$spacing-sm;
      font-size: tokens.$font-size-xs;
    }
  }
}
</style>
