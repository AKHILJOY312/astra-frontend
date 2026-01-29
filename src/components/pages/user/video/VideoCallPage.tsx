import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { userCreateMeeting } from "@/services/meetings.service";

export default function VideoCallPage() {
  return (
    <div className="min-h-screen bg-[#1a1d21] flex items-center justify-center text-white">
      <CreateMeetingCard />
    </div>
  );
}

function CreateMeetingCard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateMeeting = async () => {
    try {
      setLoading(true);

      const res = await userCreateMeeting();
      const { code } = res.data.data;

      navigate(`/meeting/${code}/lobby`);
    } catch (error) {
      console.error("Create meeting failed", error);
      alert("Unable to create meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#232529] border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Start a meeting</h2>

      <button
        onClick={handleCreateMeeting}
        disabled={loading}
        className="
          w-full py-2 rounded-lg font-medium
          bg-linear-to-r from-purple-600 to-blue-600
          hover:opacity-90 disabled:opacity-50
        "
      >
        {loading ? "Creating…" : "Create meeting"}
      </button>
    </div>
  );
}

export function MeetingRoomPage() {
  return (
    <div className="min-h-screen bg-[#1a1d21] flex flex-col">
      <VideoGrid />
      <CallControls />
    </div>
  );
}
function VideoGrid() {
  return (
    <div className="flex-1 grid grid-cols-2 gap-4 p-4">
      <LocalVideo />
      <RemoteVideo />
    </div>
  );
}
function LocalVideo() {
  return (
    <video
      autoPlay
      muted
      playsInline
      className="w-full h-full bg-black rounded-lg"
    />
  );
}

function RemoteVideo() {
  return (
    <video autoPlay playsInline className="w-full h-full bg-black rounded-lg" />
  );
}
function CallControls() {
  return (
    <div className="p-4 bg-[#232529] border-t border-gray-800 flex justify-center gap-4">
      <button className="p-3 rounded-full bg-[#1a1d21] hover:bg-[#2a2d31]">
        🎤
      </button>

      <button className="p-3 rounded-full bg-[#1a1d21] hover:bg-[#2a2d31]">
        🎥
      </button>

      <button className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white">
        ⛔
      </button>
    </div>
  );
}
