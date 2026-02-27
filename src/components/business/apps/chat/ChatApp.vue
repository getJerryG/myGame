<template>
  <ApplicationWindow windowTitle="聊天">
    <template #sidebar>
      <div class="chat-contacts">
        <div
          v-for="contact in contacts"
          :key="contact.id"
          :class="[
            'contact-item',
            {
              active: activeContactId === contact.id,
              'has-unread': contact.unread > 0,
            },
          ]"
          @click="selectContact(contact.id)"
        >
          <div class="contact-avatar">{{ contact.avatar }}</div>
          <div class="contact-info">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-last-message">
              {{ contact.lastMessage }}
            </div>
          </div>
          <div
            class="contact-unread"
            v-if="contact.unread > 0"
          >
            {{ contact.unread }}
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div class="chat-area">
        <div class="chat-header">
          <div class="contact-avatar">{{ currentContact?.avatar }}</div>
          <div class="contact-name text-gold">{{ currentContact?.name }}</div>
        </div>

        <div class="chat-messages">
          <div
            v-for="(message, index) in chatMessages"
            :key="index"
            class="message"
            :class="message.sender === 'contact' ? 'contact-message' : 'user-message'"
          >
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>

        <div
          class="chat-options-area"
          v-if="replyOptions.length > 0"
        >
          <div class="options-header">选择回复</div>
          <div class="options-list">
            <button
              v-for="(option, index) in replyOptions"
              :key="index"
              class="option-btn"
              @click="selectReply(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';

defineProps<{
  app?: any;
  gameData?: any;
  modal?: any;
}>();

const activeContactId = ref(null);
const contacts = ref([
  {
    id: 1,
    name: '研发',
    avatar: '👨‍💻',
    lastMessage: '新英雄技能设计已完成，需要您确认',
    unread: 1,
    stage: 'early',
  },
  {
    id: 2,
    name: '美术',
    avatar: '🎨',
    lastMessage: '皮肤设计稿已更新，请查看',
    unread: 2,
    stage: 'mid',
  },
  {
    id: 3,
    name: '运营',
    avatar: '📊',
    lastMessage: '本周活动方案已准备好',
    unread: 0,
    stage: 'early',
  },
  {
    id: 4,
    name: '玩家社区',
    avatar: '👥',
    lastMessage: '玩家对新英雄反响热烈',
    unread: 0,
    stage: 'late',
  },
  {
    id: 5,
    name: '老板',
    avatar: '👑',
    lastMessage: '需要一份季度运营报告',
    unread: 0,
    stage: 'late',
  },
  {
    id: 6,
    name: 'IP合作',
    avatar: '🤝',
    lastMessage: '关于联动项目的进一步讨论',
    unread: 0,
    stage: 'mid',
  },
]);

const chatMessages = ref([
  {
    sender: 'contact',
    content: '您好，欢迎来到游戏策划模拟系统！',
    time: '10:00',
  },
]);

const replyOptions = ref<string[]>([]);

const selectContact = (contactId: number): void => {
  activeContactId.value = contactId;
  const contact = contacts.value.find((c) => c.id === contactId);
  if (contact) {
    contact.unread = 0;
  }
  generateChatContent(contactId);
};

const currentContact = computed(() => {
  return contacts.value.find((contact) => contact.id === activeContactId.value) || contacts.value[0];
});

const generateChatContent = (contactId: number): void => {
  const contact = contacts.value.find((c) => c.id === contactId);
  if (!contact) return;

  chatMessages.value = [];
  replyOptions.value = [];

  switch (contact.name) {
    case '研发':
      chatMessages.value = [
        {
          sender: 'contact',
          content: '新英雄技能设计已完成，您需要进行确认',
          time: '10:00',
        },
        {
          sender: 'contact',
          content: '技能：造成物理伤害并减速',
          time: '10:01',
        },
        {
          sender: 'contact',
          content: '技能：位移并强化下次攻击',
          time: '10:01',
        },
        {
          sender: 'contact',
          content: '大招：AOE伤害并眩晕',
          time: '10:01',
        },
      ];
      replyOptions.value = ['确认通过', '需要调整技能数值', '重新设计技能机制'];
      break;

    case '美术':
      chatMessages.value = [
        {
          sender: 'contact',
          content: '皮肤设计稿已更新，请查看',
          time: '10:30',
        },
        {
          sender: 'contact',
          content: '设计风格：古风',
          time: '10:31',
        },
        {
          sender: 'contact',
          content: '特效颜色：金色为主',
          time: '10:31',
        },
      ];
      replyOptions.value = ['设计通过', '调整颜色方案', '修改设计风格'];
      break;

    case '运营':
      chatMessages.value = [
        {
          sender: 'contact',
          content: '本周活动方案已准备好，请审阅',
          time: '11:00',
        },
        {
          sender: 'contact',
          content: '活动类型：新英雄折扣',
          time: '11:01',
        },
        {
          sender: 'contact',
          content: '活动力度：中等',
          time: '11:01',
        },
      ];
      replyOptions.value = ['方案通过', '调整活动力度', '更换活动类型'];
      break;

    case '玩家社区':
      chatMessages.value = [
        {
          sender: 'contact',
          content: '玩家对新英雄反响热烈，胜率达到52%',
          time: '14:00',
        },
        {
          sender: 'contact',
          content: '部分玩家反映技能操作难度较高',
          time: '14:01',
        },
      ];
      replyOptions.value = ['保持现状', '小幅降低技能难度', '加强英雄强度'];
      break;

    case '老板':
      chatMessages.value = [
        {
          sender: 'contact',
          content: '需要一份季度运营报告，明天下午之前提交',
          time: '15:00',
        },
      ];
      replyOptions.value = ['立即准备报告', '需要更多时间', '请求协助'];
      break;

    case 'IP合作':
      chatMessages.value = [
        {
          sender: 'contact',
          content: '关于联动项目，我们希望增加更多定制内容',
          time: '16:00',
        },
        {
          sender: 'contact',
          content: '预算可能需要增加20%',
          time: '16:01',
        },
      ];
      replyOptions.value = ['同意增加预算', '协商调整内容', '拒绝修改方案'];
      break;

    default:
      chatMessages.value = [
        {
          sender: 'contact',
          content: '您好，我�?{contact.name}，有什么可以帮助您的吗？',
          time: '10:00',
        },
      ];
      replyOptions.value = ['询问当前工作', '请求帮助', '结束对话'];
  }
};

