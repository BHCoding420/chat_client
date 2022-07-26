import React, { useEffect, useRef } from "react";
import { styles } from "./Chatbox.styles";

const Chatbox = ({ messages, setmessages, user }) => {
  const scrollRef = useRef();

  return (
    <div style={styles.chatbox} ref={scrollRef}>
      {messages &&
        messages.map((message) => (
          <div
            key={message.MessageId}
            style={
              message.Sender === user.Email
                ? styles.messageBoxSender
                : styles.messageBoxReciever
            }
          >
            <p style={styles.message}>
              <span>{message.Content}</span>
              <span style={{ display: "block", fontSize: "0.6rem" }}>
                {message.Date}
              </span>
            </p>
          </div>
        ))}
    </div>
  );
};

export default Chatbox;
