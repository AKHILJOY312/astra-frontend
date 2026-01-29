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

  get socketId(): string | undefined {
    return this.socket?.id;
  }

  connect(socket: MeetingSocket) {
    console.log("🟢 meeting gateway connected", socket.id);

    this.socket = socket;
  }

  disconnect() {
    this.socket?.removeAllListeners();
    this.socket = null;
  }

  // ---------- emits ----------

  joinMeeting(code: string) {
    this.ensureSocket();
    console.log("📡 emit meeting:join", code);
    this.socket!.emit("meeting:join", { code });
  }

  leaveMeeting(meetingId: string) {
    this.ensureSocket();
    this.socket!.emit("meeting:leave", { meetingId });
  }

  // ---------- listeners ----------

  onUserJoined(cb: (payload: { socketId: string; meetingId: string }) => void) {
    this.ensureSocket();
    this.socket!.on("meeting:user-joined", (payload) => {
      console.log("📥 meeting:user-joined", payload);
      cb(payload);
    });
  }

  onUserLeft(cb: (payload: { socketId: string }) => void) {
    this.ensureSocket();
    this.socket!.on("meeting:user-left", cb);
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