const selectReply = (option: string): void => {
  chatMessages.value.push({
    sender: 'user',
    content: option,
    time: new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  });

  replyOptions.value = [];

  setTimeout(() => {
    const autoReplies = [
      '好的，我会按照您的指示处理',
      '收到，立即执行',
      '明白了，感谢您的反馈',
      '我会尽快跟进此事',
      '没问题，我会调整方案',
    ];
    const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

    chatMessages.value.push({
      sender: 'contact',
      content: randomReply,
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    const contact = contacts.value.find((c) => c.id === activeContactId.value);
    if (contact?.name === '研发') {
      replyOptions.value = ['继续推进', '需要进一步讨论', '查看研发进度'];
    }
  }, 1000);
};

watch(
  () => currentContact.value,
  (newContact) => {
    if (newContact) {
      generateChatContent(newContact.id);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
/* 联系人列�? */
.chat-contacts {
  width: 100%;
  height: 100%;
  background-color: var(--sidebar-bg, #2a2a3a);
  overflow-y: auto;
  padding: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background-color: var(--card-bg, #2a2a3a);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color, transparent);
}

.contact-item:hover {
  background-color: var(--sidebar-hover, rgb(74 158 255 / 10%));
  border-color: var(--primary-color, rgb(74 158 255 / 30%));
}

.contact-item.active {
  background-color: var(--sidebar-active, rgb(74 158 255 / 20%));
  border-color: var(--sidebar-active-border, rgb(74 158 255 / 50%));
  border-right: 3px solid var(--sidebar-active-border, #4a9eff);
}

.contact-item.has-unread {
  border-left: 3px solid var(--danger-color, #ff4757);
}

.contact-avatar {
  font-size: 24px;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-weight: var(--font-bold, 700);
  color: var(--text-primary, #fff);
  margin-bottom: 4px;
  font-size: 14px;
}

.contact-last-message {
  color: var(--text-secondary, #b0b0b0);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-unread {
  background-color: var(--danger-color, #ff4757);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: var(--font-bold, 700);
}

/* 聊天区域 */
.chat-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--content-bg, #1e1e2e);
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: var(--card-bg, #2a2a3a);
  border-bottom: 1px solid var(--border-color, rgb(74 158 255 / 20%));
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 70%;
  padding: 12px;
  border-radius: 8px;
  word-wrap: break-word;
}

.contact-message {
  align-self: flex-start;
  background-color: var(--contact-message-bg, rgb(74 158 255 / 20%));
  border: 1px solid var(--contact-message-border, rgb(74 158 255 / 30%));
}

.user-message {
  align-self: flex-end;
  background-color: var(--user-message-bg, rgb(255 71 87 / 20%));
  border: 1px solid var(--user-message-border, rgb(255 71 87 / 30%));
}

.message-content {
  margin-bottom: 4px;
  color: var(--text-primary, #fff);
  line-height: 1.4;
}

.message-time {
  font-size: 10px;
  color: var(--text-secondary, #b0b0b0);
  text-align: right;
}

.chat-options-area {
  padding: 16px;
  background-color: var(--card-bg, #2a2a3a);
  border-top: 1px solid var(--border-color, rgb(74 158 255 / 20%));
}

.options-header {
  color: var(--text-primary, #fff);
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: var(--font-bold, 700);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-btn {
  padding: 12px 16px;
  background-color: var(--button-bg, rgb(74 158 255 / 20%));
  border: 1px solid var(--button-border, rgb(74 158 255 / 30%));
  border-radius: 8px;
  color: var(--text-primary, #fff);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-weight: var(--font-semibold, 600);
}

.option-btn:hover {
  background-color: var(--button-hover, rgb(74 158 255 / 30%));
  border-color: var(--button-hover-border, rgb(74 158 255 / 50%));
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgb(74 158 255 / 20%);
}

/* 滚动条样�? */
.chat-contacts::-webkit-scrollbar,
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-contacts::-webkit-scrollbar-track,
.chat-messages::-webkit-scrollbar-track {
  background: var(--scrollbar-track, rgb(0 0 0 / 10%));
  border-radius: 4px;
}

.chat-contacts::-webkit-scrollbar-thumb,
.chat-messages::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, rgb(74 158 255 / 50%));
  border-radius: 4px;
}

.chat-contacts::-webkit-scrollbar-thumb:hover,
.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover, rgb(74 158 255 / 70%));
}
</style>
