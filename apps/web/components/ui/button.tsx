import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-black uppercase tracking-widest ring-offset-background transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(.2,.8,.2,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/10 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] select-none",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white shadow-xl shadow-slate-900/10 hover:bg-black hover:shadow-slate-900/20",
        danger: "bg-rose-500 text-white shadow-lg shadow-rose-500/10 hover:bg-rose-600 hover:shadow-rose-500/20",
        outline: "border-2 border-slate-100 bg-white text-slate-600 hover:border-blue-600/20 hover:bg-blue-50/30 hover:text-blue-600 shadow-sm",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm",
        ghost: "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
        "ghost-muted": "text-slate-400 hover:bg-slate-50 hover:text-slate-600",
        link: "text-blue-600 underline-offset-4 hover:underline",
        premium: "bg-blue-600 text-white shadow-2xl shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30",
        "premium-outline": "border-2 border-blue-600/20 bg-blue-50/10 text-blue-600 hover:bg-blue-50/30 hover:border-blue-600/40",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-9 px-4 text-[10px]",
        lg: "h-16 px-12 text-base",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
