import type React from 'react';
import type { IChat } from '@/interfaces/chat';
import type { IUser } from '@/interfaces/user';

interface ChatListProps {
    user: IUser | null;
    chats: IChat[];
    selectedChatId: string | null;
    onSelectChat: (chatId: string) => void;
    typingUsers: { [chatId: string]: Set<string> };
    onlineUsers: Set<string>;
}

const ChatList: React.FC<ChatListProps> = ({
    user,
    chats,
    selectedChatId,
    onSelectChat,
    typingUsers,
    onlineUsers,
}) => {
    const getTypingIndicator = (chat: IChat) => {
        const typingUsersInChat = typingUsers[chat._id];
        if (!typingUsersInChat || typingUsersInChat.size === 0) return null;

        if (!chat.isGroup) {
            const otherUser = chat.members.find(
                (member) => member.username !== user?.username
            );
            return (
                <span className='text-sm text-gray-400'>
                    {otherUser?.username} is typing...
                </span>
            );
        }

        const typingCount = typingUsersInChat.size;
        if (typingCount === 1) {
            return (
                <span className='text-sm text-gray-400'>
                    {Array.from(typingUsersInChat)[0]} is typing...
                </span>
            );
        } else {
            return (
                <span className='text-sm text-gray-400'>
                    {typingCount} users are typing...
                </span>
            );
        }
    };

    const getOnlineIndicator = (chat: IChat) => {
        if (chat.isGroup) {
            const onlineMembersCount = chat.members.filter((member) =>
                onlineUsers.has(member.username)
            ).length;
            return (
                <span className='ml-2 text-sm'>
                    <span className='w-2 h-2 bg-green-500 rounded-full inline-block mr-1'></span>
                    {onlineMembersCount}/{chat.members.length}
                </span>
            );
        } else {
            const otherUser = chat.members.find(
                (member) => member.username !== user?.username
            );
            if (otherUser && onlineUsers.has(otherUser.username)) {
                return (
                    <span className='ml-2 w-2 h-2 bg-green-500 rounded-full inline-block'></span>
                );
            }
        }
        return null;
    };

    return (
        <div className='h-full overflow-y-auto'>
            <h2 className='text-2xl font-bold p-4 border-b border-gray-700 hidden md:block'>
                Chats
            </h2>
            <ul>
                {chats.map((chat) => (
                    <li
                        key={chat._id}
                        className={`p-4 cursor-pointer hover:bg-gray-700 ${
                            selectedChatId === chat._id ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => onSelectChat(chat._id)}
                    >
                        <div className='flex items-center justify-between'>
                            <span>
                                {chat.name ||
                                    chat.members
                                        .filter(
                                            (member) =>
                                                member.username !==
                                                user?.username
                                        )
                                        .map((member) => member.username)
                                        .join(', ')}
                            </span>
                            {getOnlineIndicator(chat)}
                        </div>
                        {getTypingIndicator(chat)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
