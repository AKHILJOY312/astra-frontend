import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Trash2, User, Shield, Calendar } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUserProfile,
  updateUserProfile,
  // deleteUserAccount,
  uploadProfileImage,
} from "@/redux/slice/userSlice";
import { logoutUser } from "@/redux/thunk/authThunks";

const FALLBACK_IMAGE = "/images/user/DummyUser.jpg";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [changePwdConfirmOpen, setChangePwdConfirmOpen] = useState(false);

  const { profile, loading, error } = useAppSelector((state) => state.user);

  /* ---------------- UI STATES ---------------- */
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  /* ---------------- HANDLERS ---------------- */
  const handleUpdateProfile = () => {
    dispatch(updateUserProfile({ name, email }));
    setEditOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    dispatch(uploadProfileImage(file));
  };

  const handleDeleteAccount = () => {
    // dispatch(deleteUserAccount());
    alert("Not done!");
  };
  const confirmChangePassword = () => {
    dispatch(logoutUser());
    navigate("/forget-password");
  };

  if (loading) return <p className="p-6 text-gray-400">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;
  if (!profile) return null;

  /* ====================== UI ====================== */
  return (
    <div className="min-h-screen bg-[#1a1d21] text-gray-100">
      <div className="max-w-4xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Profile Settings</h2>
          <p className="text-gray-400 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        {/* ---------------- PROFILE CARD ---------------- */}
        <div className="bg-[#232529] border border-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header Section with Profile Image */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-8 border-b border-gray-800">
            <div className="flex items-start gap-6">
              <div className="relative group">
                <img
                  src={profile.imageUrl || FALLBACK_IMAGE}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 shadow-lg"
                />

                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Camera size={16} />
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex-1 pt-2">
                <h3 className="text-2xl font-semibold text-white">
                  {profile.name}
                </h3>
                <p className="text-gray-400 mt-1">{profile.email}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                      profile.isVerified
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}
                  >
                    <Shield size={12} />
                    {profile.isVerified ? "Verified" : "Unverified"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* PLAN */}
            {profile.plan && (
              <div className="bg-[#1a1d21] border border-gray-800 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-white">Current Plan</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                      Amount
                    </p>
                    <p className="text-white font-medium">
                      ₹{profile.plan.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <p
                      className={`font-medium inline-flex items-center gap-1.5 ${
                        profile.plan.status === "active"
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          profile.plan.status === "active"
                            ? "bg-green-400"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      {profile.plan.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                      Valid Until
                    </p>
                    <p className="text-white font-medium flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(profile.plan.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              {/* <button
                onClick={() => setEditOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#1a1d21] hover:bg-[#2a2d31] border border-gray-700 hover:border-gray-600 px-5 py-3 rounded-lg transition-all duration-200 text-gray-200 font-medium"
              >
                <Edit size={18} /> Edit Profile
              </button> */}

              <button
                onClick={() => setChangePwdConfirmOpen(true)}
                className="w-full bg-[#1a1d21] hover:bg-[#2a2d31] border border-gray-700 hover:border-gray-600 px-5 py-3 rounded-lg transition-all duration-200 text-gray-200 font-medium"
              >
                Change Password
              </button>

              {/* <button
                onClick={() => setDeleteOpen(true)}
                className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 px-5 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                <Trash2 size={18} /> Delete Account
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {editOpen && (
        <Modal onClose={() => setEditOpen(false)} title="Edit Profile">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                className="w-full bg-[#1a1d21] border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 p-3 rounded-lg text-white placeholder-gray-500 transition-all outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                className="w-full bg-[#1a1d21] border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 p-3 rounded-lg text-white placeholder-gray-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}
      {changePwdConfirmOpen && (
        <Modal
          title="Change Password"
          onClose={() => setChangePwdConfirmOpen(false)}
        >
          <p className="text-gray-300 text-sm mb-6 text-center">
            You will be logged out and redirected to the forgot password page.
            <br />
            Do you want to continue?
          </p>

          <div className="flex gap-3">
            <button
              onClick={confirmChangePassword}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-all"
            >
              Yes, Continue
            </button>

            <button
              onClick={() => setChangePwdConfirmOpen(false)}
              className="flex-1 bg-[#1a1d21] hover:bg-[#2a2d31] border border-gray-700 text-gray-200 py-3 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {deleteOpen && (
        <Modal onClose={() => setDeleteOpen(false)} title="Delete Account">
          <div className="mb-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-400" size={24} />
            </div>
            <p className="text-gray-300 text-center">
              This action is irreversible. All your data will be permanently
              deleted.
            </p>
            <p className="text-gray-500 text-sm text-center mt-2">
              Are you sure you want to continue?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAccount}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteOpen(false)}
              className="flex-1 bg-[#1a1d21] hover:bg-[#2a2d31] border border-gray-700 text-gray-200 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserProfile;

/* ================= REUSABLE MODAL ================= */
const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-[#232529] border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
      <h3 className="text-xl font-semibold mb-6 text-white">{title}</h3>
      {children}
      <button
        onClick={onClose}
        className="mt-4 text-sm text-gray-400 hover:text-gray-300 w-full transition-colors"
      >
        Close
      </button>
    </div>
  </div>
);
