import { GrPowerShutdown } from "react-icons/gr";

const TopBar: React.FC<{ roomId: string; onLogout: () => void }> = ({
  roomId,
  onLogout,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-700">
      <h1 className="text-2xl font-bold">Room: {roomId}</h1>
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