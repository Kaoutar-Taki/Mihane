import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import MainLayout from "./layouts/MainLayout";
import SectionCard from "../components/ui/SectionCard";
import { useAuth } from "../auth/AuthContext";
import TwoFactorAuth from "../components/auth/TwoFactorAuth";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const next = sp.get("next") || "/";

  const { signIn, twoFactorRequired } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "pro">("client");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (twoFactorRequired) {
    return (
      <TwoFactorAuth
        onSuccess={() => navigate(next, { replace: true })}
        onCancel={() => window.location.reload()}
      />
    );
  }

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v: string) => /^\+?\d{8,15}$/.test(v.replace(/\s/g, ""));
  const validate = () => {
    const e: Record<string, string> = {};
    if (!identifier.trim() || !(isEmail(identifier) || isPhone(identifier)))
      e.identifier = t("login.errors.identifier");
    if (!password || password.length < 6)
      e.password = t("login.errors.password");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const mappedRole = role === "pro" ? "ARTISAN" : "CLIENT";
    try {
      await signIn(identifier, password, mappedRole, remember);
      if (!twoFactorRequired) {
        navigate(next, { replace: true });
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        identifier: prev.identifier || t("auth.errors.signInError"),
      }));
    } finally {
      setLoading(false);
    }
  };

  const dir = i18n.dir();
  const iconSide = dir === "rtl" ? "left-3" : "right-3";
  const padX = dir === "rtl" ? "pl-10 pr-3" : "pr-10 pl-3";

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <form onSubmit={onSubmit} className="space-y-6">
          <SectionCard title={t("login.title")}>
            <div className="mb-4 flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`rounded-full px-3 py-1 ring-1 ${
                  role === "client"
                    ? "bg-primary ring-primary text-white"
                    : "bg-gray-50 text-gray-700 ring-gray-200"
                }`}
              >
                {t("login.client")}
              </button>
              <button
                type="button"
                onClick={() => setRole("pro")}
                className={`rounded-full px-3 py-1 ring-1 ${
                  role === "pro"
                    ? "bg-primary ring-primary text-white"
                    : "bg-gray-50 text-gray-700 ring-gray-200"
                }`}
              >
                {t("login.pro")}
              </button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("login.identifier")}
              </label>
              <div className="relative">
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t("login.placeholder")}
                  className={`w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${padX}`}
                />
                <span
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${iconSide}`}
                >
                  {isPhone(identifier) ? (
                    <Phone size={18} />
                  ) : (
                    <Mail size={18} />
                  )}
                </span>
              </div>
              {errors.identifier && !errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.identifier}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("login.password")}
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className={`w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${padX}`}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${iconSide}`}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
              {errors.identifier && errors.password && (
                <p className="mt-1 text-xs text-red-600">{t("auth.errors.signInError")}</p>
              )}
              <div className="mt-2 flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  {t("login.remember")}
                </label>
                <Link to="/forgot" className="text-primary hover:underline">
                  {t("login.forgot")}
                </Link>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-60"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {t("login.submit")}
              </button>
              <Link
                to="/register"
                className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {t("login.noAccount")}
              </Link>
            </div>
          </SectionCard>
        </form>
      </div>
    </MainLayout>
  );
}