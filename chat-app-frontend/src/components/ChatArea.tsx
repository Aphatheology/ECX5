'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import Message from '@/components/Message';
import MessageInput from '@/components/MessageInput';
import type { IMessage } from '@/interfaces/message';
import apiClient from '@/global/apiClient';
import socketClient from '@/global/socketClient';

interface ChatAreaProps {
    selectedChatId: string | null;
    typingUsers: Set<string>;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedChatId, typingUsers }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (selectedChatId) {
            fetchMessages();
            setupSocketListeners();
        }

        return () => {
            socketClient.off('receive_message');
        };
    }, [selectedChatId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchMessages = async () => {
        if (!selectedChatId) return;

        try {
            const response = await apiClient.get(
                `/chats/${selectedChatId}/messages`
            );
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const setupSocketListeners = () => {
        socketClient.connect();
        socketClient.emit('join_chat', selectedChatId);

        socketClient.on('receive_message', (message: IMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    };

    const renderTypingIndicator = () => {
        if (typingUsers.size === 0) return null;

        const users = Array.from(typingUsers);
        if (users.length === 1) {
            return `${users[0]} is typing...`;
        } else if (users.length === 2) {
            return `${users[0]} and ${users[1]} are typing...`;
        } else {
            return `${users.slice(0, -1).join(', ')} and ${
                users[users.length - 1]
            } are typing...`;
        }
    };

    if (!selectedChatId) {
        return (
            <div className='h-full flex items-center justify-center bg-gray-900'>
                <p className='text-2xl text-gray-500'>
                    Select a chat to start messaging
                </p>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-1 overflow-y-auto p-4'>
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}

                {typingUsers.size > 0 && (
                    <div className='text-sm text-gray-400 mt-2'>
                        {renderTypingIndicator()}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
            <MessageInput chatId={selectedChatId} />
        </div>
    );
};

export default ChatArea;
