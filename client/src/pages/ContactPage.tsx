import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";
import {
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle,
  User,
  Instagram,
  Facebook,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

type Topic = "general" | "support" | "partnership" | "report";

type IconCmp = React.ComponentType<{ size?: number; className?: string }>;

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
        {Icon && (
          <span className="pointer-events-none absolute top-1/2 -translate-y-1/2">
            <Icon size={18} className="text-gray-400" />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={[
            "peer h-12 w-full rounded-xl border bg-white/80 backdrop-blur",
            "border-gray-200 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]",
            "px-4 text-sm placeholder-transparent transition-all duration-300",
            "focus:border-orange-500 focus:shadow-lg focus:ring-4 focus:ring-orange-100",
            "hover:border-orange-300 hover:shadow-md",
            dir === "ltr"
              ? Icon
                ? "pr-4 pl-11"
                : "px-4"
              : Icon
                ? "pr-11 pl-4"
                : "px-4",
          ].join(" ")}
        />
        {Icon && (
          <div
            className={[
              "absolute top-1/2 -translate-y-1/2 text-gray-400",
              dir === "ltr" ? "left-3" : "right-3",
            ].join(" ")}
          />
        )}
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
              "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors",
              dir === "ltr" ? "left-3" : "right-3",
              "text-gray-400 peer-focus:text-orange-500",
            ].join(" ")}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function FloatTextarea({
  value,
  onChange,
  placeholder,
  error,
  dir,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string | undefined;
  Icon?: IconCmp;
  error?: string;
  dir: "rtl" | "ltr";
}) {
  return (
    <div>
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          rows={6}
          placeholder={placeholder}
          className={[
            "peer w-full rounded-xl border bg-white/80 backdrop-blur",
            "border-gray-200 px-4 py-3 text-sm placeholder-transparent transition-all duration-300",
            "focus:border-orange-500 focus:shadow-lg focus:ring-4 focus:ring-orange-100",
            "resize-none hover:border-orange-300 hover:shadow-md",
          ].join(" ")}
        />
        <label
          className={[
            "pointer-events-none absolute -top-2 z-10 rounded-full bg-white px-2 text-xs font-medium text-gray-500",
            dir === "ltr" ? "left-3" : "right-3",
            "transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent",
            "peer-placeholder-shown:px-0 peer-placeholder-shown:text-gray-400",
            "peer-focus:-top-2 peer-focus:bg-white peer-focus:px-2 peer-focus:text-orange-600",
          ].join(" ")}
        >
          {placeholder}
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function FloatSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  Icon,
  error,
  dir,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  placeholder: string | undefined;
  Icon?: IconCmp;
  error?: string;
  dir: "rtl" | "ltr";
}) {
  return (
    <div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className={[
            "peer h-12 w-full appearance-none rounded-xl border bg-white/80 backdrop-blur",
            "border-gray-200 text-sm transition-all duration-300",
            "focus:border-orange-500 focus:shadow-lg focus:ring-4 focus:ring-orange-100",
            "hover:border-orange-300 hover:shadow-md",
            dir === "ltr"
              ? Icon
                ? "pr-10 pl-11"
                : "pr-10 pl-4"
              : Icon
                ? "pr-11 pl-10"
                : "pr-4 pl-10",
          ].join(" ")}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <label
          className={[
            "pointer-events-none absolute -top-2 z-10 rounded-full bg-white px-2 text-xs font-medium text-gray-500",
            dir === "ltr" ? "left-3" : "right-3",
            "transition-all peer-focus:text-orange-600",
          ].join(" ")}
        >
          {placeholder}
        </label>

        {Icon && (
          <Icon
            size={18}
            className={[
              "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors",
              dir === "ltr" ? "left-3" : "right-3",
              "text-gray-400 peer-focus:text-orange-500",
            ].join(" ")}
          />
        )}
        <ChevronDown
          size={18}
          className={[
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400",
            dir === "ltr" ? "right-3" : "left-3",
          ].join(" ")}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir() as "rtl" | "ltr";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState<Topic>("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [messageLength, setMessageLength] = useState(0);

  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValid(email ? isValid : null);
    return isValid;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t("contact.form.errors.name");
    if (!email.trim() || !validateEmail(email))
      e.email = t("contact.form.errors.email");
    if (!subject.trim()) e.subject = t("contact.form.errors.subject");
    if (!message.trim() || message.trim().length < 10)
      e.message = t("contact.form.errors.message");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    setName("");
    setEmail("");
    setPhone("");
    setTopic("general");
    setSubject("");
    setMessage("");
    setErrors({});
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <section className="relative overflow-hidden py-14">
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/3 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />
          </div>
          <div className="relative z-10 container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 w-fit rounded-full border border-white/60 bg-white/70 px-5 py-2 shadow backdrop-blur">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                    <MessageCircle size={14} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {t("contact.badge")}
                  </span>
                </div>
              </div>
              <h1 className="mb-3 text-4xl font-black tracking-tight text-orange-900 md:text-5xl">
                {t("contact.title")}
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-700">
                {t("contact.subtitle")}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-5xl">
            {sent ? (
              <div className="rounded-2xl border border-emerald-200 bg-white/80 p-10 text-center shadow-lg backdrop-blur">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h2 className="mb-1 text-2xl font-bold text-gray-900">
                  {t("contact.success.title")}
                </h2>
                <p className="mb-6 text-gray-600">
                  {t("contact.success.message")}
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow hover:bg-orange-700"
                >
                  <Send size={18} />
                  {t("contact.success.button")}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur">
                <div className="border-b border-gray-100 px-8 py-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {t("contact.form.title")}
                  </h2>
                </div>

                <form
                  onSubmit={onSubmit}
                  dir={dir}
                  className="space-y-6 px-8 py-8"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FloatInput
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("contact.form.namePlaceholder")}
                      Icon={User}
                      error={errors?.name}
                      dir={dir}
                    />
                    <div className="relative">
                      <FloatInput
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          validateEmail(e.target.value);
                        }}
                        placeholder={t("contact.form.emailPlaceholder")}
                        Icon={Mail}
                        error={errors?.email}
                        dir={dir}
                      />
                      {email && emailValid !== null && (
                        <div
                          className={`absolute ${dir === "ltr" ? "right-3" : "left-3"} top-3 transition-all duration-300`}
                        >
                          {emailValid ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                              <CheckCircle
                                size={14}
                                className="text-green-600"
                              />
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                              <span className="text-xs text-red-600">✕</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FloatInput
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={`${t("contact.form.phonePlaceholder")} (${t("contact.form.optional")})`}
                      Icon={Phone}
                      dir={dir}
                    />
                    <FloatSelect<Topic>
                      value={topic}
                      onChange={(v) => setTopic(v)}
                      options={[
                        {
                          value: "general",
                          label: t("contact.form.topics.general") as string,
                        },
                        {
                          value: "support",
                          label: t("contact.form.topics.support") as string,
                        },
                        {
                          value: "partnership",
                          label: t("contact.form.topics.partnership") as string,
                        },
                        {
                          value: "report",
                          label: t("contact.form.topics.report") as string,
                        },
                      ]}
                      placeholder={t("contact.form.topic")}
                      Icon={MessageCircle}
                      dir={dir}
                    />
                  </div>

                  <FloatInput
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t("contact.form.subjectPlaceholder")}
                    Icon={MessageCircle}
                    error={errors?.subject}
                    dir={dir}
                  />

                  <div className="relative">
                    <FloatTextarea
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setMessageLength(e.target.value.length);
                      }}
                      placeholder={t("contact.form.messagePlaceholder")}
                      Icon={MessageCircle}
                      error={errors?.message}
                      dir={dir}
                    />
                    <div
                      className={`absolute bottom-2 ${dir === "ltr" ? "right-3" : "left-3"} text-xs transition-all duration-300 ${
                        messageLength < 10
                          ? "text-red-500"
                          : messageLength > 500
                            ? "text-orange-500"
                            : "text-green-600"
                      }`}
                    >
                      {messageLength}/500
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:from-orange-700 hover:to-amber-700 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>{t("contact.form.loading")}</span>
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          <span>{t("contact.form.submit")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-8 text-center shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                <Mail size={28} className="text-orange-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {t("contact.info.email")}
              </h3>
              <a
                href="mailto:info@platform.ma"
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                info@platform.ma
              </a>
              <p className="mt-2 text-sm text-gray-500">
                {t("contact.info.emailDesc")}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/70 p-8 text-center shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <Phone size={28} className="text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {t("contact.info.phone")}
              </h3>
              <a
                href="tel:+212600000000"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                +212 6 00 00 00 00
              </a>
              <p className="mt-2 text-sm text-gray-500">
                {t("contact.info.phoneDesc")}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/70 p-8 text-center shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100">
                <Instagram size={28} className="text-pink-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Instagram
              </h3>
              <a
                href="https://instagram.com/platform_ma"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-pink-600 hover:text-pink-700"
              >
                @platform_ma
              </a>
              <p className="mt-2 text-sm text-gray-500">
                {t("contact.social.instagramDesc")}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/70 p-8 text-center shadow">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <Facebook size={28} className="text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Facebook
              </h3>
              <a
                href="https://facebook.com/platform.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Platform MA
              </a>
              <p className="mt-2 text-sm text-gray-500">
                {t("contact.social.facebookDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
