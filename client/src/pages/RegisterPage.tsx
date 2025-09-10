import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  User2,
  Mail,
  Lock,
  Users,
  Loader2,
  ChevronDown,
  CheckCircle,
  Home,
  LogIn,
  Eye,
  EyeOff,
} from "lucide-react";
import MainLayout from "./layouts/MainLayout";

// Types
type IconCmp = React.ComponentType<{ size?: number; className?: string }>;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  agree?: string;
}

// Floating Input Component (single, clean version)
function FloatInput({
  type = "text",
  value,
  onChange,
  placeholder,
  Icon,
  error,
  dir,
}: {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string | undefined;
  Icon?: IconCmp;
  error?: string;
  dir: "rtl" | "ltr";
}) {
  return (
    <div>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={[
            "peer h-12 w-full rounded-xl border bg-white/80 backdrop-blur",
            "border-gray-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]",
            "text-sm placeholder-transparent transition-all duration-300",
            "focus:border-orange-500 focus:shadow-lg focus:ring-4 focus:ring-orange-100",
            "hover:border-orange-300 hover:shadow-md",
            dir === "ltr"
              ? Icon
                ? "pr-4 pl-11"
                : "pr-4 pl-4"
              : Icon
                ? "pr-11 pl-4"
                : "pr-4 pl-4",
          ].join(" ")}
        />
        <label
          className={[
            "pointer-events-none absolute -top-2 z-10 rounded-full bg-white px-2 text-xs font-medium",
            "text-gray-500 transition-all duration-300",
            dir === "ltr" ? "left-3" : "right-3",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
            "peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-gray-400",
            dir === "ltr"
              ? "peer-placeholder-shown:left-11"
              : "peer-placeholder-shown:right-11",
            "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:scale-105 peer-focus:bg-white peer-focus:px-2 peer-focus:text-orange-600",
          ].join(" ")}
        >
          {placeholder}
        </label>
        {Icon && (
          <Icon
            size={18}
            className={[
              "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-all duration-300",
              dir === "ltr" ? "left-3" : "right-3",
              "text-gray-400 peer-hover:text-orange-400 peer-focus:text-orange-500",
            ].join(" ")}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir() as "rtl" | "ltr";
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState<"CLIENT" | "ARTISAN">("CLIENT");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation
  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePassword = (v: string) => v.length >= 6;

  const validate = () => {
    const e: FormErrors = {};

    if (!fullName.trim())
      e.name = t("register.errors.name", "الإسم الكامل مطلوب");

    if (!email.trim()) e.email = t("register.errors.email", "الإيميل مطلوب");
    else if (!validateEmail(email))
      e.email = t("register.errors.emailInvalid", "الإيميل غير صحيح");

    if (!password.trim())
      e.password = t("register.errors.password", "كلمة المرور مطلوبة");
    else if (!validatePassword(password))
      e.password = t(
        "register.errors.passwordWeak",
        "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      );

    if (!confirmPassword.trim())
      e.confirmPassword = t(
        "register.errors.confirmPassword",
        "تأكيد كلمة المرور مطلوب",
      );
    else if (password !== confirmPassword)
      e.confirmPassword = t(
        "register.errors.passwordMismatch",
        "كلمات المرور غير متطابقة",
      );

    if (!agree) e.agree = t("register.errors.agree", "يجب الموافقة على الشروط");

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      id: Date.now(),
      profileId: null,
      genderId: 1,
      cityId: 1,
      name: {
        ar: fullName.trim(),
        fr: fullName.trim(),
      },
      description: { ar: "", fr: "" },
      email: email.trim(),
      phone: "",
      avatar: "/assets/profiles/defaultMan.png",
      role: userRole,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    console.log("REGISTER_PAYLOAD:", payload);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {t("register.success.title", "تم إنشاء حسابك بنجاح!")}
              </h1>
              <p className="mb-8 text-lg text-gray-700">
                {t(
                  "register.success.message",
                  "يمكنك الآن تسجيل الدخول والبدء في استخدام المنصة",
                )}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <button
                  onClick={() => navigate("/")}
                  className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-orange-700 hover:to-amber-700 hover:shadow-xl"
                >
                  <span className="inline-flex items-center gap-2">
                    <Home size={18} />
                    {t("register.success.home", "العودة للرئيسية")}
                  </span>
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl border-2 border-orange-200 bg-white/80 px-8 py-3 font-semibold text-orange-700 backdrop-blur transition-all duration-300 hover:border-orange-300 hover:bg-orange-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <LogIn size={18} />
                    {t("register.success.login", "تسجيل الدخول")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="mx-auto mb-6 w-fit rounded-full border border-white/60 bg-white/70 px-5 py-2 shadow backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                  <User2 size={14} />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {t("register.badge", "انضم إلينا")}
                </span>
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-orange-900 md:text-5xl">
              {t("register.title", "إنشاء حساب جديد")}
            </h1>
            <p className="mx-auto max-w-xl text-lg text-gray-700">
              {t("register.subtitle", "انضم إلى منصتنا وابدأ رحلتك معنا")}
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <form onSubmit={onSubmit} dir={dir} className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur">
                <div className="space-y-6">
                  {/* Full Name */}
                  <FloatInput
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("register.fullName", "الإسم الكامل")}
                    Icon={User2}
                    error={errors.name}
                    dir={dir}
                  />

                  {/* Email */}
                  <FloatInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("register.email", "البريد الإلكتروني")}
                    Icon={Mail}
                    error={errors.email}
                    dir={dir}
                  />

                  {/* Password */}
                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("register.password", "كلمة المرور")}
                        className={[
                          "peer h-12 w-full rounded-xl border bg-white/80 backdrop-blur",
                          "border-gray-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]",
                          "px-4 text-sm placeholder-transparent transition-all duration-300",
                          "focus:border-orange-500 focus:shadow-lg focus:ring-4 focus:ring-orange-100",
                          "hover:border-orange-300 hover:shadow-md",
                          "pr-11", // space for toggle
                          dir === "ltr" ? "pl-11" : "pl-11",
                        ].join(" ")}
                      />
                      <label
                        className={[
                          "pointer-events-none absolute -top-2 z-10 rounded-full bg-white px-2 text-xs font-medium",
                          "text-gray-500 transition-all duration-300",
                          dir === "ltr" ? "left-3" : "right-3",
                          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
                          "peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-gray-400",
                          dir === "ltr"
                            ? "peer-placeholder-shown:left-11"
                            : "peer-placeholder-shown:right-11",
                          "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:scale-105 peer-focus:bg-white peer-focus:px-2 peer-focus:text-orange-600",
                        ].join(" ")}
                      >
                        {t("register.password", "كلمة المرور")}
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
                        onClick={() => setShowPassword((s) => !s)}
                        className={[
                          "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                          dir === "ltr" ? "right-3" : "left-3",
                        ].join(" ")}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t(
                          "register.confirmPassword",
                          "تأكيد كلمة المرور",
                        )}
                        className={[
                          "peer h-12 w-full rounded-xl border bg-white/80 backdrop-blur",
                          "border-gray-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]",
                          "px-4 text-sm placeholder-transparent transition-all duration-300",
                          "focus:border-orange-500 focus:shadow-lg focus:ring-4 focus:ring-orange-100",
                          "hover:border-orange-300 hover:shadow-md",
                          "pr-11",
                          dir === "ltr" ? "pl-11" : "pl-11",
                        ].join(" ")}
                      />
                      <label
                        className={[
                          "pointer-events-none absolute -top-2 z-10 rounded-full bg-white px-2 text-xs font-medium",
                          "text-gray-500 transition-all duration-300",
                          dir === "ltr" ? "left-3" : "right-3",
                          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
                          "peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-gray-400",
                          dir === "ltr"
                            ? "peer-placeholder-shown:left-11"
                            : "peer-placeholder-shown:right-11",
                          "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:scale-105 peer-focus:bg-white peer-focus:px-2 peer-focus:text-orange-600",
                        ].join(" ")}
                      >
                        {t("register.confirmPassword", "تأكيد كلمة المرور")}
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
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        className={[
                          "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                          dir === "ltr" ? "right-3" : "left-3",
                        ].join(" ")}
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* User Role */}
                  <div>
                    <div className="relative">
                      <select
                        value={userRole}
                        onChange={(e) =>
                          setUserRole(e.target.value as "CLIENT" | "ARTISAN")
                        }
                        className={[
                          "peer h-12 w-full appearance-none rounded-xl border bg-white/80 backdrop-blur",
                          "border-gray-200 text-sm transition-all duration-300",
                          "focus:border-orange-500 focus:shadow-lg focus:ring-4 focus:ring-orange-100",
                          "hover:border-orange-300 hover:shadow-md",
                          dir === "ltr" ? "pr-10 pl-11" : "pr-11 pl-10",
                        ].join(" ")}
                      >
                        <option value="CLIENT">
                          {t("register.userTypes.client", "عميل")}
                        </option>
                        <option value="ARTISAN">
                          {t("register.userTypes.artisan", "حرفي")}
                        </option>
                      </select>
                      <label
                        className={[
                          "pointer-events-none absolute -top-2 z-10 rounded-full bg-white px-2 text-xs font-medium text-gray-500",
                          dir === "ltr" ? "left-3" : "right-3",
                          "transition-all peer-focus:text-orange-600",
                        ].join(" ")}
                      >
                        {t("register.userType", "نوع المستخدم")}
                      </label>
                      <Users
                        size={18}
                        className={[
                          "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors",
                          dir === "ltr" ? "left-3" : "right-3",
                          "text-gray-400 peer-focus:text-orange-500",
                        ].join(" ")}
                      />
                      <ChevronDown
                        size={18}
                        className={[
                          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400",
                          dir === "ltr" ? "right-3" : "left-3",
                        ].join(" ")}
                      />
                    </div>
                    {errors.role && (
                      <p className="mt-1 text-xs text-red-600">{errors.role}</p>
                    )}
                  </div>

                  {/* Agreement */}
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        id="agree"
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <label htmlFor="agree" className="text-sm text-gray-700">
                        {t(
                          "register.agree",
                          "أوافق على الشروط والأحكام وسياسة الخصوصية",
                        )}
                      </label>
                    </div>
                    {errors.agree && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.agree}
                      </p>
                    )}
                  </div>

                  {/* Submit + Login */}
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-orange-700 hover:to-amber-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading && (
                        <Loader2 size={18} className="animate-spin" />
                      )}
                      {t("register.submit", "إنشاء الحساب")}
                    </button>

                    <div className="text-center">
                      <span className="text-sm text-gray-600">
                        {t("register.hasAccount", "لديك حساب بالفعل؟")}{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="font-semibold text-orange-600 hover:text-orange-700"
                        >
                          {t("register.loginLink", "تسجيل الدخول")}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
