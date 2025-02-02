import { IChat } from '@/interfaces/chat';
import { GrPowerShutdown } from "react-icons/gr";

interface TopBarProps {
  chat: IChat;  
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  chat,
  onLogout,
}) => {

  const renderRoomName = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (chat?.name) {
        return `Room: ${chat.name}`;
    } else if (chat?.members?.length > 1) {
      const otherUser = chat.members.find(member => member.username !== user.username);
        return `Chat: ${otherUser?.username || "Unknown"}`;
    }
    return "Chat";
};
 
  return (
    <div className="flex items-center justify-between p-4 bg-gray-700">
      <h1 className="text-2xl font-bold">{renderRoomName()}</h1>

      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
      >
        <GrPowerShutdown />
      </button>
    </div>
  );
};

export default TopBar;