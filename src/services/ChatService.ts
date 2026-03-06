// 定义联系人类型
export interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  stage: string;
}

// 定义消息类型
export interface ChatMessage {
  sender: "contact" | "user";
  content: string;
  time: string;
}

// 聊天服务，负责处理聊天相关的业务逻辑
export class ChatService {
  // 获取所有联系人
  static getContacts(): Contact[] {
    // 这里应该从API或store获取数据，目前使用模拟数据
    return [
      {
        id: 1,
        name: "研发",
        avatar: "👨‍💻",
        lastMessage: "新英雄技能设计已完成，需要您确认",
        unread: 1,
        stage: "early",
      },
      {
        id: 2,
        name: "美术",
        avatar: "🎨",
        lastMessage: "皮肤设计稿已更新，请查看",
        unread: 2,
        stage: "mid",
      },
      {
        id: 3,
        name: "运营",
        avatar: "📊",
        lastMessage: "本周活动方案已准备好",
        unread: 0,
        stage: "early",
      },
      {
        id: 4,
        name: "玩家社区",
        avatar: "👥",
        lastMessage: "玩家对新英雄反响热烈",
        unread: 0,
        stage: "late",
      },
      {
        id: 5,
        name: "老板",
        avatar: "👑",
        lastMessage: "需要一份季度运营报告",
        unread: 0,
        stage: "late",
      },
      {
        id: 6,
        name: "IP合作",
        avatar: "🤝",
        lastMessage: "关于联动项目的进一步讨论",
        unread: 0,
        stage: "mid",
      },
    ];
  }

  // 获取当前联系人
  static getCurrentContact(contacts: Contact[], activeContactId: number | null): Contact {
    return contacts.find((contact) => contact.id === activeContactId) || contacts[0];
  }

  // 清除联系人未读消息
  static clearUnreadMessages(contacts: Contact[], contactId: number): Contact[] {
    return contacts.map(contact => {
      if (contact.id === contactId) {
        return {
          ...contact,
          unread: 0,
        };
      }
      return contact;
    });
  }

  // 生成聊天内容
  static generateChatContent(_contactId: number, contactName: string): { messages: ChatMessage[], replies: string[] } {
    let messages: ChatMessage[] = [];
    let replies: string[] = [];

    switch (contactName) {
      case "研发":
        messages = [
          {
            sender: "contact",
            content: "新英雄技能设计已完成，您需要进行确认",
            time: "10:00",
          },
          {
            sender: "contact",
            content: "技能：造成物理伤害并减速",
            time: "10:01",
          },
          {
            sender: "contact",
            content: "技能：位移并强化下次攻击",
            time: "10:01",
          },
          {
            sender: "contact",
            content: "大招：AOE伤害并眩晕",
            time: "10:01",
          },
        ];
        replies = ["确认通过", "需要调整技能数值", "重新设计技能机制"];
        break;

      case "美术":
        messages = [
          {
            sender: "contact",
            content: "皮肤设计稿已更新，请查看",
            time: "10:30",
          },
          {
            sender: "contact",
            content: "设计风格：古风",
            time: "10:31",
          },
          {
            sender: "contact",
            content: "特效颜色：金色为主",
            time: "10:31",
          },
        ];
        replies = ["设计通过", "调整颜色方案", "修改设计风格"];
        break;

      case "运营":
        messages = [
          {
            sender: "contact",
            content: "本周活动方案已准备好，请审阅",
            time: "11:00",
          },
          {
            sender: "contact",
            content: "活动类型：新英雄折扣",
            time: "11:01",
          },
          {
            sender: "contact",
            content: "活动力度：中等",
            time: "11:01",
          },
        ];
        replies = ["方案通过", "调整活动力度", "更换活动类型"];
        break;

      case "玩家社区":
        messages = [
          {
            sender: "contact",
            content: "玩家对新英雄反响热烈，胜率达到52%",
            time: "14:00",
          },
          {
            sender: "contact",
            content: "部分玩家反映技能操作难度较高",
            time: "14:01",
          },
        ];
        replies = ["保持现状", "小幅降低技能难度", "加强英雄强度"];
        break;

      case "老板":
        messages = [
          {
            sender: "contact",
            content: "需要一份季度运营报告，明天下午之前提交",
            time: "15:00",
          },
        ];
        replies = ["立即准备报告", "需要更多时间", "请求协助"];
        break;

      case "IP合作":
        messages = [
          {
            sender: "contact",
            content: "关于联动项目，我们希望增加更多定制内容",
            time: "16:00",
          },
          {
            sender: "contact",
            content: "预算可能需要增加20%",
            time: "16:01",
          },
        ];
        replies = ["同意增加预算", "协商调整内容", "拒绝修改方案"];
        break;

      default:
        messages = [
          {
            sender: "contact",
            content: `您好，我是${contactName}，有什么可以帮助您的吗？`,
            time: "10:00",
          },
        ];
        replies = ["询问当前工作", "请求帮助", "结束对话"];
    }

    return { messages, replies };
  }

  // 生成自动回复
  static generateAutoReply(): string {
    const autoReplies = [
      "好的，我会按照您的指示处理",
      "收到，立即执行",
      "明白了，感谢您的反馈",
      "我会尽快跟进此事",
      "没问题，我会调整方案",
    ];
    return autoReplies[Math.floor(Math.random() * autoReplies.length)];
  }

  // 获取当前时间字符串
  static getCurrentTime(): string {
    return new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
