import { io, Socket } from "socket.io-client";

const socketClient: Socket = io("http://localhost:3300", {
  withCredentials: true,
});

// socket.on("connect", () => {
//   console.log("Connected to WebSocket server ✅");
// });
// socket.on("connection", () => {
//   console.log("Connected to WebSocket server ✅");
// });

// socket.on("connect_error", (err) => {
//   console.error("Socket connection error:", err);
// });

export default socketClient;