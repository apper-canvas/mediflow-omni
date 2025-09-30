import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  type = "text", 
  className,
  required,
  as = "input",
  children,
  ...props 
}) => {
  const Component = as === "select" ? Select : as === "textarea" ? "textarea" : Input;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {as === "textarea" ? (
        <textarea
          className={cn(
            "w-full px-4 py-2.5 bg-white border-2 border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none",
            error && "border-error focus:border-error focus:ring-error/20"
          )}
          {...props}
        />
      ) : (
        <Component type={type} error={error} {...props}>
          {children}
        </Component>
      )}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;