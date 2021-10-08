const Sequelize = require("sequelize");
const db = require("../db");

const MessageUserInteraction = db.define("messageUserInteraction", {
    messageId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    isRead: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = MessageUserInteraction;