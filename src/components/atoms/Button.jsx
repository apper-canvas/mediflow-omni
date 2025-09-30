import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary/5 active:scale-[0.98]",
    outline: "bg-transparent border-2 border-slate-300 text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-[0.98]",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 active:scale-[0.98]",
    success: "bg-gradient-to-r from-success to-accent-dark text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;