// THIRD PARTY MODULES
const path = require("path");
let http = require("http");
// CORE MODULES
require("dotenv").config({ path: path.join(__dirname, "config.env") });
const express = require("express");
// SELF MODULES
const dbConnect = require(path.join(__dirname, "config", "db.js"));
const app = require(path.join(__dirname, "app.js"));
dbConnect();

http = require("http").createServer(app);
// // app.use(express.static(__dirname + "/public"));

// // html file
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

const server = http.listen(process.env.PORT, () => {
  console.log(`Server is running on port number ${process.env.PORT}`);
});

server.setTimeout(29000);
process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message} ${err}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message} ${err}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});

// //socket io

// const io = require("socket.io")(server);

// io.on("connection", (socket) => {
//   console.log("Connected...");
//   socket.on("message", (msg) => {
//     console.log(msg);
//     socket.broadcast.emit("message", msg);

//     socket.on("disconnect", () => {
//       io.emit("message", "user has left the chat");
//     });
//   });
// });
const socket = require("socket.io");

// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

const io = require("socket.io")(server, {
  cors: {
    origin: `*`,
    credentials: true,
    methods: ["GET", "POST"],
    transports: ["websocket"],
  },
  allowEIO3: true,
});

global.onlineUsers = [];

const addNewUser = (username, socketId) => {
  !global.onlineUsers.some((user) => user.username === username) && global.onlineUsers.push({ username, socketId });
  console.log("ONLINEUSERS", global.onlineUsers, username, socketId);
};

const removeUser = (socketId) => {
  global.onlineUsers = global.onlineUsers.filter((user) => user.socketId !== socketId);
};
io.on("connection", (socket) => {
  console.log("connection..", socket.id);
  global.chatSocket = socket;
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  socket.on("newUser", (UserId) => {
    addNewUser(UserId, socket.id);
    console.log("addNewUser(UserId, socket.id", addNewUser(UserId, socket.id));
    socket.emit("getNotification", "NOTIFICATION");
    // const sendUserSocket = onlineUsers.get(data.to);
    // socket.to(sendUserSocket).emit("getNotification", data.msg);
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

global.io = io;

// createRating

// io.on("connection", (socket) => {
//   console.log("Connected...");
//   socket.on("message", (msg) => {
//     console.log(msg);
//     socket.broadcast.emit("message", msg);

//     socket.on("disconnect", () => {
//       io.emit("message", "user has left the chat");
//     });
//   });
// });

// global._onlineUsers = [];

// // HELPER FUNCTIONS

// const addNewUser = (Username, socketId) => {
//   !global._onlineUsers.some((User) => User.Username === Username) && global._onlineUsers.push({ Username, socketId });
//   console.log("ONLINEUserS", global._onlineUsers, Username, socketId);
// };

// const removeUser = (socketId) => {
//   global._onlineUsers = global._onlineUsers.filter((User) => User.socketId !== socketId);
// };

// const io = require("socket.io")(server, {
//   cors: {
//     origin: `*`,
//     credentials: true,
//     methods: ["GET", "POST"],
//     transports: ["websocket"],
//   },
//   allowEIO3: true,
// });

// io.on("connection", (sock) => {
//   sock.on("newUser", (UserId) => {
//     addNewUser(UserId, sock.id);
//     sock.emit("getNotification", "NOTIFICATION");
//   });

// sock.on("disconnect", () => {
//   removeUser(sock.id);
// });
// });

// global._io = io;
