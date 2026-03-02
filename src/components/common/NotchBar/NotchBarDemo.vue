<template>
  <div class="notch-bar-demo">
    <h2>NotchBar 资金动画演示</h2>

    <div class="demo-controls">
      <div class="control-group">
        <label>当前资金：{{ funds }}</label>
        <div class="button-group">
          <button @click="addFunds(100)">+100</button>
          <button @click="addFunds(500)">+500</button>
          <button @click="addFunds(1000)">+1000</button>
          <button @click="subtractFunds(100)">-100</button>
          <button @click="subtractFunds(500)">-500</button>
          <button @click="subtractFunds(1000)">-1000</button>
        </div>
      </div>

      <div class="control-group">
        <label>等级名称：{{ levelName }}</label>
        <input v-model="levelName" type="text" />
      </div>

      <div class="control-group">
        <label>等级段位：{{ levelRank }}</label>
        <select v-model="levelRank">
          <option value="I">I</option>
          <option value="II">II</option>
          <option value="III">III</option>
          <option value="IV">IV</option>
          <option value="V">V</option>
        </select>
      </div>

      <div class="control-group">
        <label>当前经验：{{ currentExp }}</label>
        <input v-model.number="currentExp" type="number" />
      </div>

      <div class="control-group">
        <label>最大经验：{{ maxExp }}</label>
        <input v-model.number="maxExp" type="number" />
      </div>
    </div>

    <div class="demo-preview">
      <NotchBar
        :level-name="levelName"
        :level-rank="levelRank"
        :current-exp="currentExp"
        :max-exp="maxExp"
        :funds="funds"
      />
    </div>

    <div class="demo-info">
      <h3>功能说明：</h3>
      <ul>
        <li>✅ 资金变化时显示 "+数字" 或 "-数字" 提示</li>
        <li>✅ 提示元素从上方滑入并淡出</li>
        <li>✅ 数字从当前值平滑滚动到目标值（500ms）</li>
        <li>✅ 增加显示红色提示，减少显示绿色提示</li>
        <li>✅ 使用 easeOutQuart 缓动函数，动画流畅自然</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NotchBar from './index.vue';

const funds = ref(10000);
const levelName = ref('策划');
const levelRank = ref('III');
const currentExp = ref(75);
const maxExp = ref(100);

const addFunds = (amount: number) => {
  funds.value += amount;
};

const subtractFunds = (amount: number) => {
  if (funds.value >= amount) {
    funds.value -= amount;
  }
};
</script>

<style lang="scss" scoped>
.notch-bar-demo {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 30px;
    font-size: 24px;
    color: #fff;
    text-align: center;
  }
}

.demo-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;

  .control-group {
    background: rgb(255 255 255 / 10%);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid rgb(255 215 0 / 20%);

    label {
      display: block;
      margin-bottom: 10px;
      color: #ffd700;
      font-weight: bold;
    }

    input,
    select {
      width: 100%;
      padding: 8px;
      background: rgb(255 255 255 / 10%);
      border: 1px solid rgb(255 215 0 / 30%);
      border-radius: 4px;
      color: #fff;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #ffd700;
      }
    }
  }

  .button-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 10px;

    button {
      padding: 8px 16px;
      background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
      border: none;
      border-radius: 4px;
      color: #1a1a2e;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgb(255 215 0 / 40%);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

.demo-preview {
  margin: 40px 0;
  padding: 20px;
  background: rgb(0 0 0 / 30%);
  border-radius: 8px;
  border: 2px solid rgb(255 215 0 / 30%);
}

.demo-info {
  background: rgb(255 255 255 / 5%);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #ffd700;

  h3 {
    margin-bottom: 15px;
    color: #ffd700;
    font-size: 18px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 8px 0;
      color: #fff;
      font-size: 14px;

      &::before {
        content: "✓ ";
        color: #22c55e;
        font-weight: bold;
        margin-right: 8px;
      }
    }
  }
}
</style>
