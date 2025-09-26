import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, Eye, EyeOff, Loader2, Lock, LogIn } from "lucide-react";
import MainLayout from "./layouts/MainLayout";
import { apiLogin } from "../services/auth";
import TwoFactorAuth from "../components/auth/TwoFactorAuth";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const next = sp.get("next") || "/";

  const twoFactorRequired = false;

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
    try {
      const res = await apiLogin(identifier, password);
      const authData = {
        token: res.token,
        refreshToken: "",
        user: res.user,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      const store = remember ? localStorage : sessionStorage;
      store.setItem("auth", JSON.stringify(authData));
      navigate(next, { replace: true });
    } catch (error) {
      const msg =
        error instanceof Error && error.message
          ? error.message
          : t("auth.errors.signInError");
      setErrors((prev) => ({
        ...prev,
        identifier: prev.identifier || msg,
      }));
    } finally {
      setLoading(false);
    }
  };

  const dir = i18n.dir() as "rtl" | "ltr";
  const iconSide = dir === "rtl" ? "left-3" : "right-3";

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-16">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-md">
            
            <div className="mb-6 w-fit rounded-full border border-white/60 bg-white/70 px-5 py-2 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                  <LogIn size={14} />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {t("login.title")}
                </span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur">
                <div className="mb-2 flex gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setRole("client")}
                    className={`rounded-full px-4 py-1.5 ring-1 transition shadow-sm ${
                      role === "client"
                        ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-transparent"
                        : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {t("login.client")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("pro")}
                    className={`rounded-full px-4 py-1.5 ring-1 transition shadow-sm ${
                      role === "pro"
                        ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-transparent"
                        : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {t("login.pro")}
                  </button>
                </div>

                <div className="mb-2">
                  <div className="relative">
                    <input
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={t("login.identifier")}
                      className={[
                        "peer h-12 w-full rounded-xl border bg-white/80 backdrop-blur",
                        "border-gray-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]",
                        "px-4 text-sm placeholder-transparent transition-all duration-300",
                        "focus:border-orange-500 focus:shadow-lg focus:ring-4 focus:ring-orange-100",
                        "hover:border-orange-300 hover:shadow-md",
                        dir === "ltr" ? "pl-11 pr-4" : "pr-11 pl-4",
                      ].join(" ")}
                    />
                    <label
                      className={[
                        "pointer-events-none absolute -top-2 z-10 rounded-full bg-white px-2 text-xs font-medium",
                        "text-gray-500 transition-all duration-300",
                        dir === "ltr" ? "left-3" : "right-3",
                        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
                        "peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-gray-400",
                        dir === "ltr" ? "peer-placeholder-shown:left-11" : "peer-placeholder-shown:right-11",
                        "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:scale-105 peer-focus:bg-white peer-focus:px-2 peer-focus:text-orange-600",
                      ].join(" ")}
                    >
                      {t("login.identifier")}
                    </label>
                     {isPhone(identifier) ? <Phone
                      size={18}
                      className={[
                        "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-all duration-300",
                        dir === "ltr" ? "left-3" : "right-3",
                        "text-gray-400 peer-hover:text-orange-400 peer-focus:text-orange-500",
                      ].join(" ")}
                    /> : <Mail
                      size={18}
                      className={[
                        "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-all duration-300",
                        dir === "ltr" ? "left-3" : "right-3",
                        "text-gray-400 peer-hover:text-orange-400 peer-focus:text-orange-500",
                      ].join(" ")}
                    />}
                  </div>
                  {errors.identifier && (
                    <p className="mt-1 text-xs text-red-600">{errors.identifier}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("login.password")}
                      className={[
                        "peer h-12 w-full rounded-xl border bg-white/80 backdrop-blur",
                        "border-gray-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]",
                        "px-4 text-sm placeholder-transparent transition-all duration-300",
                        "focus:border-orange-500 focus:shadow-lg focus:ring-4 focus:ring-orange-100",
                        "hover:border-orange-300 hover:shadow-md",
                        dir === "ltr" ? "pl-11 pr-11" : "pr-11 pl-11",
                      ].join(" ")}
                    />
                    <label
                      className={[
                        "pointer-events-none absolute -top-2 z-10 rounded-full bg-white px-2 text-xs font-medium",
                        "text-gray-500 transition-all duration-300",
                        dir === "ltr" ? "left-3" : "right-3",
                        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
                        "peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-gray-400",
                        dir === "ltr" ? "peer-placeholder-shown:left-11" : "peer-placeholder-shown:right-11",
                        "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:scale-105 peer-focus:bg-white peer-focus:px-2 peer-focus:text-orange-600",
                      ].join(" ")}
                    >
                      {t("login.password")}
                    </label>
                    <Lock
                      size={18}
                      className={[
                        "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-all duration-300",
                        dir === "ltr" ? "left-3" : "right-3",
                        "text-gray-400 peer-hover:text-orange-400 peer-focus:text-orange-500",
                      ].join(" ")}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${iconSide}`}
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
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

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-orange-700 hover:to-amber-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading && <Loader2 className="animate-spin" size={16} />}
                    {t("login.submit")}
                  </button>
                  <Link
                    to="/register"
                    className="rounded-xl border-2 border-orange-200 bg-white/80 px-6 py-2.5 text-sm font-semibold text-orange-700 backdrop-blur transition-all duration-300 hover:border-orange-300 hover:bg-orange-50"
                  >
                    {t("register.title")}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
