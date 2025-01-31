/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import API from "@/global/apiClient";
import apiClient from "@/global/apiClient";
import socketClient from "@/global/socketClient";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Room {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

const ChatSelectionPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const history = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/users/");
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
        window.location.replace('/auth/login');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  const fetchRooms = async () => {
    try {
      const response = await apiClient.get("/chats");
      if (!response.data) {
        throw new Error("Failed to fetch rooms");
      }
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleJoinRoom = () => {
    if (user && selectedRoomId) {
      socketClient.emit("join_chat", { chatId: selectedRoomId });
      history.push(`/chats/${selectedRoomId}`);
    }
  };

  const handleCreateChat = async () => {
    if (!user) return;

    const chatPayload = {
      userId: user._id,
      otherUserId: "679d0830a22cf843fd1c4473", 
      isGroup: false,
      groupName: "Personal",
    };

    try {
      const { data } = await apiClient.post("/chats", chatPayload);
      setRooms([...rooms, data]); // Add the new chat to the room list
    } catch (error) {
      console.error("Failed to create chat", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl mb-4">Join or Create a Chat</h1>

      <select
        key={selectedRoomId}
        className="mb-4 px-16 py-4 rounded bg-gray-700 text-white"
        value={selectedRoomId}
        onChange={(e) => setSelectedRoomId(e.target.value)}
      >
        <option value="" disabled>
          Select Room
        </option>
        {rooms.map((room) => (
          <option key={room._id} value={room._id}>
            {room.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleJoinRoom}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Join Room
      </button>

      <button
        onClick={handleCreateChat}
        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
      >
        Create Chat
      </button>
    </div>
  );
};

export default ChatSelectionPage;
