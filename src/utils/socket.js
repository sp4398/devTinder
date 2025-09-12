const socket = require("socket.io");
const { Chat } = require("../models/chat");

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
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetedUserId, text }) => {
        try {
          const roomId = [userId, targetedUserId].sort().join("_");

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetedUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetedUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();
          io.to(roomId).emit("receiveMessage", { firstName, text });
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
