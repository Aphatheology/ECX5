import { User } from '@/app/page';
import API from '@/global/apiClient';
import socketClient from "@/global/socketClient";
import React, { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";

const MessageInput: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [text, setText] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/users/");
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedUsername = localStorage.getItem("user").toJSON();
  //     setUser(storedUsername.username);
  //   }
  // }, []);

  const handleSendMessage = () => {
    if (text && user) {
      socketClient.emit("message", {
        chatId: roomId,
        sender: user._id,
        username: user.username,
        content: text,
      });
      setText("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="py-4 px-6 bg-gray-700 flex">
      <input
        type="text"
        className="flex-1 py-2 px-4 rounded bg-gray-600 text-white"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded ml-2"
      >
        <IoSend />
      </button>
    </div>
  );
};

export default MessageInput;