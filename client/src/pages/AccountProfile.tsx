import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "../auth/AuthContext";
import MainLayout from "./layouts/MainLayout";
import {
  getStoredAuth,
} from "../services/auth";
import {
  getProfile,
  updateProfile,
  type UpdateProfileInput,
  getGenders,
  type Gender,
  resolveAssetUrl,
} from "../services/profile";
import { changePassword, type ChangePasswordInput } from "../services/profile";

export default function AccountProfile() {
  const { user: authUser } = useAuth();
  const isSuperAdmin = authUser?.role === "SUPER_ADMIN";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState<UpdateProfileInput>({
    name: "",
    name_ar: "",
    email: "",
    phone: "",
    bio: "",
    bio_ar: "",
    avatar: "",
    gender_id: null,
    avatarFile: null,
  });
  const [genders, setGenders] = useState<Gender[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Password change state (SUPER_ADMIN only UI)
  const [pwForm, setPwForm] = useState<ChangePasswordInput>({ current_password: "", password: "", password_confirmation: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [pwSaving, setPwSaving] = useState(false);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        const auth = getStoredAuth();
        if (!auth) {
          setError("المرجو تسجيل الدخول");
          return;
        }
        const me = await getProfile(auth.token);
        const meExtra: Partial<Pick<UpdateProfileInput, "name_ar" | "bio_ar" | "gender_id">> = me as unknown as Partial<Pick<UpdateProfileInput, "name_ar" | "bio_ar" | "gender_id">>;
        setForm({
          name: me.name ?? "",
          name_ar: meExtra.name_ar ?? "",
          email: me.email ?? "",
          phone: me.phone ?? "",
          bio: me.bio ?? "",
          bio_ar: meExtra.bio_ar ?? "",
          avatar: me.avatar ?? "",
          gender_id: meExtra.gender_id ?? null,
          avatarFile: null,
        });
        setAvatarPreview(resolveAssetUrl(me.avatar ?? null));
        try {
          const list = await getGenders();
          setGenders(list);
        } catch {
          /*  */
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "خطأ أثناء جلب البيانات";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const validatePassword = (data: ChangePasswordInput) => {
    const errs: Record<string, string> = {};
    if (!data.password || data.password.length < 8) errs.password = "كلمة السر يجب أن تكون على الأقل 8 أحرف";
    if (data.password !== data.password_confirmation) errs.password_confirmation = "تأكيد كلمة السر غير مطابق";
    return errs;
  };

  const onSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwErrors({});
    setError(null);
    setMessage(null);
    const errs = validatePassword(pwForm);
    if (Object.keys(errs).length) {
      setPwErrors(errs);
      return;
    }
    try {
      setPwSaving(true);
      await changePassword(pwForm);
      setMessage("تم تحديث كلمة السر بنجاح");
      setPwForm({ current_password: "", password: "", password_confirmation: "" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "تعذر تغيير كلمة السر";
      setError(msg);
    } finally {
      setPwSaving(false);
    }
  };

  const setField = <K extends keyof UpdateProfileInput>(key: K, value: UpdateProfileInput[K]) =>
    setForm((p) => ({ ...p, [key]: value } as UpdateProfileInput));

  const onChange =
    (key: keyof UpdateProfileInput) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setField(key, e.target.value);
        if (fieldErrors[key as string]) {
          const next = { ...fieldErrors };
          delete next[key as string];
          setFieldErrors(next);
        }
      };

  const onGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : null;
    setField("gender_id", val);
  };

  const validate = (data: UpdateProfileInput) => {
    const errors: Record<string, string> = {};
    if (!data.name?.trim()) errors.name = "الإسم مطلوب";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "صيغة البريد غير صحيحة";
    if (data.phone && !/^\+?[0-9\s-]{6,}$/.test(data.phone)) errors.phone = "رقم الهاتف غير صالح";
    if ((data.bio || "").length > 400) errors.bio = "النبذة طويلة جدًا (أقصى 400 حرف)";
    if ((data.bio_ar || "").length > 400) errors.bio_ar = "النبذة طويلة جدًا (أقصى 400 حرف)";
    return errors;
  };

  const onAvatarFile = (file: File | null) => {
    setField("avatarFile", file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const onAvatarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return onAvatarFile(null);
    if (file.size > 2 * 1024 * 1024) {
      setError("حجم الصورة كبير (الحد 2MB)");
      return;
    }
    if (!/^image\//.test(file.type)) {
      setError("صيغة الملف غير مدعومة");
      return;
    }
    setError(null);
    onAvatarFile(file);
  };

  const onAvatarDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return setError("حجم الصورة كبير (الحد 2MB)");
    if (!/^image\//.test(file.type)) return setError("صيغة الملف غير مدعومة");
    setError(null);
    onAvatarFile(file);
  };

  const removeAvatar = () => {
    setField("avatarFile", null);
    setField("avatar", "");
    setAvatarPreview(null);
    if (inputFileRef.current) inputFileRef.current.value = "";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    try {
      setSaving(true);
      const auth = getStoredAuth();
      if (!auth) throw new Error("المرجو تسجيل الدخول");

      const updated = await updateProfile(form, auth.token);

      const storedRaw = localStorage.getItem("auth") || sessionStorage.getItem("auth");
      if (storedRaw) {
        const parsed = JSON.parse(storedRaw);
        parsed.user = { ...parsed.user, ...updated };
        if (localStorage.getItem("auth")) localStorage.setItem("auth", JSON.stringify(parsed));
        if (sessionStorage.getItem("auth")) sessionStorage.setItem("auth", JSON.stringify(parsed));
        window.dispatchEvent(new StorageEvent("storage"));
      }
      setAvatarPreview(resolveAssetUrl(updated.avatar ?? null));
      setMessage("تم حفظ التغييرات بنجاح");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "تعذر حفظ التغييرات";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const bioCount = useMemo(() => (form.bio?.length ?? 0), [form.bio]);
  const bioArCount = useMemo(() => (form.bio_ar?.length ?? 0), [form.bio_ar]);
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("settings");
  const completion = useMemo(() => {
    const baseChecks = [
      !!(form.name && form.name.trim()),
      !!(form.email && form.email.trim()),
      !!(form.phone && form.phone.trim()),
      !!(avatarPreview || form.avatar),
    ];
    const extraChecks = isSuperAdmin
      ? []
      : [!!(form.bio && form.bio.trim()), !!(form.gender_id)];
    const checks = [...baseChecks, ...extraChecks];
    const score = checks.reduce((a, b) => a + (b ? 1 : 0), 0);
    return Math.round((score / Math.max(checks.length, 1)) * 100);
  }, [isSuperAdmin, form.name, form.email, form.phone, form.bio, form.gender_id, form.avatar, avatarPreview]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] grid place-items-center">
          <div className="w-full max-w-md animate-pulse rounded-2xl bg-white/60 p-6 shadow backdrop-blur">
            <div className="mb-4 h-6 w-1/2 rounded bg-gray-200" />
            <div className="mb-2 h-4 w-1/3 rounded bg-gray-200" />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="h-11 rounded bg-gray-200" />
              <div className="h-11 rounded bg-gray-200" />
              <div className="col-span-2 h-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative isolate bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_0%_0%,rgba(251,146,60,0.12),transparent_45%),radial-gradient(800px_circle_at_100%_0%,rgba(245,158,11,0.12),transparent_45%)]" />
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-orange-900">الملف الشخصي</h1>
              <p className="mt-1 text-sm text-gray-600">عدل معلوماتك وخلّي بروفايلك أكثر احترافية</p>
            </div>
          </div>

          <SummaryHeader
            name={form.name || ""}
            email={form.email || ""}
            avatarUrl={avatarPreview || resolveAssetUrl(form.avatar || null) || undefined}
            completion={completion}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isSuperAdmin={isSuperAdmin}
          />

          {activeTab === "settings" && (
          <div className={`my-6 grid grid-cols-1 gap-6 md:grid-cols-3` + (isSuperAdmin ? "md:col-span-2" : "")}>
            <div className="md:col-span-2 rounded-2xl border border-orange-200/60 bg-white/80 p-4 shadow backdrop-blur">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-md">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">لا صورة</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">تحديث الصورة</p>
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onAvatarDrop}
                    className={
                      "mt-2 block cursor-pointer rounded-xl border-2 border-dashed p-4 text-center text-sm transition " +
                      (dragOver ? "border-orange-400 bg-orange-50/60" : "border-gray-300 hover:bg-gray-50")
                    }
                  >
                    إسحب وأفلت الصورة هنا أو <span className="font-semibold text-orange-700">اختر من جهازك</span>
                    <input
                      ref={inputFileRef}
                      type="file"
                      accept="image/*"
                      onChange={onAvatarInput}
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-2 text-[12px] text-gray-500">PNG/JPG • الحد الأقصى 2MB</p>
                  {(form.avatarFile || avatarPreview) && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      إزالة الصورة
                    </button>
                  )}
                </div>
              </div>
            </div>
            {
              !isSuperAdmin && <InfoCard
              title="نصائح سريعة"
              items={[
                "اختر صورة واضحة وبخلفية بسيطة",
                "اكتب نبذة مختصرة وجذابة (≤ 400 حرف)",
                "تأكد من صحة البريد ورقم الهاتف",
                "أضف اسمك بالعربية لتسهيل البحث",
                "اكتب مهاراتك وخبراتك في النبذة",
                "تأكد من حفظ التغييرات قبل المغادرة",
              ]}
            />}
          </div>
          )}
        </div>
      </div>

      <div className="relative -mt-10 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          {error && (
            <Alert tone="error" text={error} onClose={() => setError(null)} />
          )}
          {message && (
            <Alert tone="success" text={message} onClose={() => setMessage(null)} />
          )}

          {activeTab === "overview" ? (
            <Card title="تفاصيل الحساب">
              <DetailsList
                items={
                  isSuperAdmin
                    ? [
                        { label: "الإسم الكامل", value: form.name || "—" },
                        { label: "البريد الإلكتروني", value: form.email || "—" },
                        { label: "الهاتف", value: form.phone || "—" },
                      ]
                    : [
                        { label: "الإسم الكامل", value: form.name || "—" },
                        { label: "البريد الإلكتروني", value: form.email || "—" },
                        { label: "الهاتف", value: form.phone || "—" },
                        { label: "الجنس", value: genders.find((g) => g.id === form.gender_id)?.name_ar || "—" },
                        { label: "نبذة", value: form.bio || "—" },
                        { label: "نبذة بالعربية", value: form.bio_ar || "—" },
                      ]
                }
              />
            </Card>
          ) : (
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className={`space-y-6 ${isSuperAdmin ? "lg:col-span-3" : "lg:col-span-2"}`}>
              <Card title="المعلومات الأساسية">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    id="name"
                    label="الإسم الكامل"
                    value={form.name || ""}
                    onChange={onChange("name")}
                    error={fieldErrors.name}
                    maxLength={120}
                  />
                  <Field
                    id="name_ar"
                    label="الإسم بالعربية"
                    value={form.name_ar || ""}
                    onChange={onChange("name_ar")}
                    dir="rtl"
                    maxLength={120}
                  />
                  <Field
                    id="email"
                    type="email"
                    label="البريد الإلكتروني"
                    value={form.email || ""}
                    onChange={onChange("email")}
                    error={fieldErrors.email}
                    inputMode="email"
                    dir="ltr"
                  />
                  <Field
                    id="phone"
                    label="الهاتف"
                    value={form.phone || ""}
                    onChange={onChange("phone")}
                    error={fieldErrors.phone}
                    inputMode="tel"
                    placeholder="مثال: +212 6••••••••"
                  />
                </div>
              </Card>

              {!isSuperAdmin && (
                <Card title="نبذة عنك">
                  <div className="grid grid-cols-1 gap-4">
                    <TextArea
                      id="bio"
                      label="نبذة"
                      value={form.bio || ""}
                      onChange={onChange("bio")}
                      error={fieldErrors.bio}
                      rows={5}
                      counter={`${bioCount}/400`}
                      maxLength={400}
                    />
                    <TextArea
                      id="bio_ar"
                      label="نبذة بالعربية"
                      value={form.bio_ar || ""}
                      onChange={onChange("bio_ar")}
                      error={fieldErrors.bio_ar}
                      dir="rtl"
                      rows={5}
                      counter={`${bioArCount}/400`}
                      maxLength={400}
                    />
                  </div>
                </Card>
              )}

              <Card title="تغيير كلمة السر">
                <form onSubmit={onSubmitPassword} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    id="current_password"
                    type="password"
                    label="كلمة السر الحالية (إن وُجدت)"
                    value={pwForm.current_password || ""}
                    onChange={(e) => setPwForm((p) => ({ ...p, current_password: e.target.value }))}
                  />
                  <Field
                    id="password"
                    type="password"
                    label="كلمة السر الجديدة"
                    value={pwForm.password}
                    onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
                    error={pwErrors.password}
                  />
                  <Field
                    id="password_confirmation"
                    type="password"
                    label="تأكيد كلمة السر الجديدة"
                    value={pwForm.password_confirmation}
                    onChange={(e) => setPwForm((p) => ({ ...p, password_confirmation: e.target.value }))}
                    error={pwErrors.password_confirmation}
                  />

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={pwSaving}
                      className="inline-flex items-center gap-2 rounded-xl border px-5 py-2 font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                    >
                      {pwSaving ? "يحفظ…" : "تغيير كلمة السر"}
                    </button>
                  </div>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              {!isSuperAdmin && (
                <Card title="معلومات إضافية">
                  <Select
                    id="gender"
                    label="الجنس"
                    value={form.gender_id ?? ""}
                    onChange={onGenderChange}
                    options={[{ value: "", label: "— اختر —" }, ...genders.map((g) => ({ value: String(g.id), label: g.name_ar }))]}
                  />
                </Card>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="sticky bottom-4 z-10 flex w-full justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-7 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:from-orange-700 hover:to-amber-700 disabled:opacity-60"
                >
                  {saving ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                      كيحفظ…
                    </span>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </button>
              </div>
            </div>
        </form>
        )}
        </div>
      </div>
    </MainLayout>
  );
}

function SummaryHeader({
  name,
  email,
  avatarUrl,
  completion,
  activeTab,
  onTabChange,
  isSuperAdmin,
}: {
  name: string;
  email: string;
  avatarUrl?: string;
  completion: number;
  activeTab: "overview" | "settings";
  onTabChange: (t: "overview" | "settings") => void;
  isSuperAdmin: boolean;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-orange-200/60 bg-gradient-to-br from-white to-orange-50/50 p-5 shadow-sm">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl shadow ring-2 ring-white">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-orange-50 text-sm text-orange-700">لا صورة</div>
            )}
            <span className="pointer-events-none absolute -inset-[2px] rounded-2xl ring-1 ring-orange-200/70" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">{name || "—"}</h2>
            <p className="text-sm text-gray-600">{email || "—"}</p>
          </div>
        </div>
       {
        !isSuperAdmin &&
        <div className="min-w-[240px]">
          <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
            <span>إكتمال الملف</span>
            <span className="font-semibold text-emerald-700">{completion}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${Math.min(Math.max(completion, 0), 100)}%` }} />
          </div>
        </div>}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-3 text-sm">
        <button
          type="button"
          onClick={() => onTabChange("overview")}
          className={`rounded-full px-4 py-1.5 ${activeTab === "overview" ? "bg-orange-600 text-white shadow-sm" : "text-gray-700 hover:bg-orange-100/60"}`}
        >
          نظرة عامة
        </button>
        <button
          type="button"
          onClick={() => onTabChange("settings")}
          className={`rounded-full px-4 py-1.5 ${activeTab === "settings" ? "bg-orange-600 text-white shadow-sm" : "text-gray-700 hover:bg-orange-100/60"}`}
        >
          الإعدادات
        </button>
      </div>
    </div>
  );
}

function DetailsList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="divide-y rounded-xl border">
      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-3">
          <div className="text-sm text-gray-500">{it.label}</div>
          <div className="sm:col-span-2 text-sm font-medium text-gray-900">{it.value}</div>
        </div>
      ))}
    </div>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-orange-200/60 bg-white/90 p-6 shadow-sm">
      {title && <h2 className="mb-4 text-lg font-bold text-gray-900">{title}</h2>}
      {children}
    </section>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-orange-200/60 bg-white/90 p-4 shadow-sm">
      <h3 className="mb-3 text-base font-bold text-orange-900">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg className="mt-0.5 size-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Field(
  {
    id,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    error,
    inputMode,
    dir,
    maxLength,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    error?: string;
    inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
    dir?: "rtl" | "ltr" | "auto";
    maxLength?: number;
  }
) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        inputMode={inputMode}
        dir={dir}
        maxLength={maxLength}
        className={
          "w-full h-11 rounded-lg border px-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 " +
          (error ? "border-red-300" : "border-gray-300")
        }
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function TextArea(
  {
    id,
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    error,
    dir,
    counter,
    maxLength,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    error?: string;
    dir?: "rtl" | "ltr" | "auto";
    counter?: string;
    maxLength?: number;
  }
) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
        {counter && <span className="text-[11px] text-gray-500">{counter}</span>}
      </div>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        dir={dir}
        maxLength={maxLength}
        className={
          "w-full rounded-lg border px-3 py-2 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 " +
          (error ? "border-red-300" : "border-gray-300")
        }
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Select(
  {
    id,
    label,
    value,
    onChange,
    options,
  }: {
    id: string;
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string | number; label: string }[];
  }
) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Alert({ tone, text, onClose }: { tone: "success" | "error" | "info"; text: string; onClose?: () => void }) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-blue-200 bg-blue-50 text-blue-700";
  return (
    <div className={`mb-4 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm shadow-sm ${styles}`}>
      <span>{text}</span>
      {onClose && (
        <button onClick={onClose} className="text-xs underline underline-offset-2">
          إغلاق
        </button>
      )}
    </div>
  );
}
