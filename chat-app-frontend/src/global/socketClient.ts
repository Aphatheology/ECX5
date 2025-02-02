import { io, Socket } from "socket.io-client";

const socketClient: Socket = io("http://localhost:3300", {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  transports: ['websocket']
});

export default socketClient;