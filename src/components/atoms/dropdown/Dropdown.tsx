// src/components/ui/Dropdown.tsx
import { useEffect, useRef } from "react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  align = "left",
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const alignClasses = {
    left: "left-3",
    right: "right-3",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-14 ${alignClasses[align]} z-50 mt-1 ${className}`}
    >
      <div className="bg-[#2D2F33] rounded-lg shadow-2xl border border-white/10 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
