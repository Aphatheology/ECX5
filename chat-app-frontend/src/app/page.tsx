/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import apiClient from '@/global/apiClient';
import socketClient from '@/global/socketClient';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { IUser } from '@/interfaces/user';
import { IChat } from '@/interfaces/chat';
import ChatList from '@/components/ChatList';
import ChatArea from '@/components/ChatArea';
import ChatHeader from '@/components/ChatHeader';


const ChatSelectionPage: React.FC = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [chats, setChats] = useState<IChat[]>([]);
    const [selectedChatId, setSelectedChatId] = useState('');
    const [username, setUsername] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
    const [isGroup, setIsGroup] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [typingUsers, setTypingUsers] = useState<{ [chatId: string]: Set<string> }>({});
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const history = useRouter();

    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (!storedUser) {
        history.replace('/auth/login');
      } else {
          setUser(storedUser);
          socketClient.emit("authenticate", user?.username)
          setLoading(false); 
      }
  }, []);

    useEffect(() => {
        if (user) {
            fetchChats();
            setupSocketListeners();
        }
    }, [user]);

    const fetchChats = async () => {
        try {
            const response = await apiClient.get('/chats');
            if (!response.data) {
                throw new Error('Failed to fetch rooms');
            }
            setChats(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const setupSocketListeners = () => {
      socketClient.on("user_typing", (chatId, username) => {
        setTypingUsers((prev) => {
          const newTypingUsers = { ...prev }
          if (!newTypingUsers[chatId]) {
            newTypingUsers[chatId] = new Set()
          }
          newTypingUsers[chatId].add(username)
          return newTypingUsers
        })
      })
  
      socketClient.on("user_stopped_typing", (chatId, username ) => {
        setTypingUsers((prev) => {
          const newTypingUsers = { ...prev }
          if (newTypingUsers[chatId]) {
            newTypingUsers[chatId].delete(username)
            if (newTypingUsers[chatId].size === 0) {
              delete newTypingUsers[chatId]
            }
          }
          return newTypingUsers
        })
      })

      socketClient.on("online_users", (users: string[]) => {
        setOnlineUsers(new Set(users))
      })
  
      socketClient.on("user_online", (username: string) => {
        setOnlineUsers((prev) => new Set(prev).add(username))
      })
  
      socketClient.on("user_offline", (username: string) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(username)
          return newSet
        })
      })
  
      return () => {
        socketClient.off("user_typing")
        socketClient.off("user_stopped_typing")
        socketClient.off("online_users")
        socketClient.off("user_online")
        socketClient.off("user_offline")
      }
    }

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen)
    }

    const selectedChat = chats.find((chat) => chat._id === selectedChatId) || null

    const handleJoinRoom = () => {
        if (user && selectedChatId) {
            socketClient.emit('join_chat', { chatId: selectedChatId });
            history.push(`/chats/${selectedChatId}`);
        }
    };

    const debouncedSearch = React.useRef(
        debounce(async (username, loggedInUsername) => {
            await searchUser(username, loggedInUsername);
        }, 1000)
    ).current;

    React.useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    async function handleUsernameChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        setUsername(e.target.value);
        debouncedSearch(e.target.value, user?.username);
    }

    const searchUser = async (username: string, loggedInUsername: string) => {
        if (!username) return;

        if (
            username.toLocaleLowerCase() == loggedInUsername.toLocaleLowerCase()
        ) {
            toast.info("You can't add yourself");
            return;
        }

        try {
            const { data } = await apiClient.get(`/users/${username}`);
            toast.success(`${data.username} found`);
            setUsername('');

            setSelectedUsers((prevUsers) =>
                prevUsers.some((user) => user._id === data._id)
                    ? prevUsers
                    : [...prevUsers, data]
            );
        } catch (error) {
            console.error(error);
            toast.error(`${username} not found`);
        }
    };

    const removeUser = (userId: string) => {
        setSelectedUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
        );
    };

    const handleCreateChat = async () => {
        if (!user) return;

        if (!selectedUsers.length) {
            toast.error('You must select a user');
            return;
        }

        if (isGroup && !groupName) {
            toast.error('Group name is required');
            return;
        }

        const chatPayload = {
            members: [user._id, ...selectedUsers.map((u) => u._id)].filter(
                Boolean
            ),
            isGroup,
            name: isGroup ? groupName : undefined,
        };

        try {
            const { data } = await apiClient.post('/chats', chatPayload);
            const chatExists = chats.some((room) => room._id === data._id);

            if (!chatExists) {
                setChats([...chats, data]);
                toast.success('Chat created successfully');
            } else {
                toast.info('Chat already exists');
            }
        } catch (error) {
            console.error('Failed to create chat', error);
            toast.error('Failed to create chat');
        }
    };

    if (loading) return null;

    // return (
    //     <div className='flex flex-col items-center justify-center h-screen bg-gray-800 text-white'>
    //         <h1 className='text-4xl mb-4'>Join or Create a Chat</h1>

    //         {/* Room Selection Dropdown */}
    //         <select
    //             key={selectedChatId}
    //             className='mb-4 px-16 py-4 rounded bg-gray-700 text-white'
    //             value={selectedChatId}
    //             onChange={(e) => setSelectedChatId(e.target.value)}
    //         >
    //             <option value='' disabled>
    //                 Select Chat
    //             </option>
    //             {chats.map((room) => {
    //                 const otherUser = room.members.find(
    //                     (member) => member.username !== user?.username
    //                 );
    //                 return (
    //                     <option key={room._id} value={room._id}>
    //                         {room.name || otherUser?.username || 'Unknown'}
    //                     </option>
    //                 );
    //             })}
    //         </select>

    //         <button
    //             onClick={handleJoinRoom}
    //             className='bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4'
    //         >
    //             Join Room
    //         </button>

    //         {/* Username Search Input */}
    //         <div className='flex flex-col items-center w-full max-w-md'>
    //             <input
    //                 type='text'
    //                 placeholder='Enter username'
    //                 value={username}
    //                 onChange={handleUsernameChange}
    //                 className='mb-2 w-full px-4 py-2 rounded bg-gray-700 text-white'
    //             />
    //             {/* {selectedUser && <p className="text-green-400">Found: {selectedUser.username}</p>} */}
    //         </div>

    //         {/* Selected Users List */}
    //         {selectedUsers.length > 0 && (
    //             <div className='flex flex-wrap gap-2 mb-4'>
    //                 {selectedUsers.map((user) => (
    //                     <div
    //                         key={user._id}
    //                         className='flex items-center bg-gray-700 p-2 rounded-lg'
    //                     >
    //                         <span className='mr-2'>{user.username}</span>
    //                         <button
    //                             onClick={() => removeUser(user._id)}
    //                             className='text-red-400 hover:text-red-600'
    //                         >
    //                             <GrClose size={18} />
    //                         </button>
    //                     </div>
    //                 ))}
    //             </div>
    //         )}

    //         {/* Group Chat Checkbox */}
    //         <div className='flex items-center mb-4'>
    //             <input
    //                 type='checkbox'
    //                 checked={isGroup}
    //                 onChange={(e) => setIsGroup(e.target.checked)}
    //                 className='mr-2'
    //             />
    //             <label>Is Group Chat</label>
    //         </div>

    //         {/* Group Name Input */}
    //         {isGroup && (
    //             <input
    //                 type='text'
    //                 placeholder='Group Name'
    //                 value={groupName}
    //                 onChange={(e) => setGroupName(e.target.value)}
    //                 className='mb-2 w-full max-w-md px-4 py-2 rounded bg-gray-700 text-white'
    //             />
    //         )}

    //         <button
    //             onClick={handleCreateChat}
    //             className='bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded'
    //         >
    //             Create Chat
    //         </button>
    //     </div>
    // );

    // return (
    //   <div className="flex h-screen bg-gray-900 text-white">
    //     {/* Mobile sidebar toggle button */}
    //     <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md" onClick={toggleSidebar}>
    //       {isSidebarOpen ? <GrClose size={24} /> : <GrMenu size={24} />}
    //     </button>
  
    //     {/* Sidebar */}
    //     <div
    //       className={`
    //       md:w-1/3 bg-gray-800 border-r border-gray-700
    //       fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out
    //       ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    //       md:relative md:translate-x-0
    //     `}
    //     >
    //       <ChatList
    //         user={user}
    //         chats={chats}
    //         selectedChatId={selectedChatId}
    //         onSelectChat={(chatId) => {
    //           setSelectedChatId(chatId)
    //           setIsSidebarOpen(false) // Close sidebar on chat selection on mobile
    //         }}
    //       />
    //     </div>
  
    //     {/* Main content */}
    //     <div className="flex-1 md:w-2/3 bg-gray-900">
    //       <ChatArea selectedChatId={selectedChatId} />
    //     </div>
    //   </div>
    // )

    return (
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <div className="md:hidden">
        <ChatHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          selectedChat={selectedChat}
          currentUser={user}
          onlineUsers={onlineUsers}
        />
        </div>
  
        <div className="flex flex-1 overflow-hidden md:pt-0">
          {" "}
          {/* Add padding-top to account for fixed header */}
          {/* Sidebar */}
          <div
            className={`
              md:w-1/3 bg-gray-800 border-r border-gray-700
              fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              md:relative md:translate-x-0 pt-16 md:pt-0
            `}
          >
            <ChatList
              user={user}
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={(chatId) => {
                setSelectedChatId(chatId)
                setIsSidebarOpen(false)
              }}
              typingUsers={typingUsers}
              onlineUsers={onlineUsers}
            />
          </div>
          {/* Main content */}
          <div className="flex-1 md:w-2/3 bg-gray-900 overflow-hidden pt-16 md:pt-0">
          <ChatArea selectedChatId={selectedChatId} typingUsers={typingUsers[selectedChatId] || new Set()} />
          </div>
        </div>
      </div>
    )

  };

export default ChatSelectionPage;
