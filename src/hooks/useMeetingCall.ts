import type { MeetingGateway } from "@/services/gateway/MeetingGateway ";
import { useCallback, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

interface UseMeetingCallDeps {
  meetingGateway: MeetingGateway;
}
interface UseMeetingCallResult {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  joinMeeting: (code: string) => void;
  leaveMeeting: () => void;
}

export function useMeetingCall(deps: UseMeetingCallDeps): UseMeetingCallResult {
  const { meetingGateway } = deps;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerRef = useRef<Peer.Instance | null>(null);
  const meetingIdRef = useRef<string | null>(null);
  const remoteSocketIdRef = useRef<string | null>(null);

  //  Get local media once
  useEffect(() => {
    let mounted = true;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (mounted) setLocalStream(stream);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Socket event bindings
  useEffect(() => {
    meetingGateway.onUserJoined(({ socketId, meetingId }) => {
      meetingIdRef.current = meetingId;
      remoteSocketIdRef.current = socketId;

      // First user becomes initiator
      createPeer(true);
    });

    meetingGateway.onSignal(({ fromSocketId, signal }) => {
      if (!peerRef.current) {
        remoteSocketIdRef.current = fromSocketId;
        createPeer(false);
      }

      peerRef.current!.signal(signal);
    });

    meetingGateway.onUserLeft(() => {
      destroyPeer();
      setRemoteStream(null);
    });

    return () => {
      meetingGateway.offAll();
    };
  }, [meetingGateway, localStream]);

  //  Peer creation logic
  const createPeer = useCallback(
    (initiator: boolean) => {
      if (!localStream) return;
      if (peerRef.current) return;

      const peer = new Peer({
        initiator,
        trickle: false,
        stream: localStream,
      });

      peer.on("signal", (signal) => {
        meetingGateway.sendSignal({
          meetingId: meetingIdRef.current!,
          targetSocketId: remoteSocketIdRef.current!,
          signal,
        });
      });

      peer.on("stream", (stream) => {
        setRemoteStream(stream);
      });

      peer.on("close", destroyPeer);
      peer.on("error", destroyPeer);

      peerRef.current = peer;
    },
    [localStream, meetingGateway],
  );

  // Cleanup
  function destroyPeer() {
    peerRef.current?.destroy();
    peerRef.current = null;
  }

  //  Public API
  function joinMeeting(code: string) {
    meetingGateway.joinMeeting(code);
  }

  function leaveMeeting() {
    if (!meetingIdRef.current) return;

    meetingGateway.leaveMeeting(meetingIdRef.current);
    destroyPeer();
    setRemoteStream(null);
  }

  return {
    localStream,
    remoteStream,
    joinMeeting,
    leaveMeeting,
  };
}
