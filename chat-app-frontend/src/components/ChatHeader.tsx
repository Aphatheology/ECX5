import type React from "react"
import { GrClose, GrMenu } from "react-icons/gr"
import type { IChat } from "@/interfaces/chat"
import type { IUser } from "@/interfaces/user"

interface ChatHeaderProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  selectedChat: IChat | null
  currentUser: IUser | null
  onlineUsers: Set<string>
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isSidebarOpen,
  toggleSidebar,
  selectedChat,
  currentUser,
  onlineUsers }) => {
  let headerText = "Select a chat"

  let isOnline = false

  if (selectedChat) {
    if (selectedChat.name) {
      headerText = `Room: ${selectedChat.name}`
    } else {
      const otherUser = selectedChat.members.find((member) => member.username !== currentUser?.username)
      if (otherUser) {
        headerText = `Chat: ${otherUser.username}`
        isOnline = onlineUsers.has(otherUser.username)
      }
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gray-800 p-4 flex items-center border-b border-gray-700">
      <button className="mr-4" onClick={toggleSidebar}>
        {isSidebarOpen ? <GrClose size={24} /> : <GrMenu size={24} />}
      </button>
      <h1 className="text-xl font-semibold truncate flex items-center">
        {headerText}
        {!selectedChat?.isGroup && isOnline && <span className="ml-2 w-3 h-3 bg-green-500 rounded-full"></span>}
      </h1>
    </div>
  )
}

export default ChatHeader
