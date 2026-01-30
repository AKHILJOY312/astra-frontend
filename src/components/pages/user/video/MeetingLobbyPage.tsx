import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function MeetingLobbyPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function toggleMic() {
    stream?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    setMicOn(!micOn);
  }

  function toggleCam() {
    stream?.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    setCamOn(!camOn);
  }

  function joinMeeting() {
    stream?.getTracks().forEach((t) => t.stop());
    navigate(`/meeting/${code}`, {
      state: { initialMic: micOn, initialCam: camOn },
    });
  }

  return (
    <div className="min-h-screen bg-[#1a1d21] flex items-center justify-center">
      <div className="bg-[#232529] border border-gray-800 rounded-xl p-6 w-full max-w-lg">
        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-64 bg-black rounded-lg"
          />
          <span className="absolute bottom-2 left-2 text-gray-300">You</span>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button onClick={toggleMic} className="p-3 rounded-full bg-[#1a1d21]">
            {micOn ? <Mic /> : <MicOff />}
          </button>

          <button onClick={toggleCam} className="p-3 rounded-full bg-[#1a1d21]">
            {camOn ? <Camera /> : <CameraOff />}
          </button>
        </div>

        <button
          onClick={joinMeeting}
          className="w-full py-2 rounded-lg bg-linear-to-r from-purple-600 to-blue-600"
        >
          Join now
        </button>
      </div>
    </div>
  );
}
