import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        success:
          "bg-green-100 text-green-700",

        warning:
          "bg-yellow-100 text-yellow-700",

        danger:
          "bg-red-100 text-red-700",

        info:
          "bg-blue-100 text-blue-700",

        neutral:
          "bg-gray-100 text-gray-700",
      },
    },

    defaultVariants: {
      variant: "neutral",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({
  className = "",
  variant,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={`${badgeVariants({
        variant,
      })} ${className}`}
      {...props}
    />
  );
};

export default Badge;