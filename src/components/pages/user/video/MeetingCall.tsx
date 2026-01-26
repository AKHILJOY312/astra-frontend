import { useEffect, useRef, useState } from "react";
import { meetingGateway } from "@/services/gateway/MeetingGateway ";
import { useMeetingCall } from "@/hooks/useMeetingCall";

export default function MeetingCall() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [code, setCode] = useState("");

  const { localStream, remoteStream, joinMeeting, leaveMeeting } =
    useMeetingCall({ meetingGateway });

  // Attach local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-lg font-semibold">Meeting Call</h2>

      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-64 h-48 bg-black rounded"
        />

        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-64 h-48 bg-black rounded"
        />
      </div>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Meeting code"
          className="border px-2 py-1 rounded text-black"
        />

        <button
          onClick={() => joinMeeting(code)}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Join
        </button>

        <button
          onClick={leaveMeeting}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Leave
        </button>
      </div>
    </div>
  );
}
