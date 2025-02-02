import React from "react";
import Image from "next/image";
import moment from "moment";
import { IMessage } from '@/interfaces/message';

const Message: React.FC<{ message: IMessage }> = ({ message }) => {
  const avatarUrl = `https://ui-avatars.com/api/?name=${message.sender.username.toUpperCase()}&background=random`;

  return (
    <div className="flex items-start mb-6">
      <div className="flex-shrink-0 mr-4">
        <Image
          src={avatarUrl}
          alt={message.sender.username}
          width={25}
          height={25}
          className="rounded-full"
          unoptimized 
        />
      </div>

      {/* Message content */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-white">{message.sender.username}</span>

          <span className="text-gray-400 text-xs">
            {moment(message.createdAt).format("DD MMM YYYY, h:mm A")}
          </span>
        </div>

        <p className="text-gray-300 -mt-0.5">{message.content}</p>
      </div>
    </div>
  );
};

export default Message;