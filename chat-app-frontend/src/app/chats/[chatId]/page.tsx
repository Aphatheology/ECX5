'use client';
import Message from '@/components/Message';
import MessageInput from '@/components/MessageInput';
import TopBar from '@/components/TopBar';
import apiClient from '@/global/apiClient';
import socketClient from '@/global/socketClient';
import { IChat } from '@/interfaces/chat';
import { IMessage } from '@/interfaces/message';
import { IUser } from '@/interfaces/user';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

const ChatRoom: React.FC = () => {
    const router = useRouter();
    const { chatId } = useParams<{ chatId: string }>();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [chat, setChat] = useState<IChat>({
        _id: '',
        members: [],
        isGroup: false,
        name: '',
        createdBy: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [user, setUser] = useState<IUser | null>(null);
    const fetchedRef = useRef(false); // Prevent multiple fetches
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (!storedUser) {
            window.location.replace('/auth/login');
        } else {
            setUser(storedUser);
        }
    }, []);

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
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (!chatId) return;
        socketClient.connect();
        socketClient.emit('join_chat', chatId);

        socketClient.on('receive_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socketClient.on('error', (message) => {
            toast.error(message + ' from on error');
        });

        socketClient.on('user_typing', (username) => {
            setTypingUsers((prev) => new Set([...prev, username]));
        });

        socketClient.on('user_stopped_typing', (username) => {
            setTypingUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(username);
                return newSet;
            });
        });

        socketClient.on('user_left', (socketId) => {
            console.log(`User ${socketId} left the chat`);
            // toast.info(`A user has left the chat`);
        });

        socketClient.on('disconnect', () => {
            toast.info('Disconnected from chat');
        });

        return () => {
            if (socketClient.connected) {
                socketClient.disconnect();
            }
            socketClient.off('receive_message');
            socketClient.off('user_typing');
            socketClient.off('user_stopped_typing');
            socketClient.off('user_disconnected');
            socketClient.off('disconnect');
        };
    }, [chatId]);

    const handleLogout = () => {
        socketClient.emit('stop_typing', chatId, user?.username);
        socketClient.emit('leave_chat', chatId);
        router.push('/');
    };

    return (
        <div className='flex flex-col h-screen bg-gray-800 text-white'>
            <TopBar chat={chat} onLogout={handleLogout} />
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
                <div ref={messagesEndRef} />
            </div>
            <MessageInput chatId={chatId} />
        </div>
    );
};

export default ChatRoom;
