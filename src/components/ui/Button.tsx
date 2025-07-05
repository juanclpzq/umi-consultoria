import { ReactNode } from "react";
import { cn } from "@/utils";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "py-3 px-6 rounded-md font-medium transition-colors",
        variant === "primary"
          ? "bg-umi-blue-dark text-white hover:bg-umi-blue-80"
          : "bg-umi-light-blue text-white hover:bg-umi-light-blue-80",
        disabled && "opacity-50 cursor-not-allowed hover:bg-current",
        className
      )}
    >
      {children}
    </button>
  );
};
