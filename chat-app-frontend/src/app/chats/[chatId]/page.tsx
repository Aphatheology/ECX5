/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";
import TopBar from "@/components/TopBar";
import apiClient from "@/global/apiClient";
import socketClient from "@/global/socketClient";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ChatRoom: React.FC = () => {
  const router = useRouter();
  // const params = useParams();
  // const roomId = params.roomId as string;
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log(chatId)
        const response = await apiClient.get(`/chats/${chatId}/messages`);
        console.log(response.data)
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    socketClient.emit("join_chat", { roomId: chatId });

    socketClient.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketClient.off("message");
    };
  }, [chatId]);

  const handleLogout = () => {
    router.push("/");
    toast.success("User logged out");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <TopBar roomId={chatId} onLogout={handleLogout} />
      <div className="flex-1 overflow-auto p-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <MessageInput roomId={chatId} />
    </div>
  );
};

export default ChatRoom;