// // src/presentation/components/user/modals/CreateChannelModal.tsx
// import { XIcon, Hash, Lock, Loader2 } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { closeCreateChannelModal } from "@/redux/slice/uiSlice";
// import type { RootState } from "@/redux/store/store";
// import { useState } from "react";

// export default function CreateChannelModal() {
//   const dispatch = useDispatch();
//   const isOpen = useSelector((state: RootState) => state.ui.createChannelModal);
//   const currentProject = useSelector(
//     (state: RootState) => state.project.currentProject
//   );

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [isPrivate, setIsPrivate] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentProject || !name.trim()) return;

//     setLoading(true);
//     try {
//       await createChannelUC.execute({
//         projectId: currentProject.id,
//         channelName: name.trim(),
//         description: description.trim() || undefined,
//         isPrivate,
//       });
//       dispatch(closeCreateChannelModal());
//       setName("");
//       setDescription("");
//       setIsPrivate(false);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Create Channel
//           </h2>
//           <button
//             onClick={() => dispatch(closeCreateChannelModal())}
//             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
//           >
//             <XIcon className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleCreate} className="p-6 space-y-5">
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => setIsPrivate(!isPrivate)}
//               className={`p-3 rounded-xl transition-colors ${
//                 isPrivate
//                   ? "bg-purple-600 text-white"
//                   : "bg-gray-100 dark:bg-gray-800"
//               }`}
//             >
//               {isPrivate ? (
//                 <Lock className="w-6 h-6" />
//               ) : (
//                 <Hash className="w-6 h-6" />
//               )}
//             </button>
//             <div>
//               <h3 className="font-semibold text-gray-900 dark:text-white">
//                 {isPrivate ? "Private Channel" : "Public Channel"}
//               </h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {isPrivate
//                   ? "Only invited members can see"
//                   : "Everyone in project can see"}
//               </p>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Channel Name
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder={isPrivate ? "e.g. secret-plans" : "e.g. general"}
//               className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Description (optional)
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={2}
//               placeholder="What's this channel about?"
//               className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={() => dispatch(closeCreateChannelModal())}
//               className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || !name.trim()}
//               className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 "Create Channel"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
