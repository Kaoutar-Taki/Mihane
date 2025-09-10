import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface ValidationMessageProps {
  type: "error" | "success" | "warning" | "info";
  message: string;
  className?: string;
}

export default function ValidationMessage({ type, message, className = "" }: ValidationMessageProps) {
  const config = {
    error: {
      icon: AlertCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-600",
      iconColor: "text-red-500"
    },
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200", 
      textColor: "text-green-600",
      iconColor: "text-green-500"
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-600", 
      iconColor: "text-yellow-500"
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      iconColor: "text-blue-500"
    }
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${bgColor} ${borderColor} ${className}`}>
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm ${textColor} leading-5`}>
        {message}
      </p>
    </div>
  );
}
