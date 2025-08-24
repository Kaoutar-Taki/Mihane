import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="from-primary to-secondary relative overflow-hidden bg-gradient-to-r py-16">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-white blur-2xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full bg-white blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl leading-tight font-bold text-white md:text-4xl">
            {t("landing.cta.title")}
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            {t("landing.cta.subtitle")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="group text-primary inline-flex transform items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-xl"
            >
              {t("landing.cta.button")}
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/profiles"
              className="hover:text-primary inline-flex items-center justify-center rounded-xl border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white"
            >
              {t("navbar.profiles")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
