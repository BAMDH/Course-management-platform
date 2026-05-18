import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-semibold transition-all",
  {
    variants: {
      variant: {
        primary:
          "bg-red-600 text-white hover:bg-red-700",

        secondary:
          "bg-gray-100 hover:bg-gray-200 text-black",

        ghost:
          "hover:bg-gray-100",
      },

      size: {
        sm: "px-4 py-2 text-sm",

        md: "px-5 py-3",

        lg: "px-6 py-4 text-base",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = ({
  className = "",
  variant,
  size,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${buttonVariants({
        variant,
        size,
      })} ${className}`}
      {...props}
    />
  );
};

export default Button;