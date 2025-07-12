import type { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  outline?: boolean;
  shape?: "primary" | "neutral" | "secondary" | "accent";
  pending?: boolean;
  onClick?: () => void | Promise<void>;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  shape = "primary",
  pending,
  onClick,
  children,
  outline,
  className,
  ...buttonAttributes
}: ButtonProps) => {
  return (
    <button
      className={`btn cursor-pointer ${shape === "primary" ? "btn-primary" : shape === "secondary" ? "btn-secondary" : shape === "accent" ? "btn-accent" : "btn-neutral"} ${outline ? "btn-outline" : ""} ${className}`}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={onClick}
      disabled={pending}
      {...buttonAttributes}
    >
      {pending ? <span className="loading loading-spinner"></span> : children}
    </button>
  );
};
