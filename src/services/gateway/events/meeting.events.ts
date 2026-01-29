export interface ClientToSeverMeetingEvents {
  "meeting:join": (payload: { code: string }) => void;

  "meeting:leave": (payload: { meetingId: string }) => void;

  "meeting:signal": (payload: {
    meetingId: string;
    targetSocketId: string;
    signal: any;
  }) => void;
}

export interface ServerToClientMeetingEvents {
  "meeting:user-joined": (payload: {
    socketId: string;
    meetingId: string;
  }) => void;

  "meeting:user-left": (payload: { socketId: string }) => void;

  "meeting:signal": (payload: {
    fromSocketId: string;
    signal: any;
    meetingId: string;
  }) => void;
}
