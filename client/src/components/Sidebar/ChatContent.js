import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
    fontWeight: "bold"
  },
  unreadCount: {
    color: 'white',
    backgroundColor: '#3A8DFF',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: '8px'
  },
  unreadLastMessage: {
    color: "black"
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, unreadMessagesCount } = conversation;

  // const unreadMessages = messages?.filter((message) => !lastReadTime || message.createdAt > lastReadTime) || [];

  // Classes for uread text:
  const latestMessageTextClasses = classes.previewText +
    (unreadMessagesCount > 0 ? ' ' + classes.unreadLastMessage : '');

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={latestMessageTextClasses}>
          {latestMessageText}
        </Typography>
      </Box>
      {
        // Put element only if there are unread messages:
        unreadMessagesCount > 0 &&
        <Box>
          <Typography className={classes.unreadCount}>
            {unreadMessagesCount}
          </Typography>
        </Box>
      }
    </Box>
  );
};

export default ChatContent;
