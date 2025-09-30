import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-gradient-to-r from-success/20 to-accent/10 text-success border border-success/30",
    warning: "bg-gradient-to-r from-warning/20 to-yellow-100 text-warning border border-warning/30",
    error: "bg-gradient-to-r from-error/20 to-red-100 text-error border border-error/30",
    info: "bg-gradient-to-r from-info/20 to-blue-100 text-info border border-info/30",
    primary: "bg-gradient-to-r from-primary/20 to-primary-light/10 text-primary border border-primary/30"
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;