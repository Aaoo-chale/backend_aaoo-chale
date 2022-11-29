// THIRD PARTY MODULES
const path = require("path");
// CORE MODULES
require("dotenv").config({ path: path.join(__dirname, "config.env") });

// SELF MODULES
const dbConnect = require(path.join(__dirname, "config", "db.js"));
const app = require(path.join(__dirname, "app.js"));
dbConnect();
const server = app.listen(process.env.PORT, () => {
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

//   sock.on("disconnect", () => {
//     removeUser(sock.id);
//   });
// });

// global._io = io;
