// src/components/ui/DropdownItem.tsx
import { Link } from "react-router-dom";

interface DropdownItemProps {
  to?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  to,
  onClick,
  icon,
  className = "",
  children,
}) => {
  const baseClasses =
    "flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition";

  const content = (
    <>
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${className}`} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {content}
    </button>
  );
};
