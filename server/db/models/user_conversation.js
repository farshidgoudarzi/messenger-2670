const Sequelize = require("sequelize");
const db = require("../db");

const UserConversation = db.define("userConversation", {
    conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

module.exports = UserConversation;