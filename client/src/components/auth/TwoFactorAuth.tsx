import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Mail, Smartphone, Loader2 } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

interface TwoFactorAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TwoFactorAuth({ onSuccess, onCancel }: TwoFactorAuthProps) {
  const { t } = useTranslation();
  const { verifyTwoFactor, loading, error } = useAuth();
  const [code, setCode] = useState("");
  const [method] = useState<"EMAIL" | "SMS">("EMAIL");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    try {
      await verifyTwoFactor(code);
      onSuccess();
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setCode(numericValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("auth.2fa.title", "التحقق بخطوتين")}
          </h1>
          <p className="text-gray-600">
            {t("auth.2fa.description", "أدخل رمز التحقق المرسل إليك")}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg mb-4">
            {method === "EMAIL" ? (
              <Mail className="w-5 h-5 text-blue-600" />
            ) : (
              <Smartphone className="w-5 h-5 text-blue-600" />
            )}
            <span className="text-sm text-blue-800">
              {method === "EMAIL" 
                ? t("auth.2fa.sentToEmail", "تم إرسال الرمز إلى بريدك الإلكتروني")
                : t("auth.2fa.sentToPhone", "تم إرسال الرمز إلى هاتفك")
              }
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("auth.2fa.codeLabel", "رمز التحقق")}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
              dir="ltr"
            />
            <p className="mt-2 text-sm text-gray-500">
              {t("auth.2fa.hint", "للاختبار، استخدم الرمز: 123456")}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              {t("common.cancel", "إلغاء")}
            </button>
            <button
              type="submit"
              disabled={code.length !== 6 || loading}
              className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-3 rounded-lg hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("auth.verifying", "جاري التحقق...")}
                </>
              ) : (
                t("auth.2fa.verify", "تحقق")
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-orange-600 hover:text-orange-700">
            {t("auth.2fa.resend", "إعادة إرسال الرمز")}
          </button>
        </div>
      </div>
    </div>
  );
}
