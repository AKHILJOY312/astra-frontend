/* ================= CHANGE PASSWORD MODAL WITH GSAP SUCCESS ANIMATION ================= */
import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { gsap } from "gsap";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { changePassword } from "@/redux/slice/userSlice";
import { PasswordInput } from "@/components/atoms/user/Input/PasswordInput";

// Validation Schema (unchanged)
const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Current password is required")
    .min(6, "Password must be at least 6 characters"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase, one lowercase, and one number"
    )
    .test(
      "not-same-as-old",
      "New password must be different from current password",
      function (value) {
        return value !== this.parent.oldPassword;
      }
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
});

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [success, setSuccess] = useState(false);

  // GSAP refs
  const successContainerRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  const initialValues: ChangePasswordFormValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (
    values: ChangePasswordFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<ChangePasswordFormValues>
  ) => {
    try {
      await dispatch(
        changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
      ).unwrap();

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // If it's a standard Error or your custom AppError
        setFieldError("oldPassword", err.message);
      } else {
        // Fallback for strings or weird objects
        setFieldError("oldPassword", "Invalid current password");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // GSAP Animation on success
  useEffect(() => {
    if (success && successContainerRef.current) {
      const ctx = gsap.context(() => {
        // Reset
        gsap.set([checkRef.current, titleRef.current, messageRef.current], {
          opacity: 0,
          scale: 0.8,
          y: 20,
        });

        // Main timeline
        const tl = gsap.timeline();

        // Big checkmark pop-in
        tl.to(checkRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        })
          // Title fade in
          .to(
            titleRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.4"
          )
          // Message fade in
          .to(
            messageRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.3"
          );

        // Optional: subtle pulse on check
        tl.to(checkRef.current, {
          scale: 1.1,
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }, successContainerRef);

      // Auto-close after animation
      setTimeout(() => {
        onClose();
      }, 3500);

      return () => ctx.revert();
    }
  }, [success, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#232529] border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        {/* Form State */}
        {!success ? (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold mb-6 text-white">
              Change Password
            </h3>

            <Formik
              initialValues={initialValues}
              validationSchema={ChangePasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <Field
                      name="oldPassword"
                      component={PasswordInput}
                      placeholder="Enter current password"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="oldPassword">
                      {(msg) =>
                        msg && (
                          <div className="mt-1 text-sm text-red-400 flex items-center gap-1">
                            <AlertCircle size={14} />
                            <span>{msg}</span>
                          </div>
                        )
                      }
                    </ErrorMessage>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <Field
                      name="newPassword"
                      component={PasswordInput}
                      placeholder="Enter new password"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="newPassword">
                      {(msg) =>
                        msg && (
                          <div className="mt-1 text-sm text-red-400 flex items-center gap-1">
                            <AlertCircle size={14} />
                            <span>{msg}</span>
                          </div>
                        )
                      }
                    </ErrorMessage>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <Field
                      name="confirmPassword"
                      component={PasswordInput}
                      placeholder="Confirm new password"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="confirmPassword">
                      {(msg) =>
                        msg && (
                          <div className="mt-1 text-sm text-red-400 flex items-center gap-1">
                            <AlertCircle size={14} />
                            <span>{msg}</span>
                          </div>
                        )
                      }
                    </ErrorMessage>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-70 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="flex-1 bg-[#1a1d21] hover:bg-[#2a2d31] border border-gray-700 text-gray-200 py-3 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          /* ================= SUCCESS STATE WITH GSAP ================= */
          <div
            ref={successContainerRef}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <CheckCircle2
              ref={checkRef}
              size={80}
              className="text-green-400 mb-6"
              strokeWidth={2}
            />

            <h3 ref={titleRef} className="text-2xl font-bold text-white mb-3">
              Password Changed!
            </h3>

            <p ref={messageRef} className="text-gray-400 max-w-xs">
              Your password has been successfully updated.
              <br />
              The modal will close shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
