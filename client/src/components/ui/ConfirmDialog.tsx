import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "warning" | "danger" | "info" | "success";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  type = "warning",
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  onConfirm,
  onCancel,
  loading = false
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const config = {
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      confirmButton: "bg-yellow-600 hover:bg-yellow-700"
    },
    danger: {
      icon: XCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      confirmButton: "bg-red-600 hover:bg-red-700"
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      confirmButton: "bg-blue-600 hover:bg-blue-700"
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      confirmButton: "bg-green-600 hover:bg-green-700"
    }
  };

  const { icon: Icon, iconColor, iconBg, confirmButton } = config[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-2 rounded-full ${iconBg}`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${confirmButton}`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التنفيذ...
                </div>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
