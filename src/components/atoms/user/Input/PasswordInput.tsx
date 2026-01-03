// components/ui/PasswordInput.tsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FieldProps } from "formik";

interface PasswordInputProps extends FieldProps {
  placeholder?: string;
  disabled?: boolean;
}

export const PasswordInput = ({
  field,
  //   form,
  placeholder,
  disabled,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        {...field}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-[#1a1d21] border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 p-3 rounded-lg text-white placeholder-gray-500 pr-12 transition-all outline-none"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
        tabIndex={-1} // Prevent focus stealing
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};
