const Conversation = require("./conversation");
const UserConversation = require('./user_conversation');
const User = require("./user");
const Message = require("./message");
const MessageUserInteraction = require("./message_user_interactions");

// associations

User.hasMany(UserConversation);
UserConversation.belongsTo(User);

Conversation.hasMany(UserConversation);
UserConversation.belongsTo(Conversation);

Conversation.hasMany(Message);
Message.belongsTo(Conversation);

Message.hasMany(MessageUserInteraction);
MessageUserInteraction.belongsTo(Message);

module.exports = {
  User,
  Conversation,
  Message
};
