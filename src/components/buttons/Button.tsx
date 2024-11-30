import classNames from "classnames";
import { GoSync } from "react-icons/go";
import { ReactNode } from "react";
import React from "react";

interface ButtonProps {
  children: ReactNode;
  loading?: boolean;
  variant?: "default" | "icon";
  iconSize?: string; // New prop for icon size (e.g., "text-lg", "text-xl")
  [key: string]: any;
}

const Button = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "ref">>(
  (
    {
      children,
      loading = false,
      variant = "default",
      iconSize = "text-lg",
      ...rest
    },
    ref
  ) => {
    const baseClasses = classNames(rest.className, {
      "flex items-center justify-center px-5 py-2 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]":
        variant === "default",
      "flex items-center justify-center": variant === "icon", // Minimal styling for the icon button
    });

    return (
      <button {...rest} ref={ref} disabled={loading} className={baseClasses}>
        {loading ? <GoSync className={`animate-spin ${iconSize}`} /> : children}
      </button>
    );
  }
);

export default Button;
