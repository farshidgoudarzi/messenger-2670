const Sequelize = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  user1LastReadTime: {
    type: Sequelize.DATE,
    allowNull: true
  },
  user2LastReadTime: {
    type: Sequelize.DATE,
    allowNull: true
  },
});

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
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

Conversation.markAsRead = async function (conversationId, userId) {
  const conversation = await Conversation.findOne({
    where: {
      id: {
        [Sequelize.Op.eq]: conversationId
      },
      // Result should be null if userId provided is not in channel:
      [Sequelize.Op.or]: [
        {
          user1Id:
          {
            [Sequelize.Op.eq]: userId
          }
        },
        {
          user2Id:
          {
            [Sequelize.Op.eq]: userId
          }
        }
      ]
    }
  });

  if (!conversation) throw 'conversationId not valid';

  const readTime = new Date();
  await conversation.update(
    userId === conversation.user1Id ?
      { user1LastReadTime: readTime } :
      { user2LastReadTime: readTime }
  )

  return {
    userId,
    conversationId,
    readTime
  };
}

module.exports = Conversation;
