import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function FormField({
  label,
  required = false,
  error,
  success,
  hint,
  icon: Icon,
  children,
  className = ""
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      
      <div className="relative">
        {children}
        {Icon && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          {success}
        </p>
      )}

      {hint && !error && !success && (
        <p className="text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}
