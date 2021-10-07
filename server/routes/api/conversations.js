const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, Sequelize } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// Mark as read endpoint:
router.put('/:conversationId/read-flag', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    try {
      const conversationId = parseInt(req.params.conversationId);
      const conversation = await Conversation.findOne({
        where: {
          id: {
            [Op.eq]: conversationId
          }
        }
      });

      if (!conversation) {
        return res.status(400).json({
          message: `Conversation id is not valid.`
        });
      }

      const userId = req.user.id;
      if (![conversation.user1Id, conversation.user2Id].includes(userId)) {
        // User not in the conversation:
        return res.sendStatus(401);
      }

      const data = await Conversation.markAsRead(conversation.id, userId);

      res.json(data);
    } catch (error) {
      res.status(400).json({
        message: `Request not valid (${error})`
      });
    }
  } catch (error) {
    next(error);
  }
});

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        {
          model: Message,
          order: ["createdAt", "DESC"],
          attributes: ['id', 'text', 'senderId', 'createdAt', 'updatedAt', 'conversationId', 'isRead']
        },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      // set a property "lastReadTime"
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
      }

      delete convoJSON.user1;
      delete convoJSON.user2; // Both these fields should be deleted (one was remaining and it was never used)

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // Sort conversation messages:
      convoJSON.messages?.sort((a, b) => a.createdAt - b.createdAt);

      // Find last message id that is read by other user:
      const readSentMessages = convoJSON.messages
        ?.filter((message) => message.senderId === userId && message.isRead === true) || [];

      const lastSentReadMessage = readSentMessages.length > 0 &&
        readSentMessages[readSentMessages.length - 1];

      convoJSON.lastSentReadMessageId = lastSentReadMessage.id;

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages &&
        convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
