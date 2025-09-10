import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  };
  children?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            action.variant === "secondary"
              ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
              : "bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700"
          }`}
        >
          {action.label}
        </button>
      )}

      {children}
    </div>
  );
}
