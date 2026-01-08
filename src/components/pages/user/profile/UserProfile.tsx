import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Trash2,
  User,
  Shield,
  Calendar,
  Edit,
  AlertCircle,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUserProfile,
  updateUserProfile,

  // deleteUserAccount,
  uploadProfileImage,
} from "@/redux/slice/userSlice";

import ImageCropModal from "@/components/organisms/user/Profile/ImageCropModal";
import { ChangePasswordModal } from "@/components/organisms/user/Profile/ChangePasswordModal";
import { ChangeEmailModal } from "@/components/organisms/user/Profile/ChangeEmailModal";
import { Modal } from "@/components/molecules/user/profile/Modal";
import EditProfileModal from "@/components/organisms/user/Profile/EditProfileModal";

const FALLBACK_IMAGE = "/images/user/DummyUser.jpg";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [changePwdConfirmOpen, setChangePwdConfirmOpen] = useState(false);
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false);
  const { profile, loading, error } = useAppSelector((state) => state.user);

  /* ---------------- UI STATES ---------------- */
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const hasProfileDetails = profile?.about || profile?.phone || profile?.link;

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  /* ---------------- HANDLERS ---------------- */

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // Reset error
    setUploadError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError(
        "Invalid file type. Only JPG, PNG, WebP, and GIF are allowed."
      );
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File too large. Please select an image under 10MB.");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setCropModalOpen(true);
  };

  const handleDeleteAccount = () => {
    // dispatch(deleteUserAccount());
    alert("Not done!");
  };

  if (loading) return <p className="p-6 text-gray-400">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-400">{error}</p>;
  if (!profile) return null;

  /* ====================== UI ====================== */
  return (
    <div className="min-h-screen bg-[#1a1d21] text-gray-100">
      <div className="max-w-4xl mx-auto p-6 pt-24">
        {uploadError && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{uploadError}</span>
          </div>
        )}
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
          <div className="bg-linear-to-r from-purple-900/20 to-blue-900/20 p-8 border-b border-gray-800">
            <div className="flex items-start gap-6 pb-7">
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
                  onChange={handleImageSelect}
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
            {/* PROFILE DETAILS */}
            <div className="relative bg-[#1a1d21] border border-gray-800 rounded-lg p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">Profile Details</h4>

                <button
                  onClick={() => setEditOpen(true)}
                  className="p-2 rounded-md border border-gray-700 hover:border-gray-600 hover:bg-[#2a2d31] text-gray-300 transition-all"
                  aria-label="Edit profile"
                >
                  <Edit size={16} />
                </button>
              </div>

              {hasProfileDetails ? (
                <>
                  {/* About */}
                  {profile.about && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                        About
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {profile.about}
                      </p>
                    </div>
                  )}

                  {/* Phone */}
                  {profile.phone && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <p className="text-gray-300 text-sm">{profile.phone}</p>
                    </div>
                  )}

                  {/* Link */}
                  {profile.link && (
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                        Website
                      </p>
                      <a
                        href={profile.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="!text-purple-400 hover:!text-purple-300 text-sm underline underline-offset-2 transition-colors"
                      >
                        {profile.link}
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">
                    No profile details added yet.
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Add a bio, phone number, or website to complete your
                    profile.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* PLAN */}
            {profile.plan && (
              <div className="bg-[#1a1d21] border border-gray-800 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
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
              <button
                onClick={() => setChangeEmailModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 px-5 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                <Trash2 size={18} /> Change Email
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ================= Change Email Modal ================= */}
      {changeEmailModalOpen && (
        <ChangeEmailModal
          open={changeEmailModalOpen}
          onClose={() => {
            setChangeEmailModalOpen(false);
          }}
        />
      )}

      {/* ================= CROP IMAGE MODAL ================= */}
      {cropModalOpen && imagePreview && (
        <ImageCropModal
          open={cropModalOpen}
          imageSrc={imagePreview}
          error={uploadError}
          onClose={() => {
            setCropModalOpen(false);
            setUploadError(""); // Clear error when closing
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
          }}
          onCropComplete={(croppedFile: File) => {
            setUploadError(""); // Clear on successful crop/upload
            dispatch(uploadProfileImage(croppedFile));
          }}
        />
      )}
      {/* ================= EDIT PROFILE MODAL ================= */}
      {editOpen && (
        <EditProfileModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          initialValues={{
            name: profile.name,
            about: profile.about || "",
            phone: profile.phone || "",
            link: profile.link || "",
          }}
          onSave={(values) => {
            dispatch(updateUserProfile(values));
          }}
        />
      )}

      {changePwdConfirmOpen && (
        <ChangePasswordModal
          open={changePwdConfirmOpen}
          onClose={() => setChangePwdConfirmOpen(false)}
        />
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
