const Sequelize = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Sequelize.Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Sequelize.Op.or]: [user1Id, user2Id]
      }
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

Conversation.markAsRead = async function (conversationId, userId) {
  const rawQuery = `
    UPDATE Messages
    SET "isRead" = true
    WHERE "conversationId" = ${conversationId}
    AND "senderId" <> ${userId}
  `;

  await db.query(rawQuery);

  const lastReadMessage = await Message.findOne({
    where: {
      conversationId: {
        [Sequelize.Op.eq]: conversationId
      },
      senderId: {
        [Sequelize.Op.ne]: userId
      }
    },
    order: [["createdAt", "DESC"]],
  });

  return {
    conversationId,
    userId
  };
}

module.exports = Conversation;
