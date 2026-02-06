import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function useGsapDrawer(isOpen: boolean, onClose: () => void) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: overlayRef });

  // 1. Entrance Animation (Triggered when component mounts)
  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      )
        .fromTo(
          panelRef.current,
          { x: "100%" },
          { x: "0%", duration: 0.4, ease: "power3.out" },
          "-=0.2",
        )
        // Stagger items if they exist (elements with class 'animate-item')
        .fromTo(
          ".animate-item",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.1",
        );
    },
    { scope: overlayRef },
  );

  // 2. Animated Close Function
  const animateClose = contextSafe(() => {
    const tl = gsap.timeline({ onComplete: onClose });

    tl.to(panelRef.current, { x: "100%", duration: 0.3, ease: "power3.in" }).to(
      overlayRef.current,
      { opacity: 0, duration: 0.2 },
      "-=0.2",
    );
  });

  return { overlayRef, panelRef, animateClose };
}
