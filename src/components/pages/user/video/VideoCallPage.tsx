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
