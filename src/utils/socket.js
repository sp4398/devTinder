const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //handle socket events here

    socket.on("joinChat", ({ userId, targetedUserId }) => {
      const roomId = [userId, targetedUserId].sort().join("_");
      console.log(roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, targetedUserId, text }) => {
      const roomId = [userId, targetedUserId].sort().join("_");
      console.log(firstName + ": " + text + " to roomId: " + roomId);
      io.to(roomId).emit("receiveMessage", { firstName, text });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
