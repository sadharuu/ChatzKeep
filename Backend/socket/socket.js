const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Register User
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys())
      );
    });

    // Send Message
    socket.on("sendMessage", (data) => {
      const receiverSocketId = onlineUsers.get(
        data.receiver
      );

      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "receiveMessage",
          data
        );
      }
    });

    // Typing
    socket.on("typing", (data) => {
      const receiverSocketId = onlineUsers.get(
        data.receiver
      );

      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "userTyping",
          data
        );
      }
    });

    // Stop Typing
    socket.on("stopTyping", (data) => {
      const receiverSocketId = onlineUsers.get(
        data.receiver
      );

      if (receiverSocketId) {
        io.to(receiverSocketId).emit(
          "userStoppedTyping",
          data
        );
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys())
      );

      console.log(
        "User Disconnected:",
        socket.id
      );
    });
  });
};

module.exports = socketHandler;