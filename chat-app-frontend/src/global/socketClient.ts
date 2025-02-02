import { io, Socket } from "socket.io-client";

const socketClient: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  transports: ['websocket']
});

export default socketClient;