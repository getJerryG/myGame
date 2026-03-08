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
          <div class="contact-unread" v-if="contact.unread > 0">
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
            :class="
              message.sender === 'contact' ? 'contact-message' : 'user-message'
            "
          >
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>

        <div class="chat-options-area" v-if="replyOptions.length > 0">
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
import ApplicationWindow from "@/components/common/window/ApplicationWindow.vue";
import { ChatService, type Contact, type ChatMessage } from '@/services/chat/ChatService';

defineProps<{
  app?: unknown;
  gameData?: unknown;
  modal?: unknown;
}>();

const activeContactId = ref<number | null>(null);
// 从服务获取联系人数据
const contacts = ref<Contact[]>(ChatService.getContacts());

const chatMessages = ref<ChatMessage[]>([
  {
    sender: "contact",
    content: "您好，欢迎来到游戏策划模拟系统！",
    time: "10:00",
  },
]);

const replyOptions = ref<string[]>([]);

const selectContact = (contactId: number): void => {
  activeContactId.value = contactId;
  // 使用服务清除未读消息
  contacts.value = ChatService.clearUnreadMessages(contacts.value, contactId);
  generateChatContent(contactId);
};

const currentContact = computed(() => {
  return ChatService.getCurrentContact(contacts.value, activeContactId.value || 1);
});

const generateChatContent = (contactId: number): void => {
  const contact = contacts.value.find((c) => c.id === contactId);
  if (!contact) return;

  // 使用服务生成聊天内容
  const { messages, replies } = ChatService.generateChatContent(contactId, contact.name);
  chatMessages.value = messages;
  replyOptions.value = replies;
};

const selectReply = (option: string): void => {
  chatMessages.value.push({
    sender: "user",
    content: option,
    time: ChatService.getCurrentTime(),
  });

  replyOptions.value = [];

  setTimeout(() => {
    // 使用服务生成自动回复
    const randomReply = ChatService.generateAutoReply();

    chatMessages.value.push({
      sender: "contact",
      content: randomReply,
      time: ChatService.getCurrentTime(),
    });

    const contact = ChatService.getCurrentContact(contacts.value, activeContactId.value || 1);
    if (contact.name === "研发") {
      replyOptions.value = ["继续推进", "需要进一步讨论", "查看研发进度"];
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
  { immediate: true },
);
</script>

<style lang="scss" scoped>
/* 联系人列表 */
.chat-contacts {
  width: 100%;
  height: 100%;
  background-color: tokens.$bg-secondary;
  overflow-y: auto;
  padding: tokens.$spacing-md;

  @include utils.custom-scrollbar;
}

.contact-item {
  @include utils.flex-row(tokens.$spacing-md, center, flex-start);

  padding: tokens.$spacing-sm;
  margin-bottom: tokens.$spacing-sm;
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  border: 1px solid transparent;

  &:hover {
    background-color: rgba(tokens.$primary-blue, 0.1);
    border-color: rgba(tokens.$primary-blue, 0.3);
  }

  &.active {
    background-color: rgba(tokens.$primary-blue, 0.2);
    border-color: rgba(tokens.$primary-blue, 0.5);
    border-right: 3px solid tokens.$primary-blue;
  }

  &.has-unread {
    border-left: 3px solid tokens.$error;
  }
}

.contact-avatar {
  font-size: tokens.$font-size-2xl;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  margin-bottom: tokens.$spacing-xs;
  font-size: tokens.$font-size-sm;
}

.contact-last-message {
  color: tokens.$text-muted;
  font-size: tokens.$font-size-xs;

  @include utils.text-truncate;
}

.contact-unread {
  background-color: tokens.$error;
  color: tokens.$text-primary;
  border-radius: 50%;
  width: 20px;
  height: 20px;

  @include utils.flex-center;

  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;
}

/* 聊天区域 */
.chat-area {
  width: 100%;
  height: 100%;

  @include utils.flex-col(0, stretch, flex-start);

  background-color: tokens.$bg-primary;
  overflow: hidden;
}

.chat-header {
  @include utils.flex-row(tokens.$spacing-md, center, flex-start);

  padding: tokens.$spacing-md;
  background-color: tokens.$bg-secondary;
  border-bottom: 1px solid rgba(tokens.$primary-blue, 0.2);
}

.chat-messages {
  flex: 1;
  padding: tokens.$spacing-md;
  overflow-y: auto;

  @include utils.flex-col(tokens.$spacing-md);
  @include utils.custom-scrollbar;
}

.message {
  max-width: 70%;
  padding: tokens.$spacing-sm;
  border-radius: tokens.$radius-md;
  word-wrap: break-word;
}

.contact-message {
  align-self: flex-start;
  background-color: rgba(tokens.$primary-blue, 0.2);
  border: 1px solid rgba(tokens.$primary-blue, 0.3);
}

.user-message {
  align-self: flex-end;
  background-color: rgba(tokens.$error, 0.2);
  border: 1px solid rgba(tokens.$error, 0.3);
}

.message-content {
  margin-bottom: tokens.$spacing-xs;
  color: tokens.$text-primary;
  line-height: tokens.$line-height-normal;
}

.message-time {
  font-size: 10px;
  color: tokens.$text-muted;
  text-align: right;
}

.chat-options-area {
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-secondary;
  border-top: 1px solid rgba(tokens.$primary-blue, 0.2);
}

.options-header {
  color: tokens.$text-primary;
  font-size: tokens.$font-size-sm;
  margin-bottom: tokens.$spacing-md;
  font-weight: tokens.$font-weight-bold;
}

.options-list {
  @include utils.flex-col(tokens.$spacing-sm);
}

.option-btn {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: rgba(tokens.$primary-blue, 0.2);
  border: 1px solid rgba(tokens.$primary-blue, 0.3);
  border-radius: tokens.$radius-md;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-sm;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  text-align: left;
  font-weight: tokens.$font-weight-semibold;

  &:hover {
    background-color: rgba(tokens.$primary-blue, 0.3);
    border-color: rgba(tokens.$primary-blue, 0.5);
    transform: translateY(-1px);
    box-shadow: tokens.$shadow-blue;
  }
}
</style>
