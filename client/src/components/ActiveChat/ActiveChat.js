import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { markReadConversation } from "../../store/utils/thunkCreators.js";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));



const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, markReadConversation } = props;
  const conversation = props.conversation || {};
  const { messages, lastReadTime } = conversation;
  const unreadMessages = messages?.filter((message) => !lastReadTime || message.createdAt > lastReadTime) || [];

  const handleMarkAsRead = () => {
    if (conversation.id && unreadMessages.length > 0) {
      try {
        markReadConversation(conversation.id);
      } catch (error) {
        console.error(`markReadConversation error: ${error}`);
      }
    }
  };

  return (
    <Box className={classes.root} onLoad={handleMarkAsRead()}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation: state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    markReadConversation: (conversationId) => {
      dispatch(markReadConversation(conversationId))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
