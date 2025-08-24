import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function NotFoundPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("notfound.tabTitle");
  }, [t]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-4 text-center"
      aria-label={t("notfound.aria")}
    >
      <h1 className="mb-4 text-6xl font-extrabold text-orange-600">404</h1>
      <h2 className="mb-2 text-2xl font-bold text-gray-800">
        {t("notfound.title")}
      </h2>
      <p className="mb-6 text-gray-600">{t("notfound.message")}</p>
      <Link
        to="/"
        className="inline-block rounded-md bg-orange-500 px-6 py-2 text-white transition hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
      >
        {t("notfound.button")}
      </Link>
    </main>
  );
}
