export default function VideoCallPage() {
  return (
    <div className="min-h-screen bg-[#1a1d21] flex items-center justify-center text-white">
      <CreateMeetingCard />
    </div>
  );
}
function CreateMeetingCard() {
  return (
    <div className="w-full max-w-md bg-[#232529] border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Start a meeting</h2>

      <button
        className="
          w-full py-2 rounded-lg font-medium
          bg-linear-to-r from-purple-600 to-blue-600
          hover:opacity-90
        "
      >
        Create meeting
      </button>
    </div>
  );
}

export function MeetingLobbyPage() {
  return (
    <div className="min-h-screen bg-[#1a1d21] flex items-center justify-center">
      <div className="bg-[#232529] border border-gray-800 rounded-xl p-6 w-full max-w-lg">
        <DevicePreview />
        <DeviceControls />
        <JoinActions />
      </div>
    </div>
  );
}
function DevicePreview() {
  return (
    <div className="relative mb-4">
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-64 bg-black rounded-lg"
      />

      <span className="absolute bottom-2 left-2 text-sm text-gray-300">
        You
      </span>
    </div>
  );
}
function DeviceControls() {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <button className="p-3 rounded-full bg-[#1a1d21] hover:bg-[#2a2d31]">
        🎤
      </button>

      <button className="p-3 rounded-full bg-[#1a1d21] hover:bg-[#2a2d31]">
        🎥
      </button>
    </div>
  );
}
function JoinActions() {
  return (
    <div className="flex gap-3">
      <button
        className="
          flex-1 py-2 rounded-lg font-medium
          bg-linear-to-r from-purple-600 to-blue-600
        "
      >
        Join now
      </button>

      <button className="flex-1 py-2 rounded-lg bg-[#1a1d21] hover:bg-[#2a2d31] text-gray-300">
        Cancel
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
