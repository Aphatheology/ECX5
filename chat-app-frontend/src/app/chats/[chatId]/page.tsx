/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Message from '@/components/Message';
import MessageInput from '@/components/MessageInput';
import TopBar from '@/components/TopBar';
import apiClient from '@/global/apiClient';
import socketClient from '@/global/socketClient';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

const ChatRoom: React.FC = () => {
    const router = useRouter();
    const { chatId } = useParams<{ chatId: string }>();
    const [messages, setMessages] = useState<any[]>([]);
    const [chat, setChat] = useState<any>({});
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const fetchedRef = useRef(false); // Prevent multiple fetches

    useEffect(() => {
        if (!chatId || fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchChat = async () => {
            try {
                const response = await apiClient.get(`/chats/${chatId}`);
                setChat(response.data);
            } catch (error) {
                console.error('Failed to fetch chat:', error);
                toast.error('Failed to fetch chat');
            }
        };

        const fetchMessages = async () => {
            try {
                const response = await apiClient.get(
                    `/chats/${chatId}/messages`
                );
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
                toast.error('Failed to fetch messages');
            }
        };

        fetchChat();
        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        socketClient.emit('join_chat', chatId);

        socketClient.on('receive_message', (message) => {
            console.log(message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socketClient.on('error', (message) => {
            console.log(message);
            toast.error(message);
        });

        socketClient.on('user_typing', (username) => {
            setTypingUsers((prev) => new Set(prev).add(username));
        });

        socketClient.on('user_stopped_typing', (username) => {
            setTypingUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
            // }
        });

        return () => {
            socketClient.off('receive_message');
            socketClient.off('user_typing');
        };
    }, [chatId]);

    const handleLogout = () => {
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        // localStorage.removeItem('user');
        // router.push('/auth/login');
        // toast.success('User logged out');

        socketClient.emit('leave room', chatId);
        router.push('/');
    };

    return (
        <div className='flex flex-col h-screen bg-gray-800 text-white'>
            <TopBar roomName={chat?.name || 'Chat'} onLogout={handleLogout} />
            <div className='flex-1 overflow-auto p-4'>
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}

                {typingUsers.size > 0 && (
                    <div className='text-sm text-gray-400 mt-2'>
                        {(() => {
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
                        })()}
                    </div>
                )}
            </div>
            <MessageInput chatId={chatId} />
        </div>
    );
};

export default ChatRoom;
