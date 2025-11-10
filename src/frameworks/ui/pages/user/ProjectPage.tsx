import React from "react";
import { Button } from "../common/Button";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import type { AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";

function ProjectPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div>
      projectPage
      <Button
        onClick={() => {
          handleLogout();
        }}
      >
        {" "}
        logout
      </Button>
    </div>
  );
}

export default ProjectPage;

// "use client";

// import React, { useState } from "react";
// import {
//   Search,
//   Plus,
//   Hash,
//   Bell,
//   Inbox,
//   HelpCircle,
//   ChevronDown,
//   Settings,
//   Send,
//   Smile,
//   Paperclip,
//   Gift,
//   AtSign,
//   MoreHorizontal,
//   Circle,
//   Menu,
//   X,
//   Users,
//   Home,
// } from "lucide-react";
// import { format } from "date-fns";

// interface Message {
//   id: string;
//   user: string;
//   avatar: string;
//   content: string;
//   timestamp: Date;
//   reactions: { emoji: string; count: number }[];
//   thread?: boolean;
// }

// export default function SlackCloneResponsive() {
//   const [selectedChannel, setSelectedChannel] = useState("general");
//   const [message, setMessage] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [channelSidebarOpen, setChannelSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState<"chat" | "members">("chat");

//   const channels = ["general", "random", "design", "engineering", "marketing"];
//   const directMessages = ["Alice", "Bob", "Charlie", "Diana", "Ethan"];

//   const messages: Message[] = [
//     {
//       id: "1",
//       user: "Alice",
//       avatar: "A",
//       content: "Hey team! Just pushed the new design system to production!",
//       timestamp: new Date(Date.now() - 1000 * 60 * 5),
//       reactions: [
//         { emoji: "party", count: 4 },
//         { emoji: "heart", count: 2 },
//       ],
//     },
//     {
//       id: "2",
//       user: "Bob",
//       avatar: "B",
//       content: "Looks amazing! The new components are super clean.",
//       timestamp: new Date(Date.now() - 1000 * 60 * 3),
//       reactions: [{ emoji: "thumbs up", count: 3 }],
//       thread: true,
//     },
//     {
//       id: "3",
//       user: "Charlie",
//       avatar: "C",
//       content: "Quick question: when is the standup today?",
//       timestamp: new Date(Date.now() - 1000 * 60 * 1),
//       reactions: [],
//     },
//   ];

//   const members = [
//     { id: 1, name: "Alice Johnson", status: "online" },
//     { id: 2, name: "Bob Smith", status: "online" },
//     { id: 3, name: "Charlie Brown", status: "away" },
//     { id: 4, name: "Diana Prince", status: "offline" },
//   ];

//   return (
//     <>
//       <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
//         {/* Left Workspace Sidebar - Hidden on mobile, toggleable */}
//         <div
//           className={`fixed inset-y-0 left-0 z-50 w-18 bg-gray-950 flex flex-col items-center py-4 gap-4 transform transition-transform lg:relative lg:translate-x-0 ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-lg cursor-pointer hover:rounded-xl transition-all">
//             SL
//           </div>
//           <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600">
//             <Plus className="w-6 h-6" />
//           </div>
//           <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center cursor-pointer hover:rounded-xl transition-all">
//             <Hash className="w-6 h-6" />
//           </div>
//         </div>

//         {/* Channel Sidebar - Collapsible on desktop, full on mobile */}
//         <div
//           className={`fixed inset-y-0 left-18 z-40 w-64 bg-gray-800 flex flex-col transform transition-transform lg:relative lg:translate-x-0 ${
//             channelSidebarOpen ? "translate-x-0" : "-translate-x-full"
//           } ${sidebarOpen ? "z-40" : "z-40"}`}
//         >
//           {/* Header */}
//           <div className="p-4 border-b border-gray-700">
//             <div className="flex items-center justify-between">
//               <h1 className="font-bold text-xl">My Workspace</h1>
//               <ChevronDown className="w-5 h-5" />
//             </div>
//             <div className="mt-3 relative">
//               <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full bg-gray-700 rounded pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//           </div>

