"use strict";

var express = require("express");

var connectDB = require("./config/db");

var dotenv = require("dotenv");

var userRoutes = require("./routes/userRoutes");

var chatRoutes = require("./routes/chatRoutes");

var messageRoutes = require("./routes/messageRoutes");

var _require = require("./middleware/errorMiddleware"),
    notFound = _require.notFound,
    errorHandler = _require.errorHandler;

var path = require("path");

dotenv.config();
connectDB();
var app = express();
app.use(express.json()); // to accept json data
// app.get("/", (req, res) => {
//   res.send("API Running!");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes); // --------------------------deployment------------------------------

var __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express["static"](path.join(__dirname1, "/frontend/build")));
  app.get("*", function (req, res) {
    return res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", function (req, res) {
    res.send("API is running..");
  });
} // --------------------------deployment------------------------------
// Error Handling middlewares


app.use(notFound);
app.use(errorHandler);
var PORT = process.env.PORT;
var server = app.listen(PORT, console.log("Server running on PORT ".concat(PORT, "...").yellow.bold));

var io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000" // credentials: true,

  }
});

io.on("connection", function (socket) {
  console.log("Connected to socket.io");
  socket.on("setup", function (userData) {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", function (room) {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", function (room) {
    return socket["in"](room).emit("typing");
  });
  socket.on("stop typing", function (room) {
    return socket["in"](room).emit("stop typing");
  });
  socket.on("new message", function (newMessageRecieved) {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach(function (user) {
      if (user._id == newMessageRecieved.sender._id) return;
      socket["in"](user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", function () {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
//# sourceMappingURL=server.dev.js.map
