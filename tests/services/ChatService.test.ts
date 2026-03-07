import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatService, type Contact, type ChatMessage } from '@/services/ChatService';

describe('ChatService', () => {
  // 测试数据
  const mockContacts: Contact[] = [
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
  ];

  describe('getContacts', () => {
    it('should return all contacts', () => {
      const contacts = ChatService.getContacts();
      expect(contacts).toBeDefined();
      expect(contacts.length).toBeGreaterThan(0);
      expect(contacts[0]).toHaveProperty('id');
      expect(contacts[0]).toHaveProperty('name');
      expect(contacts[0]).toHaveProperty('avatar');
      expect(contacts[0]).toHaveProperty('lastMessage');
      expect(contacts[0]).toHaveProperty('unread');
      expect(contacts[0]).toHaveProperty('stage');
    });

    it('should return a copy of the contacts array', () => {
      const contacts1 = ChatService.getContacts();
      const contacts2 = ChatService.getContacts();
      expect(contacts1).not.toBe(contacts2); // 应该是不同的引用
      expect(contacts1).toEqual(contacts2); // 但内容应该相同
    });
  });

  describe('getCurrentContact', () => {
    it('should return the contact with the given id', () => {
      const currentContact = ChatService.getCurrentContact(mockContacts, 2);
      expect(currentContact.id).toBe(2);
      expect(currentContact.name).toBe('美术');
    });

    it('should return the first contact when id is null', () => {
      const currentContact = ChatService.getCurrentContact(mockContacts, null);
      expect(currentContact.id).toBe(1);
      expect(currentContact.name).toBe('研发');
    });

    it('should return the first contact when id is not found', () => {
      const currentContact = ChatService.getCurrentContact(mockContacts, 999);
      expect(currentContact.id).toBe(1);
      expect(currentContact.name).toBe('研发');
    });

    it('should return undefined when contacts array is empty', () => {
      const currentContact = ChatService.getCurrentContact([], 1);
      expect(currentContact).toBeUndefined();
    });
  });

  describe('clearUnreadMessages', () => {
    it('should clear unread messages for a specific contact', () => {
      const updatedContacts = ChatService.clearUnreadMessages(mockContacts, 1);
      const targetContact = updatedContacts.find(contact => contact.id === 1);
      expect(targetContact?.unread).toBe(0);
    });

    it('should not change other contacts', () => {
      const updatedContacts = ChatService.clearUnreadMessages(mockContacts, 1);
      const unchangedContact = updatedContacts.find(contact => contact.id === 2);
      expect(unchangedContact?.unread).toBe(2); // 保持原有状态
    });

    it('should return the same array length', () => {
      const updatedContacts = ChatService.clearUnreadMessages(mockContacts, 1);
      expect(updatedContacts.length).toBe(mockContacts.length);
    });

    it('should handle non-existent contact id', () => {
      const updatedContacts = ChatService.clearUnreadMessages(mockContacts, 999);
      expect(updatedContacts).toEqual(mockContacts); // 没有变化
    });

    it('should handle empty contacts array', () => {
      const updatedContacts = ChatService.clearUnreadMessages([], 1);
      expect(updatedContacts).toEqual([]);
    });
  });

  describe('generateChatContent', () => {
    it('should generate chat content for 研发', () => {
      const chatContent = ChatService.generateChatContent(1, '研发');
      expect(chatContent.messages).toBeDefined();
      expect(chatContent.messages.length).toBeGreaterThan(0);
      expect(chatContent.replies).toBeDefined();
      expect(chatContent.replies.length).toBeGreaterThan(0);
      expect(chatContent.replies.includes('确认通过')).toBe(true);
    });

    it('should generate chat content for 美术', () => {
      const chatContent = ChatService.generateChatContent(2, '美术');
      expect(chatContent.messages).toBeDefined();
      expect(chatContent.messages.length).toBeGreaterThan(0);
      expect(chatContent.replies).toBeDefined();
      expect(chatContent.replies.length).toBeGreaterThan(0);
      expect(chatContent.replies.includes('设计通过')).toBe(true);
    });

    it('should generate chat content for 运营', () => {
      const chatContent = ChatService.generateChatContent(3, '运营');
      expect(chatContent.messages).toBeDefined();
      expect(chatContent.messages.length).toBeGreaterThan(0);
      expect(chatContent.replies).toBeDefined();
      expect(chatContent.replies.length).toBeGreaterThan(0);
      expect(chatContent.replies.includes('方案通过')).toBe(true);
    });

    it('should generate default chat content for unknown contact', () => {
      const chatContent = ChatService.generateChatContent(999, '未知联系人');
      expect(chatContent.messages).toBeDefined();
      expect(chatContent.messages.length).toBe(1);
      expect(chatContent.replies).toBeDefined();
      expect(chatContent.replies.length).toBeGreaterThan(0);
      expect(chatContent.replies.includes('询问当前工作')).toBe(true);
    });

    it('should return valid message objects', () => {
      const chatContent = ChatService.generateChatContent(1, '研发');
      chatContent.messages.forEach((message: ChatMessage) => {
        expect(message).toHaveProperty('sender');
        expect(message).toHaveProperty('content');
        expect(message).toHaveProperty('time');
        expect(['contact', 'user']).toContain(message.sender);
      });
    });
  });

  describe('generateAutoReply', () => {
    it('should return a valid auto reply string', () => {
      const autoReply = ChatService.generateAutoReply();
      expect(typeof autoReply).toBe('string');
      expect(autoReply.length).toBeGreaterThan(0);
    });

    it('should return one of the predefined auto replies', () => {
      const autoReplies = [
        '好的，我会按照您的指示处理',
        '收到，立即执行',
        '明白了，感谢您的反馈',
        '我会尽快跟进此事',
        '没问题，我会调整方案',
      ];
      const autoReply = ChatService.generateAutoReply();
      expect(autoReplies).toContain(autoReply);
    });

    it('should return different auto replies when called multiple times', () => {
      const replies = new Set();
      for (let i = 0; i < 10; i++) {
        replies.add(ChatService.generateAutoReply());
      }
      expect(replies.size).toBeGreaterThan(1); // 应该有不同的回复
    });
  });

  describe('getCurrentTime', () => {
    it('should return a valid time string in the correct format', () => {
      const timeString = ChatService.getCurrentTime();
      expect(typeof timeString).toBe('string');
      // 验证时间格式：HH:MM
      expect(/^\d{2}:\d{2}$/.test(timeString)).toBe(true);
    });

    it('should return a string with correct length', () => {
      const timeString = ChatService.getCurrentTime();
      expect(timeString.length).toBe(5); // HH:MM格式应该是5个字符
    });

    // 模拟Date对象，测试特定时间
    it('should return the correct time when mocked', () => {
      // 保存原始Date对象
      const originalDate = global.Date;
      
      // 创建固定时间的Date模拟
      const mockDate = new Date('2023-01-01T14:30:00');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      const timeString = ChatService.getCurrentTime();
      expect(timeString).toBe('14:30');
      
      // 恢复原始Date对象
      global.Date = originalDate;
    });
  });
});
