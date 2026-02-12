// import { useEffect, useRef } from "react";
// import { meetingGateway } from "@/services/gateway/MeetingGateway ";
// import { useMeetingCall } from "@/hooks/useMeetingCall";

// interface MeetingCallProps {
//   meetingCode: string;
// }

// // Update your MeetingCall.tsx to ensure the refs are handled correctly
// export default function MeetingCall({ meetingCode }: MeetingCallProps) {
//   const localVideoRef = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

//   const { localStream, remoteStream, joinMeeting, leaveMeeting } =
//     useMeetingCall({ meetingGateway });

//   useEffect(() => {
//     joinMeeting(meetingCode);
//     return () => leaveMeeting();
//   }, [meetingCode]);

//   // Attach local stream
//   useEffect(() => {
//     if (localVideoRef.current && localStream) {
//       localVideoRef.current.srcObject = localStream;
//     }
//   }, [localStream]);

//   // Attach remote stream
//   useEffect(() => {
//     if (remoteVideoRef.current && remoteStream) {
//       console.log(
//         "🔗 Attaching remote stream to video element",
//         remoteStream.id,
//       );
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [remoteStream]);

//   return (
//     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-[calc(100vh-80px)]">
//       <div className="relative">
//         <video
//           ref={localVideoRef}
//           autoPlay
//           muted
//           playsInline
//           className="w-full h-full bg-black rounded-lg object-cover mirror"
//         />
//         <span className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded text-sm">
//           You (Local)
//         </span>
//       </div>

//       <div className="relative">
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//           className="w-full h-full bg-black rounded-lg object-cover"
//         />
//         {!remoteStream && (
//           <div className="absolute inset-0 flex items-center justify-center text-gray-500">
//             Waiting for others to join...
//           </div>
//         )}
//         <span className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded text-sm">
//           Remote User
//         </span>
//       </div>
//     </div>
//   );
// }
