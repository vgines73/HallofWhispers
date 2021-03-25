//import React, { useState, useEffect } from "react";
import Card from "../Components/Card/Card";
import Col from "../Components/Col/Col";
import Container from "../Components/Container/Container";
import Row from "../Components/Row/Row";
import StatCard from "../Components/StatCard/StatCard";
import Wrapper from "../Components/Wrapper/Wrapper";
import { PostList, PostListItem } from "../Components/PostList/PostList";
import "./Home.css";
import axios from "axios";
// --- For authentication, allows you to stay logged in --- //
// import { useHistory } from "react-router-dom";
import AccountContext from "../Context/AccountContext";
import React, { useState, useEffect, useContext, useRef } from "react";
import Dice from "react-dice-roll";
import socketIOClient from "socket.io-client";
import background from "../assets/images/vintage-concrete.png";
const moment = require("moment");

const Home = () => {
  // Setting initial state for posts
  const [posts, setPosts] = useState([]);
  const [postMessage, setPostMessage] = useState("");
  // Setting inital state for chat messages
  const [welcome, setWelcome] = useState("");
  const [newUser, setNewUser] = useState("")
  const [messages, setMessages] = useState("");
  const [arr, setArr] = useState([]);
  const [id, setId] = useState("");

  // handles the input change for posting a message to the postboard
  const handleInputChange = (e) => {
    const { value } = e.target;
    setPostMessage(value);
  };

  // sumbits the post
  const handleSubmit = (e) => {
    // prevents page from refreshing
    e.preventDefault();
    // get local token
    let token = localStorage.getItem("auth-token");

    axios
      .post(
        "/api/posts",
        { message: postMessage },
        { headers: { "x-auth-token": token } }
      )
      .then((res) => {
        // console.log(res);
        const data = res.data;
        const arr = [...posts];
        arr.unshift(data);
        setPosts(arr);
      });
    // clears the input field after submitting
    setPostMessage("");
  };

  // loads all the posts
  useEffect(() => {
    loadPosts();
  }, []);

  // grabbing all the posts from the database
  function loadPosts() {
    let token = localStorage.getItem("auth-token");
    axios
      .get("/api/posts", { headers: { "x-auth-token": token } })
      .then((res) => {
        console.log(res.data);
        setPosts(res.data);
      });
  }

  // FOR LIVE CHATTING
  // connects messages
  useEffect(() => {
    const socket = socketIOClient("http://localhost:5000", {
      transports: ["websocket"],
    });
    // connects every user
    socket.on("connect", () => {
      // console.log(socket.id);
      setId(socket.id);
    });
    // connects title and shows on screen
    socket.on("new", (data) => {
      // console.log(data)
      setWelcome(data.message);
    });
    socket.on("newUser", (data) => {
      // console.log(data.message);
    });
    socket.on("disconnect", () => {
      console.log("disconnected homie");
    });
    socket.on("message", (data) => {
      // console.log(data);
      setArr((arr) => [...arr, data]);
    });
  }, []);

  // sends a message
  const sendMessage = (e) => {
    e.preventDefault();
    const socket = socketIOClient("http://localhost:5000", {
      transports: ["websocket"],
    });
    socket.emit(
      "newMessage",
      {
        message: messages,
        id: id,
        displayName: userData.account.accountName,
        date: moment(Date.now()).format("h:mm a"),
      },
      (data) => {
        // alert(data)
      }
    );
    // clears input field
    setMessages("");
  };

  const { userData } = useContext(AccountContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
      inline: "nearest",
    });
    // console.log(messagesEndRef)
  };

  useEffect(() => {
    scrollToBottom();
  });

  //--------------------------------------------
  //Activate this block of code when appropriate
  //Function:  If the user is not logged in, will go
  //back to the login page.

  // const history = useHistory();

  // useEffect(() => {
  //   if (!userData.account) {
  //     history.push("/login");
  //   }
  // }, [userData.account, history])

  // console.log(userData.character?.length === 0);

  //--------------------------------------------
  return (
    <div style={{ backgroundImage: `url(${background})` }}>
      <Wrapper>
        <Container>
          <Row>
            <Col size="md-6">
              <h5 style={{ textShadow: "4px 4px 8px black" }}>
                {userData.character?.chrName}
              </h5>
              <strong style={{ textShadow: "4px 4px 8px red" }}>
                {`The ${userData.character?.chrRace}`}
              </strong>
              <strong style={{ textShadow: "4px 4px 8px red" }}>
                {` ${userData.character?.chrClass}`}
              </strong>
              <br />
              <strong style={{ textShadow: "4px 4px 8px red" }}>Race: </strong>
            </Col>
          </Row>
          <Row>
            <Col size="md-4">
              <StatCard />
            </Col>
            <Col size="md-4">
              <Row>
                <form onSubmit={handleSubmit}>
                  <div>
                    <textarea
                      onChange={handleInputChange}
                      type="text"
                      style={{ marginTop: "10px" }}
                      name="message"
                      value={postMessage}
                      className="form-control"
                      placeholder="Enter your post here"
                      aria-label="post-message"
                      aria-describedby="button-addon2"
                      id="myInput"
                    />
                    <button
                      className="btn btn-success"
                      type="submit"
                      id="button-addon2"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </Row>
              <Row>
                <Card>
                  <PostList>
                    {posts.map((post, index) => {
                      return (
                        <PostListItem
                          // style={{border: "0"}}
                          key={index}
                          date={post.date}
                          //accountId={post.accountId}
                          account={post.account}
                          message={post.message}
                          myAccount={
                            // post.accountId === userData.account?.id
                            //   ? "true"
                            //   : "false"
                            post.myAccount
                          }
                        />
                      );
                    })}
                  </PostList>
                </Card>
              </Row>
            </Col>
            <Col size="md-4">
              <div>
                <Card>
                  <p className="text-center">{welcome}</p>
                  <div ref={messagesEndRef}>
                    {/* {console.log(arr)} */}
                    {arr.map((chat, index) => (
                      <div key={index}>
                        <p>{chat.newUser}</p>
                        <p>{chat.message}</p>
                        <p style={{ float: "right" }} className="timestamp">
                          {" "}
                          {chat.displayName} sent at:{" "}
                          {moment(chat.date).format("h:mm a")}
                        </p>
                        <br />
                      </div>
                    ))}
                  </div>
                </Card>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your message here"
                    value={messages}
                    onChange={(e) => {
                      setMessages(e.target.value);
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={(e) => sendMessage(e)}
                  >
                    send
                  </button>
                </div>
              </div>
              <br />
              <Dice onRoll={(value) => console.log(value)} size={50} />
            </Col>
          </Row>
        </Container>
      </Wrapper>
    </div>
  );
};

export default Home;
