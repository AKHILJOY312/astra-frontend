// src/components/user/modals/InviteMemberModal.tsx
import { X, Loader2, Mail, UserPlus, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeInviteMemberModal } from "@/redux/slice/uiSlice";
import type { RootState } from "@/redux/store/store";
import { useState } from "react";
import { addMember } from "@/services/membership.service";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type Role = "member" | "lead" | "manager";

interface FormValues {
  email: string;
  role: Role;
}
interface BackendError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}
// Yup validation schema
const InviteSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  role: Yup.string()
    .oneOf(["member", "lead", "manager"], "Invalid role")
    .required("Role is required"),
});

export default function InviteMemberModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.inviteMemberModal);
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const initialValues: FormValues = {
    email: "",
    role: "member",
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!currentProject) {
      setServerError("No project selected");
      setSubmitting(false);
      return;
    }

    setServerError("");
    try {
      await addMember(currentProject.id, {
        newMemberEmail: values.email.trim(),
        role: values.role,
      });

      setSuccess(true);
      setTimeout(() => {
        dispatch(closeInviteMemberModal());
        setSuccess(false);
      }, 1500);
    } catch (err: unknown) {
      let backendError = "Failed to send invite";

      if (typeof err === "object" && err !== null) {
        const e = err as BackendError;
        backendError =
          e.response?.data?.error ||
          e.response?.data?.message ||
          e.message ||
          backendError;
      }

      setServerError(backendError);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-black bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invite Team Member
          </h2>
          <button
            onClick={() => dispatch(closeInviteMemberModal())}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={InviteSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="p-6 space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="colleague@company.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <ErrorMessage name="email">
                  {(msg) => (
                    <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <Field
                  as="select"
                  name="role"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="member">Member</option>
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                </Field>
                <ErrorMessage name="role">
                  {(msg) => (
                    <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  {serverError}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Invitation sent successfully!
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                  Send Invite
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
