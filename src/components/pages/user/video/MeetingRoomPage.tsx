import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useParams } from "react-router-dom";
import { useMeetingToken } from "@/hooks/useLiveKit";
import { meetingGateway } from "@/services/gateway/MeetingGateway ";
import { useEffect } from "react";

export function MeetingRoomPage() {
  const { code } = useParams<{ code: string }>();
  const { token, serverUrl } = useMeetingToken(code!);

  useEffect(() => {
    if (code) {
      meetingGateway.joinMeeting(code);
    }
  }, [code]);

  if (!token || !serverUrl) {
    return (
      <div className="min-h-screen bg-[#1a1d21] flex items-center justify-center text-white">
        Connecting to Astra Media Servers...
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1a1d21]">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        // Connect automatically
        connect={true}
        onDisconnected={() => (window.location.href = "/meetings")}
      >
        {/* Your Video Grid */}
        <VideoConference />

        {/* Essential for hearing others */}
        <RoomAudioRenderer />

        {/* Customized bottom bar (optional) */}
        {/* <ControlBar variation="minimal" /> */}
      </LiveKitRoom>
    </div>
  );
}
