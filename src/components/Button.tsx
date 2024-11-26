import classNames from "classnames";
import { GoSync } from "react-icons/go";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  loading?: boolean;
  variant?: "default" | "icon";
  iconSize?: string; // New prop for icon size (e.g., "text-lg", "text-xl")
  [key: string]: any;
}

function Button({
  children,
  loading = false,
  variant = "default",
  iconSize = "text-lg", // Default size for the icon
  ...rest
}: ButtonProps) {
  const baseClasses = classNames(rest.className, {
    "px-5 py-2 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]":
      variant === "default",
    "flex items-center justify-center": variant === "icon", // Minimal styling for the icon button
  });

  return (
    <button {...rest} disabled={loading} className={baseClasses}>
      {loading ? <GoSync className={`animate-spin ${iconSize}`} /> : children}
    </button>
  );
}

export default Button;
