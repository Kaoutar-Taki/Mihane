import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Home, ArrowLeft, Search, Compass } from "lucide-react";

export default function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir() as "rtl" | "ltr";

  useEffect(() => {
    document.title = t("notfound.tabTitle");
  }, [t]);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"
      aria-label={t("notfound.aria")}
      dir={dir}
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-orange-200/20 to-amber-200/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-amber-200/30 to-yellow-200/30 blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 animate-bounce">
          <h1 className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-8xl font-black text-transparent md:text-9xl">
            404
          </h1>
        </div>

        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-xl backdrop-blur">
          <Search size={40} className="text-orange-600" />
        </div>

        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          {t("notfound.title")}
        </h2>

        <p className="mb-8 max-w-md text-lg text-gray-700">
          {t("notfound.message")}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-orange-700 hover:to-amber-700 hover:shadow-xl"
          >
            <Home size={20} />
            <span>{t("notfound.button")}</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-orange-200 bg-white/80 px-8 py-4 text-lg font-semibold text-orange-700 backdrop-blur transition-all duration-300 hover:border-orange-300 hover:bg-orange-50"
          >
            <ArrowLeft
              size={20}
              className={dir === "rtl" ? "rotate-180" : ""}
            />
            <span>{t("notfound.goBack", "العودة للخلف")}</span>
          </button>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link
            to="/"
            className="group rounded-xl border border-orange-100 bg-white/60 p-4 text-center backdrop-blur transition-all duration-300 hover:border-orange-200 hover:bg-white/80 hover:shadow-md"
          >
            <Home size={24} className="mx-auto mb-2 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("navbar.home", "الرئيسية")}
            </span>
          </Link>

          <Link
            to="/professions"
            className="group rounded-xl border border-orange-100 bg-white/60 p-4 text-center backdrop-blur transition-all duration-300 hover:border-orange-200 hover:bg-white/80 hover:shadow-md"
          >
            <Compass size={24} className="mx-auto mb-2 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("navbar.professions", "المهن")}
            </span>
          </Link>

          <Link
            to="/profiles"
            className="group rounded-xl border border-orange-100 bg-white/60 p-4 text-center backdrop-blur transition-all duration-300 hover:border-orange-200 hover:bg-white/80 hover:shadow-md"
          >
            <Search size={24} className="mx-auto mb-2 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("navbar.profiles", "الحرفيون")}
            </span>
          </Link>

          <Link
            to="/contact"
            className="group rounded-xl border border-orange-100 bg-white/60 p-4 text-center backdrop-blur transition-all duration-300 hover:border-orange-200 hover:bg-white/80 hover:shadow-md"
          >
            <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {t("navbar.contact", "اتصل بنا")}
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
