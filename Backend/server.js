const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRouter");
const messageRoutes = require("./routes/messageRouter");
const notificationRoutes = require("./routes/notificationRouter");



dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

app.get("/", (req, res) => {
  res.send("ChatzKeep API Running");
});

const PORT = process.env.PORT || 4000;

const http = require("http");
const { Server } = require("socket.io");

const socketHandler = require("./socket/socket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});