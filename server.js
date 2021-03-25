const express = require("express");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const cors = require("cors");
const app = express();
const http = require("http");
const PORT = process.env.PORT || 5000;
const path = require("path");

app.use(cors());

const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const io = socketIO(server);

// runs when client connects
io.on("connection", (socket) => {
  // console.log("new user connected");
  // title of the chat app
  //socket.emit only seen by user
  socket.emit("new", {
    from: "Admin",
    message: "Live Chat with DNDMs",
  });
  // broadcast message when a user connects to all clients but user doesn't see message
  socket.broadcast.emit("newUser", {
    from: "Admin",
    message: "New user connected",
  });
  // listen for newMessage
  socket.on("newMessage", (data, callback) => {
    // console.log(data);
    //io.emit informs all users
    io.emit("message", {
      message: data.message,
      id: data.id,
      displayName: data.displayName,
      date: Date.now(),
    });
    callback("Message Send From Server");
  });
  // runs when client disconnects
  socket.on("disconnect", () => {
    console.log("user disconnected");
    // io.emit informs all users
    // io.emit("message", "User has left the chat.")
  });
});

// app.get("/", (req, res) => {
//   res.send("hello from chat server");
// res.json(res.data)
// });
// After you run it, creates index.html file inside the "Build" folder.
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/hall_of_whispers",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("connected to mongodb");
  }
);

// This has "/api" because all routes from this route are implied to contain /api/
app.use("/api", require("./routes/api-routes"));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
