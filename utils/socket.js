const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", process.env.ORIGIN],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // Ensure both transports are allowed
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    // Listen for new messages and broadcast them to all clients
    socket.on("newMessage", (message) => {
      console.log("New message received:", message); // Debugging statement
      io.emit("newMessage", message);
    });
  });

  return io;
};

module.exports = initializeSocket;
