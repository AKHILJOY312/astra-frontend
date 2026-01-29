import type { MeetingGateway } from "@/services/gateway/MeetingGateway ";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseMeetingCallDeps {
  meetingGateway: MeetingGateway;
}

interface UseMeetingCallResult {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  joinMeeting: (code: string) => void;
  leaveMeeting: () => void;
}

const ICE_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useMeetingCall(deps: UseMeetingCallDeps): UseMeetingCallResult {
  const { meetingGateway } = deps;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const meetingIdRef = useRef<string | null>(null);
  const iceQueue = useRef<RTCIceCandidateInit[]>([]);
  console.log(" useMeetingCall initialized");
  // Track if we are currently making an offer to avoid state errors
  const isMakingOffer = useRef(false);

  useEffect(() => {
    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (err) {
        console.error(
          " Media access denied. Peer connection will have no tracks.",
          err,
        );
        // We set an empty stream or handle no-stream state so signaling can still proceed
        setLocalStream(new MediaStream());
      }
    }
    console.log(" Initializing media devices");
    initMedia();
  }, []);

  // 2. Peer Connection Factory
  const createPeerConnection = useCallback(
    (targetSocketId: string) => {
      console.log(" Creating/Getting PeerConnection for", targetSocketId);
      if (pcRef.current) return pcRef.current;

      const pc = new RTCPeerConnection(ICE_CONFIG);

      // CRITICAL: Add tracks to the PC immediately if stream exists
      if (localStream) {
        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));
      }

      pc.ontrack = (event) => {
        console.log(" REMOTE TRACK RECEIVED", event.streams[0]);
        setRemoteStream(event.streams[0]);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && meetingIdRef.current) {
          meetingGateway.sendSignal({
            meetingId: meetingIdRef.current,
            targetSocketId,
            signal: { candidate: event.candidate },
          });
        }
      };

      pcRef.current = pc;
      return pc;
    },
    [localStream, meetingGateway],
  );

  // 3. Signaling Logic
  useEffect(() => {
    // Only start signaling if we have a local stream ready
    console.log(" Setting up signaling listeners");
    if (!localStream) return;

    meetingGateway.onUserJoined(async ({ socketId, meetingId }) => {
      meetingIdRef.current = meetingId;
      const pc = createPeerConnection(socketId);

      try {
        isMakingOffer.current = true;
        // The PC already has tracks from createPeerConnection
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("📡 Sending Offer to", socketId);
        meetingGateway.sendSignal({
          meetingId,
          targetSocketId: socketId,
          signal: { sdp: pc.localDescription },
        });
      } catch (err) {
        console.error("Offer failed", err);
      } finally {
        isMakingOffer.current = false;
      }
    });
    console.log(" Setting up signal handler");
    meetingGateway.onSignal(async ({ fromSocketId, signal, meetingId }) => {
      console.log(" Signal received from", fromSocketId, signal);
      const pc = createPeerConnection(fromSocketId);
      const myId = meetingGateway.socketId;
      if (meetingId && !meetingIdRef.current) {
        meetingIdRef.current = meetingId;
      }
      try {
        if (signal.sdp) {
          const desc = new RTCSessionDescription(signal.sdp);
          const isOfferCollision =
            desc.type === "offer" &&
            (isMakingOffer.current || pc.signalingState !== "stable");

          const isPolite = myId ? myId < fromSocketId : false;

          if (isOfferCollision) {
            if (!isPolite) return;
            await pc.setLocalDescription({ type: "rollback" });
          }

          await pc.setRemoteDescription(desc);

          if (desc.type === "offer") {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            console.log("📡 Sending Answer to", fromSocketId);
            meetingGateway.sendSignal({
              meetingId: meetingIdRef.current!,
              targetSocketId: fromSocketId,
              signal: { sdp: pc.localDescription },
            });
          }

          // Flush ICE
          while (iceQueue.current.length) {
            const cand = iceQueue.current.shift();
            if (cand) await pc.addIceCandidate(new RTCIceCandidate(cand));
          }
        } else if (signal.candidate) {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } else {
            iceQueue.current.push(signal.candidate);
          }
        }
      } catch (err) {
        console.error("Signaling Error:", err);
      }
    });

    return () => meetingGateway.offAll();
  }, [localStream, meetingGateway, createPeerConnection]);

  function destroyPeer() {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setRemoteStream(null);
    iceQueue.current = [];
  }

  return {
    localStream,
    remoteStream,
    joinMeeting: (code) => meetingGateway.joinMeeting(code),
    leaveMeeting: () => {
      if (meetingIdRef.current)
        meetingGateway.leaveMeeting(meetingIdRef.current);
      destroyPeer();
    },
  };
}
