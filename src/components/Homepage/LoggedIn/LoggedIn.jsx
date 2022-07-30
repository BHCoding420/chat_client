import React, { useState, useEffect, useRef } from "react";
import { styles } from "./LoggedIn.styles";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import Chatbox from "./Chatbox/Chatbox";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSound from "use-sound";

const LoggedIn = (User) => {
  const [SearchedUsers, setSearchedUsers] = useState([]);
  const [messages, setmessages] = useState([]);
  const [reciever, setreciever] = useState(null);
  const [messageContent, setmessageContent] = useState("");
  const [ContactsList, setContactsList] = useState([]);
  const [dateObj, setdateObj] = useState({});
  const [currentChat, setcurrentChat] = useState({});
  const [sentMessage, setsentMessage] = useState(false);
  const [sentMessageId, setsentMessageId] = useState(0);
  const [search, setsearch] = useState("");
  const [arrivingMsg, setarrivingMsg] = useState(null);
  const [recieverStatus, setrecieverStatus] = useState("");
  const ENDPOINT = `http://localhost:5000/`;

  const [socket, setSocket] = useState(null);

  function Notification({ sender }) {
    var sender_of_msg = null;

    const fetchSender = async () => {
      await axios
        .get(`${import.meta.env.VITE_APP_BACKEND}/users/${arrivingMsg.Sender}`)
        .then((response) => {
          sender_of_msg = response.data.data[0];
        });
    };
    return (
      <div
        onClick={() => {
          fetchSender();
          setreciever(sender_of_msg);
        }}
        style={{ maxWidth: "100%", minWidth: "100%" }}
      >
        <p>{sender}:</p>
        <p>{arrivingMsg.Content}</p>
      </div>
    );
  }

  useEffect(() => {
    if (reciever) {
      socket?.emit("checkOnline", reciever.Email);
      socket?.on("status", (data) => {
        console.log("status", data);
        data.status === "Online"
          ? setrecieverStatus(data.status)
          : setrecieverStatus(data.LastSeen);
      });
      socket?.on("userLeft", (data) => {
        if (data.Email === reciever.Email) {
          setrecieverStatus(data.LastSeen);
        }
      });
      socket?.on("userJoin", (data) => {
        if (data.Email === reciever.Email) {
          setrecieverStatus(data.Status);
        }
      });
    }
  }, [reciever]);

  useEffect(() => {
    setSocket(io("http://localhost:5000"), {
      transports: ["websocket"],
    });
  }, []);

  const sendNotification = async () => {
    toast.warning(<Notification sender={arrivingMsg.Sender} />, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  useEffect(() => {
    console.log(arrivingMsg);
    if (arrivingMsg) {
      if (reciever) {
        if (reciever.Email === arrivingMsg.Sender) {
          setmessages([...messages, arrivingMsg]);
          //emit to sender that i read
          socket?.emit("reading", {
            user: reciever.Email,
            reciever: User.User.Email,
          });
        } else {
          sendNotification();
        }
        const sentby = arrivingMsg.Sender;
        let chat_to_change = null;
        let chat_to_change_index = -1;
        for (var x in ContactsList) {
          if (ContactsList[x].Email === sentby) {
            chat_to_change = ContactsList[x];
            chat_to_change_index = x;
            break;
          }
        }
        axios
          .get(
            `${import.meta.env.VITE_APP_BACKEND}/chats/getchats/get/${
              User.User.Email
            }
            `
          )
          .then((response) => {
            console.log(response.data);
            setContactsList(response.data);
            //setContactsList(ContactsList.sort);
          });
      } else {
        sendNotification();
        const sentby = arrivingMsg.Sender;
        let chat_to_change = null;
        let chat_to_change_index = -1;
        if (ContactsList.length > 0) {
          for (var x in ContactsList) {
            if (ContactsList[x].Email === sentby) {
              chat_to_change = ContactsList[x];
              chat_to_change_index = x;
              break;
            }
          }
          axios
            .get(
              `${import.meta.env.VITE_APP_BACKEND}/chats/getchats/get/${
                User.User.Email
              }
            `
            )
            .then((response) => {
              console.log(response.data);
              setContactsList(response.data);
              //setContactsList(ContactsList.sort);
            });
        }
      }
    }
  }, [arrivingMsg]);

  //const [currentUser, setcurrentUser] = useState();
  useEffect(() => {
    const user = User.User;
    console.log("socket", socket);
    socket?.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket?.emit("join", { user }, (error) => {
      if (error) {
        alert(error);
      }
    });
    socket?.on("status", (data) => {
      console.log("status", data);
      data.status === "Online"
        ? setrecieverStatus(data.status)
        : setrecieverStatus("last seen : " + data.LastSeen);
    });
  }, [socket]);

  const sendMessage = async () => {
    let id = Math.floor(Math.random() * 10000);
    setsentMessageId(id);
    console.log(id);
    console.log(socket);
    //add message to Messages
    console.log("the reciever is ", reciever.Email);
    let msg = {
      MessageId: id,
      Sender: User.User.Email,
      Reciever: reciever.Email,
      FirstName: reciever.FirstName,
      LastName: reciever.LastName,
      Seen: 0,
      Date: Date.now(),
      Content: messageContent,
    };
    await axios
      .post(`${import.meta.env.VITE_APP_BACKEND}/messages`, {
        sender: User.User.Email,
        reciever: reciever.Email,
        content: messageContent,
        MessageId: id,
      })
      .then((response) => {
        setmessages([...messages, msg]);

        socket.emit("send-msg", {
          msg,
        });
        setmessageContent("");
      });
    let chatter1 = "";
    let chatter2 = "";
    if (User.User.Email <= reciever.Email) {
      chatter1 = User.User.Email;
      chatter2 = reciever.Email;
    } else {
      chatter2 = User.User.Email;
      chatter1 = reciever.Email;
    }
    //Add new chat to Chats
    if (currentChat.length === 0) {
      await axios
        .post(
          `${
            import.meta.env.VITE_APP_BACKEND
          }/chats/${chatter1}/${chatter2}/${id}`,
          { sender: chatter1, reciever: chatter2, messageId: id }
        )
        .then((response) => {
          console.log(response);
          setsentMessage(true);
          console.log(sentMessage);
          setContactsList([...ContactsList, response.data]);
        });
      setcurrentChat({ Chatter1: chatter1, Chatter2: chatter2, MessageId: id });
    }

    //Modify existing chat
    else {
      await axios
        .patch(
          `${
            import.meta.env.VITE_APP_BACKEND
          }/chats/${chatter1}/${chatter2}/${id}`,
          { sender: chatter1, reciever: chatter2, messageId: id }
        )
        .then((response) => {
          console.log(response);
          setcurrentChat({
            Chatter1: chatter1,
            Chatter2: chatter2,
            MessageId: id,
          });
        });
    }

    await axios
      .get(
        `${import.meta.env.VITE_APP_BACKEND}/chats/getchats/get/${
          User.User.Email
        }
          `
      )
      .then((response) => {
        console.log(response.data);
        setContactsList(response.data);
        //setContactsList(ContactsList.sort);
      });
  };

  useEffect(() => {
    console.log("currentChat : ", currentChat);
  }, [currentChat]);

  useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get(
          `${import.meta.env.VITE_APP_BACKEND}/chats/getchats/get/${
            User.User.Email
          }
          `
        )
        .then((response) => {
          console.log(response.data);
          setContactsList(response.data);
          //setContactsList(ContactsList.sort);
        });
    };

    const getChats = async () => {};

    fetchUsers();
  }, []);

  const getUserfromEmail = async (userEmail) => {
    let fetchedUser = {};
    await axios
      .get(`${import.meta.env.VITE_APP_BACKEND}/users/${userEmail}`)
      .then((response) => {
        console.log(response.data);
        fetchedUser = response.data.data[0];
      });
    console.log("fetched", fetchedUser);
    return fetchedUser;
  };

  const getTheLatestMessages = async (userEmail, users) => {
    let obj = {};
    for (var x in users) {
      let temp = null;
      await axios
        .get(
          `${
            import.meta.env.VITE_APP_BACKEND
          }/messages/lastMessage/${userEmail}/${users[x].Email}`
        )
        .then((response) => {
          console.log(response);

          obj[users[x].Email] = response.data[0].Date;
          console.log(obj);
        });

      //ContactsList[x].LatestMessage = temp;
    }
    const sorted = Object.entries(obj).sort((a, b) => {
      console.log(a, b);
      return new Date(b[1]) - new Date(a[1]);
    });
    return sorted;
  };

  useEffect(() => {
    console.log("reciever now : ", reciever);
    if (reciever) {
      axios
        .get(
          `${import.meta.env.VITE_APP_BACKEND}/messages/${User.User.Email}/${
            reciever.Email
          }`
        )
        .then((response) => {
          setmessages(response.data);
        });

      let chatter1 = "",
        chatter2 = "";

      if (User.User.Email <= reciever.Email) {
        chatter1 = User.User.Email;
        chatter2 = reciever.Email;
      } else {
        chatter2 = User.User.Email;
        chatter1 = reciever.Email;
      }

      axios
        .get(
          `${import.meta.env.VITE_APP_BACKEND}/chats/${chatter1}/${chatter2}`
        )
        .then((response) => {
          setcurrentChat(response.data);
        });
    }
  }, [reciever]);

  const searchUsers = async (search) => {
    console.log(search);
    setsearch(search);
    search.length > 1
      ? await axios
          .get(`${import.meta.env.VITE_APP_BACKEND}/users/searchUser/${search}`)
          .then((response) => {
            setSearchedUsers(response.data);
          })
      : setSearchedUsers([]);
  };
  useEffect(() => {
    if (search.length <= 1) {
      const fetchUsers = async () => {
        await axios
          .get(
            `${import.meta.env.VITE_APP_BACKEND}/chats/getchats/get/${
              User.User.Email
            }
            `
          )
          .then((response) => {
            console.log(response.data);
            setContactsList(response.data);
            //setContactsList(ContactsList.sort);
          });
      };

      fetchUsers();
    }
  }, [search]);

  useEffect(() => {
    socket?.on("msg-recieve", (data) => {
      let chat_available = false;
      console.log("arrivingMsg", arrivingMsg);
      console.log("data.msg", data.msg);
      for (var x in ContactsList) {
        if (data.msg.Sender === ContactsList[x].Email) {
          chat_available = true;
          console.log("this already exists", ContactsList[x]);
          break;
        }
      }

      console.log(chat_available);
      console.log(data);
      if (!chat_available) {
        let newChat = {
          Content: data.msg.Content,
          Date: data.msg.Date,
          Email: data.msg.Sender,
          FirstName: data.msg.FirstName,
          LastName: data.msg.LastName,
          LastSentMessage: data.msg.MessageId,
        };
        console.log("newChat", newChat);
        setContactsList([...ContactsList, newChat]);
        //setContactsList();
      }
      setarrivingMsg(data.msg);
    });

    //console.log("arriving msg in msg-recieve", arrivingMsg);
  }, [socket]);

  useEffect(() => {
    console.log("ContactsList : ", ContactsList);
  }, [ContactsList]);

  const [messagesGotRead, setmessagesGotRead] = useState(null);
  useEffect(() => {
    if (messagesGotRead) {
      console.log(JSON.stringify(messagesGotRead));
      //alert(JSON.stringify(messages[messages.length - 1]));

      axios
        .get(
          `${import.meta.env.VITE_APP_BACKEND}/messages/${User.User.Email}/${
            reciever.Email
          }`
        )
        .then((response) => {
          setmessages(response.data);
        });
    }
  }, [messagesGotRead]);

  useEffect(() => {
    //console.log("messages", messages);
    if (reciever) {
      socket?.on("latestMessagesRead", (data) => {
        console.log(JSON.stringify(data));
        setmessagesGotRead(data);
        //const temp = messages;
        /*for (var x in temp) {
          if (!temp[x].Seen && temp[x].Reciever === data.readby) {
            temp[x].Seen = true;
          }
        }*/
        /*temp.forEach((msg) => {
          if (!msg.Seen && msg.Reciever === data.readby) {
            msg.Seen = true;
          }
        });
        console.log(temp);*/
      });
    }
    if (reciever) {
      axios
        .patch(
          `${import.meta.env.VITE_APP_BACKEND}/messages/updateRead/${
            reciever.Email
          }/${User.User.Email}`
        )
        .then((response) => {
          socket?.emit("reading", {
            user: User.User.Email,
            reciever: reciever.Email,
          });
        });
    }
  }, [reciever]);

  return (
    <Container style={styles.LoggedInMenu}>
      <ToastContainer autoClose={false} closeOnClick={false} />

      <Row>
        <Col style={styles.columns}>
          <div>
            <p>{User.User.FirstName}</p>
            <input
              type="text"
              name="search"
              onChange={(e) => searchUsers(e.target.value)}
            />
          </div>

          <div style={styles.List}>
            {SearchedUsers.length !== 0
              ? SearchedUsers.map((user) => (
                  <p
                    key={user.Email}
                    onClick={(e) => setreciever(user)}
                    style={styles.ContactName}
                  >
                    {user.FirstName} {user.LastName}
                  </p>
                ))
              : ContactsList &&
                ContactsList.map((user) => (
                  <p
                    key={user.Email}
                    onClick={(e) => setreciever(user)}
                    style={styles.ContactName}
                  >
                    {user.FirstName} {user.LastName}
                    {user.Content && <p>{user.Content}</p>}
                  </p>
                ))}
          </div>
        </Col>
        <Col style={styles.columns} xs={8}>
          <Row
            style={{
              minHeight: "10vh",
              maxHeight: "10vh",
              borderRadius: "25px",
              backgroundColor: "yellow",
            }}
          >
            {reciever && (
              <div>
                <p>
                  {reciever.FirstName} {reciever.LastName}
                </p>
                <p>{recieverStatus}</p>
              </div>
            )}
          </Row>
          <Row
            style={{
              minHeight: "70vh",
              maxHeight: "70vh",
              borderRadius: "25px",
              backgroundColor: "yellow",
            }}
          >
            <Chatbox
              messages={messages}
              setmessages={setmessages}
              user={User.User}
            />
          </Row>
          <Row
            style={{
              minHeight: "10vh",
              maxHeight: "10vh",
              borderRadius: "25px",
              backgroundColor: "yellow",
            }}
          >
            <Col xs={10} className="pt-3">
              <input
                type="text"
                style={{ minWidth: "100%" }}
                onChange={(e) => setmessageContent(e.target.value)}
              />
            </Col>
            <Col className="pt-3">
              <Button onClick={() => sendMessage()}>send</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LoggedIn;
