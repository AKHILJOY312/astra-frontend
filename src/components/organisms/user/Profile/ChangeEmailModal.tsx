import { useEffect, useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Loader2, Mail, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import {
  sendOtpToNewEmail,
  verifyOtpAndUpdateEmail,
} from "@/redux/slice/userSlice";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
interface ChangeEmailModalProps {
  open: boolean;
  onClose: () => void;
}
export const ChangeEmailModal = ({ open, onClose }: ChangeEmailModalProps) => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [newEmail, setNewEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  // Refs for GSAP targeting
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ---------------- ANIMATIONS ---------------- */

  // 1. Modal Entrance Animation
  useGSAP(() => {
    if (open) {
      const tl = gsap.timeline();
      // Animate overlay fade in
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      // Animate modal scaling and popping up
      tl.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.1"
      );
    }
  }, [open]);

  // 2. Step Transition Animation
  useGSAP(() => {
    if (contentRef.current) {
      // Fade and slide content whenever the 'step' state changes
      gsap.fromTo(
        contentRef.current,
        { x: 15, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [step]);

  // 3. Smooth Close Animation
  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: "power2.in",
    }).to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  /* ---------------- LOGIC ---------------- */
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- HANDLERS ---------------- */

  const handleResendOtp = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    setServerError(null);
    try {
      await dispatch(sendOtpToNewEmail({ newEmail })).unwrap();
      setTimer(60); // Start 60s countdown
    } catch (err) {
      const errorMessage = err as string;
      setServerError(errorMessage || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setStep("request");
      setServerError(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 opacity-0"
    >
      <div
        ref={modalRef}
        className="bg-[#232529] border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div ref={contentRef}>
          {/* Server Error Display */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{serverError}</span>
            </div>
          )}

          {step === "request" && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">
                Change Email
              </h3>
              <Formik
                initialValues={{ newEmail: "" }}
                validationSchema={Yup.object({
                  newEmail: Yup.string()
                    .email("Invalid email")
                    .required("Required"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  setServerError(null);
                  try {
                    await dispatch(
                      sendOtpToNewEmail({ newEmail: values.newEmail })
                    ).unwrap();
                    setNewEmail(values.newEmail);
                    setStep("verify");
                  } catch (err) {
                    const errorMessage = err as string;
                    setServerError(errorMessage || "Failed to send OTP");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Email Address
                      </label>
                      <Field
                        name="newEmail"
                        type="email"
                        placeholder="yournew@email.com"
                        className="w-full bg-[#1a1d21] border border-gray-700 focus:border-purple-500 p-3 rounded-lg text-white outline-none transition-all"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Mail size={18} />
                        )}
                        Send OTP
                      </button>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 bg-[#1a1d21] border border-gray-700 py-3 rounded-lg text-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {step === "verify" && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">
                Enter OTP
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                We sent a 6-digit code to <strong>{newEmail}</strong>
              </p>

              <Formik
                initialValues={{ otp: "" }}
                validationSchema={Yup.object({
                  otp: Yup.string()

                    .length(6, "Must be 6 digits")

                    .required("OTP required"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  setServerError(null);

                  try {
                    await dispatch(
                      verifyOtpAndUpdateEmail({ emailChangeOtp: values.otp })
                    ).unwrap();

                    setStep("success");

                    setTimeout(handleClose, 3000);
                  } catch (err) {
                    const errorMessage = err as string;
                    setServerError(errorMessage || "Invalid OTP");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <Field
                      name="otp"
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      className="w-full text-center text-3xl tracking-widest bg-[#1a1d21] border border-gray-700 focus:border-purple-500 p-4 rounded-lg text-white outline-none"
                    />

                    <div className="space-y-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-linear-to-r from-purple-600 to-blue-600 py-3 rounded-lg text-white font-medium disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin mx-auto" />
                        ) : (
                          "Verify & Change Email"
                        )}
                      </button>

                      {/* --- RESEND OTP BUTTON --- */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={timer > 0 || isResending}
                          className="text-sm font-medium text-purple-400 hover:text-purple-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                          {isResending ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 size={14} className="animate-spin" />{" "}
                              Resending...
                            </span>
                          ) : timer > 0 ? (
                            `Resend OTP in ${timer}s`
                          ) : (
                            "Didn't receive a code? Resend OTP"
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div id="success-icon">
                <CheckCircle2
                  size={80}
                  className="text-green-400 mx-auto mb-4"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Email Changed!
              </h3>
              <p className="text-gray-400">Your new email is now active.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