//           {/* Channels & DMs */}
//           <div className="flex-1 overflow-y-auto">
//             <div className="px-3 py-2">
//               <div className="flex items-center justify-between text-gray-400 text-sm">
//                 <span className="flex items-center gap-2">
//                   <ChevronDown className="w-4 h-4" />
//                   Channels
//                 </span>
//                 <Plus className="w-4 h-4" />
//               </div>
//               {channels.map((channel) => (
//                 <div
//                   key={channel}
//                   onClick={() => {
//                     setSelectedChannel(channel);
//                     setChannelSidebarOpen(false);
//                     setSidebarOpen(false);
//                   }}
//                   className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-700 text-sm ${
//                     selectedChannel === channel
//                       ? "bg-gray-700 text-white"
//                       : "text-gray-400"
//                   }`}
//                 >
//                   <Hash className="w-5 h-5" />
//                   <span>{channel}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="px-3 py-2">
//               <div className="flex items-center justify-between text-gray-400 text-sm">
//                 <span className="flex items-center gap-2">
//                   <ChevronDown className="w-4 h-4" />
//                   Direct Messages
//                 </span>
//                 <Plus className="w-4 h-4" />
//               </div>
//               {directMessages.map((name) => (
//                 <div
//                   key={name}
//                   className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-gray-700 text-gray-400 text-sm"
//                 >
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <Circle className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
//                     {name[0]}
//                   </Circle>
//                   <span>{name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* User Footer */}
//           <div className="p-3 border-t border-gray-700">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">
//                 Y
//               </div>
//               <div className="flex-1">
//                 <div className="text-sm font-medium">You</div>
//                 <div className="text-xs text-green-400">Online</div>
//               </div>
//               <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-200" />
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col relative">
//           {/* Top Bar - Mobile */}
//           <div className="lg:hidden border-b border-gray-700 px-4 py-3 flex items-center justify-between bg-gray-800">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2"
//             >
//               <Menu className="w-6 h-6" />
//             </button>
//             <div className="flex items-center gap-2">
//               <Hash className="w-5 h-5" />
//               <span className="font-semibold"># {selectedChannel}</span>
//             </div>
//             <button onClick={() => setChannelSidebarOpen(true)} className="p-2">
//               <Users className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Desktop Header */}
//           <div className="hidden lg:flex border-b border-gray-700 px-6 py-4 items-center justify-between">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setChannelSidebarOpen(!channelSidebarOpen)}
//                 className="p-2 hover:bg-gray-700 rounded"
//               >
//                 <Menu className="w-5 h-5" />
//               </button>
//               <Hash className="w-6 h-6" />
//               <h2 className="text-xl font-bold"># {selectedChannel}</h2>
//             </div>
//             <div className="flex items-center gap-4">
//               <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
//               <Inbox className="w-5 h-5 cursor-pointer hover:text-gray-300" />
//               <HelpCircle className="w-5 h-5 cursor-pointer hover:text-gray-300" />
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6 space-y-4">
//             {messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className="flex gap-3 hover:bg-gray-800 px-4 py-2 rounded -mx-4 group"
//               >
//                 <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
//                   {msg.avatar}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="font-semibold">{msg.user}</span>
//                     <span className="text-xs text-gray-400">
//                       {format(msg.timestamp, "h:mm a")}
//                     </span>
//                   </div>
//                   <p className="text-gray-100 break-words">{msg.content}</p>
//                   {msg.reactions.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {msg.reactions.map((r, i) => (
//                         <div
//                           key={i}
//                           className="bg-gray-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
//                         >
//                           <span>{r.emoji}</span>
//                           <span>{r.count}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   {msg.thread && (
//                     <div className="text-xs text-purple-400 mt-1 cursor-pointer hover:underline">
//                       2 replies
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Message Input */}
//           <div className="px-4 pb-4 lg:px-6">
//             <div className="bg-gray-700 rounded-lg px-4 py-3 flex items-center gap-3">
//               <Paperclip className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-200 flex-shrink-0" />
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder={`Message #${selectedChannel}`}
//                 className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-400"
//                 onKeyDown={(e) =>
//                   e.key === "Enter" && !e.shiftKey && e.preventDefault()
//                 }
//               />
//               <div className="flex items-center gap-2">
//                 <Smile className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-200" />
//                 {message && (
//                   <button className="bg-purple-600 p-2 rounded-full hover:bg-purple-700">
//                     <Send className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Mobile Bottom Navigation */}
//           <div className="lg:hidden border-t border-gray-700 bg-gray-800 flex">
//             <button
//               onClick={() => setActiveTab("chat")}
//               className={`flex-1 py-3 flex flex-col items-center gap-1 ${
//                 activeTab === "chat" ? "text-purple-400" : "text-gray-400"
//               }`}
//             >
//               <Home className="w-5 h-5" />
//               <span className="text-xs">Chat</span>
//             </button>
//             <button
//               onClick={() => setActiveTab("members")}
//               className={`flex-1 py-3 flex flex-col items-center gap-1 ${
//                 activeTab === "members" ? "text-purple-400" : "text-gray-400"
//               }`}
//             >
//               <Users className="w-5 h-5" />
//               <span className="text-xs">Members</span>
//             </button>
//           </div>
//         </div>

//         {/* Right Sidebar - Members (Desktop) */}
//         <div className="hidden lg:block w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
//           <div className="p-4 border-b border-gray-700">
//             <h3 className="font-semibold">Members</h3>
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             {members.map((member) => (
//               <div
//                 key={member.name}
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer"
//               >
//                 <div className="relative">
//                   <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
//                     {member.name[0]}
//                   </div>
//                   <div
//                     className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
//                       member.status === "online"
//                         ? "bg-green-500"
//                         : member.status === "away"
//                         ? "bg-yellow-500"
//                         : "bg-gray-600"
//                     }`}
//                   ></div>
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium">{member.name}</div>
//                   <div className="text-xs text-gray-400 capitalize">
//                     {member.status}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Mobile Members Panel */}
//         {activeTab === "members" && (
//           <div className="lg:hidden fixed inset-x-0 bottom-16 top-0 bg-gray-800 z-50 pt-16">
//             <div className="flex items-center justify-between p-4 border-b border-gray-700">
//               <h3 className="font-semibold">Members</h3>
//               <button onClick={() => setActiveTab("chat")}>
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <div className="overflow-y-auto">
//               {members.map((member) => (
//                 <div
//                   key={member.id}
//                   className="flex items-center gap-3 px-4 py-4 hover:bg-gray-700"
//                 >
//                   <div className="relative">
//                     <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-lg font-bold">
//                       {member.name[0]}
//                     </div>
//                     <div
//                       className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
//                         member.status === "online"
//                           ? "bg-green-500"
//                           : member.status === "away"
//                           ? "bg-yellow-500"
//                           : "bg-gray-600"
//                       }`}
//                     ></div>
//                   </div>
//                   <div>
//                     <div className="font-medium">{member.name}</div>
//                     <div className="text-sm text-gray-400 capitalize">
//                       {member.status}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Overlay for mobile sidebars */}
//         {(sidebarOpen || channelSidebarOpen) && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//             onClick={() => {
//               setSidebarOpen(false);
//               setChannelSidebarOpen(false);
//             }}
//           />
//         )}
//       </div>
//     </>
//   );
// }
