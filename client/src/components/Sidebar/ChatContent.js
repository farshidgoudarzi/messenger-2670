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
  },
  unreadCount: {
    color: 'white',
    backgroundColor: '#3A8DFF',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  }
}));

const ChatContent = (props) => {
  console.log('ChatContent ...');
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, messages, lastReadTime } = conversation;

  const unreadMessages = messages?.filter((message) => !lastReadTime || message.createdAt > lastReadTime) || [];

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {
        // Put element only if there are unread messages:
        unreadMessages.length > 0 &&
        <Box>
          <Typography className={classes.unreadCount}>
            {unreadMessages.length}
          </Typography>
        </Box>
      }
    </Box>
  );
};

export default ChatContent;
