import { io, Socket } from "socket.io-client";

const socketClient: Socket = io("http://localhost:3300", {
  withCredentials: true,
  // autoConnect: false,
});

export default socketClient;