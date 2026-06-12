const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRouter");
const messageRoutes = require("./routes/messageRouter");
const notificationRoutes = require("./routes/notificationRouter");

// 1. Hardcode your Vercel URL directly into this fallback array alongside process.env 
// to guarantee that CORS will never read an "undefined" key if Render has environment latency.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://chatzkeep-zeta.vercel.app", 
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allows internal server requests or API testing platforms like Postman where origin is missing
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by ChatzKeep Production CORS Policies"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly whitelist pre-flight request flags
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
};

connectDB();

const app = express();

app.use(cors(corsOptions));
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

// 2. Link your production allowed origins directly to the Socket engine instance
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true, // Backward compatibility fallback support
  transports: ["websocket", "polling"] // Ensures standard browser fallback protocols run cleanly
});

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});