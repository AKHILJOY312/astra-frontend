// // components/ControllerBar.tsx (Updated)

// import { useState, useRef, useEffect } from "react";
// import {
//   // MessageCircle,
//   Circle,
//   // Radio,
//   // Users,
//   Settings,
//   LogOut,
//   User as UserIcon,
//   Sparkles,
//   LayoutDashboard, // Use a better icon for Dashboard
//   Calendar, // Use a better icon for Schedule
//   ListChecks, // Use a better icon for Tasks
// } from "lucide-react";

// import { useDispatch } from "react-redux";
// import { logoutUser } from "@/presentation/redux/thunk/authThunks";
// import type { AppDispatch } from "@/presentation/redux/store/store";
// import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "@/presentation/redux/hooks"; // Import the custom selector hook

// // --- Constants ---
// const DEFAULT_PROFILE_IMAGE = "/images/user/DummyUser.jpg";

// export default function ControllerBar() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   // 1. Dynamic User Data from Redux State
//   const user = useAppSelector((state) => state.auth.user);

//   // 2. Determine Profile Image URL with Default Fallback
//   const profileImageUrl = DEFAULT_PROFILE_IMAGE;
//   const userName = user?.name || user?.email || "Guest";

//   // close when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Updated navigation items with better icons and structure
//   const navItems = [
//     {
//       label: "Dashboard",
//       icon: <LayoutDashboard className="w-6 h-6" />,
//       route: "/dashboard",
//     },
//     {
//       label: "Projects",
//       icon: <Circle className="w-6 h-6" />,
//       route: "/projects",
//     },
//     {
//       label: "Schedule",
//       icon: <Calendar className="w-6 h-6" />,
//       route: "/schedule",
//     },
//     {
//       label: "Tasks",
//       icon: <ListChecks className="w-6 h-6" />,
//       route: "/tasks",
//     },
//     {
//       label: "Settings",
//       icon: <Settings className="w-6 h-6" />,
//       route: "/settings",
//     },
//     {
//       label: "AI Helper",
//       icon: <Sparkles className="w-6 h-6" />,
//       route: "/ai",
//     },
//   ];

//   const handleLogout = async () => {
//     await dispatch(logoutUser());
//     navigate("/login");
//   };

//   const handleNavClick = (idx: number, route: string) => {
//     setActiveTab(idx);
//     navigate(route);
//   };

//   const profileMenuItems = [
//     {
//       label: "View Profile",
//       icon: <UserIcon className="w-5 h-5" />,
//       onClick: () => navigate("/profile"), // Assuming a profile route
//     },
//     {
//       label: "Logout",
//       icon: <LogOut className="w-5 h-5" />,
//       onClick: handleLogout,
//       isDanger: true,
//     },
//     {
//       label: "Account Settings",
//       icon: <Settings className="w-5 h-5" />,
//       onClick: () => navigate("/settings"), // Or a separate account settings route
//     },
//   ];

//   return (
//     // 3. UI/UX Improvement: Smoother, more contrasting background and shadow
//     <div className="fixed left-0 top-0 h-screen w-20 bg-white shadow-xl flex flex-col items-center py-6 gap-6 z-50 transition-all duration-300">
//       {/* ───── App Logo / Icon Placeholder ───── */}
//       <div className="text-2xl font-bold text-blue-600 mb-4">
//         <img
//           src="/img/svg/logo.svg"
//           alt="App Logo"
//           className="w-8 h-8"
//           width={32}
//           height={32}
//         />
//         {/* Using an icon as a logo placeholder */}
//       </div>

//       {/* ───── Navigation Icons ───── */}
//       <nav className="flex flex-col gap-3 flex-grow">
//         {navItems.map((item, idx) => (
//           // 3. UI/UX Improvement: Hover for Label (Tooltip-like functionality)
//           <div key={idx} className="relative group">
//             <button
//               aria-label={item.label}
//               aria-current={activeTab === idx ? "page" : undefined}
//               onClick={() => handleNavClick(idx, item.route)}
//               className={`
//                 p-3 rounded-xl transition-all duration-200 ease-in-out
//                 flex items-center justify-center relative
//                 ${
//                   activeTab === idx
//                     ? "bg-blue-600 text-white shadow-lg shadow-blue-200" // Stronger active state
//                     : "text-gray-500 hover:bg-gray-100 hover:text-blue-600"
//                 }
//               `}
//             >
//               {item.icon}
//             </button>
//             {/* Tooltip Label */}
//             <span
//               className="absolute left-full ml-3 top-1/2 -translate-y-1/2
//                            bg-gray-800 text-white text-xs font-medium
//                            px-3 py-1 rounded-md opacity-0 pointer-events-none
//                            group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50"
//             >
//               {item.label}
//             </span>
//           </div>
//         ))}
//       </nav>

//       <hr className="w-10 border-t border-gray-200" />

//       {/* ───── Profile button + pop‑up ───── */}
//       <div className="mt-auto relative" ref={menuRef}>
//         {/* Profile button */}
//         <button
//           aria-label="Toggle Profile Menu"
//           onClick={() => setShowProfileMenu((v) => !v)}
//           className={`
//             p-1.5 rounded-full transition-all duration-200
//             ${
//               showProfileMenu
//                 ? "ring-4 ring-blue-300"
//                 : "hover:ring-2 hover:ring-gray-300"
//             }
//           `}
//         >
//           {/* 1 & 2. Dynamic Image with Default Fallback */}
//           <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-gray-200 shadow-md">
//             <img
//               src={profileImageUrl}
//               alt={`${userName}'s Profile`}
//               width={40}
//               height={40}
//               // Add a simple error handler for missing/broken images
//               onError={(e) => {
//                 const target = e.target as HTMLImageElement;
//                 target.onerror = null; // prevents infinite loop
//                 target.src = DEFAULT_PROFILE_IMAGE;
//               }}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </button>

//         {/* Pop‑up menu - 3. UI/UX Improvement: Better design and placement */}
//         {showProfileMenu && (
//           <div className="absolute left-full bottom-1/2 translate-y-1/2 ml-3 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
//             {/* Header with User Info */}
//             <div className="p-4 border-b border-gray-100 bg-blue-50/50">
//               <p className="text-base font-semibold text-gray-800 truncate">
//                 {userName}
//               </p>
//               {user?.email && (
//                 <p className="text-xs text-gray-500 truncate">{user.email}</p>
//               )}
//             </div>

//             <div className="p-2">
//               {profileMenuItems.map((item, i) => (
//                 <button
//                   key={i}
//                   onClick={() => {
//                     item.onClick();
//                     setShowProfileMenu(false);
//                   }}
//                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors duration-150
//                     ${
//                       item.isDanger
//                         ? "text-red-600 hover:bg-red-50"
//                         : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
//                     }`}
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
