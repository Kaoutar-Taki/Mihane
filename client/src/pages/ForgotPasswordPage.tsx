import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const dir = i18n.dir();
  const padX = dir === "rtl" ? "pl-10 pr-3" : "pr-10 pl-3";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-16">
        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              {t("login.forgot")}
            </h1>
            <p className="mb-6 text-sm text-gray-600">
              {t("login.resetInstruction")}
            </p>

            {sent ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                {t("login.resetSent")}
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${padX}`}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-700"
                >
                  {t("common.submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
