import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
} & ComponentPropsWithoutRef<"button">;
export const Button = ({ children, ...rest }: Props) => {
  return (
    <button {...rest} className="btn btn-primary">
      {children}
    </button>
  );
};
