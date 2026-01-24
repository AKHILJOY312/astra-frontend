import type { UiAlertType } from "@/types/ui.types";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface UiAlertProps {
  type: UiAlertType;
  message: string;
  onClose?: () => void;
  duration?: number; // auto close time (ms)
}

function UiAlert({ type, message, onClose, duration = 4000 }: UiAlertProps) {
  const alertRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<gsap.core.Tween | null>(null);

  const styles = {
    error: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    success:
      "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  }[type];

  const exit = useCallback(() => {
    if (!alertRef.current || !onClose) return;

    gsap.to(alertRef.current, {
      opacity: 0,
      y: -16,
      duration: 0.25,
      ease: "power3.in",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    if (!alertRef.current) return;

    // entrance animation
    gsap.fromTo(
      alertRef.current,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
      },
    );

    // auto dismiss
    if (onClose) {
      timerRef.current = gsap.delayedCall(duration / 1000, exit);
    }

    return () => {
      timerRef.current?.kill();
    };
  }, [duration, exit, onClose]);

  return (
    <div
      ref={alertRef}
      role="alert"
      className={`flex items-center justify-between gap-4 rounded-xl px-5 py-4 shadow-md ${styles}`}
    >
      <span className="text-sm font-medium">{message}</span>

      {onClose && (
        <button
          onClick={exit}
          aria-label="Close alert"
          className="text-inherit opacity-70 hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default UiAlert;
