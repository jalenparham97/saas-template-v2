import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";
import * as React from "react";

import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline:
          "border border-gray-300 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        action: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
        xs: "h-6 px-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>["variant"];

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  href?: LinkProps["href"];
  rel?: React.HTMLAttributes<HTMLAnchorElement>["rel"];
  target?: React.HTMLAttributeAnchorTarget;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      disabled,
      loading,
      children,
      leftIcon,
      rightIcon,
      href,
      target,
      rel,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <>
        {href && (
          <Link href={href} target={target} rel={rel}>
            <Comp
              className={cn(buttonVariants({ variant, size, className }))}
              disabled={loading ?? disabled}
              ref={ref}
              {...props}
            >
              {loading && (
                <Loader
                  className={cn("", size !== "icon" && "mr-2")}
                  size={16}
                />
              )}
              {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
              {size === "icon" && !loading && <span>{children}</span>}
              {size !== "icon" && <span>{children}</span>}
              {rightIcon && <span className="ml-2">{rightIcon}</span>}
            </Comp>
          </Link>
        )}

        {!href && (
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            disabled={loading ?? disabled}
            ref={ref}
            {...props}
          >
            {loading && (
              <Loader className={cn("", size !== "icon" && "mr-2")} size={16} />
            )}
            {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
            {size === "icon" && !loading && <span>{children}</span>}
            {size !== "icon" && <span>{children}</span>}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </Comp>
        )}
      </>
    );
  },
);
Button.displayName = "Button";

const DefaultButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
DefaultButton.displayName = "DefaultButton";

export { Button, buttonVariants, DefaultButton };
