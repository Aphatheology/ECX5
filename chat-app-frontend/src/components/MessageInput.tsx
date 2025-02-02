import socketClient from "@/global/socketClient";
import { IUser } from '@/interfaces/user';
import React, { useState, useEffect } from "react";
import { IoSend } from "react-icons/io5";

const MessageInput: React.FC<{ chatId: string }> = ({ chatId }) => {
  const [text, setText] = useState("");
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (!storedUser) {
        window.location.replace("/auth/login");
      } else {
        setUser(storedUser);
      }
    }, []);

  const handleSendMessage = () => {
    if (text && user) {
      socketClient.emit("message", user._id, {
        chatId: chatId,
        content: text,
        typeOfMsg: "text"
      });
      setText("");
      socketClient.emit("stop_typing", chatId, user?.username); 
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    socketClient.emit("typing", chatId, user?.username); 
};

  return (
    <div className="py-4 px-6 bg-gray-700 flex">
      <input
        type="text"
        className="flex-1 py-2 px-4 rounded bg-gray-600 text-white"
        placeholder="Type your message..."
        value={text}
        onChange={handleInputChange}
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