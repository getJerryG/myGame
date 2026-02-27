<template>
  <div
    v-if="showAssessment"
    class="assessment-panel"
  >
    <div class="assessment-content">
      <h2 class="assessment-title">月度考核结果</h2>
      <div class="assessment-results">
        <div
          class="result-item"
          :class="{ passed: assessmentResult.downloads }"
        >
          <span class="result-label">下载�?</span>
          <span class="result-value">{{ businessData.downloads }}/{{ assessment.currentMonthTarget.downloads }}</span>
          <span class="result-status">{{
            assessmentResult.downloads ? '�? : '�?
          }}</span>
        </div>
        <div
          class="result-item"
          :class="{ passed: assessmentResult.activeUsers }"
        >
          <span class="result-label">活跃用户:</span>
          <span class="result-value"
            >{{ businessData.activeUsers }}/{{ assessment.currentMonthTarget.activeUsers }}</span
          >
          <span class="result-status">{{
            assessmentResult.activeUsers ? '�? : '�?
          }}</span>
        </div>
        <div
          class="result-item"
          :class="{ passed: assessmentResult.positiveReviews }"
        >
          <span class="result-label">好评�?</span>
          <span class="result-value"
            >{{ businessData.positiveReviews }}/{{ assessment.currentMonthTarget.positiveReviews }}</span
          >
          <span class="result-status">{{
            assessmentResult.positiveReviews ? '�? : '�?
          }}</span>
        </div>
        <div
          class="result-item"
          :class="{ passed: assessmentResult.revenue }"
        >
          <span class="result-label">收入:</span>
          <span class="result-value"
            >¥{{ businessData.totalRevenue }}/¥{{ assessment.currentMonthTarget.revenue }}</span
          >
          <span class="result-status">{{
            assessmentResult.revenue ? '�? : '�?
          }}</span>
        </div>
      </div>
      <div
        class="assessment-conclusion"
        :class="{ passed: assessmentResult.allPassed }"
      >
        <h3>{{ assessmentResult.allPassed ? '考核通过!' : '考核失败!' }}</h3>
        <p>
          {{ assessmentResult.allPassed ? '下个月目标已提高' : '游戏结束' }}
        </p>
      </div>
      <button
        class="assessment-close"
        @click="closeAssessment"
      >
        关闭
      </button>
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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.assessment-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgb(0 0 0 / 20%);
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
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px;
  text-align: center;
}

.assessment-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.result-item.passed {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.result-label {
  font-size: 14px;
  color: #64748b;
}

.result-value {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.result-status {
  font-size: 16px;
  font-weight: 600;
}

.result-item.passed .result-status {
  color: #16a34a;
}

.result-item:not(.passed) .result-status {
  color: #dc2626;
}

.assessment-conclusion {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.assessment-conclusion.passed {
  background: #f0fdf4;
  color: #16a34a;
}

.assessment-conclusion:not(.passed) {
  background: #fee2e2;
  color: #dc2626;
}

.assessment-conclusion h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
}

.assessment-conclusion p {
  margin: 0;
  font-size: 14px;
}

.assessment-close {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.assessment-close:hover {
  background: #2980b9;
}

/* 响应式设�? */
@media (width <= 768px) {
  .assessment-content {
    padding: 20px;
    margin: 20px;
  }

  .assessment-title {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .result-item {
    padding: 10px;
  }

  .result-label,
  .result-value {
    font-size: 13px;
  }

  .assessment-conclusion {
    padding: 15px;
    margin-bottom: 15px;
  }

  .assessment-conclusion h3 {
    font-size: 16px;
  }

  .assessment-conclusion p {
    font-size: 13px;
  }

  .assessment-close {
    padding: 10px;
    font-size: 13px;
  }
}

/* 横屏手机适配 */
@media (orientation: landscape) and (height <= 600px) {
  .assessment-content {
    padding: 20px;
    margin: 10px;
  }

  .assessment-title {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .result-item {
    padding: 10px;
  }

  .result-label,
  .result-value {
    font-size: 12px;
  }

  .assessment-conclusion {
    padding: 15px;
    margin-bottom: 15px;
  }

  .assessment-conclusion h3 {
    font-size: 16px;
  }

  .assessment-conclusion p {
    font-size: 12px;
  }

  .assessment-close {
    padding: 10px;
    font-size: 12px;
  }
}
</style>
