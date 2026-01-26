import type { Socket } from "socket.io-client";
import type {
  ClientToSeverMeetingEvents,
  ServerToClientMeetingEvents,
} from "./events/meeting.events";

type MeetingSocket = Socket<
  ServerToClientMeetingEvents,
  ClientToSeverMeetingEvents
>;

export class MeetingGateway {
  private socket: MeetingSocket | null = null;

  connect(socket: MeetingSocket) {
    this.socket = socket;
  }

  disconnect() {
    this.socket?.removeAllListeners();
    this.socket = null;
  }

  // ---------- emits ----------

  joinMeeting(code: string) {
    this.ensureSocket();
    this.socket!.emit("meeting:join", { code });
  }

  leaveMeeting(meetingId: string) {
    this.ensureSocket();
    this.socket!.emit("meeting:leave", { meetingId });
  }

  sendSignal(payload: {
    meetingId: string;
    targetSocketId: string;
    signal: any;
  }) {
    this.ensureSocket();
    this.socket!.emit("meeting:signal", payload);
  }

  // ---------- listeners ----------

  onUserJoined(cb: (payload: { socketId: string; meetingId: string }) => void) {
    this.ensureSocket();
    this.socket!.on("meeting:user-joined", cb);
  }

  onUserLeft(cb: (payload: { socketId: string }) => void) {
    this.ensureSocket();
    this.socket!.on("meeting:user-left", cb);
  }

  onSignal(cb: (payload: { fromSocketId: string; signal: any }) => void) {
    this.ensureSocket();
    this.socket!.on("meeting:signal", cb);
  }

  offAll() {
    this.socket?.removeAllListeners();
  }

  private ensureSocket() {
    if (!this.socket) {
      throw new Error("MeetingGateway: socket not connected");
    }
  }
}

export const meetingGateway = new MeetingGateway();
